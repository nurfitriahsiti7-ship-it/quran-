import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

import { APP_CONFIG } from '../../config/appConfig';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-primary-deep text-white shadow-sm hover:brightness-105 active:scale-95 transition-all cursor-pointer"
        title={`Pasang aplikasi ${APP_CONFIG.appName} di perangkat Anda`}
        aria-label={`Install Aplikasi ${APP_CONFIG.appName}`}
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border border-border bg-surface text-text hover:bg-primary-soft transition-all cursor-pointer"
          title={`Petunjuk pasang ${APP_CONFIG.appName} di iOS`}
          aria-label={`Pasang ${APP_CONFIG.appName} di iPhone / iPad`}
        >
          <Smartphone className="w-3.5 h-3.5 text-accent" />
          <span>Install iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-200">
            <div className="w-full max-w-sm rounded-2xl bg-surface border border-border p-6 shadow-2xl relative">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-text-muted hover:bg-primary-soft transition"
                aria-label="Tutup"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <img
                  src="/assets/aistudio/Medali_Bundar_Kaligrafi_Al-Qur_an_425f345a.png"
                  alt={`${APP_CONFIG.appName} Medallion`}
                  className="w-12 h-12 rounded-full shadow-sm"
                />
                <div>
                  <h3 className="font-bold text-text text-base">Pasang {APP_CONFIG.appName} di iOS</h3>
                  <p className="text-xs text-text-muted">Gunakan offline kapan pun</p>
                </div>
              </div>

              <div className="text-xs text-text space-y-2.5 bg-primary-soft/50 p-3.5 rounded-xl border border-border">
                <p className="flex items-start gap-2">
                  <span className="font-bold text-accent">1.</span>
                  <span>Tekan tombol <strong>Bagikan (Share)</strong> di bar bawah Safari.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-accent">2.</span>
                  <span>Gulir ke bawah dan pilih <strong>Tambahkan ke Layar Utama (Add to Home Screen)</strong>.</span>
                </p>
                <p className="flex items-start gap-2">
                  <span className="font-bold text-accent">3.</span>
                  <span>Tekan <strong>Tambah</strong> di pojok kanan atas.</span>
                </p>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-primary-deep text-white font-medium text-xs shadow hover:brightness-105 transition"
              >
                Mengerti
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
