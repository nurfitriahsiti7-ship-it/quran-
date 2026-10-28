import React from 'react';
import { Play, Volume2 } from 'lucide-react';
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
      className="group relative bg-surface border border-border rounded-2xl p-4 transition-all duration-200 hover:border-primary-deep/40 hover:shadow-md hover:-translate-y-0.5 cursor-pointer flex items-center justify-between gap-3"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Number Badge with 8-pointed star / medallion style */}
        <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
          <div className="absolute inset-0 rotate-45 rounded-lg border border-accent/40 bg-primary-soft/50 group-hover:bg-primary-soft transition-colors" />
          <span className="relative z-10 text-xs font-extrabold text-accent-deep">
            {surah.nomor}
          </span>
        </div>

        {/* Latin name, translation & place */}
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-text truncate group-hover:text-primary-deep transition-colors">
              {surah.namaLatin}
            </h3>
            <span
              className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                surah.tempatTurun.toLowerCase() === 'mekah'
                  ? 'bg-primary-soft text-primary-deep'
                  : 'bg-accent-light/30 text-accent-deep'
              }`}
            >
              {surah.tempatTurun}
            </span>
          </div>

          <p className="text-xs text-text-muted truncate mt-0.5">
            {surah.arti} • {surah.jumlahAyat} Ayat
          </p>
        </div>
      </div>

      {/* Arabic Name & Quick Audio */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="font-quran text-lg font-bold text-accent-deep tracking-wide group-hover:scale-105 transition-transform">
          {surah.nama}
        </span>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlaySurah(surah);
          }}
          className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
            isPlaying
              ? 'bg-primary-deep text-white shadow-xs'
              : 'text-text-muted hover:text-primary-deep hover:bg-primary-soft'
          }`}
          title={isPlaying ? 'Sedang Diputar' : `Putar Surat ${surah.namaLatin}`}
          aria-label={`Putar audio Surat ${surah.namaLatin}`}
        >
          {isPlaying ? (
            <Volume2 className="w-4 h-4 animate-pulse" />
          ) : (
            <Play className="w-4 h-4 ml-0.5" />
          )}
        </button>
      </div>
    </div>
  );
};
