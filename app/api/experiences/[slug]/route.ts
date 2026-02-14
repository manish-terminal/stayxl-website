import { NextRequest } from 'next/server';
import prisma from '@/app/lib/prisma';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * GET /api/experiences/[slug]
 * Get full experience details
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;

        const experience = await prisma.experience.findUnique({
            where: { slug },
            include: {
                services: true,
                villas: {
                    include: {
                        villa: {
                            select: {
                                slug: true,
                                name: true,
                                location: true,
                                guests: true,
                                bedroomCount: true,
                                images: { take: 1, orderBy: { sortOrder: 'asc' } },
                            },
                        },
                    },
                },
            },
        });

        if (!experience) {
            return errorResponse('Experience not found', 404);
        }

        // Flatten villas from the join table
        const responseData = {
            ...experience,
            villas: experience.villas.map((ve: any) => ({
                ...ve.villa,
                image: ve.villa.images[0]?.url,
            })),
        };

        return successResponse(responseData);
    } catch (error) {
        return handleError(error);
    }
}
