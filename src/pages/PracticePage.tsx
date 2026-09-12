import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, Sparkles, RefreshCw, Lightbulb, AlertCircle, Award } from 'lucide-react';
import { englishToBanglaDigits, banglaToEnglishDigits } from '../utils/banglaUtils';
import confetti from 'canvas-confetti';
import { generatePracticeProblem, AiPracticeItem } from '../services/groqService';

const TOPICS = [
  'মিশ্র পাটিগণিত (সকল অধ্যায়)',
  'গুণ ও ভাগ প্রক্রিয়া',
  'চার প্রক্রিয়া ও বন্ধনীর ব্যবহার (BODMAS)',
  'গুণনীয়ক ও গুণিতক (ল.সা.গু ও গ.সা.গু)',
  'সাধারণ ভগ্নাংশ ও দশমিক ভগ্নাংশ',
  'গড় ও শতকরা',
  'জ্যামিতি ও ক্ষেত্রফল',
  'সময় ও পরিমাপের একক রূপান্তর'
];

export const PracticePage: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [difficulty, setDifficulty] = useState<'সহজ' | 'কঠিন' | 'এক্সপার্ট'>('সহজ');

  // AI Problem State
  const [problem, setProblem] = useState<AiPracticeItem>({
    question: '৭৫ × ৯৯ = কত? (সহজ নিয়মে হিসাব করো)',
    answer: '৭৪২৫',
    hint: '৯৯ কে (১০০ - ১) ধরে ৭৫ × (১০০ - ১) = ৭৫০০ - ৭৫ করো।',
    explanation: '৭৫ × ৯৯ = ৭৫ × (১০০ - ১) = ৭৫০০ - ৭৫ = ৭৪২৫।'
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Interaction State
  const [inputVal, setInputVal] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);

  const handleGenerateAiProblem = async () => {
    setLoading(true);
    setErrorMsg(null);
    setInputVal('');
    setStatus('idle');
    setShowHint(false);
    setShowExplanation(false);

    try {
      const generated = await generatePracticeProblem(selectedTopic, difficulty);
      setProblem(generated);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'সমস্যা তৈরিতে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করো।');
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userNorm = banglaToEnglishDigits(inputVal).replace(/\s+/g, '').toLowerCase();
    const correctNorm = banglaToEnglishDigits(problem.answer).replace(/\s+/g, '').toLowerCase();

    if (userNorm === correctNorm || correctNorm.includes(userNorm) || userNorm.includes(correctNorm)) {
      setStatus('correct');
      setScore(prev => prev + 1);
      setShowExplanation(true);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } else {
      setStatus('wrong');
    }
  };

  return (
    <div className='max-w-3xl mx-auto px-4 py-8 md:py-12 space-y-6'>
      {/* Page Header */}
      <div className='text-center space-y-2'>
        <div className='inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold'>
          <Sparkles className='w-4 h-4 text-emerald-600' />
          <span>স্মার্ট এআই অনুশীলন ল্যাব</span>
        </div>
        <h1 className='text-2xl md:text-4xl font-black text-slate-900'>
          গতিশীল গণিত অনুশীলন ড্রিল
        </h1>
        <p className='text-xs md:text-sm text-slate-600 max-w-lg mx-auto'>
          বিষয় ও কঠিন্য মাত্রা নির্বাচন করে এআই দিয়ে যত খুশি নতুন সমস্যা তৈরি করো এবং সমাধান করো।
        </p>
      </div>

      {/* Control Panel (Topic & Difficulty Selection) */}
      <div className='bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4'>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {/* Topic Selector */}
          <div>
            <label className='block text-xs font-bold text-slate-700 mb-1.5'>
              বিষয় নির্বাচন করো:
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className='w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-2xl text-xs md:text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-emerald-500 outline-none'
            >
              {TOPICS.map((t, idx) => (
                <option key={idx} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Difficulty Selector */}
          <div>
            <label className='block text-xs font-bold text-slate-700 mb-1.5'>
              কঠিন্য মাত্রা:
            </label>
            <div className='grid grid-cols-3 gap-2'>
              {(['সহজ', 'কঠিন', 'এক্সপার্ট'] as const).map((diff) => (
                <button
                  key={diff}
                  type='button'
                  onClick={() => setDifficulty(diff)}
                  className={`py-2.5 rounded-2xl text-xs font-bold transition-all text-center ${
                    difficulty === diff
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className='pt-2 flex items-center justify-between flex-wrap gap-3 border-t border-slate-100'>
          <div className='flex items-center gap-2 bg-emerald-50 text-emerald-900 px-3.5 py-1.5 rounded-2xl text-xs font-bold'>
            <Award className='w-4 h-4 text-emerald-600' />
            <span>সফল স্কোর: {englishToBanglaDigits(score)}</span>
          </div>

          <button
            onClick={handleGenerateAiProblem}
            disabled={loading}
            className='flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl text-xs md:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all'
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'এআই সমস্যা তৈরি করছে...' : 'এআই নতুন সমস্যা তৈরি করো'}</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className='p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2'>
          <AlertCircle className='w-4 h-4 shrink-0' />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Problem Interactive Card */}
      <div className='bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-md text-center space-y-6'>
        <div className='flex items-center justify-between'>
          <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs'>
            {difficulty} স্তর • {selectedTopic}
          </span>
          <button
            onClick={() => setShowHint(!showHint)}
            className='flex items-center gap-1 text-xs font-bold text-amber-700 hover:bg-amber-50 px-2.5 py-1 rounded-xl transition-colors'
          >
            <Lightbulb className='w-3.5 h-3.5 text-amber-500' />
            <span>{showHint ? 'সংকেত লুকাও' : 'সংকেত (Hint)'}</span>
          </button>
        </div>

        {/* Problem Display */}
        <div className='py-4'>
          <span className='text-xs font-bold text-slate-400 block uppercase tracking-wider mb-2'>
            সমস্যাটি সমাধান করো
          </span>
          <div className='text-2xl md:text-4xl font-bold text-slate-900 leading-relaxed max-w-xl mx-auto'>
            {problem.question}
          </div>
        </div>

        {/* Answer Form */}
        <form onSubmit={handleCheck} className='flex gap-2 max-w-sm mx-auto'>
          <input
            type='text'
            placeholder='তোমার উত্তর এখানে লেখো...'
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              setStatus('idle');
            }}
            className='flex-1 px-4 py-3 rounded-2xl border border-slate-300 font-bold text-center text-base md:text-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all'
          />
          <button
            type='submit'
            className='px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm transition-all shadow-sm'
          >
            যাচাই করো
          </button>
        </form>

        {/* Feedback Messages */}
        {status === 'correct' && (
          <div className='p-4 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-950 font-bold text-sm flex items-center justify-center gap-2 animate-in zoom-in-95'>
            <CheckCircle2 className='w-5 h-5 text-emerald-700' />
            <span>সাবাশ! তোমার উত্তর একদম সঠিক হয়েছে! 🎉</span>
          </div>
        )}
        {status === 'wrong' && (
          <div className='p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs md:text-sm'>
            উত্তর মেলেনি! নিচে সংকেত দেখে পুনরায় চেষ্টা করো।
          </div>
        )}

        {/* Hint Box */}
        {showHint && (
          <div className='p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs md:text-sm text-amber-900 text-left leading-relaxed'>
            <strong>💡 সমাধান সংকেত: </strong> {problem.hint}
          </div>
        )}

        {/* Step-by-step Solution */}
        {showExplanation && (
          <div className='p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs md:text-sm text-slate-800 text-left space-y-1.5 animate-in fade-in'>
            <div className='font-bold text-emerald-800'>সমাধান প্রক্রিয়া:</div>
            <div className='whitespace-pre-wrap leading-relaxed'>{problem.explanation}</div>
            <div className='font-bold text-slate-900 pt-1'>সঠিক উত্তর: {problem.answer}</div>
          </div>
        )}

        {/* Next problem button */}
        <div className='pt-2 flex items-center justify-center gap-3'>
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className='px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs'
          >
            {showExplanation ? 'ব্যাখ্যা লুকাও' : 'ব্যাখ্যা দেখো'}
          </button>

          <button
            onClick={handleGenerateAiProblem}
            disabled={loading}
            className='flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl font-bold text-xs md:text-sm shadow-xs transition-all'
          >
            <RotateCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>পরবর্তী সমস্যা</span>
          </button>
        </div>
      </div>
    </div>
  );
};