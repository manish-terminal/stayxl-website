import { NextRequest } from 'next/server';
import prisma from '@/app/lib/prisma';
import { successResponse, handleError } from '@/app/lib/api-helpers';

/**
 * GET /api/offers
 * List all active offers/coupons
 */
export async function GET() {
    try {
        const offers = await prisma.offer.findMany({
            where: {
                isActive: true,
                validTill: { gt: new Date() },
            },
            select: {
                code: true,
                title: true,
                description: true,
                discountType: true,
                discountValue: true,
                minBookingAmount: true,
                maxDiscount: true,
                validTill: true,
            },
            orderBy: { validTill: 'asc' },
        });

        return successResponse({ offers });
    } catch (error) {
        return handleError(error);
    }
}
