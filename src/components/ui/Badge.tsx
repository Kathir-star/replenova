import React from 'react';
import { getStatusBadgeClass } from '../../lib/utils';
import { RiskLevel } from '../../types/risk';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'healthy' | 'watch' | 'elevated' | 'critical' | 'default' | 'neutral' | string;
  className?: string;
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  className = '',
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-xs';
  const colorClass = getStatusBadgeClass(variant);

  return (
    <span
      className={`inline-flex items-center gap-1 font-mono font-medium rounded-full uppercase tracking-wider ${sizeClasses} ${colorClass} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      {children}
    </span>
  );
};
