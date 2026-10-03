import React, { useState } from 'react';
import { AndroidFrame } from './components/AndroidFrame';
import { TopAppBar } from './components/TopAppBar';
import { BottomNavBar, NavTabId } from './components/BottomNavBar';
import { DashboardTab } from './components/DashboardTab';
import { MapTab } from './components/MapTab';
import { ReportTab } from './components/ReportTab';
import { HealthTab } from './components/HealthTab';
import { SolutionsTab } from './components/SolutionsTab';
import { AiScannerModal } from './components/AiScannerModal';
import { APIMS_STATIONS } from './data/hazeData';
import { ApimsStation } from './types';

export default function App() {
  const [stations, setStations] = useState<ApimsStation[]>(APIMS_STATIONS);
  const [selectedStation, setSelectedStation] = useState<ApimsStation>(APIMS_STATIONS[0]);
  const [activeTab, setActiveTab] = useState<NavTabId>('dashboard');
  const [lang, setLang] = useState<'ms' | 'en'>('ms');
  const [isAiScannerOpen, setIsAiScannerOpen] = useState(false);

  const handleRefreshStationData = () => {
    // Simulate updating station readings with slight real-time sensor jitter
    const updated = stations.map((st) => {
      if (st.id === selectedStation.id) {
        const jitter = Math.floor(Math.random() * 3) - 1;
        const newIpu = Math.max(30, st.ipu + jitter);
        return {
          ...st,
          ipu: newIpu,
          lastUpdated: '10:15 AM Baru Dikemaskini (APIMS)',
        };
      }
      return st;
    });
    setStations(updated);
    const curr = updated.find((s) => s.id === selectedStation.id);
    if (curr) setSelectedStation(curr);
  };

  return (
    <AndroidFrame activeIpu={selectedStation.ipu}>
      {/* Top App Bar */}
      <TopAppBar
        currentStation={selectedStation}
        stations={stations}
        onSelectStation={(st) => setSelectedStation(st)}
        onOpenAiScanner={() => setIsAiScannerOpen(true)}
        lang={lang}
        onToggleLang={() => setLang(lang === 'ms' ? 'en' : 'ms')}
      />

      {/* Main Tab Screen Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'dashboard' && (
          <DashboardTab
            station={selectedStation}
            onRefresh={handleRefreshStationData}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onOpenAiScanner={() => setIsAiScannerOpen(true)}
            lang={lang}
          />
        )}

        {activeTab === 'map' && (
          <MapTab
            stations={stations}
            selectedStation={selectedStation}
            onSelectStation={(st) => setSelectedStation(st)}
            lang={lang}
          />
        )}

        {activeTab === 'report' && <ReportTab lang={lang} />}

        {activeTab === 'health' && (
          <HealthTab currentStation={selectedStation} lang={lang} />
        )}

        {activeTab === 'solutions' && <SolutionsTab lang={lang} />}
      </div>

      {/* Bottom Material 3 Navigation Bar */}
      <BottomNavBar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        lang={lang}
      />

      {/* AI Smoke Scanner Modal (Gemini 3.8 Flash) */}
      <AiScannerModal
        isOpen={isAiScannerOpen}
        onClose={() => setIsAiScannerOpen(false)}
        currentStation={selectedStation}
        lang={lang}
      />
    </AndroidFrame>
  );
}
