import React, { useState } from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductDetailProps {
  product: Product;
}

export const ProductDetailScreen: React.FC<ProductDetailProps> = ({ product }) => {
  const { setSelectedProduct, addToCart, showToast } = useCart();
  const [qty, setQty] = useState(1);
  const [isAddedFeedback, setIsAddedFeedback] = useState(false);

  const currentPrice = (qty * product.price).toFixed(2);

  const handleAddToCart = () => {
    addToCart(product, qty);
    setIsAddedFeedback(true);
    setTimeout(() => {
      setIsAddedFeedback(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col w-full pb-20 pt-1">
      {/* Top Back bar */}
      <div className="px-3.5 py-1.5 flex items-center justify-between">
        <button
          onClick={() => setSelectedProduct(null)}
          aria-label="Go Back"
          className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#0c200d] shadow-xs active:scale-95 transition-transform cursor-pointer border border-[#becabc]/40"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        </button>

        <div className="flex flex-col items-center">
          <span className="text-[10px] text-[#00652c] font-black uppercase tracking-wider">
            Sadly Prime Stock
          </span>
          <span className="text-[13px] text-[#0c200d] font-bold truncate max-w-[200px]">
            {product.name}
          </span>
        </div>

        <button
          onClick={() => {
            navigator.clipboard?.writeText(window.location.href);
            showToast('Item link copied');
          }}
          className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#3f493f] shadow-xs active:scale-95 border border-[#becabc]/40 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[18px]">share</span>
        </button>
      </div>

      {/* Product Image Card */}
      <div className="px-3.5 pt-1 pb-3">
        <div className="relative w-full rounded-3xl overflow-hidden bg-white shadow-sm border border-[#becabc]/30">
          <div className="relative w-full aspect-[4/3] bg-white flex items-center justify-center overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain p-4 pt-10"
            />
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              <span className="bg-[#00652c] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs">
                In Stock at Sadly Prime Counter
              </span>
              {product.originalPrice && (
                <span className="bg-[#fd761a] text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-xs">
                  Promo Price
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="px-3.5 pb-3">
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-[#becabc]/30 flex flex-col gap-2">
          <span className="text-[11px] font-black uppercase tracking-wider text-[#00652c]">
            SKU: {product.sku || 'SP-PROV'}
          </span>

          <h1 className="text-[19px] font-black text-[#0c200d] tracking-tight leading-snug">
            {product.name}
          </h1>

          <p className="text-[12px] text-[#3f493f] leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-baseline justify-between pt-1 border-t border-[#f1f5f0]">
            <div className="flex items-baseline gap-2">
              <span className="text-[26px] text-[#00652c] font-black tracking-tight">
                GH₵ {product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-[14px] text-[#6f7a6e] line-through">
                  GH₵ {product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span className="text-[11px] bg-[#e1fbdc] text-[#00652c] px-2.5 py-1 rounded-full font-bold">
              {product.unit}
            </span>
          </div>

          {/* Quick Package Details */}
          {product.packageDetails && (
            <div className="bg-[#f8faf6] p-2.5 rounded-xl border border-[#becabc]/30 mt-1">
              <span className="text-[10px] uppercase font-bold text-[#3f493f] block">
                Packaging & Storage Note
              </span>
              <span className="text-[12px] text-[#0c200d] font-medium leading-snug block mt-0.5">
                {product.packageDetails}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Pickup Guarantee Card */}
      <div className="px-3.5 pb-4">
        <div className="bg-[#dcf5d6]/70 rounded-2xl p-3.5 border border-[#becabc]/40 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#00652c] text-white flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">qr_code_2</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[13px] font-bold text-[#0c200d]">Instant Counter Pickup</span>
            <span className="text-[11px] text-[#3f493f]">
              Order right now and show your digital QR code to Kofi at the front window.
            </span>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action */}
      <div className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 right-0 max-w-md mx-auto w-full z-30 bg-[#ebffe5]/95 backdrop-blur-xl px-3.5 py-2.5 shadow-[0_-8px_24px_rgba(26,46,26,0.08)] flex items-center justify-between gap-3 border-t border-[#becabc]/30 box-border">
        {/* Stepper */}
        <div className="flex items-center bg-white rounded-full p-1 shadow-xs border border-[#becabc]/40">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#00652c] hover:bg-[#dcf5d6] active:scale-90 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">remove</span>
          </button>
          <span className="text-[15px] text-[#0c200d] font-black w-8 text-center select-none">
            {qty}
          </span>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#00652c] hover:bg-[#dcf5d6] active:scale-90 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
          </button>
        </div>

        {/* Add to Basket button */}
        <button
          onClick={handleAddToCart}
          className={`flex-1 h-12 rounded-full shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all font-bold text-[14px] cursor-pointer ${
            isAddedFeedback
              ? 'bg-[#008137] text-white'
              : 'bg-[#15803d] hover:bg-[#00652c] text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {isAddedFeedback ? 'check_circle' : 'shopping_basket'}
          </span>
          <span>
            {isAddedFeedback ? '✓ Added to Basket!' : `Add to Basket · GH₵ ${currentPrice}`}
          </span>
        </button>
      </div>
    </div>
  );
};
