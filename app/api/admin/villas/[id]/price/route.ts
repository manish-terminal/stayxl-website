import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/app/lib/auth';
import { handleError } from '@/app/lib/api-helpers';

const GO_BACKEND = process.env.GO_BACKEND_URL || 'https://your-api-gateway.execute-api.ap-south-1.amazonaws.com/Prod';
const ADMIN_KEY = process.env.ADMIN_API_KEY || 'stayxl-admin-secret-2026';

/**
 * PUT /api/admin/villas/[id]/price
 * Update base price for a villa (admin only)
 */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await requireAdmin(req);
        const { id } = await params;
        const body = await req.json();

        const res = await fetch(`${GO_BACKEND}/api/admin/villas/${id}/price`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'X-Admin-Key': ADMIN_KEY },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return handleError(error);
    }
}
