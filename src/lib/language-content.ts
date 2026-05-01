import type { CEFR } from "./mock-data";

export interface VocabCard {
  front: string;       // target language
  back: string;        // english
  example: string;     // sentence in target language
  exampleEn?: string;  // english translation
  pronunciation?: string; // romanization / IPA helper
}

export interface LessonContent {
  id: string;
  title: string;
  module: "Vocabulary" | "Grammar" | "Listening" | "Reading" | "Writing";
  level: CEFR;
  xp: number;
  duration: number;
  cards: VocabCard[];
}

export interface LanguagePack {
  code: string;
  name: string;
  flag: string;
  /** BCP-47 locale used by Web Speech API (TTS + recognition) */
  locale: string;
  lessons: LessonContent[];
}

/* -------------------- SPANISH -------------------- */
const spanish: LanguagePack = {
  code: "es", name: "Spanish", flag: "🇪🇸", locale: "es-ES",
  lessons: [
    {
      id: "es-a1-greetings", title: "Greetings & Introductions", module: "Vocabulary", level: "A1", xp: 20, duration: 8,
      cards: [
        { front: "Hola", back: "Hello", example: "¡Hola! ¿Cómo estás?", exampleEn: "Hi! How are you?" },
        { front: "Buenos días", back: "Good morning", example: "Buenos días, señora.", exampleEn: "Good morning, ma'am." },
        { front: "Buenas noches", back: "Good night", example: "Buenas noches, hasta mañana.", exampleEn: "Good night, see you tomorrow." },
        { front: "¿Cómo te llamas?", back: "What's your name?", example: "Hola, ¿cómo te llamas?", exampleEn: "Hi, what's your name?" },
        { front: "Me llamo Ana", back: "My name is Ana", example: "Mucho gusto, me llamo Ana.", exampleEn: "Nice to meet you, my name is Ana." },
        { front: "Mucho gusto", back: "Nice to meet you", example: "Mucho gusto en conocerte.", exampleEn: "Pleased to meet you." },
        { front: "Adiós", back: "Goodbye", example: "Adiós, hasta luego.", exampleEn: "Bye, see you later." },
      ],
    },
    {
      id: "es-a1-cafe", title: "At the Café", module: "Vocabulary", level: "A1", xp: 25, duration: 10,
      cards: [
        { front: "Un café, por favor", back: "A coffee, please", example: "Un café con leche, por favor.", exampleEn: "A coffee with milk, please." },
        { front: "La cuenta", back: "The bill", example: "La cuenta, por favor.", exampleEn: "The bill, please." },
        { front: "Agua", back: "Water", example: "Una botella de agua.", exampleEn: "A bottle of water." },
        { front: "Pan", back: "Bread", example: "Quiero pan tostado.", exampleEn: "I want toast." },
        { front: "Delicioso", back: "Delicious", example: "Está delicioso, gracias.", exampleEn: "It's delicious, thanks." },
        { front: "Camarero", back: "Waiter", example: "Camarero, otra agua por favor.", exampleEn: "Waiter, another water please." },
      ],
    },
    {
      id: "es-a2-family", title: "Family & Friends", module: "Vocabulary", level: "A2", xp: 30, duration: 12,
      cards: [
        { front: "Madre", back: "Mother", example: "Mi madre se llama Laura.", exampleEn: "My mother's name is Laura." },
        { front: "Padre", back: "Father", example: "Mi padre es médico.", exampleEn: "My father is a doctor." },
        { front: "Hermano", back: "Brother", example: "Tengo un hermano mayor.", exampleEn: "I have an older brother." },
        { front: "Abuela", back: "Grandmother", example: "Mi abuela cocina muy bien.", exampleEn: "My grandmother cooks very well." },
        { front: "Amigo", back: "Friend", example: "Él es mi mejor amigo.", exampleEn: "He is my best friend." },
        { front: "Casado", back: "Married", example: "Mi tía está casada.", exampleEn: "My aunt is married." },
      ],
    },
    {
      id: "es-b1-travel", title: "Travel Conversations", module: "Listening", level: "B1", xp: 35, duration: 14,
      cards: [
        { front: "El vuelo se retrasó", back: "The flight was delayed", example: "Lo siento, el vuelo se retrasó dos horas.", exampleEn: "Sorry, the flight was delayed two hours." },
        { front: "¿Dónde está la estación?", back: "Where is the station?", example: "Disculpe, ¿dónde está la estación de tren?", exampleEn: "Excuse me, where is the train station?" },
        { front: "Reservar una habitación", back: "Book a room", example: "Quisiera reservar una habitación doble.", exampleEn: "I'd like to book a double room." },
        { front: "Tengo una reserva", back: "I have a reservation", example: "Buenos días, tengo una reserva a nombre de Pérez.", exampleEn: "Good morning, I have a reservation under Pérez." },
      ],
    },
  ],
};

