import { NextRequest } from 'next/server';
import prisma from '@/app/lib/prisma';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * GET /api/villas/[slug]/unavailable-dates?from=YYYY-MM-DD&to=YYYY-MM-DD
 * Returns all dates that are booked or admin-blocked for the given range
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const from = req.nextUrl.searchParams.get('from');
        const to = req.nextUrl.searchParams.get('to');

        // Default: from today to 3 months out
        const fromDate = from ? new Date(from) : new Date();
        const toDate = to
            ? new Date(to)
            : new Date(new Date().setMonth(new Date().getMonth() + 3));

        const villa = await prisma.villa.findUnique({
            where: { slug },
            select: { id: true },
        });

        if (!villa) {
            return errorResponse('Villa not found', 404);
        }

        // Fetch confirmed/checked-in bookings that overlap the range
        const bookings = await prisma.booking.findMany({
            where: {
                villaId: villa.id,
                status: { in: ['CONFIRMED', 'CHECKED_IN'] },
                checkOut: { gt: fromDate },
                checkIn: { lt: toDate },
            },
            select: { checkIn: true, checkOut: true },
        });

        // Fetch admin-blocked dates in the range
        const blockedDates = await prisma.blockedDate.findMany({
            where: {
                villaId: villa.id,
                date: { gte: fromDate, lt: toDate },
            },
            select: { date: true },
        });

        // Build a set of all unavailable date strings (YYYY-MM-DD)
        const unavailableSet = new Set<string>();

        // Add all days within each booking range
        for (const booking of bookings) {
            const start = new Date(Math.max(booking.checkIn.getTime(), fromDate.getTime()));
            const end = new Date(Math.min(booking.checkOut.getTime(), toDate.getTime()));
            const current = new Date(start);
            while (current < end) {
                unavailableSet.add(current.toISOString().split('T')[0]);
                current.setDate(current.getDate() + 1);
            }
        }

        // Add blocked dates
        for (const bd of blockedDates) {
            unavailableSet.add(bd.date.toISOString().split('T')[0]);
        }

        const unavailableDates = Array.from(unavailableSet).sort();

        return successResponse({ unavailableDates, from: fromDate.toISOString().split('T')[0], to: toDate.toISOString().split('T')[0] });
    } catch (error) {
        return handleError(error);
    }
}
