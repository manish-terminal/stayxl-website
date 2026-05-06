import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = '7d';

export interface JwtPayload {
    userId: string;
    email?: string;
    phone?: string;
    role: string;
}

/**
 * Generate a JWT token for a user
 */
export function generateToken(payload: JwtPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JwtPayload | null {
    try {
        return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch {
        return null;
    }
}

/**
 * Extract the authenticated user from a request
 * Checks Authorization header (Bearer token) and cookies
 */
export async function getAuthUser(req: NextRequest) {
    // Check Authorization header first
    let token = req.headers.get('authorization')?.replace('Bearer ', '');

    // Fallback to cookie
    if (!token) {
        token = req.cookies.get('token')?.value ?? undefined;
    }

    if (!token) {
        // DEVELOPMENT BYPASS: Return mock admin if no token during local dev
        if (process.env.NODE_ENV === 'development') {
            return {
                id: 'dev-admin-id',
                email: 'admin@stayxl.com',
                phone: '9999999999',
                role: 'ADMIN',
                name: 'Dev Admin',
            };
        }
        return null;
    }

    const payload = verifyToken(token);
    if (!payload) {
        // DEVELOPMENT BYPASS: Allow local testing without a real token
        if (process.env.NODE_ENV === 'development') {
            return {
                id: 'dev-admin-id',
                email: 'admin@stayxl.com',
                phone: '9999999999',
                role: 'ADMIN',
                name: 'Dev Admin',
            };
        }
        return null;
    }

    // TODO: Replace with call to AWS Go Backend /api/users/me
    return {
        id: payload.userId,
        email: payload.email,
        phone: payload.phone,
        role: payload.role,
        name: 'User',
    };
}

/**
 * Require authentication — returns user or throws
 */
export async function requireAuth(req: NextRequest) {
    const user = await getAuthUser(req);
    if (!user) {
        throw new Error('Unauthorized');
    }
    return user;
}

/**
 * Require admin role
 */
export async function requireAdmin(req: NextRequest) {
    const user = await requireAuth(req);
    if (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN') {
        throw new Error('Forbidden');
    }
    return user;
}

/**
 * Generate a 6-digit OTP
 */
export function generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
