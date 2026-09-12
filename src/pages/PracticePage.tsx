import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, Sparkles, RefreshCw, Lightbulb, AlertCircle, Award, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import { englishToBanglaDigits, banglaToEnglishDigits } from '../utils/banglaUtils';
import confetti from 'canvas-confetti';
import { generatePracticeProblemSet, AiPracticeItem } from '../services/groqService';

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

const INITIAL_PROBLEMS: AiPracticeItem[] = [
  {
    question: '৭৫ × ৯৯ = কত? (সহজ নিয়মে হিসাব করো)',
    answer: '৭৪২৫',
    hint: '৯৯ কে (১০০ - ১) ধরে ৭৫ × (১০০ - ১) = ৭৫০০ - ৭৫ করো।',
    explanation: '৭৫ × ৯৯ = ৭৫ × (১০০ - ১) = ৭৫০০ - ৭৫ = ৭৪২৫।'
  },
  {
    question: '৫৭৬ ÷ ২৪ = কত?',
    answer: '২৪',
    hint: '৫৭৬ কে ২৪ দিয়ে ভাগ করো। ২৪ × ২০ = ৪৮০, ২৪ × ৪ = ৯৬।',
    explanation: '৫৭৬ ÷ ২৪ = ২৪।'
  },
  {
    question: '১৬ ÷ ৪ + ৫ × ২ - ৩ = কত?',
    answer: '১১',
    hint: 'আগে ভাগ ও গুণ করো, তারপর যোগ ও বিয়োগ।',
    explanation: '১৬ ÷ ৪ = ৪, ৫ × ২ = ১০; ৪ + ১০ - ৩ = ১৪ - ৩ = ১১।'
  },
  {
    question: '১২ ও ১৮ এর ল.সা.গু (L.C.M) কত?',
    answer: '৩৬',
    hint: '১২ ও ১৮ এর সাধারণ গুণিতকগুলোর মধ্যে ক্ষুদ্রতম সংখ্যাটি বের করো।',
    explanation: '১২ এর গুণিতক: ১২, ২৪, ৩৬... এবং ১৮ এর গুণিতক: ১৮, ৩৬... ল.সা.গু = ৩৬।'
  },
  {
    question: '৩/৪ + ১/২ = কত? (ভগ্নাংশ বা দশমিকে উত্তর দাও)',
    answer: '৫/৪',
    hint: 'সমহর করো: ১/২ = ২/৪; ৩/৪ + ২/৪ = ৫/৪ বা ১.২৫।',
    explanation: '৩/৪ + ২/৪ = ৫/৪ (বা ১ সমস্ত ১/৪ বা ১.২৫)।'
  },
  {
    question: '০.৬ × ০.৭ = কত?',
    answer: '০.৪২',
    hint: '৬ × ৭ = ৪২, তারপর মোট ২ ঘর আগে দশমিক বসাও।',
    explanation: '৬ × ৭ = ৪২, দশমিকের পর দুটি অঙ্ক থাকায় উত্তর ০.৪২।'
  },
  {
    question: '১২, ১৫ এবং ১৮ এর গড় কত?',
    answer: '১৫',
    hint: 'তিনটি সংখ্যা যোগ করে ৩ দিয়ে ভাগ করো।',
    explanation: '(১২ + ১৫ + ১৮) ÷ ৩ = ৪৫ ÷ ৩ = ১৫।'
  },
  {
    question: '২০০ টাকার ১৫% কত টাকা?',
    answer: '৩০',
    hint: '২০০ × (১৫/১০০) হিসাব করো।',
    explanation: '২০০ × ১৫ ÷ ১০০ = ৩০ টাকা।'
  },
  {
    question: 'একটি সমকোণী ত্রিভুজের সমকোণটি কত ডিগ্রি?',
    answer: '৯০',
    hint: 'সমকোণের পরিমাপ নির্দিষ্ট।',
    explanation: 'যেকোনো সমকোণের পরিমাপ ৯০ ডিগ্রি।'
  },
  {
    question: '৩ কিলোমিটার ৫০০ মিটার = মোট কত মিটার?',
    answer: '৩৫০০',
    hint: '১ কিমি = ১০০০ মিটার, তাই ৩ কিমি = ৩০০০ মিটার।',
    explanation: '৩ × ১০০০ + ৫০০ = ৩৫০০ মিটার।'
  }
];

