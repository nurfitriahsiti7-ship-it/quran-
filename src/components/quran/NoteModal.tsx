import React, { useState } from 'react';
import { X, FileText, Trash2, Save } from 'lucide-react';
import { getNoteForAyah, saveNote, deleteNote } from '../../storage/storageService';

interface NoteModalProps {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  textArab: string;
  onClose: () => void;
  onSaved: () => void;
}

export const NoteModal: React.FC<NoteModalProps> = ({
  surahNumber,
  surahName,
  ayahNumber,
  textArab,
  onClose,
  onSaved,
}) => {
  const existingNote = getNoteForAyah(surahNumber, ayahNumber);
  const [noteContent, setNoteContent] = useState(existingNote?.note || '');

  const handleSave = () => {
    if (!noteContent.trim()) {
      if (existingNote) {
        deleteNote(existingNote.id);
      }
    } else {
      saveNote({
        surahNumber,
        surahName,
        ayahNumber,
        textArab,
        note: noteContent.trim(),
      });
    }
    onSaved();
    onClose();
  };

  const handleDelete = () => {
    if (existingNote) {
      deleteNote(existingNote.id);
    }
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-surface rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-primary-soft/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-primary-soft flex items-center justify-center text-primary-deep">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-text">Catatan Tadabbur Ayat</h3>
              <p className="text-xs text-text-muted">
                QS. {surahName} : Ayat {ayahNumber}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-text-muted hover:text-text hover:bg-primary-soft transition cursor-pointer"
            aria-label="Tutup Catatan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3">
          <div className="p-3 bg-primary-soft/30 rounded-xl border border-border">
            <p className="font-quran text-right text-sm text-text leading-loose" dir="rtl">
              {textArab}
            </p>
          </div>

          <label className="block text-xs font-semibold text-text">
            Tuliskan renungan, catatan faedah, atau doa terkait ayat ini:
          </label>
          <textarea
            rows={5}
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="Tuliskan catatan pribadi Anda di sini..."
            className="w-full p-3 rounded-xl border border-border bg-background text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary-deep/40 resize-none"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-border bg-primary-soft/20">
          {existingNote ? (
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 text-xs text-red-600 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 transition cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              <span>Hapus Catatan</span>
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-text-muted hover:text-text rounded-xl border border-border hover:bg-primary-soft/50 transition cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-primary-deep rounded-xl shadow hover:brightness-105 active:scale-95 transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
