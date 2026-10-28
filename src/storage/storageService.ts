import {
  BookmarkItem,
  UserNote,
  ReadingPosition,
  DailyTargetProgress,
  UserSettings,
  DEFAULT_USER_SETTINGS,
} from '../types/quran';

const STORAGE_KEYS = {
  BOOKMARKS: 'equran_bookmarks_v1',
  NOTES: 'equran_notes_v1',
  LAST_READ: 'equran_last_read_v1',
  DAILY_TARGET: 'equran_daily_target_v1',
  SETTINGS: 'equran_settings_v1',
};

// Safe JSON parse with fallback
function safeParse<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function safeSave<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`Failed to save to localStorage (${key}):`, e);
  }
}

// ----------------- Bookmarks -----------------
export function getBookmarks(): BookmarkItem[] {
  return safeParse<BookmarkItem[]>(STORAGE_KEYS.BOOKMARKS, []);
}

export function saveBookmark(item: BookmarkItem): void {
  const current = getBookmarks();
  const exists = current.some((b) => b.id === item.id);
  if (!exists) {
    const updated = [item, ...current];
    safeSave(STORAGE_KEYS.BOOKMARKS, updated);
  }
}

export function removeBookmark(id: string): void {
  const current = getBookmarks();
  const updated = current.filter((b) => b.id !== id);
  safeSave(STORAGE_KEYS.BOOKMARKS, updated);
}

export function isAyahBookmarked(surahNumber: number, ayahNumber: number): boolean {
  const id = `surah-${surahNumber}-ayah-${ayahNumber}`;
  const current = getBookmarks();
  return current.some((b) => b.id === id);
}

// ----------------- Notes -----------------
export function getNotes(): UserNote[] {
  return safeParse<UserNote[]>(STORAGE_KEYS.NOTES, []);
}

export function saveNote(note: Omit<UserNote, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): UserNote {
  const current = getNotes();
  const now = Date.now();
  const targetId = note.id || `note-${note.surahNumber}-${note.ayahNumber}`;

  const existingIndex = current.findIndex((n) => n.id === targetId);
  if (existingIndex >= 0) {
    const updatedNote: UserNote = {
      ...current[existingIndex],
      note: note.note,
      updatedAt: now,
    };
    current[existingIndex] = updatedNote;
    safeSave(STORAGE_KEYS.NOTES, current);
    return updatedNote;
  } else {
    const newNote: UserNote = {
      id: targetId,
      surahNumber: note.surahNumber,
      surahName: note.surahName,
      ayahNumber: note.ayahNumber,
      textArab: note.textArab,
      note: note.note,
      createdAt: now,
      updatedAt: now,
    };
    safeSave(STORAGE_KEYS.NOTES, [newNote, ...current]);
    return newNote;
  }
}

export function deleteNote(id: string): void {
  const current = getNotes();
  const updated = current.filter((n) => n.id !== id);
  safeSave(STORAGE_KEYS.NOTES, updated);
}

export function getNoteForAyah(surahNumber: number, ayahNumber: number): UserNote | undefined {
  const current = getNotes();
  return current.find((n) => n.surahNumber === surahNumber && n.ayahNumber === ayahNumber);
}

// ----------------- Last Read Position -----------------
export function getLastRead(): ReadingPosition | null {
  return safeParse<ReadingPosition | null>(STORAGE_KEYS.LAST_READ, null);
}

export function setLastRead(position: ReadingPosition): void {
  safeSave(STORAGE_KEYS.LAST_READ, position);
}

// ----------------- Daily Tilawah Target -----------------
function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getDailyProgress(): DailyTargetProgress {
  const today = getTodayString();
  const current = safeParse<DailyTargetProgress>(STORAGE_KEYS.DAILY_TARGET, {
    date: today,
    readAyahsCount: 0,
    readKeys: [],
  });

  // If date changed, reset for new day
  if (current.date !== today) {
    const fresh: DailyTargetProgress = {
      date: today,
      readAyahsCount: 0,
      readKeys: [],
    };
    safeSave(STORAGE_KEYS.DAILY_TARGET, fresh);
    return fresh;
  }

  return current;
}

export function markAyahRead(surahNumber: number, ayahNumber: number): DailyTargetProgress {
  const key = `${surahNumber}:${ayahNumber}`;
  const progress = getDailyProgress();

  if (!progress.readKeys.includes(key)) {
    progress.readKeys.push(key);
    progress.readAyahsCount = progress.readKeys.length;
    safeSave(STORAGE_KEYS.DAILY_TARGET, progress);
    recordTilawahActivity();
  }

  return progress;
}

// ----------------- Habit Streak (Fit Qur'an) -----------------
export interface TilawahStreakInfo {
  streak: number;
  lastDate: string;
}

export function getTilawahStreak(): TilawahStreakInfo {
  return safeParse<TilawahStreakInfo>('equran_streak_v1', {
    streak: 0,
    lastDate: '',
  });
}

function recordTilawahActivity(): void {
  const today = getTodayString();
  const current = getTilawahStreak();

  if (current.lastDate === today) {
    return;
  }

  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterday = `${yesterdayDate.getFullYear()}-${String(yesterdayDate.getMonth() + 1).padStart(2, '0')}-${String(yesterdayDate.getDate()).padStart(2, '0')}`;

  let newStreak = 1;
  if (current.lastDate === yesterday) {
    newStreak = (current.streak || 0) + 1;
  }

  safeSave('equran_streak_v1', {
    streak: newStreak,
    lastDate: today,
  });
}

// ----------------- Settings -----------------
export function getUserSettings(): UserSettings {
  return { ...DEFAULT_USER_SETTINGS, ...safeParse<Partial<UserSettings>>(STORAGE_KEYS.SETTINGS, {}) };
}

export function saveUserSettings(settings: UserSettings): void {
  safeSave(STORAGE_KEYS.SETTINGS, settings);
}
