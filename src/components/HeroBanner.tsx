import React from 'react';
import { ArrowRight, Sparkles, MapPin, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import heroCampaignImage from '../assets/images/hero_018_campaign_1789221691455.jpg';

export const HeroBanner: React.FC = () => {
  const { setActiveCategory, setActiveView, siteSettings, openProductModal } = useStore();

  const handleOpenCombo = () => {
    openProductModal('prod-008');
  };

  return (
    <div id="hero-campaign-section" className="relative w-full overflow-hidden bg-neutral-950 text-white">
      {/* Background Graphic Pattern & Atmosphere */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#f35d1f]/30 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-amber-600/20 blur-3xl pointer-events-none" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headline & Manifesto */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold uppercase tracking-wider text-[#f35d1f]">
              <MapPin className="w-3.5 h-3.5 text-[#f35d1f]" />
              <span>Klerksdorp, North West (018) • South Africa</span>
            </div>

            <h1
              id="hero-main-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-['Syne'] font-extrabold tracking-tight leading-[1.08] text-white"
            >
              {siteSettings.heroHeading}
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 font-normal leading-relaxed max-w-2xl">
              {siteSettings.heroSubheading}
            </p>

            {/* Campaign Highlights Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium text-neutral-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f35d1f] shrink-0" />
                <span>Knitted From Scratch</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f35d1f] shrink-0" />
                <span>100% Proudly North West</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#f35d1f] shrink-0" />
                <span>Limited Edition Runs</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                id="btn-hero-shop-all"
                onClick={() => {
                  setActiveCategory('all');
                  setActiveView('store');
                  const catalogElem = document.getElementById('catalog-section');
                  catalogElem?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-7 py-3.5 rounded-full bg-[#f35d1f] hover:bg-[#ea580c] text-white font-bold text-sm tracking-wider uppercase transition-all shadow-lg shadow-orange-950/40 flex items-center gap-2 group"
              >
                <span>{siteSettings.heroCtaText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                id="btn-hero-special-combo"
                onClick={handleOpenCombo}
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm tracking-wide border border-white/20 transition-all flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span>Weekend Combo (Save R700)</span>
              </button>
            </div>
          </div>

          {/* Right Column: Visual Campaign Showcase */}
          <div className="lg:col-span-5 relative">
            <div
              id="hero-campaign-card"
              onClick={handleOpenCombo}
              className="group relative mx-auto max-w-md lg:max-w-none rounded-2xl overflow-hidden border border-white/20 bg-neutral-900 shadow-2xl shadow-black/80 cursor-pointer transition-all duration-300 hover:border-[#f35d1f]/60 hover:shadow-orange-950/30"
            >
              {/* Campaign Poster Graphic with exact uploaded campaign photograph */}
              <div className="relative aspect-[896/1200] w-full overflow-hidden bg-neutral-950">
                <img
                  id="hero-campaign-poster-img"
                  src={heroCampaignImage}
                  alt="018 Bokone Bophirima Monogram Knitwear Campaign - This Is How You Style 018"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center block transition-transform duration-500 group-hover:scale-[1.02]"
                  loading="eager"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