/* -------------------- FRENCH -------------------- */
const french: LanguagePack = {
  code: "fr", name: "French", flag: "🇫🇷", locale: "fr-FR",
  lessons: [
    {
      id: "fr-a1-greetings", title: "Greetings & Politeness", module: "Vocabulary", level: "A1", xp: 20, duration: 8,
      cards: [
        { front: "Bonjour", back: "Hello / Good day", example: "Bonjour, comment allez-vous ?", exampleEn: "Hello, how are you?" },
        { front: "Bonsoir", back: "Good evening", example: "Bonsoir madame.", exampleEn: "Good evening, ma'am." },
        { front: "Merci beaucoup", back: "Thank you very much", example: "Merci beaucoup pour votre aide.", exampleEn: "Thanks a lot for your help." },
        { front: "S'il vous plaît", back: "Please (formal)", example: "Un café, s'il vous plaît.", exampleEn: "A coffee, please." },
        { front: "Je m'appelle Marc", back: "My name is Marc", example: "Bonjour, je m'appelle Marc.", exampleEn: "Hi, my name is Marc." },
        { front: "Au revoir", back: "Goodbye", example: "Au revoir, à demain !", exampleEn: "Goodbye, see you tomorrow!" },
      ],
    },
    {
      id: "fr-a2-food", title: "Food & Restaurants", module: "Vocabulary", level: "A2", xp: 25, duration: 10,
      cards: [
        { front: "Le pain", back: "Bread", example: "J'achète le pain à la boulangerie.", exampleEn: "I buy bread at the bakery." },
        { front: "Le fromage", back: "Cheese", example: "J'adore le fromage français.", exampleEn: "I love French cheese." },
        { front: "L'addition", back: "The bill", example: "L'addition, s'il vous plaît.", exampleEn: "The bill, please." },
        { front: "Délicieux", back: "Delicious", example: "Ce gâteau est délicieux !", exampleEn: "This cake is delicious!" },
        { front: "Avoir faim", back: "To be hungry", example: "J'ai très faim ce soir.", exampleEn: "I'm very hungry tonight." },
      ],
    },
    {
      id: "fr-b1-work", title: "At the Office", module: "Reading", level: "B1", xp: 35, duration: 14,
      cards: [
        { front: "Une réunion", back: "A meeting", example: "Nous avons une réunion à dix heures.", exampleEn: "We have a meeting at ten." },
        { front: "Le collègue", back: "The colleague", example: "Mon collègue est très sympathique.", exampleEn: "My colleague is very nice." },
        { front: "Envoyer un courriel", back: "To send an email", example: "Je vais envoyer un courriel au client.", exampleEn: "I'll send an email to the client." },
      ],
    },
  ],
};

