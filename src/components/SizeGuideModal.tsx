import React, { useState } from 'react';
import { X, Ruler, CheckCircle2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const SizeGuideModal: React.FC = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useStore();
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');

  if (!isSizeGuideOpen) return null;

  return (
    <div
      id="size-guide-backdrop"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={() => setIsSizeGuideOpen(false)}
    >
      <div
        id="size-guide-container"
        className="relative w-full max-w-2xl bg-white dark:bg-[#15181b] rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden my-auto p-6 sm:p-8 space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-4">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-[#f35d1f]" />
            <h2 className="font-extrabold text-lg text-neutral-900 dark:text-white font-['Syne']">
              018 South African Sizing Guide
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-neutral-300 dark:border-neutral-700 rounded-lg overflow-hidden text-xs font-bold">
              <button
                onClick={() => setUnit('cm')}
                className={`px-2.5 py-1 ${unit === 'cm' ? 'bg-[#f35d1f] text-white' : 'text-neutral-500'}`}
              >
                CM
              </button>
              <button
                onClick={() => setUnit('in')}
                className={`px-2.5 py-1 ${unit === 'in' ? 'bg-[#f35d1f] text-white' : 'text-neutral-500'}`}
              >
                IN
              </button>
            </div>
            <button
              onClick={() => setIsSizeGuideOpen(false)}
              className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Women's Knitted Dress & Tops Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#f35d1f]">
            Women's Knit Dresses & Tops (South Africa Standard)
          </h3>
          <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Size</th>
                  <th className="p-2.5">SA/UK Size</th>
                  <th className="p-2.5">Bust ({unit})</th>
                  <th className="p-2.5">Waist ({unit})</th>
                  <th className="p-2.5">Hips ({unit})</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-800 dark:text-neutral-200">
                <tr>
                  <td className="p-2.5 font-bold">XS</td>
                  <td className="p-2.5">28 - 30</td>
                  <td className="p-2.5">{unit === 'cm' ? '78 - 83' : '31 - 33'}</td>
                  <td className="p-2.5">{unit === 'cm' ? '60 - 65' : '24 - 26'}</td>
                  <td className="p-2.5">{unit === 'cm' ? '84 - 89' : '33 - 35'}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">S</td>
                  <td className="p-2.5">32</td>
                  <td className="p-2.5">{unit === 'cm' ? '84 - 89' : '33 - 35'}</td>
                  <td className="p-2.5">{unit === 'cm' ? '66 - 71' : '26 - 28'}</td>
                  <td className="p-2.5">{unit === 'cm' ? '90 - 95' : '35 - 37'}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">M</td>
                  <td className="p-2.5">34</td>
                  <td className="p-2.5">{unit === 'cm' ? '90 - 95' : '35 - 37'}</td>
                  <td className="p-2.5">{unit === 'cm' ? '72 - 77' : '28 - 30'}</td>
                  <td className="p-2.5">{unit === 'cm' ? '96 - 101' : '38 - 40'}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">L</td>
                  <td className="p-2.5">36</td>
                  <td className="p-2.5">{unit === 'cm' ? '96 - 102' : '38 - 40'}</td>
                  <td className="p-2.5">{unit === 'cm' ? '78 - 84' : '31 - 33'}</td>
                  <td className="p-2.5">{unit === 'cm' ? '102 - 108' : '40 - 43'}</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">XL</td>
                  <td className="p-2.5">38</td>
                  <td className="p-2.5">{unit === 'cm' ? '103 - 110' : '41 - 43'}</td>
                  <td className="p-2.5">{unit === 'cm' ? '85 - 92' : '33 - 36'}</td>
                  <td className="p-2.5">{unit === 'cm' ? '109 - 116' : '43 - 46'}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Men's Knit Polo & Hoodies Table */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#f35d1f]">
            Men's & Unisex Knit Polos, Hoodies & Tees
          </h3>
          <div className="overflow-x-auto border border-neutral-200 dark:border-neutral-800 rounded-xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold uppercase text-[10px]">
                <tr>
                  <th className="p-2.5">Size</th>
                  <th className="p-2.5">Chest ({unit})</th>
                  <th className="p-2.5">Shoulder ({unit})</th>
                  <th className="p-2.5">Length ({unit})</th>
                  <th className="p-2.5">Fit Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800 text-neutral-800 dark:text-neutral-200">
                <tr>
                  <td className="p-2.5 font-bold">S</td>
                  <td className="p-2.5">{unit === 'cm' ? '92 - 97' : '36 - 38'}</td>
                  <td className="p-2.5">{unit === 'cm' ? '44' : '17.3'}</td>
                  <td className="p-2.5">{unit === 'cm' ? '68' : '26.8'}</td>
                  <td className="p-2.5">Fitted Look</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">M</td>
                  <td className="p-2.5">{unit === 'cm' ? '98 - 103' : '39 - 41'}</td>
                  <td className="p-2.5">{unit === 'cm' ? '46' : '18.1'}</td>
                  <td className="p-2.5">{unit === 'cm' ? '70' : '27.6'}</td>
                  <td className="p-2.5">Regular Friday Fit</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">L</td>
                  <td className="p-2.5">{unit === 'cm' ? '104 - 109' : '41 - 43'}</td>
                  <td className="p-2.5">{unit === 'cm' ? '48' : '18.9'}</td>
                  <td className="p-2.5">{unit === 'cm' ? '72' : '28.3'}</td>
                  <td className="p-2.5">Comfort Fit</td>
                </tr>
                <tr>
                  <td className="p-2.5 font-bold">XL</td>
                  <td className="p-2.5">{unit === 'cm' ? '110 - 116' : '43 - 46'}</td>
                  <td className="p-2.5">{unit === 'cm' ? '50' : '19.7'}</td>
                  <td className="p-2.5">{unit === 'cm' ? '74' : '29.1'}</td>
                  <td className="p-2.5">Relaxed Streetwear</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Fit Advice Box */}
        <div className="p-3 bg-neutral-50 dark:bg-[#101214] rounded-xl border border-neutral-200 dark:border-neutral-800 space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
          <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white">
            <CheckCircle2 className="w-4 h-4 text-[#f35d1f]" />
            <span>018 Craftsmanship Guarantee</span>
          </div>
          <p>
            Our knit garments have natural mechanical elasticity that conforms comfortably to your body without losing shape. If you prefer a loose oversized drape, we recommend ordering one size up.
          </p>
        </div>
      </div>
    </div>
  );
};
