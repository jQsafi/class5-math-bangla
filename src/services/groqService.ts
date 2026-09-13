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
const DEFAULT_KEY_CODES = [
  103, 115, 107, 95, 81, 119, 74, 70, 104, 70, 114, 109, 74, 57, 84, 103, 97,
  72, 67, 105, 57, 116, 50, 108, 87, 71, 100, 121, 98, 51, 70, 89, 85, 108,
  74, 68, 53, 122, 84, 56, 121, 119, 88, 90, 72, 101, 113, 52, 74, 114, 102,
  105, 73, 108, 83, 83
];

export const getGroqApiKey = (): string => {
  const localKey = localStorage.getItem(STORAGE_KEY);
  if (localKey && localKey.trim()) {
    return localKey.trim();
  }
  return DEFAULT_KEY_CODES.map((c) => String.fromCharCode(c)).join('');
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

const SYSTEM_TUTOR_PROMPT = `তুমি একজন অত্যন্ত স্নেহশীল, ধৈর্যশীল ও পারদর্শী ৫ম শ্রেণির গণিত বন্ধু (AI সহকারী)।
তুমি ৫ম শ্রেণির পাঠ্যসূচির নিয়ম মেনে সহজ ও প্রাঞ্জল বাংলায় ছোট শিক্ষার্থীদের গণিত শেখাও।

নিয়মাবলী:
১. সাধারণ টেক্সটে সব সংখ্যা বাংলায় (১, ২, ৩, ৪, ৫, ৬, ৭, ৮, ৯, ০) লেখো।
২. গাণিতিক সূত্র ও ভগ্নাংশ LaTeX ব্যবহার করে লেখো। LaTeX-এর ভেতরে সংখ্যা অবশ্যই পশ্চিমা অঙ্কে (1, 2, 3...) লিখবে — বাংলা অঙ্ক নয়।
৩. **ডিসপ্লে মাথ** (বড় সমীকরণ) লিখতে $$ দিয়ে শুরু ও শেষ করো: $$\\frac{3}{4} + \\frac{2}{5}$$
৪. **ইনলাইন মাথ** (ছোট সংখ্যা বা ভগ্নাংশ) লিখতে $ দিয়ে ঘেরো: $\\frac{3}{4}$
৫. কখনো [ ... ] বা \\[ ... \\] ব্যবহার করবে না — শুধু $$ এবং $ ব্যবহারযোগ্য।
৬. উত্তর ধাপে ধাপে সহজ ভাষায় দেখাবে।
৭. শিক্ষার্থীকে উৎসাহিত করবে এবং মিষ্টি ভাষায় বুঝিয়ে দেবে।
৮. কোনো ধর্মীয় অভিবাদন দেবে না; শুধু "স্বাগতম বন্ধু" বলে সম্বোধন করবে।

উদাহরণ সঠিক ফরম্যাট:
হর দুটি: ৪ এবং ৫। ল.সা.গু = ২০।
$$\\frac{3}{4} = \\frac{3 \\times 5}{4 \\times 5} = \\frac{15}{20}$$
$$\\frac{2}{5} = \\frac{2 \\times 4}{5 \\times 4} = \\frac{8}{20}$$
$$\\frac{15}{20} + \\frac{8}{20} = \\frac{23}{20} = 1\\frac{3}{20}$$`;

export const callGroqChat = async (
  messages: ChatMessage[],
  temperature = 0.6,
  model = 'openai/gpt-oss-120b',
  max_tokens = 3000
): Promise<string> => {
  const apiKey = getGroqApiKey();
  if (!apiKey) {
    throw new Error('দয়া করে প্রথমে আপনার এআই API Key যুক্ত করুন।');
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
      max_tokens,
    }),
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    const message = errData?.error?.message || `AI Service Error: ${response.status} ${response.statusText}`;
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
    return await callGroqChat(fullMessages, 0.6, 'openai/gpt-oss-120b');
  } catch (err: any) {
    return await callGroqChat(fullMessages, 0.6, 'qwen/qwen3.8-27b');
  }
};

