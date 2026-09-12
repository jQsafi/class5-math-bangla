import React, { useState } from 'react';
import { Chapter, ActiveTab } from '../types/math';
import { SolutionCard } from '../components/SolutionCard';
import { QuizView } from '../components/QuizView';
import { WorksheetGenerator } from '../components/WorksheetGenerator';
import { FractionVisualizer } from '../components/InteractiveWidgets/FractionVisualizer';
import { GeometryCanvas } from '../components/InteractiveWidgets/GeometryCanvas';
import { LcmGcdCalculator } from '../components/InteractiveWidgets/LcmGcdCalculator';
import { UnitTimeConverter } from '../components/InteractiveWidgets/UnitTimeConverter';
import { BarChartBuilder } from '../components/InteractiveWidgets/BarChartBuilder';
import { Class5Calculator } from '../components/InteractiveWidgets/Class5Calculator';
import { AiProblemGenerator } from '../components/AiProblemGenerator';
import { BookOpen, CheckCircle, ChevronLeft, ChevronRight, HelpCircle, Sparkles, Printer, Layers, Bot } from 'lucide-react';
import { englishToBanglaDigits } from '../utils/banglaUtils';

interface ChapterPageProps {
  chapter: Chapter;
  onSelectChapter: (id: number) => void;
  isCompleted: boolean;
  onToggleComplete: (id: number) => void;
  totalChapters: number;
}

