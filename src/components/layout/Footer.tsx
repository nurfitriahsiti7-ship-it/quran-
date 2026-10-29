import React from 'react';
import { BookOpen, Sparkles, HeartHandshake, ShieldCheck, Layers, ExternalLink } from 'lucide-react';
import { APP_CONFIG } from '../../config/appConfig';

interface FooterProps {
  onNavigateTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateTab }) => {
  const partnerLogos = [
    {
      name: 'Yayasan Karya Pondok Mandiri',
      category: 'Lembaga Pendidikan & Sosial',
      image: '/assets/logos/yayasan_karya_pondok_mandiri.png',
      alt: 'Logo Yayasan Karya Pondok Mandiri',
    },
    {
      name: 'EMBI TECH COMPUTINDO',
      category: 'Teknologi & Solusi Digital',
      image: '/assets/logos/embi_tech_computindo.png',
      alt: 'Logo Embi Tech Computindo',
    },
    {
      name: 'BBPVP BEKASI',
      category: 'Balai Besar Pelatihan Vokasi & Produktivitas',
      image: '/assets/logos/bbpvp_bekasi.png',
      alt: 'Logo BBPVP Bekasi',
    },
  ];

  return (
    <footer className="w-full bg-surface/90 border-t border-border mt-12 transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Partner / Sponsorship Showcase Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/80 pb-3">
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-accent" />
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-text">
                Kolaborasi & Kemitraan Resmi
              </h3>
            </div>
            <span className="text-[11px] text-text-muted">
              Dipersembahkan untuk kemaslahatan umat & kemudahan tilawah
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {partnerLogos.map((item, idx) => (
              <div
                key={idx}
                className="group bg-surface border border-border rounded-2xl p-4.5 hover:border-primary-deep/40 hover:shadow-md transition-all duration-300 flex items-center gap-4 bg-gradient-to-br from-surface to-primary-soft/15"
              >
                <div className="w-16 h-16 shrink-0 rounded-xl bg-white border border-border/60 p-2 flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      // Fallback in case path resolution needs original
                      const targets = [
                        '/assets/aistudio/Screenshot_20261029-112312_bb433de6.png',
                        '/assets/aistudio/Screenshot_20261029-112321_d6b36828.png',
                        '/assets/aistudio/Screenshot_20261029-112333_a8629014.png',
                      ];
                      (e.target as HTMLImageElement).src = targets[idx];
                    }}
                  />
                </div>

                <div className="min-w-0">
                  <h4 className="font-extrabold text-xs sm:text-sm text-text leading-snug group-hover:text-primary-deep transition-colors truncate">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-text-muted mt-1 leading-tight">
                    {item.category}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Brand Summary & Navigation Links */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-2">
          {/* Col 1 & 2: Brand Information */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full p-0.5 bg-gradient-to-tr from-accent to-primary flex items-center justify-center shadow-xs">
                <img
                  src="/assets/aistudio/Medali_Bundar_Kaligrafi_Al-Qur_an_425f345a.png"
                  alt="Fit Qur'an Medallion"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <span className="font-extrabold text-base text-text tracking-tight">
                  {APP_CONFIG.appName}
                </span>
                <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-accent-light/30 text-accent-deep border border-accent/20">
                  Al-Qur'an Digital
                </span>
              </div>
            </div>

            <p className="text-xs text-text-muted leading-relaxed max-w-md">
              Aplikasi Al-Qur'an Digital dengan sistem palet warna adaptif, teks Arab berharakat resmi, terjemahan & tafsir Kementerian Agama RI, audio murottal 6 Qari terkemuka, fitur auto-scroll, dan kemampuan baca luring (PWA).
            </p>

            <div className="flex items-center gap-3 text-[11px] text-text-muted">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-success" />
                <span>Data API Valid</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                <span>100% Bebas Iklan</span>
              </span>
            </div>
          </div>

          {/* Col 3: Fitur Utama */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text">
              Fitur Tilawah
            </h4>
            <ul className="space-y-1.5 text-xs text-text-muted">
              <li>
                <button
                  onClick={() => onNavigateTab('surah-list')}
                  className="hover:text-primary-deep transition cursor-pointer text-left"
                >
                  114 Surat & 30 Juz
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('search')}
                  className="hover:text-primary-deep transition cursor-pointer text-left"
                >
                  Pencarian Ayat & Kata
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('bookmarks')}
                  className="hover:text-primary-deep transition cursor-pointer text-left"
                >
                  Bookmark & Catatan Tadabbur
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('settings')}
                  className="hover:text-primary-deep transition cursor-pointer text-left"
                >
                  Pengaturan Qari & Palet Warna
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Informasi Sumber */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-text">
              Sumber Data
            </h4>
            <p className="text-xs text-text-muted leading-relaxed">
              Naskah Al-Qur'an dan audio murottal disalurkan melalui <strong>equran.id API v2</strong> berstandar Kemenag RI.
            </p>
            <div className="pt-1 text-[11px] text-text-muted">
              <span>Dibangun dengan Progressive Web App (PWA) untuk akses tilawah cepat di Android, iOS, & Desktop.</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-border pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left text-xs text-text-muted">
          <p>
            © 2026 <strong>{APP_CONFIG.appName}</strong> • Yayasan Karya Pondok Mandiri × EMBI TECH COMPUTINDO × BBPVP BEKASI.
          </p>
          <p className="text-[11px]">
            Semoga menjadi amal jariyah yang membawa keberkahan.
          </p>
        </div>
      </div>
    </footer>
  );
};
