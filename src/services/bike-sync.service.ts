// Motorcycle synchronisation engine.
//
// Imports motorcycle INFORMATION from an authorised provider and upserts it into
// the BikeModel / BikeVariant / BikeColour / BikeImage layer.
//
// Guarantees:
//   * Never deletes existing records (no delete calls anywhere in this file).
//   * Never touches BikePricing or BikePriceHistory (not imported/used here).
//   * Duplicate detection by (providerId, externalId) with a canonical-slug fallback.
//   * Field-level updates only — unchanged rows are counted, not rewritten.
//   * One transaction per model so a partial failure rolls back only that model.
//   * Transient provider failures retried with exponential backoff.
//   * Every provider request and sync error is logged.
//
// Provider DTOs contain no price fields, so no pricing can be imported.

import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';
import { getProvider, listProviders } from '@/services/bike-provider/registry';
import { RateLimiter } from '@/services/bike-provider/rate-limiter';
import {
  ProviderError,
  ProviderNotConfiguredError,
  ProviderTransientError,
} from '@/services/bike-provider/errors';
import type {
  MotorcycleDataProvider,
  ProviderCatalog,
  ProviderContext,
  ProviderModel,
  ProviderRequestRecord,
  ProviderVariant,
} from '@/services/bike-provider/types';

const MAX_RETRIES = Math.max(0, Number(process.env.BIKE_SYNC_MAX_RETRIES ?? 3));
const RETRY_BASE_MS = Math.max(1, Number(process.env.BIKE_SYNC_RETRY_BASE_MS ?? 250));

export interface SyncActor {
  id?: string | null | undefined;
  name?: string | null | undefined;
}

export interface RunSyncOptions {
  providerCode: string;
  trigger: 'SCHEDULED' | 'MANUAL';
  actor?: SyncActor;
  force?: boolean;
}

export interface SyncRunResult {
  runId: string;
  providerCode: string;
  status: 'SUCCESS' | 'PARTIAL' | 'FAILED';
  modelsSeen: number;
  modelsCreated: number;
  modelsUpdated: number;
  modelsUnchanged: number;
  variantsSeen: number;
  variantsCreated: number;
  variantsUpdated: number;
  coloursSeen: number;
  imagesSeen: number;
  errorCount: number;
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 150);
}

/** Ensure a DataProvider row exists for a registered provider implementation. */
export async function ensureProviderRow(provider: MotorcycleDataProvider) {
  return prisma.dataProvider.upsert({
    where: { code: provider.code },
    update: {
      name: provider.name,
      attributionText: provider.attribution(),
      baseUrl: process.env[`${provider.code.toUpperCase()}_API_BASE_URL`] ?? null,
      docsUrl: process.env[`${provider.code.toUpperCase()}_API_DOCS_URL`] ?? null,
    },
    create: {
      code: provider.code,
      name: provider.name,
      description: provider.requiresCredentials
        ? 'Authorised external motorcycle-information provider'
        : 'Development/test fixture provider',
      attributionText: provider.attribution(),
      credentialEnvPrefix: provider.code.toUpperCase(),
      requiresCredentials: provider.requiresCredentials,
      isEnabled: provider.isConfigured(),
      rateLimitPerMinute: Number(process.env.BIKE_PROVIDER_RATE_LIMIT_PER_MINUTE ?? 60),
    },
  });
}

/**
 * Wait (bounded) while the provider's DB-logged request rate exceeds its limit.
 * Complements the in-process token bucket so the limit holds across processes.
 */
async function enforceDbRateLimit(providerDbId: string, limit: number) {
  for (let attempt = 0; attempt < 5; attempt++) {
    const since = new Date(Date.now() - 60_000);
    const count = await prisma.bikeProviderRequest.count({
      where: { providerId: providerDbId, createdAt: { gte: since } },
    });
    if (count < limit) return;
    await sleep(1_000);
  }
}

