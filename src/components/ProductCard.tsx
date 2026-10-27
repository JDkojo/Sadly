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
      <div className="flex flex-col bg-white rounded-2xl p-2.5 shadow-xs shrink-0 w-44 justify-between border border-[#e2e8df] hover:shadow-md transition-shadow">
        <div onClick={handleOpenDetail} className="cursor-pointer group">
          <div className="relative w-full aspect-square bg-[#e1fbdc]/40 rounded-xl overflow-hidden flex items-center justify-center mb-2">
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.originalPrice && (
              <span className="absolute top-1.5 left-1.5 bg-[#fd761a] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                PROMO
              </span>
            )}
            <span className="absolute bottom-1.5 right-1.5 bg-white/90 backdrop-blur-xs text-[#0c200d] text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-0.5 font-bold shadow-xs">
              <span className="material-symbols-outlined text-[12px] text-[#fd761a]" style={{ fontVariationSettings: "'FILL' 1" }}>
                star
              </span>
              {product.rating}
            </span>
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

        <div className="flex items-center justify-between mt-2 pt-1 border-t border-[#f1f5f0]">
          <div className="flex flex-col">
            <span className="text-[15px] text-[#0c200d] font-black leading-none">
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
              <div className="flex items-center bg-[#00652c] rounded-full px-1 py-0.5 text-white shadow-xs">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(product.id, -1);
                  }}
                  className="flex items-center justify-center w-6 h-6 text-white hover:bg-white/20 rounded-full active:scale-90 transition-transform cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[14px]">remove</span>
                </button>
                <span className="text-[12px] px-1.5 font-bold">{qty}</span>
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

  // Grid variant
  return (
    <div className="flex flex-col bg-white rounded-2xl p-2.5 shadow-xs justify-between border border-[#e2e8df] hover:shadow-md transition-all group">
      <div onClick={handleOpenDetail} className="cursor-pointer">
        <div className="relative w-full aspect-square bg-[#e1fbdc]/40 rounded-xl overflow-hidden flex items-center justify-center mb-2">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Badges */}
          <div className="absolute top-1.5 left-1.5 flex flex-col gap-1">
            {product.badges.map((b, idx) => (
              <span
                key={idx}
                className={`text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs ${
                  b.variant === 'secondary'
                    ? 'bg-[#fd761a] text-white'
                    : b.variant === 'accent'
                    ? 'bg-[#008137] text-white'
                    : 'bg-[#00652c] text-white'
                }`}
              >
                {b.text}
              </span>
            ))}
          </div>

          <span className="absolute bottom-1.5 right-1.5 bg-white/95 backdrop-blur-sm rounded-md px-1.5 py-0.5 flex items-center gap-0.5 text-[10px] font-bold text-[#0c200d] shadow-xs">
            <span className="material-symbols-outlined text-[#fd761a] text-[12px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              star
            </span>
            {product.rating}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-[10px] text-[#00652c] font-black uppercase tracking-wider block">
            {product.category}
          </span>
          <h3 className="text-[13px] leading-snug text-[#0c200d] font-bold line-clamp-2 mt-0.5 group-hover:text-[#00652c] transition-colors">
            {product.name}
          </h3>
          <span className="text-[11px] text-[#6f7a6e] mt-0.5">{product.unit}</span>
        </div>
      </div>

      <div className="mt-2 pt-1 border-t border-[#f1f5f0]">
        <div className="flex items-baseline justify-between">
          <span className="text-[15px] text-[#00652c] font-black">
            GH₵ {product.price.toFixed(2)}
          </span>
          {product.originalPrice && (
            <span className="text-[11px] text-[#6f7a6e] line-through">
              GH₵ {product.originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="mt-2">
          {qty === 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className="w-full h-8 flex items-center justify-center gap-1 bg-[#e1fbdc] hover:bg-[#00652c] hover:text-white text-[#00652c] rounded-full text-[12px] font-bold shadow-xs active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">add</span>
              <span>ADD</span>
            </button>
          ) : (
            <div className="flex items-center justify-between bg-[#00652c] rounded-full px-1 py-0.5 text-white shadow-xs">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity(product.id, -1);
                }}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 active:scale-90 transition-all font-bold cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">remove</span>
              </button>
              <span className="text-[12px] font-black px-1 select-none">{qty}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateQuantity(product.id, 1);
                }}
                className="w-7 h-7 flex items-center justify-center rounded-full hover:bg-white/20 active:scale-90 transition-all font-bold cursor-pointer"
              >
                <span className="material-symbols-outlined text-[15px]">add</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
