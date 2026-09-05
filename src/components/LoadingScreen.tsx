import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';
import { CheckCircle2, ChevronRight } from 'lucide-react';

interface LoadingScreenProps {
  onComplete?: () => void;
  onFinish?: () => void;
}

const STEPS = [
  'Connecting Supply Network',
  'Loading Inventory Intelligence',
  'Scanning Global Signals',
  'Analyzing Logistics',
  'Running Risk Engine'
];

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, onFinish }) => {
  const [completedStepIndex, setCompletedStepIndex] = useState<number>(-1);
  const [progress, setProgress] = useState<number>(0);

  const handleFinish = () => {
    if (typeof onComplete === 'function') {
      onComplete();
    }
    if (typeof onFinish === 'function') {
      onFinish();
    }
  };

  useEffect(() => {
    // Step progression timer
    const stepInterval = 420; // total ~2.2 seconds
    const timers: NodeJS.Timeout[] = [];

    STEPS.forEach((_, idx) => {
      const timer = setTimeout(() => {
        setCompletedStepIndex(idx);
        setProgress(Math.round(((idx + 1) / STEPS.length) * 100));
      }, (idx + 1) * stepInterval);
      timers.push(timer);
    });

    const finishTimer = setTimeout(() => {
      handleFinish();
    }, (STEPS.length + 1) * stepInterval);
    timers.push(finishTimer);

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, [onComplete, onFinish]);

  return (
    <motion.div
      id="enterprise-loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(8px)' }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] bg-sleek-grid text-[#D1D1D1] overflow-hidden"
    >
      {/* Background Subtle Lines */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          {/* Logistics network lines */}
          <motion.path
            d="M 150 200 Q 400 120 700 240 T 1200 300"
            fill="none"
            stroke="#333333"
            strokeWidth="1"
            strokeDasharray="4 6"
            animate={{ strokeDashoffset: [0, -100] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          />
          <motion.path
            d="M 300 450 Q 600 350 900 480 T 1400 380"
            fill="none"
            stroke="#F27D26"
            strokeWidth="1"
            strokeDasharray="4 6"
            animate={{ strokeDashoffset: [0, -100] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          />

          {/* Network nodes */}
          {[
            { cx: '25%', cy: '35%', r: 3, fill: '#666666' },
            { cx: '48%', cy: '52%', r: 4, fill: '#CC3333' },
            { cx: '75%', cy: '48%', r: 4.5, fill: '#F27D26' },
            { cx: '85%', cy: '32%', r: 3, fill: '#888888' }
          ].map((node, i) => (
            <g key={i}>
              <circle
                cx={node.cx}
                cy={node.cy}
                r={node.r}
                fill={node.fill}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Main Center Box */}
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="relative z-10 flex flex-col items-center max-w-md w-full px-6 text-center"
      >
        <Logo size="xl" showText={true} className="justify-center mb-2" />

        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-xs font-mono text-[#888888] tracking-[0.25em] uppercase mb-8"
        >
          AI Supply Chain Control Tower
        </motion.p>

        {/* Dynamic Progress Bar */}
        <div className="w-full bg-[#141414] rounded h-1 mb-6 overflow-hidden border border-[#1F1F1F]">
          <motion.div
            className="h-full bg-[#F27D26]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>

        {/* Initialization Steps with Checkmarks */}
        <div className="w-full space-y-2.5 text-left bg-[#0A0A0A] p-4 rounded border border-[#1F1F1F]">
          {STEPS.map((step, idx) => {
            const isDone = completedStepIndex >= idx;
            const isCurrent = completedStepIndex === idx - 1;

            return (
              <div
                key={step}
                className={`flex items-center justify-between text-xs py-1 transition-colors duration-200 ${
                  isDone
                    ? 'text-white font-medium'
                    : isCurrent
                    ? 'text-[#F27D26] font-semibold'
                    : 'text-[#666666]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {isDone ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    </motion.div>
                  ) : isCurrent ? (
                    <span className="w-3.5 h-3.5 rounded-full border-2 border-[#F27D26] border-t-transparent animate-spin shrink-0" />
                  ) : (
                    <span className="w-3.5 h-3.5 rounded-full border border-[#2A2A2A] shrink-0" />
                  )}
                  <span>{step}</span>
                </div>

                <span className="font-mono text-[10px]">
                  {isDone ? (
                    <span className="text-green-500 font-bold">READY</span>
                  ) : isCurrent ? (
                    <span className="text-[#F27D26] font-bold animate-pulse">INIT</span>
                  ) : (
                    <span className="text-[#444444]">WAIT</span>
                  )}
                </span>
              </div>
            );
          })}
        </div>

        {/* Skip button for rapid access */}
        <button
          onClick={handleFinish}
          className="mt-6 flex items-center gap-1 text-[11px] font-mono text-[#666666] hover:text-white transition-colors cursor-pointer py-1 px-3 rounded border border-transparent hover:border-[#1F1F1F]"
        >
          <span>Skip initialization</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </motion.div>

      {/* Footer Tagline */}
      <div className="absolute bottom-6 text-[10px] font-mono tracking-wider text-[#555555] uppercase">
        PREDICT DISRUPTIONS &bull; PREVENT STOCKOUTS &bull; REPLENISH INTELLIGENTLY
      </div>
    </motion.div>
  );
};
