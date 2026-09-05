import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  InventoryItem,
  Warehouse,
  Supplier,
  Factory,
  ActiveShipment,
  SupplyRoute,
  PortHub,
  DisruptionEvent,
  ReplenishmentRecommendation,
  AIAction,
  NotificationItem,
  CopilotMessage,
  MapSelectedEntity,
  RiskLevel
} from '../types/index';

import { demoInventoryItems } from '../data/demoInventory';
import { demoSuppliers, demoFactories } from '../data/demoSuppliers';
import { demoWarehouses, demoPorts } from '../data/demoWarehouses';
import { demoShipments } from '../data/demoShipments';
import { demoRoutes } from '../data/demoRoutes';
import {
  demoDisruptions,
  demoReplenishmentRecommendations,
  demoAIActions,
  demoStorySteps
} from '../data/demoDisruptions';
import { evaluateSupplyChainRisk } from '../lib/riskEngine';

interface AppContextType {
  inventory: InventoryItem[];
  suppliers: Supplier[];
  factories: Factory[];
  warehouses: Warehouse[];
  ports: PortHub[];
  shipments: ActiveShipment[];
  routes: SupplyRoute[];
  disruptions: DisruptionEvent[];
  recommendations: ReplenishmentRecommendation[];
  aiActions: AIAction[];
  
  // Selection States
  selectedEntity: MapSelectedEntity | null;
  setSelectedEntity: (entity: MapSelectedEntity | null) => void;
  selectedDisruption: DisruptionEvent;
  setSelectedDisruption: (disruption: DisruptionEvent) => void;
  selectedSku: string | null;
  setSelectedSku: (sku: string | null) => void;

  // Demo Tour State
  demoTourActive: boolean;
  setDemoTourActive: (active: boolean) => void;
  demoTourStep: number;
  setDemoTourStep: (step: number) => void;
  nextDemoTourStep: () => void;
  prevDemoTourStep: () => void;

  // Copilot Drawer
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  copilotMessages: CopilotMessage[];
  addCopilotMessage: (msg: CopilotMessage) => void;

  // Global Filter / Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filterRiskLevel: string;
  setFilterRiskLevel: (level: string) => void;

  // Notifications
  notifications: NotificationItem[];
  unreadCount: number;
  markNotificationsAsRead: () => void;

  // Actions
  approveRecommendation: (id: string) => void;
  simulateRecommendation: (id: string) => void;
  approveAIAction: (id: string) => void;
  executeEmergencyReallocation: () => void;
  resetDemoData: () => void;

  // Computed KPIs
  kpis: {
    overallRiskScore: number;
    activeDisruptionsCount: number;
    stockoutsPreventedCount: number;
    inventoryAtRiskInr: number;
    criticalSkusCount: number;
    onTimeDeliveryPct: number;
  };
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>(demoInventoryItems);
  const [suppliers] = useState<Supplier[]>(demoSuppliers);
  const [factories] = useState<Factory[]>(demoFactories);
  const [warehouses] = useState<Warehouse[]>(demoWarehouses);
  const [ports] = useState<PortHub[]>(demoPorts);
  const [shipments, setShipments] = useState<ActiveShipment[]>(demoShipments);
  const [routes, setRoutes] = useState<SupplyRoute[]>(demoRoutes);
  const [disruptions] = useState<DisruptionEvent[]>(demoDisruptions);
  const [recommendations, setRecommendations] = useState<ReplenishmentRecommendation[]>(demoReplenishmentRecommendations);
  const [aiActions, setAiActions] = useState<AIAction[]>(demoAIActions);

  // Selection
  const [selectedEntity, setSelectedEntity] = useState<MapSelectedEntity | null>({
    type: 'weather',
    data: demoDisruptions[0],
  });
  const [selectedDisruption, setSelectedDisruption] = useState<DisruptionEvent>(demoDisruptions[0]);
  const [selectedSku, setSelectedSku] = useState<string | null>('MCU-X1');

