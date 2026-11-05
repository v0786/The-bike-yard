import { z } from 'zod';

// Motorcycle Data Integration Engine — shared Zod schemas.
// Prices are integer paise; specifications are provider-managed and validated only
// by the sync engine (never accepted through the pricing API).

const paise = z
  .number()
  .int('Amount must be an integer in paise')
  .nonnegative('Amount must be non-negative')
  .max(Number.MAX_SAFE_INTEGER, 'Amount is too large');

/**
 * Staff pricing upsert. Only pricing fields are accepted — there is deliberately
 * no way to supply specification fields through this schema, so the pricing
 * interface can never modify API-managed technical data.
 */
export const bikePricingUpsertSchema = z.object({
  variantId: z.string().uuid('Invalid variant id'),
  exShowroomPricePaise: paise,
  onRoadPricePaise: paise.optional(),
  insurancePaise: paise.optional().default(0),
  rtoPaise: paise.optional().default(0),
  accessoriesPaise: paise.optional().default(0),
  dealerOfferPaise: paise.optional().default(0),
  finalSellingPricePaise: paise.optional(),
  notes: z.string().max(2000).optional(),
  isPublished: z.boolean().optional().default(false),
  reason: z.string().max(500).optional(),
});

export type BikePricingUpsertInput = z.infer<typeof bikePricingUpsertSchema>;

export const bikePricingPublishSchema = z.object({
  variantId: z.string().uuid('Invalid variant id'),
  isPublished: z.boolean(),
  reason: z.string().max(500).optional(),
});

export const bikeSyncTriggerSchema = z.object({
  providerCode: z
    .string()
    .min(1, 'Provider code is required')
    .max(50)
    .regex(/^[a-z0-9_-]+$/, 'Provider code must be lowercase letters, digits, hyphen or underscore'),
  /** When true a provider that is disabled in the registry is started anyway (staff override). */
  force: z.boolean().optional().default(false),
});

export const bikeCatalogueSearchSchema = z.object({
  q: z.string().max(120).optional(),
  brandId: z.string().uuid().optional(),
  providerCode: z.string().max(50).optional(),
  category: z.string().max(60).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});