export const PracticePage: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState(TOPICS[0]);
  const [difficulty, setDifficulty] = useState<'সহজ' | 'কঠিন' | 'এক্সপার্ট'>('সহজ');

  // Problem list (always at least 10)
  const [problems, setProblems] = useState<AiPracticeItem[]>(INITIAL_PROBLEMS);
  const [currentIndex, setCurrentIndex] = useState(0);

  // States per question: { [index]: { input: string, status: 'idle' | 'correct' | 'wrong', showHint: boolean, showExplanation: boolean } }
  const [progressState, setProgressState] = useState<{
    [idx: number]: {
      input: string;
      status: 'idle' | 'correct' | 'wrong';
      showHint: boolean;
      showExplanation: boolean;
    };
  }>({});

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentProblem = problems[currentIndex] || problems[0];
  const currentProgress = progressState[currentIndex] || {
    input: '',
    status: 'idle',
    showHint: false,
    showExplanation: false
  };

  const solvedCount = Object.values(progressState).filter(p => p.status === 'correct').length;

  const handleGenerateAiProblemSet = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const generatedList = await generatePracticeProblemSet(selectedTopic, difficulty, 10);
      if (generatedList && generatedList.length > 0) {
        setProblems(generatedList);
        setCurrentIndex(0);
        setProgressState({});
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'সমস্যা তৈরিতে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করো।');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (val: string) => {
    setProgressState(prev => ({
      ...prev,
      [currentIndex]: {
        ...(prev[currentIndex] || { showHint: false, showExplanation: false }),
        input: val,
        status: 'idle'
      }
    }));
  };

  const toggleHint = () => {
    setProgressState(prev => ({
      ...prev,
      [currentIndex]: {
        ...(prev[currentIndex] || { input: '', status: 'idle', showExplanation: false }),
        showHint: !(prev[currentIndex]?.showHint)
      }
    }));
  };

  const toggleExplanation = () => {
    setProgressState(prev => ({
      ...prev,
      [currentIndex]: {
        ...(prev[currentIndex] || { input: '', status: 'idle', showHint: false }),
        showExplanation: !(prev[currentIndex]?.showExplanation)
      }
    }));
  };

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProgress.input.trim()) return;

    const userNorm = banglaToEnglishDigits(currentProgress.input).replace(/\s+/g, '').toLowerCase();
    const correctNorm = banglaToEnglishDigits(currentProblem.answer).replace(/\s+/g, '').toLowerCase();

    const isMatch =
      userNorm === correctNorm ||
      correctNorm.includes(userNorm) ||
      userNorm.includes(correctNorm);

    if (isMatch) {
      setProgressState(prev => ({
        ...prev,
        [currentIndex]: {
          ...(prev[currentIndex] || {}),
          status: 'correct',
          showExplanation: true
        }
      }));
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } else {
      setProgressState(prev => ({
        ...prev,
        [currentIndex]: {
          ...(prev[currentIndex] || {}),
          status: 'wrong'
        }
      }));
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
          গতিশীল গণিত অনুশীলন ড্রিল (১০টি প্রশ্ন)
        </h1>
        <p className='text-xs md:text-sm text-slate-600 max-w-lg mx-auto'>
          বিষয় ও কঠিন্য মাত্রা নির্বাচন করে এআই দিয়ে ১০টি বাস্তবমুখী সমস্যা তৈরি করো এবং সমাধান করো।
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

        {/* Action & Score Bar */}
        <div className='pt-2 flex items-center justify-between flex-wrap gap-3 border-t border-slate-100'>
          <div className='flex items-center gap-2 bg-emerald-50 text-emerald-900 px-3.5 py-1.5 rounded-2xl text-xs font-bold'>
            <Award className='w-4 h-4 text-emerald-600' />
            <span>সফল সমাধান: {englishToBanglaDigits(solvedCount)} / {englishToBanglaDigits(problems.length)}</span>
          </div>

          <button
            onClick={handleGenerateAiProblemSet}
            disabled={loading}
            className='flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl text-xs md:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95'
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? '১০টি সমস্যা তৈরি হচ্ছে...' : '✨ নতুন ১০টি এআই সমস্যা তৈরি করো'}</span>
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className='p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2'>
          <AlertCircle className='w-4 h-4 shrink-0' />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 10-Question Interactive Stepper / Navigator */}
      <div className='bg-white rounded-2xl border border-slate-200 p-3 shadow-2xs'>
        <div className='text-xs font-bold text-slate-500 mb-2 px-1 flex items-center justify-between'>
          <span>অনুশীলন প্রশ্নের তালিকা ({englishToBanglaDigits(problems.length)}টি):</span>
          <span>প্রশ্ন {englishToBanglaDigits(currentIndex + 1)} / {englishToBanglaDigits(problems.length)}</span>
        </div>
        <div className='grid grid-cols-5 sm:grid-cols-10 gap-1.5'>
          {problems.map((_, idx) => {
            const isCurrent = idx === currentIndex;
            const pState = progressState[idx];
            const isCorrect = pState?.status === 'correct';
            const isWrong = pState?.status === 'wrong';

            let btnColor = 'bg-slate-100 text-slate-700 hover:bg-slate-200';
            if (isCorrect) {
              btnColor = 'bg-emerald-600 text-white font-bold';
            } else if (isWrong) {
              btnColor = 'bg-rose-100 text-rose-800 border border-rose-300';
            }
            if (isCurrent) {
              btnColor += ' ring-2 ring-emerald-500 ring-offset-1 font-black';
            }

            return (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`py-2 rounded-xl text-xs transition-all flex items-center justify-center gap-1 ${btnColor}`}
              >
                <span>{englishToBanglaDigits(idx + 1)}</span>
                {isCorrect && <CheckCircle2 className='w-3 h-3 text-white' />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Problem Interactive Card */}
      <div className='bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-md text-center space-y-6'>
        <div className='flex items-center justify-between flex-wrap gap-2'>
          <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-bold text-xs'>
            প্রশ্ন #{englishToBanglaDigits(currentIndex + 1)} • {difficulty} স্তর • {selectedTopic}
          </span>
          <button
            onClick={toggleHint}
            className='flex items-center gap-1 text-xs font-bold text-amber-700 hover:bg-amber-50 px-2.5 py-1 rounded-xl transition-colors'
          >
            <Lightbulb className='w-3.5 h-3.5 text-amber-500' />
            <span>{currentProgress.showHint ? 'সংকেত লুকাও' : 'সংকেত (Hint)'}</span>
          </button>
        </div>

        {/* Problem Display */}
        <div className='py-4'>
          <span className='text-xs font-bold text-slate-400 block uppercase tracking-wider mb-2'>
            সমস্যাটি সমাধান করো
          </span>
          <div className='text-2xl md:text-3xl font-bold text-slate-900 leading-relaxed max-w-xl mx-auto'>
            {currentProblem.question}
          </div>
        </div>

        {/* Answer Form */}
        <form onSubmit={handleCheck} className='flex gap-2 max-w-sm mx-auto'>
          <input
            type='text'
            placeholder='তোমার উত্তর এখানে লেখো...'
            value={currentProgress.input}
            onChange={(e) => handleInputChange(e.target.value)}
            className='flex-1 px-4 py-3 rounded-2xl border border-slate-300 font-bold text-center text-base md:text-lg focus:ring-2 focus:ring-emerald-500 outline-none transition-all'
          />
          <button
            type='submit'
            className='px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-sm transition-all shadow-sm active:scale-95'
          >
            যাচাই করো
          </button>
        </form>

        {/* Feedback Messages */}
        {currentProgress.status === 'correct' && (
          <div className='p-4 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-950 font-bold text-sm flex items-center justify-center gap-2 animate-in zoom-in-95'>
            <CheckCircle2 className='w-5 h-5 text-emerald-700' />
            <span>সাবাশ! তোমার উত্তর একদম সঠিক হয়েছে! 🎉</span>
          </div>
        )}
        {currentProgress.status === 'wrong' && (
          <div className='p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs md:text-sm'>
            উত্তর মেলেনি! নিচে সংকেত দেখে পুনরায় চেষ্টা করো।
          </div>
        )}

        {/* Hint Box */}
        {currentProgress.showHint && (
          <div className='p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs md:text-sm text-amber-900 text-left leading-relaxed'>
            <strong>💡 সমাধান সংকেত: </strong> {currentProblem.hint}
          </div>
        )}

        {/* Step-by-step Solution */}
        {currentProgress.showExplanation && (
          <div className='p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs md:text-sm text-slate-800 text-left space-y-1.5 animate-in fade-in'>
            <div className='font-bold text-emerald-800'>সমাধান প্রক্রিয়া:</div>
            <div className='whitespace-pre-wrap leading-relaxed'>{currentProblem.explanation}</div>
            <div className='font-bold text-slate-900 pt-1'>সঠিক উত্তর: {currentProblem.answer}</div>
          </div>
        )}

        {/* Next / Previous problem navigation */}
        <div className='pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2'>
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className='flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-40 text-xs font-bold'
          >
            <ChevronLeft className='w-4 h-4' />
            <span>পূর্ববর্তী প্রশ্ন</span>
          </button>

          <button
            onClick={toggleExplanation}
            className='px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs'
          >
            {currentProgress.showExplanation ? 'ব্যাখ্যা লুকাও' : 'সমাধান ব্যাখ্যা'}
          </button>

          <button
            onClick={() => setCurrentIndex(prev => Math.min(problems.length - 1, prev + 1))}
            disabled={currentIndex === problems.length - 1}
            className='flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40 text-xs font-bold shadow-xs'
          >
            <span>পরবর্তী প্রশ্ন</span>
            <ChevronRight className='w-4 h-4' />
          </button>
        </div>
      </div>

      {/* Completion Celebration Card if all 10 completed */}
      {solvedCount === problems.length && (
        <div className='p-6 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl text-white text-center space-y-3 shadow-lg'>
          <Trophy className='w-12 h-12 mx-auto text-amber-300 animate-bounce' />
          <h3 className='text-xl md:text-2xl font-black'>অভিনন্দন! তুমি সব ১০টি অংক সঠিকভাবে সম্পন্ন করেছ!</h3>
          <p className='text-xs md:text-sm text-emerald-100'>
            তোমার গণিত দক্ষতা অসাধারণ! নতুন অনুশীলন শুরু করতে ওপরের "নতুন ১০টি এআই সমস্যা তৈরি করো" বাটনে ক্লিক করো।
          </p>
        </div>
      )}
    </div>
  );
};