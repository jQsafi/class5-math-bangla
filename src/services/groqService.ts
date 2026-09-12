/**
 * Groq AI Service for Class 5 Math Bangla
 * Provides AI Math Tutor responses and custom exercise generation
 */

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface GeneratedExercise {
  question: string;
  hint: string;
  steps: {
    stepNumber: number;
    explanation: string;
    mathExpression?: string;
  }[];
  finalAnswer: string;
}

const STORAGE_KEY = 'class5_groq_api_key';

export const getGroqApiKey = (): string => {
  const localKey = localStorage.getItem(STORAGE_KEY);
  if (localKey && localKey.trim()) {
    return localKey.trim();
  }
  if (import.meta.env.DEV) {
    const envKey = import.meta.env.VITE_GROQ_API_KEY;
    if (envKey && typeof envKey === 'string' && envKey.trim()) {
      return envKey.trim();
    }
  }
  return '';
};

export const setGroqApiKey = (key: string): void => {
  if (key && key.trim()) {
    localStorage.setItem(STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(STORAGE_KEY);
  }
};

export const hasGroqApiKey = (): boolean => {
  return Boolean(getGroqApiKey());
};

const SYSTEM_TUTOR_PROMPT = `তুমি একজন অত্যন্ত স্নেহশীল, ধৈর্যশীল ও পারদর্শী ৫ম শ্রেণির গণিত শিক্ষক ("গণিত বন্ধু")।
তুমি জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) ৫ম শ্রেণির পাঠ্যসূচির নিয়ম মেনে সহজ ও প্রাঞ্জল বাংলায় ছোট শিক্ষার্থীদের গণিত শেখাও।

নিয়মাবলী:
১. সকল সংখ্যা ও অঙ্ক অবশ্যই বাংলায় (১, ২, ৩, ৪, ৫, ৬, ৭, ৮, ৯, ০) লিখবে।
২. উত্তর খুব দীর্ঘ বা জটিল না করে ধাপে ধাপে সহজ ভাষায় সমাধান করে দেখাবে।
৩. ৫ম শ্রেণির উপযোগী পদ্ধতি (যেমন: ঐকিক নিয়ম, ল.সা.গু, গ.সা.গু, সাধারণ ভগ্নাংশ, দশমিকের হিসাব, সহজ নিয়মে গুণ ও ভাগ) ব্যবহার করবে।
৪. শিক্ষার্থীকে উৎসাহিত করবে এবং মিষ্টি ভাষায় বুঝিয়ে দেবে।`;

export const callGroqChat = async (
  messages: ChatMessage[],
  temperature = 0.6,
  model = 'llama-3.3-70b-versatile'
): Promise<string> => {
  const apiKey = getGroqApiKey();
  if (!apiKey) {
    throw new Error('দয়া করে প্রথমে আপনার Groq API Key যুক্ত করুন।');
  }

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      max_tokens: 1200,
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const message = errData?.error?.message || `Groq API Error: ${response.status} ${response.statusText}`;
    throw new Error(message);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
};

export const askMathTutor = async (
  conversationHistory: ChatMessage[],
  currentChapterTitle?: string
): Promise<string> => {
  let contextPrompt = SYSTEM_TUTOR_PROMPT;
  if (currentChapterTitle) {
    contextPrompt += `\nশিক্ষার্থী বর্তমানে "${currentChapterTitle}" অধ্যায়ে অধ্যয়ন করছে।`;
  }

  const fullMessages: ChatMessage[] = [
    { role: 'system', content: contextPrompt },
    ...conversationHistory,
  ];

  try {
    return await callGroqChat(fullMessages, 0.6, 'llama-3.3-70b-versatile');
  } catch (err: any) {
    // Fallback to llama-3.1-8b-instant if the versatile model has rate limit issues
    if (err?.message && (err.message.includes('rate') || err.message.includes('capacity'))) {
      return await callGroqChat(fullMessages, 0.6, 'llama-3.1-8b-instant');
    }
    throw err;
  }
};

export const generateAiExercise = async (
  chapterTitle: string,
  chapterSummary: string,
  difficulty: 'সহজ' | 'মধ্যম' | 'চ্যালেঞ্জিং' = 'সহজ'
): Promise<GeneratedExercise> => {
  const prompt = `পঞ্চম শ্রেণির গণিত বইয়ের "${chapterTitle}" অধ্যায়ের উপর একটি নতুন ${difficulty} মানের অনুশীলন সমস্যা তৈরি করো।
অধ্যায়ের সারসংক্ষেপ: ${chapterSummary}

গুরুত্বপূর্ণ: ফলাফল অবশ্যই একটি ভ্যালিড JSON অবজেক্ট আকারে দাও, কোনো ব্যাকটিক বা মার্কডাউন ছাড়া:
{
  "question": "সমস্যাটির বিস্তারিত প্রশ্ন বাংলায় (সব সংখ্যা বাংলা অঙ্কে)",
  "hint": "শিক্ষার্থীকে সাহায্য করার জন্য একটি ছোট্ট সংকেত",
  "steps": [
    {
      "stepNumber": 1,
      "explanation": "১ম ধাপের সহজ ব্যাখ্যা বাংলায়",
      "mathExpression": "গাণিতিক হিসাব বাংলায় যেমন: ২৫ × ৪ = ১০০"
    },
    {
      "stepNumber": 2,
      "explanation": "২য় ধাপের সহজ ব্যাখ্যা বাংলায়",
      "mathExpression": "গাণিতিক হিসাব বাংলায়"
    }
  ],
  "finalAnswer": "চূড়ান্ত সঠিক উত্তর (বাংলা অঙ্কে ও একক সহ)"
}`;

  const messages: ChatMessage[] = [
    { role: 'system', content: 'তুমি ৫ম শ্রেণির গণিত প্রশ্ন প্রণেতা। তুমি কেবল বিশুদ্ধ JSON ফরম্যাটে উত্তর প্রদান করো।' },
    { role: 'user', content: prompt },
  ];

  const raw = await callGroqChat(messages, 0.5, 'llama-3.3-70b-versatile');
  
  // Extract JSON from response
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
  }

  try {
    const parsed: GeneratedExercise = JSON.parse(cleaned);
    return parsed;
  } catch (parseError) {
    // Attempt to extract JSON block using regex
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('এআই থেকে প্রশ্ন তৈরিতে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করো।');
  }
};