/* -------------------- GERMAN -------------------- */
const german: LanguagePack = {
  code: "de", name: "German", flag: "🇩🇪", locale: "de-DE",
  lessons: [
    {
      id: "de-a1-basics", title: "Basics & Greetings", module: "Vocabulary", level: "A1", xp: 20, duration: 8,
      cards: [
        { front: "Hallo", back: "Hello", example: "Hallo, wie geht's?", exampleEn: "Hi, how are you?" },
        { front: "Guten Morgen", back: "Good morning", example: "Guten Morgen, Frau Schmidt.", exampleEn: "Good morning, Mrs. Schmidt." },
        { front: "Danke schön", back: "Thank you very much", example: "Danke schön für das Geschenk.", exampleEn: "Thank you for the gift." },
        { front: "Ich heiße Lukas", back: "My name is Lukas", example: "Hallo, ich heiße Lukas.", exampleEn: "Hi, my name is Lukas." },
        { front: "Auf Wiedersehen", back: "Goodbye", example: "Auf Wiedersehen, bis morgen.", exampleEn: "Goodbye, see you tomorrow." },
        { front: "Entschuldigung", back: "Excuse me / Sorry", example: "Entschuldigung, wo ist der Bahnhof?", exampleEn: "Excuse me, where is the station?" },
      ],
    },
    {
      id: "de-a2-shopping", title: "Shopping", module: "Vocabulary", level: "A2", xp: 30, duration: 12,
      cards: [
        { front: "Wie viel kostet das?", back: "How much does it cost?", example: "Entschuldigung, wie viel kostet das Brot?", exampleEn: "Excuse me, how much does the bread cost?" },
        { front: "Zu teuer", back: "Too expensive", example: "Das ist mir zu teuer.", exampleEn: "That's too expensive for me." },
        { front: "Ich nehme es", back: "I'll take it", example: "Okay, ich nehme es.", exampleEn: "Okay, I'll take it." },
      ],
    },
  ],
};

/* -------------------- ITALIAN -------------------- */
const italian: LanguagePack = {
  code: "it", name: "Italian", flag: "🇮🇹", locale: "it-IT",
  lessons: [
    {
      id: "it-a1-greetings", title: "Greetings & Basics", module: "Vocabulary", level: "A1", xp: 20, duration: 8,
      cards: [
        { front: "Ciao", back: "Hi / Bye", example: "Ciao, come stai?", exampleEn: "Hi, how are you?" },
        { front: "Buongiorno", back: "Good morning", example: "Buongiorno, signora!", exampleEn: "Good morning, ma'am!" },
        { front: "Grazie mille", back: "Thanks a lot", example: "Grazie mille per tutto.", exampleEn: "Thanks a lot for everything." },
        { front: "Mi chiamo Luca", back: "My name is Luca", example: "Piacere, mi chiamo Luca.", exampleEn: "Nice to meet you, I'm Luca." },
        { front: "Arrivederci", back: "Goodbye", example: "Arrivederci, a presto!", exampleEn: "Goodbye, see you soon!" },
      ],
    },
    {
      id: "it-a2-food", title: "Food & Drink", module: "Vocabulary", level: "A2", xp: 25, duration: 10,
      cards: [
        { front: "Un caffè", back: "A coffee", example: "Un caffè, per favore.", exampleEn: "A coffee, please." },
        { front: "La pizza", back: "The pizza", example: "Vorrei una pizza margherita.", exampleEn: "I'd like a margherita pizza." },
        { front: "Il conto", back: "The bill", example: "Il conto, per favore.", exampleEn: "The bill, please." },
        { front: "Buonissimo", back: "Very good (food)", example: "Questo gelato è buonissimo!", exampleEn: "This gelato is amazing!" },
      ],
    },
  ],
};

/* -------------------- PORTUGUESE -------------------- */
const portuguese: LanguagePack = {
  code: "pt", name: "Portuguese", flag: "🇵🇹", locale: "pt-PT",
  lessons: [
    {
      id: "pt-a1-greetings", title: "Greetings", module: "Vocabulary", level: "A1", xp: 20, duration: 8,
      cards: [
        { front: "Olá", back: "Hello", example: "Olá, tudo bem?", exampleEn: "Hi, all good?" },
        { front: "Bom dia", back: "Good morning", example: "Bom dia, professor.", exampleEn: "Good morning, teacher." },
        { front: "Obrigado", back: "Thank you (m)", example: "Muito obrigado pela ajuda.", exampleEn: "Thanks a lot for the help." },
        { front: "Por favor", back: "Please", example: "Um café, por favor.", exampleEn: "A coffee, please." },
        { front: "Até logo", back: "See you later", example: "Tchau, até logo!", exampleEn: "Bye, see you later!" },
      ],
    },
    {
      id: "pt-a2-travel", title: "Travel", module: "Listening", level: "A2", xp: 30, duration: 12,
      cards: [
        { front: "Onde fica o hotel?", back: "Where is the hotel?", example: "Desculpe, onde fica o hotel Central?", exampleEn: "Excuse me, where is the Central Hotel?" },
        { front: "Quanto custa?", back: "How much is it?", example: "Quanto custa a passagem?", exampleEn: "How much is the ticket?" },
      ],
    },
  ],
};

