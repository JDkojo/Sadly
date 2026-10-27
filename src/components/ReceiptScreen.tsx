import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useCart } from '../context/CartContext';

export const ReceiptScreen: React.FC = () => {
  const { currentOrder, orders, setCurrentOrderId, updateOrderStatus, setActiveTab, showToast } =
    useCart();

  if (!currentOrder) {
    return (
      <div className="p-6 text-center text-[#3f493f]">
        <p>No active order receipt found.</p>
        <button
          onClick={() => setActiveTab('shop')}
          className="mt-3 px-4 py-2 bg-[#00652c] text-white rounded-full text-xs font-bold"
        >
          Return to Sadly Prime Shop
        </button>
      </div>
    );
  }

  const getStatusBadge = () => {
    switch (currentOrder.status) {
      case 'paid':
        return {
          bg: 'bg-[#dcf5d6] text-[#00652c]',
          icon: 'check_circle',
          label: 'PAID · WAITING PACKING',
          desc: 'Your payment to 0597117861 was confirmed. Kofi has your ticket.',
        };
      case 'packing':
        return {
          bg: 'bg-[#ffdbca] text-[#9d4300]',
          icon: 'inventory_2',
          label: 'PACKING IN PROGRESS',
          desc: 'Kofi is packing your items at the front window.',
        };
      case 'ready':
        return {
          bg: 'bg-[#15803d] text-white animate-pulse',
          icon: 'shopping_bag',
          label: 'READY FOR PICKUP 🔔',
          desc: 'Your bag is packed! Walk to the pickup window and show your QR.',
        };
      case 'collected':
        return {
          bg: 'bg-[#becabc] text-[#0c200d]',
          icon: 'task_alt',
          label: 'COLLECTED',
          desc: `Handed over to you at ${currentOrder.collectedTime || '5:42 pm'}. Thank you for shopping with Sadly Prime!`,
        };
      case 'unpaid':
      default:
        return {
          bg: 'bg-[#ffdad6] text-[#ba1a1a]',
          icon: 'error',
          label: 'UNPAID',
          desc: 'Payment pending approval on mobile money.',
        };
    }
  };

  const statusInfo = getStatusBadge();

  return (
    <div className="flex flex-col w-full px-3.5 pb-28 gap-3.5 pt-1">
      {/* Receipt Top Header */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#becabc]/30 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00652c]"></span>
            <span className="text-[11px] font-black uppercase tracking-wider text-[#3f493f]">
              Sadly Prime Digital Receipt
            </span>
          </div>
          <span className="text-[12px] text-[#3f493f]">{currentOrder.placedTime}</span>
        </div>

        {/* Live Status Pill */}
        <div className={`p-2.5 rounded-xl flex items-center gap-2 ${statusInfo.bg}`}>
          <span className="material-symbols-outlined text-[20px]">{statusInfo.icon}</span>
          <div className="flex flex-col">
            <span className="text-[13px] font-black tracking-wide">{statusInfo.label}</span>
            <span className="text-[11px] opacity-90 leading-tight">{statusInfo.desc}</span>
          </div>
        </div>

        {/* Live Status Step Indicator */}
        <div className="grid grid-cols-4 gap-1.5 pt-1 text-center text-[10px] font-bold">
          <div
            className={`py-1 rounded-md ${
              ['paid', 'packing', 'ready', 'collected'].includes(currentOrder.status)
                ? 'bg-[#00652c] text-white'
                : 'bg-[#f1f5f0] text-[#3f493f]'
            }`}
          >
            1. Paid
          </div>
          <div
            className={`py-1 rounded-md ${
              ['packing', 'ready', 'collected'].includes(currentOrder.status)
                ? 'bg-[#00652c] text-white'
                : 'bg-[#f1f5f0] text-[#3f493f]'
            }`}
          >
            2. Packing
          </div>
          <div
            className={`py-1 rounded-md ${
              ['ready', 'collected'].includes(currentOrder.status)
                ? 'bg-[#00652c] text-white'
                : 'bg-[#f1f5f0] text-[#3f493f]'
            }`}
          >
            3. Ready
          </div>
          <div
            className={`py-1 rounded-md ${
              currentOrder.status === 'collected'
                ? 'bg-[#00652c] text-white'
                : 'bg-[#f1f5f0] text-[#3f493f]'
            }`}
          >
            4. Collected
          </div>
        </div>
      </div>

      {/* Large Pickup QR Code Card */}
      <div className="bg-white rounded-3xl p-5 shadow-md border-2 border-[#00652c]/30 flex flex-col items-center text-center">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#00652c] bg-[#e1fbdc] px-3 py-1 rounded-full mb-3">
          Pickup Window Pass
        </span>

        {/* QR Code */}
        <div className="p-4 bg-white rounded-2xl border-2 border-[#0c200d] shadow-sm flex flex-col items-center justify-center">
          <QRCodeSVG
            value={currentOrder.orderId}
            size={190}
            level="H"
            fgColor={currentOrder.status === 'collected' ? '#6f7a6e' : '#0c200d'}
            bgColor="#ffffff"
          />
        </div>

        {/* Large Order Number Printed Below QR */}
        <div className="mt-3 flex flex-col items-center">
          <span className="text-[32px] font-black tracking-wider text-[#00652c] font-mono leading-none">
            {currentOrder.orderId}
          </span>
          <span className="text-[11px] text-[#3f493f] mt-1 font-medium">
            Present this code to Kofi at Sadly Prime Pickup Counter
          </span>
        </div>

        {/* Store MoMo Info */}
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#3f493f] bg-[#f8faf6] px-3 py-1 rounded-full border border-[#becabc]/30">
          <span className="material-symbols-outlined text-[14px] text-[#00652c]">verified</span>
          <span>Paid to Sadly Prime: <strong className="font-mono text-[#00652c]">0597117861</strong></span>
        </div>

        {/* Simulation helper controls */}
        <div className="mt-4 pt-3 border-t border-[#f1f5f0] w-full flex flex-col gap-1.5">
          <span className="text-[10px] uppercase font-bold text-[#3f493f] tracking-wider">
            Simulate Staff Packing Progress:
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => updateOrderStatus(currentOrder.orderId, 'packing')}
              className="py-1 px-2 rounded-lg bg-[#f1f5f0] hover:bg-[#ffdbca] text-[10px] font-bold text-[#0c200d] cursor-pointer"
            >
              Set Packing
            </button>
            <button
              onClick={() => updateOrderStatus(currentOrder.orderId, 'ready')}
              className="py-1 px-2 rounded-lg bg-[#e1fbdc] hover:bg-[#d0e9cb] text-[10px] font-bold text-[#00652c] cursor-pointer"
            >
              Set Ready
            </button>
            <button
              onClick={() => updateOrderStatus(currentOrder.orderId, 'collected')}
              className="py-1 px-2 rounded-lg bg-[#f1f5f0] hover:bg-[#becabc] text-[10px] font-bold text-[#0c200d] cursor-pointer"
            >
              Set Collected
            </button>
          </div>
        </div>
      </div>

      {/* Items Summary Checklist */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-[#becabc]/30 flex flex-col gap-2.5">
        <div className="flex items-center justify-between pb-1 border-b border-[#f1f5f0]">
          <h3 className="text-[14px] font-bold text-[#0c200d]">
            Order Items ({currentOrder.items.reduce((acc, i) => acc + i.quantity, 0)})
          </h3>
          <span className="text-[12px] font-bold text-[#00652c]">
            Paid with {currentOrder.paymentMethod}
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {currentOrder.items.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between text-[13px]">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-full bg-[#dcf5d6] text-[#00652c] font-black text-[11px] flex items-center justify-center shrink-0">
                  {item.quantity}x
                </span>
                <span className="text-[#0c200d] font-bold truncate">{item.product.name}</span>
              </div>
              <span className="text-[#0c200d] font-semibold shrink-0">
                GH₵ {(item.product.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-[#f1f5f0] flex justify-between items-center text-[14px] font-black">
          <span>Total Paid</span>
          <span className="text-[#00652c]">GH₵ {currentOrder.total.toFixed(2)}</span>
        </div>
      </div>

      {/* Switch between demo orders */}
      <div className="bg-[#e1fbdc]/50 rounded-2xl p-3 border border-[#becabc]/30 flex flex-col gap-2">
        <span className="text-[11px] font-bold text-[#00652c]">View Other Receipts (Demo):</span>
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {orders.map((o) => (
            <button
              key={o.orderId}
              onClick={() => {
                setCurrentOrderId(o.orderId);
                showToast(`Loaded receipt for ${o.orderId} (${o.status})`);
              }}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold shrink-0 transition-all cursor-pointer ${
                o.orderId === currentOrder.orderId
                  ? 'bg-[#00652c] text-white shadow-xs'
                  : 'bg-white text-[#0c200d] hover:bg-[#dcf5d6]'
              }`}
            >
              {o.orderId} ({o.status})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
