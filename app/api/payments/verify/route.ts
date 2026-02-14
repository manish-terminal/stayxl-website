import { NextRequest } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyPaymentSignature } from '@/app/lib/razorpay';
import { requireAuth } from '@/app/lib/auth';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * POST /api/payments/verify
 * Verify Razorpay payment signature and confirm booking
 */
export async function POST(req: NextRequest) {
    try {
        const user = await requireAuth(req);
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();

        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
            return errorResponse('Missing payment verification data');
        }

        // Verify signature
        const isValid = verifyPaymentSignature({
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
            signature: razorpaySignature,
        });

        if (!isValid) {
            return errorResponse('Payment verification failed', 400);
        }

        // Update payment and booking in a transaction
        const result = await prisma.$transaction(async (tx) => {
            const payment = await tx.payment.update({
                where: { razorpayOrderId },
                data: {
                    razorpayPaymentId,
                    razorpaySignature,
                    status: 'CAPTURED',
                },
            });

            const booking = await tx.booking.update({
                where: { id: payment.bookingId },
                data: { status: 'CONFIRMED' },
                include: {
                    villa: { select: { name: true, slug: true, location: true } },
                    addons: true,
                },
            });

            return { booking, payment };
        });

        // TODO: Send confirmation email/SMS

        return successResponse({
            message: 'Payment verified and booking confirmed!',
            booking: result.booking,
        });
    } catch (error) {
        return handleError(error);
    }
}
