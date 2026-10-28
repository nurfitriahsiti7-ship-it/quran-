import React, { useEffect, useState, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Volume2,
  AlertCircle,
  RefreshCw,
  Sliders,
  Type,
  ArrowUp,
} from 'lucide-react';
import { getSurahDetail } from '../services/quranApi';
import { SurahDetail, UserSettings, AyahItem } from '../types/quran';
import {
  isAyahBookmarked,
  saveBookmark,
  removeBookmark,
  setLastRead,
  markAyahRead,
  getDailyProgress,
  getNotes,
} from '../storage/storageService';
import { audioPlayer, AudioTrackInfo } from '../services/audioService';
import { useAutoScroll } from '../hooks/useAutoScroll';
import { AyahCard } from '../components/quran/AyahCard';
import { TafsirModal } from '../components/quran/TafsirModal';
import { NoteModal } from '../components/quran/NoteModal';
import { AutoScrollControls } from '../components/quran/AutoScrollControls';

interface ReaderPageProps {
  surahNumber: number;
  initialAyahNumber?: number;
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onNavigateSurah: (surahNumber: number, ayahNumber?: number) => void;
  onBackToList: () => void;
}

export const ReaderPage: React.FC<ReaderPageProps> = ({
  surahNumber,
  initialAyahNumber,
  settings,
  onUpdateSettings,
  onNavigateSurah,
  onBackToList,
}) => {
  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modals state
  const [activeTafsirAyah, setActiveTafsirAyah] = useState<number | null>(null);
  const [activeNoteAyah, setActiveNoteAyah] = useState<{
    ayahNumber: number;
    textArab: string;
  } | null>(null);

  // Bookmarks & notes reactive states
  const [bookmarkIds, setBookmarkIds] = useState<Set<number>>(new Set());
  const [notedAyahIds, setNotedAyahIds] = useState<Set<number>>(new Set());
  const [readAyahsToday, setReadAyahsToday] = useState<Set<string>>(new Set());

  // Audio track state
  const [playingAyahNumber, setPlayingAyahNumber] = useState<number | null>(null);
  const [showTypographyControls, setShowTypographyControls] = useState(false);

  // Auto-scroll hook
  const { isScrolling, speed, toggle: toggleScroll, pause: pauseScroll, changeSpeed } = useAutoScroll(
    settings.autoScrollSpeed || 2
  );

  // Load surah detail
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function loadData() {
      setLoading(true);
      setError(null);
      pauseScroll();

      try {
        const data = await getSurahDetail(surahNumber, controller.signal);
        if (isMounted) {
          setSurah(data);
          setLoading(false);

          // Update last read position
          setLastRead({
            surahNumber: data.nomor,
            surahName: data.namaLatin,
            ayahNumber: initialAyahNumber || 1,
            totalAyah: data.jumlahAyat,
            updatedAt: Date.now(),
          });
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : 'Gagal memuat surat.';
          setError(message);
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [surahNumber]);

  // Refresh reactive bookmark and note markers
  const refreshLocalState = () => {
    if (!surah) return;
    const bSet = new Set<number>();
    surah.ayat.forEach((a) => {
      if (isAyahBookmarked(surah.nomor, a.nomorAyat)) {
        bSet.add(a.nomorAyat);
      }
    });
    setBookmarkIds(bSet);

    const notes = getNotes();
    const nSet = new Set<number>();
    notes.forEach((n) => {
      if (n.surahNumber === surah.nomor) {
        nSet.add(n.ayahNumber);
      }
    });
    setNotedAyahIds(nSet);

    const daily = getDailyProgress();
    setReadAyahsToday(new Set(daily.readKeys));
  };

  useEffect(() => {
    refreshLocalState();
  }, [surah]);

  // Scroll to initial ayah if specified
  useEffect(() => {
    if (!loading && surah && initialAyahNumber && initialAyahNumber > 1) {
      setTimeout(() => {
        const el = document.getElementById(`ayah-${initialAyahNumber}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 350);
    }
  }, [loading, surah, initialAyahNumber]);

  // Sync audio player active ayah
  useEffect(() => {
    const unsub = audioPlayer.subscribe(() => {
      const state = audioPlayer.getState();
      if (
        state.currentTrack &&
        state.currentTrack.surahNumber === surahNumber &&
        state.currentTrack.ayahNumber &&
        state.isPlaying
      ) {
        setPlayingAyahNumber(state.currentTrack.ayahNumber);
      } else {
        setPlayingAyahNumber(null);
      }
    });
    return unsub;
  }, [surahNumber]);

  // Handlers
  const handleToggleBookmark = (ayah: AyahItem) => {
    if (!surah) return;
    const isSaved = bookmarkIds.has(ayah.nomorAyat);
    const id = `surah-${surah.nomor}-ayah-${ayah.nomorAyat}`;
    if (isSaved) {
      removeBookmark(id);
    } else {
      saveBookmark({
        id,
        surahNumber: surah.nomor,
        surahName: surah.namaLatin,
        ayahNumber: ayah.nomorAyat,
        textArab: ayah.teksArab,
        textTranslation: ayah.teksIndonesia,
        createdAt: Date.now(),
      });
    }
    refreshLocalState();
  };

  const handleMarkAyahRead = (ayahNumber: number) => {
    if (!surah) return;
    markAyahRead(surah.nomor, ayahNumber);
    refreshLocalState();
  };

  const handlePlayFullSurah = () => {
    if (!surah) return;
    const qariKey = settings.qariId || '05';
    const audioUrl =
      surah.audioFull[qariKey] ||
      surah.audioFull['05'] ||
      Object.values(surah.audioFull)[0];

    const track: AudioTrackInfo = {
      mode: 'surah',
      surahNumber: surah.nomor,
      surahName: surah.namaLatin,
      totalAyat: surah.jumlahAyat,
      qariId: qariKey,
      url: audioUrl,
    };
    audioPlayer.playTrack(track);
  };

  const handlePlayAyah = (ayah: AyahItem) => {
    if (!surah) return;
    const qariKey = settings.qariId || '05';
    const audioUrl =
      ayah.audio[qariKey] ||
      ayah.audio['05'] ||
      Object.values(ayah.audio)[0];

    if (playingAyahNumber === ayah.nomorAyat) {
      audioPlayer.togglePlay();
      return;
    }

    const track: AudioTrackInfo = {
      mode: 'ayah',
      surahNumber: surah.nomor,
      surahName: surah.namaLatin,
      ayahNumber: ayah.nomorAyat,
      totalAyat: surah.jumlahAyat,
      qariId: qariKey,
      url: audioUrl,
    };

    // Auto next ayah playback
    const onEnded = () => {
      const nextAyahNum = ayah.nomorAyat + 1;
      const nextAyah = surah.ayat.find((a) => a.nomorAyat === nextAyahNum);
      if (nextAyah) {
        handlePlayAyah(nextAyah);
        const el = document.getElementById(`ayah-${nextAyahNum}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    };

    audioPlayer.playTrack(track, onEnded);
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="py-24 text-center space-y-4 animate-in fade-in">
        <RefreshCw className="w-10 h-10 text-primary-deep animate-spin mx-auto" />
        <div>
          <h3 className="font-bold text-base text-text">Memuat Surat...</h3>
          <p className="text-xs text-text-muted mt-1">Mengambil ayat dan audio resmi</p>
        </div>
      </div>
    );
  }

  if (error || !surah) {
    return (
      <div className="p-8 rounded-3xl bg-red-50 border border-red-200 text-red-900 text-center space-y-4 max-w-lg mx-auto mt-12">
        <AlertCircle className="w-10 h-10 text-red-600 mx-auto" />
        <div>
          <h3 className="font-bold text-lg">Gagal Memuat Surat</h3>
          <p className="text-xs text-red-700 mt-1">{error || 'Data surat tidak ditemukan.'}</p>
        </div>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onBackToList}
            className="px-4 py-2 border border-border rounded-xl text-xs font-semibold text-text hover:bg-white transition"
          >
            Kembali ke Daftar
          </button>
          <button
            onClick={() => onNavigateSurah(surahNumber)}
            className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-semibold shadow hover:bg-red-700 transition"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  // Islamic rule: Display Basmalah banner on all surahs EXCEPT:
  // 1. At-Taubah (Surat 9) - strictly prohibited
  // 2. Al-Fatihah (Surat 1) - Basmalah is already Verse 1
  const shouldShowBasmalahBanner = surah.nomor !== 9 && surah.nomor !== 1;

  return (
    <div className="space-y-6 pb-28 animate-in fade-in duration-300">
      {/* Top Navigation & Toolbar Bar */}
      <div className="sticky top-16 z-30 bg-surface/95 backdrop-blur-md border border-border rounded-2xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToList}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-border text-xs font-semibold text-text hover:bg-primary-soft transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Daftar Surat</span>
          </button>

          {/* Surah dropdown selector */}
          <div className="flex items-center gap-1 text-xs font-bold text-text">
            <span>#{surah.nomor}</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-primary-deep">{surah.namaLatin}</span>
          </div>
        </div>

        {/* Center / Right controls: AutoScroll, Typography, Ayah Jump */}
        <div className="flex items-center gap-2">
          {/* Auto Scroll Controls */}
          <AutoScrollControls
            isScrolling={isScrolling}
            speed={speed}
            onToggle={toggleScroll}
            onStop={pauseScroll}
            onChangeSpeed={(s) => {
              changeSpeed(s);
              onUpdateSettings({ ...settings, autoScrollSpeed: s });
            }}
          />

          {/* Typography Adjuster Toggle */}
          <button
            onClick={() => setShowTypographyControls(!showTypographyControls)}
            className={`p-2 rounded-xl border transition cursor-pointer ${
              showTypographyControls
                ? 'bg-primary-soft border-primary-deep text-primary-deep'
                : 'border-border text-text hover:bg-primary-soft'
            }`}
            title="Pengaturan Ukuran Font & Tampilan"
            aria-label="Atur ukuran font"
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Ayah Jump Selector */}
          <select
            value=""
            onChange={(e) => {
              const ayahNum = parseInt(e.target.value);
              if (ayahNum) {
                const el = document.getElementById(`ayah-${ayahNum}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            className="px-2.5 py-1.5 rounded-xl border border-border bg-background text-xs font-semibold text-text focus:outline-none focus:ring-1 focus:ring-primary-deep cursor-pointer"
          >
            <option value="">Lompat Ayat...</option>
            {surah.ayat.map((a) => (
              <option key={a.nomorAyat} value={a.nomorAyat}>
                Ayat {a.nomorAyat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Floating Typography Settings Drawer if opened */}
      {showTypographyControls && (
        <div className="bg-surface border border-border rounded-2xl p-4 shadow-lg animate-in slide-in-from-top-2 duration-200 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-border">
            <h4 className="text-xs font-bold uppercase tracking-wider text-accent-deep flex items-center gap-1.5">
              <Type className="w-4 h-4" />
              <span>Pengaturan Teks & Keterbacaan</span>
            </h4>
            <button
              onClick={() => setShowTypographyControls(false)}
              className="text-xs text-text-muted hover:text-text cursor-pointer"
            >
              Tutup
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            {/* Arabic Font Size */}
            <div className="space-y-1.5">
              <span className="font-semibold text-text block">
                Ukuran Teks Arab: {settings.arabicFontSize}px
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    onUpdateSettings({
                      ...settings,
                      arabicFontSize: Math.max(22, settings.arabicFontSize - 2),
                    })
                  }
                  className="px-2.5 py-1 bg-primary-soft rounded-lg font-bold hover:bg-primary-deep hover:text-white transition"
                >
                  A-
                </button>
                <input
                  type="range"
                  min={22}
                  max={44}
                  step={2}
                  value={settings.arabicFontSize}
                  onChange={(e) =>
                    onUpdateSettings({
                      ...settings,
                      arabicFontSize: parseInt(e.target.value),
                    })
                  }
                  className="w-full accent-primary-deep"
                />
                <button
                  onClick={() =>
                    onUpdateSettings({
                      ...settings,
                      arabicFontSize: Math.min(44, settings.arabicFontSize + 2),
                    })
                  }
                  className="px-2.5 py-1 bg-primary-soft rounded-lg font-bold hover:bg-primary-deep hover:text-white transition"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Translation Font Size */}
            <div className="space-y-1.5">
              <span className="font-semibold text-text block">
                Ukuran Terjemahan: {settings.translationFontSize}px
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    onUpdateSettings({
                      ...settings,
                      translationFontSize: Math.max(13, settings.translationFontSize - 1),
                    })
                  }
                  className="px-2.5 py-1 bg-primary-soft rounded-lg font-bold hover:bg-primary-deep hover:text-white transition"
                >
                  -
                </button>
                <input
                  type="range"
                  min={13}
                  max={22}
                  value={settings.translationFontSize}
                  onChange={(e) =>
                    onUpdateSettings({
                      ...settings,
                      translationFontSize: parseInt(e.target.value),
                    })
                  }
                  className="w-full accent-primary-deep"
                />
                <button
                  onClick={() =>
                    onUpdateSettings({
                      ...settings,
                      translationFontSize: Math.min(22, settings.translationFontSize + 1),
                    })
                  }
                  className="px-2.5 py-1 bg-primary-soft rounded-lg font-bold hover:bg-primary-deep hover:text-white transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Transliteration Toggle */}
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <span className="font-semibold text-text">Transliterasi Latin:</span>
              <button
                onClick={() =>
                  onUpdateSettings({
                    ...settings,
                    showTransliteration: !settings.showTransliteration,
                  })
                }
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  settings.showTransliteration
                    ? 'bg-primary-deep text-white'
                    : 'bg-primary-soft text-text-muted'
                }`}
              >
                {settings.showTransliteration ? 'Aktif' : 'Nonaktif'}
              </button>
            </div>

            {/* Translation Toggle */}
            <div className="flex items-center justify-between sm:justify-start gap-3">
              <span className="font-semibold text-text">Terjemahan Indo:</span>
              <button
                onClick={() =>
                  onUpdateSettings({
                    ...settings,
                    showTranslation: !settings.showTranslation,
                  })
                }
                className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer ${
                  settings.showTranslation
                    ? 'bg-primary-deep text-white'
                    : 'bg-primary-soft text-text-muted'
                }`}
              >
                {settings.showTranslation ? 'Aktif' : 'Nonaktif'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Surah Header Card Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-surface border border-border p-6 md:p-8 text-center space-y-3 shadow-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary-deep text-xs font-semibold">
          <span>Surat ke-{surah.nomor}</span>
          <span>•</span>
          <span>{surah.tempatTurun}</span>
          <span>•</span>
          <span>{surah.jumlahAyat} Ayat</span>
        </div>

        <h1 className="text-2xl md:text-3xl font-extrabold text-text">
          {surah.namaLatin}
        </h1>
        <p className="font-quran text-2xl md:text-3xl text-accent-deep font-bold" dir="rtl">
          {surah.nama}
        </p>
        <p className="text-xs md:text-sm text-text-muted max-w-xl mx-auto">
          "{surah.arti}"
        </p>

        {/* Quick Action: Play Surah Audio */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={handlePlayFullSurah}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary-deep text-white text-xs font-semibold shadow hover:brightness-105 active:scale-95 transition cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>Dengarkan Surat Penuh</span>
          </button>
          <button
            onClick={() => setActiveTafsirAyah(1)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-border bg-surface text-text hover:bg-primary-soft text-xs font-semibold transition cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-accent" />
            <span>Tafsir Lengkap</span>
          </button>
        </div>
      </div>

      {/* Decorative Basmalah Banner */}
      {shouldShowBasmalahBanner && (
        <div className="py-6 text-center select-none">
          <div className="inline-block px-8 py-3 rounded-2xl bg-surface border border-accent/30 shadow-xs">
            <p className="font-quran text-2xl md:text-3xl text-text font-bold" dir="rtl">
              بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
            </p>
            <p className="text-[11px] text-text-muted mt-1 italic">
              Dengan nama Allah Yang Maha Pengasih, Maha Penyayang
            </p>
          </div>
        </div>
      )}

      {/* List of Ayat */}
      <div className="space-y-4">
        {surah.ayat.map((ayah) => (
          <AyahCard
            key={ayah.nomorAyat}
            surahNumber={surah.nomor}
            surahName={surah.namaLatin}
            ayah={ayah}
            settings={settings}
            isBookmarked={bookmarkIds.has(ayah.nomorAyat)}
            hasNote={notedAyahIds.has(ayah.nomorAyat)}
            isReadToday={readAyahsToday.has(`${surah.nomor}:${ayah.nomorAyat}`)}
            isPlayingAudio={playingAyahNumber === ayah.nomorAyat}
            onToggleBookmark={() => handleToggleBookmark(ayah)}
            onOpenTafsir={() => setActiveTafsirAyah(ayah.nomorAyat)}
            onOpenNote={() =>
              setActiveNoteAyah({
                ayahNumber: ayah.nomorAyat,
                textArab: ayah.teksArab,
              })
            }
            onPlayAyah={() => handlePlayAyah(ayah)}
            onMarkRead={() => handleMarkAyahRead(ayah.nomorAyat)}
          />
        ))}
      </div>

      {/* Navigation Footer: Prev Surah / Next Surah */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        {surah.suratSebelumnya ? (
          <button
            onClick={() => onNavigateSurah(surah.suratSebelumnya ? surah.suratSebelumnya.nomor : 1)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-surface text-text hover:bg-primary-soft text-xs font-semibold transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <div className="text-left">
              <span className="text-[10px] text-text-muted block">Sebelumnya</span>
              <span>{surah.suratSebelumnya.namaLatin}</span>
            </div>
          </button>
        ) : (
          <div />
        )}

        <button
          onClick={handleScrollToTop}
          className="p-3 rounded-full bg-primary-soft text-primary-deep hover:bg-primary-deep hover:text-white transition shadow-xs cursor-pointer"
          title="Kembali ke Atas"
          aria-label="Kembali ke atas halaman"
        >
          <ArrowUp className="w-4 h-4" />
        </button>

        {surah.suratSelanjutnya ? (
          <button
            onClick={() => onNavigateSurah(surah.suratSelanjutnya ? surah.suratSelanjutnya.nomor : 1)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-surface text-text hover:bg-primary-soft text-xs font-semibold transition cursor-pointer"
          >
            <div className="text-right">
              <span className="text-[10px] text-text-muted block">Selanjutnya</span>
              <span>{surah.suratSelanjutnya.namaLatin}</span>
            </div>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div />
        )}
      </div>

      {/* Modals */}
      {activeTafsirAyah !== null && (
        <TafsirModal
          surahNumber={surah.nomor}
          surahName={surah.namaLatin}
          initialAyahNumber={activeTafsirAyah}
          onClose={() => setActiveTafsirAyah(null)}
        />
      )}

      {activeNoteAyah !== null && (
        <NoteModal
          surahNumber={surah.nomor}
          surahName={surah.namaLatin}
          ayahNumber={activeNoteAyah.ayahNumber}
          textArab={activeNoteAyah.textArab}
          onClose={() => setActiveNoteAyah(null)}
          onSaved={() => refreshLocalState()}
        />
      )}
    </div>
  );
};
