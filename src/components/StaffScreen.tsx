import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { ScanResult } from '../types';
import { CameraQrScanner } from './CameraQrScanner';

export const StaffScreen: React.FC = () => {
  const {
    orders,
    validatePickupCode,
    markOrderAsPacking,
    markOrderAsReady,
    markOrderAsCollected,
    setIsPosterModalOpen,
    setIsStaffMode,
    setActiveTab,
    showToast,
  } = useCart();

  const [staffTab, setStaffTab] = useState<'scanner' | 'queue'>('scanner');
  const [inputCode, setInputCode] = useState('');
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [showTestTriggers, setShowTestTriggers] = useState(false);
  const [packedItems, setPackedItems] = useState<Record<string, boolean>>({});

  const handleScanSubmit = (codeToScan: string) => {
    const res = validatePickupCode(codeToScan);
    setScanResult(res);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    handleScanSubmit(inputCode);
    setInputCode('');
  };

  const handleHandOver = () => {
    if (scanResult?.order) {
      markOrderAsCollected(scanResult.order.orderId);
      setScanResult({
        type: 'collected',
        title: `Already collected just now`,
        subtitle: `Bag handed over by Kofi. Order marked COLLECTED. Customer receipt updated.`,
        order: { ...scanResult.order, status: 'collected' },
      });
      showToast(`Bag handed over for ${scanResult.order.orderId}! Marked COLLECTED.`);
    }
  };

  const togglePackedCheck = (orderId: string, itemIdx: number) => {
    const key = `${orderId}-${itemIdx}`;
    setPackedItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExitStaffMode = () => {
    setIsStaffMode(false);
    setActiveTab('shop');
    showToast('Switched to Customer Storefront');
  };

  const pendingPackingCount = orders.filter((o) => o.status === 'paid' || o.status === 'packing').length;
  const readyCount = orders.filter((o) => o.status === 'ready').length;

  return (
    <div className="flex flex-col w-full px-4 pb-28 gap-4 pt-3 box-border">
      {/* Staff Executive Top Bar */}
      <div className="bg-[#213521] text-white rounded-3xl p-4 shadow-md flex items-center justify-between border border-[#3f493f]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#00652c] text-white flex items-center justify-center font-black shadow-xs">
            <span className="material-symbols-outlined text-[24px]">point_of_sale</span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[15px] font-black tracking-tight">Kofi's Pickup Window</span>
              <span className="w-2 h-2 rounded-full bg-[#7ffc97] animate-pulse"></span>
            </div>
            <span className="text-[11px] text-[#79db8d] font-medium">
              Sadly Prime · Window #1 Active
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPosterModalOpen(true)}
            title="Print Storefront Poster"
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-[#dff8d9] flex items-center justify-center cursor-pointer active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[19px]">print</span>
          </button>

          <button
            onClick={handleExitStaffMode}
            className="bg-[#00652c] hover:bg-[#15803d] text-white px-3.5 py-2 rounded-full text-[12px] font-bold flex items-center gap-1 shadow-xs cursor-pointer active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">logout</span>
            <span>Customer View</span>
          </button>
        </div>
      </div>

      {/* Staff Navigation Tabs */}
      <div className="flex bg-[#dcf5d6] p-1 rounded-2xl border border-[#becabc]/40">
        <button
          onClick={() => setStaffTab('scanner')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer ${
            staffTab === 'scanner'
              ? 'bg-[#00652c] text-white shadow-xs'
              : 'text-[#0c200d] hover:bg-[#d0e9cb]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">photo_camera</span>
          <span>Camera Scanner</span>
        </button>

        <button
          onClick={() => setStaffTab('queue')}
          className={`flex-1 py-2.5 rounded-xl font-bold text-[13px] flex items-center justify-center gap-2 transition-all cursor-pointer ${
            staffTab === 'queue'
              ? 'bg-[#00652c] text-white shadow-xs'
              : 'text-[#0c200d] hover:bg-[#d0e9cb]'
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">checklist</span>
          <span>Packing Queue</span>
          {pendingPackingCount > 0 && (
            <span className="bg-[#fd761a] text-white text-[10px] px-2 py-0.2 rounded-full font-black">
              {pendingPackingCount}
            </span>
          )}
        </button>
      </div>

      {/* SCANNER VIEW */}
      {staffTab === 'scanner' && (
        <div className="flex flex-col gap-4">
          {/* VERIFICATION RESULT CARD (Story 3 & 4) */}
          {scanResult && (
            <div
              className={`rounded-3xl p-5 shadow-xl border-3 flex flex-col gap-3.5 transition-all animate-scale-up ${
                scanResult.type === 'ready'
                  ? 'bg-[#e1fbdc] border-[#00652c] text-[#0c200d]'
                  : scanResult.type === 'packing'
                  ? 'bg-[#fff9db] border-[#fd761a] text-[#5c2400]'
                  : 'bg-[#ffdad6] border-[#ba1a1a] text-[#93000a]'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`material-symbols-outlined text-[36px] ${
                      scanResult.type === 'ready'
                        ? 'text-[#00652c]'
                        : scanResult.type === 'packing'
                        ? 'text-[#9d4300]'
                        : 'text-[#ba1a1a]'
                    }`}
                  >
                    {scanResult.type === 'ready'
                      ? 'verified'
                      : scanResult.type === 'packing'
                      ? 'pending'
                      : 'gpp_bad'}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black uppercase tracking-wider opacity-80">
                      Scan Verification
                    </span>
                    <h2 className="text-[22px] font-black tracking-tight leading-tight">
                      {scanResult.title}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => setScanResult(null)}
                  className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center text-current cursor-pointer hover:bg-black/20"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <p className="text-[13px] font-bold leading-relaxed">{scanResult.subtitle}</p>

              {/* Ready Order Details & Handover */}
              {scanResult.type === 'ready' && scanResult.order && (
                <div className="bg-white rounded-2xl p-4 border border-[#00652c]/30 flex flex-col gap-3 shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f0]">
                    <span className="text-[12px] font-black text-[#00652c] uppercase">
                      Bag Checklist ({scanResult.order.customerName}):
                    </span>
                    <span className="text-[13px] font-black text-[#0c200d]">
                      GH₵ {scanResult.order.total.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {scanResult.order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between text-[13px] bg-[#f8faf6] p-2.5 rounded-xl border border-[#becabc]/30"
                      >
                        <span className="font-bold text-[#0c200d]">
                          {item.quantity}x {item.product.name}
                        </span>
                        <span className="text-[11px] font-bold text-[#00652c] bg-[#e1fbdc] px-2 py-0.5 rounded-full">
                          Ready
                        </span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={handleHandOver}
                    className="mt-1 w-full h-13 bg-[#00652c] hover:bg-[#15803d] text-white rounded-full font-black text-[15px] flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[22px]">task_alt</span>
                    Hand over bag & mark collected
                  </button>
                </div>
              )}

              {/* If Still Packing -> Quick One-Tap Ready Action */}
              {scanResult.type === 'packing' && scanResult.order && (
                <button
                  onClick={() => {
                    markOrderAsReady(scanResult.order!.orderId);
                    handleScanSubmit(scanResult.order!.orderId);
                  }}
                  className="w-full h-12 bg-[#fd761a] hover:bg-[#9d4300] text-white rounded-full font-bold text-[13px] flex items-center justify-center gap-2 shadow-md active:scale-95 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[18px]">done_all</span>
                  Finish Packing & Mark as Ready
                </button>
              )}
            </div>
          )}

          {/* Live Camera Scanner Box */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#becabc]/30 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#00652c] text-[22px]">
                  center_focus_strong
                </span>
                <span className="text-[14px] font-black text-[#0c200d]">
                  Live Camera QR Viewfinder
                </span>
              </div>
              <span className="text-[11px] text-[#3f493f]">Hold customer QR to lens</span>
            </div>

            <CameraQrScanner
              isOpen={true}
              onScan={(code) => handleScanSubmit(code)}
            />

            {/* Manual Entry Form */}
            <form onSubmit={handleManualSubmit} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Or enter order code (e.g. SA-017)"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                className="flex-1 h-11 px-3.5 rounded-xl bg-[#f8faf6] border border-[#becabc]/50 text-[14px] font-mono font-bold text-[#0c200d] focus:outline-none focus:ring-2 focus:ring-[#00652c]"
              />
              <button
                type="submit"
                className="px-5 bg-[#00652c] hover:bg-[#15803d] text-white rounded-xl text-[13px] font-bold active:scale-95 transition-all cursor-pointer shadow-xs"
              >
                Verify
              </button>
            </form>
          </div>

          {/* Story 3 & 4 Verification Test Scenarios (Clean, un-cramped drawer) */}
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-[#becabc]/30 flex flex-col gap-2.5">
            <button
              onClick={() => setShowTestTriggers(!showTestTriggers)}
              className="flex items-center justify-between w-full text-left cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#9d4300] text-[20px]">
                  science
                </span>
                <span className="text-[13px] font-black text-[#0c200d]">
                  Fraud & Status Simulation Tests (Story 4)
                </span>
              </div>
              <span className="material-symbols-outlined text-[#3f493f] text-[18px]">
                {showTestTriggers ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {showTestTriggers && (
              <div className="flex flex-col gap-2 pt-2 border-t border-[#f1f5f0] animate-scale-up">
                <p className="text-[11px] text-[#3f493f]">
                  Tap any scenario below to verify instant color-coded fraud prevention:
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleScanSubmit('SA-017')}
                    className="p-2.5 bg-[#e1fbdc] hover:bg-[#d0e9cb] text-[#00652c] rounded-2xl text-[11px] font-bold text-left flex flex-col gap-1 border border-[#00652c]/20 cursor-pointer"
                  >
                    <span className="text-[12px] font-black">SA-017 (Ama)</span>
                    <span className="text-[10px] text-[#00652c]">Valid Paid & Ready → GREEN</span>
                  </button>

                  <button
                    onClick={() => handleScanSubmit('SA-018')}
                    className="p-2.5 bg-[#fff9db] hover:bg-[#ffdbca] text-[#9d4300] rounded-2xl text-[11px] font-bold text-left flex flex-col gap-1 border border-[#fd761a]/30 cursor-pointer"
                  >
                    <span className="text-[12px] font-black">SA-018 (Yaa)</span>
                    <span className="text-[10px] text-[#9d4300]">Still Packing → YELLOW</span>
                  </button>

                  <button
                    onClick={() => handleScanSubmit('SA-015')}
                    className="p-2.5 bg-[#ffdad6] hover:bg-[#ffb690] text-[#ba1a1a] rounded-2xl text-[11px] font-bold text-left flex flex-col gap-1 border border-[#ba1a1a]/30 cursor-pointer"
                  >
                    <span className="text-[12px] font-black">SA-015 (Kwesi)</span>
                    <span className="text-[10px] text-[#ba1a1a]">Already Collected → RED</span>
                  </button>

                  <button
                    onClick={() => handleScanSubmit('SA-019')}
                    className="p-2.5 bg-[#ffdad6] hover:bg-[#ffb690] text-[#ba1a1a] rounded-2xl text-[11px] font-bold text-left flex flex-col gap-1 border border-[#ba1a1a]/30 cursor-pointer"
                  >
                    <span className="text-[12px] font-black">SA-019 (Kojo)</span>
                    <span className="text-[10px] text-[#ba1a1a]">Unpaid Ticket → RED</span>
                  </button>

                  <button
                    onClick={() => handleScanSubmit('FAKE-CODE-999')}
                    className="col-span-2 p-2.5 bg-[#f1f5f0] text-[#3f493f] rounded-2xl text-[11px] font-bold text-left flex items-center justify-between border border-[#becabc]/40 cursor-pointer"
                  >
                    <span className="text-[12px] font-black text-[#0c200d]">Invalid / Fake Code</span>
                    <span className="text-[10px] text-[#ba1a1a] font-black">Order Not Found → RED</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PACKING QUEUE VIEW */}
      {staffTab === 'queue' && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-[13px] font-black text-[#0c200d]">
              Live Store Pickup Tickets ({orders.length})
            </span>
            <span className="text-[11px] font-bold text-[#00652c] bg-[#e1fbdc] px-2.5 py-0.5 rounded-full">
              {readyCount} Ready at Window
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {orders.map((o) => (
              <div
                key={o.orderId}
                className="p-4 rounded-3xl bg-white border border-[#becabc]/40 shadow-xs flex flex-col gap-3"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f0]">
                  <div className="flex items-center gap-2">
                    <span className="text-[16px] font-mono font-black text-[#00652c]">
                      {o.orderId}
                    </span>
                    <span className="text-[13px] font-bold text-[#0c200d]">{o.customerName}</span>
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${
                      o.status === 'ready'
                        ? 'bg-[#15803d] text-white'
                        : o.status === 'packing'
                        ? 'bg-[#fd761a] text-white'
                        : o.status === 'collected'
                        ? 'bg-[#becabc] text-[#0c200d]'
                        : o.status === 'paid'
                        ? 'bg-[#dcf5d6] text-[#00652c]'
                        : 'bg-[#ffdad6] text-[#ba1a1a]'
                    }`}
                  >
                    {o.status}
                  </span>
                </div>

                {/* Items Checklist with interactive checkboxes */}
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-bold text-[#3f493f]">Item Packing Checklist:</span>
                  {o.items.map((item, idx) => {
                    const isChecked = !!packedItems[`${o.orderId}-${idx}`];
                    return (
                      <div
                        key={idx}
                        onClick={() => togglePackedCheck(o.orderId, idx)}
                        className={`p-2 rounded-xl flex items-center justify-between cursor-pointer border transition-colors ${
                          isChecked
                            ? 'bg-[#e1fbdc]/60 border-[#00652c]/30 text-[#00652c]'
                            : 'bg-[#f8faf6] border-[#becabc]/30 text-[#0c200d]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-5 h-5 rounded-md flex items-center justify-center text-[14px] ${
                              isChecked ? 'bg-[#00652c] text-white' : 'border border-[#becabc]'
                            }`}
                          >
                            {isChecked && '✓'}
                          </span>
                          <span className={`text-[12px] font-bold ${isChecked ? 'line-through opacity-75' : ''}`}>
                            {item.quantity}x {item.product.name}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#3f493f]">
                          GH₵ {(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Action footer */}
                <div className="flex items-center justify-between pt-2 border-t border-[#f1f5f0]">
                  <div className="flex flex-col">
                    <span className="text-[12px] font-black text-[#0c200d]">
                      GH₵ {o.total.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-[#3f493f]">{o.paymentMethod}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {o.status === 'paid' && (
                      <button
                        onClick={() => markOrderAsPacking(o.orderId)}
                        className="px-3.5 py-1.5 bg-[#dcf5d6] hover:bg-[#d0e9cb] text-[#00652c] rounded-xl text-[11px] font-bold cursor-pointer active:scale-95 transition-all"
                      >
                        Start Packing
                      </button>
                    )}

                    {o.status === 'packing' && (
                      <button
                        onClick={() => markOrderAsReady(o.orderId)}
                        className="px-3.5 py-1.5 bg-[#15803d] hover:bg-[#00652c] text-white rounded-xl text-[11px] font-bold cursor-pointer active:scale-95 transition-all shadow-xs"
                      >
                        Mark as Ready
                      </button>
                    )}

                    {o.status === 'ready' && (
                      <button
                        onClick={() => {
                          setStaffTab('scanner');
                          handleScanSubmit(o.orderId);
                        }}
                        className="px-3.5 py-1.5 bg-[#00652c] hover:bg-[#15803d] text-white rounded-xl text-[11px] font-bold cursor-pointer active:scale-95 transition-all shadow-xs flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">qr_code_scanner</span>
                        <span>Verify & Hand Over</span>
                      </button>
                    )}

                    {o.status === 'collected' && (
                      <span className="text-[11px] text-[#3f493f] italic font-semibold">
                        Collected at {o.collectedTime || '5:42 pm'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
