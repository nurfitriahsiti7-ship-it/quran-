import React from 'react';
import { Home, Layers, Search, Bookmark, Settings } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'surah-list', label: '114 Surat', icon: Layers },
    { id: 'search', label: 'Cari', icon: Search },
    { id: 'bookmarks', label: 'Tersimpan', icon: Bookmark },
    { id: 'settings', label: 'Pengaturan', icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface/95 backdrop-blur-md border-t border-border shadow-lg pb-[max(env(safe-area-inset-bottom),0.35rem)]">
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id || (tab.id === 'surah-list' && activeTab === 'reader');
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center min-h-[44px] gap-1 transition-colors relative cursor-pointer active:scale-95 ${
                isActive ? 'text-primary-deep' : 'text-text-muted hover:text-text'
              }`}
              aria-label={tab.label}
            >
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 rounded-full bg-primary-deep" />
              )}
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-semibold tracking-tight">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
