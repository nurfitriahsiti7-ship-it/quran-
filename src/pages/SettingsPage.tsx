import React, { useState } from 'react';
import {
  Settings,
  Palette,
  Type,
  Radio,
  Trophy,
  Gauge,
  RotateCcw,
  Sparkles,
  Info,
  Check,
} from 'lucide-react';
import { UserSettings, QARI_LIST } from '../types/quran';
import { APP_CONFIG } from '../config/appConfig';
import {
  deriveThemeFromPrimary,
  applyThemeToDocument,
  ThemePalette,
} from '../styles/themeTokens';

interface SettingsPageProps {
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onThemeColorChange: (color: string) => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  settings,
  onUpdateSettings,
  onThemeColorChange,
}) => {
  const [currentColor, setCurrentColor] = useState(
    settings.customPrimaryColor || APP_CONFIG.primaryColor
  );
  const [currentPalette, setCurrentPalette] = useState<ThemePalette>(() =>
    deriveThemeFromPrimary(settings.customPrimaryColor || APP_CONFIG.primaryColor)
  );

  const presetThemes = [
    { name: 'Soft Rose & Gold (Medali Default)', hex: '#F3C0BC', desc: 'Sesuai analisis gambar referensi medali' },
    { name: 'Islamic Emerald Green', hex: '#63A384', desc: 'Hijau zamrud klasik Al-Qur\'an' },
    { name: 'Noble Sapphire Blue', hex: '#87A9C9', desc: 'Biru teduh spiritual' },
    { name: 'Royal Amethyst Purple', hex: '#B89EC9', desc: 'Ungu anggun elegan' },
    { name: 'Warm Terracotta Gold', hex: '#DFA588', desc: 'Cokelat madu gurun pasir' },
  ];

  const handleApplyColor = (colorHex: string) => {
    setCurrentColor(colorHex);
    const newPal = deriveThemeFromPrimary(colorHex);
    setCurrentPalette(newPal);
    applyThemeToDocument(newPal);
    onThemeColorChange(colorHex);
    onUpdateSettings({ ...settings, customPrimaryColor: colorHex });
  };

  const handleResetColor = () => {
    handleApplyColor(APP_CONFIG.primaryColor);
    onUpdateSettings({ ...settings, customPrimaryColor: null });
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-surface border border-border rounded-3xl p-6 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center text-primary-deep">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-text">Pengaturan Aplikasi</h1>
            <p className="text-xs text-text-muted mt-0.5">
              Sesuaikan preferensi tilawah, ukuran teks, murottal, dan sistem warna adaptif
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: COLOR PALETTE & ADAPTIVE BRANDING ANALYZER */}
      <section className="bg-surface border border-border rounded-3xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-accent" />
            <div>
              <h2 className="text-base font-bold text-text">
                Analisis Color Palette & Desain Adaptif
              </h2>
              <p className="text-xs text-text-muted">
                Dihasilkan secara otomatis dari gambar referensi medali kaligrafi {APP_CONFIG.appName}
              </p>
            </div>
          </div>

          <button
            onClick={handleResetColor}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-semibold text-text hover:bg-primary-soft transition cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Warna Default</span>
          </button>
        </div>

        {/* Reference Image Badge & Character Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-primary-soft/40 border border-border md:col-span-1">
            <img
              src="/assets/aistudio/Medali_Bundar_Kaligrafi_Al-Qur_an_425f345a.png"
              alt="Medali Referensi"
              className="w-14 h-14 rounded-full object-cover shadow-sm shrink-0 border border-accent/40"
            />
            <div className="text-xs">
              <span className="font-bold text-text block">Sumber Referensi</span>
              <p className="text-text-muted text-[11px] mt-0.5">
                Medali Bundar Kaligrafi Al-Qur'an 3D Gold & Soft Blush Pink
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-surface border border-border md:col-span-2 text-xs space-y-1">
            <span className="font-bold text-text flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-accent" />
              <span>Karakter Visual yang Teridentifikasi:</span>
            </span>
            <p className="text-text-muted text-[11px] leading-relaxed">
              <strong>Soft, Luxury, Calm, & Spiritual</strong>: Kombinasi merah muda pastel (blush rose) sebagai warna identitas feminin nan lembut, berpadu harmonis dengan ornamen emas filigrafi mewah (warm imperial gold), di atas latar gading (warm ivory) untuk kenyamanan tilawah berdurasi lama tanpa silau.
            </p>
          </div>
        </div>

        {/* Interactive Palette Testing Presets */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-text block">
            Uji Coba Branding & Adaptasi Warna:
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {presetThemes.map((pt) => {
              const isSelected = currentColor.toUpperCase() === pt.hex.toUpperCase();
              return (
                <button
                  key={pt.hex}
                  onClick={() => handleApplyColor(pt.hex)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3 ${
                    isSelected
                      ? 'border-primary-deep bg-primary-soft/30 ring-2 ring-primary-deep/20 shadow-xs'
                      : 'border-border bg-surface hover:bg-primary-soft/20'
                  }`}
                >
                  <span
                    className="w-6 h-6 rounded-full shrink-0 shadow-xs border border-black/10"
                    style={{ backgroundColor: pt.hex }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-text truncate">{pt.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-primary-deep shrink-0" />}
                    </div>
                    <span className="text-[10px] text-text-muted truncate block">{pt.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Custom Color Picker */}
          <div className="pt-2 flex items-center gap-3">
            <label className="text-xs text-text-muted flex items-center gap-2">
              <span>Pilih Warna Custom Sendiri:</span>
              <input
                type="color"
                value={currentColor}
                onChange={(e) => handleApplyColor(e.target.value)}
                className="w-8 h-8 rounded-lg cursor-pointer border border-border"
              />
            </label>
            <span className="text-xs font-mono font-bold text-primary-deep">{currentColor}</span>
          </div>
        </div>

        {/* 10-Item Detailed Color Tokens Table */}
        <div className="space-y-2 pt-2">
          <label className="text-xs font-bold text-text block uppercase tracking-wider">
            Tabel 10 Token Warna Terpusat (Aktif):
          </label>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full text-left text-xs">
              <thead className="bg-primary-soft/50 border-b border-border text-text font-bold">
                <tr>
                  <th className="p-3">Warna</th>
                  <th className="p-3">Nama Token</th>
                  <th className="p-3">HEX & RGB</th>
                  <th className="p-3">Peran dalam Desain</th>
                  <th className="p-3">Proporsi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-text-muted">
                {[
                  { key: 'primary', label: '1. Primary Color', token: currentPalette.primary },
                  { key: 'secondary', label: '2. Secondary Color', token: currentPalette.secondary },
                  { key: 'accent', label: '3. Accent Color', token: currentPalette.accent },
                  { key: 'background', label: '4. Background Color', token: currentPalette.background },
                  { key: 'surface', label: '5. Surface Color', token: currentPalette.surface },
                  { key: 'text', label: '6. Text Color', token: currentPalette.text },
                  { key: 'textMuted', label: '7. Muted Text Color', token: currentPalette.textMuted },
                  { key: 'border', label: '8. Border & Divider', token: currentPalette.border },
                  { key: 'highlight', label: '9. Highlight Color', token: currentPalette.highlight },
                  { key: 'shadow', label: '10. Shadow Color', token: currentPalette.shadow },
                ].map((row) => (
                  <tr key={row.key} className="hover:bg-primary-soft/20">
                    <td className="p-3">
                      <span
                        className="inline-block w-5 h-5 rounded-md border border-black/10 shadow-xs align-middle"
                        style={{ backgroundColor: row.token.hex }}
                      />
                    </td>
                    <td className="p-3 font-semibold text-text">{row.label}</td>
                    <td className="p-3 font-mono text-[11px]">
                      <span className="font-bold text-text block">{row.token.hex}</span>
                      <span className="text-[10px] text-text-muted">rgb({row.token.rgb})</span>
                    </td>
                    <td className="p-3 text-[11px] leading-relaxed">{row.token.role}</td>
                    <td className="p-3 font-bold text-accent-deep">{row.token.proportion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SECTION 2: TYPOGRAPHY & READING SETTINGS */}
      <section className="bg-surface border border-border rounded-3xl p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <Type className="w-5 h-5 text-accent" />
          <h2 className="text-base font-bold text-text">Tipografi & Pembaca</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Arabic Font Size */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-text">Ukuran Huruf Arab</span>
              <span className="font-mono text-primary-deep font-bold">
                {settings.arabicFontSize}px
              </span>
            </div>
            <input
              type="range"
              min={22}
              max={44}
              step={2}
              value={settings.arabicFontSize}
              onChange={(e) =>
                onUpdateSettings({ ...settings, arabicFontSize: parseInt(e.target.value) })
              }
              className="w-full accent-primary-deep"
            />
            {/* Live Preview Box */}
            <div className="p-3 bg-primary-soft/30 rounded-xl border border-border">
              <p
                className="font-quran text-right text-text"
                style={{ fontSize: `${settings.arabicFontSize}px`, lineHeight: 2.2 }}
                dir="rtl"
              >
                بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
              </p>
            </div>
          </div>

          {/* Translation Font Size */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-text">Ukuran Teks Terjemahan</span>
              <span className="font-mono text-primary-deep font-bold">
                {settings.translationFontSize}px
              </span>
            </div>
            <input
              type="range"
              min={13}
              max={22}
              value={settings.translationFontSize}
              onChange={(e) =>
                onUpdateSettings({ ...settings, translationFontSize: parseInt(e.target.value) })
              }
              className="w-full accent-primary-deep"
            />
            {/* Live Preview Box */}
            <div className="p-3 bg-primary-soft/30 rounded-xl border border-border">
              <p
                className="text-text leading-relaxed"
                style={{ fontSize: `${settings.translationFontSize}px` }}
              >
                Dengan nama Allah Yang Maha Pengasih lagi Maha Penyayang.
              </p>
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-primary-soft/20 border border-border">
            <div>
              <span className="text-xs font-bold text-text block">Tampilkan Transliterasi Latin</span>
              <span className="text-[11px] text-text-muted">Bantuan ejaan membaca latin</span>
            </div>
            <input
              type="checkbox"
              checked={settings.showTransliteration}
              onChange={(e) =>
                onUpdateSettings({ ...settings, showTransliteration: e.target.checked })
              }
              className="w-4 h-4 accent-primary-deep cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-primary-soft/20 border border-border">
            <div>
              <span className="text-xs font-bold text-text block">Tampilkan Terjemahan Indonesia</span>
              <span className="text-[11px] text-text-muted">Terjemahan resmi Kemenag</span>
            </div>
            <input
              type="checkbox"
              checked={settings.showTranslation}
              onChange={(e) =>
                onUpdateSettings({ ...settings, showTranslation: e.target.checked })
              }
              className="w-4 h-4 accent-primary-deep cursor-pointer"
            />
          </div>
        </div>
      </section>

      {/* SECTION 3: MUROTTAL AUDIO & RECITER */}
      <section className="bg-surface border border-border rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <Radio className="w-5 h-5 text-accent" />
          <div>
            <h2 className="text-base font-bold text-text">Qari Murottal Favorit</h2>
            <p className="text-xs text-text-muted">
              Pilih suara pelantun Al-Qur'an resmi dari sumber equran.id
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QARI_LIST.map((q) => {
            const isSelected = settings.qariId === q.id;
            return (
              <div
                key={q.id}
                onClick={() => onUpdateSettings({ ...settings, qariId: q.id })}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-primary-deep bg-primary-soft/40 ring-1 ring-primary-deep'
                    : 'border-border bg-surface hover:bg-primary-soft/20'
                }`}
              >
                <div>
                  <h4 className="font-bold text-xs text-text">{q.name}</h4>
                  <p className="text-[10px] text-text-muted mt-0.5">{q.style}</p>
                </div>
                {isSelected && <Check className="w-4 h-4 text-primary-deep shrink-0" />}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: TILAWAH TARGET & AUTO-SCROLL */}
      <section className="bg-surface border border-border rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-border">
          <Trophy className="w-5 h-5 text-accent" />
          <h2 className="text-base font-bold text-text">Target Harian & Kecepatan Baca</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Daily Tilawah Target */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text block">
              Target Membaca Ayat per Hari:
            </label>
            <div className="flex items-center gap-2">
              {[5, 10, 20, 30, 50].map((t) => (
                <button
                  key={t}
                  onClick={() => onUpdateSettings({ ...settings, dailyAyahTarget: t })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    settings.dailyAyahTarget === t
                      ? 'bg-primary-deep text-white shadow-xs'
                      : 'border border-border bg-surface text-text hover:bg-primary-soft'
                  }`}
                >
                  {t} Ayat
                </button>
              ))}
            </div>
          </div>

          {/* Default Auto-scroll Speed */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-text block">
              Kecepatan Default Auto-Scroll:
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => onUpdateSettings({ ...settings, autoScrollSpeed: s })}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    settings.autoScrollSpeed === s
                      ? 'bg-accent-deep text-white shadow-xs'
                      : 'border border-border bg-surface text-text hover:bg-primary-soft'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
