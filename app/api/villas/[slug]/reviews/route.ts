import { NextRequest } from 'next/server';
import { requireAdmin } from '@/app/lib/auth';
import { createReviewSchema } from '@/app/lib/validators';
import { requireAuth } from '@/app/lib/auth';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * GET /api/villas/[slug]/reviews?page=1&limit=10
 * Get paginated reviews for a villa
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        return successResponse({
            reviews: [],
            averageRating: 0,
            totalReviews: 0,
            pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
        });
    } catch (error) {
        return handleError(error);
    }
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        return errorResponse('Reviews currently unavailable (Backend Migration in Progress)', 503);
    } catch (error) {
        return handleError(error);
    }
}
