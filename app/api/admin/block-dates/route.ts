import { NextRequest } from 'next/server';
import prisma from '@/app/lib/prisma';
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
        const body = await req.json();
        const parsed = blockDatesSchema.safeParse(body);

        if (!parsed.success) {
            return errorResponse(parsed.error.issues[0].message);
        }

        const { villaId, dates, reason } = parsed.data;

        // Verify villa exists
        const villa = await prisma.villa.findUnique({
            where: { id: villaId },
            select: { id: true, name: true },
        });

        if (!villa) {
            return errorResponse('Villa not found', 404);
        }

        // Upsert blocked dates
        const blockedDates = await Promise.all(
            dates.map((dateStr: string) =>
                prisma.blockedDate.upsert({
                    where: {
                        villaId_date: {
                            villaId,
                            date: new Date(dateStr),
                        },
                    },
                    update: { reason },
                    create: {
                        villaId,
                        date: new Date(dateStr),
                        reason,
                    },
                })
            )
        );

        return successResponse({
            message: `${blockedDates.length} date(s) blocked for ${villa.name}`,
            blockedDates,
        });
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
        const { villaId, dates } = await req.json();

        if (!villaId || !dates?.length) {
            return errorResponse('villaId and dates are required');
        }

        await prisma.blockedDate.deleteMany({
            where: {
                villaId,
                date: { in: dates.map((d: string) => new Date(d)) },
            },
        });

        return successResponse({ message: `${dates.length} date(s) unblocked` });
    } catch (error) {
        return handleError(error);
    }
}
