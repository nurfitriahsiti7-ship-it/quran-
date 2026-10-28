import React, { useEffect, useState } from 'react';
import {
  Play,
  Pause,
  X,
  Volume2,
  VolumeX,
  Radio,
  ChevronUp,
  ChevronDown,
  Loader2,
  Repeat,
  Gauge,
} from 'lucide-react';
import { audioPlayer, AudioTrackInfo } from '../../services/audioService';
import { QARI_LIST } from '../../types/quran';

interface AudioPlayerBarProps {
  onJumpToAyah?: (surahNumber: number, ayahNumber: number) => void;
  onQariChange?: (qariId: string) => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({ onJumpToAyah, onQariChange }) => {
  const [playerState, setPlayerState] = useState(audioPlayer.getState());
  const [showQariMenu, setShowQariMenu] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [savedVolume, setSavedVolume] = useState(1);

  useEffect(() => {
    const unsubscribe = audioPlayer.subscribe(() => {
      setPlayerState({ ...audioPlayer.getState() });
    });
    return unsubscribe;
  }, []);

  if (!playerState.currentTrack) {
    return null;
  }

  const { currentTrack, isPlaying, isLoading, currentTime, duration, volume, playbackRate, isLooping } = playerState;
  const currentQari = audioPlayer.getQari(currentTrack.qariId);

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds <= 0) return '00:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    audioPlayer.seek(val);
  };

  const toggleMute = () => {
    if (isMuted) {
      audioPlayer.setVolume(savedVolume);
      setIsMuted(false);
    } else {
      setSavedVolume(volume);
      audioPlayer.setVolume(0);
      setIsMuted(true);
    }
  };

  const cycleSpeed = () => {
    const rates = [1.0, 1.25, 1.5, 0.75];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    audioPlayer.setPlaybackRate(rates[nextIdx]);
  };

  const handleSelectQari = (qariId: string) => {
    setShowQariMenu(false);
    if (onQariChange) onQariChange(qariId);

    if (currentTrack) {
      const updatedTrack: AudioTrackInfo = {
        ...currentTrack,
        qariId,
        url: currentTrack.mode === 'surah'
          ? `https://cdn.equran.id/audio-full/${getQariCdnFolder(qariId)}/${String(currentTrack.surahNumber).padStart(3, '0')}.mp3`
          : `https://cdn.equran.id/audio-partial/${getQariCdnFolder(qariId)}/${String(currentTrack.surahNumber).padStart(3, '0')}${String(currentTrack.ayahNumber || 1).padStart(3, '0')}.mp3`
      };
      audioPlayer.playTrack(updatedTrack);
    }
  };

  return (
    <div className="fixed bottom-16 md:bottom-5 left-3 right-3 md:left-auto md:right-6 md:w-96 z-40 bg-surface/95 backdrop-blur-md border border-border rounded-2xl shadow-xl p-3.5 transition-all">
      {/* Top track info & close */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="w-7 h-7 rounded-full bg-primary-soft flex items-center justify-center text-primary-deep shrink-0">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
          </div>
          <div className="overflow-hidden">
            <h4
              onClick={() => {
                if (currentTrack.ayahNumber && onJumpToAyah) {
                  onJumpToAyah(currentTrack.surahNumber, currentTrack.ayahNumber);
                }
              }}
              className="text-xs font-bold text-text truncate hover:text-primary-deep cursor-pointer"
            >
              {currentTrack.surahName}{' '}
              {currentTrack.ayahNumber ? `• Ayat ${currentTrack.ayahNumber}` : '• Surat Lengkap'}
            </h4>
            <div className="relative">
              <button
                onClick={() => setShowQariMenu(!showQariMenu)}
                className="flex items-center gap-1 text-[11px] text-accent-deep hover:underline cursor-pointer"
              >
                <span>{currentQari.name}</span>
                {showQariMenu ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>

              {/* Qari selector popup */}
              {showQariMenu && (
                <div className="absolute bottom-full left-0 mb-1 w-64 rounded-xl bg-surface border border-border shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95">
                  <p className="text-[10px] font-bold text-text-muted px-2 py-1 uppercase tracking-wider">
                    Pilih Qari Murottal
                  </p>
                  <div className="max-h-48 overflow-y-auto space-y-0.5">
                    {QARI_LIST.map((q) => (
                      <button
                        key={q.id}
                        onClick={() => handleSelectQari(q.id)}
                        className={`w-full text-left px-2 py-1.5 rounded-lg text-xs flex items-center justify-between transition cursor-pointer ${
                          q.id === currentTrack.qariId
                            ? 'bg-primary-soft text-primary-deep font-semibold'
                            : 'hover:bg-primary-soft/50 text-text'
                        }`}
                      >
                        <span className="truncate">{q.name}</span>
                        <span className="text-[9px] text-text-muted shrink-0">{q.style}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => audioPlayer.stop()}
          className="p-1 rounded-full text-text-muted hover:text-text hover:bg-primary-soft/60 transition cursor-pointer"
          aria-label="Tutup pemutar audio"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress slider */}
      <div className="space-y-1">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-border rounded-lg appearance-none cursor-pointer accent-primary-deep"
        />
        <div className="flex justify-between text-[10px] text-text-muted font-mono">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-2 pt-1 border-t border-border/60">
        <div className="flex items-center gap-1">
          {/* Mute/Volume */}
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg text-text-muted hover:text-text hover:bg-primary-soft transition cursor-pointer"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            title={isMuted ? 'Buka Suara' : 'Bisukan Suara'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Loop / Repeat Murojaah button */}
          <button
            onClick={() => audioPlayer.toggleLoop()}
            className={`p-1.5 rounded-lg transition cursor-pointer ${
              isLooping
                ? 'bg-primary-soft text-primary-deep font-bold ring-1 ring-primary-deep'
                : 'text-text-muted hover:text-text hover:bg-primary-soft'
            }`}
            title={isLooping ? 'Ulangi Aktif (Muroja\'ah)' : 'Aktifkan Pengulangan (Muroja\'ah)'}
            aria-label="Ulangi audio"
          >
            <Repeat className="w-4 h-4" />
          </button>

          {/* Speed cycle button */}
          <button
            onClick={cycleSpeed}
            className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold text-text-muted hover:text-text hover:bg-primary-soft transition cursor-pointer"
            title="Ubah kecepatan audio"
          >
            {playbackRate}x
          </button>
        </div>

        {/* Play/Pause Button */}
        <button
          onClick={() => audioPlayer.togglePlay()}
          disabled={isLoading}
          className="w-10 h-10 rounded-full bg-primary-deep text-white flex items-center justify-center shadow hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          aria-label={isPlaying ? 'Jeda Murottal' : 'Putar Murottal'}
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5 ml-0.5" />
          )}
        </button>

        <span className="text-[10px] font-medium text-text-muted px-2 py-0.5 rounded-md bg-primary-soft/60">
          {currentTrack.mode === 'ayah' ? 'Per Ayat' : 'Surat'}
        </span>
      </div>
    </div>
  );
};

function getQariCdnFolder(id: string): string {
  switch (id) {
    case '01': return 'Abdullah-Al-Juhany';
    case '02': return 'Abdul-Muhsin-Al-Qasim';
    case '03': return 'Abdurrahman-as-Sudais';
    case '04': return 'Ibrahim-Al-Dossari';
    case '05': return 'Misyari-Rasyid-Al-Afasi';
    case '06': return 'Yasser-Al-Dosari';
    default: return 'Misyari-Rasyid-Al-Afasi';
  }
}
