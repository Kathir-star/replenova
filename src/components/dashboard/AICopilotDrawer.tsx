import React, { useState } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { askCopilot } from '../../services/ai';
import { useNavigate } from 'react-router-dom';

export const AICopilotDrawer: React.FC = () => {
  const {
    copilotOpen,
    setCopilotOpen,
    copilotMessages,
    addCopilotMessage,
    selectedDisruption,
    selectedSku,
  } = useApp();

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!copilotOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user' as const,
      text: query,
      timestamp: 'Just now',
    };
    addCopilotMessage(userMsg);
    setInputQuery('');
    setLoading(true);

    try {
      const response = await askCopilot(query, {
        disruption: selectedDisruption,
        sku: selectedSku,
      });

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: 'ai' as const,
        text: response.text,
        timestamp: 'Just now',
        suggestedActions: response.suggestedActions,
      };
      addCopilotMessage(aiMsg);
    } catch {
      const fallbackMsg = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai' as const,
        text: 'REPLENOVA AI is analyzing active supply routes. Bay of Bengal Cyclone Mandous remains the highest priority critical bottleneck.',
        timestamp: 'Just now',
      };
      addCopilotMessage(fallbackMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (actionTab: string) => {
    if (actionTab === 'command-center') navigate('/');
    else if (actionTab === 'inventory') navigate('/inventory');
    else if (actionTab === 'disruptions') navigate('/disruptions');
    else if (actionTab === 'network') navigate('/network');
    else if (actionTab === 'replenishment') navigate('/replenishment');
    else if (actionTab === 'ai-actions') navigate('/ai-actions');
    else if (actionTab === 'simulator') navigate('/simulator');
    else if (actionTab === 'analytics') navigate('/analytics');
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#0D0D0D] border-l border-[#222222] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="p-4 border-b border-[#1E1E1E] flex items-center justify-between bg-[#121212]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#F27D26]/20 border border-[#F27D26]/40 flex items-center justify-center text-[#F27D26]">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">REPLENOVA AI Copilot</h3>
            <p className="text-[10px] text-[#737373] font-mono">Autonomous Supply Chain Intelligence</p>
          </div>
        </div>

        <button
          onClick={() => setCopilotOpen(false)}
          className="p-1.5 rounded-lg text-[#777777] hover:text-white hover:bg-[#1C1C1C] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="p-3 bg-[#0A0A0A] border-b border-[#1A1A1A] flex items-center gap-2 overflow-x-auto scrollbar-thin">
        {[
          'Analyze Cyclone Mandous',
          'Evaluate MCU-X1 Stockout Risk',
          'Explain Reallocation Strategy',
        ].map((prompt) => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-full bg-[#181818] hover:bg-[#242424] text-[#C0C0C0] border border-[#2B2B2B] transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin">
        {copilotMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#F27D26] text-white rounded-br-xs'
                  : 'bg-[#161616] text-[#D1D1D1] border border-[#242424] rounded-bl-xs'
              }`}
            >
              <p className="whitespace-pre-line">{msg.text}</p>

              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="mt-3 pt-2.5 border-t border-white/10 space-y-1.5">
                  <p className="text-[10px] font-mono uppercase text-[#A0A0A0]">Suggested Directives:</p>
                  {msg.suggestedActions.map((act) => (
                    <button
                      key={act.label}
                      onClick={() => handleActionClick(act.actionTab)}
                      className="w-full text-left p-1.5 rounded bg-[#202020] hover:bg-[#2A2A2A] text-[11px] text-[#F27D26] font-medium flex items-center justify-between border border-[#333333] transition-colors"
                    >
                      <span>{act.label}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <span className="text-[9px] font-mono text-[#555555] mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-[#888888] p-2 bg-[#141414] rounded-lg border border-[#222222] w-fit">
            <span className="w-3.5 h-3.5 border-2 border-[#F27D26] border-t-transparent rounded-full animate-spin" />
            <span>Analyzing multi-echelon telemetry...</span>
          </div>
        )}
      </div>

      {/* Input Box */}
      <div className="p-3 border-t border-[#1E1E1E] bg-[#121212]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask REPLENOVA AI anything..."
            className="flex-1 bg-[#1A1A1A] text-xs text-white placeholder-[#666666] rounded-lg px-3.5 py-2.5 border border-[#2D2D2D] focus:outline-none focus:border-[#F27D26]"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || loading}
            className="p-2.5 rounded-lg bg-[#F27D26] hover:bg-[#ff8e38] text-white disabled:opacity-40 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
