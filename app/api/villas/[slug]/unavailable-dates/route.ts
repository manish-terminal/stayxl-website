import { NextRequest } from 'next/server';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * GET /api/villas/[slug]/unavailable-dates?from=YYYY-MM-DD&to=YYYY-MM-DD
 * Returns all dates that are booked or admin-blocked for the given range
 */
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params;
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        
        if (!apiUrl) {
            console.error('[API Error] NEXT_PUBLIC_API_URL is not defined in environment');
            return errorResponse('Backend API URL not configured. Please check .env file.', 500);
        }

        const backendUrl = `${apiUrl}/api/villas/${slug}/unavailable-dates`;
        
        const response = await fetch(backendUrl);
        const data = await response.json();

        if (!response.ok) {
            return errorResponse(data.error || 'Failed to fetch unavailable dates', response.status);
        }

        return successResponse(data.data);
    } catch (error) {
        return handleError(error);
    }
}
