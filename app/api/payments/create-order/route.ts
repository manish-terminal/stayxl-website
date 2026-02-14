import { NextRequest } from 'next/server';
import prisma from '@/app/lib/prisma';
import { razorpay } from '@/app/lib/razorpay';
import { requireAuth } from '@/app/lib/auth';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * POST /api/payments/create-order
 * Create a Razorpay order for a booking
 */
export async function POST(req: NextRequest) {
    try {
        const user = await requireAuth(req);
        const { bookingId } = await req.json();

        if (!bookingId) {
            return errorResponse('bookingId is required');
        }

        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { payment: true },
        });

        if (!booking) {
            return errorResponse('Booking not found', 404);
        }

        if (booking.userId !== user.id) {
            return errorResponse('Forbidden', 403);
        }

        if (booking.status !== 'PENDING') {
            return errorResponse('Booking is not in pending state');
        }

        // If a Razorpay order already exists, return it
        if (booking.payment?.razorpayOrderId) {
            return successResponse({
                orderId: booking.payment.razorpayOrderId,
                amount: booking.payment.amount,
                currency: booking.payment.currency,
                keyId: process.env.RAZORPAY_KEY_ID,
                paymentMode: booking.paymentMode,
                totalAmount: booking.total * 100,
            });
        }

        // Determine the amount to charge now
        // ADVANCE mode = 30% of total, FULL mode = 100%
        const chargeAmount = booking.paymentMode === 'ADVANCE'
            ? booking.advanceAmount!
            : booking.total;
        const amountInPaise = chargeAmount * 100;

        const razorpayOrder = await razorpay.orders.create({
            amount: amountInPaise,
            currency: 'INR',
            receipt: `booking_${booking.id}`,
            notes: {
                bookingId: booking.id,
                userId: user.id,
                villaId: booking.villaId,
                paymentMode: booking.paymentMode,
            },
        });

        // Store payment record
        await prisma.payment.create({
            data: {
                bookingId: booking.id,
                razorpayOrderId: razorpayOrder.id,
                amount: amountInPaise,
                currency: 'INR',
                status: 'CREATED',
            },
        });

        return successResponse({
            orderId: razorpayOrder.id,
            amount: amountInPaise,
            currency: 'INR',
            keyId: process.env.RAZORPAY_KEY_ID,
            paymentMode: booking.paymentMode,
            totalAmount: booking.total * 100,
            balanceAmount: booking.balanceAmount ? booking.balanceAmount * 100 : null,
        });
    } catch (error) {
        return handleError(error);
    }
}

