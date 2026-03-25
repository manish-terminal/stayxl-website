import { NextRequest } from 'next/server';
import { successResponse, handleError } from '@/app/lib/api-helpers';

/**
 * GET /api/offers
 * List all active offers/coupons
 */
export async function GET() {
    try {
        // TODO: Call AWS Go Backend /api/offers
        return successResponse({ offers: [] });
    } catch (error) {
        return handleError(error);
    }
}
