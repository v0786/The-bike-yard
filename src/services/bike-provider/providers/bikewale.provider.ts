// Official BikeWale provider — INTERFACE ONLY until commercial access is confirmed.
//
// STATUS: not operational. The Bike Yard does not currently hold a confirmed
// official BikeWale API agreement. This adapter therefore:
//   * hard-codes NO endpoint,
//   * performs NO scraping,
//   * refuses to run until the operator supplies, from the official agreement,
//     BIKEWALE_API_BASE_URL, BIKEWALE_API_KEY and BIKEWALE_API_CATALOG_PATH.
//
// The response field mapping below targets a generic `{ data: [...] }` envelope.
// It MUST be reconciled against the official BikeWale API schema before the
// integration is described as operational. See docs/BIKE_DATA_INTEGRATION.md §9.

import {
  ProviderAuthorizationPendingError,
  ProviderError,
  ProviderNotConfiguredError,
  ProviderTransientError,
} from '../errors';
import type {
  MotorcycleDataProvider,
  ProviderCatalog,
  ProviderColour,
  ProviderContext,
  ProviderImage,
  ProviderModel,
  ProviderVariant,
} from '../types';

const ENV_BASE_URL = 'BIKEWALE_API_BASE_URL';
const ENV_API_KEY = 'BIKEWALE_API_KEY';
const ENV_CATALOG_PATH = 'BIKEWALE_API_CATALOG_PATH';

const ATTRIBUTION = 'Specifications sourced from BikeWale (where officially licensed)';

function readEnv(name: string): string | null {
  const value = process.env[name];
  if (!value || value.trim() === '') return null;
  // Treat committed placeholders as unset so we never attempt a real call with them.
  if (/^(placeholder|changeme|your-|<.*>)/i.test(value.trim())) return null;
  return value.trim();
}

export class BikeWaleProvider implements MotorcycleDataProvider {
  readonly code = 'bikewale';
  readonly name = 'BikeWale';
  readonly requiresCredentials = true;

  attribution(): string {
    return ATTRIBUTION;
  }

  private missingEnv(): string[] {
    const missing: string[] = [];
    if (!readEnv(ENV_BASE_URL)) missing.push(ENV_BASE_URL);
    if (!readEnv(ENV_API_KEY)) missing.push(ENV_API_KEY);
    if (!readEnv(ENV_CATALOG_PATH)) missing.push(ENV_CATALOG_PATH);
    return missing;
  }

  isConfigured(): boolean {
    return this.missingEnv().length === 0;
  }

  async healthCheck(): Promise<{ ok: boolean; message?: string }> {
    const missing = this.missingEnv();
    if (missing.length > 0) {
      return {
        ok: false,
        message: `Awaiting official BikeWale API credentials/endpoint. Missing: ${missing.join(', ')}`,
      };
    }
    return { ok: true, message: 'Credentials present — verify with a manual sync' };
  }

