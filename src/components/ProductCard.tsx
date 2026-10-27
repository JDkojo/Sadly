import React from 'react';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
  variant?: 'grid' | 'carousel';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, variant = 'grid' }) => {
  const { cartItems, addToCart, updateQuantity, setSelectedProduct } = useCart();

  const cartItem = cartItems.find((item) => item.product.id === product.id);
  const qty = cartItem ? cartItem.quantity : 0;

  const handleOpenDetail = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedProduct(product);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (variant === 'carousel') {
    return (
      // Two cards fill the frame width: (frame - side padding 1.75rem - gap 0.5rem) / 2
      <div className="flex flex-col bg-white rounded-2xl p-2.5 shadow-xs shrink-0 snap-start w-[calc((min(100vw,28rem)-2.25rem)/2)] justify-between border border-[#e2e8df] hover:shadow-md transition-shadow">
        <div onClick={handleOpenDetail} className="cursor-pointer group">
          <div className="relative w-full aspect-square bg-white rounded-xl overflow-hidden flex items-center justify-center mb-2">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
            />
            {product.originalPrice && (
              <span className="absolute top-1.5 left-1.5 bg-[#fd761a] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                PROMO
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#00652c] uppercase tracking-wider">
              {product.category}
            </span>
            <h4 className="text-[13px] text-[#0c200d] font-bold truncate leading-snug">
              {product.name}
            </h4>
            <span className="text-[11px] text-[#3f493f] truncate">{product.unit}</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-1 mt-2 pt-1 border-t border-[#f1f5f0]">
          <div className="flex flex-col min-w-0">
            <span className="text-[14px] text-[#0c200d] font-black leading-none whitespace-nowrap">
              GH₵ {product.price.toFixed(2)}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] text-[#6f7a6e] line-through leading-none mt-0.5">
                GH₵ {product.originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div>
            {qty === 0 ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(product, 1);
                }}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#00652c] hover:bg-[#15803d] text-white shadow-xs active:scale-90 transition-all cursor-pointer"
                title="Add item"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            ) : (
              <div className="flex items-center shrink-0 bg-[#00652c] rounded-full px-0.5 py-0.5 text-white shadow-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(product.id, -1);
                  }}
                  className="flex items-center justify-center w-6 h-6 text-white hover:bg-white/20 rounded-full active:scale-90 transition-transform cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">remove</span>
                </button>
                <span className="text-[12px] px-1 font-bold">{qty}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(product.id, 1);
                  }}
                  className="flex items-center justify-center w-6 h-6 text-white hover:bg-white/20 rounded-full active:scale-90 transition-transform cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Grid variant (compact so three cards fit across a phone screen)
  const topBadge = product.badges[0];
  return (
    <div className="flex flex-col min-w-0 bg-white rounded-xl p-1.5 shadow-xs justify-between border border-[#e2e8df] hover:shadow-md transition-all group">
      <div onClick={handleOpenDetail} className="cursor-pointer min-w-0">
        <div className="relative w-full aspect-square bg-white rounded-lg overflow-hidden flex items-center justify-center mb-1.5">
          <img
            src={product.images[0]}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />

          {topBadge && (
            <span
              className={`absolute top-1 left-1 max-w-[calc(100%-0.5rem)] truncate text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow-xs ${
                topBadge.variant === 'secondary'
                  ? 'bg-[#fd761a] text-white'
                  : topBadge.variant === 'accent'
                  ? 'bg-[#008137] text-white'
                  : 'bg-[#00652c] text-white'
              }`}
            >
              {topBadge.text}
            </span>
          )}
        </div>

        <h3 className="text-[11px] leading-tight text-[#0c200d] font-bold line-clamp-2 min-h-[2.5em] group-hover:text-[#00652c] transition-colors">
          {product.name}
        </h3>
        <span className="text-[10px] text-[#6f7a6e] block truncate mt-0.5">{product.unit}</span>
      </div>

      <div className="mt-1 pt-1 border-t border-[#f1f5f0]">
        <div className="flex flex-col leading-none">
          <span className="text-[13px] text-[#00652c] font-black whitespace-nowrap">
            GH₵ {product.price.toFixed(2)}
          </span>
          <span className={`text-[9px] text-[#6f7a6e] line-through mt-0.5 ${product.originalPrice ? '' : 'invisible'}`}>
            GH₵ {(product.originalPrice ?? product.price).toFixed(2)}
          </span>
        </div>

        {/* Action Button */}
        <div className="mt-1.5">
          {qty === 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className="w-full h-7 flex items-center justify-center gap-0.5 bg-[#e1fbdc] hover:bg-[#00652c] hover:text-white text-[#00652c] rounded-full text-[11px] font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              <span>ADD</span>
            </button>
          ) : (
            <div className="flex items-center justify-between h-7 bg-[#00652c] rounded-full px-0.5 text-white shadow-xs">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity(product.id, -1);
                }}
                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 active:scale-90 transition-all font-bold cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">remove</span>
              </button>
              <span className="text-[11px] font-black select-none">{qty}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity(product.id, 1);
                }}
                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-white/20 active:scale-90 transition-all font-bold cursor-pointer"
              >
                <span className="material-symbols-outlined text-[14px]">add</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