/* -------------------- JAPANESE -------------------- */
const japanese: LanguagePack = {
  code: "ja", name: "Japanese", flag: "🇯🇵", locale: "ja-JP",
  lessons: [
    {
      id: "ja-a1-greetings", title: "Greetings (あいさつ)", module: "Vocabulary", level: "A1", xp: 25, duration: 10,
      cards: [
        { front: "こんにちは", back: "Hello", example: "こんにちは、田中さん。", exampleEn: "Hello, Mr. Tanaka.", pronunciation: "konnichiwa" },
        { front: "おはようございます", back: "Good morning (polite)", example: "おはようございます、先生。", exampleEn: "Good morning, teacher.", pronunciation: "ohayou gozaimasu" },
        { front: "ありがとうございます", back: "Thank you (polite)", example: "本当にありがとうございます。", exampleEn: "Thank you very much.", pronunciation: "arigatou gozaimasu" },
        { front: "すみません", back: "Excuse me / Sorry", example: "すみません、駅はどこですか。", exampleEn: "Excuse me, where is the station?", pronunciation: "sumimasen" },
        { front: "はじめまして", back: "Nice to meet you", example: "はじめまして、ジョンです。", exampleEn: "Nice to meet you, I'm John.", pronunciation: "hajimemashite" },
        { front: "さようなら", back: "Goodbye", example: "さようなら、また明日。", exampleEn: "Goodbye, see you tomorrow.", pronunciation: "sayounara" },
      ],
    },
    {
      id: "ja-a2-food", title: "Food & Restaurants", module: "Vocabulary", level: "A2", xp: 30, duration: 12,
      cards: [
        { front: "おいしい", back: "Delicious", example: "このラーメンはとてもおいしいです。", exampleEn: "This ramen is very delicious.", pronunciation: "oishii" },
        { front: "お水ください", back: "Water please", example: "すみません、お水ください。", exampleEn: "Excuse me, water please.", pronunciation: "omizu kudasai" },
        { front: "いただきます", back: "Thanks for the meal (before)", example: "いただきます！", exampleEn: "Let's eat!", pronunciation: "itadakimasu" },
        { front: "ごちそうさま", back: "Thanks for the meal (after)", example: "ごちそうさまでした。", exampleEn: "Thank you for the meal.", pronunciation: "gochisousama" },
      ],
    },
  ],
};

/* -------------------- KOREAN -------------------- */
const korean: LanguagePack = {
  code: "ko", name: "Korean", flag: "🇰🇷", locale: "ko-KR",
  lessons: [
    {
      id: "ko-a1-greetings", title: "Greetings (인사)", module: "Vocabulary", level: "A1", xp: 25, duration: 10,
      cards: [
        { front: "안녕하세요", back: "Hello (polite)", example: "안녕하세요, 만나서 반갑습니다.", exampleEn: "Hello, nice to meet you.", pronunciation: "annyeong-haseyo" },
        { front: "감사합니다", back: "Thank you", example: "도와주셔서 감사합니다.", exampleEn: "Thank you for helping.", pronunciation: "gamsa-hamnida" },
        { front: "죄송합니다", back: "I'm sorry", example: "늦어서 죄송합니다.", exampleEn: "Sorry I'm late.", pronunciation: "joesong-hamnida" },
        { front: "이름이 뭐예요?", back: "What's your name?", example: "안녕하세요, 이름이 뭐예요?", exampleEn: "Hi, what's your name?", pronunciation: "ireumi mwoyeyo" },
        { front: "안녕히 가세요", back: "Goodbye (to person leaving)", example: "안녕히 가세요, 또 봐요.", exampleEn: "Goodbye, see you again.", pronunciation: "annyeonghi gaseyo" },
      ],
    },
  ],
};

