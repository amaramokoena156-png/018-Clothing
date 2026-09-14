import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Smartphone,
  Building2,
  QrCode,
  Lock,
  CheckCircle2,
  X,
  ExternalLink,
  ArrowRight,
  AlertCircle,
  Clock,
  Check,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Address } from '../types';

interface PayFastModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
    orderNumber: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    shippingAddress: Address;
    shippingMethod: string;
    notes?: string;
    subtotal: number;
    shippingCost: number;
    discount: number;
    total: number;
  };
  onPaymentSuccess: () => void;
}

type PayFastSubMethod = 'card' | 'capitec_pay' | 'instant_eft' | 'scan_to_pay' | 'hosted_form';

export const PayFastModal: React.FC<PayFastModalProps> = ({
  isOpen,
  onClose,
  orderData,
  onPaymentSuccess,
}) => {
  const { siteSettings, showToast } = useStore();
  const [selectedSubMethod, setSelectedSubMethod] = useState<PayFastSubMethod>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'details' | 'otp' | 'success'>('details');

  // Card details
  const [cardNumber, setCardNumber] = useState('4000 1234 5678 9010');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('881');
  const [cardHolder, setCardHolder] = useState(orderData.customerName || 'Amara Mokoena');

  // Capitec Pay details
  const [capitecPhone, setCapitecPhone] = useState(orderData.customerPhone || '079 413 3820');
  const [capitecWaitingApproval, setCapitecWaitingApproval] = useState(false);

  // Instant EFT details
  const [selectedBank, setSelectedBank] = useState('capitec');

  // 3D Secure OTP
  const [otpCode, setOtpCode] = useState('0182026');

  if (!isOpen) return null;

  const isSandbox = siteSettings.payfastSandbox ?? true;
  const merchantId = siteSettings.payfastMerchantId || '10000100';
  const merchantKey = siteSettings.payfastMerchantKey || '46f0cd694581a';
  const payfastProcessUrl = isSandbox
    ? 'https://sandbox.payfast.co.za/eng/process'
    : 'https://www.payfast.co.za/eng/process';

  const saBanks = [
    { id: 'capitec', name: 'Capitec Bank', color: 'bg-red-50 text-red-700 border-red-200' },
    { id: 'fnb', name: 'FNB (First National Bank)', color: 'bg-cyan-50 text-cyan-800 border-cyan-200' },
    { id: 'standard', name: 'Standard Bank', color: 'bg-blue-50 text-blue-800 border-blue-200' },
    { id: 'absa', name: 'Absa Bank', color: 'bg-rose-50 text-rose-800 border-rose-200' },
    { id: 'nedbank', name: 'Nedbank', color: 'bg-emerald-50 text-emerald-800 border-emerald-200' },
    { id: 'tymebank', name: 'TymeBank', color: 'bg-yellow-50 text-yellow-800 border-yellow-200' },
    { id: 'investec', name: 'Investec', color: 'bg-slate-50 text-slate-800 border-slate-200' },
    { id: 'discovery', name: 'Discovery Bank', color: 'bg-purple-50 text-purple-800 border-purple-200' },
  ];

  const handleCardPayment = () => {
    setIsProcessing(true);
    // Simulate 3D Secure handoff
    setTimeout(() => {
      setIsProcessing(false);
      setStep('otp');
    }, 1000);
  };

  const handleVerifyOtp = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      showToast('PayFast Payment Authorized Successfully!');
      setTimeout(() => {
        onPaymentSuccess();
      }, 1000);
    }, 1200);
  };

  const handleCapitecPaySubmit = () => {
    setCapitecWaitingApproval(true);
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setCapitecWaitingApproval(false);
      setStep('success');
      showToast('Capitec Pay Request Approved in App!');
      setTimeout(() => {
        onPaymentSuccess();
      }, 1000);
    }, 2500);
  };

  const handleInstantEftSubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      showToast('Instant EFT Confirmed by Bank!');
      setTimeout(() => {
        onPaymentSuccess();
      }, 1000);
    }, 1500);
  };

  const handleScanToPaySubmit = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setStep('success');
      showToast('Scan to Pay QR code approved on mobile device!');
      setTimeout(() => {
        onPaymentSuccess();
      }, 1000);
    }, 1500);
  };

  return (
    <div
      id="payfast-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="payfast-modal-container"
        className="relative w-full max-w-2xl bg-white dark:bg-[#15181b] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top PayFast Header */}
        <div className="bg-[#b81d24] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* PayFast Badge */}
            <div className="bg-white px-2.5 py-1 rounded shadow-xs">
              <span className="font-extrabold text-sm tracking-tight text-[#b81d24] font-['Syne']">
                Pay<span className="text-neutral-900">Fast</span>
              </span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">
                South Africa Secure Payment Gateway
              </p>
              <p className="text-[11px] text-white/80">
                Merchant: 018 Bokone Bophirima (Pty) Ltd
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isSandbox && (
              <span className="bg-white/20 text-white text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border border-white/30">
                Sandbox Mode
              </span>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Order Summary Ribbon */}
        <div className="bg-neutral-50 dark:bg-[#101214] px-6 py-3 border-b border-neutral-200 dark:border-neutral-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span className="font-medium text-neutral-600 dark:text-neutral-400">
              Order <strong className="text-neutral-900 dark:text-white">#{orderData.orderNumber}</strong>
            </span>
          </div>
          <div className="text-right">
            <span className="text-neutral-500 mr-2 text-[11px]">Total to Pay:</span>
            <span className="font-extrabold text-base text-[#b81d24] font-['Syne']">
              R{orderData.total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {step === 'details' && (
            <>
              {/* Payment Methods Selector Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedSubMethod('card')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedSubMethod === 'card'
                      ? 'border-[#b81d24] bg-red-50/50 dark:bg-red-950/30 text-[#b81d24] dark:text-red-400 ring-1 ring-[#b81d24]'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-neutral-400'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1.5" />
                  <span className="text-xs font-bold block">Credit / Debit</span>
                  <span className="text-[10px] text-neutral-400">Visa / MC</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSubMethod('capitec_pay')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedSubMethod === 'capitec_pay'
                      ? 'border-[#b81d24] bg-red-50/50 dark:bg-red-950/30 text-[#b81d24] dark:text-red-400 ring-1 ring-[#b81d24]'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-neutral-400'
                  }`}
                >
                  <Smartphone className="w-5 h-5 mx-auto mb-1.5" />
                  <span className="text-xs font-bold block">Capitec Pay</span>
                  <span className="text-[10px] text-neutral-400">App Approval</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSubMethod('instant_eft')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedSubMethod === 'instant_eft'
                      ? 'border-[#b81d24] bg-red-50/50 dark:bg-red-950/30 text-[#b81d24] dark:text-red-400 ring-1 ring-[#b81d24]'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-neutral-400'
                  }`}
                >
                  <Building2 className="w-5 h-5 mx-auto mb-1.5" />
                  <span className="text-xs font-bold block">Instant EFT</span>
                  <span className="text-[10px] text-neutral-400">All SA Banks</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedSubMethod('scan_to_pay')}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedSubMethod === 'scan_to_pay'
                      ? 'border-[#b81d24] bg-red-50/50 dark:bg-red-950/30 text-[#b81d24] dark:text-red-400 ring-1 ring-[#b81d24]'
                      : 'border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:border-neutral-400'
                  }`}
                >
                  <QrCode className="w-5 h-5 mx-auto mb-1.5" />
                  <span className="text-xs font-bold block">Scan to Pay</span>
                  <span className="text-[10px] text-neutral-400">SnapScan/Zapper</span>
                </button>
              </div>

              {/* Method 1: Credit / Debit Card Form */}
              {selectedSubMethod === 'card' && (
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                      Card Number
                    </label>
                    <div className="relative mt-1">
                      <CreditCard className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="4000 1234 5678 9010"
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                        Expiry Date (MM/YY)
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="12/28"
                        className="w-full mt-1 p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                        Security Code (CVV)
                      </label>
                      <input
                        type="text"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="881"
                        maxLength={4}
                        className="w-full mt-1 p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="e.g. Amara Mokoena"
                      className="w-full mt-1 p-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleCardPayment}
                    disabled={isProcessing}
                    className="w-full py-3.5 rounded-xl bg-[#b81d24] hover:bg-[#a0181e] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>
                      {isProcessing ? 'Contacting Bank 3D Secure...' : `Pay R${orderData.total.toLocaleString()} via PayFast`}
                    </span>
                  </button>
                </div>
              )}

              {/* Method 2: Capitec Pay */}
              {selectedSubMethod === 'capitec_pay' && (
                <div className="space-y-4 text-xs">
                  <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-red-800 dark:text-red-300">
                    <p className="font-bold">Capitec Pay Direct Mobile Flow</p>
                    <p className="text-[11px] mt-0.5 text-neutral-600 dark:text-neutral-400">
                      Enter your Capitec registered cellphone or ID number. You will receive an instant push notification on your Capitec Banking App to authorize.
                    </p>
                  </div>

                  <div>
                    <label className="font-bold uppercase text-neutral-600 dark:text-neutral-400">
                      Capitec Registered Cellphone or SA ID
                    </label>
                    <div className="relative mt-1">
                      <Smartphone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={capitecPhone}
                        onChange={(e) => setCapitecPhone(e.target.value)}
                        placeholder="079 413 3820"
                        className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white font-mono"
                      />
                    </div>
                  </div>

                  {capitecWaitingApproval && (
                    <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 space-y-2 text-center animate-pulse">
                      <Clock className="w-5 h-5 mx-auto text-amber-600" />
                      <p className="font-bold">Waiting for App Approval...</p>
                      <p className="text-[11px]">
                        Open your Capitec Banking App and tap <strong>Approve</strong> on the pending payment of R{orderData.total.toLocaleString()}.
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleCapitecPaySubmit}
                    disabled={isProcessing}
                    className="w-full py-3.5 rounded-xl bg-[#b81d24] hover:bg-[#a0181e] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>
                      {isProcessing ? 'Awaiting Capitec App Authorization...' : `Send Capitec Pay Request (R${orderData.total.toLocaleString()})`}
                    </span>
                  </button>
                </div>
              )}

              {/* Method 3: Instant EFT */}
              {selectedSubMethod === 'instant_eft' && (
                <div className="space-y-4 text-xs">
                  <p className="text-neutral-600 dark:text-neutral-400">
                    Select your South African bank to launch PayFast Instant EFT:
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {saBanks.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setSelectedBank(b.id)}
                        className={`p-2.5 rounded-xl border text-center transition-all ${
                          selectedBank === b.id
                            ? 'border-[#b81d24] ring-2 ring-[#b81d24] font-bold text-neutral-900 dark:text-white bg-red-50/20'
                            : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 text-neutral-700 dark:text-neutral-300'
                        }`}
                      >
                        <Building2 className="w-4 h-4 mx-auto mb-1 text-neutral-500" />
                        <span className="text-[11px] block leading-tight">{b.name}</span>
                      </button>
                    ))}
                  </div>

                  <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl text-[11px] text-neutral-500">
                    PayFast provides automatic account verification with zero delays. No proof of payment required.
                  </div>

                  <button
                    type="button"
                    onClick={handleInstantEftSubmit}
                    disabled={isProcessing}
                    className="w-full py-3.5 rounded-xl bg-[#b81d24] hover:bg-[#a0181e] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <Building2 className="w-4 h-4" />
                    <span>
                      {isProcessing ? 'Connecting to Bank Gateway...' : `Authorize Instant EFT (R${orderData.total.toLocaleString()})`}
                    </span>
                  </button>
                </div>
              )}

              {/* Method 4: Scan to Pay / Masterpass / SnapScan / Zapper */}
              {selectedSubMethod === 'scan_to_pay' && (
                <div className="space-y-4 text-xs text-center">
                  <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800/50 inline-block mx-auto space-y-2">
                    {/* Visual QR Code Generator */}
                    <div className="w-40 h-40 mx-auto bg-neutral-900 p-2 rounded-lg flex items-center justify-center text-white">
                      <div className="w-full h-full border-2 border-dashed border-white/40 flex flex-col items-center justify-center text-center p-2">
                        <QrCode className="w-16 h-16 text-white mb-1" />
                        <span className="text-[9px] font-mono uppercase tracking-wider">
                          018-{orderData.orderNumber}
                        </span>
                      </div>
                    </div>
                    <p className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300">
                      Scan with any SA Banking App, Masterpass, SnapScan, or Zapper
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleScanToPaySubmit}
                    disabled={isProcessing}
                    className="w-full py-3.5 rounded-xl bg-[#b81d24] hover:bg-[#a0181e] text-white font-bold text-xs uppercase tracking-wider transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>
                      {isProcessing ? 'Verifying Mobile QR Scan...' : `I Have Scanned & Paid (R${orderData.total.toLocaleString()})`}
                    </span>
                  </button>
                </div>
              )}

              {/* Direct PayFast Form POST Fallback for Live Deployments */}
              <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800">
                <form action={payfastProcessUrl} method="POST" target="_blank" className="flex items-center justify-between text-xs">
                  <input type="hidden" name="merchant_id" value={merchantId} />
                  <input type="hidden" name="merchant_key" value={merchantKey} />
                  <input type="hidden" name="return_url" value={window.location.origin} />
                  <input type="hidden" name="cancel_url" value={window.location.origin} />
                  <input type="hidden" name="notify_url" value={`${window.location.origin}/api/payfast-notify`} />
                  <input type="hidden" name="name_first" value={orderData.shippingAddress.firstName} />
                  <input type="hidden" name="name_last" value={orderData.shippingAddress.lastName} />
                  <input type="hidden" name="email_address" value={orderData.customerEmail} />
                  <input type="hidden" name="cell_number" value={orderData.customerPhone} />
                  <input type="hidden" name="m_payment_id" value={orderData.orderNumber} />
                  <input type="hidden" name="amount" value={orderData.total.toFixed(2)} />
                  <input type="hidden" name="item_name" value={`018 Bokone Bophirima Order #${orderData.orderNumber}`} />

                  <span className="text-neutral-400 text-[11px]">
                    Official PayFast Host Target: <span className="font-mono">{isSandbox ? 'Sandbox' : 'Production'}</span>
                  </span>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200 text-[11px] font-bold underline"
                  >
                    <span>Open PayFast External Window</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </form>
              </div>
            </>
          )}

          {/* Step 2: 3D Secure OTP Verification Screen */}
          {step === 'otp' && (
            <div className="space-y-5 text-center py-4 text-xs animate-in fade-in duration-200">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/50 text-[#b81d24] flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  3D Secure Bank Verification
                </h3>
                <p className="text-neutral-500 mt-1 max-w-sm mx-auto">
                  Your South African bank requires a One-Time PIN (OTP) to authorize the transaction of <strong>R{orderData.total.toLocaleString()}</strong>.
                </p>
              </div>

              <div className="max-w-xs mx-auto space-y-3">
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="Enter 6-digit OTP"
                  className="w-full text-center tracking-widest text-lg font-bold font-mono py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                />
                <p className="text-[11px] text-neutral-400">
                  Default test code: <strong className="font-mono">0182026</strong>
                </p>
              </div>

              <div className="flex gap-2 max-w-xs mx-auto">
                <button
                  type="button"
                  onClick={() => setStep('details')}
                  className="w-1/3 py-2.5 rounded-xl border border-neutral-300 dark:border-neutral-700 font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isProcessing}
                  className="w-2/3 py-2.5 rounded-xl bg-[#b81d24] hover:bg-[#a0181e] text-white font-bold uppercase tracking-wider"
                >
                  {isProcessing ? 'Authorizing...' : 'Submit OTP'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment Success State */}
          {step === 'success' && (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-neutral-900 dark:text-white font-['Syne']">
                  PayFast Payment Authorized
                </h3>
                <p className="text-xs text-neutral-500 mt-1">
                  Transaction approved by PayFast. Redirecting to your 018 Order Confirmation...
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Security Footer */}
        <div className="bg-neutral-50 dark:bg-[#101214] px-6 py-3.5 border-t border-neutral-200 dark:border-neutral-800 flex items-center justify-between text-[11px] text-neutral-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit SSL Encrypted • PCI-DSS Level 1 Certified</span>
          </div>
          <span className="font-semibold text-neutral-500">
            PayFast SA
          </span>
        </div>
      </div>
    </div>
  );
};
