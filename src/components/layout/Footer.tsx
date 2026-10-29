import React from 'react';
import { HeartHandshake, ShieldCheck, Sparkles, BookOpen, Layers, Search, Settings } from 'lucide-react';
import { APP_CONFIG } from '../../config/appConfig';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  const partners = [
    {
      name: 'Yayasan Karya Pondok Mandiri',
      desc: 'Pendidikan & Sosial',
      image: '/assets/logos/yayasan_karya_pondok_mandiri.png',
      alt: 'Logo Yayasan Karya Pondok Mandiri',
    },
    {
      name: 'EMBI TECH COMPUTINDO',
      desc: 'Solusi Digital & Teknologi',
      image: '/assets/logos/embi_tech_computindo.png',
      alt: 'Logo Embi Tech Computindo',
    },
    {
      name: 'BBPVP BEKASI',
      desc: 'Pelatihan Vokasi & Produktivitas',
      image: '/assets/logos/bbpvp_bekasi.png',
      alt: 'Logo BBPVP Bekasi',
    },
  ];

  return (
    <footer className="w-full bg-surface/80 border-t border-border mt-10 transition-colors">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-8">
        {/* Header Kemitraan */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-soft/60 text-primary-deep text-xs font-semibold">
            <HeartHandshake className="w-3.5 h-3.5 text-accent" />
            <span>Kolaborasi & Kemitraan</span>
          </div>
          <p className="text-xs text-text-muted">
            Dipersembahkan bersama untuk kemudahan membaca & memahami Al-Qur'an
          </p>
        </div>

        {/* 3 KOLOM LOGO - TAMPILAN SIMPEL & BERSIH */}
        <div className="grid grid-cols-3 gap-3 sm:gap-6">
          {partners.map((item, idx) => (
            <div
              key={idx}
              className="group bg-surface border border-border/80 hover:border-primary-deep/40 rounded-2xl p-3 sm:p-5 flex flex-col items-center justify-between text-center shadow-2xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
            >
              {/* Logo Area */}
              <div className="w-full h-14 sm:h-20 flex items-center justify-center p-1 sm:p-2 bg-white rounded-xl border border-border/40">
                <img
                  src={item.image}
                  alt={item.alt}
                  className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-105"
                  onError={(e) => {
                    const fallback = [
                      '/assets/aistudio/Screenshot_20261029-112312_bb433de6.png',
                      '/assets/aistudio/Screenshot_20261029-112321_d6b36828.png',
                      '/assets/aistudio/Screenshot_20261029-112333_a8629014.png',
                    ];
                    (e.target as HTMLImageElement).src = fallback[idx];
                  }}
                />
              </div>

              {/* Text Info */}
              <div className="mt-2.5 sm:mt-3 space-y-0.5 w-full">
                <h4 className="font-bold text-[11px] sm:text-xs md:text-sm text-text leading-tight group-hover:text-primary-deep transition-colors line-clamp-2">
                  {item.name}
                </h4>
                <p className="text-[9px] sm:text-[11px] text-text-muted leading-tight line-clamp-1">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Brand & Tautan Ringkas */}
        <div className="pt-2 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          {/* Brand info */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full p-0.5 bg-gradient-to-tr from-accent to-primary flex items-center justify-center shrink-0">
              <img
                src="/assets/aistudio/Medali_Bundar_Kaligrafi_Al-Qur_an_425f345a.png"
                alt="Fit Qur'an"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm text-text tracking-tight">
                  {APP_CONFIG.appName}
                </span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-accent-light/30 text-accent-deep font-bold border border-accent/20">
                  Digital
                </span>
              </div>
              <p className="text-[11px] text-text-muted">
                114 Surat • 30 Juz • Audio Murottal 6 Qari • Tafsir Kemenag
              </p>
            </div>
          </div>

          {/* Quick Tab Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-1 text-xs">
            <button
              onClick={() => onNavigateTab('surah-list')}
              className="px-2.5 py-1 rounded-lg text-text-muted hover:text-text hover:bg-primary-soft/50 transition cursor-pointer"
            >
              114 Surat
            </button>
            <span className="text-border">•</span>
            <button
              onClick={() => onNavigateTab('search')}
              className="px-2.5 py-1 rounded-lg text-text-muted hover:text-text hover:bg-primary-soft/50 transition cursor-pointer"
            >
              Pencarian
            </button>
            <span className="text-border">•</span>
            <button
              onClick={() => onNavigateTab('bookmarks')}
              className="px-2.5 py-1 rounded-lg text-text-muted hover:text-text hover:bg-primary-soft/50 transition cursor-pointer"
            >
              Bookmark
            </button>
            <span className="text-border">•</span>
            <button
              onClick={() => onNavigateTab('settings')}
              className="px-2.5 py-1 rounded-lg text-text-muted hover:text-text hover:bg-primary-soft/50 transition cursor-pointer"
            >
              Pengaturan
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border/40 pt-4 text-center text-[11px] text-text-muted">
          <p>
            © 2026 <strong>{APP_CONFIG.appName}</strong> • Yayasan Karya Pondok Mandiri × EMBI TECH COMPUTINDO × BBPVP BEKASI.
          </p>
          <p className="text-[10px] text-text-muted/80 mt-0.5">
            Semoga menjadi amal jariyah yang membawa keberkahan bagi kita semua.
          </p>
        </div>
      </div>
    </footer>
  );
};
