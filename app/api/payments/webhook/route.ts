import { NextRequest } from 'next/server';
import prisma from '@/app/lib/prisma';
import { verifyWebhookSignature } from '@/app/lib/razorpay';
import { successResponse, errorResponse } from '@/app/lib/api-helpers';

/**
 * POST /api/payments/webhook
 * Handle Razorpay webhook events (backup for verify endpoint)
 */
export async function POST(req: NextRequest) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('x-razorpay-signature');

        if (!signature) {
            return errorResponse('Missing webhook signature', 400);
        }

        // Verify webhook signature
        const isValid = verifyWebhookSignature(rawBody, signature);
        if (!isValid) {
            return errorResponse('Invalid webhook signature', 400);
        }

        const event = JSON.parse(rawBody);

        switch (event.event) {
            case 'payment.captured': {
                const paymentEntity = event.payload.payment.entity;
                const razorpayOrderId = paymentEntity.order_id;
                const razorpayPaymentId = paymentEntity.id;

                // Update payment and booking
                const payment = await prisma.payment.findUnique({
                    where: { razorpayOrderId },
                });

                if (payment && payment.status !== 'CAPTURED') {
                    await prisma.$transaction([
                        prisma.payment.update({
                            where: { razorpayOrderId },
                            data: {
                                razorpayPaymentId,
                                status: 'CAPTURED',
                                method: paymentEntity.method,
                            },
                        }),
                        prisma.booking.update({
                            where: { id: payment.bookingId },
                            data: { status: 'CONFIRMED' },
                        }),
                    ]);
                }
                break;
            }

            case 'payment.failed': {
                const paymentEntity = event.payload.payment.entity;
                const razorpayOrderId = paymentEntity.order_id;

                await prisma.payment.updateMany({
                    where: { razorpayOrderId },
                    data: { status: 'FAILED' },
                });
                break;
            }

            case 'refund.processed': {
                const refundEntity = event.payload.refund.entity;
                const razorpayPaymentId = refundEntity.payment_id;

                await prisma.payment.updateMany({
                    where: { razorpayPaymentId },
                    data: {
                        refundId: refundEntity.id,
                        refundAmount: refundEntity.amount,
                        refundStatus: 'processed',
                    },
                });
                break;
            }

            default:
                console.log(`[Webhook] Unhandled event: ${event.event}`);
        }

        return successResponse({ received: true });
    } catch (error) {
        console.error('[Webhook Error]', error);
        return errorResponse('Webhook processing failed', 500);
    }
}
