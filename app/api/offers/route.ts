import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * GET /api/offers
 * List all active offers/coupons
 */
export async function GET() {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const backendUrl = `${apiUrl}/api/offers`;
        
        const response = await fetch(backendUrl);
        const data = await response.json();

        if (!response.ok) {
            return errorResponse(data.error || 'Failed to fetch offers', response.status);
        }

        return successResponse(data.data);
    } catch (error) {
        return handleError(error);
    }
}
