import React, { useState } from 'react';
import {
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Key
} from 'lucide-react';
import {
  generateAiExercise,
  GeneratedExercise,
  hasGroqApiKey
} from '../services/groqService';
import { englishToBanglaDigits } from '../utils/banglaUtils';

interface AiProblemGeneratorProps {
  chapterTitle: string;
  chapterSummary: string;
  onOpenKeySettings?: () => void;
}

export const AiProblemGenerator: React.FC<AiProblemGeneratorProps> = ({
  chapterTitle,
  chapterSummary,
  onOpenKeySettings,
}) => {
  const [difficulty, setDifficulty] = useState<'সহজ' | 'কঠিন' | 'এক্সপার্ট'>('সহজ');
  const [exercise, setExercise] = useState<GeneratedExercise | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Student interaction state
  const [userAttempt, setUserAttempt] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);

  const handleGenerate = async () => {
    if (!hasGroqApiKey()) {
      if (onOpenKeySettings) {
        onOpenKeySettings();
      } else {
        setErrorMsg('অনুগ্রহ করে প্রথমে আপনার API Key যুক্ত করুন।');
      }
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setUserAttempt('');
    setIsCorrect(null);
    setShowHint(false);
    setShowSolution(false);

    try {
      const generated = await generateAiExercise(chapterTitle, chapterSummary, difficulty);
      setExercise(generated);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'সমস্যা তৈরিতে ত্রুটি হয়েছে। অনুগ্রহ করে আবার চেষ্টা করো।');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!exercise || !userAttempt.trim()) return;

    const cleanUser = userAttempt.replace(/\s+/g, '');
    const cleanAns = exercise.finalAnswer.replace(/\s+/g, '');

    if (cleanUser === cleanAns || cleanAns.includes(cleanUser)) {
      setIsCorrect(true);
      setShowSolution(true);
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div className='bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6'>
      {/* Top Banner */}
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5'>
        <div>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2'>
            <Sparkles className='w-3.5 h-3.5 text-emerald-600' />
            <span>স্মার্ট এআই জেনারেটর</span>
          </div>
          <h3 className='text-xl md:text-2xl font-bold text-slate-900'>
            অধ্যায়ভিত্তিক নতুন অনুশীলন প্রশ্ন তৈরি করো
          </h3>
          <p className='text-xs md:text-sm text-slate-600 mt-1'>
            "{chapterTitle}" অধ্যায়ের যেকোনো কঠিন্য মাত্রায় যত খুশি নতুন সমস্যা তৈরি করো।
          </p>
        </div>

        {/* Difficulty & Generator Controls */}
        <div className='flex items-center gap-2'>
          <div className='inline-flex bg-slate-100 p-1 rounded-2xl'>
            {(['সহজ', 'কঠিন', 'এক্সপার্ট'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  difficulty === diff
                    ? 'bg-white text-emerald-800 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className='flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl text-xs md:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95'
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'তৈরি হচ্ছে...' : 'নতুন অংক তৈরি করো'}</span>
          </button>
        </div>
      </div>

      {/* No API key alert */}
      {!hasGroqApiKey() && (
        <div className='p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3 text-xs text-amber-900'>
          <div className='flex items-center gap-2'>
            <Key className='w-4 h-4 text-amber-600 shrink-0' />
            <span>AI সমস্যা তৈরি করার জন্য API Key প্রয়োজন।</span>
          </div>
          {onOpenKeySettings && (
            <button
              onClick={onOpenKeySettings}
              className='px-3 py-1.5 bg-amber-200 hover:bg-amber-300 font-bold rounded-xl text-amber-950 transition-colors shrink-0'
            >
              Key সেট করো
            </button>
          )}
        </div>
      )}

      {/* Error state */}
      {errorMsg && (
        <div className='p-4 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2'>
          <AlertCircle className='w-4 h-4 shrink-0' />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Problem View */}
      {exercise && !loading && (
        <div className='space-y-5 animate-in fade-in duration-200'>
          {/* Question Card */}
          <div className='p-5 bg-gradient-to-br from-slate-50 to-emerald-50/20 border border-slate-200/90 rounded-2xl space-y-3'>
            <div className='flex items-center justify-between'>
              <span className='px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800'>
                {difficulty} মানের প্রশ্ন
              </span>
            </div>

            <div className='text-base md:text-lg font-bold text-slate-900 leading-relaxed'>
              {exercise.question}
            </div>

            {/* Answer check input form */}
            <form onSubmit={handleCheckAnswer} className='pt-2 flex flex-wrap items-center gap-2'>
              <input
                type='text'
                value={userAttempt}
                onChange={(e) => {
                  setUserAttempt(e.target.value);
                  setIsCorrect(null);
                }}
                placeholder='তোমার উত্তর এখানে লেখো (যেমন: ২৫)'
                className='px-4 py-2.5 rounded-2xl border border-slate-300 text-xs md:text-sm font-semibold focus:ring-2 focus:ring-emerald-500 outline-none flex-1 min-w-[200px]'
              />
              <button
                type='submit'
                className='px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs md:text-sm transition-all shadow-xs'
              >
                যাচাই করো
              </button>
              <button
                type='button'
                onClick={() => setShowHint(!showHint)}
                className='flex items-center gap-1.5 px-4 py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 rounded-2xl font-bold text-xs md:text-sm transition-colors'
              >
                <Lightbulb className='w-4 h-4 text-amber-600' />
                <span>ইঙ্গিত (Hint)</span>
              </button>
              <button
                type='button'
                onClick={() => setShowSolution(!showSolution)}
                className='px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-bold text-xs md:text-sm transition-colors'
              >
                {showSolution ? 'সমাধান লুকাও' : 'সমাধান দেখো'}
              </button>
            </form>

            {/* Verification message */}
            {isCorrect === true && (
              <div className='p-3 bg-emerald-100 border border-emerald-300 rounded-xl text-emerald-900 font-bold text-xs md:text-sm flex items-center gap-2 animate-in zoom-in-95'>
                <CheckCircle2 className='w-5 h-5 text-emerald-700' />
                <span>চমৎকার! তোমার উত্তর একদম সঠিক হয়েছে! 🎉</span>
              </div>
            )}
            {isCorrect === false && (
              <div className='p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 font-bold text-xs md:text-sm flex items-center gap-2'>
                <AlertCircle className='w-5 h-5 text-rose-600' />
                <span>উত্তর মেলেনি, আরেকবার চেষ্টা করো অথবা নিচে সংকেত দেখো।</span>
              </div>
            )}

            {/* Hint Box */}
            {showHint && (
              <div className='p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs md:text-sm text-amber-900 leading-relaxed'>
                <strong>💡 সমাধান সংকেত: </strong> {exercise.hint}
              </div>
            )}
          </div>

          {/* Step by Step Breakdown */}
          {showSolution && (
            <div className='p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 animate-in fade-in'>
              <div className='text-xs font-bold text-slate-500 uppercase tracking-wider'>
                ধাপে ধাপে সমাধান প্রক্রিয়া:
              </div>

              <div className='space-y-2.5'>
                {exercise.steps.map((st, idx) => (
                  <div
                    key={idx}
                    className='p-3.5 bg-white rounded-xl border border-slate-200/80 text-xs md:text-sm text-slate-800 flex items-start gap-3 shadow-xs'
                  >
                    <span className='w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5'>
                      {englishToBanglaDigits(st.stepNumber || idx + 1)}
                    </span>
                    <div className='flex-1 space-y-1'>
                      <p className='font-medium'>{st.explanation}</p>
                      {st.mathExpression && (
                        <div className='p-2 bg-emerald-50/50 border border-emerald-200/60 rounded-lg text-emerald-900 font-bold text-xs md:text-sm font-mono'>
                          {st.mathExpression}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className='p-3.5 bg-emerald-600 text-white rounded-xl flex items-center justify-between gap-2 font-bold text-sm md:text-base'>
                <span>চূড়ান্ত সঠিক উত্তর:</span>
                <span className='px-3 py-1 bg-white text-emerald-900 rounded-lg text-base shadow-xs'>
                  {exercise.finalAnswer}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Initial prompt to click button if no exercise yet */}
      {!exercise && !loading && (
        <div className='text-center py-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl space-y-3'>
          <div className='w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto'>
            <Sparkles className='w-6 h-6' />
          </div>
          <h4 className='font-bold text-slate-800 text-base'>
            এখনও কোনো প্রশ্ন তৈরি করা হয়নি
          </h4>
          <p className='text-xs text-slate-500 max-w-md mx-auto'>
            কঠিন্য মাত্রা নির্বাচন করে উপরের <strong>"নতুন অংক তৈরি করো"</strong> বাটনে চাপ দিন।
          </p>
        </div>
      )}
    </div>
  );
};
