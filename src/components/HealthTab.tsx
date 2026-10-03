import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  User,
  Shield,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Info,
  Clock,
  Eye,
  Plus
} from 'lucide-react';
import { HealthProfile, ApimsStation } from '../types';

interface HealthTabProps {
  currentStation: ApimsStation;
  lang: 'ms' | 'en';
}

export const HealthTab: React.FC<HealthTabProps> = ({ currentStation, lang }) => {
  const [profile, setProfile] = useState<HealthProfile>({
    category: 'asthma_respiratory',
    hasAsthmaInhaler: true,
    hasAirPurifierAtHome: true,
    dailyWaterGlasses: 4,
    targetWaterGlasses: 8,
    recordedSymptoms: ['Mata Pedih & Merah', 'Tekak Kering'],
  });

  // Calculate safe outdoor minutes based on category & IPU
  const getSafeMinutes = () => {
    const ipu = currentStation.ipu;
    if (ipu <= 50) return 240; // 4 hours
    if (ipu <= 100) {
      if (profile.category === 'asthma_respiratory') return 60;
      if (profile.category === 'child' || profile.category === 'elderly') return 90;
      return 180;
    }
    if (ipu <= 150) {
      if (profile.category === 'asthma_respiratory') return 20;
      if (profile.category === 'pregnancy' || profile.category === 'elderly' || profile.category === 'child') return 30;
      if (profile.category === 'delivery_rider') return 60; // needs continuous N95
      return 60;
    }
    if (ipu <= 200) {
      if (profile.category === 'asthma_respiratory') return 10;
      if (profile.category === 'delivery_rider') return 30;
      return 25;
    }
    return 0; // Dangerous - do not go out
  };

  const initialSafeMinutes = getSafeMinutes();
  const [timerSeconds, setTimerSeconds] = useState(initialSafeMinutes * 60);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleProfileChange = (cat: HealthProfile['category']) => {
    const updated = { ...profile, category: cat };
    setProfile(updated);
    // recalculate
    const newMins =
      cat === 'asthma_respiratory' ? 15 : cat === 'child' ? 25 : cat === 'delivery_rider' ? 45 : 35;
    setTimerSeconds(newMins * 60);
    setTimerActive(false);
  };

  const addWaterGlass = () => {
    if (profile.dailyWaterGlasses < 12) {
      setProfile({
        ...profile,
        dailyWaterGlasses: profile.dailyWaterGlasses + 1,
      });
    }
  };

  return (
    <div className="p-4 space-y-4 pb-6">
      {/* Category Profile Selector */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
            <User className="w-4 h-4 text-emerald-400" />
            <span>Pilih Profil Kesihatan Anda</span>
          </div>
          <span className="text-[10px] text-slate-400">Pengiraan Risiko Khusus</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { id: 'general', label: 'Orang Awam', desc: 'Individu sihat' },
            { id: 'asthma_respiratory', label: 'Pesakit Asma / Paru-paru', desc: 'Risiko Tinggi' },
            { id: 'elderly', label: 'Warga Emas (60+)', desc: 'Sensitif saluran pernafasan' },
            { id: 'pregnancy', label: 'Ibu Mengandung', desc: 'Lindungi janin' },
            { id: 'child', label: 'Kanak-kanak / Bayi', desc: 'Kadar nafas laju' },
            { id: 'delivery_rider', label: 'Rider Grab / Kurier', desc: 'Pendedahan luar lama' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleProfileChange(item.id as any)}
              className={`p-2 rounded-xl text-left border transition-all ${
                profile.category === item.id
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 ring-1 ring-emerald-500/30'
                  : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              <div className="text-xs font-bold">{item.label}</div>
              <div className="text-[9px] text-slate-400">{item.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Exposure Tolerance Countdown Timer */}
      <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-4 text-center space-y-3 shadow-lg">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="w-4 h-4 text-amber-400" />
            <span>Had Masa Pendedahan Luar Selamat</span>
          </div>
          <span className="font-mono text-amber-400">IPU Semasa: {currentStation.ipu}</span>
        </div>

        <div className="my-2">
          <div className="text-4xl font-extrabold font-mono text-slate-100 tracking-wider">
            {formatTimer(timerSeconds)}
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {timerSeconds === 0 ? (
              <span className="text-rose-400 font-bold">
                Masa pendedahan tamat! Sila masuk ke dalam bangunan segera.
              </span>
            ) : (
              `Berdasarkan profil anda dan bacaan IPU ${currentStation.ipu}, hadkan masa di luar bangunan.`
            )}
          </p>
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center justify-center gap-2 pt-1">
          <button
            onClick={() => setTimerActive(!timerActive)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              timerActive
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
            }`}
          >
            {timerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span>{timerActive ? 'Jeda Pemasa' : 'Mula Pemasa Riadah / Perjalanan'}</span>
          </button>

          <button
            onClick={() => {
              setTimerActive(false);
              setTimerSeconds(initialSafeMinutes * 60);
            }}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
            title="Set Semula Pemasa"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Mask & Protective Gear Guide */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-200">
            <Shield className="w-4 h-4 text-sky-400" />
            <span>Panduan Pemilihan Topeng Muka N95 vs Pembedahan</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          {/* N95 Respirator */}
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/60 space-y-1.5">
            <div className="flex items-center justify-between text-emerald-300 font-bold">
              <span>Topeng N95 / KN95</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded">Disyorkan</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-tight">
              Menapis sekurang-kurangnya <strong>95% zarah PM2.5</strong> (zarah halus asap jerebu).
            </p>
            <div className="text-[10px] text-emerald-400">
              ✓ Lekapan kemas pada hidung & dagu tanpa celah udara.
            </div>
          </div>

          {/* 3-Ply Surgical Mask */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-slate-300 font-bold">
              <span>Topeng 3-Ply Biasa</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded">Kurang Berkesan</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              Hanya menapis titisan cecair batuk/habuk kasar (PM10).
            </p>
            <div className="text-[10px] text-rose-400">
              ✗ Zarah asap PM2.5 tembus melalui celah sisi pipi.
            </div>
          </div>
        </div>

        {/* Mask seal checklist */}
        <div className="p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-xl text-[11px] space-y-1 text-slate-300">
          <div className="font-semibold text-slate-200">Ujian Ketat Udara (Seal Test) N95:</div>
          <div>1. Tekup kedua-dua belah tangan pada permukaan luar topeng dan hembus nafas laju.</div>
          <div>2. Pastikan tiada angin keluar membocori celah hidung atau pipi anda.</div>
        </div>
      </div>

      {/* Hydration Tracker */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-200">
            <Droplets className="w-4 h-4 text-sky-400" />
            <span>Kekalkan Hidrasi Harian (Keluarkan Toksin)</span>
          </div>
          <span className="font-mono text-sky-400 font-bold">
            {profile.dailyWaterGlasses} / {profile.targetWaterGlasses} Gelas
          </span>
        </div>

        <p className="text-[11px] text-slate-300 leading-relaxed">
          Minum sekurang-kurangnya 2.5 hingga 3 liter air suam sehari membantu membran mukus saluran pernafasan mencairkan kahak dan menolak zarah jelaga jerebu keluar dari tekak.
        </p>

        {/* Glasses visualization */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {Array.from({ length: profile.targetWaterGlasses }).map((_, i) => (
            <div
              key={i}
              className={`w-7 h-9 rounded-md border flex items-center justify-center transition-all ${
                i < profile.dailyWaterGlasses
                  ? 'bg-sky-500/30 border-sky-400 text-sky-300'
                  : 'bg-slate-950 border-slate-800 text-slate-600'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
            </div>
          ))}

          <button
            onClick={addWaterGlass}
            className="flex items-center gap-1 px-3 py-1.5 bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 rounded-xl text-xs font-semibold ml-2 transition-colors cursor-pointer"
          >
            <Plus className="w-3 h-3" />
            <span>+1 Gelas</span>
          </button>
        </div>
      </div>

      {/* Symptoms & Clinic Alert */}
      <div className="bg-rose-950/30 border border-rose-900/40 rounded-2xl p-4 space-y-2 text-xs">
        <div className="flex items-center gap-2 text-rose-400 font-bold">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Bila Perlu Ke Klinik Kesihatan atau Hospital?</span>
        </div>
        <p className="text-slate-300 text-[11px] leading-relaxed">
          Segera dapatkan bantuan kecemasan jika anda atau ahli keluarga mengalami:
        </p>
        <ul className="text-[11px] text-rose-300 space-y-1 list-disc list-inside">
          <li>Sesak nafas berterusan atau bunyi berdehit (wheezing) yang tidak reda dengan inhaler.</li>
          <li>Sakit dada atau rasa ketat di bahagian dada.</li>
          <li>Mata pedih teruk dan berair berterusan tanpa henti.</li>
          <li>Batuk berkahak pekat berwarna coklat gelap atau berdarah.</li>
        </ul>
      </div>
    </div>
  );
};
