export interface QariInfo {
  id: string;
  name: string;
  style: string;
}

export const QARI_LIST: QariInfo[] = [
  { id: '01', name: 'Abdullah Al-Juhany', style: 'Tartil Makkah' },
  { id: '02', name: 'Abdul Muhsin Al-Qasim', style: 'Murattal Madinah' },
  { id: '03', name: 'Abdurrahman As-Sudais', style: 'Khas Imam Haram' },
  { id: '04', name: 'Ibrahim Al-Dossari', style: 'Tajwid Halus' },
  { id: '05', name: 'Misyari Rasyid Al-Afasi', style: 'Sangat Populer' },
  { id: '06', name: 'Yasser Al-Dosari', style: 'Syahdu & Khusyuk' },
];

export interface SurahListItem {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>;
}

export interface AyahItem {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

export interface SurahDetail {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>;
  suratSelanjutnya: false | { nomor: number; nama: string; namaLatin: string; jumlahAyat: number };
  suratSebelumnya: false | { nomor: number; nama: string; namaLatin: string; jumlahAyat: number };
  ayat: AyahItem[];
}

export interface TafsirItem {
  ayat: number;
  teks: string;
}

export interface TafsirDetail {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>;
  suratSelanjutnya: false | { nomor: number; nama: string; namaLatin: string; jumlahAyat: number };
  suratSebelumnya: false | { nomor: number; nama: string; namaLatin: string; jumlahAyat: number };
  tafsir: TafsirItem[];
}

export interface BookmarkItem {
  id: string; // e.g. "surah-1-ayah-1"
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  textArab: string;
  textTranslation: string;
  createdAt: number;
}

export interface UserNote {
  id: string;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  textArab: string;
  note: string;
  createdAt: number;
  updatedAt: number;
}

export interface ReadingPosition {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  totalAyah: number;
  updatedAt: number;
}

export interface DailyTargetProgress {
  date: string; // YYYY-MM-DD
  readAyahsCount: number;
  readKeys: string[]; // Set of "surah:ayah" read today
}

export interface UserSettings {
  arabicFontSize: number; // default: 28px
  translationFontSize: number; // default: 15px
  showTransliteration: boolean; // default: true
  showTranslation: boolean; // default: true
  qariId: string; // default: '05' (Mishary)
  autoScrollSpeed: number; // pixels per step, default: 2
  dailyAyahTarget: number; // default: 10
  customPrimaryColor: string | null;
}

export const DEFAULT_USER_SETTINGS: UserSettings = {
  arabicFontSize: 28,
  translationFontSize: 15,
  showTransliteration: true,
  showTranslation: true,
  qariId: '05',
  autoScrollSpeed: 2,
  dailyAyahTarget: 10,
  customPrimaryColor: null,
};

export interface JuzInfo {
  juzNumber: number;
  arabicName: string;
  startSurahNumber: number;
  startSurahName: string;
  startAyah: number;
  rangeText: string;
}

export const JUZ_LIST: JuzInfo[] = [
  { juzNumber: 1, arabicName: 'آلم', startSurahNumber: 1, startSurahName: 'Al-Fatihah', startAyah: 1, rangeText: 'QS. Al-Fatihah 1 - Al-Baqarah 141' },
  { juzNumber: 2, arabicName: 'سَيَقُولُ', startSurahNumber: 2, startSurahName: 'Al-Baqarah', startAyah: 142, rangeText: 'QS. Al-Baqarah 142 - 252' },
  { juzNumber: 3, arabicName: 'تِلْكَ الرُّسُلُ', startSurahNumber: 2, startSurahName: 'Al-Baqarah', startAyah: 253, rangeText: 'QS. Al-Baqarah 253 - Ali \'Imran 92' },
  { juzNumber: 4, arabicName: 'لَنْ تَنَالُوا', startSurahNumber: 3, startSurahName: 'Ali \'Imran', startAyah: 93, rangeText: 'QS. Ali \'Imran 93 - An-Nisa\' 23' },
  { juzNumber: 5, arabicName: 'وَالْمُحْصَنَاتُ', startSurahNumber: 4, startSurahName: 'An-Nisa\'', startAyah: 24, rangeText: 'QS. An-Nisa\' 24 - 147' },
  { juzNumber: 6, arabicName: 'لَا يُحِبُّ اللَّهُ', startSurahNumber: 4, startSurahName: 'An-Nisa\'', startAyah: 148, rangeText: 'QS. An-Nisa\' 148 - Al-Ma\'idah 81' },
  { juzNumber: 7, arabicName: 'وَإِذَا سَمِعُوا', startSurahNumber: 5, startSurahName: 'Al-Ma\'idah', startAyah: 82, rangeText: 'QS. Al-Ma\'idah 82 - Al-An\'am 110' },
  { juzNumber: 8, arabicName: 'وَلَوْ أَنَّنَا', startSurahNumber: 6, startSurahName: 'Al-An\'am', startAyah: 111, rangeText: 'QS. Al-An\'am 111 - Al-A\'raf 87' },
  { juzNumber: 9, arabicName: 'قَالَ الْمَلَأُ', startSurahNumber: 7, startSurahName: 'Al-A\'raf', startAyah: 88, rangeText: 'QS. Al-A\'raf 88 - Al-Anfal 40' },
  { juzNumber: 10, arabicName: 'وَاعْلَمُوا', startSurahNumber: 8, startSurahName: 'Al-Anfal', startAyah: 41, rangeText: 'QS. Al-Anfal 41 - At-Taubah 92' },
  { juzNumber: 11, arabicName: 'يَعْتَذِرُونَ', startSurahNumber: 9, startSurahName: 'At-Taubah', startAyah: 93, rangeText: 'QS. At-Taubah 93 - Hud 5' },
  { juzNumber: 12, arabicName: 'وَمَا مِنْ دَابَّةٍ', startSurahNumber: 11, startSurahName: 'Hud', startAyah: 6, rangeText: 'QS. Hud 6 - Yusuf 52' },
  { juzNumber: 13, arabicName: 'وَمَا أُبَرِّئُ', startSurahNumber: 12, startSurahName: 'Yusuf', startAyah: 53, rangeText: 'QS. Yusuf 53 - Ibrahim 52' },
  { juzNumber: 14, arabicName: 'رُبَمَا', startSurahNumber: 15, startSurahName: 'Al-Hijr', startAyah: 1, rangeText: 'QS. Al-Hijr 1 - An-Nahl 128' },
  { juzNumber: 15, arabicName: 'سُبْحَانَ الَّذِي', startSurahNumber: 17, startSurahName: 'Al-Isra\'', startAyah: 1, rangeText: 'QS. Al-Isra\' 1 - Al-Kahf 74' },
  { juzNumber: 16, arabicName: 'قَالَ أَلَمْ', startSurahNumber: 18, startSurahName: 'Al-Kahf', startAyah: 75, rangeText: 'QS. Al-Kahf 75 - Ta Ha 135' },
  { juzNumber: 17, arabicName: 'اقْتَرَبَ', startSurahNumber: 21, startSurahName: 'Al-Anbiya\'', startAyah: 1, rangeText: 'QS. Al-Anbiya\' 1 - Al-Hajj 78' },
  { juzNumber: 18, arabicName: 'قَدْ أَفْلَحَ', startSurahNumber: 23, startSurahName: 'Al-Mu\'minun', startAyah: 1, rangeText: 'QS. Al-Mu\'minun 1 - Al-Furqan 20' },
  { juzNumber: 19, arabicName: 'وَقَالَ الَّذِينَ', startSurahNumber: 25, startSurahName: 'Al-Furqan', startAyah: 21, rangeText: 'QS. Al-Furqan 21 - An-Naml 55' },
  { juzNumber: 20, arabicName: 'أَمَّنْ خَلَقَ', startSurahNumber: 27, startSurahName: 'An-Naml', startAyah: 56, rangeText: 'QS. An-Naml 56 - Al-\'Ankabut 45' },
  { juzNumber: 21, arabicName: 'اتْلُ مَا أُوحِيَ', startSurahNumber: 29, startSurahName: 'Al-\'Ankabut', startAyah: 46, rangeText: 'QS. Al-\'Ankabut 46 - Al-Ahzab 30' },
  { juzNumber: 22, arabicName: 'وَمَنْ يَقْنُتْ', startSurahNumber: 33, startSurahName: 'Al-Ahzab', startAyah: 31, rangeText: 'QS. Al-Ahzab 31 - Yasin 27' },
  { juzNumber: 23, arabicName: 'وَمَا أَنْزَلْنَا', startSurahNumber: 36, startSurahName: 'Yasin', startAyah: 28, rangeText: 'QS. Yasin 28 - Az-Zumar 31' },
  { juzNumber: 24, arabicName: 'فَمَنْ أَظْلَمُ', startSurahNumber: 39, startSurahName: 'Az-Zumar', startAyah: 32, rangeText: 'QS. Az-Zumar 32 - Fussilat 46' },
  { juzNumber: 25, arabicName: 'إِلَيْهِ يُرَدُّ', startSurahNumber: 41, startSurahName: 'Fussilat', startAyah: 47, rangeText: 'QS. Fussilat 47 - Al-Jasiyah 37' },
  { juzNumber: 26, arabicName: 'حم', startSurahNumber: 46, startSurahName: 'Al-Ahqaf', startAyah: 1, rangeText: 'QS. Al-Ahqaf 1 - Az-Zariyat 30' },
  { juzNumber: 27, arabicName: 'قَالَ فَمَا خَطْبُكُمْ', startSurahNumber: 51, startSurahName: 'Az-Zariyat', startAyah: 31, rangeText: 'QS. Az-Zariyat 31 - Al-Hadid 29' },
  { juzNumber: 28, arabicName: 'قَدْ سَمِعَ اللَّهُ', startSurahNumber: 58, startSurahName: 'Al-Mujadilah', startAyah: 1, rangeText: 'QS. Al-Mujadilah 1 - At-Tahrim 12' },
  { juzNumber: 29, arabicName: 'تَبَارَكَ الَّذِي', startSurahNumber: 67, startSurahName: 'Al-Mulk', startAyah: 1, rangeText: 'QS. Al-Mulk 1 - Al-Mursalat 50' },
  { juzNumber: 30, arabicName: 'عَمَّ يَتَسَاءَلُونَ', startSurahNumber: 78, startSurahName: 'An-Naba\'', startAyah: 1, rangeText: 'QS. An-Naba\' 1 - An-Nas 6 (Juz \'Amma)' },
];

