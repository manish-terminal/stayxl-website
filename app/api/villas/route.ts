import { NextRequest } from 'next/server';
import prisma from '@/app/lib/prisma';
import { villaQuerySchema } from '@/app/lib/validators';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * GET /api/villas
 * List all villas with optional filters and pagination
 */
export async function GET(req: NextRequest) {
    try {
        const params = Object.fromEntries(req.nextUrl.searchParams);
        const parsed = villaQuerySchema.safeParse(params);

        if (!parsed.success) {
            return errorResponse(parsed.error.issues[0].message);
        }

        const { location, minGuests, minPrice, maxPrice, page, limit } = parsed.data;

        // Build where clause
        const where: Record<string, unknown> = { isActive: true };
        if (location) {
            where.location = { contains: location, mode: 'insensitive' };
        }
        if (minGuests) {
            where.guests = { gte: minGuests };
        }
        if (minPrice || maxPrice) {
            where.pricePerNight = {};
            if (minPrice) (where.pricePerNight as Record<string, number>).gte = minPrice;
            if (maxPrice) (where.pricePerNight as Record<string, number>).lte = maxPrice;
        }

        const [villas, total] = await Promise.all([
            prisma.villa.findMany({
                where,
                include: {
                    images: { orderBy: { sortOrder: 'asc' }, take: 5 },
                    bedrooms: { select: { id: true } },
                    bathrooms: { select: { id: true } },
                    amenities: { select: { name: true }, take: 6 },
                },
                orderBy: [{ isFeatured: 'desc' }, { rating: 'desc' }],
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.villa.count({ where }),
        ]);

        return successResponse({
            villas,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        return handleError(error);
    }
}
