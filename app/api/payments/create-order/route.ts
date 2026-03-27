import { NextRequest } from 'next/server';
import { getRazorpay } from '@/app/lib/razorpay';
import { requireAuth } from '@/app/lib/auth';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * POST /api/payments/create-order
 * Create a Razorpay order for a booking
 */
export async function POST(req: NextRequest) {
    try {
        const { bookingId } = await req.json();
        if (!bookingId) {
            return errorResponse('BookingID is required', 400);
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        
        // 1. Fetch booking from Go backend to get amount
        const bookingRes = await fetch(`${apiUrl}/api/bookings/${bookingId}`);
        const bookingData = await bookingRes.json();

        if (!bookingRes.ok) {
            return errorResponse('Booking not found', 404);
        }

        const booking = bookingData.data;
        const totalAmount = booking.totalAmount || booking.TotalAmount || 0;
        const paymentMode = booking.paymentMode || booking.PaymentMode;

        // 2. Determine payment amount
        // Use the actual amounts calculated by the Go backend for consistency
        let amount = (booking.totalAmount || booking.TotalAmount || 0);
        
        if (paymentMode === 'ADVANCE') {
            amount = (booking.advanceAmount || booking.AdvanceAmount || Math.round(amount * 0.3));
        }
        
        const rzp = getRazorpay();
        const order = await rzp.orders.create({
            amount: amount * 100, // Razorpay expects paise
            currency: 'INR',
            receipt: bookingId,
        });

        return successResponse({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            keyId: process.env.RAZORPAY_KEY_ID,
        });
    } catch (error) {
        return handleError(error);
    }
}

