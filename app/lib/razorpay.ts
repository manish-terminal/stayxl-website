import Razorpay from 'razorpay';
import crypto from 'crypto';

/**
 * Lazy-initialized Razorpay instance.
 * Avoids crashing at build time when env vars are not set.
 */
let _razorpay: Razorpay | null = null;

export function getRazorpay(): Razorpay {
    if (!_razorpay) {
        if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
            throw new Error('Missing Razorpay credentials in environment variables');
        }
        _razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET,
        });
    }
    return _razorpay;
}

// Exported alias for backward compatibility
export const razorpay = new Proxy({} as Razorpay, {
    get(_target, prop) {
        return (getRazorpay() as unknown as Record<string | symbol, unknown>)[prop];
    },
});

/**
 * Verify Razorpay payment signature
 */
export function verifyPaymentSignature({
    orderId,
    paymentId,
    signature,
}: {
    orderId: string;
    paymentId: string;
    signature: string;
}): boolean {
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
        .update(body)
        .digest('hex');

    return crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
    );
}

/**
 * Verify Razorpay webhook signature
 */
export function verifyWebhookSignature(
    body: string,
    signature: string
): boolean {
    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET!)
        .update(body)
        .digest('hex');

    return crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
    );
}

export default razorpay;
