import React, { useState } from 'react';
import { englishToBanglaDigits } from '../../utils/banglaUtils';

export const FractionVisualizer: React.FC = () => {
  const [numerator1, setNumerator1] = useState(1);
  const [denominator1, setDenominator1] = useState(4);
  const [numerator2, setNumerator2] = useState(2);
  const [denominator2, setDenominator2] = useState(4);

  const renderFractionBar = (num: number, den: number, color: string, label: string) => {
    const safeDen = Math.max(1, den);
    const safeNum = Math.min(num, safeDen);
    return (
      <div className='p-4 bg-slate-50 rounded-2xl border border-slate-200'>
        <div className='flex items-center justify-between mb-2'>
          <span className='font-bold text-slate-700 text-sm'>{label}</span>
          <span className='text-lg font-bold text-slate-900 font-mono'>
            {englishToBanglaDigits(num)} / {englishToBanglaDigits(den)}
          </span>
        </div>
        <div className='w-full h-10 bg-slate-200 rounded-xl overflow-hidden flex border-2 border-slate-300'>
          {Array.from({ length: safeDen }).map((_, i) => (
            <div
              key={i}
              className={'h-full border-r border-slate-300 last:border-r-0 transition-all flex items-center justify-center text-xs font-bold ' + (i < safeNum ? color + ' text-white' : 'bg-slate-100 text-slate-400')}
              style={{ width: (100 / safeDen) + '%' }}
            >
              {englishToBanglaDigits(1)}/{englishToBanglaDigits(safeDen)}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className='bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6'>
      <div className='border-b border-slate-100 pb-4'>
        <h3 className='text-xl font-bold text-slate-900'>🍕 ভগ্নাংশ ভিজ্যুয়ালাইজার (ইন্টারেক্টিভ ভগ্নাংশ বার)</h3>
        <p className='text-sm text-slate-600 mt-1'>লব ও হর পরিবর্তন করে ভগ্নাংশের মান ও তুলনা প্রত্যক্ষ করো।</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Fraction 1 Controls */}
        <div className='space-y-4 p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100'>
          <h4 className='font-bold text-emerald-900'>ভগ্নাংশ ১ নিয়ন্ত্রণ</h4>
          <div>
            <label className='text-xs font-medium text-slate-600 block mb-1'>লব (Numerator): {englishToBanglaDigits(numerator1)}</label>
            <input
              type='range'
              min='1'
              max={denominator1}
              value={numerator1}
              onChange={(e) => setNumerator1(parseInt(e.target.value))}
              className='w-full accent-emerald-600'
            />
          </div>
          <div>
            <label className='text-xs font-medium text-slate-600 block mb-1'>হর (Denominator): {englishToBanglaDigits(denominator1)}</label>
            <input
              type='range'
              min='2'
              max='12'
              value={denominator1}
              onChange={(e) => {
                const d = parseInt(e.target.value);
                setDenominator1(d);
                if (numerator1 > d) setNumerator1(d);
              }}
              className='w-full accent-emerald-600'
            />
          </div>
          {renderFractionBar(numerator1, denominator1, 'bg-emerald-600', 'ভগ্নাংশ ১')}
        </div>

        {/* Fraction 2 Controls */}
        <div className='space-y-4 p-4 rounded-2xl bg-sky-50/50 border border-sky-100'>
          <h4 className='font-bold text-sky-900'>ভগ্নাংশ ২ নিয়ন্ত্রণ</h4>
          <div>
            <label className='text-xs font-medium text-slate-600 block mb-1'>লব (Numerator): {englishToBanglaDigits(numerator2)}</label>
            <input
              type='range'
              min='1'
              max={denominator2}
              value={numerator2}
              onChange={(e) => setNumerator2(parseInt(e.target.value))}
              className='w-full accent-sky-600'
            />
          </div>
          <div>
            <label className='text-xs font-medium text-slate-600 block mb-1'>হর (Denominator): {englishToBanglaDigits(denominator2)}</label>
            <input
              type='range'
              min='2'
              max='12'
              value={denominator2}
              onChange={(e) => {
                const d = parseInt(e.target.value);
                setDenominator2(d);
                if (numerator2 > d) setNumerator2(d);
              }}
              className='w-full accent-sky-600'
            />
          </div>
          {renderFractionBar(numerator2, denominator2, 'bg-sky-600', 'ভগ্নাংশ ২')}
        </div>
      </div>

      {/* Comparison result banner */}
      <div className='p-4 bg-slate-900 text-white rounded-2xl flex items-center justify-between flex-wrap gap-4'>
        <span className='font-medium text-sm md:text-base'>তুলনা ও সম্পর্ক:</span>
        <div className='flex items-center gap-4 text-base md:text-lg font-bold'>
          <span>{englishToBanglaDigits(numerator1)}/{englishToBanglaDigits(denominator1)}</span>
          <span className='px-3 py-1 bg-emerald-500 rounded-lg text-slate-950 font-black text-xl'>
            {numerator1 / denominator1 > numerator2 / denominator2 ? '>' : (numerator1 / denominator1 < numerator2 / denominator2 ? '<' : '=')}
          </span>
          <span>{englishToBanglaDigits(numerator2)}/{englishToBanglaDigits(denominator2)}</span>
        </div>
      </div>
    </div>
  );
};