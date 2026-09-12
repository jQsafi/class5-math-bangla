import React, { useState } from 'react';
import { englishToBanglaDigits, banglaToEnglishDigits } from '../../utils/banglaUtils';

export const LcmGcdCalculator: React.FC = () => {
  const [num1, setNum1] = useState('12');
  const [num2, setNum2] = useState('18');
  const [result, setResult] = useState<{ gcd: number; lcm: number } | null>(null);

  const calcGCD = (a: number, b: number): number => (b === 0 ? a : calcGCD(b, a % b));
  const calcLCM = (a: number, b: number): number => (a * b) / calcGCD(a, b);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const n1 = parseInt(banglaToEnglishDigits(num1)) || 0;
    const n2 = parseInt(banglaToEnglishDigits(num2)) || 0;
    if (n1 > 0 && n2 > 0) {
      const g = calcGCD(n1, n2);
      const l = calcLCM(n1, n2);
      setResult({ gcd: g, lcm: l });
    }
  };

  return (
    <div className='bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6'>
      <div className='border-b border-slate-100 pb-4'>
        <h3 className='text-xl font-bold text-slate-900'>✨ গ.সা.গু ও ল.সা.গু সমাধান ল্যাব</h3>
        <p className='text-sm text-slate-600 mt-1'>যেকোনো দুটি সংখ্যা লিখে তাৎক্ষণিক গ.সা.গু ও ল.সা.গু নির্ণয় করো।</p>
      </div>

      <form onSubmit={handleCalculate} className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        <div>
          <label className='text-xs font-semibold text-slate-600 block mb-1'>প্রথম সংখ্যা</label>
          <input
            type='text'
            value={num1}
            onChange={(e) => setNum1(e.target.value)}
            className='w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 font-bold text-slate-800'
            placeholder='যেমন: ১২'
          />
        </div>
        <div>
          <label className='text-xs font-semibold text-slate-600 block mb-1'>দ্বিতীয় সংখ্যা</label>
          <input
            type='text'
            value={num2}
            onChange={(e) => setNum2(e.target.value)}
            className='w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-purple-500 font-bold text-slate-800'
            placeholder='যেমন: ১৮'
          />
        </div>
        <div className='flex items-end'>
          <button
            type='submit'
            className='w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors shadow-sm'
          >
            হিসাব করো
          </button>
        </div>
      </form>

      {result && (
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-2'>
          <div className='p-4 bg-purple-50 border border-purple-200 rounded-2xl'>
            <span className='text-xs font-bold text-purple-700 block'>গরিষ্ঠ সাধারণ গুণনীয়ক (গ.সা.গু)</span>
            <span className='text-3xl font-black text-purple-950 font-mono mt-2 block'>
              {englishToBanglaDigits(result.gcd)}
            </span>
            <p className='text-xs text-purple-800 mt-2'>উভয় সংখ্যার সাধারণ বৃহত্তম গুণনীয়ক।</p>
          </div>
          <div className='p-4 bg-indigo-50 border border-indigo-200 rounded-2xl'>
            <span className='text-xs font-bold text-indigo-700 block'>লঘিষ্ঠ সাধারণ গুণিতক (ল.সা.গু)</span>
            <span className='text-3xl font-black text-indigo-950 font-mono mt-2 block'>
              {englishToBanglaDigits(result.lcm)}
            </span>
            <p className='text-xs text-indigo-800 mt-2'>উভয় সংখ্যা দিয়ে নিঃশেষে বিভাজ্য ক্ষুদ্রতম সংখ্যা।</p>
          </div>
        </div>
      )}
    </div>
  );
};