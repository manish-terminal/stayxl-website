import { NextRequest } from 'next/server';
import { requireAdmin } from '@/app/lib/auth';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * GET /api/admin/bookings
 * List all bookings with filters (admin only)
 */
export async function GET(req: NextRequest) {
    try {
        await requireAdmin(req);
        // TODO: Call AWS Go Backend /api/admin/bookings
        return successResponse({
            bookings: [],
            pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
        });
    } catch (error) {
        return handleError(error);
    }
}