async function fetchCatalogWithRetry(
  provider: MotorcycleDataProvider,
  context: ProviderContext,
): Promise<ProviderCatalog> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_RETRIES + 1; attempt++) {
    try {
      return await provider.fetchCatalog(context);
    } catch (error) {
      lastError = error;
      const retryable = error instanceof ProviderError ? error.retryable : false;
      if (!retryable || attempt > MAX_RETRIES) {
        throw error;
      }
      const backoff = RETRY_BASE_MS * 2 ** (attempt - 1);
      await context.log('WARN', `Provider attempt ${attempt} failed, retrying in ${backoff}ms`, {
        details: { error: error instanceof Error ? error.message : String(error) },
      });
      await sleep(backoff);
    }
  }
  throw lastError;
}

function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (a === null || a === undefined || b === null || b === undefined) return false;
  if (typeof a === 'number' || typeof b === 'number') return String(a) === String(b);
  if (typeof a === 'string' || typeof b === 'string') return String(a) === String(b);
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

/** Build a create/update payload + list of changed keys from a field map. */
function diffFields(
  existing: Record<string, unknown> | null,
  next: Record<string, unknown>,
): { data: Record<string, unknown>; changed: string[] } {
  const data: Record<string, unknown> = {};
  const changed: string[] = [];
  for (const [key, value] of Object.entries(next)) {
    if (value === undefined) continue;
    if (!existing) {
      data[key] = value;
      changed.push(key);
      continue;
    }
    const previous = existing[key];
    // Coerce Prisma Decimal / Json to comparable primitives.
    const comparablePrev =
      previous && typeof previous === 'object' && 'toString' in previous
        ? previous.toString()
        : previous;
    if (!isEqual(comparablePrev, value)) {
      data[key] = value;
      changed.push(key);
    }
  }
  return { data, changed };
}

function variantFields(v: ProviderVariant): Record<string, unknown> {
  return {
    name: v.name,
    engineCc: v.engineCc,
    powerBhp: v.powerBhp,
    powerKw: v.powerKw,
    torqueNm: v.torqueNm,
    mileageKmpl: v.mileageKmpl,
    fuelType: v.fuelType,
    fuelCapacityLitres: v.fuelCapacityLitres,
    transmission: v.transmission,
    transmissionGears: v.transmissionGears,
    coolingSystem: v.coolingSystem,
    topSpeedKmph: v.topSpeedKmph,
    kerbWeightKg: v.kerbWeightKg,
    seatHeightMm: v.seatHeightMm,
    groundClearanceMm: v.groundClearanceMm,
    wheelbaseMm: v.wheelbaseMm,
    lengthMm: v.lengthMm,
    widthMm: v.widthMm,
    heightMm: v.heightMm,
    frontBrake: v.frontBrake,
    rearBrake: v.rearBrake,
    absType: v.absType,
    frontSuspension: v.frontSuspension,
    rearSuspension: v.rearSuspension,
    features: v.features,
    specifications: v.specifications,
    description: v.description,
  };
}

interface ModelCounters {
  modelCreated: number;
  modelUpdated: number;
  modelUnchanged: number;
  variantsSeen: number;
  variantsCreated: number;
  variantsUpdated: number;
  coloursSeen: number;
  imagesSeen: number;
}

/** Resolve (or create) a Brand by slug, falling back to name match. */
async function resolveBrand(
  tx: Prisma.TransactionClient,
  brandName: string,
  brandSlug?: string,
): Promise<{ id: string }> {
  const slug = brandSlug ? slugify(brandSlug) : slugify(brandName);
  const bySlug = await tx.brand.findUnique({ where: { slug } });
  if (bySlug) return bySlug;
  const byName = await tx.brand.findFirst({ where: { name: brandName } });
  if (byName) return byName;
  return tx.brand.create({ data: { name: brandName, slug } });
}

