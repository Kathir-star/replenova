import React from 'react';
import {
  Boxes,
  AlertCircle,
  TrendingDown,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Card, CardHeader } from '../ui/Card';
import { formatInrCurrency } from '../../lib/calculations';
import { NavLink } from 'react-router-dom';

export const InventoryRiskPanel: React.FC = () => {
  const { inventory, setSelectedEntity, setSelectedSku, selectedSku } = useApp();

  const sortedRiskItems = [...inventory].sort((a, b) => b.stockoutProbability - a.stockoutProbability);

  const handleSelectSku = (item: (typeof inventory)[0]) => {
    setSelectedSku(item.sku);
    setSelectedEntity({
      type: 'product',
      data: item,
    });
  };

  return (
    <Card className="border-[#222222]">
      <CardHeader
        title="Multi-Echelon Inventory Risk"
        subtitle="Ranked stockout probabilities and lead time deficits"
        action={
          <NavLink
            to="/inventory"
            className="text-xs text-[#F27D26] hover:text-[#ff9c54] font-medium flex items-center gap-1"
          >
            View All ({inventory.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </NavLink>
        }
      />

      <div className="p-3 divide-y divide-[#1C1C1C] max-h-[440px] overflow-y-auto scrollbar-thin">
        {sortedRiskItems.slice(0, 6).map((item) => {
          const isSelected = selectedSku === item.sku;
          const isCritical = item.riskLevel === 'critical';
          const isElevated = item.riskLevel === 'elevated';

          return (
            <button
              key={item.id}
              onClick={() => handleSelectSku(item)}
              className={`w-full p-3 text-left transition-all rounded-lg my-1 flex items-center justify-between gap-3 ${
                isSelected
                  ? 'bg-[#1A1A1A] border border-[#F27D26]/40 shadow-sm'
                  : 'hover:bg-[#141414] border border-transparent'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-white">{item.sku}</span>
                  <span className="text-[10px] text-[#737373] truncate max-w-[140px] sm:max-w-[200px]">
                    {item.productName}
                  </span>
                </div>

                <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px]">
                  <span className="text-[#888888]">
                    Stock: <strong className="text-white font-mono">{item.currentStock.toLocaleString()}</strong>
                  </span>
                  <span className="text-[#888888]">
                    Supply: <strong className="text-white font-mono">{item.daysOfSupply}d</strong>
                  </span>
                  <span className="text-[#888888]">
                    Exp: <strong className="text-white font-mono">{formatInrCurrency(item.revenueExposureInr)}</strong>
                  </span>
                </div>
              </div>

              {/* Risk Gauge Badge */}
              <div className="text-right shrink-0">
                <span
                  className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full inline-block ${
                    isCritical
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : isElevated
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {item.stockoutProbability}% Risk
                </span>
                <p className="text-[10px] text-[#666666] font-mono mt-0.5">
                  {item.expectedStockoutDays <= 7 ? `Cliff: ${item.expectedStockoutDays}d` : 'Stable'}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </Card>
  );
};
