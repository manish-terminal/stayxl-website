import { NextRequest } from 'next/server';
import { villaQuerySchema } from '@/app/lib/validators';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * GET /api/villas
 * List all villas with optional filters and pagination
 */
export async function GET(req: NextRequest) {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        if (!apiUrl) {
            return errorResponse('Backend API URL not configured', 500);
        }

        const response = await fetch(`${apiUrl}/api/villas`);
        const data = await response.json();

        if (!response.ok) {
            return errorResponse(data.error || 'Failed to fetch villas', response.status);
        }

        return successResponse({
            villas: data.data || [],
            pagination: {
                page: 1,
                limit: (data.data || []).length,
                total: (data.data || []).length,
                totalPages: 1,
            },
        });
    } catch (error) {
        return handleError(error);
    }
}