/** Persist one model and its variants/colours/images in a single transaction. */
async function syncModel(
  provider: MotorcycleDataProvider,
  providerDbId: string,
  model: ProviderModel,
  context: ProviderContext,
): Promise<ModelCounters> {
  const counters: ModelCounters = {
    modelCreated: 0,
    modelUpdated: 0,
    modelUnchanged: 0,
    variantsSeen: 0,
    variantsCreated: 0,
    variantsUpdated: 0,
    coloursSeen: 0,
    imagesSeen: 0,
  };
  const attribution = provider.attribution();
  const modelSlug = slugify(model.slug || `${model.brandName}-${model.name}`);

  await prisma.$transaction(async (tx) => {
    const brand = await resolveBrand(tx, model.brandName, model.brandSlug);

    // Duplicate detection: prefer (providerId, externalId), then slug.
    let existing = model.externalId
      ? await tx.bikeModel.findFirst({
          where: { providerId: providerDbId, externalId: model.externalId },
        })
      : null;
    if (!existing) {
      existing = await tx.bikeModel.findUnique({ where: { slug: modelSlug } });
      if (existing && existing.providerId && existing.providerId !== providerDbId) {
        await context.log(
          'WARN',
          `Skipped "${model.name}": slug "${modelSlug}" belongs to another provider`,
          { entityType: 'MODEL', externalId: model.externalId, details: { modelSlug } },
        );
        return;
      }
    }

    const modelNext: Record<string, unknown> = {
      name: model.name,
      brandId: brand.id,
      providerId: providerDbId,
      externalId: model.externalId ?? null,
      slug: modelSlug,
      category: model.category,
      description: model.description,
      technicalDescription: model.technicalDescription,
      imageUrl: model.imageUrl,
      sourceAttribution: attribution,
    };

    let modelId: string;
    if (!existing) {
      const created = await tx.bikeModel.create({
        data: {
          ...(modelNext as Prisma.BikeModelUncheckedCreateInput),
          lastSyncedAt: new Date(),
        },
      });
      modelId = created.id;
      counters.modelCreated += 1;
    } else {
      const { data, changed } = diffFields(existing as Record<string, unknown>, modelNext);
      await tx.bikeModel.update({
        where: { id: existing.id },
        data: { ...data, lastSyncedAt: new Date() } as Prisma.BikeModelUncheckedUpdateInput,
      });
      modelId = existing.id;
      if (changed.length > 0) counters.modelUpdated += 1;
      else counters.modelUnchanged += 1;
    }

    // Model-level images (deduplicated by url; never deleted).
    counters.imagesSeen += await upsertImages(tx, providerDbId, { modelId }, model.images, attribution);

    for (const variant of model.variants) {
      counters.variantsSeen += 1;
      const result = await syncVariant(tx, providerDbId, modelId, variant, attribution);
      counters.variantsCreated += result.created ? 1 : 0;
      counters.variantsUpdated += !result.created && result.changed.length > 0 ? 1 : 0;
      counters.coloursSeen += result.coloursSeen;
      counters.imagesSeen += result.imagesSeen;
    }
  });

  return counters;
}

async function syncVariant(
  tx: Prisma.TransactionClient,
  providerDbId: string,
  modelId: string,
  variant: ProviderVariant,
  attribution: string,
): Promise<{ created: boolean; changed: string[]; coloursSeen: number; imagesSeen: number }> {
  let existing = variant.externalId
    ? await tx.bikeVariant.findFirst({
        where: { providerId: providerDbId, externalId: variant.externalId },
      })
    : null;
  if (!existing) {
    existing = await tx.bikeVariant.findFirst({ where: { modelId, name: variant.name } });
  }

  const next: Record<string, unknown> = {
    ...variantFields(variant),
    modelId,
    providerId: providerDbId,
    ...(variant.externalId ? { externalId: variant.externalId } : {}),
  };

  let variantId: string;
  let created: boolean;
  let changed: string[];
  if (!existing) {
    const createdRow = await tx.bikeVariant.create({
      data: { ...(next as Prisma.BikeVariantUncheckedCreateInput), lastSyncedAt: new Date() },
    });
    variantId = createdRow.id;
    created = true;
    changed = Object.keys(next);
  } else {
    const diff = diffFields(existing as Record<string, unknown>, next);
    await tx.bikeVariant.update({
      where: { id: existing.id },
      data: { ...diff.data, lastSyncedAt: new Date() } as Prisma.BikeVariantUncheckedUpdateInput,
    });
    variantId = existing.id;
    created = false;
    changed = diff.changed;
  }

  let coloursSeen = 0;
  for (const colour of variant.colours ?? []) {
    coloursSeen += 1;
    const existingColour = await tx.bikeColour.findFirst({
      where: { variantId, name: colour.name },
    });
    const colourData = {
      name: colour.name,
      hexCode: colour.hexCode ?? null,
      imageUrl: colour.imageUrl ?? null,
      providerId: providerDbId,
      externalId: colour.externalId ?? null,
      lastSyncedAt: new Date(),
    };
    if (existingColour) {
      await tx.bikeColour.update({ where: { id: existingColour.id }, data: colourData });
    } else {
      await tx.bikeColour.create({ data: { ...colourData, variantId } });
    }
  }

  const imagesSeen = await upsertImages(
    tx,
    providerDbId,
    { variantId },
    variant.images,
    attribution,
  );

  return { created, changed, coloursSeen, imagesSeen };
}