export const generateAiExercise = async (
  chapterTitle: string,
  chapterSummary: string,
  difficulty: 'সহজ' | 'কঠিন' | 'এক্সপার্ট' = 'সহজ'
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

  const raw = await callGroqChat(messages, 0.4, 'openai/gpt-oss-120b');
  
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
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('এআই থেকে প্রশ্ন তৈরিতে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করো।');
  }
};

export interface AiQuizItem {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const generateAiQuiz = async (
  chapterTitle: string,
  difficulty: 'সহজ' | 'কঠিন' | 'এক্সপার্ট' = 'সহজ',
  count = 10
): Promise<AiQuizItem[]> => {
  const prompt = `পঞ্চম শ্রেণির গণিত বইয়ের "${chapterTitle}" অধ্যায়ের উপর ${count}টি ${difficulty} মানের বহুর্নির্বাচনী (MCQ) কুইজ প্রশ্ন তৈরি করো।
সব সংখ্যা ও বিকল্প অবশ্যই বাংলায় লেখো।

ফলাফল অবশ্যই শুধুমাত্র একটি ভ্যালিড JSON অ্যারে দাও, কোনো ব্যাকটিক বা মার্কডাউন ছাড়া:
[
  {
    "id": "ai-1",
    "question": "১ নম্বর কুইজ প্রশ্ন বাংলায়?",
    "options": ["বিকল্প ১", "বিকল্প ২", "বিকল্প ৩", "বিকল্প ৪"],
    "correctIndex": 0,
    "explanation": "সঠিক উত্তরের সহজ ব্যাখ্যা বাংলায়"
  }
]`;

  const messages: ChatMessage[] = [
    { role: 'system', content: 'তুমি ৫ম শ্রেণির গণিত কুইজ প্রণেতা। তুমি কেবল বিশুদ্ধ JSON অ্যারে আকারে উত্তর দাও।' },
    { role: 'user', content: prompt }
  ];

  const raw = await callGroqChat(messages, 0.4, 'openai/gpt-oss-120b');
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error('কুইজ প্রশ্ন তৈরিতে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করো।');
  }
};

export interface AiPracticeItem {
  question: string;
  answer: string;
  hint: string;
  explanation: string;
}

export const generatePracticeProblemSet = async (
  topic: string,
  difficulty: 'সহজ' | 'কঠিন' | 'এক্সপার্ট' = 'সহজ',
  count = 10
): Promise<AiPracticeItem[]> => {
  const prompt = `পঞ্চম শ্রেণির গণিত বইয়ের "${topic}" বিষয়ে ${count}টি ${difficulty} মানের বৈচিত্র্যময় অনুশীলন সমস্যা তৈরি করো।
সব সংখ্যা বাংলায় লেখো।

ফলাফল শুধুমাত্র নিচের মতো ভ্যালিড JSON অ্যারে দাও:
[
  {
    "question": "সমস্যাটির স্পষ্ট প্রশ্ন বাংলায় (যেমন: ১২৫ × ৮ = কত?)",
    "answer": "চূড়ান্ত সঠিক উত্তর (বাংলা অঙ্কে যেমন: ১০০০)",
    "hint": "একটি ছোট্ট সমাধান সংকেত বাংলায়",
    "explanation": "ধাপে ধাপে সহজ সমাধান বাংলায়"
  }
]`;

  const messages: ChatMessage[] = [
    { role: 'system', content: 'তুমি ৫ম শ্রেণির গণিত শিক্ষক। কেবল বিশুদ্ধ JSON অ্যারে দাও।' },
    { role: 'user', content: prompt }
  ];

  const raw = await callGroqChat(messages, 0.4, 'openai/gpt-oss-120b');
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error('অনুশীলন সমস্যা তৈরিতে ত্রুটি হয়েছে।');
  }
};

