import React, { useState } from 'react';
import { QuizQuestion } from '../types/math';
import { CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { englishToBanglaDigits } from '../utils/banglaUtils';

interface QuizViewProps {
  questions: QuizQuestion[];
  chapterTitle: string;
}

export const QuizView: React.FC<QuizViewProps> = ({ questions, chapterTitle }) => {
  const [userAnswers, setUserAnswers] = useState<{ [key: number]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelect = (qIdx: number, oIdx: number) => {
    if (isSubmitted) return;
    setUserAnswers(prev => ({ ...prev, [qIdx]: oIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctIndex) score += 1;
    });
    return score;
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    const score = calculateScore();
    if (score === questions.length) {
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleReset = () => {
    setUserAnswers({});
    setIsSubmitted(false);
  };

  const score = calculateScore();

  return (
    <div className='bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6'>
      <div className='flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-4'>
        <div>
          <h3 className='text-xl font-bold text-slate-900'>📝 {chapterTitle} - প্রস্তুতি যাচাই কুইজ</h3>
          <p className='text-sm text-slate-600 mt-1'>সঠিক উত্তর নির্বাচন করে তোমার মেধা যাচাই করো।</p>
        </div>
        {isSubmitted && (
          <div className='flex items-center gap-3 bg-emerald-50 border border-emerald-200 px-4 py-2 rounded-2xl'>
            <Award className='w-6 h-6 text-emerald-600' />
            <div>
              <span className='text-xs text-emerald-800 font-bold block'>অর্জিত স্কোর</span>
              <span className='text-lg font-black text-emerald-950 font-mono'>
                {englishToBanglaDigits(score)} / {englishToBanglaDigits(questions.length)}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Question List */}
      <div className='space-y-6'>
        {questions.map((q, qIdx) => (
          <div key={q.id} className='p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4'>
            <div className='font-bold text-slate-800 text-base flex items-start gap-2'>
              <span className='w-6 h-6 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center text-xs shrink-0 mt-0.5'>
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
              <div className='p-3 bg-emerald-50/50 border border-emerald-100 rounded-xl text-xs text-emerald-900'>
                <strong>ব্যাখ্যা: </strong>{q.explanation}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className='flex items-center justify-end gap-3 pt-4 border-t border-slate-100'>
        {isSubmitted ? (
          <button
            onClick={handleReset}
            className='flex items-center gap-2 px-5 py-2.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-sm transition-colors'
          >
            <RotateCcw className='w-4 h-4' />
            পুনরায় কুইজ দাও
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={Object.keys(userAnswers).length === 0}
            className='px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-bold text-sm transition-colors shadow-sm'
          >
            ফলাফল যাচাই করো
          </button>
        )}
      </div>
    </div>
  );
};