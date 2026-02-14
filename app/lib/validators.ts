import { z } from 'zod';

// ═══════════════════════════════════════
// AUTH
// ═══════════════════════════════════════

export const sendOtpSchema = z.object({
    phone: z
        .string()
        .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian phone number'),
});

export const verifyOtpSchema = z.object({
    phone: z.string().regex(/^[6-9]\d{9}$/),
    otp: z.string().length(6, 'OTP must be 6 digits'),
});



// ═══════════════════════════════════════
// BOOKING
// ═══════════════════════════════════════

export const createBookingSchema = z
    .object({
        villaId: z.string().min(1),
        checkIn: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid check-in date'),
        checkOut: z.string().refine((d) => !isNaN(Date.parse(d)), 'Invalid check-out date'),
        guests: z.number().int().min(1).max(50),
        guestName: z.string().min(2, 'Guest name is required').max(100),
        paymentMode: z.enum(['FULL', 'ADVANCE']).default('FULL'),
        couponCode: z.string().optional(),
        specialRequests: z.string().max(1000).optional(),
        addons: z
            .array(
                z.object({
                    name: z.string(),
                    price: z.number().int().min(0),
                    quantity: z.number().int().min(1).default(1),
                })
            )
            .optional(),
    })
    .refine(
        (data) => new Date(data.checkOut) > new Date(data.checkIn),
        { message: 'Check-out must be after check-in', path: ['checkOut'] }
    );

// ═══════════════════════════════════════
// VILLA QUERY
// ═══════════════════════════════════════

export const villaQuerySchema = z.object({
    location: z.string().optional(),
    minGuests: z.coerce.number().int().min(1).optional(),
    minPrice: z.coerce.number().int().min(0).optional(),
    maxPrice: z.coerce.number().int().optional(),
    checkIn: z.string().optional(),
    checkOut: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(12),
});

// ═══════════════════════════════════════
// REVIEW
// ═══════════════════════════════════════

export const createReviewSchema = z.object({
    villaId: z.string().min(1),
    rating: z.number().int().min(1).max(5),
    comment: z.string().max(2000).optional(),
});

// ═══════════════════════════════════════
// OFFER
// ═══════════════════════════════════════

export const validateOfferSchema = z.object({
    code: z.string().min(1).max(30),
    bookingAmount: z.number().int().min(0),
});

// ═══════════════════════════════════════
// ADMIN
// ═══════════════════════════════════════

export const blockDatesSchema = z.object({
    villaId: z.string().min(1),
    dates: z.array(z.string().refine((d) => !isNaN(Date.parse(d)))),
    reason: z.string().max(200).optional(),
});
