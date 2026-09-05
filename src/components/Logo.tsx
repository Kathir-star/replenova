import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = ''
}) => {
  const dimensions = {
    sm: { icon: 18, text: 'text-sm' },
    md: { icon: 24, text: 'text-lg' },
    lg: { icon: 32, text: 'text-xl' },
    xl: { icon: 44, text: 'text-2xl' }
  }[size];

  return (
    <div id="replenova-brand-logo" className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Sleek geometric layer icon in #F27D26 */}
      <div className="flex items-center justify-center text-[#F27D26] shrink-0">
        <svg
          width={dimensions.icon}
          height={dimensions.icon}
          viewBox="0 0 24 24"
          fill="none"
          stroke="#F27D26"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-transform duration-300 hover:rotate-12"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-black tracking-tighter text-white font-sans ${dimensions.text}`}>
            REPLENOVA
          </span>
          <span className="text-[8px] tracking-[0.2em] text-[#666666] font-semibold mt-1 uppercase">
            AI SUPPLY CHAIN INTELLIGENCE
          </span>
        </div>
      )}
    </div>
  );
};

