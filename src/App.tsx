import React from 'react';
import { CartProvider, useCart } from './context/CartContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ShopScreen } from './components/ShopScreen';
import { ProductDetailScreen } from './components/ProductDetailScreen';
import { CartScreen } from './components/CartScreen';
import { ReceiptScreen } from './components/ReceiptScreen';
import { StaffScreen } from './components/StaffScreen';
import { EntrancePosterModal } from './components/EntrancePosterModal';
import { MoMoPaymentModal } from './components/MoMoPaymentModal';
import { Toast } from './components/Toast';

const AppContent: React.FC = () => {
  const { activeTab, selectedProduct } = useCart();

  return (
    <div className="min-h-screen w-full bg-[#ebffe5] font-sans antialiased text-[#0c200d] relative flex flex-col items-center overflow-x-hidden">
      {/* Maximum Mobile Frame constraint perfectly centered without overflow */}
      <div className="w-full max-w-md min-h-screen flex flex-col relative bg-[#ebffe5] shadow-xl overflow-x-hidden box-border">
        {/* Sticky Header with S.P branding & QR actions */}
        <Header />

        {/* Dynamic Toast Alerts */}
        <Toast />

        {/* Main View Area */}
        {/* Bottom padding keeps content clear of the fixed BottomNav (h-16) and the phone's home indicator */}
        <main
          className={`flex flex-col relative w-full bg-[#ebffe5] flex-1 box-border ${
            activeTab === 'staff' ? '' : 'pb-[calc(4rem+env(safe-area-inset-bottom))]'
          }`}
        >
          {selectedProduct ? (
            <ProductDetailScreen product={selectedProduct} />
          ) : activeTab === 'shop' ? (
            <ShopScreen />
          ) : activeTab === 'cart' ? (
            <CartScreen />
          ) : activeTab === 'receipt' ? (
            <ReceiptScreen />
          ) : (
            <StaffScreen />
          )}
        </main>

        {/* Bottom Navigation */}
        <BottomNav />

        {/* Modals & Flow Dialogs */}
        <EntrancePosterModal />
        <MoMoPaymentModal />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <CartProvider>
      <AppContent />
    </CartProvider>
  );
}
