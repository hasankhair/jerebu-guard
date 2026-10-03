import React from 'react';
import { Gauge, Flame, AlertCircle, HeartPulse, Sparkles } from 'lucide-react';

export type NavTabId = 'dashboard' | 'map' | 'report' | 'health' | 'solutions';

interface BottomNavBarProps {
  activeTab: NavTabId;
  onSelectTab: (tab: NavTabId) => void;
  lang: 'ms' | 'en';
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({ activeTab, onSelectTab, lang }) => {
  const tabs = [
    {
      id: 'dashboard' as NavTabId,
      labelMs: 'Pemantau',
      labelEn: 'Monitor',
      icon: Gauge,
    },
    {
      id: 'map' as NavTabId,
      labelMs: 'Radar & Peta',
      labelEn: 'Radar Map',
      icon: Flame,
    },
    {
      id: 'report' as NavTabId,
      labelMs: 'Aduan Api',
      labelEn: 'Report Fire',
      icon: AlertCircle,
      badge: 'JAS/BOMBA',
    },
    {
      id: 'health' as NavTabId,
      labelMs: 'Kesihatan',
      labelEn: 'Health',
      icon: HeartPulse,
    },
    {
      id: 'solutions' as NavTabId,
      labelMs: 'Solusi',
      labelEn: 'Solutions',
      icon: Sparkles,
    },
  ];

  return (
    <nav className="sticky bottom-0 z-30 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-2 py-1.5 shrink-0">
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const IconComponent = tab.icon;
          const label = lang === 'ms' ? tab.labelMs : tab.labelEn;

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className="group relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all duration-200 cursor-pointer min-w-[56px]"
              aria-label={label}
            >
              {/* Material You 3 Pill Indicator */}
              <div
                className={`relative flex items-center justify-center w-12 h-7 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : 'text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-800/40'
                }`}
              >
                <IconComponent className={`w-4 h-4 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
                {tab.badge && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-slate-950"></span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] mt-0.5 tracking-tight font-medium transition-colors ${
                  isActive ? 'text-emerald-400 font-bold' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
