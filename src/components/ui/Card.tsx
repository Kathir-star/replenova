import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'glass' | 'interactive';
  className?: string;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  className = '',
  glow = false,
  ...props
}) => {
  const baseClasses = 'rounded-xl border transition-all duration-200';

  const variantClasses = {
    default: 'bg-[#111111] border-[#242424] text-[#D1D1D1]',
    elevated: 'bg-[#141414] border-[#2A2A2A] shadow-xl text-[#D1D1D1]',
    glass: 'bg-[#0E0E0E]/80 backdrop-blur-md border-white/5 text-[#D1D1D1]',
    interactive: 'bg-[#111111] border-[#242424] hover:border-[#383838] hover:bg-[#161616] cursor-pointer text-[#D1D1D1]',
  }[variant];

  const glowClass = glow ? 'ring-1 ring-[#F27D26]/40 shadow-lg shadow-[#F27D26]/5' : '';

  return (
    <div
      className={`${baseClasses} ${variantClasses} ${glowClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader: React.FC<{
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}> = ({ title, subtitle, badge, action, icon, className = '' }) => (
  <div className={`p-4 sm:p-5 border-b border-[#1E1E1E] flex items-center justify-between gap-3 ${className}`}>
    <div className="flex items-center gap-2.5 min-w-0">
      {icon && <div className="text-[#F27D26] shrink-0">{icon}</div>}
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-sm sm:text-base font-semibold text-white tracking-tight truncate">{title}</h3>
          {badge}
        </div>
        {subtitle && <p className="text-xs text-[#808080] truncate mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`p-4 sm:p-5 ${className}`}>{children}</div>;
