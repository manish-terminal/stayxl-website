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

        // 2. Create Razorpay order
        // BookingSidebar.jsx handles ADVANCE vs FULL. 
        // For simplicity, we create order for the amount requested or booking total.
        // The Go backend already has PaymentMode.
        
        // Calculate amount in paise
        let amount = totalAmount;
        if (paymentMode === 'ADVANCE') {
            // Calculate 30% + security deposit (if applicable)
            // For now, use the totalAmount as a fallback
            amount = Math.round(totalAmount * 0.3);
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

