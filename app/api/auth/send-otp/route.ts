import { NextRequest } from 'next/server';
import prisma from '@/app/lib/prisma';
import { generateOtp, generateToken } from '@/app/lib/auth';
import { sendOtpSchema } from '@/app/lib/validators';
import { successResponse, errorResponse, handleError } from '@/app/lib/api-helpers';

/**
 * POST /api/auth/send-otp
 * Send OTP to a phone number
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const parsed = sendOtpSchema.safeParse(body);

        if (!parsed.success) {
            return errorResponse(parsed.error.issues[0].message);
        }

        const { phone } = parsed.data;
        const otp = generateOtp();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

        // Find or create user
        let user = await prisma.user.findUnique({ where: { phone } });
        if (!user) {
            user = await prisma.user.create({ data: { phone } });
        }

        // Invalidate previous OTPs
        await prisma.otp.updateMany({
            where: { phone, verified: false },
            data: { verified: true },
        });

        // Create new OTP
        await prisma.otp.create({
            data: {
                userId: user.id,
                phone,
                code: otp,
                expiresAt,
            },
        });

        // TODO: Integrate with SMS provider (MSG91, Twilio, etc.)
        // For now, log OTP in development
        if (process.env.NODE_ENV === 'development') {
            console.log(`[DEV] OTP for ${phone}: ${otp}`);
        }

        return successResponse({ message: 'OTP sent successfully', phone });
    } catch (error) {
        return handleError(error);
    }
}
