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
  colourId: uuidSchema.optional(),
  dealershipId: uuidSchema.optional(),
  purchasePrice: moneySchema,
  purchaseInvoiceNumber: z.string().max(100).optional(),
  supplierName: z.string().max(200).optional(),
  receivedDate: isoDateTimeSchema,
  currentStatus: z.enum(['available', 'reserved', 'sold', 'delivered']).default('available'),
  location: z.string().max(200).optional(),
  notes: z.string().max(1000).optional(),
});

// Stock movement
export const stockMovementCreateSchema = z.object({
  stockUnitId: uuidSchema,
  type: z.enum(['inward', 'reservation', 'release', 'sale', 'return', 'adjustment', 'delivery']),
  quantity: z.number().int().positive().default(1),
  referenceType: z.enum(['sale', 'booking', 'inward', 'refund', 'manual']).optional(),
  referenceId: uuidSchema.optional(),
  notes: z.string().max(1000).optional(),
});

// Reservation
export const reservationCreateSchema = z.object({
  stockUnitId: uuidSchema,
  customerId: uuidSchema,
  expiresAt: isoDateTimeSchema.optional(),
  status: z.enum(['active', 'released', 'expired', 'converted']).default('active'),
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
  placeOfSupply: z.string().min(1, 'Place of supply is required'),
  hsnCode: z.string().max(20).optional(),
  gstRate: gstRateSchema,
  paymentMethod: z.enum(['cash', 'upi', 'qr', 'bank_transfer', 'card', 'finance_loan', 'partial']),
  paymentReferenceId: z.string().max(200).optional(),
  recordedById: uuidSchema,
});

// Booking
export const bookingCreateSchema = z.object({
  bookingNumber: z.string().min(1, 'Booking number is required'),
  customerId: uuidSchema,
  stockUnitId: uuidSchema,
  staffId: uuidSchema.optional(),
  variantId: uuidSchema,
  colourId: uuidSchema,
  exShowroomPrice: moneySchema,
  onRoadPrice: moneySchema,
  advanceAmount: moneySchema.default(0),
  expectedDeliveryDate: isoDateTimeSchema.optional(),
});

// Payment
export const paymentCreateSchema = z.object({
  paymentNumber: z.string().min(1, 'Payment number is required'),
  customerId: uuidSchema,
  saleId: uuidSchema.optional(),
  bookingId: uuidSchema.optional(),
  amount: moneySchema,
  method: z.enum(['cash', 'upi', 'qr', 'bank_transfer', 'card', 'finance_loan', 'partial']),
  referenceId: z.string().max(200).optional(),
  notes: z.string().max(1000).optional(),
});

// Payment allocation
export const paymentAllocationSchema = z.object({
  paymentId: uuidSchema,
  saleId: uuidSchema.optional(),
  bookingId: uuidSchema.optional(),
  amount: moneySchema,
});

// Refund
export const refundCreateSchema = z.object({
  paymentId: uuidSchema,
  saleId: uuidSchema.optional(),
  bookingId: uuidSchema.optional(),
  amount: moneySchema,
  reason: z.string().min(1, 'Reason is required'),
});

// Invoice
export const invoiceCreateSchema = z.object({
  saleId: uuidSchema,
  type: z.enum(['tax_invoice', 'sales_invoice']).default('tax_invoice'),
  gstRate: gstRateSchema,
  placeOfSupply: z.string().min(1, 'Place of supply is required'),
  hsnCode: z.string().max(20).optional(),
  customerGstin: z.string().max(20).optional(),
});

// Customer
export const customerCreateSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: phoneSchema,
  email: emailSchema,
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  pincode: z.string().max(20).optional(),
  gstin: z.string().max(20).optional(),
});

// Lead
export const leadCreateSchema = z.object({
  customerId: uuidSchema,
  staffId: uuidSchema.optional(),
  variantId: uuidSchema.optional(),
  colourId: uuidSchema.optional(),
  source: z.enum(['walkin', 'website', 'chatbot', 'referral']).default('walkin'),
  estimatedBudget: moneySchema.optional(),
  notes: z.string().max(1000).optional(),
});

// Test ride
export const testRideCreateSchema = z.object({
  leadId: uuidSchema,
  stockUnitId: uuidSchema.optional(),
  staffId: uuidSchema,
  scheduledAt: isoDateTimeSchema,
});

// Service request
export const serviceRequestCreateSchema = z.object({
  customerId: uuidSchema,
  saleId: uuidSchema.optional(),
  stockUnitId: uuidSchema.optional(),
  requestType: z.enum(['service', 'complaint', 'document', 'enquiry', 'other']),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['low', 'normal', 'high', 'urgent']).default('normal'),
});

// Staff task
export const staffTaskCreateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().max(1000).optional(),
  assignedTo: uuidSchema,
  assignedBy: uuidSchema.optional(),
  type: z.enum(['enquiry', 'booking', 'sale', 'insurance', 'rto', 'finance', 'service']),
  dueDate: isoDateTimeSchema.optional(),
});

// Finance application
export const financeApplicationCreateSchema = z.object({
  customerId: uuidSchema,
  saleId: uuidSchema.optional(),
  lender: z.string().max(200).optional(),
  loanAmount: moneySchema.optional(),
  downPayment: moneySchema.optional(),
  interestRate: z.number().optional(),
  tenureMonths: z.number().int().positive().optional(),
  emiAmount: moneySchema.optional(),
});

// Insurance application
export const insuranceApplicationCreateSchema = z.object({
  customerId: uuidSchema,
  saleId: uuidSchema.optional(),
  provider: z.string().max(200).optional(),
  policyType: z.enum(['comprehensive', 'third_party']).optional(),
  premium: moneySchema.optional(),
});

// RTO application
export const rtoApplicationCreateSchema = z.object({
  customerId: uuidSchema,
  saleId: uuidSchema.optional(),
  vehicleClass: z.string().max(50).optional(),
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
