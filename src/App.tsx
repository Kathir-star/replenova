import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { LoadingScreen } from './components/LoadingScreen';
import { CommandCenterView } from './components/CommandCenterView';
import { InventoryView } from './components/InventoryView';
import { DisruptionsView } from './components/DisruptionsView';
import { NetworkView } from './components/NetworkView';
import { ReplenishmentView } from './components/ReplenishmentView';
import { AIActionsView } from './components/AIActionsView';
import { ScenarioSimulatorView } from './components/ScenarioSimulatorView';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsView } from './components/SettingsView';
import { AICopilotDrawer } from './components/AICopilotDrawer';
import { InteractiveDemoModal } from './components/InteractiveDemoModal';

import {
  INITIAL_PRODUCTS,
  INITIAL_DISRUPTIONS,
  INITIAL_SUPPLIERS,
  INITIAL_WAREHOUSES,
  INITIAL_PORTS,
  INITIAL_ROUTES,
  INITIAL_RECOMMENDATIONS,
  INITIAL_ACTIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_IMPACT_CHAIN,
  INITIAL_SCENARIOS
} from './data/mockSupplyChain';

import {
  Product,
  ExternalDisruptionEvent,
  Supplier,
  Warehouse,
  PortHub,
  SupplyRoute,
  ReplenishmentRecommendation,
  AIAction,
  NotificationItem,
  ImpactNode,
  SimulationScenarioPreset
} from './types';

import { Bot, Sparkles, AlertCircle, ShieldCheck } from 'lucide-react';

