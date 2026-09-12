import React, { useState, useEffect } from 'react';
import { chaptersData } from './data/chaptersData';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { HomePage } from './pages/HomePage';
import { ChapterPage } from './pages/ChapterPage';
import { FormulaSheetPage } from './pages/FormulaSheetPage';
import { PracticePage } from './pages/PracticePage';

export const App: React.FC = () => {
  const [activeChapterId, setActiveChapterId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'chapter' | 'formulas' | 'practice'>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
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
    </div>
  );
};
export default App;