import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, Sparkles } from 'lucide-react';
import { englishToBanglaDigits, banglaToEnglishDigits } from '../utils/banglaUtils';
import confetti from 'canvas-confetti';

export const PracticePage: React.FC = () => {
  const generateProblem = () => {
    const types = ['add', 'sub', 'mul', 'avg', 'pct'];
    const t = types[Math.floor(Math.random() * types.length)];
    if (t === 'add') {
      const a = Math.floor(Math.random() * 800) + 100;
      const b = Math.floor(Math.random() * 800) + 100;
      return { q: englishToBanglaDigits(a) + ' + ' + englishToBanglaDigits(b) + ' = ?', ans: (a + b).toString(), hint: 'একক ও দশকের সংখ্যাগুলো পরপর যোগ করো।' };
    } else if (t === 'sub') {
      const a = Math.floor(Math.random() * 900) + 200;
      const b = Math.floor(Math.random() * a);
      return { q: englishToBanglaDigits(a) + ' - ' + englishToBanglaDigits(b) + ' = ?', ans: (a - b).toString(), hint: 'বিয়োগ প্রক্রিয়া সম্পন্ন করো।' };
    } else if (t === 'mul') {
      const a = Math.floor(Math.random() * 50) + 10;
      const b = Math.floor(Math.random() * 20) + 2;
      return { q: englishToBanglaDigits(a) + ' × ' + englishToBanglaDigits(b) + ' = ?', ans: (a * b).toString(), hint: 'নামতা ও গুণন প্রক্রিয়া অনুসরণ করো।' };
    } else if (t === 'avg') {
      const a = 20, b = 40, c = 60;
      return { q: englishToBanglaDigits(a) + ', ' + englishToBanglaDigits(b) + ' এবং ' + englishToBanglaDigits(c) + ' এর গড় কত?', ans: '40', hint: 'তিনটি সংখ্যা যোগ করে ৩ দিয়ে ভাগ করো।' };
    } else {
      return { q: '২০০ টাকার ২৫% = কত টাকা?', ans: '50', hint: '(২০০ × ২৫) ÷ ১০০ হিসাব করো।' };
    }
  };

  const [currentProblem, setCurrentProblem] = useState(generateProblem());
  const [inputVal, setInputVal] = useState('');
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [score, setScore] = useState(0);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const userNorm = banglaToEnglishDigits(inputVal).trim();
    if (userNorm === currentProblem.ans) {
      setStatus('correct');
      setScore(score + 1);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } else {
      setStatus('wrong');
    }
  };

  const handleNext = () => {
    setCurrentProblem(generateProblem());
    setInputVal('');
    setStatus('idle');
  };

  return (
    <div className='max-w-2xl mx-auto px-4 py-12 space-y-8'>
      <div className='bg-white rounded-3xl border border-slate-200 p-8 shadow-md text-center space-y-6'>
        <div className='flex items-center justify-between'>
          <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-bold text-xs'>
            <Sparkles className='w-4 h-4 text-amber-600' /> গতিশীল অনুশীলন ড্রিল
          </div>
          <span className='font-bold text-slate-700 text-sm'>
            স্কোর: <strong className='text-emerald-600 font-mono'>{englishToBanglaDigits(score)}</strong>
          </span>
        </div>

        <div className='py-6'>
          <span className='text-xs font-bold text-slate-400 block uppercase tracking-wider mb-2'>সমস্যাটি সমাধান করো</span>
          <div className='text-3xl md:text-5xl font-black text-slate-900 font-mono'>
            {currentProblem.q}
          </div>
        </div>

        <form onSubmit={handleCheck} className='flex gap-2 max-w-sm mx-auto'>
          <input
            type='text'
            placeholder='তোমার উত্তর...'
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className='flex-1 px-4 py-3 rounded-2xl border border-slate-300 font-bold text-center text-lg focus:ring-2 focus:ring-emerald-500 outline-none'
          />
          <button
            type='submit'
            className='px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all shadow-sm'
          >
            যাচাই
          </button>
        </form>

        {status === 'correct' && (
          <div className='p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-900 font-bold flex items-center justify-center gap-2'>
            <CheckCircle2 className='w-5 h-5 text-emerald-600' /> সাবাশ! সঠিক উত্তর হয়েছে 🎉
          </div>
        )}
        {status === 'wrong' && (
          <div className='p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-sm'>
            ভুল হয়েছে! সংকেত: {currentProblem.hint}
          </div>
        )}

        <div className='pt-2'>
          <button
            onClick={handleNext}
            className='flex items-center gap-2 px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-bold text-sm mx-auto'
          >
            <RotateCcw className='w-4 h-4' />
            পরবর্তী নতুন সমস্যা
          </button>
        </div>
      </div>
    </div>
  );
};