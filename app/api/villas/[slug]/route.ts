import { NextRequest } from 'next/server';
import prisma from '@/app/lib/prisma';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * GET /api/villas/[slug]
 * Get full villa details
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const villa = await prisma.villa.findUnique({
            where: { slug },
            include: {
                images: { orderBy: { sortOrder: 'asc' } },
                bedrooms: true,
                bathrooms: true,
                spaces: true,
                amenities: true,
                locationInfo: true,
                policies: true,
                reviews: {
                    where: { isVisible: true },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                    include: {
                        user: {
                            select: { name: true, avatar: true },
                        },
                    },
                },
                experiences: {
                    include: {
                        experience: {
                            select: {
                                id: true,
                                slug: true,
                                heading: true,
                                heroImage: true,
                            },
                        },
                    },
                },
            },
        });

        if (!villa) {
            return errorResponse('Villa not found', 404);
        }

        // Group amenities by category
        const groupedAmenities: Record<string, string[]> = {};
        villa.amenities.forEach((a: { category: string; name: string }) => {
            if (!groupedAmenities[a.category]) groupedAmenities[a.category] = [];
            groupedAmenities[a.category].push(a.name);
        });

        return successResponse({
            ...villa,
            amenities: groupedAmenities,
        });
    } catch (error) {
        return handleError(error);
    }
}
