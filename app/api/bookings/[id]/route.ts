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
        const { id } = await params;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        
        const response = await fetch(`${apiUrl}/api/bookings/${id}`);
        const data = await response.json();

        if (!response.ok) {
            return errorResponse(data.error || 'Booking not found', response.status);
        }

        return successResponse(data.data);
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
