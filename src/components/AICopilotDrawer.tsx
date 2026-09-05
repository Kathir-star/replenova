import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  Maximize2,
  Minimize2,
  RefreshCw
} from 'lucide-react';
import { CopilotMessage } from '../types';

interface AICopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: string) => void;
}

export const AICopilotDrawer: React.FC<AICopilotDrawerProps> = ({
  isOpen,
  onClose,
  onSelectTab
}) => {
  const [messages, setMessages] = useState<CopilotMessage[]>([
    {
      id: 'init-1',
      sender: 'ai',
      text: "Hello, I am REPLENOVA Intelligence Copilot. I continuously monitor real-world satellite weather, maritime port choke points, supplier lead times, and inventory stockouts. How can I assist your supply chain decisions today?",
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    "What is our highest-risk SKU right now?",
    "Explain why Chennai Port affects our production.",
    "Recommend the cheapest way to prevent the MCU-X1 stockout.",
    "Draft an urgent replenishment plan for Bangalore Warehouse."
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          context: {
            activeDisruptions: 7,
            criticalSku: 'MCU-X1',
            portDelayed: 'Chennai Port',
            primarySupplier: 'IndoSilicon Microelectronics'
          }
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();

      const aiMsg: CopilotMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || "I analyzed the disruption signals and updated the inventory risk forecasts.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { label: 'Inspect SKU MCU-X1 in Inventory', actionTab: 'inventory' },
          { label: 'View Replenishment Recommendation', actionTab: 'replenishment' }
        ]
      };

      setMessages(prev => [...prev, aiMsg]);
    } catch (err: any) {
      console.warn('Copilot request fallback:', err);
      // Fallback deterministic response
      const aiMsg: CopilotMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `### REPLENOVA Supply Chain Intelligence\n\n**Highest Risk SKU:** MCU-X1 (Automotive 32-Bit Microcontroller)\n- **Stockout Probability:** 87% within 6.8 days\n- **Root Cause:** Cyclone Mandous induced Chennai Port congestion (+4 days delay) delaying Shipment #PO-4521 from IndoSilicon Microelectronics.\n- **Autonomous Mitigation:** Sourcing 2,500 units from Bharat Dynamics via Air Freight saves ₹54.2L in potential assembly line halting losses.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [
          { label: 'Go to Replenishment Engine', actionTab: 'replenishment' },
          { label: 'Open Scenario Simulator', actionTab: 'simulation' }
        ]
      };
      setMessages(prev => [...prev, aiMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <aside
      id="ai-copilot-drawer"
      className={`fixed top-0 right-0 h-screen w-full sm:w-[460px] bg-[#0A0A0A] border-l border-[#1F1F1F] z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      {/* Drawer Top Header */}
      <div className="h-16 px-4 border-b border-[#1F1F1F] flex items-center justify-between bg-[#0A0A0A]">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded bg-[#1A1A1A] border border-[#2A2A2A] text-[#F27D26]">
            <Sparkles className="w-4 h-4 fill-current text-[#F27D26]" />
          </div>
          <div>
            <h3 className="text-xs font-semibold text-white tracking-wider uppercase">
              REPLENOVA AI COPILOT
            </h3>
            <span className="text-[10px] font-mono text-green-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              Gemini 3.8 Flash Hybrid Engine
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded text-[#888888] hover:text-white hover:bg-[#1A1A1A] cursor-pointer transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 border-b border-[#1F1F1F] bg-[#050505] overflow-x-auto whitespace-nowrap space-x-2 text-[10px] font-mono">
        <span className="text-[#666666] text-[10px] uppercase font-bold block mb-1">
          Quick Supply Chain Queries:
        </span>
        <div className="flex gap-1.5">
          {samplePrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 rounded bg-[#141414] hover:bg-[#1A1A1A] border border-[#1F1F1F] text-[#888888] hover:text-white cursor-pointer transition-colors text-[10px]"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-sans">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-[#F27D26] shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] p-3.5 rounded leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#F27D26] text-black font-semibold rounded-tr-none'
                  : 'bg-[#0D0D0D] border border-[#1F1F1F] text-[#D1D1D1] rounded-tl-none space-y-2'
              }`}
            >
              {/* Message body with Markdown styling support */}
              <div className="whitespace-pre-line text-xs font-sans">
                {msg.text}
              </div>

              {/* Action Buttons if AI provides shortcuts */}
              {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                <div className="pt-2 mt-2 border-t border-[#1F1F1F] flex flex-col gap-1.5 font-mono">
                  {msg.suggestedActions.map((act, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        onSelectTab(act.actionTab);
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded bg-[#141414] hover:bg-[#1A1A1A] border border-[#2A2A2A] text-white text-[10px] flex items-center justify-between cursor-pointer group transition-colors"
                    >
                      <span>{act.label}</span>
                      <ArrowRight className="w-3 h-3 text-[#F27D26] group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              )}

              <span className={`text-[9px] font-mono block text-right pt-1 ${msg.sender === 'user' ? 'text-black/70' : 'text-[#666666]'}`}>
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-white shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded bg-[#1A1A1A] border border-[#2A2A2A] flex items-center justify-center text-[#F27D26] shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded bg-[#0D0D0D] border border-[#1F1F1F] text-[#888888] text-xs font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#F27D26] animate-pulse" />
              <span>Synthesizing multi-tier supply chain telemetry...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-[#1F1F1F] bg-[#0A0A0A] flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask REPLENOVA AI Copilot anything..."
          className="flex-1 bg-[#050505] border border-[#1F1F1F] rounded px-3 py-2 text-xs text-white placeholder-[#666666] focus:outline-none focus:border-[#F27D26] font-mono"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2 rounded bg-[#F27D26] hover:bg-[#FF8800] disabled:opacity-30 text-black cursor-pointer transition-colors"
        >
          <Send className="w-4 h-4 fill-current text-black" />
        </button>
      </form>
    </aside>
  );
};
