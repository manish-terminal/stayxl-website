import { NextResponse } from 'next/server';

/**
 * Standard success response
 */
export function successResponse<T>(data: T, status = 200) {
    return NextResponse.json({ success: true, data }, { status });
}

/**
 * Standard error response
 */
export function errorResponse(message: string, status = 400) {
    return NextResponse.json({ success: false, error: message }, { status });
}

/**
 * Handle unexpected errors
 */
export function handleError(error: unknown) {
    console.error('[API Error]', error);

    if (error instanceof Error) {
        if (error.message === 'Unauthorized') {
            return errorResponse('Unauthorized', 401);
        }
        if (error.message === 'Forbidden') {
            return errorResponse('Forbidden', 403);
        }
        return errorResponse(error.message, 500);
    }

    return errorResponse('Internal server error', 500);
}
