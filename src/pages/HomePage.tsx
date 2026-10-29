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
  Calendar,
  Layers,
  Quote,
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
    { number: 1, name: 'Al-Fatihah', arabic: 'الفاتحة', desc: 'Pembukaan', verses: 7 },
    { number: 18, name: 'Al-Kahf', arabic: 'الكهف', desc: 'Gua', verses: 110 },
    { number: 36, name: 'Yasin', arabic: 'يس', desc: 'Jantung Al-Qur\'an', verses: 83 },
    { number: 55, name: 'Ar-Rahman', arabic: 'الرحمن', desc: 'Maha Pemurah', verses: 78 },
    { number: 56, name: 'Al-Waqi\'ah', arabic: 'الواقعة', desc: 'Hari Kiamat', verses: 96 },
    { number: 67, name: 'Al-Mulk', arabic: 'الملك', desc: 'Kerajaan', verses: 30 },
  ];

  // Daily featured verse
  const featuredAyah = {
    surahNumber: 94,
    surahName: 'Asy-Syarh',
    ayahNumber: 6,
    teksArab: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    teksIndonesia: 'Sesungguhnya bersama kesulitan ada kemudahan.',
    reflection: 'Pengingat bahwa dalam setiap ujian kehidupan, pertolongan dan kemudahan dari Allah senantiasa menyertai kita.',
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Hero Banner with Islamic Aura */}
      <section className="relative overflow-hidden rounded-3xl bg-surface border border-border/80 p-6 sm:p-8 md:p-10 lg:p-12 shadow-sm">
        {/* Soft decorative background glows */}
        <div className="absolute -right-20 -top-20 w-80 h-80 rounded-full bg-primary-soft/50 blur-3xl pointer-events-none" />
        <div className="absolute right-40 -bottom-20 w-72 h-72 rounded-full bg-accent-light/20 blur-2xl pointer-events-none" />
        <div className="absolute left-10 -bottom-24 w-60 h-60 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4 text-center lg:text-left">
            {/* Top metadata - Zero-pill clean design */}
            <div className="flex items-center justify-center lg:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-accent-deep">
              <Calendar className="w-3.5 h-3.5 text-accent" />
              <span>Ketenangan Hati & Tilawah Harian</span>
              <span className="text-border">•</span>
              <span className="text-text-muted font-normal lowercase tracking-normal text-[11px]">30 juz mushaf</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-text tracking-tight leading-tight">
              Assalāmu’alaikum,{' '}
              <span className="text-primary-deep block sm:inline">Sahabat Qur'an</span>
            </h1>

            <p className="text-sm md:text-base text-text-muted leading-relaxed max-w-xl mx-auto lg:mx-0">
              Jadikan setiap hari lebih bermakna dengan membaca, merenungi, dan mengamalkan kalam Ilahi bersama <strong className="text-text">{APP_CONFIG.appName}</strong>.
            </p>

            {/* Quick Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              <button
                onClick={() => onNavigateTab('surah-list')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-primary-deep text-white font-bold text-xs sm:text-sm shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Buka 114 Surat & 30 Juz</span>
              </button>

              <button
                onClick={() => onNavigateTab('search')}
                className="flex items-center gap-2 px-5 py-3 rounded-xl border border-border bg-surface text-text hover:bg-primary-soft/60 font-semibold text-xs sm:text-sm transition-all cursor-pointer shadow-2xs"
              >
                <Search className="w-4 h-4 text-accent" />
                <span>Pencarian Kata / Ayat</span>
              </button>
            </div>
          </div>

          {/* Focal Medallion Artwork with Animated Aura */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative shrink-0 w-44 h-44 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 group flex items-center justify-center">
              {/* Concentric rings */}
              <div className="absolute inset-0 rounded-full border border-accent/20 scale-110 pointer-events-none" />
              <div className="absolute inset-0 rounded-full border border-dashed border-primary-deep/20 scale-120 animate-spin-slow pointer-events-none" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-accent/20 to-primary/30 blur-md group-hover:scale-105 transition-transform" />

              <img
                src="/assets/aistudio/Medali_Bundar_Kaligrafi_Al-Qur_an_425f345a.png"
                alt="Medali Kaligrafi Al-Qur'an"
                className="relative z-10 w-full h-full object-contain rounded-full drop-shadow-lg group-hover:scale-102 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Two-Column Grid: Last Read & Daily Target */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card: Lanjut Membaca (Last Read) */}
        <div className="bg-surface border border-border/80 rounded-3xl p-6 sm:p-7 shadow-2xs flex flex-col justify-between space-y-4 hover:border-primary-deep/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-accent-deep uppercase tracking-wider">
              <Compass className="w-4 h-4 text-accent" />
              <span>Terakhir Dibaca</span>
            </div>
            {lastRead && (
              <span className="text-[11px] text-text-muted">
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
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <div>
                  <h3 className="font-black text-xl sm:text-2xl text-text">
                    {lastRead.surahName}
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    Ayat ke-<strong className="text-text">{lastRead.ayahNumber}</strong> dari {lastRead.totalAyah} ayat
                  </p>
                </div>
                <span className="text-xs font-bold text-accent-deep uppercase tracking-wider">
                  Surat #{lastRead.surahNumber}
                </span>
              </div>

              {/* Mini progress bar of the surah */}
              <div className="w-full h-1.5 bg-primary-soft/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-300 rounded-full"
                  style={{
                    width: `${Math.round((lastRead.ayahNumber / (lastRead.totalAyah || 1)) * 100)}%`,
                  }}
                />
              </div>

              <button
                onClick={() => onOpenSurah(lastRead.surahNumber, lastRead.ayahNumber)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-soft text-primary-deep hover:bg-primary-deep hover:text-white font-bold text-xs transition-colors cursor-pointer shadow-2xs"
              >
                <span>Lanjutkan Membaca Ayat Ini</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="py-4 text-center space-y-2.5">
              <p className="text-xs text-text-muted">
                Belum ada riwayat bacaan tersimpan. Mulai tilawah sekarang dari Surat Al-Fatihah!
              </p>
              <button
                onClick={() => onOpenSurah(1, 1)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-soft text-primary-deep text-xs font-bold hover:bg-primary-deep hover:text-white transition cursor-pointer shadow-2xs"
              >
                <span>Mulai dari Al-Fatihah</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Card: Target Tilawah Harian */}
        <div className="bg-surface border border-border/80 rounded-3xl p-6 sm:p-7 shadow-2xs flex flex-col justify-between space-y-4 hover:border-primary-deep/40 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-accent-deep uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-accent" />
              <span>Target Tilawah Hari Ini</span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className="flex items-center gap-1 text-[11px] font-bold text-amber-700"
                title={`${streak.streak} hari berturut-turut membaca Al-Qur'an`}
              >
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
                <span>{streak.streak > 0 ? `${streak.streak} Hari Streak` : 'Streak Baru'}</span>
              </div>
              <span className="text-border">•</span>
              <span className="text-xs font-black text-text">
                {dailyProgress.readAyahsCount} / {settings.dailyAyahTarget} Ayat
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            {/* Progress bar */}
            <div className="w-full h-3 bg-primary-soft rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-accent to-primary-deep transition-all duration-500 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>{progressPercentage}% selesai</span>
              {progressPercentage >= 100 ? (
                <span className="text-success font-bold flex items-center gap-1">
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
                className="w-full mt-2 py-2 rounded-xl bg-accent-light/30 text-accent-deep font-bold text-xs border border-accent/30 hover:bg-accent-light/50 transition cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Rayakan Keberhasilan Tilawah 🎉</span>
              </button>
            )}
          </div>

          <p className="text-[11px] text-text-muted">
            Tandai ikon centang pada setiap ayat di mushaf untuk mencatat progres tilawah harian Anda.
          </p>
        </div>
      </div>

      {/* Card: Ayat Hari Ini (Daily Quranic Inspiration) */}
      <section className="bg-gradient-to-r from-primary-soft/40 via-surface to-accent-light/15 border border-border/80 rounded-3xl p-6 md:p-7 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-accent-deep uppercase tracking-wider">
            <Quote className="w-4 h-4 text-accent" />
            <span>Ayat Pilihan Hari Ini</span>
          </div>

          <button
            onClick={() => onOpenSurah(featuredAyah.surahNumber, featuredAyah.ayahNumber)}
            className="flex items-center gap-1 text-xs font-bold text-primary-deep hover:underline cursor-pointer"
          >
            <span>QS. {featuredAyah.surahName}: {featuredAyah.ayahNumber}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          <p className="font-quran text-right text-2xl md:text-3xl text-text font-bold leading-loose" dir="rtl">
            {featuredAyah.teksArab}
          </p>
          <p className="text-xs md:text-sm text-text font-medium italic">
            "{featuredAyah.teksIndonesia}"
          </p>
          <p className="text-[11px] text-text-muted leading-relaxed">
            💡 {featuredAyah.reflection}
          </p>
        </div>
      </section>

      {/* Quick Access to Popular Surahs */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm md:text-base font-extrabold text-text flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent" />
            <span>Surat Utama & Sering Dibaca</span>
          </h2>
          <button
            onClick={() => onNavigateTab('surah-list')}
            className="text-xs font-bold text-primary-deep hover:underline cursor-pointer"
          >
            Lihat Semua (114 Surat)
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickSurahs.map((qs) => (
            <div
              key={qs.number}
              onClick={() => onOpenSurah(qs.number)}
              className="group bg-surface border border-border/80 rounded-2xl p-3.5 hover:border-primary-deep/50 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black px-1.5 py-0.5 rounded-md bg-primary-soft text-accent-deep">
                  #{qs.number}
                </span>
                <span className="font-quran text-base font-bold text-accent-deep group-hover:scale-105 transition-transform" dir="rtl">
                  {qs.arabic}
                </span>
              </div>

              <div>
                <h4 className="font-extrabold text-xs text-text truncate group-hover:text-primary-deep transition-colors">
                  {qs.name}
                </h4>
                <p className="text-[10px] text-text-muted truncate mt-0.5">
                  {qs.desc} • {qs.verses} Ayat
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Spiritual Encouragement Note */}
      <section className="bg-surface border border-border/70 rounded-3xl p-5 md:p-6 shadow-2xs flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-accent-light/30 flex items-center justify-center text-accent-deep shrink-0">
          <HeartHandshake className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-sm text-text">Keberkahan Membaca Al-Qur'an</h4>
          <p className="text-xs text-text-muted leading-relaxed">
            “Sebaik-baik kalian adalah orang yang belajar Al-Qur'an dan mengajarkannya.” (HR. Bukhari no. 5027). Luangkan waktu setiap hari walau beberapa ayat bersama <strong>{APP_CONFIG.appName}</strong> untuk memelihara kebugaran rohani dan ketenangan jiwa.
          </p>
        </div>
      </section>
    </div>
  );
};
