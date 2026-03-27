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
        const body = await req.json();
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        
        const response = await fetch(`${apiUrl}/api/bookings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const error = await response.json();
            return errorResponse(error.error || 'Failed to create booking on backend', response.status);
        }

        const data = await response.json();
        return successResponse(data.data);
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
