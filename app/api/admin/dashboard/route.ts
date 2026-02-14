import { NextRequest } from 'next/server';
import prisma from '@/app/lib/prisma';
import { requireAdmin } from '@/app/lib/auth';
import { successResponse, handleError } from '@/app/lib/api-helpers';

/**
 * GET /api/admin/dashboard
 * Admin dashboard stats
 */
export async function GET(req: NextRequest) {
    try {
        await requireAdmin(req);

        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        const [
            totalBookings,
            confirmedBookings,
            monthlyRevenue,
            lastMonthRevenue,
            totalVillas,
            upcomingCheckIns,
            recentBookings,
        ] = await Promise.all([
            prisma.booking.count(),
            prisma.booking.count({ where: { status: 'CONFIRMED' } }),
            prisma.booking.aggregate({
                where: {
                    status: { in: ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT'] },
                    createdAt: { gte: startOfMonth },
                },
                _sum: { total: true },
            }),
            prisma.booking.aggregate({
                where: {
                    status: { in: ['CONFIRMED', 'CHECKED_IN', 'CHECKED_OUT'] },
                    createdAt: { gte: startOfLastMonth, lt: startOfMonth },
                },
                _sum: { total: true },
            }),
            prisma.villa.count({ where: { isActive: true } }),
            prisma.booking.findMany({
                where: {
                    status: 'CONFIRMED',
                    checkIn: { gte: now },
                },
                include: {
                    user: { select: { name: true, phone: true } },
                    villa: { select: { name: true } },
                },
                orderBy: { checkIn: 'asc' },
                take: 10,
            }),
            prisma.booking.findMany({
                include: {
                    user: { select: { name: true } },
                    villa: { select: { name: true } },
                },
                orderBy: { createdAt: 'desc' },
                take: 5,
            }),
        ]);

        const currentRevenue = monthlyRevenue._sum.total || 0;
        const previousRevenue = lastMonthRevenue._sum.total || 0;
        const revenueGrowth =
            previousRevenue > 0
                ? Math.round(((currentRevenue - previousRevenue) / previousRevenue) * 100)
                : 0;

        return successResponse({
            stats: {
                totalBookings,
                confirmedBookings,
                monthlyRevenue: currentRevenue,
                revenueGrowth,
                totalVillas,
            },
            upcomingCheckIns,
            recentBookings,
        });
    } catch (error) {
        return handleError(error);
    }
}
