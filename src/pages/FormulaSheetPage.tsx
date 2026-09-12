import React, { useState } from 'react';
import { formulasData } from '../data/formulasData';
import { Search, Printer, BookMarked } from 'lucide-react';

export const FormulaSheetPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('all');

  const categories = Array.from(new Set(formulasData.map(f => f.category)));

  const filtered = formulasData.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.formula.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCat === 'all' || f.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8'>
      <div className='flex items-center justify-between border-b border-slate-200 pb-6 flex-wrap gap-4'>
        <div>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2'>
            <BookMarked className='w-4 h-4' /> ৫ম শ্রেণি গণিত সূত্র ভাণ্ডার
          </div>
          <h1 className='text-2xl md:text-4xl font-black text-slate-900'>সকল গাণিতিক সূত্রমালা ও নিয়মাবলী</h1>
          <p className='text-slate-600 text-xs md:text-sm mt-1'>পরীক্ষার প্রস্তুতি ও দ্রুত রিভিশনের জন্য প্রয়োজনীয় সূত্র তালিকা।</p>
        </div>
        <button
          onClick={() => window.print()}
          className='no-print flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold text-xs md:text-sm shadow-md'
        >
          <Printer className='w-4 h-4' />
          প্রিন্ট করো
        </button>
      </div>

      {/* Search & Filter Controls */}
      <div className='no-print flex flex-col md:flex-row gap-4'>
        <div className='relative flex-1'>
          <Search className='w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2' />
          <input
            type='text'
            placeholder='নির্দিষ্ট সূত্র খুঁজুন (যেমন: মুনাফা, ক্ষেত্রফল, লসাগু)...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-9 pr-4 py-2.5 bg-white rounded-2xl text-xs md:text-sm border border-slate-300 focus:ring-2 focus:ring-emerald-500 outline-none'
          />
        </div>
        <select
          value={selectedCat}
          onChange={(e) => setSelectedCat(e.target.value)}
          className='px-4 py-2.5 bg-white rounded-2xl text-xs md:text-sm border border-slate-300 font-semibold text-slate-700 outline-none'
        >
          <option value='all'>সকল বিভাগ</option>
          {categories.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Formulas Grid */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
        {filtered.map((item, idx) => (
          <div key={idx} className='bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-3 hover:border-emerald-500/50 transition-all'>
            <div className='flex items-center justify-between'>
              <span className='px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold'>
                {item.category}
              </span>
            </div>
            <h3 className='text-base font-bold text-slate-900'>{item.name}</h3>
            <div className='p-3 bg-emerald-50 border border-emerald-200/60 rounded-2xl font-mono text-emerald-950 font-bold text-sm md:text-base'>
              {item.formula}
            </div>
            <div className='text-xs text-slate-600'>
              <strong>উদাহরণ: </strong>{item.example}
            </div>
            {item.notes && (
              <div className='text-[11px] text-slate-500'>
                ℹ️ {item.notes}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};