import React from 'react';
import { useCart } from '../context/CartContext';

export const CartScreen: React.FC = () => {
  const {
    cartItems,
    updateQuantity,
    clearCart,
    itemsSubtotal,
    setIsMoMoModalOpen,
    setActiveTab,
    setSelectedProduct,
  } = useCart();

  return (
    <div className="flex flex-col w-full px-3.5 pb-28 gap-3.5 pt-2">
      {/* Store Order Header */}
      <div className="bg-[#dcf5d6] p-3 rounded-2xl shadow-xs border border-[#becabc]/30 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#00652c] text-[20px]">shopping_bag</span>
          <div className="flex flex-col">
            <span className="text-[12px] font-black text-[#0c200d]">Sadly Prime Express Pickup</span>
            <span className="text-[11px] text-[#3f493f]">Pay with MoMo: <strong className="text-[#00652c]">0597117861</strong></span>
          </div>
        </div>
        <span className="text-[10px] bg-[#00652c] text-white px-2.5 py-0.5 rounded-full font-bold">
          Pickup Window
        </span>
      </div>

      {/* Basket Items List */}
      <div className="bg-white rounded-3xl p-4 shadow-xs border border-[#becabc]/30 flex flex-col gap-3">
        <div className="flex items-center justify-between pb-1 border-b border-[#f1f5f0]">
          <h2 className="text-[16px] font-black text-[#0c200d]">
            Your Provisions (
            {cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)
          </h2>
          {cartItems.length > 0 && (
            <button
              onClick={clearCart}
              className="text-[12px] font-bold text-[#9d4300] hover:underline cursor-pointer"
            >
              Clear all
            </button>
          )}
        </div>

        {cartItems.length === 0 ? (
          <div className="py-8 text-center flex flex-col items-center">
            <span className="material-symbols-outlined text-4xl text-[#becabc] mb-2">
              shopping_bag
            </span>
            <p className="text-[14px] font-bold text-[#0c200d]">Your basket is empty</p>
            <p className="text-[12px] text-[#3f493f] mt-0.5">
              Select items from the shelf to prepare your pickup order.
            </p>
            <button
              onClick={() => setActiveTab('shop')}
              className="mt-3 px-5 py-2 bg-[#00652c] text-white rounded-full text-[12px] font-bold active:scale-95 cursor-pointer shadow-xs"
            >
              Add Provisions
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {cartItems.map((item) => {
              const itemTotal = (item.product.price * item.quantity).toFixed(2);
              return (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 p-2 rounded-2xl bg-[#f8faf6] border border-[#becabc]/30"
                >
                  <div
                    onClick={() => {
                      setSelectedProduct(item.product);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-16 h-16 rounded-xl overflow-hidden bg-white shrink-0 cursor-pointer border border-[#becabc]/30"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div
                        onClick={() => {
                          setSelectedProduct(item.product);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="min-w-0 pr-1 cursor-pointer"
                      >
                        <h3 className="text-[13px] font-bold text-[#0c200d] truncate">
                          {item.product.name}
                        </h3>
                        <span className="text-[11px] text-[#6f7a6e]">
                          {item.product.unit} · GH₵ {item.product.price.toFixed(2)}/ea
                        </span>
                      </div>
                      <span className="text-[14px] font-black text-[#0c200d] whitespace-nowrap">
                        GH₵ {itemTotal}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] font-bold text-[#00652c] bg-[#e1fbdc] px-2 py-0.5 rounded-full">
                        {item.product.badges[0]?.text || 'In Stock'}
                      </span>

                      {/* Stepper */}
                      <div className="flex items-center bg-[#dcf5d6] rounded-full px-1 py-0.5 shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-6 h-6 flex items-center justify-center rounded-full text-[#0c200d] hover:bg-[#d0e9cb] active:scale-90 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">remove</span>
                        </button>
                        <span className="text-[12px] text-[#0c200d] px-2 font-black select-none">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-6 h-6 flex items-center justify-center rounded-full text-[#0c200d] hover:bg-[#d0e9cb] active:scale-90 cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[14px]">add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Total Card */}
      {cartItems.length > 0 && (
        <div className="bg-white rounded-3xl p-4 shadow-xs border border-[#becabc]/30 flex flex-col gap-2">
          <div className="flex justify-between items-center text-[13px] text-[#3f493f]">
            <span>Items Subtotal</span>
            <span className="font-bold text-[#0c200d]">GH₵ {itemsSubtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center text-[13px] text-[#3f493f]">
            <span>Pickup Window Service</span>
            <span className="font-bold text-[#00652c]">FREE</span>
          </div>

          <div className="h-px bg-[#f1f5f0] my-1"></div>

          <div className="flex justify-between items-center">
            <span className="text-[16px] font-black text-[#0c200d]">Total to Pay</span>
            <span className="text-[22px] font-black text-[#00652c]">
              GH₵ {itemsSubtotal.toFixed(2)}
            </span>
          </div>
        </div>
      )}

      {/* Checkout Button */}
      {cartItems.length > 0 && (
        <button
          onClick={() => setIsMoMoModalOpen(true)}
          className="w-full h-13 bg-[#15803d] hover:bg-[#00652c] text-white rounded-full font-black text-[15px] flex items-center justify-between gap-2 px-5 shadow-lg active:scale-[0.98] transition-all cursor-pointer"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="material-symbols-outlined text-[20px]">contactless</span>
            <span className="truncate">Pay with MoMo</span>
          </div>
          <div className="flex items-center gap-1 shrink-0 whitespace-nowrap">
            <span>GH₵ {itemsSubtotal.toFixed(2)}</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </div>
        </button>
      )}
    </div>
  );
};
