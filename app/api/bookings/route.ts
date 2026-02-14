import { NextRequest } from 'next/server';
import prisma from '@/app/lib/prisma';
import { requireAuth } from '@/app/lib/auth';
import { createBookingSchema } from '@/app/lib/validators';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * POST /api/bookings
 * Create a new booking
 */
export async function POST(req: NextRequest) {
    try {
        const user = await requireAuth(req);
        const body = await req.json();
        const parsed = createBookingSchema.safeParse(body);

        if (!parsed.success) {
            return errorResponse(parsed.error.issues[0].message);
        }

        const { villaId, checkIn, checkOut, guests, guestName, paymentMode, couponCode, specialRequests, addons } = parsed.data;

        // Validate villa exists (support lookup by ID or slug)
        let villa = null;
        if (villaId) {
            villa = await prisma.villa.findFirst({
                where: {
                    OR: [{ id: villaId }, { slug: villaId }],
                },
                select: { id: true, pricePerNight: true, guests: true, name: true },
            });
        }

        if (!villa) {
            return errorResponse('Villa not found', 404);
        }

        const resolvedVillaId = villa.id;

        if (guests > villa.guests) {
            return errorResponse(`This villa accommodates max ${villa.guests} guests`);
        }

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        // Check availability
        const conflictingBooking = await prisma.booking.findFirst({
            where: {
                villaId: resolvedVillaId,
                status: { in: ['CONFIRMED', 'CHECKED_IN'] },
                checkIn: { lt: checkOutDate },
                checkOut: { gt: checkInDate },
            },
        });

        if (conflictingBooking) {
            return errorResponse('Villa is not available for selected dates');
        }

        // Check blocked dates
        const blockedDates = await prisma.blockedDate.findFirst({
            where: {
                villaId: resolvedVillaId,
                date: { gte: checkInDate, lt: checkOutDate },
            },
        });

        if (blockedDates) {
            return errorResponse('Some dates are blocked for this villa');
        }

        // Calculate pricing
        const nights = Math.ceil(
            (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
        );
        const subtotal = villa.pricePerNight * nights;

        // Apply coupon discount
        let discount = 0;
        if (couponCode) {
            const offer = await prisma.offer.findUnique({
                where: { code: couponCode },
            });
            if (offer && offer.isActive && new Date() <= offer.validTill) {
                if (offer.minBookingAmount && subtotal < offer.minBookingAmount) {
                    return errorResponse(`Minimum booking amount for this coupon is ₹${offer.minBookingAmount}`);
                }
                if (offer.usageLimit && offer.usedCount >= offer.usageLimit) {
                    return errorResponse('This coupon has reached its usage limit');
                }
                discount =
                    offer.discountType === 'PERCENTAGE'
                        ? Math.round(subtotal * (offer.discountValue / 100))
                        : offer.discountValue;
                if (offer.maxDiscount && discount > offer.maxDiscount) {
                    discount = offer.maxDiscount;
                }
                // Increment usage count
                await prisma.offer.update({
                    where: { id: offer.id },
                    data: { usedCount: { increment: 1 } },
                });
            }
        }

        const taxes = Math.round((subtotal - discount) * 0.18);
        const total = subtotal - discount + taxes;

        // Add addon costs
        let addonTotal = 0;
        if (addons && addons.length > 0) {
            addonTotal = addons.reduce((sum, a) => sum + a.price * a.quantity, 0);
        }

        const finalTotal = total + addonTotal;

        // Calculate advance / balance for ADVANCE payment mode (30%)
        const advanceAmount = paymentMode === 'ADVANCE' ? Math.round(finalTotal * 0.30) : null;
        const balanceAmount = paymentMode === 'ADVANCE' ? finalTotal - advanceAmount! : null;

        // Create booking with addons in a transaction
        const booking = await prisma.$transaction(async (tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0]) => {
            const newBooking = await tx.booking.create({
                data: {
                    userId: user.id,
                    villaId: resolvedVillaId,
                    checkIn: checkInDate,
                    checkOut: checkOutDate,
                    guests,
                    guestName,
                    nights,
                    subtotal,
                    discount,
                    taxes,
                    total: finalTotal,
                    paymentMode: paymentMode as 'FULL' | 'ADVANCE',
                    advanceAmount,
                    balanceAmount,
                    couponCode,
                    specialRequests,
                    addons: addons
                        ? {
                            create: addons.map((a) => ({
                                name: a.name,
                                price: a.price,
                                quantity: a.quantity,
                            })),
                        }
                        : undefined,
                },
                include: {
                    villa: { select: { name: true, slug: true, location: true } },
                    addons: true,
                },
            });

            return newBooking;
        });

        return successResponse(booking, 201);
    } catch (error) {
        return handleError(error);
    }
}

/**
 * GET /api/bookings
 * Get current user's bookings
 */
export async function GET(req: NextRequest) {
    try {
        const user = await requireAuth(req);

        const bookings = await prisma.booking.findMany({
            where: { userId: user.id },
            include: {
                villa: {
                    select: {
                        name: true,
                        slug: true,
                        location: true,
                        images: { take: 1, orderBy: { sortOrder: 'asc' } },
                    },
                },
                payment: {
                    select: { status: true, razorpayPaymentId: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return successResponse({ bookings });
    } catch (error) {
        return handleError(error);
    }
}
