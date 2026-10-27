import React from 'react';
import { useCart } from '../context/CartContext';

export const Header: React.FC = () => {
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    setActiveTab,
    activeTab,
    setIsPosterModalOpen,
    setSelectedProduct,
    totalCartItemCount,
    isStaffMode,
  } = useCart();

  // If in staff mode, StaffScreen handles its own staff header
  if (isStaffMode || activeTab === 'staff') {
    return null;
  }

  const categories = [
    { id: 'all', label: 'All Provisions', icon: '🏪' },
    { id: 'breakfast', label: 'Breakfast & Tea', icon: '☕' },
    { id: 'canned', label: 'Canned Goods', icon: '🥫' },
    { id: 'cleaning', label: 'Detergents & Soap', icon: '🧺' },
    { id: 'toiletries', label: 'Personal Care', icon: '🧼' },
    { id: 'provisions', label: 'Fast Food Staples', icon: '🍜' },
    { id: 'beverages', label: 'Cold Drinks', icon: '🥤' },
  ];

  return (
    <header className="sticky top-0 left-0 right-0 w-full z-40 bg-[#ebffe5]/95 backdrop-blur-xl border-b border-[#becabc]/40 shadow-[0_2px_12px_rgba(0,0,0,0.04)] box-border">
      <div className="px-3.5 pt-2.5 pb-2 flex flex-col gap-2 w-full box-border">
        {/* Top brand row */}
        <div className="flex items-center justify-between gap-2 w-full">
          {/* Logo & Store Title */}
          <button
            onClick={() => {
              setSelectedProduct(null);
              setActiveTab('shop');
            }}
            className="flex items-center gap-2 cursor-pointer text-left min-w-0 active:scale-95 transition-transform"
          >
            <div className="w-9 h-9 shrink-0 rounded-xl bg-[#00652c] text-white flex items-center justify-center font-black text-[14px] shadow-sm tracking-tight">
              SP
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[17px] leading-tight text-[#00652c] font-black tracking-tight font-sans">
                Sadly Prime
              </span>
              <span className="text-[10px] text-[#9d4300] font-extrabold tracking-wide truncate">
                MoMo: 0597117861 · Fast Pickup
              </span>
            </div>
          </button>

          {/* Customer Top Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Entrance Poster button */}
            <button
              onClick={() => setIsPosterModalOpen(true)}
              title="View Storefront Entrance QR Poster"
              aria-label="Entrance QR"
              className="flex items-center justify-center gap-1 bg-[#dcf5d6] hover:bg-[#d0e9cb] text-[#00652c] h-9 min-w-9 px-2 min-[420px]:px-2.5 rounded-full text-[11px] font-bold transition-all active:scale-95 cursor-pointer shadow-2xs border border-[#becabc]/40"
            >
              <span className="material-symbols-outlined text-[18px]">qr_code_2</span>
              <span className="hidden min-[420px]:inline">Entrance QR</span>
            </button>

            {/* Cart Icon Counter */}
            <button
              onClick={() => {
                setSelectedProduct(null);
                setActiveTab('cart');
              }}
              className="relative w-9 h-9 rounded-full bg-white flex items-center justify-center text-[#00652c] shadow-2xs border border-[#becabc]/40 active:scale-90 transition-transform cursor-pointer hover:bg-[#e1fbdc]"
              title="View Basket"
            >
              <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
              {totalCartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#fd761a] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-xs">
                  {totalCartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search Bar - static at top */}
        {activeTab === 'shop' && (
          <div className="relative flex items-center w-full box-border">
            <span className="material-symbols-outlined absolute left-3 text-[#3f493f] pointer-events-none text-[19px]">
              search
            </span>
            <input
              className="w-full h-10 pl-10 pr-8 rounded-full bg-white text-[#0c200d] text-[13px] placeholder:text-[#6f7a6e] focus:outline-none focus:ring-2 focus:ring-[#00652c] shadow-[0_2px_8px_-2px_rgba(26,46,26,0.06)] border border-[#becabc]/30"
              placeholder="Search Milo, sugar, Omo, milk, Geisha, sardines..."
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 text-[#3f493f] hover:text-[#0c200d] p-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        )}

        {/* Category Filter Rail - static at top */}
        {activeTab === 'shop' && (
          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 -mx-3.5 px-3.5 no-scrollbar w-[calc(100%+1.75rem)] box-border">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold shrink-0 transition-all active:scale-95 cursor-pointer ${
                    isActive
                      ? 'bg-[#00652c] text-white shadow-xs'
                      : 'bg-white text-[#0c200d] hover:bg-[#e1fbdc] border border-[#becabc]/40 shadow-2xs'
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
