import { APP_CONFIG } from '../config/appConfig';

export interface ColorTokenItem {
  name: string;
  hex: string;
  rgb: string;
  role: string;
  proportion: string;
}

export interface ThemePalette {
  primary: ColorTokenItem;
  primarySoft: ColorTokenItem;
  primaryDeep: ColorTokenItem;
  secondary: ColorTokenItem;
  accent: ColorTokenItem;
  accentLight: ColorTokenItem;
  accentDeep: ColorTokenItem;
  background: ColorTokenItem;
  surface: ColorTokenItem;
  text: ColorTokenItem;
  textMuted: ColorTokenItem;
  border: ColorTokenItem;
  divider: ColorTokenItem;
  highlight: ColorTokenItem;
  shadow: ColorTokenItem;
  success: ColorTokenItem;
  warning: ColorTokenItem;
  error: ColorTokenItem;
}

// Helper: Hex to RGB
export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let clean = hex.replace('#', '');
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

// Helper: RGB to Hex
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  return '#' + [clamp(r), clamp(g), clamp(b)].map(v => v.toString(16).padStart(2, '0')).join('').toUpperCase();
}

// Helper: RGB to HSL
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

// Helper: HSL to RGB
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;
  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

// Generate complete deterministic theme from any base primary hex color
export function deriveThemeFromPrimary(primaryHex: string): ThemePalette {
  const rgb = hexToRgb(primaryHex);
  const { h, s, l } = rgbToHsl(rgb.r, rgb.g, rgb.b);

  // Soft tint for backgrounds / highlights (L: 96-98%)
  const softRgb = hslToRgb(h, Math.max(20, Math.min(50, s)), 96);
  const softHex = rgbToHex(softRgb.r, softRgb.g, softRgb.b);

  // Deep shade for active / borders / high-contrast buttons (L: 45-55%)
  const deepRgb = hslToRgb(h, Math.max(35, s), 48);
  const deepHex = rgbToHex(deepRgb.r, deepRgb.g, deepRgb.b);

  // Secondary harmonic shade
  const secondaryRgb = hslToRgb((h + 15) % 360, Math.max(25, s - 10), 88);
  const secondaryHex = rgbToHex(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b);

  // Accent: if hue is around pink/red/rose (330-30 deg), accent is radiant Gold (hue ~42)
  // Otherwise complementary/analogous gold-accent
  const accentHue = (h >= 300 || h <= 30) ? 42 : (h + 180) % 360;
  const accentRgb = hslToRgb(accentHue, 68, 48);
  const accentHex = rgbToHex(accentRgb.r, accentRgb.g, accentRgb.b);

  const accentLightRgb = hslToRgb(accentHue, 70, 72);
  const accentLightHex = rgbToHex(accentLightRgb.r, accentLightRgb.g, accentLightRgb.b);

  const accentDeepRgb = hslToRgb(accentHue, 75, 34);
  const accentDeepHex = rgbToHex(accentDeepRgb.r, accentDeepRgb.g, accentDeepRgb.b);

  // Background: Warm ivory/off-white tuned to the primary hue
  const bgRgb = hslToRgb(h, 20, 98);
  const bgHex = rgbToHex(bgRgb.r, bgRgb.g, bgRgb.b);

  // High contrast text (deep espresso/charcoal WCAG AAA > 12:1 against bg)
  const textRgb = hslToRgb(h, 15, 15);
  const textHex = rgbToHex(textRgb.r, textRgb.g, textRgb.b);

  const textMutedRgb = hslToRgb(h, 12, 42);
  const textMutedHex = rgbToHex(textMutedRgb.r, textMutedRgb.g, textMutedRgb.b);

  // Border & Divider
  const borderRgb = hslToRgb(h, 25, 90);
  const borderHex = rgbToHex(borderRgb.r, borderRgb.g, borderRgb.b);

  const dividerRgb = hslToRgb(h, 20, 94);
  const dividerHex = rgbToHex(dividerRgb.r, dividerRgb.g, dividerRgb.b);

  return {
    primary: {
      name: "Blush Rose Primary",
      hex: primaryHex.toUpperCase(),
      rgb: `${rgb.r}, ${rgb.g}, ${rgb.b}`,
      role: "Identitas visual utama, aksen tombol aktif, tab terpilih, ornamen medali",
      proportion: "25%",
    },
    primarySoft: {
      name: "Blush Pastel Soft",
      hex: softHex,
      rgb: `${softRgb.r}, ${softRgb.g}, ${softRgb.b}`,
      role: "Latar kartu ayat aktif, hover menu, badge halus",
      proportion: "10%",
    },
    primaryDeep: {
      name: "Blush Rose Deep",
      hex: deepHex,
      rgb: `${deepRgb.r}, ${deepRgb.g}, ${deepRgb.b}`,
      role: "Aksen tombol interaktif primer, ikon aktif, nomor surat",
      proportion: "8%",
    },
    secondary: {
      name: "Rose Cream Secondary",
      hex: secondaryHex,
      rgb: `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`,
      role: "Warna pendukung, kartu sekunder, tag kategori Makkiyyah/Madaniyyah",
      proportion: "10%",
    },
    accent: {
      name: "Imperial Gold Accent",
      hex: accentHex,
      rgb: `${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b}`,
      role: "Aksen premium, kaligrafi ornamen, pembatas ayat, bookmark bintang",
      proportion: "12%",
    },
    accentLight: {
      name: "Shimmer Gold Light",
      hex: accentLightHex,
      rgb: `${accentLightRgb.r}, ${accentLightRgb.g}, ${accentLightRgb.b}`,
      role: "Highlight pencarian, kilau ornamen, batas halus",
      proportion: "5%",
    },
    accentDeep: {
      name: "Bronze Gold Deep",
      hex: accentDeepHex,
      rgb: `${accentDeepRgb.r}, ${accentDeepRgb.g}, ${accentDeepRgb.b}`,
      role: "Label teks aksen emas kontras tinggi untuk aksesibilitas",
      proportion: "3%",
    },
    background: {
      name: "Warm Ivory Background",
      hex: bgHex,
      rgb: `${bgRgb.r}, ${bgRgb.g}, ${bgRgb.b}`,
      role: "Latar utama halaman untuk ketenangan visual saat tilawah lama",
      proportion: "40%",
    },
    surface: {
      name: "Pure Surface White",
      hex: "#FFFFFF",
      rgb: "255, 255, 255",
      role: "Permukaan kartu pembaca ayat, modal pop-up, search container",
      proportion: "35%",
    },
    text: {
      name: "Warm Espresso Dark",
      hex: textHex,
      rgb: `${textRgb.r}, ${textRgb.g}, ${textRgb.b}`,
      role: "Teks Arab harakat, judul surat, konten utama ber-kontras tinggi (WCAG AAA)",
      proportion: "30%",
    },
    textMuted: {
      name: "Subtle Warm Gray",
      hex: textMutedHex,
      rgb: `${textMutedRgb.r}, ${textMutedRgb.g}, ${textMutedRgb.b}`,
      role: "Terjemahan Indonesia, transliterasi Latin, deskripsi, footer",
      proportion: "25%",
    },
    border: {
      name: "Soft Filigree Border",
      hex: borderHex,
      rgb: `${borderRgb.r}, ${borderRgb.g}, ${borderRgb.b}`,
      role: "Garis batas kartu ayat, input pencarian, separator",
      proportion: "10%",
    },
    divider: {
      name: "Warm Divider",
      hex: dividerHex,
      rgb: `${dividerRgb.r}, ${dividerRgb.g}, ${dividerRgb.b}`,
      role: "Pemisah antar ayat dan header",
      proportion: "5%",
    },
    highlight: {
      name: "Quran Gold Glow",
      hex: "#FBF3DE",
      rgb: "251, 243, 222",
      role: "Highlight pencarian kata dalam ayat dan surah aktif",
      proportion: "5%",
    },
    shadow: {
      name: "Warm Rose Shadow",
      hex: "rgba(99, 63, 49, 0.08)",
      rgb: "99, 63, 49",
      role: "Bayangan lembut natural tanpa efek keruh",
      proportion: "Subtle",
    },
    success: {
      name: "Emerald Tilawah Success",
      hex: "#3D7856",
      rgb: "61, 120, 86",
      role: "Indikator target tercapai, khatam progres, bookmark tersimpan",
      proportion: "3%",
    },
    warning: {
      name: "Amber Advisory",
      hex: "#B07418",
      rgb: "176, 116, 24",
      role: "Status peringatan jaringan, offline mode banner",
      proportion: "2%",
    },
    error: {
      name: "Ruby Crimson Error",
      hex: "#C24141",
      rgb: "194, 65, 65",
      role: "Pesan error API, retry warning",
      proportion: "2%",
    },
  };
}

