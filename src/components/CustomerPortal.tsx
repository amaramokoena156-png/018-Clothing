import React, { useState } from 'react';
import {
  User,
  Package,
  MapPin,
  Heart,
  Bell,
  LogOut,
  Truck,
  Plus,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { Address, Order } from '../types';
import { OrderProgressTracker } from './OrderProgressTracker';

export const CustomerPortal: React.FC = () => {
  const {
    user,
    orders,
    logout,
    setActiveView,
    addAddress,
    wishlistProducts,
    openProductDetail,
    moveWishlistToCart,
    siteSettings,
    products,
  } = useStore();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'wishlist' | 'preferences'>('orders');
  const [orderFilter, setOrderFilter] = useState<'all' | 'processing' | 'shipped' | 'delivered'>('all');
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  // New Address state
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('Klerksdorp');
  const [newProvince, setNewProvince] = useState<Address['province']>('North West');
  const [newPostal, setNewPostal] = useState('2571');

  if (!user) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <p className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
          Please sign in to access your customer account.
        </p>
        <button
          onClick={() => setActiveView('store')}
          className="px-6 py-2.5 rounded-full bg-[#f35d1f] text-white text-xs font-bold uppercase tracking-wider"
        >
          Return to Store
        </button>
      </div>
    );
  }

  const userOrders = orders.filter(
    (o) => o.customerId === user.id || o.customerEmail === user.email
  );

  const isProcessingStatus = (status: string) =>
    status === 'processing' || status === 'packed' || status === 'paid' || status === 'pending' || status === 'payment_pending';

  const processingCount = userOrders.filter((o) => isProcessingStatus(o.status)).length;
  const shippedCount = userOrders.filter((o) => o.status === 'shipped').length;
  const deliveredCount = userOrders.filter((o) => o.status === 'delivered').length;

  const filteredOrders = userOrders.filter((o) => {
    if (orderFilter === 'all') return true;
    if (orderFilter === 'processing') return isProcessingStatus(o.status);
    if (orderFilter === 'shipped') return o.status === 'shipped';
    if (orderFilter === 'delivered') return o.status === 'delivered';
    return true;
  });

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStreet || !newCity || !newPostal) return;
    addAddress({
      firstName: user.fullName.split(' ')[0] || user.fullName,
      lastName: user.fullName.split(' ').slice(1).join(' ') || '',
      phone: user.phone,
      streetAddress: newStreet,
      city: newCity,
      province: newProvince,
      postalCode: newPostal,
      country: 'South Africa',
      isDefault: false,
    });
    setNewStreet('');
    setIsAddingAddress(false);
  };

  return (
    <div id="customer-portal-view" className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header */}
      <div className="p-6 rounded-2xl bg-white dark:bg-[#15181b] border border-neutral-200 dark:border-neutral-800 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-[#f35d1f] text-white flex items-center justify-center font-extrabold text-xl font-['Syne']">
            {user.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-['Syne'] text-neutral-900 dark:text-white">
                {user.fullName}
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-100 dark:bg-orange-950/40 text-[#f35d1f]">
                {user.role}
              </span>
            </div>
            <p className="text-xs text-neutral-500">
              {user.email} • {user.phone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user.role === 'admin' && (
            <button
              onClick={() => setActiveView('admin')}
              className="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-900 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Operations</span>
            </button>
          )}

          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 gap-6 text-xs font-bold uppercase tracking-wider overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-[#f35d1f] text-[#f35d1f]'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({userOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'addresses'
              ? 'border-[#f35d1f] text-[#f35d1f]'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Addresses ({user.addresses.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wishlist')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'wishlist'
              ? 'border-[#f35d1f] text-[#f35d1f]'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Saved Wishlist ({wishlistProducts.length})</span>
        </button>
      </div>

      {/* Tab 1: Orders View */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Order Stage Filter Pills */}
          {userOrders.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mr-1">
                Filter by stage:
              </span>
              <button
                type="button"
                onClick={() => setOrderFilter('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                  orderFilter === 'all'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 shadow-xs'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                All ({userOrders.length})
              </button>
              <button
                type="button"
                onClick={() => setOrderFilter('processing')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                  orderFilter === 'processing'
                    ? 'bg-[#f35d1f] text-white shadow-xs'
                    : 'bg-orange-50 dark:bg-orange-950/40 text-[#f35d1f] hover:bg-orange-100 dark:hover:bg-orange-900/50'
                }`}
              >
                Processing ({processingCount})
              </button>
              <button
                type="button"
                onClick={() => setOrderFilter('shipped')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                  orderFilter === 'shipped'
                    ? 'bg-cyan-600 text-white shadow-xs'
                    : 'bg-cyan-50 dark:bg-cyan-950/40 text-cyan-700 dark:text-cyan-400 hover:bg-cyan-100 dark:hover:bg-cyan-900/50'
                }`}
              >
                Shipped ({shippedCount})
              </button>
              <button
                type="button"
                onClick={() => setOrderFilter('delivered')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                  orderFilter === 'delivered'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50'
                }`}
              >
                Delivered ({deliveredCount})
              </button>
            </div>
          )}

          {userOrders.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#15181b] rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
              <Package className="w-10 h-10 mx-auto text-neutral-400" />
              <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                No orders placed yet
              </p>
              <button
                onClick={() => setActiveView('store')}
                className="px-6 py-2 rounded-full bg-[#f35d1f] text-white text-xs font-bold uppercase tracking-wider"
              >
                Browse 018 Store
              </button>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-white dark:bg-[#15181b] rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
              <Package className="w-8 h-8 mx-auto text-neutral-400" />
              <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                No orders in {orderFilter.toUpperCase()} stage
              </p>
              <button
                type="button"
                onClick={() => setOrderFilter('all')}
                className="text-xs text-[#f35d1f] font-semibold underline underline-offset-4"
              >
                View all orders ({userOrders.length})
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => {
              return (
                <div
                  key={order.id}
                  id={`order-card-${order.id}`}
                  className="p-6 rounded-2xl bg-white dark:bg-[#15181b] border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6"
                >
                  {/* Order Card Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                        Order Reference
                      </span>
                      <h3 className="text-lg font-bold font-['Syne'] text-neutral-900 dark:text-white">
                        #{order.orderNumber}
                      </h3>
                      <p className="text-xs text-neutral-500">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-ZA', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                          Total Amount
                        </span>
                        <p className="font-extrabold text-base text-[#f35d1f] font-['Syne']">
                          R{order.total.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* High-Fidelity Visual Progress Tracker */}
                  <OrderProgressTracker order={order} supportPhone={siteSettings.supportWhatsapp} />

                  {/* Courier & Delivery Address Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs p-4 rounded-xl bg-neutral-50 dark:bg-[#101214] border border-neutral-200/80 dark:border-neutral-800/80">
                    <div>
                      <p className="font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                        <Truck className="w-3.5 h-3.5 text-[#f35d1f]" />
                        <span>Courier & Fulfillment</span>
                      </p>
                      <p className="mt-1 font-mono text-[#f35d1f] font-bold">
                        {order.trackingNumber || 'Awaiting dispatch manifest'}
                      </p>
                      <p className="text-neutral-500 text-[11px] mt-0.5">
                        {order.courierName || 'The Courier Guy'} • {order.shippingMethod}
                      </p>
                    </div>
                    <div>
                      <p className="font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#f35d1f]" />
                        <span>Consignee & Delivery Address</span>
                      </p>
                      <p className="text-neutral-600 dark:text-neutral-400 mt-1 leading-relaxed">
                        {order.shippingAddress.streetAddress}, {order.shippingAddress.city}, {order.shippingAddress.province} {order.shippingAddress.postalCode}
                      </p>
                      <p className="text-neutral-400 text-[11px] mt-0.5">
                        Recipient: {order.customerName} ({order.customerPhone})
                      </p>
                    </div>
                  </div>

                  {/* Items in this order */}
                  <div className="space-y-2.5 pt-1">
                    <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                      <span>Garments in Parcel ({order.items.reduce((sum, it) => sum + it.quantity, 0)} pieces)</span>
                      <span className="font-normal normal-case text-neutral-500 text-[11px] inline-flex items-center gap-1.5">
                        {order.paymentMethod === 'payfast' ? (
                          <>
                            <span className="bg-[#b81d24] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded font-['Syne']">
                              PayFast
                            </span>
                            <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[10px]">
                              Verified Paid
                            </span>
                          </>
                        ) : (
                          <span>Payment: {order.paymentMethod.toUpperCase()} ({order.paymentStatus})</span>
                        )}
                      </span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {order.items.map((item) => {
                        const matchedProduct = products.find((p) => p.id === item.productId);
                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              if (matchedProduct) openProductDetail(matchedProduct);
                            }}
                            className="flex items-center gap-3 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:border-[#f35d1f]/40 bg-white dark:bg-[#131518] transition-colors cursor-pointer group"
                          >
                            <img
                              src={item.image}
                              alt={item.productName}
                              className="w-12 h-14 object-cover rounded-lg bg-neutral-200 dark:bg-neutral-800 shrink-0"
                            />
                            <div className="text-xs min-w-0 flex-1">
                              <p className="font-bold text-neutral-900 dark:text-white line-clamp-1 group-hover:text-[#f35d1f] transition-colors">
                                {item.productName}
                              </p>
                              <p className="text-neutral-500 text-[11px] mt-0.5">
                                Size {item.size} • Qty {item.quantity} • {item.color}
                              </p>
                              <p className="font-bold text-[#f35d1f] font-mono text-[11px] mt-0.5">
                                R{item.price.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Addresses View */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 dark:text-white">
              Saved Delivery Addresses
            </h3>
            <button
              onClick={() => setIsAddingAddress(!isAddingAddress)}
              className="px-3.5 py-1.5 rounded-lg bg-[#f35d1f] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          </div>

          {isAddingAddress && (
            <form
              onSubmit={handleCreateAddress}
              className="p-5 rounded-2xl bg-white dark:bg-[#15181b] border border-neutral-200 dark:border-neutral-800 space-y-4 text-xs"
            >
              <h4 className="font-bold text-neutral-900 dark:text-white uppercase tracking-wider">
                New South African Address
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-500">Street Address</label>
                  <input
                    type="text"
                    required
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    placeholder="e.g. 24 Boom Street"
                    className="w-full mt-1 p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="text-neutral-500">City / Town</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    placeholder="Klerksdorp"
                    className="w-full mt-1 p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-500">Province</label>
                  <select
                    value={newProvince}
                    onChange={(e) => setNewProvince(e.target.value as Address['province'])}
                    className="w-full mt-1 p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  >
                    <option value="North West">North West</option>
                    <option value="Gauteng">Gauteng</option>
                    <option value="Western Cape">Western Cape</option>
                    <option value="KwaZulu-Natal">KwaZulu-Natal</option>
                  </select>
                </div>
                <div>
                  <label className="text-neutral-500">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={newPostal}
                    onChange={(e) => setNewPostal(e.target.value)}
                    placeholder="2571"
                    className="w-full mt-1 p-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#f35d1f] text-white rounded-lg font-bold"
                >
                  Save Address
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingAddress(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {user.addresses.map((addr) => (
              <div
                key={addr.id}
                className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#15181b] space-y-2 text-xs"
              >
                <div className="flex justify-between items-center">
                  <span className="font-bold text-neutral-900 dark:text-white">
                    {addr.firstName} {addr.lastName}
                  </span>
                  {addr.isDefault && (
                    <span className="text-[10px] uppercase font-bold text-[#f35d1f] bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {addr.streetAddress}
                  {addr.suburb && `, ${addr.suburb}`}
                  <br />
                  {addr.city}, {addr.province} {addr.postalCode}
                  <br />
                  {addr.country}
                </p>
                <p className="text-neutral-500 pt-1">Tel: {addr.phone}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Wishlist View */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-[#15181b] rounded-2xl border border-neutral-200 dark:border-neutral-800 space-y-3">
              <Heart className="w-10 h-10 mx-auto text-neutral-400" />
              <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
                Your wishlist is empty
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {wishlistProducts.map((p) => (
                <div
                  key={p.id}
                  className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#15181b] flex flex-col justify-between space-y-3"
                >
                  <img
                    src={p.images[0]?.url}
                    alt=""
                    onClick={() => openProductDetail(p)}
                    className="aspect-3/4 w-full object-cover rounded-lg cursor-pointer"
                  />
                  <div>
                    <h4
                      onClick={() => openProductDetail(p)}
                      className="text-xs font-bold text-neutral-900 dark:text-white cursor-pointer line-clamp-1"
                    >
                      {p.name}
                    </h4>
                    <p className="font-extrabold text-sm text-[#f35d1f] font-['Syne'] pt-1">
                      R{(p.salePrice || p.basePrice).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => moveWishlistToCart(p.id)}
                    className="w-full py-2 rounded-lg bg-[#f35d1f] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#ea580c]"
                  >
                    Move to Bag
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
