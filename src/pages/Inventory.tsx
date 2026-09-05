import React, { useState, useMemo } from 'react';
import {
  Boxes,
  Search,
  Filter,
  SlidersHorizontal,
  Sparkles,
  ArrowUpDown,
  Download,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  Warehouse,
  ExternalLink,
  ChevronRight,
  Plane,
  Truck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { formatInrCurrency } from '../lib/calculations';
import { InventoryItem } from '../types/inventory';
import { useNavigate } from 'react-router-dom';

export const Inventory: React.FC = () => {
  const {
    inventory,
    searchQuery,
    setSearchQuery,
    filterRiskLevel,
    setFilterRiskLevel,
    setSelectedSku,
    approveRecommendation,
    recommendations,
  } = useApp();

  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof InventoryItem>('stockoutProbability');
  const [sortAsc, setSortAsc] = useState<boolean>(false);
  const [inspectedItem, setInspectedItem] = useState<InventoryItem | null>(inventory[0]);

  // Unique categories
  const categories = useMemo(() => {
    const set = new Set(inventory.map((i) => i.category));
    return ['all', ...Array.from(set)];
  }, [inventory]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    return inventory
      .filter((item) => {
        const matchesSearch =
          item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.warehouseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.supplierName.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesRisk =
          filterRiskLevel === 'all' || item.riskLevel.toLowerCase() === filterRiskLevel.toLowerCase();

        const matchesCategory =
          selectedCategory === 'all' || item.category === selectedCategory;

        return matchesSearch && matchesRisk && matchesCategory;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') {
          return sortAsc ? (valA as string).localeCompare(valB as string) : (valB as string).localeCompare(valA as string);
        }
        return sortAsc ? (Number(valA) - Number(valB)) : (Number(valB) - Number(valA));
      });
  }, [inventory, searchQuery, filterRiskLevel, selectedCategory, sortField, sortAsc]);

  const handleSort = (field: keyof InventoryItem) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#1E1E1E]">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Boxes className="w-5 h-5 text-[#F27D26]" />
            <span>Multi-Echelon Inventory & Supply Health</span>
          </h1>
          <p className="text-xs text-[#808080] mt-0.5">
            Real-time buffer stock monitoring, stockout predictions, and lead time variance across 5 regional hubs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/replenishment')}
            icon={<Sparkles className="w-3.5 h-3.5 text-[#F27D26]" />}
            className="text-xs"
          >
            Review AI Orders
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-[#111111] rounded-xl border border-[#222222]">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          {/* Search Input */}
          <div className="relative flex-1 max-w-xs">
            <Search className="w-3.5 h-3.5 text-[#666666] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter SKUs, hubs, suppliers..."
              className="w-full bg-[#161616] text-xs text-white placeholder-[#555555] rounded-lg pl-8 pr-3 py-1.5 border border-[#2A2A2A] focus:outline-none focus:border-[#F27D26]"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-[#161616] text-xs text-[#D1D1D1] rounded-lg px-2.5 py-1.5 border border-[#2A2A2A] focus:outline-none focus:border-[#F27D26]"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat.toUpperCase()}
              </option>
            ))}
          </select>

          {/* Risk Level Filter */}
          <select
            value={filterRiskLevel}
            onChange={(e) => setFilterRiskLevel(e.target.value)}
            className="bg-[#161616] text-xs text-[#D1D1D1] rounded-lg px-2.5 py-1.5 border border-[#2A2A2A] focus:outline-none focus:border-[#F27D26]"
          >
            <option value="all">Risk: ALL LEVELS</option>
            <option value="critical">Risk: CRITICAL</option>
            <option value="elevated">Risk: ELEVATED</option>
            <option value="watch">Risk: WATCH</option>
            <option value="healthy">Risk: HEALTHY</option>
          </select>
        </div>

        <div className="text-xs font-mono text-[#777777]">
          Showing <strong>{filteredItems.length}</strong> of <strong>{inventory.length}</strong> SKUs
        </div>
      </div>

      {/* Main Table Card */}
      <Card className="border-[#222222] overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#141414] text-[#888888] font-mono border-b border-[#222222] uppercase text-[10.5px]">
              <tr>
                <th className="p-3.5 cursor-pointer hover:text-white" onClick={() => handleSort('sku')}>
                  <div className="flex items-center gap-1">
                    <span>SKU / Product</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5 cursor-pointer hover:text-white" onClick={() => handleSort('warehouseName')}>
                  <div className="flex items-center gap-1">
                    <span>Hub / Depot</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5 cursor-pointer hover:text-white" onClick={() => handleSort('currentStock')}>
                  <div className="flex items-center gap-1">
                    <span>Stock</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5 cursor-pointer hover:text-white" onClick={() => handleSort('daysOfSupply')}>
                  <div className="flex items-center gap-1">
                    <span>Supply Days</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5 cursor-pointer hover:text-white" onClick={() => handleSort('predictedLeadTimeDays')}>
                  <div className="flex items-center gap-1">
                    <span>Lead Time</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5 cursor-pointer hover:text-white" onClick={() => handleSort('stockoutProbability')}>
                  <div className="flex items-center gap-1">
                    <span>Stockout Risk</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5 cursor-pointer hover:text-white" onClick={() => handleSort('revenueExposureInr')}>
                  <div className="flex items-center gap-1">
                    <span>Exposure</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#1A1A1A]">
              {filteredItems.map((item) => {
                const isCritical = item.riskLevel === 'critical';
                const isElevated = item.riskLevel === 'elevated';
                const isInspected = inspectedItem?.id === item.id;

                return (
                  <tr
                    key={item.id}
                    onClick={() => setInspectedItem(item)}
                    className={`transition-colors cursor-pointer ${
                      isInspected
                        ? 'bg-[#1C1C1C]'
                        : isCritical
                        ? 'bg-red-950/10 hover:bg-red-950/20'
                        : 'hover:bg-[#141414]'
                    }`}
                  >
                    {/* SKU / Name */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white">{item.sku}</span>
                        <Badge variant={item.riskLevel} size="sm">
                          {item.riskLevel}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-[#888888] truncate max-w-[200px] mt-0.5">
                        {item.productName}
                      </p>
                    </td>

                    {/* Warehouse */}
                    <td className="p-3.5">
                      <div className="flex items-center gap-1.5 text-white font-medium">
                        <Warehouse className="w-3.5 h-3.5 text-[#777777]" />
                        <span>{item.warehouseName.split(' ')[0]}</span>
                      </div>
                      <p className="text-[10.5px] text-[#666666] font-mono">{item.category}</p>
                    </td>

                    {/* Stock & Safety Stock */}
                    <td className="p-3.5 font-mono">
                      <span className="text-white font-semibold">{item.currentStock.toLocaleString()}</span>
                      <span className="text-[10px] text-[#666666] block">Safety: {item.safetyStock.toLocaleString()}</span>
                    </td>

                    {/* Days of Supply */}
                    <td className="p-3.5 font-mono">
                      <span className={`font-semibold ${item.daysOfSupply < 10 ? 'text-red-400' : 'text-[#D1D1D1]'}`}>
                        {item.daysOfSupply}d
                      </span>
                      <span className="text-[10px] text-[#666666] block">{item.dailyDemand}/d burn</span>
                    </td>

                    {/* Lead Time */}
                    <td className="p-3.5 font-mono">
                      <span className={`${item.leadTimeDeficitDays > 0 ? 'text-amber-400 font-bold' : 'text-[#D1D1D1]'}`}>
                        {item.predictedLeadTimeDays}d
                      </span>
                      {item.leadTimeDeficitDays > 0 && (
                        <span className="text-[10px] text-red-400 block">+{item.leadTimeDeficitDays}d delay</span>
                      )}
                    </td>

                    {/* Stockout Probability */}
                    <td className="p-3.5 font-mono">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-[#222222] rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              isCritical ? 'bg-red-500' : isElevated ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}
                            style={{ width: `${item.stockoutProbability}%` }}
                          />
                        </div>
                        <span
                          className={`font-bold ${
                            isCritical ? 'text-red-400' : isElevated ? 'text-amber-400' : 'text-emerald-400'
                          }`}
                        >
                          {item.stockoutProbability}%
                        </span>
                      </div>
                      <span className="text-[10px] text-[#666666] block">
                        Cliff: {item.expectedStockoutDays}d
                      </span>
                    </td>

                    {/* Revenue Exposure */}
                    <td className="p-3.5 font-mono font-semibold text-white">
                      {formatInrCurrency(item.revenueExposureInr)}
                    </td>

                    {/* Action */}
                    <td className="p-3.5 text-right">
                      <Button
                        variant={isCritical ? 'primary' : 'outline'}
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSku(item.sku);
                          navigate('/replenishment');
                        }}
                        className="text-xs py-1 px-2.5"
                      >
                        Mitigate
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Drawer / Detail Inspector for Selected SKU */}
      {inspectedItem && (
        <Card className="border-[#282828] bg-[#101010] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#222222]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#F27D26]/10 border border-[#F27D26]/30 text-[#F27D26]">
                <Boxes className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white font-mono">{inspectedItem.sku}</h3>
                  <Badge variant={inspectedItem.riskLevel}>{inspectedItem.riskLevel}</Badge>
                </div>
                <p className="text-xs text-[#888888]">{inspectedItem.productName} • {inspectedItem.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedSku(inspectedItem.sku);
                  navigate('/simulator');
                }}
                className="text-xs"
              >
                Simulate Scenario
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setSelectedSku(inspectedItem.sku);
                  navigate('/replenishment');
                }}
                className="text-xs"
              >
                Execute Replenishment
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-xs">
            <div className="p-3 rounded-lg bg-[#141414] border border-[#222222]">
              <p className="text-[#777777] uppercase font-mono text-[10px]">Supply Chain Logistics</p>
              <p className="text-white font-medium mt-1">Supplier: {inspectedItem.supplierName}</p>
              <p className="text-[#A0A0A0] mt-0.5">Depot: {inspectedItem.warehouseName}</p>
              <p className="text-[#A0A0A0] mt-0.5">Daily Burn: {inspectedItem.dailyDemand} units/day</p>
            </div>

            <div className="p-3 rounded-lg bg-[#141414] border border-[#222222]">
              <p className="text-[#777777] uppercase font-mono text-[10px]">Lead Time Analysis</p>
              <p className="text-white font-medium mt-1">Standard: {inspectedItem.normalLeadTimeDays} days</p>
              <p className="text-red-400 mt-0.5">Predicted Active: {inspectedItem.predictedLeadTimeDays} days</p>
              <p className="text-[#A0A0A0] mt-0.5">Deficit: +{inspectedItem.leadTimeDeficitDays} days delay</p>
            </div>

            <div className="p-3 rounded-lg bg-[#141414] border border-[#222222]">
              <p className="text-[#777777] uppercase font-mono text-[10px]">AI Strategic Recommendation</p>
              <p className="text-[#D1D1D1] mt-1 leading-relaxed">{inspectedItem.aiRecommendation}</p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
