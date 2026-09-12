import React, { useState } from 'react';
import { QuizQuestion } from '../types/math';
import { CheckCircle2, XCircle, RotateCcw, Award, Sparkles, RefreshCw, Bot, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { englishToBanglaDigits } from '../utils/banglaUtils';
import { generateAiQuiz, AiQuizItem } from '../services/groqService';

interface QuizViewProps {
  questions: QuizQuestion[];
  chapterTitle: string;
}

export const QuizView: React.FC<QuizViewProps> = ({ questions, chapterTitle }) => {
  const [activeMode, setActiveMode] = useState<'textbook' | 'ai'>('textbook');
  const [difficulty, setDifficulty] = useState<'সহজ' | 'কঠিন' | 'এক্সপার্ট'>('সহজ');

  // AI Quiz state
  const [aiQuestions, setAiQuestions] = useState<AiQuizItem[] | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // User answers
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Active question set based on mode
  const currentQuestions = activeMode === 'textbook' ? questions : (aiQuestions || []);

  const handleSelect = (qIdx: number, oIdx: number) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    currentQuestions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) score += 1;
    });
    return score;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    if (score === currentQuestions.length && currentQuestions.length > 0) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleReset = () => {
    setUserAnswers({});
    setIsSubmitted(false);
  };

  const handleGenerateAiQuiz = async () => {
    setAiLoading(true);
    setAiError(null);
    setUserAnswers({});
    setIsSubmitted(false);

    try {
      const generated = await generateAiQuiz(chapterTitle, difficulty);
      setAiQuestions(generated);
      setActiveMode('ai');
    } catch (err: any) {
      console.error(err);
      setAiError(err?.message || 'এআই কুইজ তৈরিতে ত্রুটি হয়েছে।');
    } finally {
      setAiLoading(false);
    }
  };

  const score = calculateScore();

  return (
    <div className='bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6'>
      {/* Header with Mode Toggle and Score */}
      <div className='flex items-center justify-between border-b border-slate-100 pb-5 flex-wrap gap-4'>
        <div>
          <div className='flex items-center gap-2 mb-1.5'>
            <span className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold'>
              {activeMode === 'textbook' ? 'পাঠ্যবই কুইজ' : `এআই কুইজ (${difficulty})`}
            </span>
          </div>
          <h3 className='text-xl md:text-2xl font-bold text-slate-900'>
            📝 {chapterTitle} - প্রস্তুতি যাচাই কুইজ
          </h3>
          <p className='text-xs md:text-sm text-slate-600 mt-1'>
            পাঠ্যবইয়ের প্রশ্ন সমাধান করো অথবা এআই দিয়ে নতুন প্রশ্ন তৈরি করো।
          </p>
        </div>

        {isSubmitted && currentQuestions.length > 0 && (
          <div className='flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl'>
            <Award className='w-6 h-6 text-emerald-600' />
            <div>
              <span className='text-xs text-emerald-800 font-bold block'>অর্জিত স্কোর</span>
              <span className='text-lg font-black text-emerald-950 font-mono'>
                {englishToBanglaDigits(score)} / {englishToBanglaDigits(currentQuestions.length)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Mode & AI Generator Control Bar */}
      <div className='p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-wrap items-center justify-between gap-4'>
        {/* Switch between textbook and AI */}
        <div className='inline-flex bg-slate-200/80 p-1 rounded-2xl'>
          <button
            onClick={() => {
              setActiveMode('textbook');
              setUserAnswers({});
              setIsSubmitted(false);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeMode === 'textbook'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            পাঠ্যবই কুইজ ({englishToBanglaDigits(questions.length)})
          </button>
          <button
            onClick={() => {
              setActiveMode('ai');
              if (!aiQuestions) {
                handleGenerateAiQuiz();
              }
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeMode === 'ai'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Sparkles className='w-3.5 h-3.5 text-amber-500' />
            <span>এআই কুইজ</span>
          </button>
        </div>

        {/* AI Generator Controls (Difficulty selection: সহজ / কঠিন / এক্সপার্ট) */}
        <div className='flex items-center gap-2 flex-wrap'>
          <span className='text-xs font-bold text-slate-500'>কঠিন্য:</span>
          <div className='inline-flex bg-slate-200/80 p-1 rounded-2xl'>
            {(['সহজ', 'কঠিন', 'এক্সপার্ট'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  difficulty === diff
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerateAiQuiz}
            disabled={aiLoading}
            className='flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-all'
          >
            <RefreshCw className={`w-3.5 h-3.5 ${aiLoading ? 'animate-spin' : ''}`} />
            <span>{aiLoading ? 'তৈরি হচ্ছে...' : 'নতুন এআই কুইজ তৈরি'}</span>
          </button>
        </div>
      </div>

      {aiError && (
        <div className='p-3.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-2xl flex items-center gap-2'>
          <AlertCircle className='w-4 h-4 shrink-0' />
          <span>{aiError}</span>
        </div>
      )}

      {aiLoading && (
        <div className='py-12 text-center space-y-3'>
          <span className='animate-spin inline-block w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full'></span>
          <div className='text-sm font-bold text-slate-700'>
            এআই {difficulty} মানের ১০টি কুইজ প্রশ্ন তৈরি করছে...
          </div>
        </div>
      )}

      {/* Question List */}
      {!aiLoading && currentQuestions.length > 0 && (
        <div className='space-y-6'>
          {currentQuestions.map((q, qIdx) => (
            <div key={q.id || qIdx} className='p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4'>
              <div className='font-bold text-slate-800 text-base flex items-start gap-2'>
                <span className='w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs shrink-0 mt-0.5 font-bold'>
                  {englishToBanglaDigits(qIdx + 1)}
                </span>
                <span>{q.question}</span>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-3 pt-1'>
                {q.options.map((opt, oIdx) => { 
                  const isSelected = userAnswers[qIdx] === oIdx;
                  const isCorrect = q.correctIndex === oIdx;
                  let btnStyle = 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300';
                  if (isSubmitted) {
                    if (isCorrect) btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold';
                    else if (isSelected && !isCorrect) btnStyle = 'bg-rose-100 border-rose-400 text-rose-900 line-through';
                  } else if (isSelected) {
                    btnStyle = 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
                  }
                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelect(qIdx, oIdx)}
                      className={'p-3.5 rounded-xl border text-left text-sm font-medium transition-all flex items-center justify-between ' + btnStyle}
                    >
                      <span>{opt}</span>
                      {isSubmitted && isCorrect && <CheckCircle2 className='w-4 h-4 text-emerald-600 shrink-0' />}
                      {isSubmitted && isSelected && !isCorrect && <XCircle className='w-4 h-4 text-rose-600 shrink-0' />}
                    </button>
                  );
                })}
              </div>

              {isSubmitted && (
                <div className='p-3 rounded-xl bg-blue-50/80 border border-blue-200/60 text-xs text-blue-900 leading-relaxed'>
                  <strong>ব্যাখ্যা: </strong> {q.explanation}
                </div>
              )}
            </div>
          ))}

          {/* Action Footer */}
          <div className='flex items-center justify-between pt-4 border-t border-slate-100'>
            <button
              onClick={handleReset}
              className='flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs md:text-sm'
            >
              <RotateCcw className='w-4 h-4' /> আবার চেষ্টা করো
            </button>

            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={Object.keys(userAnswers).length === 0}
                className='px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs md:text-sm shadow-md shadow-emerald-600/20'
              >
                উত্তর জমা দাও
              </button>
            ) : (
              <div className='text-xs font-bold text-emerald-700'>
                {score === currentQuestions.length ? '🌟 অসাধারণ ফলাফল!' : '💡 ভুলগুলো সংশোধন করে নাও।'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};