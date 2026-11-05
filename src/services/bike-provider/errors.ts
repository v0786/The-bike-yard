// Provider error taxonomy. These drive retry decisions in the sync engine.

/** Base class for all provider failures (safe to show to staff). */
export class ProviderError extends Error {
  readonly code: string;
  readonly retryable: boolean;
  constructor(code: string, message: string, retryable = false) {
    super(message);
    this.name = 'ProviderError';
    this.code = code;
    this.retryable = retryable;
  }
}

/** Credentials/endpoint not supplied — provider cannot run yet. Not retryable. */
export class ProviderNotConfiguredError extends ProviderError {
  constructor(provider: string, missing: string[]) {
    super(
      'PROVIDER_NOT_CONFIGURED',
      `${provider} is not configured. Missing environment variables: ${missing.join(', ')}`,
      false,
    );
    this.name = 'ProviderNotConfiguredError';
  }
}

/**
 * Official API access / commercial permission has not been confirmed. The
 * application must not invent endpoints or scrape. Not retryable.
 */
export class ProviderAuthorizationPendingError extends ProviderError {
  constructor(provider: string, detail?: string) {
    super(
      'PROVIDER_AUTHORIZATION_PENDING',
      `${provider} cannot run: official API access or commercial permission has not been confirmed.${
        detail ? ` ${detail}` : ''
      }`,
      false,
    );
    this.name = 'ProviderAuthorizationPendingError';
  }
}

/** Transient network/5xx/429 failure — the sync engine may retry. */
export class ProviderTransientError extends ProviderError {
  constructor(message: string, code = 'PROVIDER_TRANSIENT_ERROR') {
    super(code, message, true);
    this.name = 'ProviderTransientError';
  }
}