  // Guided Tour
  const [demoTourActive, setDemoTourActive] = useState<boolean>(false);
  const [demoTourStep, setDemoTourStep] = useState<number>(1);

  // AI Copilot
  const [copilotOpen, setCopilotOpen] = useState<boolean>(false);
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: 'Good morning. REPLENOVA AI is actively tracking 10 global supply chain corridors. **Cyclone Mandous** in the Bay of Bengal has halted Chennai port berthing, elevating stockout probability to **87%** for SKU **MCU-X1**.',
      timestamp: 'Just now',
      suggestedActions: [
        { label: 'View Cyclone Impact Chain', actionTab: 'command-center' },
        { label: 'Review Mitigation Strategy', actionTab: 'replenishment' },
        { label: 'Run Scenario Simulator', actionTab: 'simulator' }
      ]
    }
  ]);

  // Search and Filter
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterRiskLevel, setFilterRiskLevel] = useState<string>('all');

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n-1',
      level: 'critical',
      title: 'Cyclone Mandous Maritime Alert',
      message: 'Category 3 storm in Bay of Bengal: Port of Chennai crane operations suspended. 14 shipments delayed.',
      timestamp: '10m ago',
      linkTab: 'disruptions',
      skuTarget: 'MCU-X1',
      read: false
    },
    {
      id: 'n-2',
      level: 'critical',
      title: 'Stockout Risk Alert: MCU-X1',
      message: '6.8 days of supply remaining at Chennai Central Depot. Stockout probability increased to 87%.',
      timestamp: '25m ago',
      linkTab: 'inventory',
      skuTarget: 'MCU-X1',
      read: false
    },
    {
      id: 'n-3',
      level: 'elevated',
      title: 'AI Recommendation Generated',
      message: 'Multi-echelon transfer of 1,200 units from Bengaluru Hub ready for approval.',
      timestamp: '40m ago',
      linkTab: 'replenishment',
      skuTarget: 'MCU-X1',
      read: false
    }
  ]);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const addCopilotMessage = (msg: CopilotMessage) => {
    setCopilotMessages(prev => [...prev, msg]);
  };

  // Actions
  const approveRecommendation = (id: string) => {
    setRecommendations(prev =>
      prev.map(rec => {
        if (rec.id === id) {
          return { ...rec, status: 'approved' };
        }
        return rec;
      })
    );

    // If MCU-X1 recommendation is approved, update inventory health
    const targetRec = recommendations.find(r => r.id === id);
    if (targetRec && targetRec.sku === 'MCU-X1') {
      executeEmergencyReallocation();
    }
  };

  const simulateRecommendation = (id: string) => {
    setRecommendations(prev =>
      prev.map(rec => {
        if (rec.id === id) {
          return { ...rec, status: 'simulated' };
        }
        return rec;
      })
    );
  };

  const approveAIAction = (id: string) => {
    setAiActions(prev =>
      prev.map(act => {
        if (act.id === id) {
          return { ...act, status: 'approved' };
        }
        return act;
      })
    );

    if (id === 'act-1' || id === 'act-2') {
      executeEmergencyReallocation();
    }
  };

  const executeEmergencyReallocation = () => {
    // Dynamically adjust SKU MCU-X1 metrics reflecting successful mitigation
    setInventory(prev =>
      prev.map(item => {
        if (item.sku === 'MCU-X1') {
          return {
            ...item,
            currentStock: item.currentStock + 1200,
            stockoutProbability: 13,
            riskLevel: 'healthy',
            daysOfSupply: 14.2,
            expectedStockoutDays: 14,
            revenueExposureInr: 860000,
            aiRecommendation: 'Mitigation executed: 1,200 units transferred from Bengaluru; 2,500 units air express initiated.',
            status: 'Optimal'
          };
        }
        return item;
      })
    );

    // Add visual shipment for the emergency convoy
    setShipments(prev => {
      const exists = prev.some(s => s.id === 'shp-4527');
      if (exists) return prev;
      return [...prev];
    });

    // Add notification
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        level: 'healthy',
        title: 'Emergency Mitigation Executed',
        message: 'Reallocation order #ORD-7821 dispatched. Stockout probability for MCU-X1 reduced to 13%. ₹45.6L loss prevented.',
        timestamp: 'Just now',
        linkTab: 'inventory',
        skuTarget: 'MCU-X1',
        read: false
      },
      ...prev
    ]);
  };

  const resetDemoData = () => {
    setInventory(demoInventoryItems);
    setShipments(demoShipments);
    setRoutes(demoRoutes);
    setRecommendations(demoReplenishmentRecommendations);
    setAiActions(demoAIActions);
    setSelectedEntity({ type: 'weather', data: demoDisruptions[0] });
    setSelectedDisruption(demoDisruptions[0]);
    setSelectedSku('MCU-X1');
  };

  const nextDemoTourStep = () => {
    if (demoTourStep < demoStorySteps.length) {
      setDemoTourStep(prev => prev + 1);
    } else {
      setDemoTourActive(false);
    }
  };

  const prevDemoTourStep = () => {
    if (demoTourStep > 1) {
      setDemoTourStep(prev => prev - 1);
    }
  };

  // Synchronize tour step with map selection
  useEffect(() => {
    if (!demoTourActive) return;
    if (demoTourStep === 1) {
      setSelectedEntity({ type: 'weather', data: demoDisruptions[0] });
    } else if (demoTourStep === 2) {
      const shp = shipments.find(s => s.id === 'shp-4521');
      if (shp) setSelectedEntity({ type: 'shipment', data: shp });
    } else if (demoTourStep === 3) {
      const wh = warehouses.find(w => w.id === 'wh-1');
      if (wh) setSelectedEntity({ type: 'warehouse', data: wh });
    } else if (demoTourStep === 4) {
      const rec = recommendations[0];
      if (rec) setSelectedEntity({ type: 'product', data: demoInventoryItems[0] });
    }
  }, [demoTourStep, demoTourActive]);

  // Computed KPIs
  const kpis = useMemo(() => {
    const criticalCount = inventory.filter(i => i.riskLevel === 'critical').length;
    const elevatedCount = inventory.filter(i => i.riskLevel === 'elevated').length;
    const totalRiskScore = Math.round((criticalCount * 35 + elevatedCount * 18 + 18.7) / (inventory.length || 1) * 3.5);
    const atRiskExposure = inventory.reduce((sum, item) => sum + (item.riskLevel === 'critical' || item.riskLevel === 'elevated' ? item.revenueExposureInr : 0), 0);

    return {
      overallRiskScore: Math.min(100, Math.max(12, totalRiskScore)),
      activeDisruptionsCount: disruptions.filter(d => d.severity === 'critical' || d.severity === 'elevated').length,
      stockoutsPreventedCount: 23,
      inventoryAtRiskInr: atRiskExposure || 4280000,
      criticalSkusCount: criticalCount,
      onTimeDeliveryPct: 91.4,
    };
  }, [inventory, disruptions]);

  return (
    <AppContext.Provider
      value={{
        inventory,
        suppliers,
        factories,
        warehouses,
        ports,
        shipments,
        routes,
        disruptions,
        recommendations,
        aiActions,
        selectedEntity,
        setSelectedEntity,
        selectedDisruption,
        setSelectedDisruption,
        selectedSku,
        setSelectedSku,
        demoTourActive,
        setDemoTourActive,
        demoTourStep,
        setDemoTourStep,
        nextDemoTourStep,
        prevDemoTourStep,
        copilotOpen,
        setCopilotOpen,
        copilotMessages,
        addCopilotMessage,
        searchQuery,
        setSearchQuery,
        filterRiskLevel,
        setFilterRiskLevel,
        notifications,
        unreadCount,
        markNotificationsAsRead,
        approveRecommendation,
        simulateRecommendation,
        approveAIAction,
        executeEmergencyReallocation,
        resetDemoData,
        kpis,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextType {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
