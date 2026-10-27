import React from 'react';
import { useCart } from '../context/CartContext';
import { ProductCard } from './ProductCard';

export const ShopScreen: React.FC = () => {
  const { products, searchQuery, selectedCategory, setIsStaffMode, setActiveTab, showToast } = useCart();

  // Fast Counter Staples (Ama's frequent picks)
  const bestSellers = products.filter((p) =>
    ['milo-400g', 'st-louis-sugar', 'omo-powder', 'ideal-milk', 'peak-milk', 'geisha-sardines'].includes(p.id)
  );

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleOpenStaffPortal = () => {
    setIsStaffMode(true);
    setActiveTab('staff');
    showToast("Opened Kofi's Staff Terminal · Live Camera Scanner ready");
  };

  return (
    <div className="flex flex-col w-full px-3.5 space-y-3 pb-8 pt-2 box-border">
      {/* Store Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#00652c] text-white shadow-sm p-4 flex flex-col justify-between min-h-[130px]">
        <div className="absolute -right-6 -bottom-8 w-40 h-40 rounded-full bg-[#008137]/40 blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col items-start max-w-[85%]">
          <span className="text-[10px] uppercase tracking-wider text-[#ffdbca] bg-[#9d4300]/80 px-2.5 py-0.5 rounded-full mb-1 font-black">
            Neighborhood Provisions
          </span>
          <h2 className="text-[20px] font-black tracking-tight leading-tight text-white mb-1 font-sans">
            Sadly Prime
          </h2>
          <p className="text-[12px] text-[#d3ffd5] leading-snug">
            Order on your phone, pay with MoMo (<span className="font-mono font-bold text-white">0597117861</span>), and collect at the window.
          </p>
        </div>
        <div className="relative z-10 flex items-center justify-between mt-2 pt-1 border-t border-white/10">
          <div className="flex items-center gap-1.5 text-[#d3ffd5] text-[11px] font-medium">
            <span className="material-symbols-outlined text-[15px] text-[#7ffc97]">storefront</span>
            <span>Pickup Window Ready</span>
          </div>
          <span className="text-[11px] font-bold text-white bg-white/20 px-2 py-0.5 rounded-full">
            MoMo: 0597117861
          </span>
        </div>
      </div>

      {/* If Search Active */}
      {searchQuery ? (
        <div className="flex flex-col space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <h3 className="text-[15px] text-[#0c200d] font-black tracking-tight">
              Results for "{searchQuery}" ({filteredProducts.length})
            </h3>
          </div>
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center text-[#3f493f] border border-[#becabc]/30">
              <span className="material-symbols-outlined text-4xl text-[#becabc] mb-1">search_off</span>
              <p className="font-bold text-[#0c200d]">No items match "{searchQuery}"</p>
              <p className="text-xs mt-0.5">Try searching for Milo, St. Louis Sugar, Omo, or Milk</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} variant="grid" />
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Fast Counter Staples (Carousel) */}
          {selectedCategory === 'all' && (
            <div className="flex flex-col space-y-1.5 pt-0.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[#fd761a] text-[18px]">
                    local_fire_department
                  </span>
                  <h3 className="text-[15px] text-[#0c200d] font-black tracking-tight">
                    Fast Counter Staples
                  </h3>
                </div>
                <span className="text-[10px] text-[#9d4300] font-black bg-[#ffdbca] px-2 py-0.5 rounded-full">
                  Popular Daily Picks
                </span>
              </div>
              <div className="flex gap-2 overflow-x-auto py-1 -mx-3.5 px-3.5 no-scrollbar">
                {bestSellers.map((p) => (
                  <ProductCard key={p.id} product={p} variant="carousel" />
                ))}
              </div>
            </div>
          )}

          {/* All Provisions Grid (24 items) */}
          <div className="flex flex-col space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] text-[#0c200d] font-black tracking-tight">
                Store Shelf Stock ({filteredProducts.length})
              </h3>
              <span className="text-[11px] text-[#00652c] font-bold">In Stock Today</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} variant="grid" />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Discrete Isolated Staff Entrance at Footer */}
      <div className="pt-6 pb-4 flex flex-col items-center justify-center text-center border-t border-[#becabc]/30 mt-4">
        <button
          onClick={handleOpenStaffPortal}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#213521] text-white hover:bg-[#00652c] text-[11px] font-bold transition-all shadow-xs active:scale-95 cursor-pointer"
        >
          <span className="material-symbols-outlined text-[16px]">badge</span>
          <span>Staff Window Portal · Kofi & Mr. S.A</span>
        </button>
        <span className="text-[10px] text-[#6f7a6e] mt-1.5">
          Dedicated pickup terminal with live camera QR scanner & fraud prevention
        </span>
      </div>
    </div>
  );
};
