import React, { useState, useEffect } from 'react';
import { chaptersData } from './data/chaptersData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HomePage } from './pages/HomePage';
import { ChapterPage } from './pages/ChapterPage';
import { FormulaSheetPage } from './pages/FormulaSheetPage';
import { PracticePage } from './pages/PracticePage';
import { AiTutorModal } from './components/AiTutorModal';

export const App: React.FC = () => {
  const [activeChapterId, setActiveChapterId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'chapter' | 'formulas' | 'practice'>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiTutorOpen, setAiTutorOpen] = useState(false);
  const [completedChapters, setCompletedChapters] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('class5_math_completed');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  // Handle hash changes for direct chapter linking
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#chapter-')) {
        const chId = parseInt(hash.replace('#chapter-', ''));
        if (!isNaN(chId) && chId >= 1 && chId <= chaptersData.length) {
          setActiveChapterId(chId);
            setCurrentPage('chapter');
        }
      } else if (hash === '#formulas') {
        setCurrentPage('formulas');
        setActiveChapterId(null);
      } else if (hash === '#practice') {
        setCurrentPage('practice');
        setActiveChapterId(null);
      } else {
        setCurrentPage('home');
        setActiveChapterId(null);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // Update document title and track page views in Google Analytics
  useEffect(() => {
    let title = 'পঞ্চম শ্রেণি গণিত পাঠশালা - সম্পূর্ণ সমাধানমালা, কুইজ ও এআই গণিত শিক্ষক';
    if (currentPage === 'chapter' && activeChapterId) {
      const ch = chaptersData.find(c => c.id === activeChapterId);
      if (ch) {
        title = `${ch.title} - ৫ম শ্রেণি গণিত পাঠশালা`;
      }
    } else if (currentPage === 'formulas') {
      title = 'প্রয়োজনীয় সূত্র ও নিয়মাবলী - ৫ম শ্রেণি গণিত পাঠশালা';
    } else if (currentPage === 'practice') {
      title = 'অনুশীলন ল্যাব ও কুইজ - ৫ম শ্রেণি গণিত পাঠশালা';
    }
    document.title = title;

    if (typeof window !== 'undefined') {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'page_view', {
          page_title: title,
          page_path: window.location.pathname + window.location.hash,
          page_location: window.location.href,
        });
      }
      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push({
          event: 'pageview',
          page_title: title,
          page_path: window.location.pathname + window.location.hash,
          page_location: window.location.href,
        });
      }
    }
  }, [currentPage, activeChapterId]);

  const handleSelectChapter = (id: number) => {
    setActiveChapterId(id);
    setCurrentPage('chapter');
    window.location.hash = '#chapter-' + id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setActiveChapterId(null);
    setCurrentPage('home');
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenFormulaModal = () => {
    setCurrentPage('formulas');
    setActiveChapterId(null);
    window.location.hash = '#formulas';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoPractice = () => {
    setCurrentPage('practice');
    setActiveChapterId(null);
    window.location.hash = '#practice';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleComplete = (id: number) => {
    setCompletedChapters(prev => {
      const next = prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id];
      try { localStorage.setItem('class5_math_completed', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };

  const activeChapter = chaptersData.find(c => c.id === activeChapterId);

  return (
    <div className='min-h-screen flex flex-col bg-slate-50 font-bangla'>
      <Navbar
        chapters={chaptersData}
        activeChapterId={activeChapterId}
        onSelectChapter={handleSelectChapter}
        onOpenFormulaModal={handleOpenFormulaModal}
        onGoHome={handleGoHome}
        onGoPractice={handleGoPractice}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        onOpenAiTutor={() => setAiTutorOpen(true)}
      />

      <div className='flex-1 flex w-full max-w-7xl mx-auto'>
        {/* Sidebar only on chapter view or persistent on desktop */}
        {currentPage === 'chapter' && (
          <Sidebar
            chapters={chaptersData}
            activeChapterId={activeChapterId}
            onSelectChapter={handleSelectChapter}
            completedChapters={completedChapters}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
        )}

        <main className='flex-1 overflow-x-hidden min-h-[calc(100vh-4rem)]'>
          {currentPage === 'home' && (
            <HomePage
              chapters={chaptersData}
              onSelectChapter={handleSelectChapter}
              completedChapters={completedChapters}
              onOpenFormulaModal={handleOpenFormulaModal}
              onGoPractice={handleGoPractice}
            />
          )}

          {currentPage === 'chapter' && activeChapter && (
            <ChapterPage
              chapter={activeChapter}
              onSelectChapter={handleSelectChapter}
              isCompleted={completedChapters.includes(activeChapter.id)}
              onToggleComplete={handleToggleComplete}
              totalChapters={chaptersData.length}
            />
          )}

          {currentPage === 'formulas' && (
            <FormulaSheetPage />
          )}

          {currentPage === 'practice' && (
            <PracticePage />
          )}
        </main>
      </div>

      {/* Footer / Copyright Section */}
      <footer className='border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500 font-bangla space-y-2 mt-12 no-print'>
        <p className='font-semibold text-slate-700'>
          পঞ্চম শ্রেণি গণিত পাঠশালা • সম্পূর্ণ সমাধানমালা ও এআই গণিত বন্ধু
        </p>
        <div className='pt-2 border-t border-slate-100 max-w-lg mx-auto flex items-center justify-center gap-1.5 text-slate-600 flex-wrap'>
          <span>পরিকল্পনা ও কারিগরি সহায়তায়:</span>
          <a
            href='https://jqsafi.github.io/'
            target='_blank'
            rel='noopener noreferrer'
            className='font-bold text-emerald-700 hover:text-emerald-900 underline underline-offset-2 transition-colors font-sans'
          >
            Shafayat Hossain
          </a>
        </div>
        <p className='text-[11px] text-slate-400'>
          © {new Date().getFullYear()} সর্বস্বত্ব সংরক্ষিত • শিক্ষা ও জনকল্যাণে উন্মুক্ত
        </p>
      </footer>

      <AiTutorModal
        isOpen={aiTutorOpen}
        onToggle={() => setAiTutorOpen(!aiTutorOpen)}
        currentChapterTitle={activeChapter?.title}
      />
    </div>
  );
};
export default App;