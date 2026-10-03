import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal, Smartphone, Maximize2, Minimize2, Bell, AlertTriangle } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  activeIpu: number;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children, activeIpu }) => {
  const [currentTime, setCurrentTime] = useState('09:41');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-0 md:p-6 text-slate-100 selection:bg-amber-500 selection:text-slate-950">
      {/* Top Desktop Controls Bar */}
      <aside aria-label="Desktop Controls" className="hidden md:flex items-center justify-between w-full max-w-[440px] mb-3 px-2 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span className="font-medium text-slate-300">Android 15 · Material 3</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded border border-slate-700/50 transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Mod Telefon' : 'Skrin Penuh'}</span>
          </button>
        </div>
      </aside>

      {/* Main Container - Android Phone Simulator or Fullscreen Webview */}
      <div
        className={`w-full transition-all duration-300 relative flex flex-col bg-slate-900 ${
          isFullscreen
            ? 'max-w-4xl h-[94vh] rounded-2xl shadow-2xl border border-slate-800 overflow-hidden'
            : 'max-w-[420px] h-[100dvh] md:h-[880px] md:rounded-[44px] md:border-[10px] md:border-slate-800 md:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] overflow-hidden'
        }`}
      >
        {/* Android Punch Hole Camera (on Phone Frame) */}
        {!isFullscreen && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-50 pointer-events-none hidden md:flex items-center justify-center">
            <div className="w-3.5 h-3.5 bg-black rounded-full border border-slate-700/40"></div>
          </div>
        )}

        {/* Android Status Bar */}
        <header className="relative z-40 px-5 pt-2.5 pb-1 flex items-center justify-between bg-slate-950/70 backdrop-blur-md border-b border-slate-800/40 text-[11px] font-medium text-slate-300 shrink-0">
          <div className="flex items-center gap-2">
            <span>{currentTime}</span>
            {activeIpu > 100 && (
              <button
                onClick={() => setShowNotificationDrawer(!showNotificationDrawer)}
                className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/50 hover:bg-amber-900/60 transition-colors"
                title="Pemberitahuan Jerebu Aktif"
              >
                <AlertTriangle className="w-3 h-3 animate-pulse" />
                <span>IPU {activeIpu}</span>
              </button>
            )}
          </div>
          <div className="flex items-center gap-2.5">
            <Signal className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-[10px] font-mono text-emerald-400">5G</span>
            <Wifi className="w-3.5 h-3.5 text-slate-300" />
            <div className="flex items-center gap-0.5">
              <span>94%</span>
              <BatteryMedium className="w-4 h-4 text-emerald-400" />
            </div>
          </div>
        </header>

        {/* Android Quick Notification Drawer (collapsible) */}
        {showNotificationDrawer && (
          <div className="absolute top-10 left-0 right-0 z-50 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 p-4 shadow-xl text-xs animate-in slide-in-from-top duration-200">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
              <div className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Bell className="w-3.5 h-3.5" />
                <span>Pusat Pemberitahuan Jerebu Malaysia</span>
              </div>
              <button
                onClick={() => setShowNotificationDrawer(false)}
                className="text-slate-400 hover:text-slate-200 text-xs px-2 py-0.5"
              >
                Tutup
              </button>
            </div>
            <div className="space-y-2">
              <div className="p-2.5 bg-amber-950/40 border border-amber-900/40 rounded-lg">
                <div className="flex items-center justify-between text-amber-300 font-medium">
                  <span>Amaran APIMS JAS</span>
                  <span className="text-[10px] text-slate-400">Baru tadi</span>
                </div>
                <p className="text-slate-300 mt-1 text-[11px] leading-relaxed">
                  Bacaan IPU semasa mencecah <strong className="text-amber-300">{activeIpu} (Tidak Sihat)</strong>. Disyorkan memakai topeng N95 di luar rumah dan batalkan riadah terbuka.
                </p>
              </div>
              <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-300 text-[11px]">
                <span>Pekeliling KPM: Semua aktiviti sukan & perhimpunan luar bilik darjah dibatalkan bagi daerah terjejas.</span>
              </div>
            </div>
          </div>
        )}

        {/* App Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative flex flex-col bg-slate-950">
          {children}
        </main>

        {/* Android Navigation Gesture Bar / 3-Button Bar at Bottom */}
        <footer className="h-6 bg-slate-950 flex items-center justify-center shrink-0 border-t border-slate-900/60 z-30">
          <div className="w-32 h-1 bg-slate-600 rounded-full hover:bg-slate-400 transition-colors"></div>
        </footer>
      </div>
    </div>
  );
};
