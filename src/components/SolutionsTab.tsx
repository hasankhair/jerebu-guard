import React, { useState } from 'react';
import {
  Sparkles,
  Wrench,
  Building,
  CloudRain,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Phone,
  MapPin,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DIY_PURIFIER_RECIPE, CLEAN_AIR_SHELTERS } from '../data/hazeData';

interface SolutionsTabProps {
  lang: 'ms' | 'en';
}

export const SolutionsTab: React.FC<SolutionsTabProps> = ({ lang }) => {
  const [activeSubTab, setActiveSubTab] = useState<'diy' | 'shelters' | 'policy'>('diy');
  const [expandedStep, setExpandedStep] = useState<number | null>(0);
  const [shelterStateFilter, setShelterStateFilter] = useState<string>('All');

  const filteredShelters =
    shelterStateFilter === 'All'
      ? CLEAN_AIR_SHELTERS
      : CLEAN_AIR_SHELTERS.filter((s) => s.state.toLowerCase().includes(shelterStateFilter.toLowerCase()));

  return (
    <div className="p-4 space-y-4 pb-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/60 to-slate-900 border border-emerald-900/40 rounded-2xl p-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-1">
          <Sparkles className="w-5 h-5 shrink-0" />
          <h2>Solusi Praktikal & Inisiatif Udara Bersih</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Mengatasi masalah jerebu melalui perlindungan udara mampu milik untuk rakyat Malaysia, pusat perlindungan awam, dan intervensi pembenihan awan.
        </p>
      </div>

      {/* Segmented Sub Tabs */}
      <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveSubTab('diy')}
          className={`flex-1 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
            activeSubTab === 'diy'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          DIY Penapis RM75
        </button>
        <button
          onClick={() => setActiveSubTab('shelters')}
          className={`flex-1 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
            activeSubTab === 'shelters'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Pusat Udara Bersih
        </button>
        <button
          onClick={() => setActiveSubTab('policy')}
          className={`flex-1 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
            activeSubTab === 'policy'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Inisiatif Saintifik
        </button>
      </div>

      {/* 1. DIY Corsi-Rosenthal Box Air Purifier */}
      {activeSubTab === 'diy' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Header Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
                  <Wrench className="w-4 h-4 text-emerald-400" />
                  {DIY_PURIFIER_RECIPE.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {DIY_PURIFIER_RECIPE.description}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-emerald-950/40 border border-emerald-800/40 rounded-xl">
                <span className="text-[10px] text-emerald-400 font-semibold uppercase">Kos Anggaran:</span>
                <div className="text-emerald-300 font-bold text-sm mt-0.5">{DIY_PURIFIER_RECIPE.estimatedCost}</div>
              </div>

              <div className="p-2.5 bg-sky-950/40 border border-sky-800/40 rounded-xl">
                <span className="text-[10px] text-sky-400 font-semibold uppercase">Kadar Aliran Udara Bersih:</span>
                <div className="text-sky-300 font-bold text-sm mt-0.5">{DIY_PURIFIER_RECIPE.cadrScore}</div>
              </div>
            </div>
          </div>

          {/* Materials Checklist */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2.5">
            <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
              <span>Bahan-bahan Diperlukan (Boleh didapati di kedai perkakasan / MR.DIY)</span>
            </div>

            <div className="space-y-1.5 text-xs">
              {DIY_PURIFIER_RECIPE.materials.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 bg-slate-950/60 rounded-xl border border-slate-800/80"
                >
                  <span className="text-slate-300">{m.item}</span>
                  <span className="text-emerald-400 font-bold font-mono">{m.cost}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2.5">
            <div className="text-xs font-bold text-slate-200">
              Langkah Pemasangan (15 Minit Sahaja)
            </div>

            <div className="space-y-2">
              {DIY_PURIFIER_RECIPE.steps.map((step, idx) => {
                const isExpanded = expandedStep === idx;
                return (
                  <div
                    key={idx}
                    className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 cursor-pointer"
                    onClick={() => setExpandedStep(isExpanded ? null : idx)}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                      <span className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        <span>Langkah {idx + 1}</span>
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>

                    {isExpanded && (
                      <p className="mt-2 text-xs text-slate-300 leading-relaxed pl-7">
                        {step}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 2. Community Clean Air Shelters */}
      {activeSubTab === 'shelters' && (
        <div className="space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-200">Pusat Perlindungan Udara Bersih</span>
            <select
              value={shelterStateFilter}
              onChange={(e) => setShelterStateFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-slate-300"
            >
              <option value="All">Semua Negeri</option>
              <option value="Selangor">Selangor</option>
              <option value="Kuala Lumpur">Kuala Lumpur</option>
              <option value="Sarawak">Sarawak</option>
            </select>
          </div>

          <div className="space-y-2.5">
            {filteredShelters.map((shelter) => (
              <div
                key={shelter.id}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-2 text-xs"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-slate-100">{shelter.name}</h4>
                    <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {shelter.address}
                    </p>
                  </div>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-medium">
                    {shelter.type}
                  </span>
                </div>

                <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60 text-[10px]">
                  {shelter.hepaFiltered && (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Berhawa Dingin HEPA
                    </span>
                  )}
                  {shelter.freeN95Available && (
                    <span className="text-sky-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Topeng N95 KKM Percuma
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-300 pt-1">
                  <span>Waktu: {shelter.operatingHours}</span>
                  <a
                    href={`tel:${shelter.phone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-1 text-emerald-400 hover:underline font-medium"
                  >
                    <Phone className="w-3 h-3" />
                    <span>{shelter.phone}</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Scientific Policy & Interventions */}
      {activeSubTab === 'policy' && (
        <div className="space-y-3 animate-in fade-in text-xs">
          {/* Cloud Seeding Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-sky-400 font-bold">
              <CloudRain className="w-4 h-4" />
              <span>Operasi Pembenihan Awan (Cloud Seeding)</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Dijalankan oleh <strong>Jabatan Meteorologi Malaysia (METMalaysia)</strong> bersama <strong>Tentera Udara Diraja Malaysia (TUDM)</strong> menggunakan pesawat pengangkut C-130 Hercules menyembur larutan garam (natrium klorida) ke dalam awan kumulus.
            </p>
            <div className="p-2.5 bg-slate-950/70 border border-slate-800 rounded-xl text-[10px] text-slate-400 space-y-1">
              <div><strong>Syarat Atmosfera:</strong> Memerlukan kelembapan udara melebihi 70% dan tiupan angin stabil untuk pembentukan titisan hujan lebat pembilas jerebu.</div>
              <div><strong>Kawasan Sasaran:</strong> Lembangan Sungai Klang, Johan Setia, Batang Lupar & Kuching, Sarawak.</div>
            </div>
          </div>

          {/* Peat Rewetting & Tube Wells */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Projek Pengepaman Telaga Tiub Tanah Gambut</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Jabatan Pengairan dan Saliran (JPS) bersama Jabatan Alam Sekitar mengaktifkan 42 pam telaga tiub di kawasan tanah gambut Johan Setia dan Kuala Langat untuk menaikkan paras air bawah tanah (water table) melebihi 0.4 meter, menghalang pembakaran dasar gambut merebak bawah tanah.
            </p>
          </div>

          {/* Transboundary Agreement */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-bold">
              <Building className="w-4 h-4" />
              <span>Perjanjian ASEAN Mengenai Pencemaran Jerebu Rentas Sempadan</span>
            </div>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              Malaysia mengusulkan penguatkuasaan Akta Jerebu Rentas Sempadan untuk mendakwa syarikat pemegang konsesi perladangan yang cuai di mahkamah domestik jika tanah milik mereka dikesan satelit mencetuskan kebakaran hutan.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