  async fetchCatalog(context: ProviderContext): Promise<ProviderCatalog> {
    const missing = this.missingEnv();
    if (missing.length > 0) {
      throw new ProviderNotConfiguredError('BikeWale', missing);
    }

    const baseUrl = readEnv(ENV_BASE_URL)!;
    const apiKey = readEnv(ENV_API_KEY)!;
    const catalogPath = readEnv(ENV_CATALOG_PATH)!;

    if (!catalogPath.startsWith('/')) {
      throw new ProviderAuthorizationPendingError(
        'BikeWale',
        'BIKEWALE_API_CATALOG_PATH must be the exact path documented in the official agreement.',
      );
    }

    const endpoint = `${baseUrl.replace(/\/$/, '')}${catalogPath}`;
    await context.acquireRateLimit();

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);
    const started = Date.now();
    let response: Response;
    try {
      response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        signal: context.signal ?? controller.signal,
      });
    } catch (error) {
      clearTimeout(timeout);
      const message = error instanceof Error ? error.message : 'network error';
      await context.recordRequest({
        method: 'GET',
        endpoint,
        success: false,
        durationMs: Date.now() - started,
        errorMessage: message,
      });
      throw new ProviderTransientError(`BikeWale request failed: ${message}`);
    }
    clearTimeout(timeout);

    const durationMs = Date.now() - started;
    if (response.status === 429 || response.status >= 500) {
      await context.recordRequest({
        method: 'GET',
        endpoint,
        statusCode: response.status,
        success: false,
        durationMs,
        errorMessage: `HTTP ${response.status}`,
      });
      throw new ProviderTransientError(`BikeWale returned HTTP ${response.status}`);
    }
    if (!response.ok) {
      await context.recordRequest({
        method: 'GET',
        endpoint,
        statusCode: response.status,
        success: false,
        durationMs,
        errorMessage: `HTTP ${response.status}`,
      });
      throw new ProviderError(
        'PROVIDER_HTTP_ERROR',
        `BikeWale returned HTTP ${response.status}`,
        false,
      );
    }

    await context.recordRequest({
      method: 'GET',
      endpoint,
      statusCode: response.status,
      success: true,
      durationMs,
    });

    const raw = (await response.json()) as unknown;
    return this.mapResponse(raw, context);
  }

  /**
   * Defensive mapping of a generic `{ data: [...] }` (or bare array) envelope.
   * Reconcile with the official schema before production use.
   */
  private async mapResponse(raw: unknown, context: ProviderContext): Promise<ProviderCatalog> {
    const rows = Array.isArray(raw)
      ? raw
      : raw && typeof raw === 'object' && Array.isArray((raw as any).data)
        ? ((raw as any).data as unknown[])
        : null;

    if (!rows) {
      await context.log(
        'ERROR',
        'BikeWale response did not match the expected { data: [...] } envelope — field mapping must be confirmed against the official API schema.',
      );
      throw new ProviderError(
        'PROVIDER_MAPPING_PENDING',
        'BikeWale response schema has not been confirmed against the official documentation.',
        false,
      );
    }

    const models: ProviderModel[] = rows.map((row: any) => this.mapModel(row));
    await context.log('INFO', `BikeWale returned ${models.length} model(s)`);
    return {
      providerCode: this.code,
      attribution: ATTRIBUTION,
      fetchedAt: new Date().toISOString(),
      models,
    };
  }

  private mapModel(row: any): ProviderModel {
    const variants: ProviderVariant[] = Array.isArray(row.variants)
      ? row.variants.map((v: any) => this.mapVariant(v))
      : [];
    return {
      externalId: String(row.id ?? row.externalId ?? row.slug ?? row.name),
      name: String(row.name ?? 'Unknown model'),
      slug: row.slug ? String(row.slug) : undefined,
      brandName: String(row.brand?.name ?? row.brandName ?? row.brand ?? 'Unknown brand'),
      brandSlug: row.brand?.slug ? String(row.brand.slug) : undefined,
      category: row.category ? String(row.category) : undefined,
      description: row.description ? String(row.description) : undefined,
      technicalDescription: row.technicalDescription
        ? String(row.technicalDescription)
        : undefined,
      imageUrl: row.imageUrl ? String(row.imageUrl) : undefined,
      variants,
      images: Array.isArray(row.images) ? row.images.map((i: any) => this.mapImage(i)) : [],
    };
  }

  private mapVariant(row: any): ProviderVariant {
    const colours: ProviderColour[] = Array.isArray(row.colours)
      ? row.colours.map((c: any) => ({
          externalId: c.id ? String(c.id) : undefined,
          name: String(c.name ?? 'Unknown'),
          hexCode: c.hexCode ? String(c.hexCode) : undefined,
          imageUrl: c.imageUrl ? String(c.imageUrl) : undefined,
        }))
      : [];
    return {
      externalId: row.id ? String(row.id) : undefined,
      name: String(row.name ?? 'Standard'),
      engineCc: numOrUndef(row.engineCc),
      powerBhp: numOrUndef(row.powerBhp),
      powerKw: numOrUndef(row.powerKw),
      torqueNm: numOrUndef(row.torqueNm),
      mileageKmpl: numOrUndef(row.mileageKmpl),
      fuelType: row.fuelType ? String(row.fuelType) : undefined,
      fuelCapacityLitres: numOrUndef(row.fuelCapacityLitres),
      transmission: row.transmission ? String(row.transmission) : undefined,
      transmissionGears: numOrUndef(row.transmissionGears),
      coolingSystem: row.coolingSystem ? String(row.coolingSystem) : undefined,
      topSpeedKmph: numOrUndef(row.topSpeedKmph),
      kerbWeightKg: numOrUndef(row.kerbWeightKg),
      seatHeightMm: numOrUndef(row.seatHeightMm),
      groundClearanceMm: numOrUndef(row.groundClearanceMm),
      wheelbaseMm: numOrUndef(row.wheelbaseMm),
      lengthMm: numOrUndef(row.lengthMm),
      widthMm: numOrUndef(row.widthMm),
      heightMm: numOrUndef(row.heightMm),
      frontBrake: row.frontBrake ? String(row.frontBrake) : undefined,
      rearBrake: row.rearBrake ? String(row.rearBrake) : undefined,
      absType: row.absType ? String(row.absType) : undefined,
      frontSuspension: row.frontSuspension ? String(row.frontSuspension) : undefined,
      rearSuspension: row.rearSuspension ? String(row.rearSuspension) : undefined,
      features: Array.isArray(row.features) ? row.features.map(String) : undefined,
      specifications:
        row.specifications && typeof row.specifications === 'object'
          ? (row.specifications as Record<string, unknown>)
          : undefined,
      description: row.description ? String(row.description) : undefined,
      colours,
      images: Array.isArray(row.images) ? row.images.map((i: any) => this.mapImage(i)) : [],
    };
  }

  private mapImage(row: any): ProviderImage {
    return {
      externalId: row.id ? String(row.id) : undefined,
      url: String(row.url ?? row.imageUrl ?? ''),
      alt: row.alt ? String(row.alt) : undefined,
      type: row.type ? String(row.type) : undefined,
      sortOrder: numOrUndef(row.sortOrder),
      licence: row.licence ? String(row.licence) : undefined,
      attribution: row.attribution ? String(row.attribution) : undefined,
    };
  }
}

function numOrUndef(value: unknown): number | undefined {
  if (value === null || value === undefined || value === '') return undefined;
  const n = Number(value);
  return Number.isFinite(n) ? n : undefined;
}
