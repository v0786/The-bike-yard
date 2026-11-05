import { z } from 'zod';

// Shared Zod validation schemas — used by both client forms and server API routes.
// Money fields are integer paise. Timestamps are ISO 8601 UTC strings.

export const uuidSchema = z.string().uuid('Invalid UUID');

export const chassisNumberSchema = z
  .string()
  .min(1, 'Chassis number is required')
  .max(50, 'Chassis number must be at most 50 characters');

export const engineNumberSchema = z
  .string()
  .min(1, 'Engine number is required')
  .max(50, 'Engine number must be at most 50 characters');

export const moneySchema = z
  .number()
  .int('Amount must be an integer in paise')
  .nonnegative('Amount must be non-negative');

export const gstRateSchema = z
  .number()
  .int('GST rate must be an integer in basis points')
  .min(0, 'GST rate must be >= 0')
  .max(10000, 'GST rate must be <= 10000 basis points (100.00%)');

export const phoneSchema = z
  .string()
  .min(10, 'Phone must be 10-15 digits')
  .max(15, 'Phone must be 10-15 digits')
  .regex(/^\+?[\d\s\-]+$/, 'Invalid phone number');

export const emailSchema = z.string().email('Invalid email address').optional().or(z.literal(''));

export const isoDateTimeSchema = z.string().datetime({ message: 'Invalid ISO 8601 UTC timestamp' });

// Stock unit
export const stockUnitCreateSchema = z.object({
  chassisNumber: chassisNumberSchema,
  engineNumber: engineNumberSchema,
  variantId: uuidSchema,
  colorName: z.string().min(1),
  dealershipId: uuidSchema.optional(),
  purchasePricePaise: moneySchema,
  status: z
    .enum(['IN_STOCK', 'RESERVED', 'SOLD', 'IN_TRANSIT', 'PDI_PENDING', 'DISPLAY'])
    .default('IN_STOCK'),
  location: z.string().max(200).optional(),
  pdiPassed: z.boolean().optional(),
  notes: z.string().max(1000).optional(),
  supplierName: z.string().max(200).optional(),
  inwardDate: isoDateTimeSchema,
});

// Stock movement
export const stockMovementCreateSchema = z.object({
  stockUnitId: uuidSchema,
  type: z.enum([
    'INWARD',
    'SHOWROOM_DISPLAY',
    'YARD_TRANSFER',
    'PDI_PASS',
    'RESERVATION_LOCK',
    'DISPATCH_DELIVERY',
  ]),
  fromLoc: z.string().optional(),
  toLoc: z.string().optional(),
  notes: z.string().max(1000).optional(),
  recordedBy: z.string().max(120).optional(),
});

// Reservation
export const reservationCreateSchema = z.object({
  bookingId: uuidSchema,
  stockUnitId: uuidSchema,
  expiresAt: isoDateTimeSchema,
});

// Sale
export const saleCreateSchema = z.object({
  saleNumber: z.string().min(1, 'Sale number is required'),
  customerId: uuidSchema,
  stockUnitId: uuidSchema,
  staffId: uuidSchema.optional(),
  bookingId: uuidSchema.optional(),
  exShowroomPrice: moneySchema,
  onRoadPrice: moneySchema,
  insurancePrice: moneySchema.default(0),
  rtoCharges: moneySchema.default(0),
  accessoriesPrice: moneySchema.default(0),
  discount: moneySchema.default(0),
  finalSellingPrice: moneySchema,
  gstAmount: moneySchema.default(0),
  totalAmount: moneySchema,
  amountPaid: moneySchema.default(0),
  outstandingAmount: moneySchema,
  advanceAmount: moneySchema.default(0),
  placeOfSupply: z.string().min(1, 'Place of supply is required'),
  hsnCode: z.string().max(20).optional(),
  gstRate: gstRateSchema,
  saleDate: isoDateTimeSchema.optional(),
  paymentMethod: z.enum(['cash', 'upi', 'qr', 'bank_transfer', 'card', 'finance_loan', 'partial']),
  paymentReferenceId: z.string().max(200).optional(),
  recordedById: uuidSchema,
});

// Booking
export const bookingCreateSchema = z.object({
  bookingNumber: z.string().min(1, 'Booking number is required'),
  customerId: uuidSchema,
  variantId: uuidSchema,
  colorRequested: z.string().min(1, 'Colour is required'),
  advanceAmountPaise: moneySchema,
  tentativeDeliveryDate: z.string(),
  notes: z.string().max(2000).optional(),
});

// Payment
export const paymentCreateSchema = z.object({
  receiptNumber: z.string().min(1, 'Receipt number is required'),
  saleId: uuidSchema.optional(),
  bookingId: uuidSchema.optional(),
  amountPaise: moneySchema,
  mode: z.enum(['cash', 'upi', 'qr', 'bank_transfer', 'card', 'finance_loan', 'partial']),
  transactionRef: z.string().max(200).optional(),
  receivedBy: z.string().max(120),
});

// Payment allocation
export const paymentAllocationSchema = z.object({
  paymentId: uuidSchema,
  saleId: uuidSchema.optional(),
  bookingId: uuidSchema.optional(),
  amountPaise: moneySchema,
});

