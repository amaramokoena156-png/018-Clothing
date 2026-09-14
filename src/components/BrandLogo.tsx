import React, { useId } from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'compact' | 'badge' | 'monogram';
  theme?: 'auto' | 'light' | 'dark' | 'orange';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  theme = 'auto',
  className = '',
  size = 'md',
}) => {
  const maskId = useId();

  // Scale classes
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-11 sm:h-12',
    lg: 'h-14 sm:h-16',
    xl: 'h-20 sm:h-24',
  }[size];

  // Theme color mapping for wordmark text
  const textColorClass = {
    auto: 'text-neutral-900 dark:text-white',
    light: 'text-neutral-900',
    dark: 'text-white',
    orange: 'text-[#f35d1f]',
  }[theme];

  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center justify-center rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm p-1.5 px-3 text-center shadow-xs ${className}`}
      >
        <span className="font-extrabold tracking-tighter text-[#f35d1f] text-xs font-['Syne']">
          018 <span className="font-medium text-[9px] text-neutral-600 dark:text-neutral-400 lowercase">zerooneeight™</span>
        </span>
      </div>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`inline-flex items-center select-none ${className}`}>
        <svg
          viewBox="0 0 320 148"
          className={`${sizeClasses} w-auto transition-transform duration-200`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <mask id={`mask-compact-${maskId}`}>
              <rect x="0" y="0" width="340" height="160" fill="white" />
              <circle cx="264" cy="52" r="32" fill="black" />
              <circle cx="264" cy="112" r="34" fill="black" />
            </mask>
          </defs>

          {/* 0 numeral */}
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M62 14 C91 14 114 37 114 66 V94 C114 123 91 146 62 146 C33 146 10 123 10 94 V66 C10 37 33 14 62 14 Z M62 44 C72 44 80 52 80 62 V98 C80 108 72 116 62 116 C52 116 44 108 44 98 V62 C44 52 52 44 62 44 Z"
            fill="#F35D1F"
          />

          {/* 1 & 8 combined monogram shape with circular mask */}
          <path
            d="M135 44 L200 14 H264 V146 H152 V52 L135 44 Z"
            fill="#F35D1F"
            mask={`url(#mask-compact-${maskId})`}
          />

          {/* Central floating orange dots forming the 8 */}
          <circle cx="264" cy="52" r="13" fill="#F35D1F" />
          <circle cx="264" cy="112" r="15" fill="#F35D1F" />

          {/* ® Registered Trademark Symbol */}
          <g transform="translate(288, 14)">
            <circle cx="9" cy="9" r="8" stroke="#F35D1F" strokeWidth="1.8" fill="none" />
            <text
              x="9"
              y="12.5"
              textAnchor="middle"
              fontFamily="'Plus Jakarta Sans', Arial, sans-serif"
              fontWeight="900"
              fontSize="9.5"
              fill="#F35D1F"
            >
              R
            </text>
          </g>
        </svg>
      </div>
    );
  }

  // Full Brand Lockup: 018 with registered mark and zerooneeight™ wordmark
  return (
    <div
      className={`inline-flex flex-col items-start leading-none select-none group ${textColorClass} ${className}`}
    >
      <svg
        viewBox="0 0 320 182"
        className={`${sizeClasses} w-auto transition-transform duration-200 group-hover:scale-[1.01]`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <mask id={`mask-full-${maskId}`}>
            <rect x="0" y="0" width="340" height="190" fill="white" />
            {/* Upper and lower circular cutouts of the 8 numeral */}
            <circle cx="264" cy="52" r="32" fill="black" />
            <circle cx="264" cy="112" r="34" fill="black" />
          </mask>
        </defs>

        {/* 0 numeral with transparent inner oval cutout */}
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M62 14 C91 14 114 37 114 66 V94 C114 123 91 146 62 146 C33 146 10 123 10 94 V66 C10 37 33 14 62 14 Z M62 44 C72 44 80 52 80 62 V98 C80 108 72 116 62 116 C52 116 44 108 44 98 V62 C44 52 52 44 62 44 Z"
          fill="#F35D1F"
        />

        {/* 1 & 8 combined monogram shape with circular mask */}
        <path
          d="M135 44 L200 14 H264 V146 H152 V52 L135 44 Z"
          fill="#F35D1F"
          mask={`url(#mask-full-${maskId})`}
        />

        {/* Central floating orange dots completing the 8 */}
        <circle cx="264" cy="52" r="13" fill="#F35D1F" />
        <circle cx="264" cy="112" r="15" fill="#F35D1F" />

        {/* ® Registered Trademark Symbol */}
        <g transform="translate(288, 14)">
          <circle cx="9" cy="9" r="8" stroke="#F35D1F" strokeWidth="1.8" fill="none" />
          <text
            x="9"
            y="12.5"
            textAnchor="middle"
            fontFamily="'Plus Jakarta Sans', Arial, sans-serif"
            fontWeight="900"
            fontSize="9.5"
            fill="#F35D1F"
          >
            R
          </text>
        </g>

        {/* zerooneeight™ Wordmark */}
        <g id="wordmark" transform="translate(10, 176)">
          <text
            fontFamily="'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
            fontSize="26"
            fontWeight="900"
            letterSpacing="-0.03em"
          >
            <tspan fill="currentColor">zero</tspan>
            <tspan fill="#F35D1F">one</tspan>
            <tspan fill="currentColor">eight</tspan>
            <tspan fill="currentColor" fontSize="15" dy="-10">
              ™
            </tspan>
          </text>
        </g>
      </svg>
    </div>
  );
};
