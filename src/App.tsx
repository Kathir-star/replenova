import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Layout } from './components/layout/Layout';
import { CommandCenter } from './pages/CommandCenter';
import { Inventory } from './pages/Inventory';
import { Disruptions } from './pages/Disruptions';
import { SupplyNetwork } from './pages/SupplyNetwork';
import { Replenishment } from './pages/Replenishment';
import { AIActions } from './pages/AIActions';
import { ScenarioSimulator } from './pages/ScenarioSimulator';
import { Analytics } from './pages/Analytics';
import { Settings } from './pages/Settings';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<CommandCenter />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="disruptions" element={<Disruptions />} />
            <Route path="network" element={<SupplyNetwork />} />
            <Route path="replenishment" element={<Replenishment />} />
            <Route path="ai-actions" element={<AIActions />} />
            <Route path="simulator" element={<ScenarioSimulator />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
