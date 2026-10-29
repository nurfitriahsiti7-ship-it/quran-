import React from 'react';
import { BookOpen, Search, Bookmark, Settings, Layers, Sparkles } from 'lucide-react';
import { APP_CONFIG } from '../../config/appConfig';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSurah?: (surahNumber: number) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onSelectTab }) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-surface/90 backdrop-blur-md border-b border-border transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand / Logo */}
        <button
          onClick={() => onSelectTab('home')}
          className="flex items-center gap-3 group text-left cursor-pointer shrink-0"
        >
          <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-full p-0.5 bg-gradient-to-tr from-accent to-primary flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
            <img
              src={APP_CONFIG.colorReference || '/icon.svg'}
              alt={`${APP_CONFIG.appName} Medallion`}
              className="w-full h-full object-cover rounded-full"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl text-text tracking-tight group-hover:text-primary-deep transition-colors">
                {APP_CONFIG.appName}
              </span>
              <span className="text-[11px] font-semibold text-accent-deep tracking-wider uppercase hidden sm:inline">
                Digital
              </span>
            </div>
            <p className="text-[11px] text-text-muted hidden md:block leading-none">
              Membaca & Memahami Al-Qur'an 30 Juz
            </p>
          </div>
        </button>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 shrink-0">
          <button
            onClick={() => onSelectTab('home')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'home'
                ? 'bg-primary-soft text-primary-deep shadow-xs font-bold'
                : 'text-text-muted hover:text-text hover:bg-primary-soft/40'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Beranda</span>
          </button>

          <button
            onClick={() => onSelectTab('surah-list')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'surah-list' || activeTab === 'reader'
                ? 'bg-primary-soft text-primary-deep shadow-xs font-bold'
                : 'text-text-muted hover:text-text hover:bg-primary-soft/40'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>114 Surat & 30 Juz</span>
          </button>

          <button
            onClick={() => onSelectTab('search')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'search'
                ? 'bg-primary-soft text-primary-deep shadow-xs font-bold'
                : 'text-text-muted hover:text-text hover:bg-primary-soft/40'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Pencarian</span>
          </button>

          <button
            onClick={() => onSelectTab('bookmarks')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'bookmarks'
                ? 'bg-primary-soft text-primary-deep shadow-xs font-bold'
                : 'text-text-muted hover:text-text hover:bg-primary-soft/40'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Tersimpan</span>
          </button>

          <button
            onClick={() => onSelectTab('settings')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              activeTab === 'settings'
                ? 'bg-primary-soft text-primary-deep shadow-xs font-bold'
                : 'text-text-muted hover:text-text hover:bg-primary-soft/40'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Pengaturan</span>
          </button>
        </nav>

        {/* Action button: PWA Install */}
        <div className="flex items-center gap-2">
          <PWAInstallButton />
        </div>
      </div>
    </header>
  );
};
