import React from 'react';
import { Chapter } from '../types/math';
import { ArrowRight, CheckCircle2, Sparkles, BookOpen, Layers, Compass, Ruler, BarChart2 } from 'lucide-react';
import { englishToBanglaDigits } from '../utils/banglaUtils';

interface HomePageProps {
  chapters: Chapter[];
  onSelectChapter: (id: number) => void;
  completedChapters: number[];
  onOpenFormulaModal: () => void;
  onGoPractice: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  chapters,
  onSelectChapter,
  completedChapters,
  onOpenFormulaModal,
  onGoPractice
}) => {
  const categories = [
    { id: 'arithmetic', title: 'পাটিগণিত (গুণ, ভাগ, ভগ্নাংশ, গড়, শতকরা)', icon: Layers, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { id: 'geometry', title: 'জ্যামিতি (কোণ, চতুর্ভুজ ও বৃত্ত)', icon: Compass, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { id: 'measurement', title: 'পরিমাপ ও সময়', icon: Ruler, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
    { id: 'data_tech', title: 'উপাত্ত ও প্রযুক্তি', icon: BarChart2, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  ];

  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10'>
      {/* Hero Banner */}
      <div className='relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-8 md:p-12 shadow-xl'>
        <div className='relative z-10 max-w-3xl space-y-4'>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs md:text-sm font-semibold text-emerald-100'>
            <Sparkles className='w-4 h-4 text-amber-300' />
            <span>জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) অনুমোদিত পাঠ্যসূচি</span>
          </div>
          <h1 className='text-3xl md:text-5xl font-black tracking-tight leading-tight'>
            পঞ্চম শ্রেণির গণিত <br className='hidden sm:inline' /> সম্পূর্ণ সমাধান ও পাঠশালা
          </h1>
          <p className='text-emerald-100 text-sm md:text-base leading-relaxed'>
            সকল ১৪টি অধ্যায়ের মূল ধারণা, ধাপে ধাপে বিস্তারিত সমাধানমালা, সূত্র ভাণ্ডার এবং ইন্টারেক্টিভ অনুশীলনী দিয়ে গণিত শেখো আনন্দের সাথে।
          </p>
          <div className='flex flex-wrap items-center gap-3 pt-2'>
            <button
              onClick={() => onSelectChapter(1)}
              className='px-6 py-3 bg-white text-emerald-900 rounded-2xl font-black text-sm hover:bg-emerald-50 shadow-md transition-all flex items-center gap-2'
            >
              <span>১ম অধ্যায় দিয়ে শুরু করো</span>
              <ArrowRight className='w-4 h-4' />
            </button>
            <button
              onClick={onOpenFormulaModal}
              className='px-6 py-3 bg-emerald-800/60 hover:bg-emerald-800 text-white rounded-2xl font-bold text-sm backdrop-blur-md border border-white/20 transition-all flex items-center gap-2'
            >
              <BookOpen className='w-4 h-4' />
              <span>সকল সূত্রমালা (Cheat Sheet)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Chapters Grouped by Category */}
      <div className='space-y-8'>
        {categories.map((cat) => { 
          const catChapters = chapters.filter(c => c.category === cat.id);
          if (catChapters.length === 0) return null;
          const IconComponent = cat.icon;
          return (
            <div key={cat.id} className='space-y-4'>
              <div className='flex items-center gap-2.5'>
                <div className={'p-2 rounded-xl border ' + cat.color}>
                  <IconComponent className='w-5 h-5' />
                </div>
                <h2 className='text-lg md:text-xl font-bold text-slate-900'>{cat.title}</h2>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
                {catChapters.map((ch) => { 
                  const isDone = completedChapters.includes(ch.id);
                  return (
                    <div
                      key={ch.id}
                      onClick={() => onSelectChapter(ch.id)}
                      className='group bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:shadow-xl hover:border-emerald-500/50 transition-all duration-300 cursor-pointer flex flex-col justify-between'
                    >
                      <div className='space-y-3'>
                        <div className='flex items-start justify-between gap-2'>
                          <span className='inline-flex items-center justify-center w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-sm'>
                            {ch.numberBn}
                          </span>
                          {isDone ? (
                            <span className='inline-flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200'>
                              <CheckCircle2 className='w-3.5 h-3.5' /> সম্পন্ন
                            </span>
                          ) : (
                            <span className='text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full'>
                              {englishToBanglaDigits(ch.exercises.length)} টি সমাধান
                            </span>
                          )}
                        </div>

                        <h3 className='text-lg font-bold text-slate-900 group-hover:text-emerald-700 transition-colors'>
                          {ch.title}
                        </h3>
                        <p className='text-xs text-slate-500 line-clamp-2 leading-relaxed'>
                          {ch.summary}
                        </p>
                      </div>

                      <div className='pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-700'>
                        <span>অধ্যায়টি শুরু করো</span>
                        <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};