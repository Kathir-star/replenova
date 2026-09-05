import React from 'react';
import {
  Play,
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { demoStorySteps } from '../../data/demoDisruptions';
import { Button } from '../ui/Button';

export const DemoStoryTour: React.FC = () => {
  const {
    demoTourActive,
    setDemoTourActive,
    demoTourStep,
    nextDemoTourStep,
    prevDemoTourStep,
  } = useApp();

  if (!demoTourActive) return null;

  const currentStepData = demoStorySteps.find((s) => s.step === demoTourStep) || demoStorySteps[0];

  return (
    <div className="fixed bottom-20 lg:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-2xl bg-[#111111]/95 backdrop-blur-xl border border-[#F27D26]/50 rounded-2xl shadow-2xl p-4 sm:p-5 animate-in fade-in slide-in-from-bottom-4 duration-200">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-[#222222]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#F27D26] animate-pulse" />
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            REPLENOVA Guided Disruption Narrative
          </span>
          <span className="text-[10px] font-mono bg-[#F27D26]/20 text-[#F27D26] px-2 py-0.5 rounded">
            Step {demoTourStep} of {demoStorySteps.length}
          </span>
        </div>

        <button
          onClick={() => setDemoTourActive(false)}
          className="text-[#777777] hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="py-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-[#F27D26] bg-[#F27D26]/10 px-2 py-0.5 rounded border border-[#F27D26]/30">
            {currentStepData.metricBadge}
          </span>
          <h4 className="text-sm sm:text-base font-bold text-white">{currentStepData.title}</h4>
        </div>
        <p className="text-xs sm:text-sm text-[#D1D1D1] mt-2 leading-relaxed">
          {currentStepData.narrative}
        </p>
      </div>

      {/* Progress Dots & Stepper */}
      <div className="pt-3 border-t border-[#222222] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {demoStorySteps.map((step) => (
            <div
              key={step.step}
              className={`h-1.5 rounded-full transition-all ${
                step.step === demoTourStep
                  ? 'w-6 bg-[#F27D26]'
                  : step.step < demoTourStep
                  ? 'w-2 bg-emerald-400'
                  : 'w-2 bg-[#333333]'
              }`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          {demoTourStep > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={prevDemoTourStep}
              icon={<ChevronLeft className="w-3.5 h-3.5" />}
              className="text-xs"
            >
              Back
            </Button>
          )}

          <Button
            variant="primary"
            size="sm"
            onClick={nextDemoTourStep}
            icon={
              demoTourStep === demoStorySteps.length ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )
            }
            className="text-xs"
          >
            {demoTourStep === demoStorySteps.length ? 'Finish Tour' : 'Next Step'}
          </Button>
        </div>
      </div>
    </div>
  );
};
