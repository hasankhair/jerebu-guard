import React, { useState } from 'react';
import {
  Wind,
  Droplets,
  Thermometer,
  GraduationCap,
  ShieldCheck,
  AlertTriangle,
  Info,
  ExternalLink,
  RefreshCw,
  Clock,
  Sparkles,
  Share2
} from 'lucide-react';
import { ApimsStation } from '../types';
import { getIpuLevelDetails, HAZE_NEWS_ALERTS } from '../data/hazeData';

interface DashboardTabProps {
  station: ApimsStation;
  onRefresh: () => void;
  onNavigateToTab: (tab: any) => void;
  onOpenAiScanner: () => void;
  lang: 'ms' | 'en';
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  station,
  onRefresh,
  onNavigateToTab,
  onOpenAiScanner,
  lang,
}) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const levelInfo = getIpuLevelDetails(station.ipu);

  const handleRefreshClick = () => {
    setIsRefreshing(true);
    onRefresh();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `[JerebuGuard MY] Bacaan IPU ${station.name}: ${station.ipu} (${station.statusMalay}). Semak status sekolah & keselamatan di https://jerebuguard.my`
      );
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Calculate circular stroke
  const maxIpu = 300;
  const percentage = Math.min(100, Math.round((station.ipu / maxIpu) * 100));
  const strokeDashoffset = 440 - (440 * percentage) / 100;

  return (
    <div className="p-4 space-y-4 pb-6 animate-in fade-in duration-300">
      {/* Top Banner Status & Timestamp */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>{station.lastUpdated}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-1 hover:text-slate-200 transition-colors text-slate-400"
            title="Kongsi Bacaan IPU"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleRefreshClick}
            className={`p-1 hover:text-slate-200 transition-colors text-slate-400 ${
              isRefreshing ? 'animate-spin' : ''
            }`}
            title="Kemaskini Data APIMS"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {copiedLink && (
        <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs px-3 py-1.5 rounded-lg text-center animate-in fade-in">
          Pautan dan bacaan IPU berjaya disalin ke papan klip!
        </div>
      )}

      {/* Main APIMS Circular Gauge Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-5 shadow-xl">
        {/* Ambient background glow based on IPU severity */}
        <div
          className="absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: levelInfo.accentHex }}
        />

        <div className="relative z-10 flex flex-col items-center text-center">
          {/* Circular Gauge Graphic */}
          <div className="relative w-48 h-48 flex items-center justify-center my-2">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              {/* Background Track */}
              <circle
                cx="80"
                cy="80"
                r="70"
                className="stroke-slate-800 fill-none"
                strokeWidth="12"
              />
              {/* Active Progress Ring */}
              <circle
                cx="80"
                cy="80"
                r="70"
                fill="none"
                stroke={levelInfo.accentHex}
                strokeWidth="12"
                strokeDasharray="440"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>

            {/* Center Metric */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                IPU / API
              </span>
              <span className="text-5xl font-extrabold tracking-tighter text-slate-50 my-0.5">
                {station.ipu}
              </span>
              <div
                className="text-xs font-bold px-2 py-0.5 rounded-full border mt-0.5"
                style={{
                  backgroundColor: `${levelInfo.accentHex}20`,
                  color: levelInfo.accentHex,
                  borderColor: `${levelInfo.accentHex}40`,
                }}
              >
                {lang === 'ms' ? station.statusMalay : station.statusEnglish}
              </div>
            </div>
          </div>

          {/* Dominant Pollutant & WHO comparison */}
          <div className="w-full mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-left">
            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <div className="text-[10px] text-slate-400 font-medium">Bahan Pencemar Utama</div>
              <div className="text-sm font-bold text-slate-200 mt-0.5 flex items-center gap-1">
                <span>{station.dominantPollutant}</span>
                <span className="text-xs text-amber-400 font-mono">({station.pm25} µg/m³)</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {(station.pm25 / 15).toFixed(1)}x had panduan WHO (15 µg/m³)
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <div className="text-[10px] text-slate-400 font-medium">PM10 (Habuk Kasar)</div>
              <div className="text-sm font-bold text-slate-200 mt-0.5 font-mono">
                {station.pm10} µg/m³
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Zarah habuk atmosfera boleh disedut
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Official KPM Ministry School Action Protocol Card */}
      <div className={`p-4 rounded-2xl border transition-all ${
        station.ipu > 200
          ? 'bg-rose-950/40 border-rose-800/60 text-rose-200'
          : station.ipu > 100
          ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
          : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl shrink-0 ${
            station.ipu > 100 ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
          }`}>
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                {lang === 'ms' ? 'Pekeliling Sekolah (KPM)' : 'School Ministry Protocol'}
              </h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-black/40 font-mono">
                {station.ipu > 200 ? 'Tutup Serta Merta' : station.ipu > 100 ? 'Gantung Aktiviti Luar' : 'Beroperasi Biasa'}
              </span>
            </div>
            <p className="text-xs mt-1 text-slate-300 leading-relaxed font-medium">
              {levelInfo.schoolAction}
            </p>
            <div className="mt-2 text-[10px] text-slate-400">
              *Rujuk Surat Siaran Kementerian Pendidikan Malaysia No. 1/2019 berkaitan pengurusan jerebu.
            </div>
          </div>
        </div>
      </div>

      {/* Weather & Meteorological Conditions */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col items-center text-center">
          <Thermometer className="w-4 h-4 text-rose-400 mb-1" />
          <span className="text-[10px] text-slate-400">Suhu</span>
          <span className="text-xs font-bold text-slate-100">{station.tempC}°C</span>
          <span className="text-[9px] text-slate-400">Panas Kering</span>
        </div>

        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col items-center text-center">
          <Droplets className="w-4 h-4 text-sky-400 mb-1" />
          <span className="text-[10px] text-slate-400">Kelembapan</span>
          <span className="text-xs font-bold text-slate-100">{station.humidity}%</span>
          <span className="text-[9px] text-slate-400">Tinggi</span>
        </div>

        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col items-center text-center">
          <Wind className="w-4 h-4 text-amber-400 mb-1" />
          <span className="text-[10px] text-slate-400">Angin (Monsun)</span>
          <span className="text-xs font-bold text-slate-100">{station.windSpeedKmH} km/j</span>
          <span className="text-[9px] text-amber-400 font-medium">Barat Daya</span>
        </div>
      </div>

      {/* 12-Hour Hourly Trend Chart */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-200">Trend IPU 12 Jam Terakhir</span>
          <span className="text-[10px] text-slate-400">Stesen {station.name}</span>
        </div>

        <div className="h-28 flex items-end justify-between gap-1.5 pt-4 px-1">
          {station.hourlyHistory.map((val, idx) => {
            const barHeight = Math.max(12, Math.round((val / 200) * 100));
            const isHigh = val > 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1 group relative">
                {/* Tooltip */}
                <div className="absolute -top-7 hidden group-hover:flex bg-slate-800 text-[9px] text-slate-100 px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-20">
                  {val} IPU
                </div>
                <div
                  className={`w-full rounded-t transition-all ${
                    val > 200
                      ? 'bg-rose-500'
                      : isHigh
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ height: `${barHeight}%` }}
                />
                <span className="text-[8px] text-slate-400">
                  {idx % 3 === 0 ? `${idx + 1}h` : ''}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800/60">
          <span>12 jam lalu: {station.hourlyHistory[0]} IPU</span>
          <span className="text-amber-400 font-semibold">Terkini: {station.ipu} IPU (Meningkat)</span>
        </div>
      </div>

      {/* Action shortcuts */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={onOpenAiScanner}
          className="p-3 bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-amber-500/30 rounded-2xl flex items-center gap-2.5 text-left transition-all"
        >
          <div className="p-2 bg-amber-500/20 text-amber-300 rounded-xl shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-amber-300">Imbas Ketumpatan Asap</div>
            <div className="text-[10px] text-slate-400">Analisis foto kamera dengan AI</div>
          </div>
        </button>

        <button
          onClick={() => onNavigateToTab('report')}
          className="p-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-2xl flex items-center gap-2.5 text-left transition-all"
        >
          <div className="p-2 bg-rose-500/20 text-rose-300 rounded-xl shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-rose-300">Aduan Api Terbuka</div>
            <div className="text-[10px] text-slate-400">Hantar terus ke JAS & BOMBA</div>
          </div>
        </button>
      </div>

      {/* Official Government Bulletins */}
      <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <Info className="w-4 h-4 text-emerald-400" />
            <span>Pemberitahuan Rasmi Terkini</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-mono">Disahkan</span>
        </div>

        <div className="space-y-2.5 divide-y divide-slate-800/60">
          {HAZE_NEWS_ALERTS.map((alert) => (
            <div key={alert.id} className="pt-2.5 first:pt-0">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-200">
                <span className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    alert.severity === 'critical' ? 'bg-rose-500' : alert.severity === 'warning' ? 'bg-amber-500' : 'bg-sky-500'
                  }`} />
                  {alert.title}
                </span>
                <span className="text-[9px] text-slate-400">{alert.time}</span>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                {alert.summary}
              </p>
              <div className="mt-1 text-[10px] text-emerald-400/90 font-medium">
                Tindakan: {alert.actionRequired}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
