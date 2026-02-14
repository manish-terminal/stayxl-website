import { NextRequest } from 'next/server';
import { getAuthUser } from '@/app/lib/auth';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
export async function GET(req: NextRequest) {
    try {
        const user = await getAuthUser(req);
        if (!user) {
            return errorResponse('Not authenticated', 401);
        }
        return successResponse({ user });
    } catch (error) {
        return handleError(error);
    }
}
