import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * GET /api/experiences/[slug]
 * Get full experience details
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        // TODO: Call AWS Go Backend /api/experiences/{slug}
        return errorResponse('Experience not found (Backend Migration in Progress)', 404);
    } catch (error) {
        return handleError(error);
    }
}