/** Insert images that don't already exist for the owning model/variant. Never deletes. */
async function upsertImages(
  tx: Prisma.TransactionClient,
  providerDbId: string,
  owner: { modelId: string } | { variantId: string },
  images: ProviderVariant['images'] | ProviderModel['images'],
  attribution: string,
): Promise<number> {
  if (!images || images.length === 0) return 0;
  let seen = 0;
  for (let index = 0; index < images.length; index++) {
    const image = images[index];
    if (!image || !image.url) continue;
    seen += 1;
    const where = 'modelId' in owner ? { modelId: owner.modelId, url: image.url } : {
      variantId: owner.variantId,
      url: image.url,
    };
    const existing = await tx.bikeImage.findFirst({ where });
    if (existing) continue;
    await tx.bikeImage.create({
      data: {
        ...owner,
        providerId: providerDbId,
        externalId: image.externalId ?? null,
        url: image.url,
        alt: image.alt ?? null,
        type: image.type ?? 'gallery',
        sortOrder: image.sortOrder ?? index,
        licence: image.licence ?? null,
        attribution: image.attribution ?? attribution,
      },
    });
  }
  return seen;
}

/**
 * Run a synchronisation for one provider. Creates and finalises a BikeSyncRun,
 * logs every error, and returns summary counters.
 */
