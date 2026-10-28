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
