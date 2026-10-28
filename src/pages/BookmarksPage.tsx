import React, { useState, useEffect } from 'react';
import { Bookmark, FileText, Trash2, ArrowRight, BookOpen, Sparkles } from 'lucide-react';
import { BookmarkItem, UserNote } from '../types/quran';
import {
  getBookmarks,
  removeBookmark,
  getNotes,
  deleteNote,
} from '../storage/storageService';
import { NoteModal } from '../components/quran/NoteModal';

interface BookmarksPageProps {
  onOpenSurah: (surahNumber: number, ayahNumber?: number) => void;
  onNavigateTab: (tab: string) => void;
}

export const BookmarksPage: React.FC<BookmarksPageProps> = ({
  onOpenSurah,
  onNavigateTab,
}) => {
  const [activeTab, setActiveTab] = useState<'bookmarks' | 'notes'>('bookmarks');
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [notes, setNotes] = useState<UserNote[]>([]);
  const [editingNote, setEditingNote] = useState<UserNote | null>(null);

  const reloadData = () => {
    setBookmarks(getBookmarks());
    setNotes(getNotes());
  };

  useEffect(() => {
    reloadData();
  }, []);

  const handleRemoveBookmark = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeBookmark(id);
    reloadData();
  };

  const handleDeleteNote = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    deleteNote(id);
    reloadData();
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Header & Tabs */}
      <div className="bg-surface border border-border rounded-3xl p-6 shadow-xs space-y-4">
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold text-text">
            Koleksi Tersimpan
          </h1>
          <p className="text-xs text-text-muted mt-1">
            Daftar ayat yang Anda tandai dan catatan tadabbur pribadi
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center gap-2 bg-primary-soft/50 p-1 rounded-2xl border border-border max-w-sm">
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'bookmarks'
                ? 'bg-primary-deep text-white shadow-xs'
                : 'text-text-muted hover:text-text'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Ayat Bookmark ({bookmarks.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
              activeTab === 'notes'
                ? 'bg-primary-deep text-white shadow-xs'
                : 'text-text-muted hover:text-text'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Catatan ({notes.length})</span>
          </button>
        </div>
      </div>

      {/* Bookmarks Tab Content */}
      {activeTab === 'bookmarks' && (
        <div className="space-y-3">
          {bookmarks.length > 0 ? (
            bookmarks.map((b) => (
              <div
                key={b.id}
                onClick={() => onOpenSurah(b.surahNumber, b.ayahNumber)}
                className="group bg-surface border border-border rounded-2xl p-5 hover:border-primary-deep/50 hover:shadow-xs transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between text-xs pb-2 border-b border-divider">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-accent-deep">
                      QS. {b.surahName} : Ayat {b.ayahNumber}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      • {new Date(b.createdAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleRemoveBookmark(e, b.id)}
                      className="p-1 rounded-lg text-text-muted hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                      title="Hapus bookmark"
                      aria-label="Hapus bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <span className="flex items-center gap-1 text-primary-deep font-semibold group-hover:translate-x-0.5 transition-transform">
                      <span>Buka</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                <p className="font-quran text-right text-lg text-text select-text" dir="rtl">
                  {b.textArab}
                </p>

                <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                  {b.textTranslation}
                </p>
              </div>
            ))
          ) : (
            <div className="bg-surface border border-border rounded-3xl p-12 text-center space-y-3">
              <Bookmark className="w-10 h-10 text-primary-deep/40 mx-auto" />
              <h3 className="font-bold text-sm text-text">Belum Ada Bookmark Ayat</h3>
              <p className="text-xs text-text-muted max-w-sm mx-auto">
                Tandai ayat favorit Anda saat membaca dengan menekan ikon bookmark pada setiap kartu ayat.
              </p>
              <button
                onClick={() => onNavigateTab('surah-list')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-soft text-primary-deep rounded-xl text-xs font-semibold hover:bg-primary-deep hover:text-white transition cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Mulai Membaca Surat</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Notes Tab Content */}
      {activeTab === 'notes' && (
        <div className="space-y-3">
          {notes.length > 0 ? (
            notes.map((n) => (
              <div
                key={n.id}
                onClick={() => onOpenSurah(n.surahNumber, n.ayahNumber)}
                className="group bg-surface border border-border rounded-2xl p-5 hover:border-primary-deep/50 hover:shadow-xs transition-all cursor-pointer space-y-3"
              >
                <div className="flex items-center justify-between text-xs pb-2 border-b border-divider">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-accent-deep">
                      QS. {n.surahName} : Ayat {n.ayahNumber}
                    </span>
                    <span className="text-[10px] text-text-muted">
                      • {new Date(n.updatedAt).toLocaleDateString('id-ID')}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingNote(n);
                      }}
                      className="px-2.5 py-1 text-[11px] font-semibold text-accent-deep hover:bg-accent-light/30 rounded-lg transition"
                    >
                      Ubah Catatan
                    </button>
                    <button
                      onClick={(e) => handleDeleteNote(e, n.id)}
                      className="p-1 rounded-lg text-text-muted hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                      title="Hapus catatan"
                      aria-label="Hapus catatan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="bg-primary-soft/30 p-3 rounded-xl border border-border/80">
                  <p className="text-xs text-text font-medium leading-relaxed whitespace-pre-wrap">
                    {n.note}
                  </p>
                </div>

                <p className="font-quran text-right text-sm text-text-muted line-clamp-1" dir="rtl">
                  {n.textArab}
                </p>
              </div>
            ))
          ) : (
            <div className="bg-surface border border-border rounded-3xl p-12 text-center space-y-3">
              <FileText className="w-10 h-10 text-primary-deep/40 mx-auto" />
              <h3 className="font-bold text-sm text-text">Belum Ada Catatan Tadabbur</h3>
              <p className="text-xs text-text-muted max-w-sm mx-auto">
                Tuliskan renungan, faedah, atau hikmah dari setiap ayat yang Anda baca dengan menekan tombol catatan pada ayat.
              </p>
              <button
                onClick={() => onNavigateTab('surah-list')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-soft text-primary-deep rounded-xl text-xs font-semibold hover:bg-primary-deep hover:text-white transition cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Buka Al-Qur'an</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Editing Note Modal */}
      {editingNote && (
        <NoteModal
          surahNumber={editingNote.surahNumber}
          surahName={editingNote.surahName}
          ayahNumber={editingNote.ayahNumber}
          textArab={editingNote.textArab}
          onClose={() => setEditingNote(null)}
          onSaved={() => {
            setEditingNote(null);
            reloadData();
          }}
        />
      )}
    </div>
  );
};
