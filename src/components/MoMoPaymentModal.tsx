import React, { useState } from 'react';
import { useCart, generateOrderId } from '../context/CartContext';
import { payWithPaystack, verifyPaystackPayment } from '../paystack';

type Stage = 'details' | 'paying' | 'verifying' | 'error';

// Paystack reports the MoMo network as a short code/name on the authorization
const providerLabel = (provider?: string | null) => {
  const p = (provider || '').toLowerCase();
  if (p.includes('mtn')) return 'MTN MoMo';
  if (p.includes('vod') || p.includes('telecel')) return 'Telecel Cash';
  if (p.includes('atl') || p.includes('airtel') || p.includes('tigo')) return 'AT Money';
  return 'Mobile Money';
};

export const MoMoPaymentModal: React.FC = () => {
  const { isMoMoModalOpen, setIsMoMoModalOpen, itemsSubtotal, cartItems, placeMoMoOrder, showToast } = useCart();

  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [stage, setStage] = useState<Stage>('details');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isMoMoModalOpen) return null;

  const isBusy = stage === 'paying' || stage === 'verifying';

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = itemsSubtotal;
    const orderId = generateOrderId();
    setStage('paying');

    try {
      const reference = await payWithPaystack({
        amountGhs: amount,
        phone: phoneNumber,
        reference: `${orderId}-${Date.now()}`,
        metadata: {
          order_id: orderId,
          customer_name: customerName,
          customer_phone: phoneNumber,
          items: cartItems.map((i) => `${i.quantity} x ${i.product.name}`).join(', '),
        },
      });

      if (!reference) {
        setStage('details');
        showToast('Payment cancelled');
        return;
      }

      setStage('verifying');
      const result = await verifyPaystackPayment(reference, amount);
      if (!result.verified) {
        setErrorMessage(result.message || 'We could not confirm this payment.');
        setStage('error');
        return;
      }

      placeMoMoOrder(providerLabel(result.provider), result.phone || phoneNumber, orderId, customerName.trim());
      setIsMoMoModalOpen(false);
      setStage('details');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Payment failed. Please try again.');
      setStage('error');
    }
  };

  const handleClose = () => {
    if (isBusy) return;
    setIsMoMoModalOpen(false);
    setStage('details');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#213521]/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md max-h-full overflow-y-auto overscroll-contain bg-white rounded-t-3xl sm:rounded-3xl p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl flex flex-col gap-3.5 border border-[#becabc]/40">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#becabc]/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00652c] text-[22px]">contactless</span>
            <h3 className="text-[17px] font-extrabold text-[#0c200d]">Mobile Money Checkout</h3>
          </div>
          <button
            onClick={handleClose}
            disabled={isBusy}
            aria-label="Close"
            className="w-8 h-8 rounded-full bg-[#f1f5f0] text-[#3f493f] flex items-center justify-center active:scale-90 cursor-pointer disabled:opacity-40"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Amount Summary */}
        <div className="bg-[#e1fbdc]/60 p-3 rounded-2xl flex flex-col gap-1 border border-[#becabc]/30">
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[#3f493f]">Merchant</span>
            <span className="text-[12px] font-bold text-[#0c200d]">Sadly Prime</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-semibold text-[#3f493f]">Items</span>
            <span className="text-[12px] font-bold text-[#0c200d]">
              {cartItems.reduce((n, i) => n + i.quantity, 0)} in basket
            </span>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-[#00652c]/10 mt-0.5">
            <span className="text-[13px] font-bold text-[#0c200d]">Total to Pay</span>
            <span className="text-[20px] font-black text-[#00652c]">GH₵ {itemsSubtotal.toFixed(2)}</span>
          </div>
        </div>

        {stage === 'details' && (
          <form onSubmit={handlePay} className="flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="momo-name" className="text-[12px] font-bold text-[#0c200d]">Your Name</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#3f493f] text-[18px]">person</span>
                <input
                  id="momo-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Ama Boateng"
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-[#f8faf6] border border-[#becabc]/50 text-[16px] font-bold text-[#0c200d] focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="momo-phone" className="text-[12px] font-bold text-[#0c200d]">Your MoMo Number</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#3f493f] text-[18px]">smartphone</span>
                <input
                  id="momo-phone"
                  type="tel"
                  required
                  inputMode="tel"
                  autoComplete="tel"
                  pattern="[0-9 +]{10,15}"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="024 456 7890"
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-[#f8faf6] border border-[#becabc]/50 text-[16px] font-bold text-[#0c200d] focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                />
              </div>
            </div>

            {/* Accepted networks */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-yellow-400 text-black">MTN MoMo</span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-red-600 text-white">Telecel Cash</span>
              <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-blue-600 text-white">AT Money</span>
            </div>

            <button
              type="submit"
              className="mt-1 w-full h-12 bg-[#15803d] hover:bg-[#00652c] text-white rounded-full font-bold text-[14px] flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px]">lock</span>
              <span className="whitespace-nowrap">Pay GH₵ {itemsSubtotal.toFixed(2)}</span>
            </button>
            <span className="text-[10px] text-center text-[#6f7a6e] -mt-1">
              Secured by Paystack. You'll approve the payment on your phone.
            </span>
          </form>
        )}

        {isBusy && (
          <div className="flex flex-col items-center text-center gap-2 py-4">
            <span className="material-symbols-outlined text-[36px] text-[#00652c] animate-spin">progress_activity</span>
            <p className="text-[14px] font-bold text-[#0c200d]">
              {stage === 'paying' ? 'Complete payment in the Paystack window' : 'Confirming your payment…'}
            </p>
            <p className="text-[11px] text-[#3f493f]">
              {stage === 'paying'
                ? 'Approve the MoMo prompt on your phone when it arrives.'
                : 'This only takes a moment. Please keep this page open.'}
            </p>
          </div>
        )}

        {stage === 'error' && (
          <div className="flex flex-col gap-3">
            <div className="bg-[#ffdad6] border border-[#ba1a1a]/30 p-3 rounded-2xl flex items-start gap-2">
              <span className="material-symbols-outlined text-[#ba1a1a] text-[20px]">error</span>
              <div className="flex flex-col">
                <span className="text-[13px] font-bold text-[#93000a]">Payment not completed</span>
                <span className="text-[12px] text-[#93000a]">{errorMessage}</span>
              </div>
            </div>
            <button
              onClick={() => setStage('details')}
              className="w-full h-11 bg-[#00652c] text-white rounded-full font-bold text-[13px] active:scale-95 cursor-pointer"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
