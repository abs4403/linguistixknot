/**
 * Web Speech API helpers — Text-to-Speech (TTS) + Speech Recognition.
 * Pure browser APIs, no external services needed.
 */

let voicesCache: SpeechSynthesisVoice[] = [];

const loadVoices = (): Promise<SpeechSynthesisVoice[]> =>
  new Promise((resolve) => {
    const ready = window.speechSynthesis.getVoices();
    if (ready.length) {
      voicesCache = ready;
      resolve(ready);
      return;
    }
    const handler = () => {
      voicesCache = window.speechSynthesis.getVoices();
      resolve(voicesCache);
    };
    window.speechSynthesis.addEventListener("voiceschanged", handler, { once: true });
    // Fallback if event never fires
    setTimeout(() => resolve(window.speechSynthesis.getVoices()), 800);
  });

const pickVoice = (locale: string, voices: SpeechSynthesisVoice[]) => {
  const lower = locale.toLowerCase();
  const lang = lower.split("-")[0];
  return (
    voices.find(v => v.lang.toLowerCase() === lower) ??
    voices.find(v => v.lang.toLowerCase().startsWith(lang + "-")) ??
    voices.find(v => v.lang.toLowerCase().startsWith(lang)) ??
    null
  );
};

export const isTtsSupported = () =>
  typeof window !== "undefined" && "speechSynthesis" in window;

export async function speak(text: string, locale: string, opts: { rate?: number } = {}) {
  if (!isTtsSupported()) return;
  window.speechSynthesis.cancel();
  const voices = voicesCache.length ? voicesCache : await loadVoices();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = locale;
  utter.rate = opts.rate ?? 0.9;
  const voice = pickVoice(locale, voices);
  if (voice) utter.voice = voice;
  window.speechSynthesis.speak(utter);
}

export const stopSpeaking = () => {
  if (isTtsSupported()) window.speechSynthesis.cancel();
};

/* ----- Speech Recognition ----- */

type SR = any;

export const getSpeechRecognition = (): SR | null => {
  if (typeof window === "undefined") return null;
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
};

export const isSttSupported = () => getSpeechRecognition() !== null;

export interface RecognitionResult {
  transcript: string;
  confidence: number;
}

export function listenOnce(locale: string): Promise<RecognitionResult> {
  return new Promise((resolve, reject) => {
    const Ctor = getSpeechRecognition();
    if (!Ctor) {
      reject(new Error("Speech recognition not supported in this browser. Try Chrome or Edge."));
      return;
    }
    const rec = new Ctor();
    rec.lang = locale;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.continuous = false;

    let settled = false;
    rec.onresult = (e: any) => {
      settled = true;
      const r = e.results[0][0];
      resolve({ transcript: r.transcript, confidence: r.confidence ?? 0.8 });
    };
    rec.onerror = (e: any) => {
      if (settled) return;
      settled = true;
      reject(new Error(e.error || "Recognition error"));
    };
    rec.onend = () => {
      if (!settled) {
        settled = true;
        reject(new Error("No speech detected. Try again."));
      }
    };
    try { rec.start(); } catch (err: any) { reject(err); }
  });
}

/** Normalize for comparison: lowercase, strip diacritics & punctuation, collapse spaces. */
const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/\s+/g, " ")
    .trim();

/** Levenshtein distance. */
const lev = (a: string, b: string) => {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[a.length][b.length];
};

/** Returns 0–100 similarity score between expected and spoken text. */
export const scoreSimilarity = (expected: string, spoken: string): number => {
  const a = normalize(expected);
  const b = normalize(spoken);
  if (!a || !b) return 0;
  const distance = lev(a, b);
  const maxLen = Math.max(a.length, b.length);
  return Math.max(0, Math.round((1 - distance / maxLen) * 100));
};
