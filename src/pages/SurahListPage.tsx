import React, { useState, useMemo } from 'react';
import { Search, Filter, RefreshCw, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
import { SurahListItem } from '../types/quran';
import { SurahCard } from '../components/quran/SurahCard';

interface SurahListPageProps {
  surahs: SurahListItem[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onOpenSurah: (surahNumber: number) => void;
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

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header & Search */}
      <div className="bg-surface border border-border rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-accent" />
              <h1 className="text-xl md:text-2xl font-extrabold text-text">
                Daftar 114 Surat
              </h1>
            </div>
            <p className="text-xs text-text-muted mt-1">
              Jelajahi seluruh surat Al-Qur'an lengkap dengan audio murottal & arti
            </p>
          </div>

          <div className="flex items-center gap-1.5 self-start sm:self-auto bg-primary-soft/50 p-1 rounded-xl border border-border">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterType === 'all'
                  ? 'bg-primary-deep text-white shadow-xs'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Semua (114)
            </button>
            <button
              onClick={() => setFilterType('mekah')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterType === 'mekah'
                  ? 'bg-primary-deep text-white shadow-xs'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Makkiyyah
            </button>
            <button
              onClick={() => setFilterType('madinah')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filterType === 'madinah'
                  ? 'bg-primary-deep text-white shadow-xs'
                  : 'text-text-muted hover:text-text'
              }`}
            >
              Madaniyyah
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama surat (mis. Yasin, Al-Mulk, Al-Baqarah) atau nomor..."
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

      {/* Surah List Grid */}
      {!loading && (
        <>
          {filteredSurahs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {filteredSurahs.map((surah) => (
                <SurahCard
                  key={surah.nomor}
                  surah={surah}
                  onOpen={onOpenSurah}
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
    </div>
  );
};
