import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { MobileNav } from './MobileNav';
import { DemoStoryTour } from '../dashboard/DemoStoryTour';
import { AICopilotDrawer } from '../dashboard/AICopilotDrawer';

export const Layout: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-[#050505] text-[#D1D1D1] font-sans antialiased overflow-x-hidden">
      {/* Persistent Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 lg:pb-0">
        <TopNav />
        <main className="flex-1 p-3 sm:p-5 md:p-6 max-w-[1700px] w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />

      {/* Guided Tour Banner / Overlay */}
      <DemoStoryTour />

      {/* AI Copilot Drawer */}
      <AICopilotDrawer />
    </div>
  );
};
