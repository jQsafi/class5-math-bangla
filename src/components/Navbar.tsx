import React, { useState } from 'react';
import { BookOpen, Search, Menu, Sparkles, BookMarked, Home, ChevronRight } from 'lucide-react';
import { Chapter } from '../types/math';

interface NavbarProps {
  onSelectChapter: (id: number) => void;
  onOpenFormulaModal: () => void;
  onGoHome: () => void;
  onGoPractice: () => void;
  activeChapterId: number | null;
  chapters: Chapter[];
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectChapter,
  onOpenFormulaModal,
  onGoHome,
  onGoPractice,
  activeChapterId,
  chapters,
  onToggleSidebar
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredChapters = chapters.filter(c => 
    c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.summary.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <header className='sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4'>
        {/* Left: Brand & Sidebar Toggle */}
        <div className='flex items-center gap-3'>
          <button
            onClick={onToggleSidebar}
            className='p-2 rounded-xl text-slate-600 hover:bg-slate-100 md:hidden'
          >
            <Menu className='w-5 h-5' />
          </button>
          <div onClick={onGoHome} className='flex items-center gap-2 cursor-pointer group'>
            <div className='w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform'>
              <BookOpen className='w-5 h-5' />
            </div>
            <div>
              <h1 className='text-base md:text-lg font-black text-slate-900 leading-tight flex items-center gap-1.5'>
                গণিত পাঠশালা <span className='text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800'>৫ম শ্রেণি</span>
              </h1>
              <p className='text-[10px] text-slate-500 hidden sm:block'>NCTB পাঠ্যবই ও সম্পূর্ণ সমাধানমালা</p>
            </div>
          </div>
        </div>

        {/* Middle: Search bar */}
        <div className='relative flex-1 max-w-md hidden md:block'>
          <div className='relative'>
            <Search className='w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2' />
            <input
              type='text'
              placeholder='অধ্যায়, সূত্র বা বিষয় খুঁজুন (যেমন: ভগ্নাংশ, লসাগু)...'
              value={searchTerm}
              onChange={(e) => { 
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className='w-full pl-9 pr-4 py-2 bg-slate-100 focus:bg-white rounded-2xl text-xs md:text-sm border border-transparent focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all'
            />
          </div>

          {/* Search dropdown */}
          {showDropdown && searchTerm.trim() && (
            <div className='absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 max-h-80 overflow-y-auto z-50'>
              {filteredChapters.length > 0 ? (
                filteredChapters.map(c => (
                  <div
                    key={c.id}
                    onClick={() => { 
                      onSelectChapter(c.id);
                      setShowDropdown(false);
                      setSearchTerm('');
                    }}
                    className='p-2.5 rounded-xl hover:bg-emerald-50 cursor-pointer flex items-center justify-between'
                  >
                    <div>
                      <div className='font-bold text-slate-800 text-xs md:text-sm'>{c.title}</div>
                      <div className='text-[11px] text-slate-500 line-clamp-1'>{c.summary}</div>
                    </div>
                    <ChevronRight className='w-4 h-4 text-slate-400' />
                  </div>
                ))
              ) : (
                <div className='p-3 text-center text-xs text-slate-500'>কোনো অধ্যায় পাওয়া যায়নি</div>
              )}
            </div>
          )}
        </div>

        {/* Right Nav buttons */}
        <div className='flex items-center gap-2'>
          <button
            onClick={onGoHome}
            className={'p-2 rounded-xl text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 text-xs font-bold ' + (activeChapterId === null ? 'text-emerald-600 bg-emerald-50' : '')}
            title='মূল পাতা'
          >
            <Home className='w-4 h-4' />
            <span className='hidden lg:inline'>হোম</span>
          </button>

          <button
            onClick={onGoPractice}
            className='px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 text-xs font-bold'
          >
            <Sparkles className='w-4 h-4 text-amber-500' />
            <span className='hidden sm:inline'>অনুশীলনী ল্যাব</span>
          </button>

          <button
            onClick={onOpenFormulaModal}
            className='px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white flex items-center gap-1.5 text-xs font-bold shadow-sm shadow-emerald-600/20 transition-all'
          >
            <BookMarked className='w-4 h-4' />
            <span>সূত্র ভাণ্ডার</span>
          </button>
        </div>
      </div>
    </header>
  );
};