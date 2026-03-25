import { NextRequest } from 'next/server';
import { getAuthUser, requireAuth } from '@/app/lib/auth';
import { createBookingSchema } from '@/app/lib/validators';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * POST /api/bookings
 * Create a new booking
 */
export async function POST(req: NextRequest) {
    try {
        // TODO: Call AWS Go Backend /api/bookings
        return errorResponse('Booking creation currently unavailable (Backend Migration in Progress)', 503);
    } catch (error) {
        return handleError(error);
    }
}

/**
 * GET /api/bookings
 * Get current user's bookings
 */
export async function GET(req: NextRequest) {
    try {
        // TODO: Call AWS Go Backend /api/bookings (user specific)
        return successResponse({ bookings: [] });
    } catch (error) {
        return handleError(error);
    }
}
