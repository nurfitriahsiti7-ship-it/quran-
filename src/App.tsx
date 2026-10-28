import React, { useEffect, useState } from 'react';
import { getAllSurahs } from './services/quranApi';
import { SurahListItem, UserSettings } from './types/quran';
import { getUserSettings, saveUserSettings } from './storage/storageService';
import {
  deriveThemeFromPrimary,
  applyThemeToDocument,
} from './styles/themeTokens';
import { APP_CONFIG } from './config/appConfig';
import { audioPlayer, AudioTrackInfo } from './services/audioService';

import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';
import { OfflineIndicator } from './components/layout/OfflineIndicator';
import { AudioPlayerBar } from './components/audio/AudioPlayerBar';

import { HomePage } from './pages/HomePage';
import { SurahListPage } from './pages/SurahListPage';
import { ReaderPage } from './pages/ReaderPage';
import { SearchPage } from './pages/SearchPage';
import { BookmarksPage } from './pages/BookmarksPage';
import { SettingsPage } from './pages/SettingsPage';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [surahs, setSurahs] = useState<SurahListItem[]>([]);
  const [loadingSurahs, setLoadingSurahs] = useState<boolean>(true);
  const [surahsError, setSurahsError] = useState<string | null>(null);

  // Reader state
  const [currentSurahNumber, setCurrentSurahNumber] = useState<number>(1);
  const [currentAyahNumber, setCurrentAyahNumber] = useState<number | undefined>(undefined);

  // Settings state
  const [settings, setSettings] = useState<UserSettings>(getUserSettings());

  // Initialize theme tokens from config or saved preference
  useEffect(() => {
    const primaryColor = settings.customPrimaryColor || APP_CONFIG.primaryColor;
    const initialPalette = deriveThemeFromPrimary(primaryColor);
    applyThemeToDocument(initialPalette);
  }, [settings.customPrimaryColor]);

  // Load 114 Surahs on startup
  const fetchSurahList = async () => {
    setLoadingSurahs(true);
    setSurahsError(null);
    try {
      const data = await getAllSurahs();
      setSurahs(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat daftar surat.';
      setSurahsError(msg);
    } finally {
      setLoadingSurahs(false);
    }
  };

  useEffect(() => {
    fetchSurahList();
  }, []);

  const handleUpdateSettings = (newSettings: UserSettings) => {
    setSettings(newSettings);
    saveUserSettings(newSettings);
  };

  const handleOpenSurah = (surahNumber: number, ayahNumber?: number) => {
    setCurrentSurahNumber(surahNumber);
    setCurrentAyahNumber(ayahNumber);
    setActiveTab('reader');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaySurah = (surah: SurahListItem) => {
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

  const [currentAudioState, setCurrentAudioState] = useState(audioPlayer.getState());
  useEffect(() => {
    const unsub = audioPlayer.subscribe(() => {
      setCurrentAudioState({ ...audioPlayer.getState() });
    });
    return unsub;
  }, []);

  return (
    <div className="min-h-screen bg-background text-text flex flex-col selection:bg-primary-soft selection:text-primary-deep">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenSurah={handleOpenSurah}
      />

      {/* Main Page Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-5 pb-24 md:pb-16">
        {activeTab === 'home' && (
          <HomePage
            onOpenSurah={handleOpenSurah}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onPlaySurahId={(num) => {
              const target = surahs.find((s) => s.nomor === num);
              if (target) handlePlaySurah(target);
            }}
          />
        )}

        {activeTab === 'surah-list' && (
          <SurahListPage
            surahs={surahs}
            loading={loadingSurahs}
            error={surahsError}
            onRefresh={fetchSurahList}
            onOpenSurah={handleOpenSurah}
            onPlaySurah={handlePlaySurah}
            currentPlayingSurahNumber={
              currentAudioState.isPlaying ? currentAudioState.currentTrack?.surahNumber : undefined
            }
          />
        )}

        {activeTab === 'reader' && (
          <ReaderPage
            surahNumber={currentSurahNumber}
            initialAyahNumber={currentAyahNumber}
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onNavigateSurah={(num, ayah) => {
              setCurrentSurahNumber(num);
              setCurrentAyahNumber(ayah);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onBackToList={() => {
              setActiveTab('surah-list');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'search' && (
          <SearchPage
            surahs={surahs}
            onOpenSurah={handleOpenSurah}
          />
        )}

        {activeTab === 'bookmarks' && (
          <BookmarksPage
            onOpenSurah={handleOpenSurah}
            onNavigateTab={(tab) => {
              setActiveTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsPage
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onThemeColorChange={(color) => {
              const pal = deriveThemeFromPrimary(color);
              applyThemeToDocument(pal);
            }}
          />
        )}
      </main>

      {/* Floating Audio Mini Player */}
      <AudioPlayerBar
        onJumpToAyah={(sNum, aNum) => handleOpenSurah(sNum, aNum)}
        onQariChange={(newQari) => handleUpdateSettings({ ...settings, qariId: newQari })}
      />

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Offline Status Toast */}
      <OfflineIndicator />
    </div>
  );
}