/* -------------------- MANDARIN -------------------- */
const mandarin: LanguagePack = {
  code: "zh", name: "Mandarin", flag: "🇨🇳", locale: "zh-CN",
  lessons: [
    {
      id: "zh-a1-greetings", title: "Greetings (问候)", module: "Vocabulary", level: "A1", xp: 25, duration: 10,
      cards: [
        { front: "你好", back: "Hello", example: "你好，我叫小明。", exampleEn: "Hello, my name is Xiaoming.", pronunciation: "nǐ hǎo" },
        { front: "谢谢", back: "Thank you", example: "谢谢你的帮助。", exampleEn: "Thank you for your help.", pronunciation: "xièxiè" },
        { front: "对不起", back: "Sorry", example: "对不起，我迟到了。", exampleEn: "Sorry, I'm late.", pronunciation: "duìbùqǐ" },
        { front: "再见", back: "Goodbye", example: "再见，明天见！", exampleEn: "Goodbye, see you tomorrow!", pronunciation: "zàijiàn" },
        { front: "你叫什么名字？", back: "What's your name?", example: "你好，你叫什么名字？", exampleEn: "Hello, what's your name?", pronunciation: "nǐ jiào shénme míngzì" },
        { front: "我是美国人", back: "I am American", example: "我是美国人，你呢？", exampleEn: "I'm American, and you?", pronunciation: "wǒ shì měiguó rén" },
      ],
    },
    {
      id: "zh-a2-numbers", title: "Numbers & Shopping", module: "Vocabulary", level: "A2", xp: 30, duration: 12,
      cards: [
        { front: "多少钱？", back: "How much?", example: "这个多少钱？", exampleEn: "How much is this?", pronunciation: "duōshǎo qián" },
        { front: "太贵了", back: "Too expensive", example: "太贵了，便宜一点。", exampleEn: "Too expensive, a bit cheaper.", pronunciation: "tài guì le" },
        { front: "我要买", back: "I want to buy", example: "我要买一杯咖啡。", exampleEn: "I want to buy a coffee.", pronunciation: "wǒ yào mǎi" },
      ],
    },
  ],
};

/* -------------------- ARABIC -------------------- */
const arabic: LanguagePack = {
  code: "ar", name: "Arabic", flag: "🇸🇦", locale: "ar-SA",
  lessons: [
    {
      id: "ar-a1-greetings", title: "Greetings (التحيات)", module: "Vocabulary", level: "A1", xp: 25, duration: 10,
      cards: [
        { front: "مرحبا", back: "Hello", example: "مرحبا، كيف حالك؟", exampleEn: "Hello, how are you?", pronunciation: "marhaba" },
        { front: "السلام عليكم", back: "Peace be upon you", example: "السلام عليكم ورحمة الله.", exampleEn: "Peace and mercy be upon you.", pronunciation: "as-salāmu ʿalaykum" },
        { front: "شكرا", back: "Thank you", example: "شكرا جزيلا.", exampleEn: "Thank you very much.", pronunciation: "shukran" },
        { front: "من فضلك", back: "Please", example: "قهوة من فضلك.", exampleEn: "Coffee, please.", pronunciation: "min faḍlik" },
        { front: "مع السلامة", back: "Goodbye", example: "مع السلامة، إلى اللقاء.", exampleEn: "Goodbye, until we meet.", pronunciation: "maʿa as-salāma" },
      ],
    },
  ],
};

