import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  X,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  ShieldCheck,
  RotateCw,
  ExternalLink
} from 'lucide-react';
import { DemoStoryStep } from '../types';

interface InteractiveDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToTab: (tab: string) => void;
  onApprovePrimaryRecommendation: () => void;
}

export const InteractiveDemoModal: React.FC<InteractiveDemoModalProps> = ({
  isOpen,
  onClose,
  onNavigateToTab,
  onApprovePrimaryRecommendation
}) => {
  const demoSteps: DemoStoryStep[] = [
    {
      step: 1,
      title: "Normal Operations Baseline",
      narrative: "All global nodes operating within nominal lead times. Chennai port container turnaround is standard (1.2 days). Warehouse buffer stock holds 12.4 days of automotive microcontroller supply.",
      highlightTarget: "command",
      metricBadge: "Inventory Runway: 12.4 Days • Healthy"
    },
    {
      step: 2,
      title: "Real-World Weather Disruption Detected",
      narrative: "Satellite meteorology sensors register Cyclone Mandous forming in the Bay of Bengal with 90 km/h winds, directly intersecting Indo-Pacific maritime shipping corridors.",
      highlightTarget: "disruptions",
      metricBadge: "Signal Confidence: 94% • High Impact"
    },
    {
      step: 3,
      title: "Port Congestion Predicted",
      narrative: "REPLENOVA AI projects 4 to 6-day container dwell spikes at Chennai Port terminal gates due to maritime vessel re-routing and crane shutdowns.",
      highlightTarget: "disruptions",
      metricBadge: "Vessels Queued: 14 • Container Dwell: +4.8 Days"
    },
    {
      step: 4,
      title: "Affected Shipments & Tier-1 Suppliers Flagged",
      narrative: "Impact propagation engine maps the delay to IndoSilicon Microelectronics shipment #PO-4521 carrying 10,000 microcontroller wafers currently at anchor.",
      highlightTarget: "network",
      metricBadge: "Flagged: Shipment #PO-4521 • Supplier: IndoSilicon"
    },
    {
      step: 5,
      title: "Dynamic Lead Time Increases (5d → 9d)",
      narrative: "Static ERP systems still assume the historical 5-day lead time. REPLENOVA instantly recalculates dynamic lead time to 9.2 days, factoring port dwell and land transport slowdowns.",
      highlightTarget: "inventory",
      metricBadge: "Lead Time Shift: +4.2 Days Disruption Variance"
    },
    {
      step: 6,
      title: "Inventory Runway Drops from 12 to 6.8 Days",
      narrative: "With Bangalore plant daily demand at 620 units/day and incoming shipments delayed, available stock of 4,200 units will breach safety stock thresholds in under 7 days.",
      highlightTarget: "inventory",
      metricBadge: "Available: 4,200 Units • Burn Rate: 620/day"
    },
    {
      step: 7,
      title: "Automotive Assembly Stockout Alert Triggered",
      narrative: "REPLENOVA flashes Critical Risk (87% stockout probability in 6 days). Assembly line halt threatens ₹68.4L in contractual penalties and idle automotive production.",
      highlightTarget: "inventory",
      metricBadge: "Stockout Prob: 87% • Revenue at Risk: ₹68.4L"
    },
    {
      step: 8,
      title: "AI Evaluates Multi-Tier Mitigation Options",
      narrative: "The Replenishment Engine evaluates 4 scenarios: waiting for delayed port clearance, full air freight from Taiwan (₹84k extra), inter-warehouse reallocation, or alternate domestic supplier activation.",
      highlightTarget: "replenishment",
      metricBadge: "Evaluating 4 Sourcing Corridors"
    },
    {
      step: 9,
      title: "AI Recommends Alternate Supplier + Expedited Freight",
      narrative: "Optimal trade-off selected: Order 2,500 units from Bharat Dynamics (domestic Tier-2) with priority expedited road/air dispatch for an incremental cost of just ₹21,600.",
      highlightTarget: "replenishment",
      metricBadge: "Recommended: Bharat Dynamics • Expedite Surcharge: ₹21.6k"
    },
    {
      step: 10,
      title: "Supply Chain Director Authorizes PO",
      narrative: "One-click approval syncs the purchase order into the ERP system and triggers pre-cleared freight pickup at the alternate facility.",
      highlightTarget: "actions",
      metricBadge: "Status: Approved & Dispatched"
    },
    {
      step: 11,
      title: "Stockout Avoided • ₹54.2L Net Capital Saved",
      narrative: "Parts arrive on Day 4. Assembly line operates without a single hour of downtime. Stockout probability collapses from 87% down to 13%, preserving ₹54.2L in enterprise value.",
      highlightTarget: "simulation",
      metricBadge: "NET CAPITAL PROTECTED: ₹54.2L • ROI: 250x"
    }
  ];

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const activeStep = demoSteps[currentStepIndex];

  useEffect(() => {
    let timer: any;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= demoSteps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 4500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, demoSteps.length]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStepIndex < demoSteps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const handleExecuteApproval = () => {
    onApprovePrimaryRecommendation();
    setCurrentStepIndex(10); // Jump to step 11
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        id="interactive-demo-story-modal"
        className="w-full max-w-2xl bg-[#0A0A0A] border border-[#1F1F1F] rounded p-6 shadow-2xl space-y-6 relative overflow-hidden"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-[#141414] border border-[#1F1F1F] text-[#F27D26]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h3 className="text-xs sm:text-sm font-semibold text-white tracking-wide uppercase">
                REPLENOVA INTERACTIVE DEMO STORY
              </h3>
              <span className="text-[10px] font-mono text-[#F27D26]">
                11-Step End-to-End Enterprise Value Demonstration
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 rounded bg-[#141414] border border-[#1F1F1F] hover:bg-[#1A1A1A] text-[#888888] hover:text-white text-xs font-mono flex items-center gap-1 cursor-pointer transition-colors"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isPlaying ? 'Pause' : 'Auto Play'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-[#888888] hover:text-white hover:bg-[#141414] cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between font-mono text-[11px] text-[#888888]">
            <span>STEP {activeStep.step} OF 11</span>
            <span className="text-[#F27D26] font-bold">{Math.round((activeStep.step / 11) * 100)}% COMPLETE</span>
          </div>
          <div className="w-full bg-[#050505] h-1.5 rounded overflow-hidden border border-[#1F1F1F]">
            <div
              className="bg-[#F27D26] h-full transition-all duration-300"
              style={{ width: `${(activeStep.step / 11) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content Card */}
        <div className="p-5 rounded bg-[#050505] border border-[#1F1F1F] space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-sm font-bold text-white font-sans">
              {activeStep.title}
            </h4>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141414] text-[#F27D26] border border-[#F27D26]/40 font-bold">
              {activeStep.metricBadge}
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#D1D1D1] font-sans leading-relaxed">
            {activeStep.narrative}
          </p>

          {/* Interactive CTA depending on the step */}
          <div className="pt-2 flex items-center justify-between">
            <button
              onClick={() => {
                onNavigateToTab(activeStep.highlightTarget);
                onClose();
              }}
              className="text-[11px] font-mono text-[#F27D26] hover:text-[#FF8800] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <span>Jump to view in {activeStep.highlightTarget.toUpperCase()}</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            {activeStep.step === 10 && (
              <button
                onClick={handleExecuteApproval}
                className="px-3.5 py-1.5 rounded bg-green-500 hover:bg-green-400 text-black font-mono text-xs font-bold cursor-pointer flex items-center gap-1.5 uppercase tracking-wider transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Simulate 1-Click Approval</span>
              </button>
            )}
          </div>
        </div>

        {/* Bottom Navigation Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1F1F1F] font-mono text-xs">
          <button
            disabled={currentStepIndex === 0}
            onClick={handlePrev}
            className="px-3.5 py-1.5 rounded bg-[#141414] border border-[#1F1F1F] hover:bg-[#1A1A1A] disabled:opacity-30 text-[#D1D1D1] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <span className="text-[#666666] text-[11px]">
            {activeStep.step} / 11
          </span>

          <button
            onClick={currentStepIndex === demoSteps.length - 1 ? onClose : handleNext}
            className="px-4 py-1.5 rounded bg-[#F27D26] hover:bg-[#FF8800] text-black font-bold flex items-center gap-1 cursor-pointer uppercase tracking-wider transition-colors"
          >
            <span>{currentStepIndex === demoSteps.length - 1 ? 'Finish Story' : 'Next Step'}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
