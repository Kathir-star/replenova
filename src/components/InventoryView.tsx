import React, { useState, useMemo } from 'react';
import { Product } from '../types';
import {
  Search,
  Filter,
  ArrowUpDown,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Info,
  X,
  Clock,
  ShieldAlert,
  RotateCcw,
  CheckCircle2,
  TrendingUp,
  Package,
  Cpu
} from 'lucide-react';

interface InventoryViewProps {
  products: Product[];
  onSelectProductForReplenishment?: (sku: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  products,
  onSelectProductForReplenishment
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState<'All' | 'Critical' | 'High' | 'Medium' | 'Low'>('All');
  const [sortField, setSortField] = useState<keyof Product>('stockoutProbability');
  const [sortAsc, setSortAsc] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(products[0] || null);

  const handleSort = (field: keyof Product) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        const matchesSearch =
          p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.warehouseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.supplierName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRisk = filterRisk === 'All' || p.disruptionRisk === filterRisk;
        return matchesSearch && matchesRisk;
      })
      .sort((a, b) => {
        const valA = a[sortField];
        const valB = b[sortField];

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortAsc ? valA - valB : valB - valA;
        }
        if (typeof valA === 'string' && typeof valB === 'string') {
          return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return 0;
      });
  }, [products, searchTerm, filterRisk, sortField, sortAsc]);

  const getRiskBadge = (risk: Product['disruptionRisk']) => {
    switch (risk) {
      case 'Critical':
        return 'bg-[#221111] text-[#CC3333] border border-[#CC3333]/40';
      case 'High':
        return 'bg-[#221A11] text-[#FF8800] border border-[#FF8800]/40';
      case 'Medium':
        return 'bg-[#222211] text-[#E0A800] border border-[#E0A800]/40';
      case 'Low':
      default:
        return 'bg-[#112211] text-green-500 border border-green-800/40';
    }
  };

  return (
    <div id="inventory-intelligence-page" className="space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 sm:p-5 rounded bg-[#0A0A0A] border border-[#1F1F1F]">
        <div>
          <h2 className="text-xs sm:text-sm font-semibold text-white tracking-wide uppercase">
            INVENTORY INTELLIGENCE &bull; DISRUPTION-AWARE RUNWAYS
          </h2>
          <p className="text-[11px] text-[#666666] mt-0.5 font-mono">
            Real-time stock levels, dynamically predicted lead-time shifts, and stockout probability engines.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-[#050505] p-1 rounded border border-[#1F1F1F] font-mono text-[10px]">
          {(['All', 'Critical', 'High', 'Medium', 'Low'] as const).map((risk) => (
            <button
              key={risk}
              onClick={() => setFilterRisk(risk)}
              className={`px-3 py-1 rounded transition-colors cursor-pointer capitalize font-medium ${
                filterRisk === risk
                  ? 'bg-[#1A1A1A] text-white border border-[#2A2A2A]'
                  : 'text-[#888888] hover:text-white border border-transparent'
              }`}
            >
              {risk}
              {risk === 'All' ? ` (${products.length})` : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Summary bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="w-4 h-4 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter by SKU, product description, or warehouse..."
            className="w-full bg-[#0A0A0A] border border-[#1F1F1F] rounded pl-9 pr-4 py-1.5 text-xs text-white placeholder-[#666666] focus:outline-none focus:border-[#F27D26] font-mono"
          />
        </div>

        <div className="text-xs font-mono text-[#888888] hidden sm:block">
          Showing <span className="text-[#F27D26] font-bold">{filteredProducts.length}</span> of {products.length} catalog SKUs
        </div>
      </div>

      {/* Main Inventory Table */}
      <div className="rounded border border-[#1F1F1F] bg-[#0A0A0A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#0E0E0E] border-b border-[#1F1F1F] font-mono text-[10px] text-[#888888] uppercase tracking-wider">
                <th
                  onClick={() => handleSort('sku')}
                  className="py-3 px-3.5 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>SKU</span>
                    <ArrowUpDown className="w-3 h-3 text-[#666666]" />
                  </div>
                </th>
                <th className="py-3 px-3">Product Name</th>
                <th className="py-3 px-3">Warehouse</th>
                <th
                  onClick={() => handleSort('currentStock')}
                  className="py-3 px-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Stock</span>
                    <ArrowUpDown className="w-3 h-3 text-[#666666]" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('dailyDemand')}
                  className="py-3 px-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Burn/Day</span>
                    <ArrowUpDown className="w-3 h-3 text-[#666666]" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('daysOfSupply')}
                  className="py-3 px-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Days Supply</span>
                    <ArrowUpDown className="w-3 h-3 text-[#666666]" />
                  </div>
                </th>
                <th className="py-3 px-3">Lead Time (Shift)</th>
                <th
                  onClick={() => handleSort('disruptionRisk')}
                  className="py-3 px-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Risk Level</span>
                    <ArrowUpDown className="w-3 h-3 text-[#666666]" />
                  </div>
                </th>
                <th
                  onClick={() => handleSort('stockoutProbability')}
                  className="py-3 px-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Stockout Prob.</span>
                    <ArrowUpDown className="w-3 h-3 text-[#666666]" />
                  </div>
                </th>
                <th className="py-3 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141414] font-mono">
              {filteredProducts.map((p) => {
                const isSelected = selectedProduct?.id === p.id;
                const isCritical = p.stockoutProbability > 75;

                return (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedProduct(p)}
                    className={`hover:bg-[#141414] transition-colors cursor-pointer ${
                      isSelected ? 'bg-[#141414] border-l-2 border-l-[#F27D26]' : ''
                    } ${isCritical ? 'bg-[#221111]/30' : ''}`}
                  >
                    <td className="py-3 px-3.5 font-bold text-white whitespace-nowrap">
                      {p.sku}
                    </td>
                    <td className="py-3 px-3 font-sans text-[#D1D1D1] font-medium max-w-[200px] truncate">
                      {p.name}
                    </td>
                    <td className="py-3 px-3 text-[#888888] text-[11px] whitespace-nowrap">
                      {p.warehouseName.split(' ')[0]} Hub
                    </td>
                    <td className="py-3 px-3 text-white font-semibold">
                      {p.currentStock.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-[#888888]">
                      {p.dailyDemand}/d
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-[#1A1A1A] rounded h-1 overflow-hidden">
                          <div
                            className={`h-full ${
                              p.daysOfSupply < 7
                                ? 'bg-[#CC3333]'
                                : p.daysOfSupply < 10
                                ? 'bg-[#FF8800]'
                                : 'bg-green-500'
                            }`}
                            style={{ width: `${Math.min(100, (p.daysOfSupply / 15) * 100)}%` }}
                          />
                        </div>
                        <span className={p.daysOfSupply < 7 ? 'text-[#CC3333] font-bold' : 'text-[#888888]'}>
                          {p.daysOfSupply}d
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="text-[#666666]">{p.normalLeadTimeDays}d</span>
                      <span className="text-[#444444] mx-1">&rarr;</span>
                      <span
                        className={`font-bold ${
                          p.predictedLeadTimeDays > p.normalLeadTimeDays
                            ? 'text-[#CC3333]'
                            : 'text-[#D1D1D1]'
                        }`}
                      >
                        {p.predictedLeadTimeDays}d
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span
                        className={`text-[9px] uppercase px-1.5 py-0.5 rounded font-bold ${getRiskBadge(
                          p.disruptionRisk
                        )}`}
                      >
                        {p.disruptionRisk}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold ${
                            p.stockoutProbability > 70
                              ? 'text-[#CC3333]'
                              : p.stockoutProbability > 40
                              ? 'text-[#FF8800]'
                              : 'text-green-500'
                          }`}
                        >
                          {p.stockoutProbability}%
                        </span>
                        {p.stockoutProbability > 70 && (
                          <span className="text-[10px] text-[#CC3333] font-mono">
                            ({p.expectedStockoutDays}d left)
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedProduct(p);
                          if (onSelectProductForReplenishment) {
                            onSelectProductForReplenishment(p.sku);
                          }
                        }}
                        className="px-2.5 py-1 rounded bg-[#141414] hover:bg-[#1A1A1A] text-[#D1D1D1] hover:text-white border border-[#1F1F1F] text-[10px] font-mono cursor-pointer transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected SKU Explainable Risk Deep-Dive Drawer */}
      {selectedProduct && (
        <div
          id="sku-risk-deep-dive-panel"
          className="p-4 sm:p-5 rounded bg-[#0A0A0A] border border-[#1F1F1F] space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#1F1F1F]">
            <div className="flex items-center gap-3">
              <span className="p-2 rounded bg-[#141414] border border-[#1F1F1F] text-[#F27D26]">
                <Cpu className="w-5 h-5" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white font-mono">{selectedProduct.sku}</span>
                  <span className="text-xs text-[#D1D1D1] font-sans font-semibold">
                    {selectedProduct.name}
                  </span>
                </div>
                <span className="text-[11px] font-mono text-[#888888]">
                  {selectedProduct.category} &bull; Warehouse: {selectedProduct.warehouseName} &bull; Supplier: {selectedProduct.supplierName}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#888888]">
                Revenue Exposure: <strong className="text-[#CC3333] font-bold">₹{(selectedProduct.revenueExposureInr / 100000).toFixed(1)}L</strong>
              </span>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-1 text-[#666666] hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Explainable Risk Engine Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 font-mono text-xs">
            <div className="p-3 rounded bg-[#0D0D0D] border border-[#1F1F1F]">
              <span className="text-[#666666] block text-[10px]">STOCKOUT PROBABILITY</span>
              <span className="text-2xl font-bold text-[#CC3333]">
                {selectedProduct.stockoutProbability}%
              </span>
              <span className="text-[10px] text-[#888888] block mt-1">
                Stockout expected in {selectedProduct.expectedStockoutDays} days
              </span>
            </div>

            <div className="p-3 rounded bg-[#0D0D0D] border border-[#1F1F1F]">
              <span className="text-[#666666] block text-[10px]">DEMAND CONSUMPTION</span>
              <span className="text-xl font-bold text-white">
                {selectedProduct.dailyDemand} <span className="text-xs font-normal text-[#888888]">units/day</span>
              </span>
              <span className="text-[10px] text-[#888888] block mt-1">
                Runway: {selectedProduct.daysOfSupply} days of supply
              </span>
            </div>

            <div className="p-3 rounded bg-[#0D0D0D] border border-[#1F1F1F]">
              <span className="text-[#666666] block text-[10px]">DYNAMIC LEAD TIME</span>
              <span className="text-xl font-bold text-[#FF8800]">
                {selectedProduct.normalLeadTimeDays}d &rarr; {selectedProduct.predictedLeadTimeDays}d
              </span>
              <span className="text-[10px] text-[#CC3333] block mt-1">
                +{selectedProduct.predictedLeadTimeDays - selectedProduct.normalLeadTimeDays} days disruption delay
              </span>
            </div>

            <div className="p-3 rounded bg-[#0D0D0D] border border-[#1F1F1F]">
              <span className="text-[#666666] block text-[10px]">TRANSPARENT RISK BREAKDOWN</span>
              <div className="space-y-0.5 text-[10px] text-[#AAAAAA] mt-1">
                <div className="flex justify-between">
                  <span>Lead-Time Risk:</span>
                  <span className="text-[#CC3333] font-bold">+28</span>
                </div>
                <div className="flex justify-between">
                  <span>Demand Risk:</span>
                  <span className="text-[#FF8800] font-bold">+21</span>
                </div>
                <div className="flex justify-between">
                  <span>Supplier Exposure:</span>
                  <span className="text-[#FF8800] font-bold">+17</span>
                </div>
                <div className="flex justify-between">
                  <span>Disruption Severity:</span>
                  <span className="text-[#CC3333] font-bold">+21</span>
                </div>
              </div>
            </div>
          </div>

          {/* AI Recommendation Banner */}
          <div className="p-3.5 rounded bg-[#111111] border border-[#1F1F1F] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#F27D26] shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono uppercase text-[#F27D26] font-bold block">
                  AI REPLENISHMENT MITIGATION
                </span>
                <p className="text-xs text-[#D1D1D1] mt-0.5 font-sans leading-relaxed">
                  {selectedProduct.aiRecommendation}
                </p>
              </div>
            </div>

            {onSelectProductForReplenishment && (
              <button
                onClick={() => onSelectProductForReplenishment(selectedProduct.sku)}
                className="px-3.5 py-1.5 rounded bg-[#F27D26] hover:bg-[#FF8800] text-black font-mono text-xs font-bold uppercase tracking-wider whitespace-nowrap cursor-pointer transition-colors shadow-md"
              >
                Execute Replenishment Order
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
