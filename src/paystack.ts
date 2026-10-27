// Paystack Inline (popup) checkout + server-side verification via /api/paystack-verify.

declare const __PAYSTACK_PUBLIC_KEY__: string;

interface PaystackTransaction {
  reference: string;
}

interface PaystackPopInstance {
  newTransaction(options: {
    key: string;
    email: string;
    amount: number;
    currency: string;
    reference: string;
    channels?: string[];
    metadata?: Record<string, unknown>;
    onSuccess: (tx: PaystackTransaction) => void;
    onCancel: () => void;
    onError?: (error: { message: string }) => void;
  }): void;
}

declare global {
  interface Window {
    PaystackPop?: new () => PaystackPopInstance;
  }
}

export interface PaystackVerification {
  verified: boolean;
  status?: string;
  amount?: number;
  channel?: string;
  provider?: string | null;
  phone?: string | null;
  reference?: string;
  message: string;
}

export const PAYSTACK_PUBLIC_KEY = __PAYSTACK_PUBLIC_KEY__;

let scriptPromise: Promise<void> | null = null;

function loadPaystackScript(): Promise<void> {
  if (window.PaystackPop) return Promise.resolve();
  scriptPromise ??= new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v2/inline.js';
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null;
      reject(new Error('Could not load Paystack. Check your internet connection.'));
    };
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/** Opens the Paystack popup. Resolves with the reference on success, or null if the customer cancels. */
export async function payWithPaystack(opts: {
  amountGhs: number;
  phone: string;
  reference: string;
  metadata?: Record<string, unknown>;
}): Promise<string | null> {
  if (!PAYSTACK_PUBLIC_KEY) throw new Error('Paystack public key is not configured.');
  await loadPaystackScript();

  const digits = opts.phone.replace(/\D/g, '') || 'customer';
  return new Promise((resolve, reject) => {
    new window.PaystackPop!().newTransaction({
      key: PAYSTACK_PUBLIC_KEY,
      // Paystack requires an email; customers here pay by phone, so derive one from their number
      email: `${digits}@customers.sadlyprime.app`,
      amount: Math.round(opts.amountGhs * 100),
      currency: 'GHS',
      reference: opts.reference,
      channels: ['mobile_money'],
      metadata: opts.metadata,
      onSuccess: (tx) => resolve(tx.reference),
      onCancel: () => resolve(null),
      onError: (err) => reject(new Error(err?.message || 'Payment failed')),
    });
  });
}

export async function verifyPaystackPayment(reference: string, amountGhs: number): Promise<PaystackVerification> {
  const params = new URLSearchParams({ reference, amount: String(Math.round(amountGhs * 100)) });
  const res = await fetch(`/api/paystack-verify?${params}`);
  const data = await res.json().catch(() => ({ verified: false, message: 'Invalid response from payment server' }));
  return data as PaystackVerification;
}
