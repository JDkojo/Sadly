import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

export const MoMoPaymentModal: React.FC = () => {
  const { isMoMoModalOpen, setIsMoMoModalOpen, itemsSubtotal, placeMoMoOrder } = useCart();

  const [selectedNetwork, setSelectedNetwork] = useState('MTN MoMo');
  const [phoneNumber, setPhoneNumber] = useState('024 456 7890');
  const [step, setStep] = useState<'details' | 'pin'>('details');
  const [pin, setPin] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isMoMoModalOpen) return null;

  const networks = [
    { id: 'MTN MoMo', label: 'MTN MoMo', color: 'bg-yellow-400 text-black', badge: 'Fastest' },
    { id: 'Telecel Cash', label: 'Telecel Cash', color: 'bg-red-600 text-white', badge: '' },
    { id: 'AT Money', label: 'AT Money', color: 'bg-blue-600 text-white', badge: '' },
  ];

  const handleProceedToPin = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('pin');
  };

  const handleConfirmPin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsMoMoModalOpen(false);
      setStep('details');
      setPin('');
      placeMoMoOrder(selectedNetwork, phoneNumber);
    }, 1200);
  };

  const handleClose = () => {
    setIsMoMoModalOpen(false);
    setStep('details');
    setPin('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#213521]/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md max-h-full overflow-y-auto overscroll-contain bg-white rounded-t-3xl sm:rounded-3xl p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] shadow-2xl flex flex-col gap-3.5 border border-[#becabc]/40">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#becabc]/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#00652c] text-[22px]">contactless</span>
            <h3 className="text-[17px] font-extrabold text-[#0c200d]">
              {step === 'details' ? 'Mobile Money Checkout' : 'Approve MoMo Prompt'}
            </h3>
          </div>
          <button
            onClick={handleClose}
            className="w-8 h-8 rounded-full bg-[#f1f5f0] text-[#3f493f] flex items-center justify-center active:scale-90 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {step === 'details' ? (
          <form onSubmit={handleProceedToPin} className="flex flex-col gap-3">
            {/* Amount Summary with Store MoMo Number */}
            <div className="bg-[#e1fbdc]/60 p-3 rounded-2xl flex flex-col gap-1 border border-[#becabc]/30">
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-[#3f493f]">Merchant</span>
                <span className="text-[12px] font-bold text-[#0c200d]">Sadly Prime</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[12px] font-semibold text-[#3f493f]">Store MoMo No.</span>
                <span className="text-[13px] font-mono font-bold text-[#00652c] bg-white px-2 py-0.5 rounded-md border border-[#00652c]/20">
                  0597117861
                </span>
              </div>
              <div className="flex items-center justify-between pt-1 border-t border-[#00652c]/10 mt-0.5">
                <span className="text-[13px] font-bold text-[#0c200d]">Total to Pay</span>
                <span className="text-[20px] font-black text-[#00652c]">
                  GH₵ {itemsSubtotal.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Network Picker */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-bold text-[#0c200d]">Select MoMo Provider</label>
              <div className="grid grid-cols-3 gap-2">
                {networks.map((net) => {
                  const isSelected = selectedNetwork === net.id;
                  return (
                    <button
                      key={net.id}
                      type="button"
                      onClick={() => setSelectedNetwork(net.id)}
                      className={`p-2.5 rounded-2xl flex flex-col items-center text-center gap-1 border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#00652c] ring-2 ring-[#00652c]/20 bg-[#e1fbdc]/50 font-bold'
                          : 'border-[#becabc]/40 bg-[#f8faf6] hover:bg-[#e1fbdc]/30'
                      }`}
                    >
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${net.color}`}>
                        {net.label.split(' ')[0]}
                      </span>
                      <span className="text-[11px] text-[#0c200d] font-bold mt-0.5">{net.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Customer Phone Number */}
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-bold text-[#0c200d]">Your MoMo Number</label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-3 text-[#3f493f] text-[18px]">
                  smartphone
                </span>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="024 456 7890"
                  className="w-full h-11 pl-10 pr-3 rounded-xl bg-[#f8faf6] border border-[#becabc]/50 text-[14px] font-bold text-[#0c200d] focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                />
              </div>
              <span className="text-[10px] text-[#3f493f]">
                Approval prompt will be sent to your phone immediately.
              </span>
            </div>

            <button
              type="submit"
              className="mt-2 w-full h-12 bg-[#15803d] hover:bg-[#00652c] text-white rounded-full font-bold text-[14px] flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
            >
              <span>Send MoMo Prompt</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleConfirmPin} className="flex flex-col gap-3">
            {/* MoMo USSD prompt simulation box */}
            <div className="bg-[#fff9db] border-2 border-[#fd761a] p-4 rounded-2xl flex flex-col gap-2 text-center animate-scale-up">
              <span className="text-[11px] font-black uppercase tracking-wider text-[#9d4300]">
                {selectedNetwork} Prompt Alert
              </span>
              <p className="text-[13px] font-bold text-[#0c200d] leading-snug">
                Authorize payment of <span className="text-[#00652c] font-black">GH₵ {itemsSubtotal.toFixed(2)}</span> to <span className="text-[#00652c] font-black">SADLY PRIME</span> (0597117861)?
              </p>
              <p className="text-[11px] text-[#3f493f]">
                Reference: Sadly Prime Pickup Order
              </p>

              <div className="mt-2 flex flex-col items-center">
                <label className="text-[11px] font-bold text-[#0c200d] mb-1">Enter 4-Digit MoMo PIN</label>
                <input
                  type="password"
                  maxLength={4}
                  required
                  autoFocus
                  placeholder="••••"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  className="w-32 h-11 text-center tracking-widest text-[22px] font-black bg-white rounded-xl border border-[#fd761a] focus:outline-none focus:ring-2 focus:ring-[#00652c]"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setStep('details')}
                className="flex-1 h-11 bg-[#f1f5f0] text-[#0c200d] rounded-full font-bold text-[12px] active:scale-95"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={pin.length < 4 || isProcessing}
                className="flex-2 h-11 bg-[#00652c] disabled:opacity-50 text-white rounded-full font-bold text-[13px] flex items-center justify-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                    Approving...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    Approve Payment
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
