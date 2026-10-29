import React from 'react';
import { Play, Pause, Square, Gauge } from 'lucide-react';

interface AutoScrollControlsProps {
  isScrolling: boolean;
  speed: number;
  onToggle: () => void;
  onStop: () => void;
  onChangeSpeed: (speed: number) => void;
}

export const AutoScrollControls: React.FC<AutoScrollControlsProps> = ({
  isScrolling,
  speed,
  onToggle,
  onStop,
  onChangeSpeed,
}) => {
  const speeds = [1, 2, 3, 4];

  return (
    <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-surface/90 backdrop-blur-md border border-border shadow-md">
      <button
        onClick={onToggle}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
          isScrolling
            ? 'bg-primary-deep text-white shadow-xs'
            : 'bg-primary-soft text-primary-deep hover:bg-primary-soft/80'
        }`}
        title={isScrolling ? 'Jeda Auto-Scroll' : 'Mulai Auto-Scroll Tilawah'}
      >
        {isScrolling ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        <span className="hidden sm:inline">
          {isScrolling ? 'Jeda Scroll' : 'Auto Scroll'}
        </span>
      </button>

      {isScrolling && (
        <button
          onClick={onStop}
          className="p-1.5 rounded-xl text-text-muted hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
          title="Hentikan Auto-Scroll"
        >
          <Square className="w-3.5 h-3.5 fill-current" />
        </button>
      )}

      {/* Speed selector: single cycle button on mobile, full buttons on desktop */}
      <div className="border-l border-divider pl-1.5 ml-1">
        {/* Desktop: all speed options */}
        <div className="hidden sm:flex items-center gap-1">
          <Gauge className="w-3.5 h-3.5 text-text-muted" />
          {speeds.map((s) => (
            <button
              key={s}
              onClick={() => onChangeSpeed(s)}
              className={`w-6 h-6 rounded-lg text-[10px] font-bold flex items-center justify-center transition cursor-pointer ${
                speed === s
                  ? 'bg-accent-deep text-white shadow-xs'
                  : 'text-text-muted hover:text-text hover:bg-primary-soft/50'
              }`}
              title={`Kecepatan ${s}x`}
            >
              {s}x
            </button>
          ))}
        </div>

        {/* Mobile: tap to cycle speed */}
        <button
          onClick={() => {
            const nextSpeed = (speed % 4) + 1;
            onChangeSpeed(nextSpeed);
          }}
          className="sm:hidden px-1.5 py-0.5 rounded-lg text-[10px] font-bold font-mono bg-primary-soft text-primary-deep"
          title="Ubah kecepatan auto-scroll"
        >
          {speed}x
        </button>
      </div>
    </div>
  );
};
