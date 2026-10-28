import React, { useState } from 'react';
import {
  Bookmark,
  Share2,
  Copy,
  Check,
  BookOpen,
  FileText,
  Play,
  Pause,
  CheckCircle2,
} from 'lucide-react';
import { AyahItem, UserSettings } from '../../types/quran';
import { APP_CONFIG } from '../../config/appConfig';

interface AyahCardProps {
  surahNumber: number;
  surahName: string;
  ayah: AyahItem;
  settings: UserSettings;
  isBookmarked: boolean;
  hasNote: boolean;
  isReadToday: boolean;
  isPlayingAudio: boolean;
  onToggleBookmark: () => void;
  onOpenTafsir: () => void;
  onOpenNote: () => void;
  onPlayAyah: () => void;
  onMarkRead: () => void;
}

export const AyahCard: React.FC<AyahCardProps> = ({
  surahNumber,
  surahName,
  ayah,
  settings,
  isBookmarked,
  hasNote,
  isReadToday,
  isPlayingAudio,
  onToggleBookmark,
  onOpenTafsir,
  onOpenNote,
  onPlayAyah,
  onMarkRead,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = `${ayah.teksArab}\n\n"${ayah.teksIndonesia}"\n\n(QS. ${surahName} [${surahNumber}]: Ayat ${ayah.nomorAyat})`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: `QS. ${surahName}: ${ayah.nomorAyat}`,
      text: `${ayah.teksArab}\n\n"${ayah.teksIndonesia}"\n(QS. ${surahName}: ${ayah.nomorAyat}) - ${APP_CONFIG.appName}`,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // dismissed
      }
    } else {
      handleCopy();
    }
  };

  return (
    <article
      id={`ayah-${ayah.nomorAyat}`}
      className={`relative bg-surface border rounded-2xl p-5 md:p-6 transition-all duration-300 ${
        isPlayingAudio
          ? 'border-accent ring-2 ring-accent/30 bg-primary-soft/20 shadow-md'
          : 'border-border hover:border-primary/50'
      }`}
    >
      {/* Top Toolbar: Ayah Number & Quick Actions */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-divider/60">
        <div className="flex items-center gap-2.5">
          {/* Ayah number badge */}
          <div className="relative w-8 h-8 rounded-full bg-primary-soft flex items-center justify-center border border-border">
            <span className="text-xs font-bold text-accent-deep">{ayah.nomorAyat}</span>
          </div>
          <span className="text-xs font-medium text-text-muted">
            {surahName} : {ayah.nomorAyat}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Tilawah Daily Target Tick */}
          <button
            onClick={onMarkRead}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isReadToday
                ? 'text-success bg-success/10 font-medium'
                : 'text-text-muted hover:text-success hover:bg-success/10'
            }`}
            title={isReadToday ? 'Sudah dibaca hari ini' : 'Tandai sudah dibaca hari ini'}
            aria-label="Tandai tilawah hari ini"
          >
            <CheckCircle2 className={`w-4 h-4 ${isReadToday ? 'fill-success/20' : ''}`} />
          </button>

          {/* Audio per ayah */}
          <button
            onClick={onPlayAyah}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isPlayingAudio
                ? 'text-white bg-primary-deep'
                : 'text-text-muted hover:text-primary-deep hover:bg-primary-soft'
            }`}
            title={isPlayingAudio ? 'Jeda Audio Ayat' : 'Putar Audio Ayat'}
            aria-label="Putar audio ayat ini"
          >
            {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          {/* Tafsir */}
          <button
            onClick={onOpenTafsir}
            className="p-1.5 rounded-lg text-text-muted hover:text-accent-deep hover:bg-primary-soft transition-colors cursor-pointer"
            title="Lihat Tafsir Kemenag"
            aria-label="Buka tafsir ayat"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          {/* Personal Note */}
          <button
            onClick={onOpenNote}
            className={`relative p-1.5 rounded-lg transition-colors cursor-pointer ${
              hasNote
                ? 'text-accent-deep bg-accent-light/30'
                : 'text-text-muted hover:text-accent-deep hover:bg-primary-soft'
            }`}
            title={hasNote ? 'Edit Catatan Tadabbur' : 'Tulis Catatan Tadabbur'}
            aria-label="Catatan ayat"
          >
            <FileText className="w-4 h-4" />
            {hasNote && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent" />
            )}
          </button>

          {/* Bookmark */}
          <button
            onClick={onToggleBookmark}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              isBookmarked
                ? 'text-accent fill-accent bg-accent-light/20'
                : 'text-text-muted hover:text-accent hover:bg-primary-soft'
            }`}
            title={isBookmarked ? 'Hapus dari Bookmark' : 'Simpan ke Bookmark'}
            aria-label="Bookmark ayat"
          >
            <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-accent' : ''}`} />
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-primary-soft transition-colors cursor-pointer"
            title={copied ? 'Tersalin!' : 'Salin Ayat'}
            aria-label="Salin teks ayat"
          >
            {copied ? <Check className="w-4 h-4 text-success" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Share */}
          <button
            onClick={handleShare}
            className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-primary-soft transition-colors cursor-pointer"
            title="Bagikan Ayat"
            aria-label="Bagikan ayat"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Arabic Verse Text */}
      <div className="py-5">
        <p
          className="font-quran text-right text-text select-text"
          style={{
            fontSize: `${settings.arabicFontSize}px`,
            lineHeight: 2.4,
          }}
          dir="rtl"
          lang="ar"
        >
          {ayah.teksArab}
          <span className="inline-flex items-center justify-center w-8 h-8 mx-2 text-xs font-sans text-accent font-semibold border border-accent/40 rounded-full align-middle select-none bg-primary-soft/40">
            {ayah.nomorAyat}
          </span>
        </p>
      </div>

      {/* Latin Transliteration */}
      {settings.showTransliteration && ayah.teksLatin && (
        <div className="pt-2 text-xs md:text-sm text-accent-deep/90 italic font-medium leading-relaxed">
          {ayah.teksLatin}
        </div>
      )}

      {/* Indonesian Translation */}
      {settings.showTranslation && (
        <div
          className="pt-2.5 text-text leading-relaxed border-t border-divider/40 mt-3"
          style={{ fontSize: `${settings.translationFontSize}px` }}
        >
          {ayah.teksIndonesia}
        </div>
      )}
    </article>
  );
};
