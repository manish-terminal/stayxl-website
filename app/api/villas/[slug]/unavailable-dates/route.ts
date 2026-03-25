import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * GET /api/villas/[slug]/unavailable-dates?from=YYYY-MM-DD&to=YYYY-MM-DD
 * Returns all dates that are booked or admin-blocked for the given range
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        // TODO: Call AWS Go Backend /api/villas/{slug}/unavailable-dates
        return successResponse({ unavailableDates: [], message: 'Backend Migration in Progress' });
    } catch (error) {
        return handleError(error);
    }
}
