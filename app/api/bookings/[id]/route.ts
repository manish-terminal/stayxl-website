import { NextRequest } from 'next/server';
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
        return errorResponse('Booking not found (Backend Migration in Progress)', 404);
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
        return errorResponse('Cancellation currently unavailable (Backend Migration in Progress)', 503);
    } catch (error) {
        return handleError(error);
    }
}
