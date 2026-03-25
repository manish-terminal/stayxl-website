import { NextRequest } from 'next/server';
import { requireAdmin } from '@/app/lib/auth';
import { successResponse, handleError } from '@/app/lib/api-helpers';

/**
 * GET /api/admin/dashboard
 * Admin dashboard stats
 */
export async function GET(req: NextRequest) {
    try {
        await requireAdmin(req);
        // TODO: Call AWS Go Backend /api/admin/dashboard
        return successResponse({
            stats: {
                totalBookings: 0,
                confirmedBookings: 0,
                monthlyRevenue: 0,
                revenueGrowth: 0,
                totalVillas: 0,
            },
            upcomingCheckIns: [],
            recentBookings: [],
        });
    } catch (error) {
        return handleError(error);
    }
}
