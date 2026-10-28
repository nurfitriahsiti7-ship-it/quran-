import React, { useState, useEffect, useMemo } from 'react';
import { Search, Sparkles, BookOpen, ArrowRight, Layers, FileText, CheckCircle2 } from 'lucide-react';
import { SurahListItem, SurahDetail } from '../types/quran';
import { getSurahDetail } from '../services/quranApi';

interface SearchResultAyah {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  teksArab: string;
  teksIndonesia: string;
  matchType: 'translation' | 'verseNumber';
}

interface SearchPageProps {
  surahs: SurahListItem[];
  onOpenSurah: (surahNumber: number, ayahNumber?: number) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({ surahs, onOpenSurah }) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isSearchingAyat, setIsSearchingAyat] = useState(false);
  const [ayahResults, setAyahResults] = useState<SearchResultAyah[]>([]);
  const [searchedSurahsCount, setSearchedSurahsCount] = useState(0);

  // Debounce search query input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  // 1. Surah-level matches (runs immediately across all 114 surahs)
  const surahMatches = useMemo(() => {
    if (!debouncedQuery) return [];
    const q = debouncedQuery.toLowerCase();
    return surahs.filter(
      (s) =>
        s.namaLatin.toLowerCase().includes(q) ||
        s.arti.toLowerCase().includes(q) ||
        s.nama.includes(q) ||
        String(s.nomor) === q
    );
  }, [surahs, debouncedQuery]);

  // 2. In-depth Ayah translation search across key loaded/popular surahs or targeted surah
  useEffect(() => {
    let isCancelled = false;

    async function searchAyatText() {
      if (!debouncedQuery || debouncedQuery.length < 3) {
        setAyahResults([]);
        return;
      }

      setIsSearchingAyat(true);
      const results: SearchResultAyah[] = [];
      const q = debouncedQuery.toLowerCase();

      // Priority list: First 10 popular/key surahs + any surahs matching query
      const candidateSurahs = [1, 2, 3, 18, 36, 55, 56, 67, 112, 113, 114];
      surahMatches.forEach((s) => {
        if (!candidateSurahs.includes(s.nomor)) {
          candidateSurahs.push(s.nomor);
        }
      });

      // Limit to top 15 candidate surahs for speed and rate limits
      const surahsToScan = candidateSurahs.slice(0, 15);
      let scanned = 0;

      for (const num of surahsToScan) {
        if (isCancelled) break;
        try {
          const detail = await getSurahDetail(num);
          scanned++;
          setSearchedSurahsCount(scanned);

          for (const a of detail.ayat) {
            const indText = a.teksIndonesia.toLowerCase();
            if (indText.includes(q)) {
              results.push({
                surahNumber: detail.nomor,
                surahName: detail.namaLatin,
                ayahNumber: a.nomorAyat,
                teksArab: a.teksArab,
                teksIndonesia: a.teksIndonesia,
                matchType: 'translation',
              });
              if (results.length >= 40) break; // max cap
            }
          }
        } catch {
          // ignore individual fetch errors
        }
      }

      if (!isCancelled) {
        setAyahResults(results);
        setIsSearchingAyat(false);
      }
    }

    searchAyatText();

    return () => {
      isCancelled = true;
    };
  }, [debouncedQuery, surahMatches]);

  const highlightMatch = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;
    const regex = new RegExp(`(${highlight.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} className="bg-accent-light/50 text-accent-deep font-bold px-0.5 rounded">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const sampleKeywords = ['Sabar', 'Syukur', 'Ikhlas', 'Sholat', 'Langit', 'Cahaya', 'Kiamat', 'Rahman'];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header Card */}
      <div className="bg-surface border border-border rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center text-primary-deep">
            <Search className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-text">Pencarian Al-Qur'an</h1>
            <p className="text-xs text-text-muted">
              Cari nama surat, nomor surat, atau kata kunci dalam terjemahan bahasa Indonesia
            </p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ketik nama surat atau kata dalam terjemahan (contoh: sabar, sholat, rahman)..."
            className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary-deep/40 transition placeholder:text-text-muted"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-text-muted hover:text-text cursor-pointer"
            >
              Hapus
            </button>
          )}
        </div>

        {/* Suggested keywords */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-semibold text-text-muted mr-1">Saran Kata Kunci:</span>
          {sampleKeywords.map((kw) => (
            <button
              key={kw}
              onClick={() => setQuery(kw)}
              className="px-2.5 py-1 rounded-lg text-xs bg-primary-soft/50 text-text hover:bg-primary-soft hover:text-primary-deep border border-border transition cursor-pointer"
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* Scope Disclaimer / Status Info */}
      <div className="p-3.5 rounded-2xl bg-primary-soft/30 border border-border text-xs text-text-muted flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-accent" />
          <span>
            Cakupan Pencarian: Menyeluruh untuk 114 nama surat & pengindeksan bertahap ayat terjemahan.
          </span>
        </div>
        {isSearchingAyat && (
          <span className="text-[11px] text-accent-deep font-semibold animate-pulse">
            Memindai ayat...
          </span>
        )}
      </div>

      {/* 1. Surah Matches Section */}
      {surahMatches.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold text-text flex items-center gap-2 uppercase tracking-wider">
            <BookOpen className="w-4 h-4 text-accent" />
            <span>Surat yang Cocok ({surahMatches.length})</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {surahMatches.map((surah) => (
              <div
                key={surah.nomor}
                onClick={() => onOpenSurah(surah.nomor)}
                className="bg-surface border border-border rounded-2xl p-4 hover:border-primary-deep/50 hover:shadow-sm transition cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-primary-soft flex items-center justify-center text-xs font-bold text-accent-deep border border-border">
                    {surah.nomor}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-text">
                      {highlightMatch(surah.namaLatin, debouncedQuery)}
                    </h4>
                    <p className="text-xs text-text-muted">
                      {highlightMatch(surah.arti, debouncedQuery)} • {surah.jumlahAyat} Ayat
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-quran text-base font-bold text-accent-deep block">
                    {surah.nama}
                  </span>
                  <span className="text-[10px] text-text-muted">{surah.tempatTurun}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. Ayah Translation Matches Section */}
      {debouncedQuery.length >= 3 && (
        <section className="space-y-3 pt-2">
          <h2 className="text-sm font-bold text-text flex items-center gap-2 uppercase tracking-wider">
            <FileText className="w-4 h-4 text-accent" />
            <span>
              Ayat dalam Terjemahan ({ayahResults.length})
            </span>
          </h2>

          {ayahResults.length > 0 ? (
            <div className="space-y-3">
              {ayahResults.map((r, i) => (
                <div
                  key={`${r.surahNumber}-${r.ayahNumber}-${i}`}
                  onClick={() => onOpenSurah(r.surahNumber, r.ayahNumber)}
                  className="bg-surface border border-border rounded-2xl p-4 hover:border-primary-deep/50 hover:shadow-xs transition cursor-pointer space-y-2.5"
                >
                  <div className="flex items-center justify-between text-xs pb-2 border-b border-divider">
                    <span className="font-bold text-primary-deep">
                      QS. {r.surahName} : Ayat {r.ayahNumber}
                    </span>
                    <span className="flex items-center gap-1 text-text-muted hover:text-text font-semibold">
                      <span>Buka Ayat</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <p className="font-quran text-right text-base text-text leading-loose" dir="rtl">
                    {r.teksArab}
                  </p>

                  <p className="text-xs text-text leading-relaxed">
                    {highlightMatch(r.teksIndonesia, debouncedQuery)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            !isSearchingAyat && (
              <div className="p-8 rounded-2xl bg-surface border border-border text-center space-y-1">
                <p className="text-xs font-semibold text-text">
                  Tidak ditemukan ayat dengan kata "{debouncedQuery}" pada kumpulan surat utama.
                </p>
                <p className="text-[11px] text-text-muted">
                  Coba gunakan sinonim atau periksa ejaan kata kunci.
                </p>
              </div>
            )
          )}
        </section>
      )}

      {/* Empty Initial Search State */}
      {!debouncedQuery && (
        <div className="p-12 text-center rounded-3xl bg-surface border border-border space-y-3">
          <Sparkles className="w-10 h-10 text-accent/60 mx-auto" />
          <h3 className="font-bold text-sm text-text">Mulai Pencarian Anda</h3>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            Masukkan kata apa pun dari topik Al-Qur'an untuk menemukan surah dan ayat terkait secara langsung.
          </p>
        </div>
      )}
    </div>
  );
};
