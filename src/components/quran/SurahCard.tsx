import React from 'react';
import { Play, Volume2, ArrowRight } from 'lucide-react';
import { SurahListItem } from '../../types/quran';

interface SurahCardProps {
  surah: SurahListItem;
  onOpen: (surahNumber: number) => void;
  onPlaySurah: (surah: SurahListItem) => void;
  isPlaying?: boolean;
}

export const SurahCard: React.FC<SurahCardProps> = ({
  surah,
  onOpen,
  onPlaySurah,
  isPlaying = false,
}) => {
  return (
    <div
      onClick={() => onOpen(surah.nomor)}
      className="group relative bg-surface border border-border/80 rounded-2xl p-4.5 transition-all duration-200 hover:border-primary-deep/50 hover:shadow-md hover:-translate-y-0.5 cursor-pointer flex items-center justify-between gap-3 overflow-hidden"
    >
      {/* Decorative gentle corner glow */}
      <div className="absolute -right-8 -top-8 w-24 h-24 rounded-full bg-primary-soft/30 blur-xl group-hover:bg-primary-soft/60 transition-all pointer-events-none" />

      <div className="flex items-center gap-3.5 min-w-0 z-10">
        {/* Rub-el-Hizb (8-pointed Islamic star) Number Badge */}
        <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
          {/* Dual overlapping squares creating 8-pointed star */}
          <div className="absolute inset-1 rounded-sm border border-accent/40 bg-primary-soft/40 group-hover:bg-primary-soft/80 transition-colors shadow-2xs" />
          <div className="absolute inset-1 rotate-45 rounded-sm border border-accent/40 bg-primary-soft/40 group-hover:bg-primary-soft/80 transition-colors shadow-2xs" />
          <span className="relative z-10 text-xs font-black text-accent-deep">
            {surah.nomor}
          </span>
        </div>

        {/* Latin name, translation & revelation place */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-sm text-text truncate group-hover:text-primary-deep transition-colors">
              {surah.namaLatin}
            </h3>
            <span
              className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                surah.tempatTurun.toLowerCase() === 'mekah'
                  ? 'bg-primary-soft text-primary-deep border border-primary/20'
                  : 'bg-accent-light/30 text-accent-deep border border-accent/20'
              }`}
            >
              {surah.tempatTurun}
            </span>
          </div>

          <p className="text-xs text-text-muted truncate mt-0.5">
            {surah.arti} • <span className="font-semibold text-text/80">{surah.jumlahAyat} Ayat</span>
          </p>
        </div>
      </div>

      {/* Arabic Calligraphic Name & Quick Audio */}
      <div className="flex items-center gap-2.5 shrink-0 z-10">
        <span className="font-quran text-xl font-bold text-accent-deep tracking-wide group-hover:scale-105 transition-transform" dir="rtl">
          {surah.nama}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlaySurah(surah);
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isPlaying
              ? 'bg-primary-deep text-white shadow-sm ring-2 ring-primary-deep/30'
              : 'text-text-muted hover:text-primary-deep hover:bg-primary-soft/80 border border-border/60 bg-surface'
          }`}
          title={isPlaying ? 'Sedang Diputar' : `Putar Murottal Surat ${surah.namaLatin}`}
          aria-label={`Putar audio Surat ${surah.namaLatin}`}
        >
          {isPlaying ? (
            <Volume2 className="w-4 h-4 animate-pulse" />
          ) : (
            <Play className="w-3.5 h-3.5 ml-0.5" />
          )}
        </button>
      </div>
    </div>
  );
};