export function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('command');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [isSimulatedDisruptionActive, setIsSimulatedDisruptionActive] = useState<boolean>(false);

  // Core Data State
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [disruptions, setDisruptions] = useState<ExternalDisruptionEvent[]>(INITIAL_DISRUPTIONS);
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [warehouses, setWarehouses] = useState<Warehouse[]>(INITIAL_WAREHOUSES);
  const [ports, setPorts] = useState<PortHub[]>(INITIAL_PORTS);
  const [routes, setRoutes] = useState<SupplyRoute[]>(INITIAL_ROUTES);
  const [recommendations, setRecommendations] = useState<ReplenishmentRecommendation[]>(INITIAL_RECOMMENDATIONS);
  const [actions, setActions] = useState<AIAction[]>(INITIAL_ACTIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [impactChain, setImpactChain] = useState<ImpactNode[]>(INITIAL_IMPACT_CHAIN);
  const [scenarios, setScenarios] = useState<SimulationScenarioPreset[]>(INITIAL_SCENARIOS);

  // Selected SKU for deep dive
  const [preselectedSku, setPreselectedSku] = useState<string | undefined>(undefined);

  // Disruption Simulation Toggle Logic
  const handleToggleSimulateDisruption = () => {
    if (!isSimulatedDisruptionActive) {
      // Inject accelerated storm disruption
      setIsSimulatedDisruptionActive(true);
      setProducts(prev =>
        prev.map(p =>
          p.sku === 'MCU-X1'
            ? {
                ...p,
                predictedLeadTimeDays: 11,
                stockoutProbability: 94,
                daysOfSupply: 5.2,
                disruptionRisk: 'Critical',
                expectedStockoutDays: 4
              }
            : p
        )
      );

      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        title: 'Disruption Shock Injected: Chennai Port Crane Closure',
        message: 'Severe storm gusts triggered emergency berth shutdown. Predicted delay increased to +6.5 days.',
        timestamp: 'Just now',
        level: 'critical',
        read: false,
        linkTab: 'disruptions'
      };
      setNotifications(prev => [newNotif, ...prev]);
    } else {
      // Restore baseline
      setIsSimulatedDisruptionActive(false);
      setProducts(INITIAL_PRODUCTS);
    }
  };

  // PO Approval Logic (Executes recommendation and saves losses)
  const handleApproveRecommendation = (recId: string) => {
    // 1. Update recommendation status
    setRecommendations(prev =>
      prev.map(r => (r.id === recId ? { ...r, status: 'approved' } : r))
    );

    // 2. Reduce SKU risk
    setProducts(prev =>
      prev.map(p =>
        p.sku === 'MCU-X1'
          ? {
              ...p,
              stockoutProbability: 13,
              disruptionRisk: 'Low',
              daysOfSupply: 14.5,
              currentStock: p.currentStock + 2500,
              aiRecommendation: 'Expedited alternate supplier shipment active. Delivery expected in 4 days.'
            }
          : p
      )
    );

    // 3. Move into Approved Actions timeline
    const approvedRec = recommendations.find(r => r.id === recId);
    if (approvedRec) {
      const newAction: AIAction = {
        id: `action-approved-${Date.now()}`,
        title: `PO Issued: ${approvedRec.orderUnits} units from ${approvedRec.alternateSupplierName}`,
        category: 'Alternate Sourcing',
        riskLevel: 'watch',
        problem: `Prevented assembly stockout for ${approvedRec.sku}`,
        recommendedAction: `Dispatched via ${approvedRec.transportMode}. Transit tracking live.`,
        benefit: 'Averted ₹54.2L production shutdown by securing critical stock with 4-day delivery.',
        costInr: approvedRec.estimatedAdditionalCostInr,
        riskReductionPct: approvedRec.riskReductionPct,
        confidencePct: 96,
        status: 'approved',
        timestamp: 'Just now'
      };
      setActions(prev => [newAction, ...prev]);
    }

    // 4. Trigger success notification
    const successNotif: NotificationItem = {
      id: `notif-approved-${Date.now()}`,
      title: 'Replenishment Order Authorized',
      message: 'Emergency purchase order synced with ERP. Potential loss avoided: ₹54.2L.',
      timestamp: 'Just now',
      level: 'healthy',
      read: false,
      linkTab: 'replenishment'
    };
    setNotifications(prev => [successNotif, ...prev]);
  };

  const handleApproveAction = (actionId: string) => {
    setActions(prev =>
      prev.map(a => (a.id === actionId ? { ...a, status: 'approved' } : a))
    );
  };

  const handleDismissAction = (actionId: string) => {
    setActions(prev => prev.filter(a => a.id !== actionId));
  };

  const handleResetData = () => {
    setProducts(INITIAL_PRODUCTS);
    setDisruptions(INITIAL_DISRUPTIONS);
    setSuppliers(INITIAL_SUPPLIERS);
    setWarehouses(INITIAL_WAREHOUSES);
    setPorts(INITIAL_PORTS);
    setRoutes(INITIAL_ROUTES);
    setRecommendations(INITIAL_RECOMMENDATIONS);
    setActions(INITIAL_ACTIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setIsSimulatedDisruptionActive(false);
  };

  const handleSearchSelect = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes('mcu') || q.includes('sku') || q.includes('product')) {
      setActiveTab('inventory');
    } else if (q.includes('port') || q.includes('chennai') || q.includes('cyclone')) {
      setActiveTab('disruptions');
    } else if (q.includes('supplier') || q.includes('bharat')) {
      setActiveTab('replenishment');
    } else if (q.includes('simulat')) {
      setActiveTab('simulation');
    } else {
      setActiveTab('inventory');
    }
  };

  const criticalSkusCount = products.filter(p => p.stockoutProbability > 70).length;
  const criticalDisruptionsCount = disruptions.filter(d => d.severity === 'critical').length;
  const pendingActionsCount = actions.filter(a => a.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#050505] text-[#D1D1D1] flex flex-col font-sans selection:bg-[#F27D26]/30 selection:text-white">
      {/* Initialization Loading Animation for Enterprise Feel */}
      {isLoading && (
        <LoadingScreen onComplete={() => setIsLoading(false)} onFinish={() => setIsLoading(false)} />
      )}

      {/* Main Layout Shell */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Persistent Enterprise Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isOpenMobile={isMobileSidebarOpen}
          onToggleMobile={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          criticalDisruptionsCount={criticalDisruptionsCount}
          criticalSkusCount={criticalSkusCount}
          pendingActionsCount={pendingActionsCount}
        />

        {/* Center Content Workspace */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Sticky Top Navigation Bar */}
          <TopNav
            notifications={notifications}
            onSelectTab={setActiveTab}
            onStartDemo={() => setIsDemoModalOpen(true)}
            onSimulateDisruption={handleToggleSimulateDisruption}
            isSimulatedDisruptionActive={isSimulatedDisruptionActive}
            onSearchSelect={handleSearchSelect}
          />

          {/* Subheader Breadcrumb & Mobile Menu Button */}
          <div className="px-4 sm:px-6 py-2.5 bg-[#080808] border-b border-[#1F1F1F] flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-1 rounded hover:bg-[#141414] text-[#888888]"
              >
                <span className="sr-only">Open Sidebar</span>
                <span className="w-4 h-0.5 bg-[#888888] block mb-1"></span>
                <span className="w-4 h-0.5 bg-[#888888] block mb-1"></span>
                <span className="w-4 h-0.5 bg-[#888888] block"></span>
              </button>

              <span className="text-[#666666]">REPLENOVA</span>
              <span className="text-[#333333]">/</span>
              <span className="text-[#F27D26] font-bold uppercase tracking-wider">
                {activeTab}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {isSimulatedDisruptionActive && (
                <span className="px-2 py-0.5 rounded bg-[#221111] text-[#CC3333] border border-[#CC3333]/40 text-[10px] animate-pulse">
                  ACTIVE SHOCK: Cyclone Mandous Delays Active
                </span>
              )}
              <span className="text-[10px] text-[#666666] hidden sm:inline">
                Last Telemetry Sync: 12s ago
              </span>
            </div>
          </div>

          {/* Main Viewport Container */}
          <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto pb-16">
            {activeTab === 'command' && (
              <CommandCenterView
                suppliers={suppliers}
                warehouses={warehouses}
                ports={ports}
                routes={routes}
                disruptions={disruptions}
                products={products}
                impactChain={impactChain}
                recommendations={recommendations}
                onNavigateToTab={setActiveTab}
                onOpenCopilot={() => setIsCopilotOpen(true)}
                onSelectProductForReplenishment={(sku) => {
                  setPreselectedSku(sku);
                  setActiveTab('replenishment');
                }}
              />
            )}

            {activeTab === 'inventory' && (
              <InventoryView
                products={products}
                onSelectProductForReplenishment={(sku) => {
                  setPreselectedSku(sku);
                  setActiveTab('replenishment');
                }}
              />
            )}

            {activeTab === 'disruptions' && (
              <DisruptionsView
                disruptions={disruptions}
                onSimulateDisruption={handleToggleSimulateDisruption}
                isSimulatedDisruptionActive={isSimulatedDisruptionActive}
                onNavigateToScenario={(title) => {
                  setActiveTab('simulation');
                }}
                onNavigateToReplenishment={() => setActiveTab('replenishment')}
              />
            )}

            {activeTab === 'network' && (
              <NetworkView
                suppliers={suppliers}
                warehouses={warehouses}
                ports={ports}
                routes={routes}
              />
            )}

            {activeTab === 'replenishment' && (
              <ReplenishmentView
                recommendations={recommendations}
                onApproveRecommendation={handleApproveRecommendation}
                onSimulateRecommendation={() => setActiveTab('simulation')}
                preselectedSku={preselectedSku}
              />
            )}

            {activeTab === 'actions' && (
              <AIActionsView
                actions={actions}
                onApproveAction={handleApproveAction}
                onDismissAction={handleDismissAction}
                onSimulateAction={() => setActiveTab('simulation')}
              />
            )}

            {activeTab === 'simulation' && (
              <ScenarioSimulatorView
                scenarios={scenarios}
                onApplyMitigationPlan={(sc) => {
                  handleApproveRecommendation('rec-1');
                  setActiveTab('replenishment');
                }}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsView />
            )}

            {activeTab === 'settings' && (
              <SettingsView onResetData={handleResetData} />
            )}
          </main>
        </div>
      </div>

      {/* Floating AI Copilot Trigger Button (Bottom-Right) */}
      <button
        id="floating-ai-copilot-trigger"
        onClick={() => setIsCopilotOpen(true)}
        className="fixed bottom-5 right-5 z-40 px-3.5 py-2.5 rounded bg-[#F27D26] hover:bg-[#FF8800] text-black font-mono text-xs font-bold shadow-xl border border-[#F27D26] flex items-center gap-2 cursor-pointer transition-all hover:scale-105 active:scale-95 group uppercase tracking-wider"
      >
        <Sparkles className="w-4 h-4 text-black group-hover:rotate-12 transition-transform" />
        <span className="tracking-wide">AI COPILOT</span>
        <span className="w-2 h-2 rounded-full bg-black animate-ping"></span>
      </button>

      {/* Slide-Out AI Copilot Drawer */}
      <AICopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        onSelectTab={setActiveTab}
      />

      {/* 11-Step Interactive Demo Story Modal */}
      <InteractiveDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        onNavigateToTab={setActiveTab}
        onApprovePrimaryRecommendation={() => handleApproveRecommendation('rec-1')}
      />
    </div>
  );
}

export default App;

