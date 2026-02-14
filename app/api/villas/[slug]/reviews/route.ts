import { NextRequest } from 'next/server';
import prisma from '@/app/lib/prisma';
import { requireAdmin } from '@/app/lib/auth';
import { createReviewSchema } from '@/app/lib/validators';
import { requireAuth } from '@/app/lib/auth';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * GET /api/villas/[slug]/reviews?page=1&limit=10
 * Get paginated reviews for a villa
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const page = parseInt(req.nextUrl.searchParams.get('page') || '1');
        const limit = parseInt(req.nextUrl.searchParams.get('limit') || '10');

        const villa = await prisma.villa.findUnique({
            where: { slug },
            select: { id: true, rating: true, reviewCount: true },
        });

        if (!villa) {
            return errorResponse('Villa not found', 404);
        }

        const [reviews, total] = await Promise.all([
            prisma.review.findMany({
                where: { villaId: villa.id, isVisible: true },
                include: {
                    user: { select: { name: true, avatar: true } },
                },
                orderBy: { createdAt: 'desc' },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.review.count({ where: { villaId: villa.id, isVisible: true } }),
        ]);

        return successResponse({
            reviews,
            averageRating: villa.rating,
            totalReviews: total,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        return handleError(error);
    }
}

/**
 * POST /api/villas/[slug]/reviews
 * Submit a review for a villa (authenticated users only)
 */
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const user = await requireAuth(req);
        const { slug } = await params;
        const body = await req.json();

        const villa = await prisma.villa.findUnique({
            where: { slug },
            select: { id: true },
        });

        if (!villa) {
            return errorResponse('Villa not found', 404);
        }

        const parsed = createReviewSchema.safeParse({ ...body, villaId: villa.id });
        if (!parsed.success) {
            return errorResponse(parsed.error.issues[0].message);
        }

        // Check if user has a completed booking at this villa
        const hasStayed = await prisma.booking.findFirst({
            where: {
                userId: user.id,
                villaId: villa.id,
                status: { in: ['CHECKED_OUT', 'CONFIRMED'] },
            },
        });

        if (!hasStayed) {
            return errorResponse('You can only review villas you have stayed at');
        }

        // Check for existing review
        const existingReview = await prisma.review.findFirst({
            where: { userId: user.id, villaId: villa.id },
        });

        if (existingReview) {
            return errorResponse('You have already reviewed this villa');
        }

        const review = await prisma.review.create({
            data: {
                userId: user.id,
                villaId: villa.id,
                rating: parsed.data.rating,
                comment: parsed.data.comment,
                platform: 'StayXL',
            },
        });

        // Update villa rating
        const avgRating = await prisma.review.aggregate({
            where: { villaId: villa.id, isVisible: true },
            _avg: { rating: true },
            _count: { rating: true },
        });

        await prisma.villa.update({
            where: { id: villa.id },
            data: {
                rating: Math.round((avgRating._avg.rating || 0) * 10) / 10,
                reviewCount: avgRating._count.rating,
            },
        });

        return successResponse(review, 201);
    } catch (error) {
        return handleError(error);
    }
}
