import React, { createContext, useContext, useState, useMemo } from 'react';
import { Product, CartItem, OrderState, ScanResult } from '../types';
import { PROVISION_PRODUCTS, INITIAL_ORDERS } from '../data/mockData';

interface CartContextType {
  // Catalog & Cart
  products: Product[];
  cartItems: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  updateQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  itemsSubtotal: number;
  totalCartItemCount: number;

  // Navigation
  activeTab: 'shop' | 'cart' | 'receipt' | 'staff';
  setActiveTab: (tab: 'shop' | 'cart' | 'receipt' | 'staff') => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;

  // Orders & QR
  orders: OrderState[];
  currentOrderId: string;
  setCurrentOrderId: (id: string) => void;
  currentOrder: OrderState | undefined;
  placeMoMoOrder: (network: string, phone: string) => OrderState;

  // Staff workflow actions
  updateOrderStatus: (orderId: string, status: OrderState['status']) => void;
  markOrderAsPacking: (orderId: string) => void;
  markOrderAsReady: (orderId: string) => void;
  markOrderAsCollected: (orderId: string) => void;
  validatePickupCode: (code: string) => ScanResult;

  // Modals
  isPosterModalOpen: boolean;
  setIsPosterModalOpen: (open: boolean) => void;
  isMoMoModalOpen: boolean;
  setIsMoMoModalOpen: (open: boolean) => void;
  isScannerModalOpen: boolean;
  setIsScannerModalOpen: (open: boolean) => void;

  // Staff mode flag
  isStaffMode: boolean;
  setIsStaffMode: (mode: boolean) => void;

  // Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
  hideToast: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products] = useState<Product[]>(PROVISION_PRODUCTS);

  // Pre-seed cart with Milo, Sugar, and Omo matching Ama's story!
  const [cartItems, setCartItems] = useState<CartItem[]>(() => [
    { product: PROVISION_PRODUCTS[0], quantity: 1 }, // Milo 400g
    { product: PROVISION_PRODUCTS[1], quantity: 1 }, // St. Louis Sugar
    { product: PROVISION_PRODUCTS[2], quantity: 1 }, // Omo Washing Powder
  ]);

  const [activeTab, setActiveTab] = useState<'shop' | 'cart' | 'receipt' | 'staff'>('shop');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Orders store
  const [orders, setOrders] = useState<OrderState[]>(INITIAL_ORDERS);
  const [currentOrderId, setCurrentOrderId] = useState<string>('SA-017');

  // Modals
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
  const [isMoMoModalOpen, setIsMoMoModalOpen] = useState(false);
  const [isScannerModalOpen, setIsScannerModalOpen] = useState(false);
  const [isStaffMode, setIsStaffMode] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((curr) => (curr === msg ? null : curr));
    }, 3500);
  };

  const hideToast = () => setToastMessage(null);

  const itemsSubtotal = useMemo(() => {
    return Number(
      cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0).toFixed(2)
    );
  }, [cartItems]);

  const totalCartItemCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  const currentOrder = useMemo(() => {
    return orders.find((o) => o.orderId === currentOrderId) || orders[0];
  }, [orders, currentOrderId]);

  const addToCart = (product: Product, qty: number = 1) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + qty } : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    showToast(`Added ${product.name} to basket`);
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    showToast('Basket cleared');
  };

  const placeMoMoOrder = (network: string, phone: string): OrderState => {
    const nextNum = Math.floor(20 + Math.random() * 80);
    const newId = `SA-0${nextNum}`;

    const newOrder: OrderState = {
      orderId: newId,
      customerName: 'Ama Boateng',
      customerPhone: phone || '024 456 7890',
      placedTime: 'Just now',
      paidTime: 'Just now',
      status: 'paid',
      paymentMethod: network || 'MTN MoMo',
      items: [...cartItems],
      subtotal: itemsSubtotal,
      tax: 0,
      total: itemsSubtotal,
    };

    setOrders((prev) => [newOrder, ...prev]);
    setCurrentOrderId(newId);
    setCartItems([]);
    setActiveTab('receipt');
    showToast(`Payment Approved! MoMo received for ${newId}`);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderState['status']) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.orderId === orderId) {
          const now = new Date();
          const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }).toLowerCase();
          return {
            ...o,
            status,
            ...(status === 'collected' ? { collectedTime: timeStr } : {}),
          };
        }
        return o;
      })
    );
  };

  const markOrderAsPacking = (orderId: string) => {
    updateOrderStatus(orderId, 'packing');
    showToast(`Order ${orderId} marked as Packing`);
  };

  const markOrderAsReady = (orderId: string) => {
    updateOrderStatus(orderId, 'ready');
    showToast(`Order ${orderId} marked Ready for Pickup! 🔔`);
  };

  const markOrderAsCollected = (orderId: string) => {
    updateOrderStatus(orderId, 'collected');
    showToast(`Order ${orderId} marked as COLLECTED`);
  };

  // Story 4: Verification against fraud & mistakes
  const validatePickupCode = (rawCode: string): ScanResult => {
    const cleanId = rawCode.trim().toUpperCase();
    const order = orders.find((o) => o.orderId.toUpperCase() === cleanId);

    if (!order) {
      return {
        type: 'not_found',
        title: 'Order not found',
        subtitle: `No order records matching code "${rawCode}". Check order number.`,
      };
    }

    if (order.status === 'unpaid') {
      return {
        type: 'unpaid',
        title: 'Not paid — do not hand over',
        subtitle: `${order.orderId} is still UNPAID. Customer must approve MoMo first.`,
        order,
      };
    }

    if (order.status === 'packing' || order.status === 'paid') {
      return {
        type: 'packing',
        title: 'Not ready yet — still packing',
        subtitle: `${order.orderId} is currently being packed. Please ask customer to wait at the window.`,
        order,
      };
    }

    if (order.status === 'collected') {
      return {
        type: 'collected',
        title: `Already collected at ${order.collectedTime || '5:42 pm'}`,
        subtitle: `FRAUD ALERT: This receipt has already been redeemed! Do not hand over another bag.`,
        order,
      };
    }

    // Status is 'ready' and paid!
    return {
      type: 'ready',
      title: `${order.orderId} · PAID · READY`,
      subtitle: `Verified for ${order.customerName} (${order.paymentMethod}). Hand over bag and confirm.`,
      order,
    };
  };

  return (
    <CartContext.Provider
      value={{
        products,
        cartItems,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        itemsSubtotal,
        totalCartItemCount,
        activeTab,
        setActiveTab,
        selectedProduct,
        setSelectedProduct,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        orders,
        currentOrderId,
        setCurrentOrderId,
        currentOrder,
        placeMoMoOrder,
        updateOrderStatus,
        markOrderAsPacking,
        markOrderAsReady,
        markOrderAsCollected,
        validatePickupCode,
        isPosterModalOpen,
        setIsPosterModalOpen,
        isMoMoModalOpen,
        setIsMoMoModalOpen,
        isScannerModalOpen,
        setIsScannerModalOpen,
        isStaffMode,
        setIsStaffMode,
        toastMessage,
        showToast,
        hideToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
