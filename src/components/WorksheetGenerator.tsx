import React, { useState } from 'react';
import { Chapter } from '../types/math';
import { Printer, Eye, EyeOff, Sparkles, RefreshCw, AlertCircle, FileText } from 'lucide-react';
import { englishToBanglaDigits } from '../utils/banglaUtils';
import { generateAiWorksheet, AiWorksheetItem } from '../services/groqService';

interface WorksheetProps {
  chapter: Chapter;
}

export const WorksheetGenerator: React.FC<WorksheetProps> = ({ chapter }) => {
  const [mode, setMode] = useState<'textbook' | 'ai'>('ai');
  const [showAnswers, setShowAnswers] = useState(false);
  const [difficulty, setDifficulty] = useState<'সহজ' | 'কঠিন' | 'এক্সপার্ট'>('সহজ');
  const [questionCount, setQuestionCount] = useState<number>(10);

  // AI Worksheet State
  const [aiWorksheet, setAiWorksheet] = useState<AiWorksheetItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleGenerateAiWorksheet = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const items = await generateAiWorksheet(
        chapter.title,
        chapter.summary,
        difficulty,
        questionCount
      );
      setAiWorksheet(items);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'ওয়ার্কশিট তৈরিতে ত্রুটি হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-6'>
      {/* Top Controls Bar (Hidden during Print) */}
      <div className='no-print space-y-5 border-b border-slate-100 pb-5'>
        <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
          <div>
            <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-1.5'>
              <Sparkles className='w-3.5 h-3.5 text-emerald-600' />
              <span>স্মার্ট ওয়ার্কশিট ও প্রশ্নপত্র হাব</span>
            </div>
            <h3 className='text-xl md:text-2xl font-bold text-slate-900'>
              🖨️ প্রিন্ট ও হোমওয়ার্ক ওয়ার্কশিট
            </h3>
            <p className='text-xs md:text-sm text-slate-600 mt-0.5'>
              শ্রেণিকক্ষ, পরীক্ষা বা বাড়ির কাজের জন্য পাঠ্যবই বা নতুন এআই ওয়ার্কশিট তৈরি ও প্রিন্ট করো।
            </p>
          </div>

          {/* Action Buttons */}
          <div className='flex items-center gap-2.5 flex-wrap'>
            <button
              onClick={() => setShowAnswers(!showAnswers)}
              className='flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-2xl text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors'
            >
              {showAnswers ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
              <span>{showAnswers ? 'উত্তরপত্র লুকাও' : 'উত্তরপত্র প্রদর্শন করো'}</span>
            </button>
            <button
              onClick={() => window.print()}
              className='flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl text-xs md:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95'
            >
              <Printer className='w-4 h-4' />
              <span>প্রিন্ট / PDF সেভ</span>
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className='flex items-center gap-2 pt-1'>
          <button
            onClick={() => setMode('ai')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs md:text-sm font-bold transition-all ${
              mode === 'ai'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Sparkles className='w-4 h-4' />
            <span>✨ এআই নতুন ওয়ার্কশিট জেনারেটর</span>
          </button>
          <button
            onClick={() => setMode('textbook')}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs md:text-sm font-bold transition-all ${
              mode === 'textbook'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <FileText className='w-4 h-4' />
            <span>পাঠ্যবইয়ের ওয়ার্কশিট ({englishToBanglaDigits(chapter.exercises.length)})</span>
          </button>
        </div>

        {/* AI Options Panel */}
        {mode === 'ai' && (
          <div className='p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4'>
            <div className='flex items-center gap-4 flex-wrap'>
              {/* Difficulty */}
              <div className='flex items-center gap-2'>
                <span className='text-xs font-bold text-emerald-950'>কঠিন্য মাত্রা:</span>
                <div className='inline-flex bg-white rounded-xl p-1 border border-emerald-200 shadow-2xs'>
                  {(['সহজ', 'কঠিন', 'এক্সপার্ট'] as const).map((diff) => (
                    <button
                      key={diff}
                      type='button'
                      onClick={() => setDifficulty(diff)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        difficulty === diff
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-700 hover:text-emerald-800'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question Count */}
              <div className='flex items-center gap-2'>
                <span className='text-xs font-bold text-emerald-950'>প্রশ্নের সংখ্যা:</span>
                <div className='inline-flex bg-white rounded-xl p-1 border border-emerald-200 shadow-2xs'>
                  {[10, 15, 20].map((cnt) => (
                    <button
                      key={cnt}
                      type='button'
                      onClick={() => setQuestionCount(cnt)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                        questionCount === cnt
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'text-slate-700 hover:text-emerald-800'
                      }`}
                    >
                      {englishToBanglaDigits(cnt)}টি
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleGenerateAiWorksheet}
              disabled={loading}
              className='flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-2xl text-xs md:text-sm font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95 shrink-0'
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'ওয়ার্কশিট তৈরি হচ্ছে...' : '✨ এআই প্রশ্নপত্র তৈরি করো'}</span>
            </button>
          </div>
        )}

        {errorMsg && (
          <div className='p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-center gap-2'>
            <AlertCircle className='w-4 h-4 shrink-0 text-rose-600' />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Printable Paper Canvas */}
      <div className='print-sheet space-y-6 pt-2'>
        {/* Paper Header */}
        <div className='text-center space-y-1 pb-4 border-b-2 border-slate-900'>
          <h2 className='text-xl md:text-2xl font-black text-slate-900'>প্রাথমিক গণিত - পঞ্চম শ্রেণি</h2>
          <div className='flex items-center justify-center gap-2 text-sm md:text-base font-bold text-emerald-800'>
            <span>{chapter.title}</span>
            {mode === 'ai' && (
              <span className='text-xs px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-semibold'>
                {difficulty} মান
              </span>
            )}
          </div>
          <div className='flex justify-between items-center text-xs text-slate-700 pt-3 font-medium flex-wrap gap-2 border-t border-slate-200 mt-2'>
            <span>শিক্ষার্থীর নাম: ............................................................</span>
            <span>রোল: ...................</span>
            <span>তারিখ: ...................</span>
            <span>পূর্ণমান: {englishToBanglaDigits((mode === 'ai' ? (aiWorksheet.length || questionCount) : chapter.exercises.length) * 5)}</span>
          </div>
        </div>

        {/* AI Mode Loading */}
        {mode === 'ai' && loading && (
          <div className='no-print py-16 text-center space-y-3'>
            <span className='animate-spin inline-block w-8 h-8 border-3 border-emerald-600 border-t-transparent rounded-full'></span>
            <p className='text-sm font-bold text-slate-700'>
              এআই "{chapter.title}" অধ্যায়ের ওপর {englishToBanglaDigits(questionCount)}টি নতুন {difficulty} প্রশ্ন তৈরি করছে...
            </p>
          </div>
        )}

        {/* AI Mode Empty State Prompt */}
        {mode === 'ai' && !loading && aiWorksheet.length === 0 && (
          <div className='no-print text-center py-12 px-4 rounded-3xl bg-slate-50 border border-dashed border-slate-300 space-y-3'>
            <Sparkles className='w-8 h-8 text-emerald-600 mx-auto' />
            <h4 className='text-base font-bold text-slate-800'>নতুন এআই প্রশ্নপত্র তৈরি করতে প্রস্তুত</h4>
            <p className='text-xs md:text-sm text-slate-600 max-w-md mx-auto'>
              উপরের প্যানেল থেকে কঠিন্য মাত্রা ও প্রশ্নের সংখ্যা নির্বাচন করে <strong>"এআই প্রশ্নপত্র তৈরি করো"</strong> বাটনে ক্লিক করো।
            </p>
            <button
              onClick={handleGenerateAiWorksheet}
              className='px-5 py-2.5 bg-emerald-600 text-white rounded-2xl text-xs md:text-sm font-bold shadow-sm hover:bg-emerald-700 transition-colors'
            >
              এখনই প্রশ্ন তৈরি করো
            </button>
          </div>
        )}

        {/* AI Worksheet Questions List */}
        {mode === 'ai' && !loading && aiWorksheet.length > 0 && (
          <div className='space-y-6 pt-2'>
            {aiWorksheet.map((item, idx) => (
              <div key={item.id || idx} className='space-y-2.5 border-b border-slate-200 pb-5 break-inside-avoid'>
                <div className='font-bold text-slate-900 text-sm md:text-base flex items-start justify-between gap-3'>
                  <div className='flex items-start gap-2'>
                    <span className='font-mono font-bold text-emerald-800'>{englishToBanglaDigits(idx + 1)}.</span>
                    <span className='leading-relaxed'>{item.question}</span>
                  </div>
                  <span className='text-xs font-mono font-normal text-slate-400 shrink-0'>[মান: ৫]</span>
                </div>

                {/* Calculation Workspace Box */}
                <div className='h-24 border border-dashed border-slate-300 rounded-xl bg-slate-50/40 p-2.5 text-[11px] text-slate-400 flex flex-col justify-between'>
                  <span>রাফ / সমাধানের স্থান:</span>
                  <span className='text-right'>উত্তর: ............................................</span>
                </div>

                {/* Teacher/Parent Answer Key */}
                {showAnswers && (
                  <div className='p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl text-xs font-semibold flex items-center justify-between gap-2'>
                    <span>সঠিক উত্তর: <strong>{item.answer}</strong></span>
                    {item.hint && <span className='text-slate-500 text-[11px] font-normal'>সংকেত: {item.hint}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Textbook Exercises Worksheet */}
        {mode === 'textbook' && (
          <div className='space-y-6 pt-2'>
            {chapter.exercises.map((item, idx) => (
              <div key={item.id} className='space-y-2.5 border-b border-slate-200 pb-5 break-inside-avoid'>
                <div className='font-bold text-slate-900 text-sm md:text-base flex items-start justify-between gap-3'>
                  <div className='flex items-start gap-2'>
                    <span className='font-mono font-bold text-emerald-800'>{englishToBanglaDigits(idx + 1)}.</span>
                    <span className='leading-relaxed'>{item.question}</span>
                  </div>
                  <span className='text-xs font-mono font-normal text-slate-400 shrink-0'>[মান: ৫]</span>
                </div>

                {/* Calculation Workspace Box */}
                <div className='h-24 border border-dashed border-slate-300 rounded-xl bg-slate-50/40 p-2.5 text-[11px] text-slate-400 flex flex-col justify-between'>
                  <span>রাফ / সমাধানের স্থান:</span>
                  <span className='text-right'>উত্তর: ............................................</span>
                </div>

                {/* Teacher/Parent Answer Key */}
                {showAnswers && (
                  <div className='p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-950 rounded-xl text-xs font-semibold flex items-center justify-between gap-2'>
                    <span>সঠিক উত্তর: <strong>{item.finalAnswer}</strong></span>
                    {item.hint && <span className='text-slate-500 text-[11px] font-normal'>সংকেত: {item.hint}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};