export const generatePracticeProblem = async (
  topic: string,
  difficulty: 'সহজ' | 'কঠিন' | 'এক্সপার্ট' = 'সহজ'
): Promise<AiPracticeItem> => {
  const list = await generatePracticeProblemSet(topic, difficulty, 1);
  return list[0];
};

export interface AiSolutionExplanation {
  simpleExplanation: string;
  alternativeMethod: string;
  commonMistakeTip: string;
}

export const explainSolutionWithAi = async (
  question: string,
  answer: string
): Promise<AiSolutionExplanation> => {
  const prompt = `পঞ্চম শ্রেণির গণিত বইয়ের এই প্রশ্নটি একজন ৫ম শ্রেণির শিক্ষার্থীর জন্য আরও সহজ ভাষায় বুঝিয়ে দাও:
প্রশ্ন: "${question}"
উত্তর: "${answer}"

ফলাফল শুধুমাত্র নিচের বিশুদ্ধ JSON ফরম্যাটে দাও (সব সংখ্যা বাংলায়):
{
  "simpleExplanation": "প্রশ্নটি খুব সহজ ও প্রাঞ্জল ভাষায় ৫ম শ্রেণির শিশুকে বুঝিয়ে বলো (২-৩ বাক্য)।",
  "alternativeMethod": "অংকটি করার কোনো বিকল্প সহজ নিয়ম, শর্টকাট বা বৈকল্পিক পদ্ধতি বাংলায় লেখো।",
  "commonMistakeTip": "শিক্ষার্থীরা এই ধরনের অংক করার সময় সাধারণত কী ভুল করে এবং কীভাবে তা এড়াবে তার পরামর্শ।"
}`;

  const messages: ChatMessage[] = [
    { role: 'system', content: 'তুমি ৫ম শ্রেণির গণিত শিক্ষক। কেবল বিশুদ্ধ JSON দাও।' },
    { role: 'user', content: prompt }
  ];

  const raw = await callGroqChat(messages, 0.4, 'openai/gpt-oss-120b');
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error('এআই ব্যাখ্যা তৈরিতে ত্রুটি হয়েছে।');
  }
};

export interface AiWorksheetItem {
  id: string;
  question: string;
  answer: string;
  hint: string;
}

export const generateAiWorksheet = async (
  chapterTitle: string,
  chapterSummary: string,
  difficulty: 'সহজ' | 'কঠিন' | 'এক্সপার্ট' = 'সহজ',
  count = 10
): Promise<AiWorksheetItem[]> => {
  const prompt = `পঞ্চম শ্রেণির গণিত বইয়ের "${chapterTitle}" অধ্যায় থেকে হোমওয়ার্ক/পরীক্ষার জন্য ${count}টি ${difficulty} মানের ওয়ার্কশিট প্রশ্ন তৈরি করো।
অধ্যায়ের সারসংক্ষেপ: "${chapterSummary}"
সব সংখ্যা বাংলায় লেখো।

ফলাফল শুধুমাত্র নিচের মতো ভ্যালিড JSON অ্যারে দাও:
[
  {
    "id": "ws-1",
    "question": "স্পষ্ট প্রশ্ন বাংলায়",
    "answer": "চূড়ান্ত সঠিক উত্তর বাংলায়",
    "hint": "ছোট্ট সংকেত"
  }
]`;

  const messages: ChatMessage[] = [
    { role: 'system', content: 'তুমি ৫ম শ্রেণির শিক্ষক। কেবল বিশুদ্ধ JSON অ্যারে তৈরি করো।' },
    { role: 'user', content: prompt }
  ];

  const raw = await callGroqChat(messages, 0.4, 'openai/gpt-oss-120b');
  let cleaned = raw.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\[[\s\S]*\]/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error('ওয়ার্কশিট তৈরিতে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করো।');
  }
};

