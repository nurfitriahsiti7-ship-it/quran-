import { SurahListItem, SurahDetail, TafsirDetail } from '../types/quran';
import { getCachedData, setCachedData } from './cacheService';

const BASE_URL = 'https://equran.id/api/v2';
const TIMEOUT_MS = 12000;

interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

async function fetchWithRetry<T>(url: string, retries = 2, signal?: AbortSignal): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    // Link external abort signal if provided
    const onExternalAbort = () => controller.abort();
    if (signal) {
      signal.addEventListener('abort', onExternalAbort, { once: true });
    }

    try {
      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        },
      });

      clearTimeout(timeoutId);
      if (signal) signal.removeEventListener('abort', onExternalAbort);

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      const json: ApiResponse<T> = await response.json();
      if (json.code !== 200 || !json.data) {
        throw new Error(json.message || 'Respons API tidak valid atau data kosong.');
      }

      return json.data;
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      if (signal) signal.removeEventListener('abort', onExternalAbort);

      const error = err instanceof Error ? err : new Error(String(err));
      lastError = error;

      // Don't retry if user explicitly aborted
      if (signal?.aborted) {
        throw error;
      }

      // Small backoff before next attempt
      if (attempt < retries) {
        await new Promise((res) => setTimeout(res, 500 * (attempt + 1)));
      }
    }
  }

  throw lastError || new Error('Gagal menghubungi server Al-Qur\'an.');
}

/**
 * Fetch all 114 Surahs
 */
export async function getAllSurahs(signal?: AbortSignal): Promise<SurahListItem[]> {
  const cacheKey = 'surah_list_v2';
  const cached = await getCachedData<SurahListItem[]>(cacheKey, 24 * 60 * 60 * 1000);
  if (cached && Array.isArray(cached) && cached.length === 114) {
    return cached;
  }

  try {
    const data = await fetchWithRetry<SurahListItem[]>(`${BASE_URL}/surat`, 2, signal);
    if (Array.isArray(data) && data.length > 0) {
      setCachedData(cacheKey, data);
    }
    return data;
  } catch (error) {
    // If network fails but we had stale cached data, return stale cache
    if (cached && Array.isArray(cached) && cached.length > 0) {
      console.warn('Network failed, returning cached surah list');
      return cached;
    }
    throw error;
  }
}

/**
 * Fetch full Surah detail with all ayat
 */
export async function getSurahDetail(surahNumber: number, signal?: AbortSignal): Promise<SurahDetail> {
  const cacheKey = `surah_detail_${surahNumber}`;
  const cached = await getCachedData<SurahDetail>(cacheKey, 7 * 24 * 60 * 60 * 1000);
  if (cached && cached.ayat && cached.ayat.length > 0) {
    return cached;
  }

  try {
    const data = await fetchWithRetry<SurahDetail>(`${BASE_URL}/surat/${surahNumber}`, 2, signal);
    if (data && data.ayat) {
      setCachedData(cacheKey, data);
    }
    return data;
  } catch (error) {
    if (cached) {
      return cached;
    }
    throw error;
  }
}

/**
 * Fetch Surah tafsir detail from Kemenag API
 */
export async function getTafsirDetail(surahNumber: number, signal?: AbortSignal): Promise<TafsirDetail> {
  const cacheKey = `tafsir_detail_${surahNumber}`;
  const cached = await getCachedData<TafsirDetail>(cacheKey, 14 * 24 * 60 * 60 * 1000);
  if (cached && cached.tafsir && cached.tafsir.length > 0) {
    return cached;
  }

  try {
    const data = await fetchWithRetry<TafsirDetail>(`${BASE_URL}/tafsir/${surahNumber}`, 2, signal);
    if (data && data.tafsir) {
      setCachedData(cacheKey, data);
    }
    return data;
  } catch (error) {
    if (cached) {
      return cached;
    }
    throw error;
  }
}
