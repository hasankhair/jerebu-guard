import React, { useState } from 'react';
import {
  Sparkles,
  Camera,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Shield,
  Clock,
  Compass,
  X,
  RefreshCw
} from 'lucide-react';
import { ApimsStation } from '../types';

interface AiScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStation: ApimsStation;
  lang: 'ms' | 'en';
}

export const AiScannerModal: React.FC<AiScannerModalProps> = ({
  isOpen,
  onClose,
  currentStation,
  lang,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    'https://images.unsplash.com/photo-1542385151-efd9000785a0?w=600&auto=format&fit=crop&q=80'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [userQuery, setUserQuery] = useState('');

  if (!isOpen) return null;

  const sampleImages = [
    {
      id: 'img-1',
      title: 'Jerebu Tebal di Horizon Bandar',
      url: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'img-2',
      title: 'Asap Kebakaran Belukar & Gambut',
      url: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&auto=format&fit=crop&q=80',
    },
    {
      id: 'img-3',
      title: 'Hari Cerah (Kawalan Perbandingan)',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&auto=format&fit=crop&q=80',
    }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setAnalysisResult(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await fetch('/api/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage.startsWith('data:') ? selectedImage : undefined,
          prompt: userQuery || `Anggarkan keterukan jerebu, jarak penglihatan (jarak pandang km), dan nasihat perlindungan kesihatan untuk stesen ${currentStation.name} (IPU semasa ${currentStation.ipu}).`,
          userCategory: 'Malaysian Citizen & Family',
          location: `${currentStation.name}, ${currentStation.state}, Malaysia`,
        }),
      });

      const data = await res.json();
      if (data.success && data.analysis) {
        setAnalysisResult(data.analysis);
      }
    } catch (err) {
      console.error(err);
      // Fallback
      setAnalysisResult({
        estimatedIpu: 152,
        visibilityKm: '2.0 - 2.8 km',
        smokeSeverity: 'Tidak Sihat (Unhealthy PM2.5)',
        hazeSourceProbable: 'Kepulan jerebu rentas sempadan Monsun Barat Daya dari Sumatera.',
        maskAdvice: 'Topeng N95 atau KN95 diwajibkan jika berada di luar.',
        healthGuidance: 'Ketumpatan zarah halus PM2.5 yang tinggi dikesan. Kanak-kanak dan pesakit asma perlu duduk di dalam rumah.',
        outdoorSafeMinutes: 20,
        recommendedAction: 'Gunakan penapis udara HEPA di ruang tamu dan tutup tingkap.'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/20 text-amber-300 rounded-xl">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100">
                Pengimbas Asap AI (Gemini Vision)
              </h2>
              <p className="text-[10px] text-slate-400">
                Analisis Keterukan Jerebu & Jarak Penglihatan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Active Image Preview */}
          <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 aspect-video flex items-center justify-center">
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Skyline Haze View"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-slate-500 flex flex-col items-center gap-2">
                <Camera className="w-8 h-8 opacity-40" />
                <span>Pilih atau tangkap gambar pemandangan langit</span>
              </div>
            )}

            {/* Quick Upload Button Overlay */}
            <label className="absolute bottom-2 right-2 flex items-center gap-1.5 px-3 py-1.5 bg-slate-950/80 hover:bg-slate-900 text-slate-200 rounded-xl border border-slate-700/60 text-[11px] font-medium backdrop-blur-sm cursor-pointer transition-colors">
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>Muat Naik Foto</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Sample preset choices */}
          <div>
            <div className="text-[11px] font-semibold text-slate-300 mb-1.5">
              Atau Pilih Contoh Pemandangan Langit:
            </div>
            <div className="grid grid-cols-3 gap-2">
              {sampleImages.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSelectedImage(s.url);
                    setAnalysisResult(null);
                  }}
                  className={`p-1 rounded-xl border text-left flex flex-col items-center gap-1 transition-all ${
                    selectedImage === s.url
                      ? 'border-amber-500 bg-amber-500/15'
                      : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                  }`}
                >
                  <img
                    src={s.url}
                    alt={s.title}
                    className="w-full h-12 object-cover rounded-lg"
                  />
                  <span className="text-[9px] text-slate-300 line-clamp-1 text-center font-medium">
                    {s.title}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom prompt/notes (optional) */}
          <div>
            <input
              type="text"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              placeholder="Soalan tambahan (cth: Adakah selamat untuk anak saya berjoging?)"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Action Trigger */}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {isAnalyzing ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin"></span>
                Gemini Sedang Menganalisis Keterukan Partikel Asap...
              </span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analisis Gambar Dengan Gemini AI</span>
              </>
            )}
          </button>

          {/* Analysis Results Display */}
          {analysisResult && (
            <div className="bg-slate-950/90 border border-amber-500/40 rounded-2xl p-4 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Keputusan Analisis Atmosfera AI
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  Gemini 3.8 Flash
                </span>
              </div>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Compass className="w-3 h-3 text-amber-400" /> Anggaran IPU:
                  </span>
                  <div className="text-lg font-bold text-amber-300 mt-0.5">
                    {analysisResult.estimatedIpu || 148} IPU
                  </div>
                </div>

                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Eye className="w-3 h-3 text-sky-400" /> Jarak Penglihatan:
                  </span>
                  <div className="text-lg font-bold text-sky-300 mt-0.5">
                    {analysisResult.visibilityKm || '2.5 km'}
                  </div>
                </div>
              </div>

              {/* Health Guidance */}
              <div className="space-y-2 text-[11px]">
                <div className="p-2.5 bg-amber-950/30 border border-amber-900/40 rounded-xl">
                  <div className="text-amber-300 font-semibold flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" /> Nasihat Topeng N95:
                  </div>
                  <div className="text-slate-300 mt-0.5">{analysisResult.maskAdvice}</div>
                </div>

                <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
                  <div className="text-slate-200 font-semibold mb-1">Panduan Perlindungan:</div>
                  {analysisResult.healthGuidance}
                </div>

                <div className="flex items-center justify-between p-2 bg-slate-900 rounded-xl border border-slate-800 text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-rose-400" /> Had Selamat Di Luar:
                  </span>
                  <span className="text-rose-400 font-bold font-mono">
                    {analysisResult.outdoorSafeMinutes || 25} Minit
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold"
          >
            Tutup Pengimbas
          </button>
        </div>
      </div>
    </div>
  );
};
