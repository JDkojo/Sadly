import React from 'react';
import { useCart } from '../context/CartContext';

export const Toast: React.FC = () => {
  const { toastMessage, hideToast } = useCart();

  if (!toastMessage) return null;

  return (
    <div className="fixed top-38 inset-x-3.5 z-50 flex justify-center pointer-events-none animate-slide-down">
      <div className="bg-[#213521] text-[#dff8d9] px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 max-w-sm pointer-events-auto border border-[#79db8d]/30">
        <span className="material-symbols-outlined text-[#7ffc97] text-[18px]">verified</span>
        <span className="text-[12px] font-medium leading-tight flex-1">{toastMessage}</span>
        <button
          onClick={hideToast}
          aria-label="Dismiss"
          className="text-[#dff8d9]/70 hover:text-white p-0.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">close</span>
        </button>
      </div>
    </div>
  );
};
