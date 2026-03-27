import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * GET /api/villas/[slug]/availability?checkIn=YYYY-MM-DD&checkOut=YYYY-MM-DD
 * Check villa availability for given dates
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const { searchParams } = new URL(req.url);
        const checkIn = searchParams.get('checkIn');
        const checkOut = searchParams.get('checkOut');

        if (!checkIn || !checkOut) {
            return errorResponse('Dates are required', 400);
        }

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        // Map checkIn/checkOut to startDate/endDate for Go backend
        const backendUrl = `${apiUrl}/api/villas/${slug}/availability?startDate=${checkIn}T00:00:00Z&endDate=${checkOut}T00:00:00Z`;
        
        const response = await fetch(backendUrl);
        const data = await response.json();

        if (!response.ok) {
            return errorResponse(data.error || 'Failed to check availability', response.status);
        }

        return successResponse(data.data);
    } catch (error) {
        return handleError(error);
    }
}
