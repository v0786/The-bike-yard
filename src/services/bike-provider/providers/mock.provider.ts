// Deterministic development/test provider.
//
// This provider is a FIXTURE — it does not call any external service and its data
// is clearly fictional (brands/models prefixed "Demo"). It exists so the sync
// engine, admin dashboard and tests can run end-to-end without an authorised
// commercial data licence. It MUST NOT be enabled in production.
//
// It is enabled only when BIKE_PROVIDER_MOCK_ENABLED === 'true' or NODE_ENV === 'test'.

import type {
  MotorcycleDataProvider,
  ProviderCatalog,
  ProviderContext,
} from '../types';

const ATTRIBUTION = 'Mock provider (development fixture — not real market data)';

export class MockBikeProvider implements MotorcycleDataProvider {
  readonly code = 'mock';
  readonly name = 'Mock Authorized Provider (development fixture)';
  readonly requiresCredentials = false;

  /** When true the next fetchCatalog call throws a transient error (test hook). */
  public static failNextWith: (() => Error) | null = null;

  isConfigured(): boolean {
    return (
      process.env.BIKE_PROVIDER_MOCK_ENABLED === 'true' || process.env.NODE_ENV === 'test'
    );
  }

  attribution(): string {
    return ATTRIBUTION;
  }

  async healthCheck(): Promise<{ ok: boolean; message?: string }> {
    return {
      ok: this.isConfigured(),
      message: this.isConfigured()
        ? 'Mock provider ready (fixture data)'
        : 'Mock provider disabled (set BIKE_PROVIDER_MOCK_ENABLED=true in development only)',
    };
  }

  async fetchCatalog(context: ProviderContext): Promise<ProviderCatalog> {
    await context.acquireRateLimit();
    const started = Date.now();

    if (MockBikeProvider.failNextWith) {
      const factory = MockBikeProvider.failNextWith;
      MockBikeProvider.failNextWith = null;
      const error = factory();
      await context.recordRequest({
        method: 'GET',
        endpoint: 'mock://catalog',
        success: false,
        durationMs: Date.now() - started,
        errorMessage: error.message,
      });
      throw error;
    }

    await context.recordRequest({
      method: 'GET',
      endpoint: 'mock://catalog',
      statusCode: 200,
      success: true,
      durationMs: Date.now() - started,
    });

    const catalog = buildMockCatalog();
    await context.log('INFO', `Mock provider returned ${catalog.models.length} model(s)`);
    return catalog;
  }
}

/** Deterministic fixture. Exported so tests can assert expected mappings. */
export function buildMockCatalog(): ProviderCatalog {
  return {
    providerCode: 'mock',
    attribution: ATTRIBUTION,
    fetchedAt: new Date().toISOString(),
    models: [
      {
        externalId: 'DEMO-CITY-125',
        name: 'Demo City 125',
        brandName: 'Demo Motors',
        brandSlug: 'demo-motors',
        category: 'Scooter',
        description: 'Fictional 125cc city commuter used for integration testing.',
        technicalDescription: 'Fixture technical description for the Demo City 125.',
        variants: [
          {
            externalId: 'DEMO-CITY-125-STD',
            name: 'Standard',
            engineCc: 124,
            powerBhp: 8.2,
            powerKw: 6.1,
            torqueNm: 9.5,
            mileageKmpl: 55.4,
            fuelType: 'Petrol',
            fuelCapacityLitres: 5.3,
            transmission: 'CVT',
            coolingSystem: 'Air',
            topSpeedKmph: 90,
            kerbWeightKg: 108,
            seatHeightMm: 765,
            groundClearanceMm: 160,
            wheelbaseMm: 1260,
            frontBrake: 'Drum',
            rearBrake: 'Drum',
            absType: 'None',
            frontSuspension: 'Telescopic fork',
            rearSuspension: 'Single shock',
            features: ['LED headlamp', 'Digital console', 'USB charger'],
            specifications: { tyreFront: '90/90-12', tyreRear: '90/100-10' },
            description: 'Standard variant fixture.',
            colours: [
              { externalId: 'DEMO-CITY-125-BLK', name: 'Midnight Black', hexCode: '#000000' },
              { externalId: 'DEMO-CITY-125-BLU', name: 'Ocean Blue', hexCode: '#1E3A8A' },
            ],
            images: [
              {
                externalId: 'DEMO-CITY-125-STD-1',
                url: 'https://cdn.example.test/demo/city-125-std.jpg',
                alt: 'Demo City 125 Standard',
                type: 'main',
                sortOrder: 0,
                licence: 'Fixture — not a real image',
              },
            ],
          },
        ],
      },
      {
        externalId: 'DEMO-TRAIL-250',
        name: 'Demo Trail 250',
        brandName: 'Demo Motors',
        brandSlug: 'demo-motors',
        category: 'Adventure',
        description: 'Fictional 250cc adventure motorcycle used for integration testing.',
        variants: [
          {
            externalId: 'DEMO-TRAIL-250-DISC',
            name: 'Disc ABS',
            engineCc: 249,
            powerBhp: 24.5,
            powerKw: 18.3,
            torqueNm: 22.1,
            mileageKmpl: 35.0,
            fuelType: 'Petrol',
            fuelCapacityLitres: 12.5,
            transmission: '6-Speed Manual',
            transmissionGears: 6,
            coolingSystem: 'Liquid',
            topSpeedKmph: 135,
            kerbWeightKg: 158,
            seatHeightMm: 830,
            groundClearanceMm: 210,
            wheelbaseMm: 1385,
            frontBrake: 'Disc',
            rearBrake: 'Disc',
            absType: 'Dual-channel',
            frontSuspension: 'USD fork',
            rearSuspension: 'Monoshock',
            features: ['Dual-channel ABS', 'Ride modes', 'Slip-assist clutch'],
            specifications: { tyreFront: '100/90-19', tyreRear: '130/80-17' },
            colours: [
              { externalId: 'DEMO-TRAIL-250-GRY', name: 'Graphite Grey', hexCode: '#4B5563' },
            ],
            images: [],
          },
        ],
      },
    ],
  };
}


