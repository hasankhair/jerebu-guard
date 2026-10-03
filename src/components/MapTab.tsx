import React, { useState } from 'react';
import {
  Flame,
  Wind,
  Layers,
  MapPin,
  Compass,
  AlertCircle,
  Eye,
  Info,
  Radio,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { ApimsStation, Hotspot } from '../types';
import { SATELLITE_HOTSPOTS } from '../data/hazeData';

interface MapTabProps {
  stations: ApimsStation[];
  selectedStation: ApimsStation;
  onSelectStation: (station: ApimsStation) => void;
  lang: 'ms' | 'en';
}

export const MapTab: React.FC<MapTabProps> = ({
  stations,
  selectedStation,
  onSelectStation,
  lang,
}) => {
  const [showHotspots, setShowHotspots] = useState(true);
  const [showSmokePlume, setShowSmokePlume] = useState(true);
  const [showWindVectors, setShowWindVectors] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [activeRegionFilter, setActiveRegionFilter] = useState<'All' | 'Peninsular' | 'Borneo'>('All');

  // Convert real lat/lng to SVG coordinate bounding box:
  // Malaysia & Sumatra region: Lat -4 to 8, Lng 95 to 119
  const mapWidth = 600;
  const mapHeight = 420;

  const projectCoords = (lat: number, lng: number) => {
    // Lat range: 8 (top) to -4 (bottom) -> span 12
    // Lng range: 97 (left) to 119 (right) -> span 22
    const minLat = -4;
    const maxLat = 8;
    const minLng = 97;
    const maxLng = 120;

    const x = ((lng - minLng) / (maxLng - minLng)) * mapWidth;
    const y = ((maxLat - lat) / (maxLat - minLat)) * mapHeight;
    return { x, y };
  };

  const currentStationCoords = projectCoords(selectedStation.lat, selectedStation.lng);

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100">
      {/* Top Map Layer Controls */}
      <div className="p-3 bg-slate-900/90 border-b border-slate-800 space-y-2 shrink-0">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 font-bold text-slate-200">
            <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            <span>Radar Satelit & Titik Panas ASMC</span>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">
            Satelit NOAA-20 / VIIRS
          </span>
        </div>

        {/* Toggleable Layer Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
          <button
            onClick={() => setShowHotspots(!showHotspots)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all ${
              showHotspots
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/40'
            }`}
          >
            <Flame className="w-3 h-3" />
            <span>Titik Panas ({SATELLITE_HOTSPOTS.length})</span>
          </button>

          <button
            onClick={() => setShowSmokePlume(!showSmokePlume)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all ${
              showSmokePlume
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/40'
            }`}
          >
            <Layers className="w-3 h-3" />
            <span>Kepulan Asap</span>
          </button>

          <button
            onClick={() => setShowWindVectors(!showWindVectors)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-all ${
              showWindVectors
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/40'
            }`}
          >
            <Wind className="w-3 h-3" />
            <span>Angin Monsun SW</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Map Canvas */}
      <div className="relative flex-1 bg-slate-950 overflow-hidden flex items-center justify-center p-2">
        <svg
          viewBox={`0 0 ${mapWidth} ${mapHeight}`}
          className="w-full h-auto max-h-[460px] select-none rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-inner"
        >
          <defs>
            {/* Haze Smoke Gradient */}
            <radialGradient id="smokePlumeGradient" cx="20%" cy="80%" r="90%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
              <stop offset="50%" stopColor="#d97706" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#78350f" stopOpacity="0.0" />
            </radialGradient>

            <radialGradient id="sarawakPlumeGradient" cx="30%" cy="70%" r="80%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#78350f" stopOpacity="0.0" />
            </radialGradient>

            {/* Fire glow filter */}
            <filter id="fireGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Sea / Background Grids */}
          <rect width={mapWidth} height={mapHeight} fill="#090d16" />
          <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#1e293b" strokeWidth="0.5" strokeOpacity="0.4" />
          </pattern>
          <rect width={mapWidth} height={mapHeight} fill="url(#grid)" />

          {/* Land Mass Outlines (Simplified accurate land geometry for Peninsular Malaysia, Sumatra, Borneo) */}
          
          {/* 1. Sumatra (Indonesia) */}
          <path
            d="M 20 180 Q 70 230 110 270 Q 150 320 220 380 Q 240 400 200 410 Q 140 370 70 300 Q 10 220 20 180 Z"
            fill="#131b2e"
            stroke="#334155"
            strokeWidth="1.5"
          />
          <text x="80" y="320" fill="#475569" fontSize="10" fontWeight="bold" letterSpacing="2">
            SUMATERA (INDONESIA)
          </text>

          {/* 2. Straits of Malacca (Selat Melaka label) */}
          <text x="100" y="195" fill="#334155" fontSize="8" fontStyle="italic" transform="rotate(-30, 100, 195)">
            Selat Melaka
          </text>

          {/* 3. Peninsular Malaysia */}
          <path
            d="M 90 90 L 115 80 L 135 110 L 155 145 L 180 170 L 185 200 L 175 220 L 150 215 L 130 180 L 110 150 L 95 110 Z"
            fill="#1e293b"
            stroke="#475569"
            strokeWidth="1.5"
          />
          <text x="125" y="130" fill="#64748b" fontSize="9" fontWeight="bold">
            SEMENANJUNG
          </text>
          <text x="130" y="142" fill="#64748b" fontSize="8">
            MALAYSIA
          </text>

          {/* 4. Borneo - Sarawak & Sabah */}
          <path
            d="M 330 250 Q 370 235 410 215 Q 460 185 500 145 Q 520 120 535 140 Q 550 175 520 205 Q 470 240 420 270 Q 360 290 330 250 Z"
            fill="#1e293b"
            stroke="#475569"
            strokeWidth="1.5"
          />
          <text x="380" y="240" fill="#64748b" fontSize="9" fontWeight="bold">
            SARAWAK
          </text>
          <text x="495" y="155" fill="#64748b" fontSize="9" fontWeight="bold">
            SABAH
          </text>

          {/* 5. Kalimantan (Indonesia) */}
          <path
            d="M 330 252 Q 360 290 420 272 Q 470 300 480 370 Q 400 400 340 370 Q 310 320 330 252 Z"
            fill="#131b2e"
            stroke="#334155"
            strokeWidth="1.5"
          />
          <text x="350" y="340" fill="#475569" fontSize="9" fontWeight="bold" letterSpacing="1">
            KALIMANTAN (INDONESIA)
          </text>

          {/* Smoke Plumes Overlay (Transboundary dispersion across Straits of Malacca into Klang Valley) */}
          {showSmokePlume && (
            <g className="transition-opacity duration-700 animate-haze-pulse">
              {/* Plume 1: Sumatra to Klang Valley / Straits of Malacca */}
              <ellipse
                cx="135"
                cy="190"
                rx="65"
                ry="45"
                transform="rotate(-35, 135, 190)"
                fill="url(#smokePlumeGradient)"
              />
              <path
                d="M 100 240 Q 120 200 150 170 Q 160 150 130 140 Q 90 190 100 240 Z"
                fill="#f59e0b"
                opacity="0.18"
              />

              {/* Plume 2: West Kalimantan into Kuching & Sri Aman */}
              <ellipse
                cx="355"
                cy="255"
                rx="45"
                ry="35"
                transform="rotate(-20, 355, 255)"
                fill="url(#sarawakPlumeGradient)"
              />
            </g>
          )}

          {/* Wind Direction Arrows (Southwest Monsoon) */}
          {showWindVectors && (
            <g stroke="#38bdf8" strokeWidth="1.5" opacity="0.6">
              {/* Vector arrows pointing North-East */}
              <g transform="translate(60, 230) rotate(-45)">
                <line x1="0" y1="0" x2="22" y2="0" strokeDasharray="3 2" />
                <polygon points="22,0 16,-3 16,3" fill="#38bdf8" />
              </g>
              <g transform="translate(100, 260) rotate(-40)">
                <line x1="0" y1="0" x2="26" y2="0" strokeDasharray="3 2" />
                <polygon points="26,0 20,-3 20,3" fill="#38bdf8" />
              </g>
              <g transform="translate(120, 180) rotate(-45)">
                <line x1="0" y1="0" x2="24" y2="0" strokeDasharray="3 2" />
                <polygon points="24,0 18,-3 18,3" fill="#38bdf8" />
              </g>
              <g transform="translate(320, 280) rotate(-60)">
                <line x1="0" y1="0" x2="20" y2="0" strokeDasharray="3 2" />
                <polygon points="20,0 14,-3 14,3" fill="#38bdf8" />
              </g>
              <text x="45" y="270" fill="#38bdf8" fontSize="8" fontWeight="600">
                Monsun Barat Daya (SW) 14-18 km/j
              </text>
            </g>
          )}

          {/* Satellite Hotspots (Fire Markers) */}
          {showHotspots &&
            SATELLITE_HOTSPOTS.map((hotspot) => {
              const coords = projectCoords(hotspot.lat, hotspot.lng);
              const isSelected = selectedHotspot?.id === hotspot.id;

              return (
                <g
                  key={hotspot.id}
                  className="cursor-pointer group"
                  onClick={() => setSelectedHotspot(hotspot)}
                >
                  {/* Outer pulsating ring for active fire */}
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={isSelected ? 10 : 7}
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="1.5"
                    className="animate-ping"
                    opacity="0.8"
                    style={{ animationDuration: '2.5s' }}
                  />
                  {/* Core hotspot dot */}
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r={isSelected ? 6 : 4.5}
                    fill="#ef4444"
                    filter="url(#fireGlow)"
                  />
                  {/* Fire Flame Icon */}
                  <text
                    x={coords.x - 4}
                    y={coords.y + 4}
                    fontSize="9"
                    className="pointer-events-none select-none"
                  >
                    🔥
                  </text>
                </g>
              );
            })}

          {/* APIMS Stations Pins */}
          {stations.map((st) => {
            const coords = projectCoords(st.lat, st.lng);
            const isSelected = st.id === selectedStation.id;
            const color =
              st.ipu <= 50 ? '#10b981' : st.ipu <= 100 ? '#0ea5e9' : st.ipu <= 200 ? '#f59e0b' : '#ef4444';

            return (
              <g
                key={st.id}
                className="cursor-pointer"
                onClick={() => {
                  onSelectStation(st);
                  setSelectedHotspot(null);
                }}
              >
                {/* Ping ring for selected station */}
                {isSelected && (
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r="12"
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                )}

                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r={isSelected ? 6 : 4.5}
                  fill={color}
                  stroke="#0f172a"
                  strokeWidth="1.5"
                />

                {/* Station Tag if selected or unhealthy */}
                {(isSelected || st.ipu > 140) && (
                  <g transform={`translate(${coords.x + 6}, ${coords.y - 4})`}>
                    <rect
                      x="0"
                      y="-10"
                      width="52"
                      height="14"
                      rx="3"
                      fill="#0f172a"
                      stroke={color}
                      strokeWidth="1"
                    />
                    <text x="3" y="0" fill="#f8fafc" fontSize="8" fontWeight="bold">
                      {st.name.substring(0, 7)}: {st.ipu}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Floating Legend Box on Bottom Left */}
        <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2.5 rounded-xl text-[10px] space-y-1 shadow-lg pointer-events-none">
          <div className="font-bold text-slate-300">Petunjuk IPU Malaysia</div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>0-50 Baik</span>
            <span className="w-2 h-2 rounded-full bg-sky-500 ml-1"></span>
            <span>51-100 Sederhana</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span>101-200 Tidak Sihat</span>
            <span className="w-2 h-2 rounded-full bg-rose-500 ml-1"></span>
            <span>&gt;200 Sangat Bahaya</span>
          </div>
        </div>
      </div>

      {/* Selected Hotspot / Station Details Sheet */}
      {selectedHotspot ? (
        <div className="p-3.5 bg-slate-900 border-t border-slate-800 space-y-2 shrink-0 animate-in slide-in-from-bottom duration-200">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-rose-500/20 text-rose-400 rounded-lg">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-100">
                  {selectedHotspot.subLocation}
                </div>
                <div className="text-[10px] text-slate-400">
                  Dikesan: {selectedHotspot.detectedTime} · {selectedHotspot.satellite}
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedHotspot(null)}
              className="text-xs text-slate-400 hover:text-slate-200 px-2 py-0.5"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400">Jenis Bahan Bakar:</span>
              <p className="font-semibold text-amber-300 text-[11px] mt-0.5">{selectedHotspot.fuelType}</p>
            </div>
            <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-400">Kuasa Sinaran Haba (FRP):</span>
              <p className="font-semibold text-rose-400 text-[11px] mt-0.5">{selectedHotspot.frp} MegaWatt</p>
            </div>
          </div>

          <div className="p-2 bg-rose-950/30 border border-rose-900/40 rounded-lg text-[11px] text-rose-300">
            <strong>Trajektori Asap:</strong> {selectedHotspot.smokeDispersion}
          </div>
        </div>
      ) : (
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs shrink-0">
          <div>
            <div className="text-[10px] text-slate-400 font-medium">Stesen Terpilih:</div>
            <div className="font-bold text-slate-100 flex items-center gap-1.5">
              <span>{selectedStation.name} ({selectedStation.state})</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] ${
                selectedStation.ipu > 100 ? 'bg-amber-500/20 text-amber-300 font-bold' : 'bg-emerald-500/20 text-emerald-300 font-bold'
              }`}>
                IPU {selectedStation.ipu}
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-slate-400">Status Kualiti Udara:</div>
            <div className="text-xs font-semibold text-slate-200">
              {selectedStation.statusMalay}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
