import { NextRequest } from 'next/server';
import { generateOtp, generateToken } from '@/app/lib/auth';
import { sendOtpSchema } from '@/app/lib/validators';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * POST /api/auth/send-otp
 * Send OTP to a phone number
 */
export async function POST(req: NextRequest) {
    try {
        // TODO: Call AWS Go Backend /api/auth/otp
        return errorResponse('Auth currently unavailable (Backend Migration in Progress)', 503);
    } catch (error) {
        return handleError(error);
    }
}
