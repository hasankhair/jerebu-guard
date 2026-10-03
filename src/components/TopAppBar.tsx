import React, { useState } from 'react';
import { MapPin, PhoneCall, Sparkles, ChevronDown, Check, Compass, ShieldAlert } from 'lucide-react';
import { ApimsStation } from '../types';

interface TopAppBarProps {
  currentStation: ApimsStation;
  stations: ApimsStation[];
  onSelectStation: (station: ApimsStation) => void;
  onOpenAiScanner: () => void;
  lang: 'ms' | 'en';
  onToggleLang: () => void;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  currentStation,
  stations,
  onSelectStation,
  onOpenAiScanner,
  lang,
  onToggleLang,
}) => {
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const filteredStations = stations.filter(
    (s) =>
      s.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      s.state.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-2.5">
      <div className="flex items-center justify-between gap-2">
        {/* Location Dropdown Trigger */}
        <button
          onClick={() => setShowLocationPicker(true)}
          className="flex items-center gap-1.5 text-left bg-slate-900/90 hover:bg-slate-850 px-2.5 py-1.5 rounded-xl border border-slate-800 transition-all text-slate-100 max-w-[210px] cursor-pointer group"
          aria-label="Tukar Lokasi Stesen APIMS"
        >
          <MapPin className="w-4 h-4 text-emerald-400 shrink-0 group-hover:animate-bounce" />
          <div className="min-w-0 flex-1">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold leading-tight">
              {currentStation.state}
            </div>
            <div className="text-xs font-bold text-slate-100 truncate">
              {currentStation.name}
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* AI Scanner Button */}
          <button
            onClick={onOpenAiScanner}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer"
            title="Imbas Ketumpatan Asap Menggunakan Kamera & AI"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span className="hidden sm:inline">Imbas AI</span>
            <span className="sm:hidden">AI</span>
          </button>

          {/* SOS Hotlines Button */}
          <button
            onClick={() => setShowEmergencyModal(true)}
            className="p-1.5 bg-rose-500/15 hover:bg-rose-500/25 text-rose-400 border border-rose-500/30 rounded-xl transition-colors cursor-pointer"
            title="Talian Kecemasan Jerebu & Bomba"
            aria-label="Talian Kecemasan"
          >
            <PhoneCall className="w-4 h-4" />
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLang}
            className="px-2 py-1 bg-slate-800/80 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px] font-bold border border-slate-700/60 transition-colors"
          >
            {lang === 'ms' ? 'BM' : 'EN'}
          </button>
        </div>
      </div>

      {/* Location Picker Sheet Modal */}
      {showLocationPicker && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md max-h-[85vh] rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-5 duration-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-slate-100">
                  {lang === 'ms' ? 'Pilih Stesen APIMS Malaysia' : 'Select APIMS Malaysia Station'}
                </h2>
                <p className="text-[11px] text-slate-400">
                  {lang === 'ms' ? 'Berdasarkan Sistem Pengurusan Indeks Pencemaran Udara (JAS)' : 'Real-time Department of Environment Stations'}
                </p>
              </div>
              <button
                onClick={() => setShowLocationPicker(false)}
                className="text-xs text-slate-400 hover:text-slate-200 p-1.5 rounded-lg bg-slate-800"
              >
                Tutup
              </button>
            </div>

            {/* Search Input */}
            <div className="p-3 border-b border-slate-800/60 bg-slate-950/40">
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder={lang === 'ms' ? 'Cari nama bandar / negeri...' : 'Search city or state...'}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* GPS Auto-detect button */}
            <div className="px-3 pt-2">
              <button
                onClick={() => {
                  // Simulate GPS locking to nearest highest station
                  const peatZone = stations.find((s) => s.id === 'my-sel-02') || stations[0];
                  onSelectStation(peatZone);
                  setShowLocationPicker(false);
                }}
                className="w-full flex items-center justify-center gap-2 p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold transition-colors"
              >
                <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
                <span>{lang === 'ms' ? 'Gunakan GPS Lokasi Semasa (Automatik)' : 'Detect Nearest Station via GPS'}</span>
              </button>
            </div>

            {/* Station List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 divide-y divide-slate-800/40">
              {filteredStations.map((station) => {
                const isSelected = station.id === currentStation.id;
                const isHigh = station.ipu > 100;
                return (
                  <button
                    key={station.id}
                    onClick={() => {
                      onSelectStation(station);
                      setShowLocationPicker(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors pt-2.5 ${
                      isSelected
                        ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-200'
                        : 'hover:bg-slate-800/70 text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{
                        backgroundColor: station.ipu <= 50 ? '#10b981' : station.ipu <= 100 ? '#0ea5e9' : station.ipu <= 200 ? '#f59e0b' : '#ef4444'
                      }} />
                      <div>
                        <div className="text-xs font-bold flex items-center gap-1.5">
                          {station.name}
                          {station.id === 'my-sel-02' && (
                            <span className="text-[9px] bg-red-950 text-red-400 px-1 rounded border border-red-800">
                              Zon Gambut
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {station.state} · PM2.5: {station.pm25} µg/m³
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div className={`text-xs font-extrabold ${
                          isHigh ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          IPU {station.ipu}
                        </div>
                        <div className="text-[9px] text-slate-400">
                          {station.statusMalay}
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-emerald-400 shrink-0" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Emergency Hotlines Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <ShieldAlert className="w-4 h-4" />
                <span>Talian Bantuan Kecemasan Jerebu</span>
              </div>
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <a
                href="tel:999"
                className="flex items-center justify-between p-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-300 transition-colors"
              >
                <div>
                  <div className="font-bold text-slate-100">BOMBA & Penyelamat Malaysia</div>
                  <div className="text-[11px] text-slate-400">Kebakaran tanah gambut & kecemasan api</div>
                </div>
                <div className="px-2.5 py-1 bg-rose-500 text-white font-mono font-bold rounded-lg text-xs">
                  999
                </div>
              </a>

              <a
                href="tel:1800882727"
                className="flex items-center justify-between p-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-300 transition-colors"
              >
                <div>
                  <div className="font-bold text-slate-100">Jabatan Alam Sekitar (JAS)</div>
                  <div className="text-[11px] text-slate-400">Talian Bebas Tol Aduan Pembakaran Terbuka</div>
                </div>
                <div className="px-2 py-1 bg-amber-500/30 text-amber-300 font-mono font-bold rounded-lg text-[11px]">
                  1-800-88-2727
                </div>
              </a>

              <a
                href="tel:0388832000"
                className="flex items-center justify-between p-3 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 rounded-xl text-sky-300 transition-colors"
              >
                <div>
                  <div className="font-bold text-slate-100">Kementerian Kesihatan Malaysia (KKM)</div>
                  <div className="text-[11px] text-slate-400">Nasihat kesihatan & rawatan kecemasan asma</div>
                </div>
                <div className="px-2 py-1 bg-sky-500/30 text-sky-300 font-mono font-bold rounded-lg text-[11px]">
                  CPRC KKM
                </div>
              </a>
            </div>

            <p className="text-[10px] text-slate-400 text-center leading-relaxed">
              Di bawah Seksyen 29A Akta Kualiti Alam Sekeliling 1974, pembakaran terbuka boleh didenda sehingga RM500,000 atau penjara sehingga 5 tahun.
            </p>

            <button
              onClick={() => setShowEmergencyModal(false)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
            >
              Kembali
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
