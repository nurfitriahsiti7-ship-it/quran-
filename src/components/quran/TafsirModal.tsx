import React, { useEffect, useState } from 'react';
import { X, BookOpen, AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { getTafsirDetail } from '../../services/quranApi';
import { TafsirDetail } from '../../types/quran';

interface TafsirModalProps {
  surahNumber: number;
  surahName: string;
  initialAyahNumber?: number;
  onClose: () => void;
}

export const TafsirModal: React.FC<TafsirModalProps> = ({
  surahNumber,
  surahName,
  initialAyahNumber = 1,
  onClose,
}) => {
  const [tafsirData, setTafsirData] = useState<TafsirDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAyah, setSelectedAyah] = useState<number>(initialAyahNumber);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getTafsirDetail(surahNumber, controller.signal);
        if (isMounted) {
          setTafsirData(data);
          setLoading(false);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'Gagal memuat data tafsir.';
          setError(message);
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [surahNumber]);

  const currentAyahTafsir = tafsirData?.tafsir.find((t) => t.ayat === selectedAyah);
  const totalAyat = tafsirData?.jumlahAyat || 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl max-h-[85vh] bg-surface rounded-2xl border border-border shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-primary-soft/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-accent-light/30 flex items-center justify-center text-accent-deep">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-text">
                Tafsir Kemenag: QS. {surahName}
              </h3>
              <p className="text-xs text-text-muted">Kementerian Agama Republik Indonesia</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-text-muted hover:text-text hover:bg-primary-soft transition cursor-pointer"
            aria-label="Tutup Tafsir"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          {loading && (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-primary-deep animate-spin" />
              <p className="text-sm font-medium text-text-muted">Memuat naskah tafsir dari API...</p>
            </div>
          )}

          {error && !loading && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Koneksi ke API Tafsir Bermasalah</p>
                <p className="text-xs text-red-700 mt-0.5">{error}</p>
                <button
                  onClick={() => {
                    setLoading(true);
                    setError(null);
                    getTafsirDetail(surahNumber)
                      .then((d) => {
                        setTafsirData(d);
                        setLoading(false);
                      })
                      .catch((e) => {
                        setError(e.message);
                        setLoading(false);
                      });
                  }}
                  className="mt-2.5 px-3 py-1 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition"
                >
                  Coba Lagi
                </button>
              </div>
            </div>
          )}

          {tafsirData && !loading && (
            <>
              {/* Surah Overview Description */}
              <div className="bg-primary-soft/30 border border-border p-4 rounded-xl text-xs text-text-muted leading-relaxed">
                <span className="font-bold text-text block mb-1">Keterangan Surat:</span>
                <span
                  dangerouslySetInnerHTML={{
                    __html: tafsirData.deskripsi || 'Tidak ada deskripsi tambahan.',
                  }}
                />
              </div>

              {/* Ayah selector buttons */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-text block">Pilih Ayat Tafsir:</label>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
                  {tafsirData.tafsir.map((t) => (
                    <button
                      key={t.ayat}
                      onClick={() => setSelectedAyah(t.ayat)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition cursor-pointer ${
                        selectedAyah === t.ayat
                          ? 'bg-primary-deep text-white shadow-xs'
                          : 'bg-primary-soft/50 text-text hover:bg-primary-soft border border-border'
                      }`}
                    >
                      Ayat {t.ayat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selected Ayah Tafsir Text */}
              {currentAyahTafsir ? (
                <div className="bg-surface border border-border rounded-xl p-5 shadow-xs space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-border">
                    <span className="font-bold text-sm text-accent-deep">
                      Tafsir Ayat ke-{currentAyahTafsir.ayat}
                    </span>
                    <div className="flex items-center gap-1 text-xs">
                      <button
                        disabled={selectedAyah <= 1}
                        onClick={() => setSelectedAyah((p) => Math.max(1, p - 1))}
                        className="p-1 rounded text-text-muted hover:text-text disabled:opacity-30 cursor-pointer"
                        title="Ayat Sebelumnya"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <span className="text-text-muted">
                        {selectedAyah} / {totalAyat}
                      </span>
                      <button
                        disabled={selectedAyah >= totalAyat}
                        onClick={() => setSelectedAyah((p) => Math.min(totalAyat, p + 1))}
                        className="p-1 rounded text-text-muted hover:text-text disabled:opacity-30 cursor-pointer"
                        title="Ayat Selanjutnya"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-text leading-relaxed whitespace-pre-line font-sans">
                    {currentAyahTafsir.teks}
                  </p>
                </div>
              ) : (
                <div className="text-center py-6 text-sm text-text-muted">
                  Tafsir untuk ayat ini belum tersedia.
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