// Applies palette to CSS variables on root document
export function applyThemeToDocument(palette: ThemePalette) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;

  root.style.setProperty('--color-primary', palette.primary.hex);
  root.style.setProperty('--color-primary-soft', palette.primarySoft.hex);
  root.style.setProperty('--color-primary-deep', palette.primaryDeep.hex);
  root.style.setProperty('--color-secondary', palette.secondary.hex);
  root.style.setProperty('--color-accent', palette.accent.hex);
  root.style.setProperty('--color-accent-light', palette.accentLight.hex);
  root.style.setProperty('--color-accent-deep', palette.accentDeep.hex);
  root.style.setProperty('--color-background', palette.background.hex);
  root.style.setProperty('--color-surface', palette.surface.hex);
  root.style.setProperty('--color-text', palette.text.hex);
  root.style.setProperty('--color-text-muted', palette.textMuted.hex);
  root.style.setProperty('--color-border', palette.border.hex);
  root.style.setProperty('--color-divider', palette.divider.hex);
  root.style.setProperty('--color-highlight', palette.highlight.hex);
  root.style.setProperty('--color-success', palette.success.hex);
  root.style.setProperty('--color-warning', palette.warning.hex);
  root.style.setProperty('--color-error', palette.error.hex);

  // Update meta theme-color for browser address bar
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) {
    themeMeta.setAttribute('content', palette.primary.hex);
  }
}

// Initial active palette derived from APP_CONFIG
export const INITIAL_PALETTE = deriveThemeFromPrimary(APP_CONFIG.primaryColor);