export const ChapterPage: React.FC<ChapterPageProps> = ({
  chapter,
  onSelectChapter,
  isCompleted,
  onToggleComplete,
  totalChapters
}) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('theory');

  const renderInteractiveWidget = () => {
    switch (chapter.interactiveToolType) {
      case 'fraction': return <FractionVisualizer />;
      case 'geometry': return <GeometryCanvas />;
      case 'lcmgcd': return <LcmGcdCalculator />;
      case 'unittime': return <UnitTimeConverter />;
      case 'barchart': return <BarChartBuilder />;
      case 'calculator': return <Class5Calculator />;
      default: return <Class5Calculator />;
    }
  };

  return (
    <div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8'>
      {/* Chapter Top Header Card */}
      <div className='bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-4'>
        <div className='flex items-center justify-between flex-wrap gap-4'>
          <div className='flex items-center gap-2'>
            <span className='px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800'>
              {chapter.categoryBn}
            </span>
            <span className='text-xs text-slate-500 font-semibold'>
              অধ্যায় {chapter.numberBn} এর {englishToBanglaDigits(totalChapters)}
            </span>
          </div>

          <button
            onClick={() => onToggleComplete(chapter.id)}
            className={'flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs md:text-sm font-bold border transition-all ' + (isCompleted ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm' : 'bg-slate-50 border-slate-300 text-slate-700 hover:bg-slate-100')}
          >
            <CheckCircle className='w-4 h-4' />
            <span>{isCompleted ? 'অধ্যায় সম্পন্ন হয়েছে ✓' : 'সম্পন্ন হিসেবে চিহ্নিত করো'}</span>
          </button>
        </div>

        <div>
          <h1 className='text-2xl md:text-4xl font-black text-slate-900'>{chapter.title}</h1>
          <p className='text-slate-600 text-sm md:text-base mt-2 leading-relaxed'>{chapter.summary}</p>
        </div>

        {/* Tab Switcher */}
        <div className='flex flex-wrap gap-2 pt-4 border-t border-slate-100'>
          {[ 
            { id: 'theory', label: '📖 মূল ধারণা ও উদাহরণ', icon: BookOpen },
            { id: 'solutions', label: '💡 সমাধানমালা (' + englishToBanglaDigits(chapter.exercises.length) + ')', icon: HelpCircle },
            { id: 'interactive', label: '🧮 ইন্টারেক্টিভ ল্যাব', icon: Sparkles },
            { id: 'quiz', label: '📝 কুইজ (' + englishToBanglaDigits(chapter.quiz.length) + ')', icon: Layers },
            { id: 'worksheet', label: '🖨️ এআই ওয়ার্কশিট', icon: Printer },
            { id: 'ai_generator', label: '✨ এআই অনুশীলন তৈরি', icon: Bot }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ActiveTab)}
              className={'px-4 py-2.5 rounded-2xl text-xs md:text-sm font-bold transition-all flex items-center gap-2 ' + (activeTab === tab.id ? 'bg-emerald-600 text-white shadow-md' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')}
            >
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Theory & Examples */}
      {activeTab === 'theory' && (
        <div className='space-y-6'>
          {/* Key Formulas */}
          {chapter.keyFormulas.length > 0 && (
            <div className='bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl border border-amber-200/80 p-6 space-y-4'>
              <h3 className='text-lg font-bold text-amber-900 flex items-center gap-2'>
                <span>⚡ গুরুত্বপূর্ণ সূত্রসমূহ</span>
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                {chapter.keyFormulas.map((f, i) => (
                  <div key={i} className='p-4 bg-white/80 backdrop-blur rounded-2xl border border-amber-200/60 shadow-xs'>
                    <div className='text-xs font-bold text-amber-800'>{f.name}</div>
                    <div className='text-sm md:text-base font-black text-slate-900 mt-1 font-mono'>{f.formula}</div>
                    {f.note && <div className='text-xs text-slate-500 mt-1'>{f.note}</div>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Key Theory Points */}
          <div className='bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-4'>
            <h3 className='text-xl font-bold text-slate-900'>📚 পাঠ্যবইয়ের মূল বিষয়বস্তু</h3>
            <div className='space-y-4'>
              {chapter.keyTheories.map((th, i) => (
                <div key={i} className='p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2'>
                  <h4 className='font-bold text-slate-800 text-base'>{th.title}</h4>
                  <p className='text-slate-600 text-sm leading-relaxed whitespace-pre-line'>{th.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Examples */}
          {chapter.examples.map((ex) => (
            <div key={ex.id} className='bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xs space-y-4'>
              <div className='flex items-center gap-2'>
                <span className='px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800'>আদর্শ উদাহরণ</span>
                <h3 className='font-bold text-slate-900 text-base'>{ex.title}</h3>
              </div>
              <div className='text-slate-800 font-medium text-base'>{ex.question}</div>
              <div className='space-y-2 pt-2'>
                {ex.steps.map((st, sIdx) => (
                  <div key={sIdx} className='p-3 bg-slate-50 rounded-xl text-xs md:text-sm text-slate-700 flex items-start gap-2'>
                    <span className='w-5 h-5 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs shrink-0'>{englishToBanglaDigits(st.stepNumber)}</span>
                    <div>
                      <div>{st.explanation}</div>
                      {st.mathExpression && <div className='font-mono font-bold text-blue-900 mt-1'>{st.mathExpression}</div>}
                    </div>
                  </div>
                ))}
              </div>
              <div className='p-3 bg-blue-50 border border-blue-200 rounded-xl font-bold text-blue-950 text-sm'>
                উত্তর: {ex.finalAnswer}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Solutions */}
      {activeTab === 'solutions' && (
        <div className='space-y-4'>
          <div className='p-4 md:p-5 bg-gradient-to-r from-emerald-50 via-teal-50 to-indigo-50 rounded-2xl border border-emerald-200/80 text-emerald-950 text-xs md:text-sm font-medium flex items-center justify-between gap-3 flex-wrap'>
            <div className='flex items-center gap-2.5'>
              <div className='w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs'>
                <Sparkles className='w-4 h-4' />
              </div>
              <div>
                <strong className='font-bold text-slate-900 block text-sm'>ইন্টারেক্টিভ এআই সমাধানমালা</strong>
                <span className='text-slate-600 text-xs'>প্রতিটি অংকের সাথে রয়েছে ধাপে ধাপে সমাধান এবং "✨ এআই সহজ ব্যাখ্যা ও বিকল্প নিয়ম"।</span>
              </div>
            </div>
          </div>
          {chapter.exercises.map((prob, idx) => (
            <SolutionCard key={prob.id} problem={prob} index={idx} />
          ))}
        </div>
      )}

      {/* Tab 3: Interactive Tool */}
      {activeTab === 'interactive' && (
        <div>{renderInteractiveWidget()}</div>
      )}

      {/* Tab 4: Quiz */}
      {activeTab === 'quiz' && (
        <QuizView questions={chapter.quiz} chapterTitle={chapter.title} />
      )}

      {/* Tab 5: Worksheet */}
      {activeTab === 'worksheet' && (
        <WorksheetGenerator chapter={chapter} />
      )}

      {/* Tab 6: AI Exercise Generator */}
      {activeTab === 'ai_generator' && (
        <AiProblemGenerator
          chapterTitle={chapter.title}
          chapterSummary={chapter.summary}
        />
      )}

      {/* Bottom Navigation Pagination */}
      <div className='flex items-center justify-between pt-6 border-t border-slate-200'>
        {chapter.id > 1 ? (
          <button
            onClick={() => onSelectChapter(chapter.id - 1)}
            className='flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs md:text-sm font-bold shadow-xs'
          >
            <ChevronLeft className='w-4 h-4' />
            <span>পূর্ববর্তী অধ্যায়</span>
          </button>
        ) : <div />}

        {chapter.id < totalChapters ? (
          <button
            onClick={() => onSelectChapter(chapter.id + 1)}
            className='flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs md:text-sm font-bold shadow-md shadow-emerald-600/20 ml-auto'
          >
            <span>পরবর্তী অধ্যায়</span>
            <ChevronRight className='w-4 h-4' />
          </button>
        ) : <div />}
      </div>
    </div>
  );
};