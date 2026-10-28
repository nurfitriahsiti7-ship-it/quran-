import React, { useState, useMemo } from 'react';
import { Search, BookOpen, Layers, RefreshCw, AlertCircle, ArrowRight } from 'lucide-react';
import { SurahListItem, JUZ_LIST } from '../types/quran';
import { SurahCard } from '../components/quran/SurahCard';

interface SurahListPageProps {
  surahs: SurahListItem[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onOpenSurah: (surahNumber: number, ayahNumber?: number) => void;
  onPlaySurah: (surah: SurahListItem) => void;
  currentPlayingSurahNumber?: number;
}

export const SurahListPage: React.FC<SurahListPageProps> = ({
  surahs,
  loading,
  error,
  onRefresh,
  onOpenSurah,
  onPlaySurah,
  currentPlayingSurahNumber,
}) => {
  const [viewMode, setViewMode] = useState<'surah' | 'juz'>('surah');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'mekah' | 'madinah'>('all');

  const filteredSurahs = useMemo(() => {
    let result = surahs;

    if (filterType !== 'all') {
      result = result.filter(
        (s) => s.tempatTurun.toLowerCase() === filterType.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.namaLatin.toLowerCase().includes(q) ||
          s.arti.toLowerCase().includes(q) ||
          s.nama.includes(q) ||
          String(s.nomor) === q
      );
    }

    return result;
  }, [surahs, filterType, searchQuery]);

  const filteredJuz = useMemo(() => {
    if (!searchQuery.trim()) return JUZ_LIST;
    const q = searchQuery.toLowerCase().trim();
    return JUZ_LIST.filter(
      (j) =>
        `juz ${j.juzNumber}`.includes(q) ||
        String(j.juzNumber) === q ||
        j.startSurahName.toLowerCase().includes(q) ||
        j.rangeText.toLowerCase().includes(q) ||
        j.arabicName.includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header & Search */}
      <div className="bg-surface border border-border rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" />
              <h1 className="text-xl md:text-2xl font-extrabold text-text">
                Al-Qur'an 30 Juz & 114 Surat
              </h1>
            </div>
            <p className="text-xs text-text-muted mt-1">
              Jelajahi seluruh surat Al-Qur'an lengkap dengan pembagian juz & audio murottal
            </p>
          </div>

          {/* Mode Tabs: Surat vs Juz */}
          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-primary-soft/50 p-1 rounded-2xl border border-border">
            <button
              onClick={() => setViewMode('surah')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                viewMode === 'surah'
                  ? 'bg-primary-deep text-white shadow-xs'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Surat (114)</span>
            </button>
            <button
              onClick={() => setViewMode('juz')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                viewMode === 'juz'
                  ? 'bg-primary-deep text-white shadow-xs'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Juz (1-30)</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs for Surah Mode */}
        {viewMode === 'surah' && (
          <div className="flex items-center gap-2 pt-1">
            <span className="text-[11px] font-semibold text-text-muted">Filter:</span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  filterType === 'all'
                    ? 'bg-primary-soft text-primary-deep font-bold border border-primary-deep/30'
                    : 'text-text-muted hover:text-text border border-border bg-surface'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilterType('mekah')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  filterType === 'mekah'
                    ? 'bg-primary-soft text-primary-deep font-bold border border-primary-deep/30'
                    : 'text-text-muted hover:text-text border border-border bg-surface'
                }`}
              >
                Makkiyyah
              </button>
              <button
                onClick={() => setFilterType('madinah')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  filterType === 'madinah'
                    ? 'bg-primary-soft text-primary-deep font-bold border border-primary-deep/30'
                    : 'text-text-muted hover:text-text border border-border bg-surface'
                }`}
              >
                Madaniyyah
              </button>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              viewMode === 'surah'
                ? "Cari nama surat (mis. Yasin, Al-Mulk, Al-Baqarah) atau nomor..."
                : "Cari nomor juz (mis. Juz 30, Juz 1) atau nama surat awal..."
            }
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary-deep/40 transition placeholder:text-text-muted"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-text-muted hover:text-text cursor-pointer"
            >
              Hapus
            </button>
          )}
        </div>
      </div>

      {/* Loading Skeleton */}
      {loading && surahs.length === 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface border border-border rounded-2xl p-4 animate-pulse flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-soft/80" />
                <div className="space-y-2">
                  <div className="w-28 h-4 rounded bg-primary-soft/80" />
                  <div className="w-20 h-3 rounded bg-primary-soft/50" />
                </div>
              </div>
              <div className="w-16 h-6 rounded bg-primary-soft/60" />
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-900 text-center space-y-3">
          <AlertCircle className="w-8 h-8 text-red-600 mx-auto" />
          <div>
            <h3 className="font-bold text-base">Gagal Memuat Daftar Surat</h3>
            <p className="text-xs text-red-700 mt-1">{error}</p>
          </div>
          <button
            onClick={onRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold shadow hover:bg-red-700 transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Coba Muat Ulang</span>
          </button>
        </div>
      )}

      {/* VIEW MODE 1: 114 SURAT */}
      {!loading && viewMode === 'surah' && (
        <>
          {filteredSurahs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredSurahs.map((surah) => (
                <SurahCard
                  key={surah.nomor}
                  surah={surah}
                  onOpen={(num) => onOpenSurah(num)}
                  onPlaySurah={onPlaySurah}
                  isPlaying={currentPlayingSurahNumber === surah.nomor}
                />
              ))}
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-2xl p-10 text-center space-y-2">
              <p className="text-sm font-semibold text-text">Surat tidak ditemukan</p>
              <p className="text-xs text-text-muted">
                Tidak ada surat yang sesuai dengan kata kunci "{searchQuery}".
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-2 text-xs font-semibold text-primary-deep hover:underline cursor-pointer"
              >
                Reset Pencarian
              </button>
            </div>
          )}
        </>
      )}

      {/* VIEW MODE 2: 30 JUZ */}
      {!loading && viewMode === 'juz' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredJuz.map((juz) => (
            <div
              key={juz.juzNumber}
              onClick={() => onOpenSurah(juz.startSurahNumber, juz.startAyah)}
              className="group bg-surface border border-border rounded-2xl p-4.5 hover:border-primary-deep/50 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                {/* Number Badge */}
                <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
                  <div className="absolute inset-0 rotate-45 rounded-lg border border-accent/40 bg-primary-soft/50 group-hover:bg-primary-soft transition-colors" />
                  <span className="relative z-10 text-xs font-extrabold text-accent-deep">
                    {juz.juzNumber}
                  </span>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-text truncate group-hover:text-primary-deep transition-colors">
                      Juz {juz.juzNumber}
                    </h3>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-primary-soft text-primary-deep">
                      Mulai Ayat {juz.startAyah}
                    </span>
                  </div>

                  <p className="text-xs text-text-muted truncate mt-0.5">
                    {juz.rangeText}
                  </p>
                </div>
              </div>

              {/* Arabic Name & Arrow */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-quran text-lg font-bold text-accent-deep">
                  {juz.arabicName}
                </span>
                <div className="w-7 h-7 rounded-full bg-primary-soft/60 flex items-center justify-center text-primary-deep group-hover:bg-primary-deep group-hover:text-white transition">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
