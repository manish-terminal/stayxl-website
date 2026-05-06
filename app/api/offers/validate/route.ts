import { NextRequest } from 'next/server';
import { validateOfferSchema } from '@/app/lib/validators';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * POST /api/offers/validate
 * Validate a coupon code and return discount info
 */
export async function POST(req: NextRequest) {
    try {
        const { code, bookingAmount } = await req.json();
        
        if (!code) {
            return errorResponse('Coupon code is required', 400);
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        const response = await fetch(`${apiUrl}/api/offers/validate?code=${code.toUpperCase()}`);
        const data = await response.json();

        if (!response.ok) {
            return errorResponse(data.error || 'Invalid coupon code', response.status);
        }

        const offer = data.data;

        // Additional validation on the proxy (optional, but good for UX)
        if (bookingAmount < offer.minAmount) {
            return errorResponse(`This coupon requires a minimum booking amount of ₹${offer.minAmount}`, 400);
        }

        const now = new Date();
        const validTill = new Date(offer.validTill);
        if (now > validTill) {
            return errorResponse('This coupon has expired', 400);
        }

        return successResponse(offer);
    } catch (error) {
        return handleError(error);
    }
}