/* -------------------- RUSSIAN -------------------- */
const russian: LanguagePack = {
  code: "ru", name: "Russian", flag: "🇷🇺", locale: "ru-RU",
  lessons: [
    {
      id: "ru-a1-greetings", title: "Greetings (Приветствия)", module: "Vocabulary", level: "A1", xp: 25, duration: 10,
      cards: [
        { front: "Привет", back: "Hi", example: "Привет, как дела?", exampleEn: "Hi, how are you?", pronunciation: "privyet" },
        { front: "Здравствуйте", back: "Hello (formal)", example: "Здравствуйте, меня зовут Иван.", exampleEn: "Hello, my name is Ivan.", pronunciation: "zdrastvuyte" },
        { front: "Спасибо", back: "Thank you", example: "Большое спасибо!", exampleEn: "Thanks a lot!", pronunciation: "spasibo" },
        { front: "Пожалуйста", back: "Please / You're welcome", example: "Чай, пожалуйста.", exampleEn: "Tea, please.", pronunciation: "pozhaluysta" },
        { front: "До свидания", back: "Goodbye", example: "До свидания, до завтра.", exampleEn: "Goodbye, see you tomorrow.", pronunciation: "do svidaniya" },
      ],
    },
  ],
};

/* -------------------- HINDI -------------------- */
const hindi: LanguagePack = {
  code: "hi", name: "Hindi", flag: "🇮🇳", locale: "hi-IN",
  lessons: [
    {
      id: "hi-a1-greetings", title: "Greetings (अभिवादन)", module: "Vocabulary", level: "A1", xp: 25, duration: 10,
      cards: [
        { front: "नमस्ते", back: "Hello", example: "नमस्ते, आप कैसे हैं?", exampleEn: "Hello, how are you?", pronunciation: "namaste" },
        { front: "धन्यवाद", back: "Thank you", example: "आपकी मदद के लिए धन्यवाद।", exampleEn: "Thank you for your help.", pronunciation: "dhanyavaad" },
        { front: "कृपया", back: "Please", example: "कृपया एक चाय।", exampleEn: "One tea, please.", pronunciation: "kripayaa" },
        { front: "आपका नाम क्या है?", back: "What's your name?", example: "नमस्ते, आपका नाम क्या है?", exampleEn: "Hello, what's your name?", pronunciation: "aapka naam kya hai" },
        { front: "अलविदा", back: "Goodbye", example: "अलविदा, फिर मिलेंगे।", exampleEn: "Goodbye, see you again.", pronunciation: "alvidaa" },
      ],
    },
  ],
};

/* -------------------- DUTCH -------------------- */
const dutch: LanguagePack = {
  code: "nl", name: "Dutch", flag: "🇳🇱", locale: "nl-NL",
  lessons: [
    {
      id: "nl-a1-greetings", title: "Greetings", module: "Vocabulary", level: "A1", xp: 20, duration: 8,
      cards: [
        { front: "Hallo", back: "Hello", example: "Hallo, hoe gaat het?", exampleEn: "Hi, how are you?" },
        { front: "Goedemorgen", back: "Good morning", example: "Goedemorgen, mevrouw.", exampleEn: "Good morning, ma'am." },
        { front: "Dank je wel", back: "Thank you", example: "Dank je wel voor de hulp.", exampleEn: "Thanks for the help." },
        { front: "Alstublieft", back: "Please / Here you go", example: "Een koffie, alstublieft.", exampleEn: "A coffee, please." },
        { front: "Tot ziens", back: "Goodbye", example: "Tot ziens, tot morgen!", exampleEn: "Goodbye, see you tomorrow!" },
      ],
    },
  ],
};

export const languagePacks: Record<string, LanguagePack> = {
  es: spanish, fr: french, de: german, it: italian, pt: portuguese,
  ja: japanese, ko: korean, zh: mandarin, ar: arabic, ru: russian,
  hi: hindi, nl: dutch,
};

export const getLanguagePack = (code: string): LanguagePack =>
  languagePacks[code] ?? spanish;

export const findLessonById = (id: string): { lesson: LessonContent; pack: LanguagePack } | null => {
  for (const pack of Object.values(languagePacks)) {
    const lesson = pack.lessons.find(l => l.id === id);
    if (lesson) return { lesson, pack };
  }
  return null;
};
