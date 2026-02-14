import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';
import { generateToken } from '@/app/lib/auth';
import { verifyOtpSchema } from '@/app/lib/validators';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * POST /api/auth/verify-otp
 * Verify OTP and return JWT token
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = verifyOtpSchema.safeParse(body);

        if (!parsed.success) {
            return errorResponse(parsed.error.issues[0].message);
        }

        const { phone, otp } = parsed.data;

        // Find the latest unverified OTP for this phone
        const otpRecord = await prisma.otp.findFirst({
            where: {
                phone,
                code: otp,
                verified: false,
                expiresAt: { gt: new Date() },
            },
            orderBy: { createdAt: 'desc' },
        });

        if (!otpRecord) {
            return errorResponse('Invalid or expired OTP', 401);
        }

        // Mark OTP as verified
        await prisma.otp.update({
            where: { id: otpRecord.id },
            data: { verified: true },
        });

        // Mark user's phone as verified
        const user = await prisma.user.update({
            where: { phone },
            data: { phoneVerified: true },
        });

        // Generate JWT
        const token = generateToken({
            userId: user.id,
            phone: user.phone ?? undefined,
            email: user.email ?? undefined,
            role: user.role,
        });

        // Set httpOnly cookie
        const response = successResponse({
            message: 'OTP verified',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role,
            },
            token,
        });

        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/',
        });

        return response;
    } catch (error) {
        return handleError(error);
    }
}
