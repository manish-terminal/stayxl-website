import { NextRequest } from 'next/server';
import prisma from '@/app/lib/prisma';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * GET /api/villas/[slug]/availability?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD
 * Check villa availability for given dates
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const checkIn = req.nextUrl.searchParams.get('checkIn');
        const checkOut = req.nextUrl.searchParams.get('checkOut');

        if (!checkIn || !checkOut) {
            return errorResponse('checkIn and checkOut dates are required');
        }

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);

        if (checkOutDate <= checkInDate) {
            return errorResponse('checkOut must be after checkIn');
        }

        const villa = await prisma.villa.findUnique({
            where: { slug },
            select: { id: true, pricePerNight: true, originalPrice: true },
        });

        if (!villa) {
            return errorResponse('Villa not found', 404);
        }

        // Check for conflicting bookings
        const conflictingBooking = await prisma.booking.findFirst({
            where: {
                villaId: villa.id,
                status: { in: ['CONFIRMED', 'CHECKED_IN'] },
                OR: [
                    {
                        checkIn: { lt: checkOutDate },
                        checkOut: { gt: checkInDate },
                    },
                ],
            },
        });

        // Check for blocked dates
        const blockedDates = await prisma.blockedDate.findMany({
            where: {
                villaId: villa.id,
                date: {
                    gte: checkInDate,
                    lt: checkOutDate,
                },
            },
        });

        const isAvailable = !conflictingBooking && blockedDates.length === 0;

        const nights = Math.ceil(
            (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)
        );

        return successResponse({
            available: isAvailable,
            slug,
            checkIn,
            checkOut,
            nights,
            pricePerNight: villa.pricePerNight,
            subtotal: villa.pricePerNight * nights,
            taxes: Math.round(villa.pricePerNight * nights * 0.18),
            total: Math.round(villa.pricePerNight * nights * 1.18),
            blockedDates: blockedDates.map((bd: { date: Date }) => bd.date),
        });
    } catch (error) {
        return handleError(error);
    }
}
