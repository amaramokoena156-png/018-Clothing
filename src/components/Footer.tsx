import React, { useState } from 'react';
import { BrandLogo } from './BrandLogo';
import { MessageCircle, MapPin, Truck, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const Footer: React.FC = () => {
  const { siteSettings, showToast, setActiveCategory } = useStore();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    showToast('Siyabonga! You are now subscribed to 018 limited run alerts.');
    setEmail('');
  };

  const handleWhatsAppChat = () => {
    const phone = siteSettings.supportWhatsapp.replace(/^0/, '27');
    const msg = encodeURIComponent(
      'Dumelang / Hello 018 Bokone Bophirima! I would like to inquire about customer service and current drops.'
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  return (
    <footer className="bg-neutral-950 text-neutral-300 border-t border-neutral-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Top Feature Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-neutral-800 text-xs">
          <div className="flex items-start gap-3">
            <Truck className="w-5 h-5 text-[#f35d1f] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white uppercase tracking-wider">
                Fast Door-to-Door Courier
              </h4>
              <p className="text-neutral-400 mt-0.5">
                Free delivery on orders over R{siteSettings.freeShippingThreshold.toLocaleString()} to Johannesburg, Pretoria, Cape Town, Durban & nationwide.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#f35d1f] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white uppercase tracking-wider">
                Authentic Craftsmanship
              </h4>
              <p className="text-neutral-400 mt-0.5">
                Custom jacquard knitted textures, double-rib collars, and premium heavyweight luxury textiles.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MessageCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-white uppercase tracking-wider">
                Direct WhatsApp Concierge
              </h4>
              <p className="text-neutral-400 mt-0.5">
                Reach our Klerksdorp team directly on {siteSettings.supportWhatsapp || '064 062 9602'} for custom sizing and delivery status.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Brand Story */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-4 space-y-4">
            <BrandLogo size="lg" theme="dark" />
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              018 Bokone Bophirima is a lifestyle and streetwear fashion label born in Klerksdorp, North West. Inspired by our area code and local heritage, we knit culture into modern statement pieces.
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <MapPin className="w-4 h-4 text-[#f35d1f]" />
              <span>Wilkoppies, Klerksdorp, 2571 • North West, South Africa</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Shop Collections
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={() => setActiveCategory('knitwear')}
                  className="hover:text-white transition-colors"
                >
                  Knitwear Monogram
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveCategory('hoodies')}
                  className="hover:text-white transition-colors"
                >
                  Heavyweight Hoodies
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveCategory('polos')}
                  className="hover:text-white transition-colors"
                >
                  Friday Fit Polos
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveCategory('dresses')}
                  className="hover:text-white transition-colors"
                >
                  Contour Knit Dresses
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveCategory('combos')}
                  className="hover:text-white transition-colors"
                >
                  Special Run Combos
                </button>
              </li>
            </ul>
          </div>

          {/* Support Col */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>
                <button
                  onClick={handleWhatsAppChat}
                  className="hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                >
                  <span>WhatsApp: {siteSettings.supportWhatsapp || '064 062 9602'}</span>
                </button>
              </li>
              <li>
                <span className="text-neutral-500">The Courier Guy Tracking</span>
              </li>
              <li>
                <span className="text-neutral-500">Paxi Collection Points</span>
              </li>
              <li>
                <span className="text-neutral-500">Returns & Size Exchanges</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / Push Sub */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Exclusive 018 VIP Drops
            </h4>
            <p className="text-xs text-neutral-400">
              Be the first to know when limited run knitwear and seasonal combos are released in Klerksdorp.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2 pt-1">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-[#f35d1f]"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-[#f35d1f] hover:bg-[#ea580c] text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors shrink-0"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-900 flex flex-wrap items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {new Date().getFullYear()} 018 Bokone Bophirima. Proudly South African streetwear & knitwear.</p>
          <div className="flex items-center gap-4">
            <span className="font-semibold text-neutral-400">Secured by PayFast</span>
            <span>•</span>
            <span>Visa &amp; Mastercard</span>
            <span>•</span>
            <span>Capitec Pay</span>
            <span>•</span>
            <span>Instant EFT</span>
            <span>•</span>
            <span>The Courier Guy</span>
          </div>
        </div>

        {/* Very Bottom Developer Attribution */}
        <div className="pt-4 border-t border-neutral-900/60 flex items-center justify-center text-xs text-neutral-500">
          <p>
            Designed &amp; Developed by{' '}
            <a
              id="link-greenway-tech"
              href="https://greenwaytech.co.za"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-300 hover:text-[#f35d1f] transition-colors underline underline-offset-4 decoration-neutral-700 hover:decoration-[#f35d1f]"
            >
              Greenway Technology Solutions
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
