import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * GET /api/experiences
 * List all active experiences
 */
export async function GET() {
    try {
        // TODO: Call AWS Go Backend /api/experiences
        return successResponse({ experiences: [] });
    } catch (error) {
        return handleError(error);
    }
}
