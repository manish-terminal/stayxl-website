import { NextRequest } from 'next/server';
import prisma from '@/app/lib/prisma';
import { validateOfferSchema } from '@/app/lib/validators';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * POST /api/offers/validate
 * Validate a coupon code and return discount info
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = validateOfferSchema.safeParse(body);

        if (!parsed.success) {
            return errorResponse(parsed.error.issues[0].message);
        }

        const { code, bookingAmount } = parsed.data;

        const offer = await prisma.offer.findUnique({
            where: { code },
        });

        if (!offer || !offer.isActive) {
            return errorResponse('Invalid coupon code');
        }

        if (new Date() > offer.validTill) {
            return errorResponse('This coupon has expired');
        }

        if (offer.usageLimit && offer.usedCount >= offer.usageLimit) {
            return errorResponse('This coupon has reached its usage limit');
        }

        if (offer.minBookingAmount && bookingAmount < offer.minBookingAmount) {
            return errorResponse(
                `Minimum booking amount for this coupon is ₹${offer.minBookingAmount.toLocaleString('en-IN')}`
            );
        }

        // Calculate discount
        let discount =
            offer.discountType === 'PERCENTAGE'
                ? Math.round(bookingAmount * (offer.discountValue / 100))
                : offer.discountValue;

        if (offer.maxDiscount && discount > offer.maxDiscount) {
            discount = offer.maxDiscount;
        }

        return successResponse({
            valid: true,
            code: offer.code,
            title: offer.title,
            discountType: offer.discountType,
            discountValue: offer.discountValue,
            discount,
            finalAmount: bookingAmount - discount,
        });
    } catch (error) {
        return handleError(error);
    }
}
