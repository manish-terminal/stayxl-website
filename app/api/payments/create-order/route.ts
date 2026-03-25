import { NextRequest } from 'next/server';
import { razorpay } from '@/app/lib/razorpay';
import { requireAuth } from '@/app/lib/auth';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * POST /api/payments/create-order
 * Create a Razorpay order for a booking
 */
export async function POST(req: NextRequest) {
    try {
        // TODO: Call AWS Go Backend /api/payments/create-order
        return errorResponse('Payment currently unavailable (Backend Migration in Progress)', 503);
    } catch (error) {
        return handleError(error);
    }
}

