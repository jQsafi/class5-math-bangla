import React from 'react';
import { Chapter } from '../types/math';
import { CheckCircle, Circle, ChevronRight, X } from 'lucide-react';

interface SidebarProps {
  chapters: Chapter[];
  activeChapterId: number | null;
  onSelectChapter: (id: number) => void;
  completedChapters: number[];
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  chapters,
  activeChapterId,
  onSelectChapter,
  completedChapters,
  isOpen,
  onClose
}) => {
  return (
    <aside
      className={'fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200/80 p-4 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:z-0 flex flex-col ' + (isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:shadow-none')}
    >
      {/* Mobile close button */}
      <div className='flex items-center justify-between pb-3 border-b border-slate-100 md:hidden'>
        <span className='font-bold text-slate-800 text-sm'>অধ্যায় তালিকা</span>
        <button onClick={onClose} className='p-1 rounded-lg text-slate-500 hover:bg-slate-100'>
          <X className='w-5 h-5' />
        </button>
      </div>

      {/* Progress Counter */}
      <div className='my-3 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl'>
        <div className='flex items-center justify-between text-xs font-bold text-emerald-900 mb-1.5'>
          <span>পাঠ অগ্রগতি</span>
          <span>{completedChapters.length} / {chapters.length} সম্পন্ন</span>
        </div>
        <div className='w-full h-2 bg-emerald-200/60 rounded-full overflow-hidden'>
          <div
            className='h-full bg-emerald-600 rounded-full transition-all duration-500'
            style={{ width: ((completedChapters.length / chapters.length) * 100) + '%' }}
          />
        </div>
      </div>

      {/* Chapters Scrollable Nav List */}
      <div className='flex-1 overflow-y-auto space-y-1.5 pr-1 py-1'>
        {chapters.map((ch) => { 
          const isActive = activeChapterId === ch.id;
          const isDone = completedChapters.includes(ch.id);
          return (
            <button
              key={ch.id}
              onClick={() => { 
                onSelectChapter(ch.id);
                onClose();
              }}
              className={'w-full text-left px-3 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all flex items-center justify-between gap-2 ' + (isActive ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100')}
            >
              <div className='flex items-center gap-2.5 truncate'>
                {isDone ? (
                  <CheckCircle className={'w-4 h-4 shrink-0 ' + (isActive ? 'text-white' : 'text-emerald-600')} />
                ) : (
                  <Circle className={'w-4 h-4 shrink-0 ' + (isActive ? 'text-emerald-200' : 'text-slate-300')} />
                )}
                <span className='truncate'>{ch.title}</span>
              </div>
              <ChevronRight className={'w-3.5 h-3.5 shrink-0 ' + (isActive ? 'text-emerald-200' : 'text-slate-400')} />
            </button>
          );
        })}
      </div>
    </aside>
  );
};