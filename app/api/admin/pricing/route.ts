import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/app/lib/auth';
import { handleError } from '@/app/lib/api-helpers';

const GO_BACKEND = process.env.GO_BACKEND_URL || 'https://your-api-gateway.execute-api.ap-south-1.amazonaws.com/Prod';
const ADMIN_KEY = process.env.ADMIN_API_KEY || 'stayxl-admin-secret-2026';

/**
 * POST /api/admin/pricing
 * Set date-specific price override (admin only)
 */
export async function POST(req: NextRequest) {
    try {
        await requireAdmin(req);
        const body = await req.json();

        const res = await fetch(`${GO_BACKEND}/api/admin/pricing`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Admin-Key': ADMIN_KEY },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return handleError(error);
    }
}

/**
 * GET /api/admin/pricing?villaId=...
 * List date-specific pricing for a villa (admin only)
 */
export async function GET(req: NextRequest) {
    try {
        await requireAdmin(req);
        const villaId = req.nextUrl.searchParams.get('villaId');

        const res = await fetch(`${GO_BACKEND}/api/admin/pricing?villaId=${villaId}`, {
            headers: { 'X-Admin-Key': ADMIN_KEY },
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return handleError(error);
    }
}

/**
 * DELETE /api/admin/pricing?id=...
 * Delete a date-specific price override (admin only)
 */
export async function DELETE(req: NextRequest) {
    try {
        await requireAdmin(req);
        const id = req.nextUrl.searchParams.get('id');

        const res = await fetch(`${GO_BACKEND}/api/admin/pricing/${id}`, {
            method: 'DELETE',
            headers: { 'X-Admin-Key': ADMIN_KEY },
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return handleError(error);
    }
}