// Refund
export const refundCreateSchema = z.object({
  paymentId: uuidSchema,
  bookingId: uuidSchema,
  amountPaise: moneySchema,
  reason: z.string().min(1, 'Reason is required'),
  requestedBy: z.string().max(120),
});

// Invoice
export const invoiceCreateSchema = z.object({
  saleId: uuidSchema,
  gstRateBps: gstRateSchema.optional(),
  placeOfSupply: z.string().min(1).optional(),
  customerGstin: z.string().max(15).optional(),
});

// Customer
export const customerCreateSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  phone: phoneSchema,
  email: emailSchema,
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  pincode: z.string().max(20).optional(),
  panNumber: z.string().max(10).optional(),
  aadhaarNumber: z.string().max(20).optional(),
});

// Lead
export const leadCreateSchema = z.object({
  customerId: uuidSchema.optional(),
  customerName: z.string().min(1, 'Customer name is required'),
  phone: phoneSchema,
  email: z.string().email().optional(),
  bikeOfInterest: z.string().min(1, 'Bike of interest is required'),
  source: z.string().max(50).default('WEBSITE'),
  stage: z.string().max(50).default('NEW'),
  assignedTo: z.string().max(120).optional(),
  notes: z.string().max(2000).optional(),
});

// Test ride
export const testRideCreateSchema = z.object({
  customerId: uuidSchema.optional(),
  customerName: z.string().min(1, 'Customer name is required'),
  phone: phoneSchema,
  bikeModel: z.string().min(1, 'Bike model is required'),
  preferredDate: isoDateTimeSchema,
  preferredTimeSlot: z.string().min(1, 'Preferred time slot is required'),
  hasValidLicense: z.boolean().default(true),
  assignedStaff: z.string().max(120).optional(),
  status: z.string().max(30).default('SCHEDULED'),
});

// Service request
export const serviceRequestCreateSchema = z.object({
  customerId: uuidSchema,
  bikeModel: z.string().min(1, 'Bike model is required'),
  odometerKm: z.number().int().nonnegative(),
  serviceType: z.string().min(1, 'Service type is required'),
  complaints: z.string().max(2000).optional(),
  scheduledFor: isoDateTimeSchema,
  status: z.string().max(40).default('PENDING'),
});

// Staff task
export const staffTaskCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  assignedTo: uuidSchema,
  dueTime: z.string().max(50),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
});

// Finance application
export const financeApplicationCreateSchema = z.object({
  customerId: uuidSchema,
  bikeModel: z.string().min(1, 'Bike model is required'),
  loanAmountPaise: moneySchema,
  downPaymentPaise: moneySchema,
  tenureMonths: z.number().int().positive(),
  cibilBand: z.string().min(1, 'CIBIL band is required'),
  bankPartner: z.string().max(80).optional(),
});

// Insurance application
export const insuranceApplicationCreateSchema = z.object({
  customerId: uuidSchema,
  bikeModel: z.string().min(1, 'Bike model is required'),
  provider: z.string().max(80).optional(),
  policyType: z.string().max(60).optional(),
  zeroDepIncluded: z.boolean().default(true),
  premiumPaise: moneySchema,
});

// RTO application
export const rtoApplicationCreateSchema = z.object({
  customerId: uuidSchema,
  rtoLocation: z.string().max(60).optional(),
  chassisNumber: chassisNumberSchema,
  engineNumber: engineNumberSchema,
});

// Enquiry (public)
export const enquiryCreateSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: phoneSchema,
  email: z.string().email().optional(),
  message: z.string().min(1, 'Message is required'),
  variantId: uuidSchema.optional(),
});

// Test ride booking (public)
export const publicTestRideSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: phoneSchema,
  email: z.string().email().optional(),
  bikeInterest: z.string().min(1, 'Bike interest is required'),
  preferredDate: isoDateTimeSchema,
  message: z.string().max(1000).optional(),
});

// Contact form (public)
export const contactFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  phone: phoneSchema,
  email: z.string().email().optional(),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
});

// GSTIN validation (Indian GST format)
export const gstinSchema = z
  .string()
  .length(15, 'GSTIN must be exactly 15 alphanumeric characters')
  .regex(
    /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    'Invalid Indian GSTIN format',
  );

// Stock inward schema
export const stockInwardSchema = z.object({
  chassisNumber: z.string().min(10, 'Chassis number must be at least 10 characters').max(30),
  engineNumber: z.string().min(6, 'Engine number must be at least 6 characters').max(30),
  variantId: z.string().uuid(),
  colorName: z.string().min(2),
  purchasePricePaise: z.bigint().positive(),
  location: z.string().default('Main Showroom'),
});

// Refund approval schema (requester cannot self-approve)
export const refundApprovalSchema = z
  .object({
    refundId: z.string().uuid(),
    approverName: z.string().min(2),
    requesterName: z.string().min(2),
  })
  .refine(
    (data) =>
      data.approverName.trim().toLowerCase() !== data.requesterName.trim().toLowerCase(),
    {
      message:
        'Financial Rule Violation: Refund requester cannot approve their own refund.',
      path: ['approverName'],
    },
  );
