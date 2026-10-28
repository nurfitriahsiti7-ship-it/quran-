import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:bottom-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-amber-800/95 text-amber-50 backdrop-blur-sm shadow-lg text-xs font-medium border border-amber-600/40 animate-in slide-in-from-bottom-2 duration-200"
    >
      <WifiOff className="w-4 h-4 text-amber-300 animate-pulse shrink-0" />
      <span>Mode Offline — Anda tetap dapat membaca surah & tafsir yang telah tersimpan di cache.</span>
    </div>
  );
};
