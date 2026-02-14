import { NextRequest } from 'next/server';
import prisma from '@/app/lib/prisma';
import { requireAuth } from '@/app/lib/auth';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * GET /api/bookings/[id]
 * Get booking details
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await requireAuth(req);
        const { id } = await params;

        const booking = await prisma.booking.findUnique({
            where: { id },
            include: {
                villa: {
                    select: {
                        name: true,
                        slug: true,
                        location: true,
                        images: { take: 3, orderBy: { sortOrder: 'asc' } },
                    },
                },
                payment: true,
                addons: true,
            },
        });

        if (!booking) {
            return errorResponse('Booking not found', 404);
        }

        // Users can only see their own bookings; admins can see any
        if (booking.userId !== user.id && user.role === 'USER') {
            return errorResponse('Forbidden', 403);
        }

        return successResponse({ booking });
    } catch (error) {
        return handleError(error);
    }
}

/**
 * DELETE /api/bookings/[id]
 * Cancel a booking
 */
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const user = await requireAuth(req);
        const { id } = await params;

        const booking = await prisma.booking.findUnique({
            where: { id },
            include: { villa: { select: { policies: true } } },
        });

        if (!booking) {
            return errorResponse('Booking not found', 404);
        }

        if (booking.userId !== user.id && user.role === 'USER') {
            return errorResponse('Forbidden', 403);
        }

        if (['CANCELLED', 'REFUNDED', 'CHECKED_OUT'].includes(booking.status)) {
            return errorResponse('Booking cannot be cancelled');
        }

        // Determine refund amount based on cancellation policy
        const daysUntilCheckIn = Math.ceil(
            (booking.checkIn.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
        );

        let refundPercentage = 0;
        if (daysUntilCheckIn > 30) {
            refundPercentage = 100;
        } else if (daysUntilCheckIn >= 15) {
            refundPercentage = 50;
        }
        // Less than 15 days: no refund

        const updatedBooking = await prisma.booking.update({
            where: { id },
            data: {
                status: 'CANCELLED',
            },
        });

        // TODO: Initiate Razorpay refund if payment was captured
        // The refund amount would be: Math.round(booking.total * refundPercentage / 100)

        return successResponse({
            booking: updatedBooking,
            refundPercentage,
            refundAmount: Math.round((booking.total * refundPercentage) / 100),
            message:
                refundPercentage > 0
                    ? `Booking cancelled. ${refundPercentage}% refund will be processed within 5-7 business days.`
                    : 'Booking cancelled. No refund applicable as per cancellation policy.',
        });
    } catch (error) {
        return handleError(error);
    }
}
