import React, { useState } from 'react';
import { Chapter } from '../types/math';
import { Printer, Eye, EyeOff } from 'lucide-react';
import { englishToBanglaDigits } from '../utils/banglaUtils';

interface WorksheetProps {
  chapter: Chapter;
}

export const WorksheetGenerator: React.FC<WorksheetProps> = ({ chapter }) => {
  const [showAnswers, setShowAnswers] = useState(false);

  return (
    <div className='bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6'>
      <div className='no-print flex items-center justify-between border-b border-slate-100 pb-4 flex-wrap gap-4'>
        <div>
          <h3 className='text-xl font-bold text-slate-900'>🖨️ প্রিন্ট ও হোমওয়ার্ক ওয়ার্কশিট</h3>
          <p className='text-sm text-slate-600 mt-1'>শ্রেণিকক্ষ বা বাড়ির কাজের জন্য প্রশ্নপত্র প্রিন্ট করো।</p>
        </div>
        <div className='flex items-center gap-3'>
          <button
            onClick={() => setShowAnswers(!showAnswers)}
            className='flex items-center gap-1.5 px-4 py-2 border border-slate-300 rounded-xl text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-50'
          >
            {showAnswers ? <EyeOff className='w-4 h-4' /> : <Eye className='w-4 h-4' />}
            {showAnswers ? 'উত্তরপত্র লুকাও' : 'উত্তরপত্র প্রদর্শন করো'}
          </button>
          <button
            onClick={() => window.print()}
            className='flex items-center gap-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs md:text-sm font-bold shadow-sm'
          >
            <Printer className='w-4 h-4' />
            প্রিন্ট করো
          </button>
        </div>
      </div>

      {/* Printable Paper Header */}
      <div className='text-center space-y-1 pb-4 border-b-2 border-slate-800'>
        <h2 className='text-xl font-black text-slate-900'>প্রাথমিক গণিত - পঞ্চম শ্রেণি</h2>
        <h4 className='text-base font-bold text-emerald-800'>{chapter.title}</h4>
        <div className='flex justify-between text-xs text-slate-600 pt-2 font-medium'>
          <span>শিক্ষার্থীর নাম: ............................................................</span>
          <span>রোল: ...................</span>
          <span>তারিখ: ...................</span>
        </div>
      </div>

      {/* Problems List */}
      <div className='space-y-6 pt-2'>
        {chapter.exercises.map((item, idx) => (
          <div key={item.id} className='space-y-2 border-b border-slate-100 pb-4'>
            <div className='font-bold text-slate-900 text-sm md:text-base flex items-start gap-2'>
              <span className='font-mono text-emerald-800'>{englishToBanglaDigits(idx + 1)}.</span>
              <span>{item.question}</span>
            </div>
            <div className='h-16 border border-dashed border-slate-200 rounded-xl bg-slate-50/50 p-2 text-xs text-slate-400'>
              রাফ / সমাধানের স্থান
            </div>
            {showAnswers && (
              <div className='p-2 bg-emerald-50 text-emerald-900 rounded-lg text-xs font-semibold'>
                উত্তর: {item.finalAnswer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};