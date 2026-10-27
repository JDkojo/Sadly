import React from 'react';
import { useCart } from '../context/CartContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setSelectedProduct, totalCartItemCount, currentOrder, isStaffMode } =
    useCart();

  // Hide customer bottom nav when inside the dedicated Staff Terminal
  if (isStaffMode || activeTab === 'staff') {
    return null;
  }

  const handleTabClick = (tab: 'shop' | 'cart' | 'receipt') => {
    setSelectedProduct(null);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto w-full z-40 pb-safe bg-[#ebffe5]/95 backdrop-blur-xl shadow-[0_-4px_20px_rgba(26,46,26,0.08)] border-t border-[#becabc]/30 box-border">
      <div className="flex justify-around items-center h-16 px-2 w-full">
        {/* Shop */}
        <button
          onClick={() => handleTabClick('shop')}
          className={`flex flex-col items-center justify-center min-w-[70px] min-h-[44px] px-2 py-1 transition-all cursor-pointer ${
            activeTab === 'shop'
              ? 'text-[#00652c] font-black scale-105'
              : 'text-[#3f493f] hover:text-[#0c200d]'
          }`}
        >
          <span
            className="material-symbols-outlined text-[24px]"
            style={activeTab === 'shop' ? { fontVariationSettings: "'FILL' 1" } : undefined}
          >
            storefront
          </span>
          <span className="text-[11px] font-semibold mt-0.5">S.A Shelf</span>
        </button>

        {/* Basket */}
        <button
          onClick={() => handleTabClick('cart')}
          className={`relative flex flex-col items-center justify-center min-w-[70px] min-h-[44px] px-2 py-1 transition-all cursor-pointer ${
            activeTab === 'cart'
              ? 'text-[#00652c] font-black scale-105'
              : 'text-[#3f493f] hover:text-[#0c200d]'
          }`}
        >
          <div className="relative">
            <span
              className="material-symbols-outlined text-[24px]"
              style={activeTab === 'cart' ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              shopping_bag
            </span>
            {totalCartItemCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#fd761a] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs">
                {totalCartItemCount}
              </span>
            )}
          </div>
          <span className="text-[11px] font-semibold mt-0.5">My Basket</span>
        </button>

        {/* My Pickup QR */}
        <button
          onClick={() => handleTabClick('receipt')}
          className={`relative flex flex-col items-center justify-center min-w-[70px] min-h-[44px] px-2 py-1 transition-all cursor-pointer ${
            activeTab === 'receipt'
              ? 'text-[#00652c] font-black scale-105'
              : 'text-[#3f493f] hover:text-[#0c200d]'
          }`}
        >
          <div className="relative">
            <span
              className="material-symbols-outlined text-[24px]"
              style={activeTab === 'receipt' ? { fontVariationSettings: "'FILL' 1" } : undefined}
            >
              qr_code_2
            </span>
            {currentOrder && currentOrder.status === 'ready' && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#15803d] animate-ping"></span>
            )}
          </div>
          <span className="text-[11px] font-semibold mt-0.5">Pickup QR</span>
        </button>
      </div>
    </nav>
  );
};
