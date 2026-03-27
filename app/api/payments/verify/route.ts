import { NextRequest } from 'next/server';
import { verifyPaymentSignature } from '@/app/lib/razorpay';
import { requireAuth } from '@/app/lib/auth';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * POST /api/payments/verify
 * Verify Razorpay payment signature and confirm booking
 */
export async function POST(req: NextRequest) {
    try {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature, bookingId } = await req.json();
        
        if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature || !bookingId) {
            return errorResponse('Missing verification data', 400);
        }

        // 1. Verify signature locally
        const isValid = verifyPaymentSignature({
            orderId: razorpayOrderId,
            paymentId: razorpayPaymentId,
            signature: razorpaySignature,
        });

        if (!isValid) {
            return errorResponse('Invalid payment signature', 400);
        }

        // 2. Notify Go backend to update booking status
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const response = await fetch(`${apiUrl}/api/payments/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                bookingId,
                status: 'CONFIRMED',
                paymentId: razorpayPaymentId,
                orderId: razorpayOrderId,
            }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            return errorResponse(error.error || 'Failed to update booking on backend', response.status);
        }

        // 3. Get updated booking details
        const bookingRes = await fetch(`${apiUrl}/api/bookings/${bookingId}`);
        const bookingData = await bookingRes.json();

        return successResponse({
            message: 'Payment verified and booking confirmed',
            booking: bookingData.data || bookingData.Data,
        });
    } catch (error) {
        return handleError(error);
    }
}
