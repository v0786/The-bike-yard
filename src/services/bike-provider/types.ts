// Motorcycle data provider contract — the stable interface every authorised
// motorcycle-information provider implements. New providers can be integrated
// without changing the sync engine or application code.
//
// Provider DTOs deliberately contain NO pricing fields. External providers manage
// motorcycle INFORMATION only; authorised staff exclusively manage pricing.
//
// Optional properties explicitly allow `undefined` because the project enables
// `exactOptionalPropertyTypes`.

export interface ProviderColour {
  externalId?: string | undefined;
  name: string;
  hexCode?: string | undefined;
  imageUrl?: string | undefined;
}

export interface ProviderImage {
  externalId?: string | undefined;
  url: string;
  alt?: string | undefined;
  type?: string | undefined;
  sortOrder?: number | undefined;
  licence?: string | undefined;
  attribution?: string | undefined;
}

export interface ProviderVariant {
  externalId?: string | undefined;
  name: string;
  engineCc?: number | undefined;
  powerBhp?: number | undefined;
  powerKw?: number | undefined;
  torqueNm?: number | undefined;
  mileageKmpl?: number | undefined;
  fuelType?: string | undefined;
  fuelCapacityLitres?: number | undefined;
  transmission?: string | undefined;
  transmissionGears?: number | undefined;
  coolingSystem?: string | undefined;
  topSpeedKmph?: number | undefined;
  kerbWeightKg?: number | undefined;
  seatHeightMm?: number | undefined;
  groundClearanceMm?: number | undefined;
  wheelbaseMm?: number | undefined;
  lengthMm?: number | undefined;
  widthMm?: number | undefined;
  heightMm?: number | undefined;
  frontBrake?: string | undefined;
  rearBrake?: string | undefined;
  absType?: string | undefined;
  frontSuspension?: string | undefined;
  rearSuspension?: string | undefined;
  features?: string[] | undefined;
  specifications?: Record<string, unknown> | undefined;
  description?: string | undefined;
  colours?: ProviderColour[] | undefined;
  images?: ProviderImage[] | undefined;
}

export interface ProviderModel {
  externalId: string;
  name: string;
  slug?: string | undefined;
  brandName: string;
  brandSlug?: string | undefined;
  category?: string | undefined;
  description?: string | undefined;
  technicalDescription?: string | undefined;
  imageUrl?: string | undefined;
  variants: ProviderVariant[];
  images?: ProviderImage[] | undefined;
}

export interface ProviderCatalog {
  providerCode: string;
  attribution: string;
  fetchedAt: string;
  models: ProviderModel[];
}

export interface ProviderRequestRecord {
  method: string;
  endpoint: string;
  statusCode?: number | undefined;
  success: boolean;
  attempt?: number | undefined;
  durationMs?: number | undefined;
  errorMessage?: string | undefined;
}

export interface ProviderContext {
  /** Sync run id, for request-log correlation. */
  runId: string;
  /** Append a structured sync log entry. */
  log: (
    level: 'INFO' | 'WARN' | 'ERROR',
    message: string,
    meta?: { entityType?: string; externalId?: string; details?: unknown },
  ) => Promise<void>;
  /** Record a provider HTTP request for logging + rate limiting. */
  recordRequest: (request: ProviderRequestRecord) => Promise<void>;
  /** Wait until the provider's rate limiter allows the next request. */
  acquireRateLimit: () => Promise<void>;
  /** Abort signal honoured by long-running fetches. */
  signal?: AbortSignal | undefined;
}

export interface MotorcycleDataProvider {
  readonly code: string;
  readonly name: string;
  readonly requiresCredentials: boolean;
  /** Provider attribution / licence text shown to admins and the public shop. */
  attribution(): string;
  /** True when required credentials are present in the environment. */
  isConfigured(): boolean;
  /** Fetch the full normalised catalogue. MUST NOT include pricing. */
  fetchCatalog(context: ProviderContext): Promise<ProviderCatalog>;
  /** Lightweight connectivity/credential check. */
  healthCheck(): Promise<{ ok: boolean; message?: string | undefined }>;
}
