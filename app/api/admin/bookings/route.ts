import { NextRequest } from 'next/server';
import prisma from '@/app/lib/prisma';
import { requireAdmin } from '@/app/lib/auth';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * GET /api/admin/bookings
 * List all bookings with filters (admin only)
 */
export async function GET(req: NextRequest) {
    try {
        await requireAdmin(req);

        const status = req.nextUrl.searchParams.get('status') ?? undefined;
        const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
        const limit = parseInt(req.nextUrl.searchParams.get('limit') || '20');

        const where: Record<string, unknown> = {};
        if (status) where.status = status;

        const [bookings, total] = await Promise.all([
            prisma.booking.findMany({
                where,
                include: {
                    user: { select: { name: true, email: true, phone: true } },
                    villa: { select: { name: true, slug: true, location: true } },
                    payment: { select: { status: true, razorpayPaymentId: true, amount: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.booking.count({ where }),
        ]);

        return successResponse({
            bookings,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        return handleError(error);
    }
}
