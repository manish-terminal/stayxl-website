import { NextRequest } from 'next/server';
import { getAuthUser } from '@/app/lib/auth';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
export async function GET(req: NextRequest) {
    try {
        const token = req.headers.get('authorization');
        if (!token) {
            return errorResponse('Not authenticated', 401);
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const backendUrl = `${apiUrl}/api/auth/me`;
        
        const response = await fetch(backendUrl, {
            headers: { 'Authorization': token }
        });
        const data = await response.json();

        if (!response.ok) {
            return errorResponse(data.error || 'Failed to fetch user', response.status);
        }

        return successResponse(data.data);
    } catch (error) {
        return handleError(error);
    }
}
