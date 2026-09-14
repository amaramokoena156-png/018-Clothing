import React, { useState } from 'react';
import {
  X,
  ShieldCheck,
  Truck,
  CreditCard,
  MessageCircle,
  Lock,
  ArrowRight,
  CheckCircle,
  Smartphone,
  Building2,
  QrCode,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Address } from '../types';
import { PayFastModal } from './PayFastModal';

const SA_PROVINCES: Address['province'][] = [
  'North West',
  'Gauteng',
  'Western Cape',
  'KwaZulu-Natal',
  'Eastern Cape',
  'Free State',
  'Limpopo',
  'Mpumalanga',
  'Northern Cape',
];

export const CheckoutModal: React.FC = () => {
  const {
    isCheckoutModalOpen,
    setIsCheckoutModalOpen,
    cart,
    cartSubtotal,
    cartTotal,
    discountAmount,
    shippingCost,
    appliedDiscount,
    user,
    createOrder,
    showToast,
  } = useStore();

  const [step, setStep] = useState<'details' | 'payment'>('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPayFastModalOpen, setIsPayFastModalOpen] = useState(false);

  // Form State
  const [fullName, setFullName] = useState(user?.fullName || 'Amara Mokoena');
  const [email, setEmail] = useState(user?.email || 'amaramokoena156@gmail.com');
  const [phone, setPhone] = useState(user?.phone || '079 413 3820');

  const defaultAddr = user?.addresses.find((a) => a.isDefault) || user?.addresses[0];
  const [streetAddress, setStreetAddress] = useState(defaultAddr?.streetAddress || '14 Anderson Street');
  const [suburb, setSuburb] = useState(defaultAddr?.suburb || 'Wilkoppies');
  const [city, setCity] = useState(defaultAddr?.city || 'Klerksdorp');
  const [province, setProvince] = useState<Address['province']>(defaultAddr?.province || 'North West');
  const [postalCode, setPostalCode] = useState(defaultAddr?.postalCode || '2571');

  const [shippingMethod, setShippingMethod] = useState('The Courier Guy (Express Door-to-Door)');
  const [paymentMethod, setPaymentMethod] = useState<'payfast' | 'yoco' | 'ozow' | 'card' | 'whatsapp'>('payfast');
  const [orderNotes, setOrderNotes] = useState('');

  if (!isCheckoutModalOpen) return null;

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !streetAddress || !city || !postalCode) {
      showToast('Please fill in all mandatory delivery fields.');
      return;
    }
    setStep('payment');
  };

  const getCustomerAddress = (): Address => ({
    id: `addr-${Date.now()}`,
    firstName: fullName.split(' ')[0] || fullName,
    lastName: fullName.split(' ').slice(1).join(' ') || '',
    phone,
    streetAddress,
    suburb,
    city,
    province,
    postalCode,
    country: 'South Africa',
  });

  const handleFinalOrderSubmit = () => {
    if (paymentMethod === 'payfast') {
      // Launch the PayFast payment gateway modal
      setIsPayFastModalOpen(true);
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const address = getCustomerAddress();
      createOrder({
        customerName: fullName,
        customerEmail: email,
        customerPhone: phone,
        shippingAddress: address,
        paymentMethod,
        shippingMethod,
        notes: orderNotes,
      });

      setIsSubmitting(false);
      setIsCheckoutModalOpen(false);
      setStep('details');
    }, 1000);
  };

  const handlePayFastSuccess = () => {
    const address = getCustomerAddress();
    createOrder({
      customerName: fullName,
      customerEmail: email,
      customerPhone: phone,
      shippingAddress: address,
      paymentMethod: 'payfast',
      shippingMethod,
      notes: orderNotes,
    });

    setIsPayFastModalOpen(false);
    setIsCheckoutModalOpen(false);
    setStep('details');
  };

  return (
    <div
      id="checkout-modal-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
      onClick={() => setIsCheckoutModalOpen(false)}
    >
      <div
        id="checkout-modal-container"
        className="relative w-full max-w-4xl bg-white dark:bg-[#15181b] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#f35d1f]" />
            <h2 className="font-extrabold text-lg text-neutral-900 dark:text-white font-['Syne']">
              Secure South African Checkout
            </h2>
          </div>
          <button
            onClick={() => setIsCheckoutModalOpen(false)}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          {/* Left Column: Form Steps */}
          <div className="lg:col-span-7 p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Step Indicators */}
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider">
              <span
                className={`flex items-center gap-1.5 ${
                  step === 'details' ? 'text-[#f35d1f]' : 'text-emerald-600'
                }`}
              >
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>Delivery Details</span>
              </span>
              <span className="text-neutral-300 dark:text-neutral-700">→</span>
              <span
                className={`flex items-center gap-1.5 ${
                  step === 'payment' ? 'text-[#f35d1f]' : 'text-neutral-400'
                }`}
              >
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>Payment & Review</span>
              </span>
            </div>

            {step === 'details' ? (
              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div className="space-y-3">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full mt-1 p-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-1 focus:ring-[#f35d1f]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Mobile Phone (SA) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="079 413 3820"
                        className="w-full mt-1 p-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-1 focus:ring-[#f35d1f]"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                      Email Address (for order receipts & tracking) *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full mt-1 p-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-1 focus:ring-[#f35d1f]"
                    />
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                    Delivery Address
                  </h3>
                  <div>
                    <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={streetAddress}
                      onChange={(e) => setStreetAddress(e.target.value)}
                      placeholder="e.g. 14 Anderson Street"
                      className="w-full mt-1 p-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-1 focus:ring-[#f35d1f]"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Suburb
                      </label>
                      <input
                        type="text"
                        value={suburb}
                        onChange={(e) => setSuburb(e.target.value)}
                        placeholder="e.g. Wilkoppies"
                        className="w-full mt-1 p-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-1 focus:ring-[#f35d1f]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        City / Town *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Klerksdorp / Potchefstroom"
                        className="w-full mt-1 p-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-1 focus:ring-[#f35d1f]"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Province *
                      </label>
                      <select
                        value={province}
                        onChange={(e) => setProvince(e.target.value as Address['province'])}
                        className="w-full mt-1 p-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-1 focus:ring-[#f35d1f]"
                      >
                        {SA_PROVINCES.map((prov) => (
                          <option key={prov} value={prov}>
                            {prov}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        required
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="2571"
                        className="w-full mt-1 p-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-1 focus:ring-[#f35d1f]"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-neutral-200 dark:border-neutral-800">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#f35d1f]" />
                    <span>Courier Method</span>
                  </h3>
                  <div className="space-y-2">
                    {[
                      {
                        title: 'The Courier Guy (Express Door-to-Door)',
                        time: '2 - 4 Business Days',
                        fee: shippingCost === 0 ? 'FREE' : `R${shippingCost}`,
                      },
                      {
                        title: 'Paxi PEP-to-PEP Collection',
                        time: '3 - 5 Business Days',
                        fee: 'R60',
                      },
                    ].map((m, idx) => (
                      <label
                        key={idx}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer text-xs transition-colors ${
                          shippingMethod === m.title
                            ? 'border-[#f35d1f] bg-orange-50/50 dark:bg-orange-950/20'
                            : 'border-neutral-200 dark:border-neutral-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="shippingMethod"
                            checked={shippingMethod === m.title}
                            onChange={() => setShippingMethod(m.title)}
                            className="text-[#f35d1f] focus:ring-[#f35d1f]"
                          />
                          <div>
                            <p className="font-bold text-neutral-900 dark:text-white">
                              {m.title}
                            </p>
                            <p className="text-[11px] text-neutral-400">{m.time}</p>
                          </div>
                        </div>
                        <span className="font-bold text-neutral-900 dark:text-white">
                          {m.fee}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-[#f35d1f] hover:bg-[#ea580c] text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* Step 2: Payment & Final Placement via PayFast */
              <div className="space-y-5 animate-in fade-in duration-150">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white flex items-center gap-2">
                        <span>PayFast Payment Gateway</span>
                        <span className="text-[10px] bg-[#b81d24] text-white px-2 py-0.5 rounded font-bold uppercase">
                          Official Gateway
                        </span>
                      </h3>
                      <p className="text-[11px] text-neutral-500 mt-0.5">
                        All payments are securely handled by PayFast South Africa.
                      </p>
                    </div>
                  </div>

                  {/* PayFast Official Showcase Box */}
                  <div className="p-4 rounded-xl border-2 border-[#b81d24] bg-gradient-to-br from-red-50/40 via-white to-orange-50/20 dark:from-red-950/20 dark:via-[#15181b] dark:to-orange-950/10 space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="bg-[#b81d24] text-white px-2 py-0.5 rounded text-xs font-black tracking-tight font-['Syne']">
                          Pay<span className="text-white/90">Fast</span>
                        </div>
                        <span className="text-xs font-bold text-neutral-900 dark:text-white">
                          Verified Merchant: 018 Bokone Bophirima
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>PCI-DSS Level 1</span>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      Choose any of your preferred South African payment instruments on the next step:
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700">
                        <CreditCard className="w-4 h-4 text-[#b81d24] shrink-0" />
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-white text-[11px]">Credit &amp; Debit Cards</p>
                          <p className="text-[10px] text-neutral-400">Visa, Mastercard, Amex</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700">
                        <Smartphone className="w-4 h-4 text-[#b81d24] shrink-0" />
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-white text-[11px]">Capitec Pay</p>
                          <p className="text-[10px] text-neutral-400">Direct App Authorization</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700">
                        <Building2 className="w-4 h-4 text-[#b81d24] shrink-0" />
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-white text-[11px]">Instant EFT</p>
                          <p className="text-[10px] text-neutral-400">All 9 Major SA Banks</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 p-2 rounded-lg bg-white dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700">
                        <QrCode className="w-4 h-4 text-[#b81d24] shrink-0" />
                        <div>
                          <p className="font-bold text-neutral-900 dark:text-white text-[11px]">Scan to Pay</p>
                          <p className="text-[10px] text-neutral-400">SnapScan, Masterpass, Zapper</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                    Special Delivery Notes / Gate Code (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="e.g. Leave with complex security guard or call upon arrival"
                    className="w-full mt-1 p-2 text-xs rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-1 focus:ring-[#f35d1f]"
                  />
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep('details')}
                    className="py-3 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold text-xs uppercase hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                  >
                    Back
                  </button>

                  <button
                    id="btn-confirm-place-order"
                    type="button"
                    onClick={handleFinalOrderSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-6 rounded-xl bg-[#b81d24] hover:bg-[#a0181e] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Proceed to PayFast (R{cartTotal.toLocaleString()})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 bg-neutral-50 dark:bg-[#101214] p-6 sm:p-8 border-t lg:border-t-0 lg:border-l border-neutral-200 dark:border-neutral-800 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
                Order Summary ({cart.length} items)
              </h3>

              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center justify-between text-xs gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.product.images[0]?.url}
                        alt=""
                        className="w-10 h-12 object-cover rounded bg-neutral-200 shrink-0"
                      />
                      <div>
                        <p className="font-bold text-neutral-900 dark:text-white line-clamp-1">
                          {item.product.name}
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          Size: {item.size} • Qty: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-neutral-900 dark:text-white shrink-0">
                      R{(item.unitPrice * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-semibold text-neutral-900 dark:text-white">
                    R{cartSubtotal.toLocaleString()}
                  </span>
                </div>
                {appliedDiscount && (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                    <span>Discount ({appliedDiscount.code})</span>
                    <span className="font-mono font-bold">-R{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-mono font-semibold text-neutral-900 dark:text-white">
                    {shippingCost === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `R${shippingCost}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-neutral-950 dark:text-white pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <span>Total Due</span>
                  <span className="text-[#f35d1f] font-['Syne']">
                    R{cartTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-2 text-[11px] text-neutral-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-3.5 h-3.5 text-[#f35d1f]" />
                <span>Orders dispatched directly from Klerksdorp, North West</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#b81d24]" />
                <span>PayFast South Africa 256-Bit SSL Encrypted Processing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PayFast South Africa Payment Gateway Modal */}
      <PayFastModal
        isOpen={isPayFastModalOpen}
        onClose={() => setIsPayFastModalOpen(false)}
        orderData={{
          orderNumber: `${Math.floor(1000 + Math.random() * 9000)}`,
          customerName: fullName,
          customerEmail: email,
          customerPhone: phone,
          shippingAddress: getCustomerAddress(),
          shippingMethod,
          notes: orderNotes,
          subtotal: cartSubtotal,
          shippingCost,
          discount: discountAmount,
          total: cartTotal,
        }}
        onPaymentSuccess={handlePayFastSuccess}
      />
    </div>
  );
};
