export type CEFR = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export interface Language {
  code: string;
  name: string;
  flag: string;
  learners: string;
}

export const languages: Language[] = [
  { code: "es", name: "Spanish", flag: "🇪🇸", learners: "12.4M" },
  { code: "fr", name: "French", flag: "🇫🇷", learners: "9.1M" },
  { code: "de", name: "German", flag: "🇩🇪", learners: "7.8M" },
  { code: "it", name: "Italian", flag: "🇮🇹", learners: "5.2M" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹", learners: "4.6M" },
  { code: "ja", name: "Japanese", flag: "🇯🇵", learners: "8.9M" },
  { code: "ko", name: "Korean", flag: "🇰🇷", learners: "6.3M" },
  { code: "zh", name: "Mandarin", flag: "🇨🇳", learners: "10.2M" },
  { code: "ar", name: "Arabic", flag: "🇸🇦", learners: "3.8M" },
  { code: "ru", name: "Russian", flag: "🇷🇺", learners: "4.1M" },
  { code: "hi", name: "Hindi", flag: "🇮🇳", learners: "3.4M" },
  { code: "nl", name: "Dutch", flag: "🇳🇱", learners: "1.9M" },
];

export const cefrLevels: { code: CEFR; label: string; color: string }[] = [
  { code: "A1", label: "Beginner", color: "mint" },
  { code: "A2", label: "Elementary", color: "mint" },
  { code: "B1", label: "Intermediate", color: "teal" },
  { code: "B2", label: "Upper-Int.", color: "teal" },
  { code: "C1", label: "Advanced", color: "navy" },
  { code: "C2", label: "Mastery", color: "navy" },
];

export interface Lesson {
  id: string;
  title: string;
  module: "Vocabulary" | "Grammar" | "Listening" | "Reading" | "Writing";
  level: CEFR;
  xp: number;
  duration: number;
  completed?: boolean;
  progress?: number;
}

export const lessons: Lesson[] = [
  { id: "1", title: "Greetings & Introductions", module: "Vocabulary", level: "A1", xp: 20, duration: 8, completed: true, progress: 100 },
  { id: "2", title: "Present Tense Verbs", module: "Grammar", level: "A1", xp: 25, duration: 12, completed: true, progress: 100 },
  { id: "3", title: "Ordering at a Café", module: "Listening", level: "A2", xp: 30, duration: 10, progress: 60 },
  { id: "4", title: "Family & Friends", module: "Vocabulary", level: "A1", xp: 20, duration: 7, progress: 30 },
  { id: "5", title: "Past Tense Stories", module: "Reading", level: "B1", xp: 35, duration: 15 },
  { id: "6", title: "Writing a Postcard", module: "Writing", level: "A2", xp: 40, duration: 18 },
  { id: "7", title: "Travel Conversations", module: "Listening", level: "B1", xp: 35, duration: 14 },
  { id: "8", title: "Subjunctive Mood", module: "Grammar", level: "B2", xp: 45, duration: 20 },
];

export const flashcards = [
  { front: "Hola", back: "Hello", example: "¡Hola! ¿Cómo estás?" },
  { front: "Gracias", back: "Thank you", example: "Muchas gracias por tu ayuda." },
  { front: "Por favor", back: "Please", example: "Un café, por favor." },
  { front: "Buenos días", back: "Good morning", example: "Buenos días, señora." },
  { front: "¿Cómo te llamas?", back: "What's your name?", example: "Hola, ¿cómo te llamas?" },
];

export const skillBreakdown = [
  { skill: "Vocabulary", value: 78 },
  { skill: "Grammar", value: 64 },
  { skill: "Listening", value: 82 },
  { skill: "Speaking", value: 55 },
  { skill: "Reading", value: 71 },
  { skill: "Writing", value: 48 },
];

export const weeklyProgress = [
  { day: "Mon", xp: 120 },
  { day: "Tue", xp: 80 },
  { day: "Wed", xp: 200 },
  { day: "Thu", xp: 150 },
  { day: "Fri", xp: 90 },
  { day: "Sat", xp: 240 },
  { day: "Sun", xp: 180 },
];

export const achievements = [
  { id: "1", icon: "🔥", name: "7-Day Streak", desc: "Practice for 7 days in a row", earned: true },
  { id: "2", icon: "📚", name: "Bookworm", desc: "Complete 25 reading lessons", earned: true },
  { id: "3", icon: "🎙️", name: "Smooth Talker", desc: "10 perfect pronunciation scores", earned: true },
  { id: "4", icon: "🌍", name: "Polyglot", desc: "Start learning 3 languages", earned: false },
  { id: "5", icon: "💎", name: "Gem Collector", desc: "Earn 1,000 gems", earned: false },
  { id: "6", icon: "🏆", name: "Top 10", desc: "Reach top 10 weekly leaderboard", earned: false },
];

export const leaderboard = [
  { rank: 1, name: "Sofia M.", xp: 2840, country: "🇪🇸", avatar: "SM" },
  { rank: 2, name: "Kenji T.", xp: 2610, country: "🇯🇵", avatar: "KT" },
  { rank: 3, name: "Amara O.", xp: 2480, country: "🇳🇬", avatar: "AO" },
  { rank: 4, name: "Lucas R.", xp: 2310, country: "🇧🇷", avatar: "LR" },
  { rank: 5, name: "You", xp: 2150, country: "🌍", avatar: "ME", isYou: true },
  { rank: 6, name: "Mei L.", xp: 1980, country: "🇨🇳", avatar: "ML" },
  { rank: 7, name: "Hans G.", xp: 1820, country: "🇩🇪", avatar: "HG" },
  { rank: 8, name: "Priya S.", xp: 1740, country: "🇮🇳", avatar: "PS" },
];

export const user = {
  name: "Alex Rivera",
  level: 14,
  xp: 2150,
  xpToNext: 3000,
  streak: 12,
  gems: 480,
  language: "Spanish",
  flag: "🇪🇸",
  cefr: "B1" as CEFR,
};
