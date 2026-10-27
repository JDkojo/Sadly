import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useCart } from '../context/CartContext';

export const EntrancePosterModal: React.FC = () => {
  const { isPosterModalOpen, setIsPosterModalOpen, setActiveTab, setSelectedProduct, showToast } =
    useCart();

  if (!isPosterModalOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://sadly-prime.store';

  const handleSimulateScan = () => {
    setIsPosterModalOpen(false);
    setSelectedProduct(null);
    setActiveTab('shop');
    showToast("Scanned Entrance QR! Welcome to Sadly Prime — start ordering now 🛒");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#213521]/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-sm max-h-full overflow-y-auto overscroll-contain bg-white rounded-3xl p-5 min-[360px]:p-6 shadow-2xl flex flex-col items-center border border-[#becabc]/40 text-center">
        {/* Close Button */}
        <button
          onClick={() => setIsPosterModalOpen(false)}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#f1f5f0] text-[#3f493f] flex items-center justify-center hover:bg-[#dcf5d6] active:scale-90 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>

        {/* Store Title */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-9 h-9 rounded-xl bg-[#00652c] text-white flex items-center justify-center font-black text-sm shadow-xs">
            SP
          </div>
          <h2 className="text-[20px] font-black text-[#0c200d] tracking-tight">SADLY PRIME</h2>
        </div>

        {/* Poster Heading */}
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#9d4300] bg-[#ffdbca] px-3 py-1 rounded-full mb-2.5">
          Storefront Entrance Poster
        </span>

        <h3 className="text-[17px] font-black text-[#00652c] leading-snug px-2">
          Scan to order · Pay with MoMo · Fast Pickup
        </h3>

        {/* MoMo Number Badge */}
        <div className="inline-flex items-center gap-1.5 bg-[#e1fbdc] text-[#00652c] px-3 py-1 rounded-full mt-2 mb-3 border border-[#00652c]/20">
          <span className="material-symbols-outlined text-[15px]">smartphone</span>
          <span className="text-[11px] font-bold">Store MoMo: 0597117861</span>
        </div>

        <p className="text-[11px] text-[#3f493f] mb-3 leading-relaxed">
          Point your phone camera here to browse provisions and order. No app download or sign-up needed.
        </p>

        {/* QR Code Container */}
        <div className="p-3.5 bg-white rounded-2xl border-4 border-[#00652c] shadow-md flex flex-col items-center justify-center">
          <QRCodeSVG
            value={currentUrl}
            size={175}
            level="H"
            fgColor="#00652c"
            bgColor="#ffffff"
          />
          <span className="text-[10px] font-mono font-bold text-[#00652c] mt-2">
            SCAN WITH PHONE CAMERA
          </span>
        </div>

        {/* Call to action for prototype testing */}
        <div className="w-full flex flex-col gap-2 mt-4">
          <button
            onClick={handleSimulateScan}
            className="w-full h-11 bg-[#15803d] hover:bg-[#00652c] text-white rounded-full font-bold text-[13px] flex items-center justify-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[17px]">qr_code_scanner</span>
            Simulate Ama Scanning Poster
          </button>

          <button
            onClick={handlePrint}
            className="w-full h-10 bg-[#f1f5f0] hover:bg-[#e1fbdc] text-[#00652c] rounded-full font-bold text-[12px] flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-[16px]">print</span>
            Print Storefront Poster
          </button>
        </div>
      </div>
    </div>
  );
};
