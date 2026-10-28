import React, { useEffect, useState } from 'react';
import {
  BookOpen,
  Search,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Trophy,
  Compass,
  Play,
  HeartHandshake,
  Flame,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { APP_CONFIG } from '../config/appConfig';
import {
  getLastRead,
  getDailyProgress,
  getUserSettings,
  getTilawahStreak,
} from '../storage/storageService';
import { ReadingPosition, DailyTargetProgress } from '../types/quran';

interface HomePageProps {
  onOpenSurah: (surahNumber: number, ayahNumber?: number) => void;
  onNavigateTab: (tab: string) => void;
  onPlaySurahId: (surahNumber: number) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenSurah,
  onNavigateTab,
  onPlaySurahId,
}) => {
  const [lastRead, setLastReadState] = useState<ReadingPosition | null>(null);
  const [dailyProgress, setDailyProgressState] = useState<DailyTargetProgress>(getDailyProgress());
  const [streak, setStreak] = useState(getTilawahStreak());
  const [settings] = useState(getUserSettings());

  useEffect(() => {
    setLastReadState(getLastRead());
    setDailyProgressState(getDailyProgress());
    setStreak(getTilawahStreak());
  }, []);

  const progressPercentage = Math.min(
    100,
    Math.round((dailyProgress.readAyahsCount / (settings.dailyAyahTarget || 10)) * 100)
  );

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F3C0BC', '#C99742', '#D98280', '#ECC391'],
    });
  };

  const quickSurahs = [
    { number: 1, name: 'Al-Fatihah', arabic: 'الفاتحة', desc: 'Pembukaan' },
    { number: 18, name: 'Al-Kahf', arabic: 'الكهف', desc: 'Gua' },
    { number: 36, name: 'Yasin', arabic: 'يس', desc: 'Jantung Al-Qur\'an' },
    { number: 55, name: 'Ar-Rahman', arabic: 'الرحمن', desc: 'Yang Maha Pemurah' },
    { number: 56, name: 'Al-Waqi\'ah', arabic: 'الواقعة', desc: 'Hari Kiamat' },
    { number: 67, name: 'Al-Mulk', arabic: 'الملك', desc: 'Kerajaan' },
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Hero Banner with Medallion Art */}
      <section className="relative overflow-hidden rounded-3xl bg-surface border border-border p-6 md:p-8 shadow-sm">
        {/* Soft decorative background circles */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-primary-soft/40 blur-2xl pointer-events-none" />
        <div className="absolute right-32 -bottom-16 w-56 h-56 rounded-full bg-accent-light/20 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-soft text-primary-deep text-xs font-semibold border border-primary/20">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Ketenangan Hati Bersama Al-Qur'an</span>
            </div>

            <h1 className="text-2xl md:text-4xl font-extrabold text-text tracking-tight">
              Assalāmu’alaikum
            </h1>

            <p className="text-sm md:text-base text-text-muted max-w-lg leading-relaxed">
              Jadikan setiap hari lebih bermakna dengan membaca, merenungi, dan mengamalkan kalam Ilahi bersama <span className="font-semibold text-text">{APP_CONFIG.appName}</span>.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center md:justify-start gap-3">
              <button
                onClick={() => onNavigateTab('surah-list')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-deep text-white font-semibold text-xs md:text-sm shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Buka 114 Surat</span>
              </button>

              <button
                onClick={() => onNavigateTab('search')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-surface text-text hover:bg-primary-soft/60 font-semibold text-xs md:text-sm transition-all cursor-pointer"
              >
                <Search className="w-4 h-4 text-accent" />
                <span>Cari Ayat / Terjemahan</span>
              </button>
            </div>
          </div>

          {/* Medallion Focal Artwork */}
          <div className="relative shrink-0 w-36 h-36 md:w-48 md:h-48 group">
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-accent to-primary opacity-20 blur-md group-hover:opacity-40 transition-opacity" />
            <img
              src="/assets/aistudio/Medali_Bundar_Kaligrafi_Al-Qur_an_425f345a.png"
              alt="Medali Kaligrafi Al-Qur'an"
              className="relative z-10 w-full h-full object-contain rounded-full drop-shadow-md group-hover:scale-102 transition-transform duration-300"
            />
          </div>
        </div>
      </section>

      {/* Two-Column Grid: Last Read & Daily Target */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card: Lanjut Membaca (Last Read) */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-accent-deep uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Terakhir Dibaca</span>
            </div>
            {lastRead && (
              <span className="text-[10px] text-text-muted">
                {new Date(lastRead.updatedAt).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            )}
          </div>

          {lastRead ? (
            <div className="space-y-2">
              <div className="flex items-baseline justify-between">
                <div>
                  <h3 className="font-extrabold text-lg text-text">
                    {lastRead.surahName}
                  </h3>
                  <p className="text-xs text-text-muted">
                    Ayat ke-{lastRead.ayahNumber} dari {lastRead.totalAyah} ayat
                  </p>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-lg bg-primary-soft text-primary-deep">
                  Surat ke-{lastRead.surahNumber}
                </span>
              </div>

              <button
                onClick={() => onOpenSurah(lastRead.surahNumber, lastRead.ayahNumber)}
                className="w-full mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-primary-soft text-primary-deep hover:bg-primary-deep hover:text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                <span>Lanjutkan Membaca</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="py-4 text-center space-y-2">
              <p className="text-xs text-text-muted">
                Belum ada riwayat bacaan. Mulai tilawah sekarang dari Surat Al-Fatihah!
              </p>
              <button
                onClick={() => onOpenSurah(1, 1)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary-soft text-primary-deep text-xs font-semibold hover:bg-primary-deep hover:text-white transition cursor-pointer"
              >
                <span>Mulai dari Al-Fatihah</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Card: Target Tilawah Harian */}
        <div className="bg-surface border border-border rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-accent-deep uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-accent" />
              <span>Target Tilawah Hari Ini</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 text-[11px] font-bold"
                title={`${streak.streak} hari berturut-turut membaca Al-Qur'an`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                <span>{streak.streak > 0 ? `${streak.streak} Hari Streak` : 'Streak Baru'}</span>
              </div>
              <span className="text-xs font-extrabold text-text">
                {dailyProgress.readAyahsCount} / {settings.dailyAyahTarget} Ayat
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {/* Progress bar */}
            <div className="w-full h-2.5 bg-primary-soft rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent to-primary-deep transition-all duration-500 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>{progressPercentage}% tercapai</span>
              {progressPercentage >= 100 ? (
                <span className="text-success font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Alhamdulillah tercapai!
                </span>
              ) : (
                <span>Kurang {Math.max(0, settings.dailyAyahTarget - dailyProgress.readAyahsCount)} ayat lagi</span>
              )}
            </div>

            {progressPercentage >= 100 && (
              <button
                onClick={triggerConfetti}
                className="w-full mt-2 py-2 rounded-xl bg-accent-light/30 text-accent-deep font-semibold text-xs border border-accent/30 hover:bg-accent-light/50 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Rayakan Keberhasilan Tilawah 🎉</span>
              </button>
            )}
          </div>

          <p className="text-[11px] text-text-muted">
            Tandai ikon centang pada setiap ayat di halaman pembaca untuk menambah progres tilawah harian Anda.
          </p>
        </div>
      </div>

      {/* Quick Access to Recommended / Popular Surahs */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-text flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Surat Pilihan & Paling Sering Dibaca</span>
          </h2>
          <button
            onClick={() => onNavigateTab('surah-list')}
            className="text-xs font-semibold text-primary-deep hover:underline cursor-pointer"
          >
            Lihat Semua (114)
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickSurahs.map((qs) => (
            <div
              key={qs.number}
              onClick={() => onOpenSurah(qs.number)}
              className="group bg-surface border border-border rounded-xl p-3 hover:border-primary-deep/50 hover:shadow-xs hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-primary-soft text-accent-deep">
                  #{qs.number}
                </span>
                <span className="font-quran text-sm font-semibold text-accent-deep group-hover:scale-105 transition-transform">
                  {qs.arabic}
                </span>
              </div>

              <div>
                <h4 className="font-bold text-xs text-text truncate group-hover:text-primary-deep transition-colors">
                  {qs.name}
                </h4>
                <p className="text-[10px] text-text-muted truncate mt-0.5">
                  {qs.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Daily Spiritual Reflection / Quotes */}
      <section className="bg-gradient-to-r from-primary-soft/50 via-surface to-accent-light/20 border border-border rounded-2xl p-5 md:p-6 shadow-xs flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-accent-light/30 flex items-center justify-center text-accent-deep shrink-0">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-sm text-text">Keutamaan Membaca Al-Qur'an</h4>
          <p className="text-xs text-text-muted leading-relaxed">
            “Sebaik-baik kalian adalah orang yang belajar Al-Qur'an dan mengajarkannya.” (HR. Bukhari no. 5027). Luangkan waktu sejenak setiap hari walau beberapa ayat, karena Al-Qur'an akan menjadi syafaat bagi pembacanya di hari kiamat.
          </p>
        </div>
      </section>
    </div>
  );
};
