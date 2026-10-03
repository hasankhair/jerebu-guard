import React, { useState } from 'react';
import {
  Camera,
  Upload,
  AlertOctagon,
  MapPin,
  CheckCircle2,
  PhoneCall,
  ShieldCheck,
  Flame,
  Clock,
  Send,
  FileText,
  Building2
} from 'lucide-react';
import { CitizenFireReport } from '../types';
import { INITIAL_CITIZEN_REPORTS } from '../data/hazeData';

interface ReportTabProps {
  lang: 'ms' | 'en';
}

export const ReportTab: React.FC<ReportTabProps> = ({ lang }) => {
  const [reports, setReports] = useState<CitizenFireReport[]>(INITIAL_CITIZEN_REPORTS);
  const [reporterName, setReporterName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [locationName, setLocationName] = useState('');
  const [state, setState] = useState('Selangor');
  const [fireType, setFireType] = useState<'peat' | 'open_trash' | 'agricultural' | 'forest_brush' | 'industrial'>('peat');
  const [severity, setSeverity] = useState<'low' | 'moderate' | 'critical'>('critical');
  const [description, setDescription] = useState('');
  const [selectedPhotoPreset, setSelectedPhotoPreset] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReport, setSubmittedReport] = useState<CitizenFireReport | null>(null);

  // Preset realistic sample photos to test quickly on mobile/desktop without needing real fire outside
  const photoPresets = [
    {
      id: 'p-peat',
      label: 'Asap Tanah Gambut Johan Setia',
      url: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?w=600&auto=format&fit=crop&q=80',
      type: 'peat',
      loc: 'Lot 4182, Johan Setia, Klang, Selangor',
      desc: 'Kepulan asap tebal bawah tanah gambut membakar akar pokok kelapa sawit terbiar.',
    },
    {
      id: 'p-trash',
      label: 'Pembakaran Sampah Terbuka',
      url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=600&auto=format&fit=crop&q=80',
      type: 'open_trash',
      loc: 'Tapak Pelupusan Haram, Sg Buloh, Selangor',
      desc: 'Asap hitam berbau plastik dibakar di tepi tapak pembinaan berhampiran kawasan perumahan.',
    },
    {
      id: 'p-agri',
      label: 'Pembersihan Semak Pertanian',
      url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&auto=format&fit=crop&q=80',
      type: 'agricultural',
      loc: 'Kawasan Kebun Sri Aman, Sarawak',
      desc: 'Pembersihan sisa rumput kering menggunakan api terbuka menyebabkan jerebu setempat.',
    }
  ];

  const handleSelectPreset = (p: typeof photoPresets[0]) => {
    setSelectedPhotoPreset(p.url);
    setLocationName(p.loc);
    setDescription(p.desc);
    setFireType(p.type as any);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationName || !description) return;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/report-fire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reporterName: reporterName || 'Penduduk Awam',
          contactNumber: contactNumber || '+6012-XXXXXXX',
          locationName,
          state,
          fireType,
          severity,
          description,
          photoUrl: selectedPhotoPreset || undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.report) {
        setReports([data.report, ...reports]);
        setSubmittedReport(data.report);
      }
    } catch {
      // Fallback local report creation
      const localReport: CitizenFireReport = {
        id: `rep-${Date.now()}`,
        referenceNo: `JAS-BMB-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: 'Baru Sebentar Tadi',
        reporterName: reporterName || 'Penduduk Awam',
        contactNumber: contactNumber || '+6012-XXXXXXX',
        locationName,
        state,
        coords: { lat: 3.07, lng: 101.51 },
        fireType,
        fireTypeMalay: fireType === 'peat' ? 'Kebakaran Tanah Gambut' : 'Pembakaran Terbuka',
        severity,
        description,
        status: 'dispatched_bomba',
        bombaUnitAssigned: 'BOMBA Balai Bomba Terdekat (Operasi Pantas)',
        jasCaseId: `JAS/SLG/OP-${Math.floor(100 + Math.random() * 900)}/26`,
      };
      setReports([localReport, ...reports]);
      setSubmittedReport(localReport);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 space-y-4 pb-6">
      {/* Header Info */}
      <div className="bg-gradient-to-r from-rose-950/60 to-slate-900 border border-rose-900/40 rounded-2xl p-4">
        <div className="flex items-center gap-2 text-rose-400 font-bold text-sm mb-1">
          <AlertOctagon className="w-5 h-5 shrink-0" />
          <h2>Aduan Pantas Pembakaran Terbuka & Titik Api</h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Hentikan punca jerebu dengan membuat laporan terus kepada <strong>Jabatan Alam Sekitar (JAS)</strong> dan <strong>BOMBA Malaysia</strong>. Laporan disalurkan serta-merta untuk tindakan pemadaman dan penguatkuasaan undang-undang.
        </p>
      </div>

      {/* Submission Success Dialog */}
      {submittedReport && (
        <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-2xl p-4 space-y-3 animate-in fade-in">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-emerald-300">
                Laporan Diterima & Disalurkan Kepada BOMBA
              </h3>
              <p className="text-[11px] text-slate-300 mt-0.5">
                No. Rujukan Rasmi: <strong className="text-emerald-400 font-mono">{submittedReport.referenceNo}</strong>
              </p>
            </div>
          </div>

          <div className="bg-slate-900/90 rounded-xl p-3 border border-emerald-900/50 text-[11px] space-y-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">Unit Ditugaskan:</span>
              <span className="text-slate-200 font-medium">{submittedReport.bombaUnitAssigned}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Kes JAS:</span>
              <span className="text-slate-200 font-mono">{submittedReport.jasCaseId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Status Tindakan:</span>
              <span className="text-amber-400 font-bold">Dalam Tindakan (Dispatch)</span>
            </div>
          </div>

          <div className="flex gap-2">
            <a
              href="tel:999"
              className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Hubungi BOMBA 999</span>
            </a>
            <button
              onClick={() => setSubmittedReport(null)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium"
            >
              Buat Laporan Baru
            </button>
          </div>
        </div>
      )}

      {/* Report Form */}
      {!submittedReport && (
        <form onSubmit={handleSubmit} className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-4">
          <div className="text-xs font-bold text-slate-200 border-b border-slate-800 pb-2 flex items-center justify-between">
            <span>Borang Laporan Baru</span>
            <span className="text-[10px] text-rose-400 font-medium">*Seksyen 29A Akta Kualiti Alam Sekeliling</span>
          </div>

          {/* Preset Photo Scenarios */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1.5">
              Pilih Contoh Bukti Gambar atau Muat Naik:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {photoPresets.map((preset) => (
                <button
                  type="button"
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-1.5 rounded-xl border text-left flex flex-col items-center gap-1 transition-all ${
                    selectedPhotoPreset === preset.url
                      ? 'border-rose-500 bg-rose-500/15 ring-2 ring-rose-500/30'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.label}
                    className="w-full h-14 object-cover rounded-lg"
                  />
                  <span className="text-[9px] text-slate-300 line-clamp-1 font-medium text-center">
                    {preset.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Location Name & State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Lokasi / Alamat Kejadian *
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  required
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  placeholder="cth: Johan Setia Klang, Lorong Hj Bakar"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Negeri
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
              >
                <option value="Selangor">Selangor</option>
                <option value="Kuala Lumpur">Kuala Lumpur</option>
                <option value="Johor">Johor</option>
                <option value="Sarawak">Sarawak</option>
                <option value="Pulau Pinang">Pulau Pinang</option>
                <option value="Negeri Sembilan">Negeri Sembilan</option>
                <option value="Pahang">Pahang</option>
                <option value="Perak">Perak</option>
              </select>
            </div>
          </div>

          {/* Fire Category & Severity */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Kategori Kebakaran
              </label>
              <select
                value={fireType}
                onChange={(e) => setFireType(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
              >
                <option value="peat">Tanah Gambut (Peat)</option>
                <option value="open_trash">Sampah & Plastik Terbuka</option>
                <option value="agricultural">Pembersihan Kebun/Sawit</option>
                <option value="forest_brush">Belukar & Hutan Simpan</option>
                <option value="industrial">Kilang & Pelepasan Haram</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Tahap Keterukan Asap
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-2 text-xs text-slate-100 focus:outline-none focus:border-rose-500"
              >
                <option value="critical">Kritikal (Asap Pekat / Mengancam)</option>
                <option value="moderate">Sederhana (Asap Berbau Kuat)</option>
                <option value="low">Rendah (Peringkat Awal)</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-[11px] font-semibold text-slate-300 block mb-1">
              Keterangan Asap & Keadaan Semasa *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="cth: Asap putih tebal berkepul-kepul dari arah tanah lot terbiar. Jarak penglihatan menurun bawah 200m."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Reporter Details (Optional) */}
          <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-800">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">
                Nama Pengadu (Pilihan)
              </label>
              <input
                type="text"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                placeholder="cth: Ahmad"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">
                No. Telefon Untuk Pengesahan
              </label>
              <input
                type="text"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+601X-XXXXXXX"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-100"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                Menyalurkan Laporan kepada JAS & BOMBA...
              </span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Hantar Laporan Segera Kepada Pihak Berkuasa</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* Community Reports Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-slate-200">Laporan Komuniti Aktif</span>
          <span className="text-[10px] text-slate-400">{reports.length} rekod terkini</span>
        </div>

        <div className="space-y-2.5">
          {reports.map((rep) => (
            <div
              key={rep.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-3.5 text-xs space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${
                    rep.severity === 'critical' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    <Flame className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-100">{rep.locationName}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                      <span>{rep.timestamp}</span>
                      <span>·</span>
                      <span className="font-mono text-emerald-400">{rep.referenceNo}</span>
                    </div>
                  </div>
                </div>

                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                  rep.status === 'dispatched_bomba'
                    ? 'bg-rose-950/80 text-rose-300 border-rose-800'
                    : rep.status === 'extinguished'
                    ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                    : 'bg-amber-950/80 text-amber-300 border-amber-800'
                }`}>
                  {rep.status === 'dispatched_bomba' ? 'Bomba Dikerahkan' : rep.status === 'extinguished' ? 'Padam Penuh' : 'Siasatan JAS'}
                </span>
              </div>

              <p className="text-slate-300 text-[11px] leading-relaxed">
                {rep.description}
              </p>

              <div className="p-2 bg-slate-950/60 rounded-xl border border-slate-800/80 flex items-center justify-between text-[10px]">
                <span className="text-slate-400">Unit Bomba / Tindakan:</span>
                <span className="text-emerald-400 font-medium">{rep.bombaUnitAssigned || rep.jasCaseId}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
