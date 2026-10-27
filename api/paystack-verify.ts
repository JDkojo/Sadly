// Vercel serverless function: confirms a Paystack transaction with the secret key,
// which never leaves the server. Also served in dev by the Vite middleware in vite.config.ts.

declare const process: { env: Record<string, string | undefined> };

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const reference = url.searchParams.get('reference');
  const expectedAmount = Number(url.searchParams.get('amount')); // in pesewas

  if (!reference || !/^[A-Za-z0-9._=-]{1,100}$/.test(reference)) {
    return Response.json({ verified: false, message: 'Missing or invalid reference' }, { status: 400 });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY || process.env.paystack_secret_key;
  if (!secretKey) {
    return Response.json({ verified: false, message: 'Payment server is not configured' }, { status: 500 });
  }

  const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secretKey}` },
  });
  const body = await res.json().catch(() => null);
  const tx = body?.data;

  if (!res.ok || !tx) {
    return Response.json({ verified: false, message: body?.message || 'Could not verify payment' }, { status: 502 });
  }

  const verified =
    tx.status === 'success' &&
    tx.currency === 'GHS' &&
    (!expectedAmount || tx.amount === expectedAmount);

  return Response.json({
    verified,
    status: tx.status,
    amount: tx.amount,
    currency: tx.currency,
    channel: tx.channel,
    provider: tx.authorization?.bank || tx.authorization?.brand || null,
    phone: tx.authorization?.mobile_money_number || null,
    paidAt: tx.paid_at,
    reference: tx.reference,
    message: verified ? 'Payment verified' : tx.gateway_response || 'Payment not successful',
  });
}
