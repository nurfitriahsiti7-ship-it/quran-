import { QARI_LIST, QariInfo } from '../types/quran';

export type AudioPlayMode = 'surah' | 'ayah';

export interface AudioTrackInfo {
  mode: AudioPlayMode;
  surahNumber: number;
  surahName: string;
  ayahNumber?: number;
  totalAyat?: number;
  qariId: string;
  url: string;
}

type AudioListener = () => void;

class AudioPlayerManager {
  private audio: HTMLAudioElement | null = null;
  private currentTrack: AudioTrackInfo | null = null;
  private isPlaying = false;
  private isLoading = false;
  private currentTime = 0;
  private duration = 0;
  private volume = 1;
  private playbackRate = 1.0;
  private isLooping = false;
  private listeners: Set<AudioListener> = new Set();
  private onTrackEndedCallback?: () => void;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio();
      this.setupAudioListeners();
    }
  }

  private setupAudioListeners() {
    if (!this.audio) return;

    this.audio.addEventListener('loadstart', () => {
      this.isLoading = true;
      this.notify();
    });

    this.audio.addEventListener('canplay', () => {
      this.isLoading = false;
      this.duration = this.audio?.duration || 0;
      this.notify();
    });

    this.audio.addEventListener('play', () => {
      this.isPlaying = true;
      this.isLoading = false;
      this.notify();
    });

    this.audio.addEventListener('pause', () => {
      this.isPlaying = false;
      this.notify();
    });

    this.audio.addEventListener('timeupdate', () => {
      if (this.audio) {
        this.currentTime = this.audio.currentTime;
        this.duration = this.audio.duration || 0;
        this.notify();
      }
    });

    this.audio.addEventListener('ended', () => {
      if (this.isLooping && this.audio) {
        this.audio.currentTime = 0;
        this.audio.play().catch(console.warn);
        return;
      }

      this.isPlaying = false;
      this.currentTime = 0;
      this.notify();
      if (this.onTrackEndedCallback) {
        this.onTrackEndedCallback();
      }
    });

    this.audio.addEventListener('error', (e) => {
      this.isLoading = false;
      this.isPlaying = false;
      console.warn('Audio playback error:', e);
      this.notify();
    });
  }

  public subscribe(listener: AudioListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public getState() {
    return {
      currentTrack: this.currentTrack,
      isPlaying: this.isPlaying,
      isLoading: this.isLoading,
      currentTime: this.currentTime,
      duration: this.duration,
      volume: this.volume,
      playbackRate: this.playbackRate,
      isLooping: this.isLooping,
    };
  }

  public playTrack(track: AudioTrackInfo, onEnded?: () => void) {
    if (!this.audio) return;
    this.onTrackEndedCallback = onEnded;

    // If same track and paused, just resume
    if (
      this.currentTrack &&
      this.currentTrack.url === track.url &&
      !this.isPlaying
    ) {
      this.audio.playbackRate = this.playbackRate;
      this.audio.play().catch(console.warn);
      return;
    }

    this.currentTrack = track;
    this.audio.src = track.url;
    this.audio.volume = this.volume;
    this.audio.playbackRate = this.playbackRate;
    this.audio.currentTime = 0;
    this.isLoading = true;
    this.notify();

    this.audio.play().catch((err) => {
      console.warn('Playback prevented:', err);
      this.isPlaying = false;
      this.isLoading = false;
      this.notify();
    });
  }

  public pause() {
    if (this.audio && this.isPlaying) {
      this.audio.pause();
    }
  }

  public resume() {
    if (this.audio && !this.isPlaying && this.currentTrack) {
      this.audio.playbackRate = this.playbackRate;
      this.audio.play().catch(console.warn);
    }
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.resume();
    }
  }

  public seek(seconds: number) {
    if (this.audio) {
      this.audio.currentTime = Math.max(0, Math.min(seconds, this.duration));
      this.currentTime = this.audio.currentTime;
      this.notify();
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audio) {
      this.audio.volume = this.volume;
      this.notify();
    }
  }

  public setPlaybackRate(rate: number) {
    this.playbackRate = rate;
    if (this.audio) {
      this.audio.playbackRate = rate;
      this.notify();
    }
  }

  public toggleLoop() {
    this.isLooping = !this.isLooping;
    this.notify();
  }

  public stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.currentTrack = null;
    this.isPlaying = false;
    this.isLoading = false;
    this.currentTime = 0;
    this.duration = 0;
    this.notify();
  }

  public getQari(qariId: string): QariInfo {
    return QARI_LIST.find((q) => q.id === qariId) || QARI_LIST[4]; // Default Mishary
  }
}

export const audioPlayer = new AudioPlayerManager();
