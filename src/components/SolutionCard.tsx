import React, { useState } from 'react';
import { ExerciseProblem } from '../types/math';
import { Lightbulb, CheckCircle2, ChevronDown, ChevronUp, BookOpen, Sparkles, Loader2, AlertTriangle } from 'lucide-react';
import { englishToBanglaDigits } from '../utils/banglaUtils';
import { explainSolutionWithAi, AiSolutionExplanation } from '../services/groqService';

interface SolutionCardProps {
  problem: ExerciseProblem;
  index: number;
}

export const SolutionCard: React.FC<SolutionCardProps> = ({ problem, index }) => {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [userAttempt, setUserAttempt] = useState('');
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  // AI explanation state
  const [showAiExplanation, setShowAiExplanation] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<AiSolutionExplanation | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleToggleAiExplanation = async () => {
    if (!showAiExplanation && !aiExplanation && !aiLoading) {
      setAiLoading(true);
      setAiError(null);
      try {
        const res = await explainSolutionWithAi(problem.question, problem.finalAnswer);
        setAiExplanation(res);
      } catch (err: any) {
        setAiError(err?.message || 'এআই ব্যাখ্যা লোড করতে সমস্যা হয়েছে।');
      } finally {
        setAiLoading(false);
      }
    }
    setShowAiExplanation(!showAiExplanation);
  };

  const handleCheckAnswer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userAttempt.trim()) return;
    const cleanUser = userAttempt.replace(/\s+/g, '');
    const cleanAns = problem.finalAnswer.replace(/\s+/g, '');
    if (cleanUser === cleanAns || cleanAns.includes(cleanUser)) {
      setIsCorrect(true);
      setShowSolution(true);
    } else {
      setIsCorrect(false);
    }
  };

  return (
    <div className='bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all p-5 mb-5'>
      <div className='flex items-start justify-between gap-3 pb-3 border-b border-slate-100'>
        <div className='flex items-center gap-2 flex-wrap'>
          <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800'>
            {problem.exerciseNumber}
          </span>
          {problem.category && (
            <span className='inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600'>
              {problem.category}
            </span>
          )}
        </div>
      </div>

      <div className='my-4 text-slate-800 text-base md:text-lg font-medium leading-relaxed'>
        {problem.question}
      </div>

      {problem.formulaUsed && (
        <div className='mb-4 p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl flex items-center gap-2 text-xs md:text-sm text-amber-900 font-medium'>
          <BookOpen className='w-4 h-4 text-amber-600 shrink-0' />
          <span>প্রয়োজনীয় সূত্র: <strong>{problem.formulaUsed}</strong></span>
        </div>
      )}

      <form onSubmit={handleCheckAnswer} className='my-3 p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center gap-2'>
        <span className='text-xs md:text-sm text-slate-600 font-medium'>তোমার উত্তর:</span>
        <input
          type='text'
          placeholder='যেমন: ১২০ বা ২৫'
          value={userAttempt}
          onChange={(e) => {
            setUserAttempt(e.target.value);
            setIsCorrect(null);
          }}
          className='px-3 py-1.5 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white min-w-[140px]'
        />
        <button
          type='submit'
          className='px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs md:text-sm font-medium rounded-lg transition-colors'
        >
          যাচাই করো
        </button>
        {isCorrect === true && (
          <span className='text-emerald-600 font-semibold text-xs md:text-sm flex items-center gap-1'>
            <CheckCircle2 className='w-4 h-4' /> দারুণ! সঠিক হয়েছে 🎉
          </span>
        )}
        {isCorrect === false && (
          <span className='text-rose-600 font-semibold text-xs md:text-sm'>
            আবার চেষ্টা করো অথবা সমাধান দেখে নাও!
          </span>
        )}
      </form>

      <div className='flex flex-wrap items-center gap-2 pt-2'>
        <button
          onClick={() => setShowHint(!showHint)}
          className='flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-medium rounded-xl text-amber-800 bg-amber-100/70 hover:bg-amber-100 transition-colors'
        >
          <Lightbulb className='w-3.5 h-3.5 text-amber-600' />
          {showHint ? 'ইঙ্গিত লুকাও' : '💡 ইঙ্গিত (Hint)'}
        </button>

        <button
          onClick={handleToggleAiExplanation}
          className='flex items-center gap-1.5 px-3 py-1.5 text-xs md:text-sm font-semibold rounded-xl text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors'
        >
          {aiLoading ? (
            <Loader2 className='w-3.5 h-3.5 animate-spin text-indigo-600' />
          ) : (
            <Sparkles className='w-3.5 h-3.5 text-indigo-600' />
          )}
          <span>{showAiExplanation ? 'এআই ব্যাখ্যা লুকাও' : '✨ এআই সহজ ব্যাখ্যা ও বিকল্প নিয়ম'}</span>
        </button>

        <button
          onClick={() => setShowSolution(!showSolution)}
          className='flex items-center gap-1.5 px-3.5 py-1.5 text-xs md:text-sm font-medium rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm ml-auto'
        >
          <span>{showSolution ? 'সমাধান সংক্ষেপ করো' : 'ধাপে ধাপে সম্পূর্ণ সমাধান'}</span>
          {showSolution ? <ChevronUp className='w-4 h-4' /> : <ChevronDown className='w-4 h-4' />}
        </button>
      </div>

      {showHint && (
        <div className='mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs md:text-sm text-amber-900 leading-relaxed'>
          <strong>💡 সমাধান সংকেত: </strong> {problem.hint}
        </div>
      )}

      {showAiExplanation && (
        <div className='mt-4 p-4 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-purple-50/50 border border-indigo-200/80 space-y-3.5 animate-in fade-in-50 duration-200'>
          <div className='flex items-center justify-between border-b border-indigo-100/80 pb-2.5'>
            <div className='flex items-center gap-2 text-xs md:text-sm font-bold text-indigo-950'>
              <Sparkles className='w-4 h-4 text-indigo-600' />
              <span>স্মার্ট এআই ব্যাখ্যা ও বিকল্প পদ্ধতি</span>
            </div>
            {aiLoading && (
              <span className='text-xs text-indigo-600 flex items-center gap-1 font-medium'>
                <Loader2 className='w-3 h-3 animate-spin' /> ব্যাখ্যা প্রস্তুত হচ্ছে...
              </span>
            )}
          </div>

          {aiError && (
            <div className='p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2'>
              <AlertTriangle className='w-4 h-4 text-rose-600 shrink-0' />
              <span>{aiError}</span>
            </div>
          )}

          {aiExplanation && (
            <div className='space-y-3 text-xs md:text-sm'>
              <div className='p-3 bg-white/90 rounded-xl border border-indigo-100 shadow-2xs'>
                <div className='font-bold text-indigo-900 mb-1 flex items-center gap-1.5'>
                  <span>💡 সহজ প্রাঞ্জল ব্যাখ্যা:</span>
                </div>
                <p className='text-slate-700 leading-relaxed'>{aiExplanation.simpleExplanation}</p>
              </div>

              {aiExplanation.alternativeMethod && (
                <div className='p-3 bg-white/90 rounded-xl border border-purple-100 shadow-2xs'>
                  <div className='font-bold text-purple-900 mb-1 flex items-center gap-1.5'>
                    <span>🔄 বিকল্প সহজ নিয়ম / পদ্ধতি:</span>
                  </div>
                  <p className='text-slate-700 leading-relaxed'>{aiExplanation.alternativeMethod}</p>
                </div>
              )}

              {aiExplanation.commonMistakeTip && (
                <div className='p-3 bg-amber-50/90 rounded-xl border border-amber-200/80 text-amber-950'>
                  <div className='font-bold text-amber-900 mb-1 flex items-center gap-1.5'>
                    <span>⚠️ যে ভুলটি এড়িয়ে চলবে:</span>
                  </div>
                  <p className='text-slate-700 leading-relaxed'>{aiExplanation.commonMistakeTip}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {showSolution && (
        <div className='mt-4 pt-4 border-t border-slate-100 space-y-3'>
          <div className='text-xs font-bold text-slate-500 uppercase tracking-wider'>ধাপে ধাপে সমাধান প্রক্রিয়া:</div>
          <div className='space-y-2'>
            {problem.steps.map((step, sIdx) => (
              <div key={sIdx} className='flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs md:text-sm text-slate-700'>
                <span className='flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs shrink-0 mt-0.5'>
                  {englishToBanglaDigits(step.stepNumber)}
                </span>
                <div className='flex-1 space-y-1'>
                  <p className='text-slate-800 font-medium'>{step.explanation}</p>
                  {step.mathExpression && (
                    <div className='p-2 bg-white rounded-lg border border-slate-200 font-mono text-emerald-800 text-sm font-semibold'>
                      {step.mathExpression}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className='p-3.5 bg-emerald-50 border-2 border-emerald-500/30 rounded-xl flex items-center justify-between gap-2 text-emerald-950 font-bold text-sm md:text-base'>
            <div className='flex items-center gap-2'>
              <CheckCircle2 className='w-5 h-5 text-emerald-600 shrink-0' />
              <span>উত্তর:</span>
            </div>
            <span className='px-3 py-1 bg-white rounded-lg border border-emerald-200 text-emerald-700 text-base'>
              {problem.finalAnswer}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};