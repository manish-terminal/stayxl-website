import { NextRequest } from 'next/server';
import { requireAdmin } from '@/app/lib/auth';
import { blockDatesSchema } from '@/app/lib/validators';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * POST /api/admin/block-dates
 * Block dates for a villa (admin only)
 */
export async function POST(req: NextRequest) {
    try {
        await requireAdmin(req);
        // TODO: Call AWS Go Backend /api/admin/block-dates
        return errorResponse('Blocking dates currently unavailable (Backend Migration in Progress)', 503);
    } catch (error) {
        return handleError(error);
    }
}

/**
 * DELETE /api/admin/block-dates
 * Unblock dates for a villa (admin only)
 */
export async function DELETE(req: NextRequest) {
    try {
        await requireAdmin(req);
        // TODO: Call AWS Go Backend /api/admin/block-dates (DELETE)
        return errorResponse('Unblocking dates currently unavailable (Backend Migration in Progress)', 503);
    } catch (error) {
        return handleError(error);
    }
}
