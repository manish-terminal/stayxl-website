import { NextRequest } from 'next/server';
import prisma from '@/app/lib/prisma';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * GET /api/experiences
 * List all active experiences
 */
export async function GET() {
    try {
        const experiences = await prisma.experience.findMany({
            where: { isActive: true },
            select: {
                id: true,
                slug: true,
                caption: true,
                heading: true,
                subtext: true,
                heroImage: true,
            },
            orderBy: { createdAt: 'asc' },
        });

        return successResponse({ experiences });
    } catch (error) {
        return handleError(error);
    }
}