export async function runProviderSync(options: RunSyncOptions): Promise<SyncRunResult> {
  const provider = getProvider(options.providerCode);
  if (!provider) {
    throw new ProviderError(
      'PROVIDER_UNKNOWN',
      `Unknown provider: ${options.providerCode}`,
      false,
    );
  }

  const dbProvider = await ensureProviderRow(provider);

  const run = await prisma.bikeSyncRun.create({
    data: {
      providerId: dbProvider.id,
      trigger: options.trigger,
      status: 'RUNNING',
      requestedByUserId: options.actor?.id ?? null,
    },
  });

  const log: ProviderContext['log'] = async (level, message, meta) => {
    await prisma.bikeSyncLog.create({
      data: {
        runId: run.id,
        level,
        entityType: meta?.entityType ?? null,
        externalId: meta?.externalId ?? null,
        message,
        details: (meta?.details as Prisma.InputJsonValue) ?? undefined,
      },
    });
    if (level === 'ERROR') incrementErrors();
  };

  const recordRequest = async (request: ProviderRequestRecord) => {
    await prisma.bikeProviderRequest.create({
      data: {
        providerId: dbProvider.id,
        runId: run.id,
        method: request.method,
        endpoint: request.endpoint,
        statusCode: request.statusCode ?? null,
        success: request.success,
        attempt: request.attempt ?? 1,
        durationMs: request.durationMs ?? null,
        errorMessage: request.errorMessage?.slice(0, 500) ?? null,
      },
    });
  };

  const limiter = new RateLimiter(provider.code, dbProvider.rateLimitPerMinute);
  const context: ProviderContext = {
    runId: run.id,
    log,
    recordRequest,
    acquireRateLimit: async () => {
      await enforceDbRateLimit(dbProvider.id, dbProvider.rateLimitPerMinute);
      await limiter.acquire(sleep);
    },
  };

  const counters = {
    modelsSeen: 0,
    modelsCreated: 0,
    modelsUpdated: 0,
    modelsUnchanged: 0,
    variantsSeen: 0,
    variantsCreated: 0,
    variantsUpdated: 0,
    coloursSeen: 0,
    imagesSeen: 0,
    errorCount: 0,
  };
  const incrementErrors = () => {
    counters.errorCount += 1;
  };

  let runStatus: SyncRunResult['status'] = 'FAILED';

  // Refuse to start when credentials are missing (recorded as a failed run).
  if (!provider.isConfigured()) {
    const missingError = new ProviderNotConfiguredError(provider.name, [
      `${provider.code.toUpperCase()}_API_BASE_URL`,
      `${provider.code.toUpperCase()}_API_KEY`,
      `${provider.code.toUpperCase()}_API_CATALOG_PATH`,
    ]);
    await log('ERROR', missingError.message);
    await prisma.bikeSyncRun.update({
      where: { id: run.id },
      data: { status: 'FAILED', finishedAt: new Date(), errorCount: 1 },
    });
    await prisma.dataProvider.update({
      where: { id: dbProvider.id },
      data: { lastSyncAt: new Date(), lastSyncStatus: 'FAILED' },
    });
    throw missingError;
  }

  try {
    const catalog = await fetchCatalogWithRetry(provider, context);
    counters.modelsSeen = catalog.models.length;

    for (const model of catalog.models) {
      try {
        const result = await syncModel(provider, dbProvider.id, model, context);
        counters.modelsCreated += result.modelCreated;
        counters.modelsUpdated += result.modelUpdated;
        counters.modelsUnchanged += result.modelUnchanged;
        counters.variantsSeen += result.variantsSeen;
        counters.variantsCreated += result.variantsCreated;
        counters.variantsUpdated += result.variantsUpdated;
        counters.coloursSeen += result.coloursSeen;
        counters.imagesSeen += result.imagesSeen;
      } catch (error) {
        incrementErrors();
        await log('ERROR', `Failed to sync model "${model.name}": ${errorMessage(error)}`, {
          entityType: 'MODEL',
          externalId: model.externalId,
          details: { error: errorMessage(error) },
        });
      }
    }

    if (counters.errorCount === 0) runStatus = 'SUCCESS';
    else if (
      counters.modelsCreated + counters.modelsUpdated + counters.modelsUnchanged > 0
    )
      runStatus = 'PARTIAL';
    else runStatus = 'FAILED';
  } catch (error) {
    incrementErrors();
    await log('ERROR', `Synchronisation failed: ${errorMessage(error)}`, {
      details: { code: error instanceof ProviderError ? error.code : 'UNKNOWN' },
    });
    runStatus = 'FAILED';
  }

  await prisma.bikeSyncRun.update({
    where: { id: run.id },
    data: {
      status: runStatus,
      finishedAt: new Date(),
      errorCount: counters.errorCount,
      modelsSeen: counters.modelsSeen,
      modelsCreated: counters.modelsCreated,
      modelsUpdated: counters.modelsUpdated,
      modelsUnchanged: counters.modelsUnchanged,
      variantsSeen: counters.variantsSeen,
      variantsCreated: counters.variantsCreated,
      variantsUpdated: counters.variantsUpdated,
      coloursSeen: counters.coloursSeen,
      imagesSeen: counters.imagesSeen,
      summary: counters,
    },
  });

  await prisma.dataProvider.update({
    where: { id: dbProvider.id },
    data: { lastSyncAt: new Date(), lastSyncStatus: runStatus },
  });

  return { runId: run.id, providerCode: provider.code, status: runStatus, ...counters };
}

function errorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

/** Convenience wrapper used by the cron endpoint. */
export async function runScheduledSync(providerCode?: string): Promise<SyncRunResult[]> {
  const codes = providerCode
    ? [providerCode]
    : listEnabledConfiguredProviderCodes();
  const results: SyncRunResult[] = [];
  for (const code of codes) {
    try {
      results.push(await runProviderSync({ providerCode: code, trigger: 'SCHEDULED' }));
    } catch {
      // Individual failures are already recorded against their runs.
    }
  }
  return results;
}

function listEnabledConfiguredProviderCodes(): string[] {
  return listProviders()
    .filter((p) => p.requiresCredentials && p.isConfigured())
    .map((p) => p.code);
}

export { ProviderTransientError };
