import { NextRequest } from 'next/server';
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
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || '';
        
        if (!apiUrl) {
            return errorResponse('Backend API URL not configured', 500);
        }

        const response = await fetch(`${apiUrl}/api/villas/${slug}`);
        const data = await response.json();

        if (!response.ok) {
            return errorResponse(data.error || 'Villa not found', response.status);
        }

        return successResponse(data.data);
    } catch (error) {
        return handleError(error);
    }
}
