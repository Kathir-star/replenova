import React, { useState } from 'react';
import { ImpactNode } from '../types';
import {
  CloudLightning,
  Compass,
  Anchor,
  Factory,
  PackageCheck,
  Clock,
  Warehouse as WhIcon,
  Cpu,
  AlertOctagon,
  IndianRupee,
  ArrowRight,
  ArrowDown,
  Info,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

interface ImpactChainVisualizerProps {
  chain: ImpactNode[];
  onReviewMitigation?: () => void;
  onSimulateScenario?: () => void;
}

export const ImpactChainVisualizer: React.FC<ImpactChainVisualizerProps> = ({
  chain,
  onReviewMitigation,
  onSimulateScenario
}) => {
  const [selectedNode, setSelectedNode] = useState<ImpactNode | null>(chain[0] || null);

  const getNodeIcon = (type: ImpactNode['type']) => {
    switch (type) {
      case 'event':
        return CloudLightning;
      case 'corridor':
        return Compass;
      case 'port':
        return Anchor;
      case 'supplier':
        return Factory;
      case 'shipment':
        return PackageCheck;
      case 'delay':
        return Clock;
      case 'warehouse':
        return WhIcon;
      case 'sku':
        return Cpu;
      case 'stockout':
        return AlertOctagon;
      case 'exposure':
      default:
        return IndianRupee;
    }
  };

  return (
    <div
      id="ai-impact-chain-section"
      className="p-4 rounded bg-[#0A0A0A] border border-[#1F1F1F] space-y-4"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#1F1F1F]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#CC3333] animate-pulse" />
            <h3 className="text-xs font-semibold text-white tracking-wide uppercase">
              Automated Cascade Analysis &bull; Real-Time Disruption Propagation
            </h3>
          </div>
          <p className="text-[10px] text-[#666666] mt-0.5 font-mono">
            Signal &rarr; Port Delay &rarr; Transit Halts &rarr; Warehouse Runway &rarr; Stockout Risk
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onSimulateScenario && (
            <button
              onClick={onSimulateScenario}
              className="px-3 py-1.5 rounded bg-[#1A1A1A] hover:bg-[#222222] text-[11px] font-mono text-[#D1D1D1] border border-[#2A2A2A] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>Simulate Shock</span>
            </button>
          )}
          {onReviewMitigation && (
            <button
              onClick={onReviewMitigation}
              className="px-3 py-1.5 rounded bg-[#F27D26] hover:bg-[#FF8800] text-[11px] font-mono font-bold text-black flex items-center gap-1.5 cursor-pointer uppercase tracking-wider transition-colors shadow-md"
            >
              <Sparkles className="w-3.5 h-3.5 fill-current text-black" />
              <span>Mitigate Cascade (₹54.2L Saved)</span>
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Interactive Chain Scroll Container */}
      <div className="overflow-x-auto pb-2 pt-1">
        <div className="flex items-center gap-2 min-w-[1020px]">
          {chain.map((node, index) => {
            const Icon = getNodeIcon(node.type);
            const isSelected = selectedNode?.id === node.id;
            const isLast = index === chain.length - 1;

            const getNodeStyle = () => {
              if (isSelected) {
                return 'ring-1 ring-[#F27D26] border-[#F27D26] bg-[#1A1A1A] text-white';
              }
              if (node.badgeType === 'critical') {
                return 'border-[#CC3333] bg-[#221111] text-[#D1D1D1] hover:border-[#CC3333]';
              }
              if (node.badgeType === 'elevated') {
                return 'border-[#FF8800] bg-[#221A11] text-[#D1D1D1] hover:border-[#FF8800]';
              }
              return 'border-[#1F1F1F] bg-[#111111] text-[#D1D1D1] hover:border-[#2A2A2A]';
            };

            return (
              <React.Fragment key={node.id}>
                {/* Node Box */}
                <div
                  onClick={() => setSelectedNode(node)}
                  className={`flex flex-col p-3 rounded border transition-colors cursor-pointer min-w-[155px] max-w-[165px] select-none group relative ${getNodeStyle()}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-[9px] text-[#666666] font-bold">
                      0{node.step}
                    </span>
                    <div
                      className={`p-1 rounded ${
                        node.badgeType === 'critical'
                          ? 'text-[#CC3333]'
                          : node.badgeType === 'elevated'
                          ? 'text-[#FF8800]'
                          : 'text-[#F27D26]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <h5 className="text-[11px] font-semibold text-white uppercase tracking-tight line-clamp-2 min-h-[30px]">
                    {node.title}
                  </h5>

                  <span className="text-[9px] font-mono text-[#888888] mt-1 line-clamp-1">
                    {node.subtitle}
                  </span>

                  {node.badge && (
                    <div className="mt-2 pt-1.5 border-t border-black/30">
                      <span
                        className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold inline-block truncate max-w-full ${
                          node.badgeType === 'critical'
                            ? 'bg-[#CC3333] text-white'
                            : node.badgeType === 'elevated'
                            ? 'bg-[#FF8800] text-black'
                            : 'bg-[#1A1A1A] text-[#D1D1D1] border border-[#2A2A2A]'
                        }`}
                      >
                        {node.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Arrow Connector between nodes */}
                {!isLast && (
                  <div className="shrink-0 flex items-center justify-center text-[#444444]">
                    <ArrowRight className="w-3.5 h-3.5 text-[#666666]" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Detail Inspector for the selected chain node */}
      {selectedNode && (
        <div className="p-3.5 rounded bg-[#0D0D0D] border border-[#1F1F1F] text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-[#1A1A1A] border border-[#2A2A2A] text-[#F27D26] shrink-0 mt-0.5">
              <Info className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold">
                  STEP {selectedNode.step}: {selectedNode.title}
                </span>
                <span className="text-[10px] text-[#666666]">({selectedNode.subtitle})</span>
              </div>
              <p className="text-[#888888] text-[11px] mt-1 font-sans leading-relaxed max-w-3xl">
                {selectedNode.details}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <span className="text-[10px] text-green-500 bg-[#141F14] border border-green-800/40 px-2 py-1 rounded">
              AI Monitored (Confidence 94%)
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
