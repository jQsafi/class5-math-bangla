import React, { useState } from 'react';
import { englishToBanglaDigits, banglaToEnglishDigits } from '../../utils/banglaUtils';

export const UnitTimeConverter: React.FC = () => {
  const [kmVal, setKmVal] = useState('২.৫');
  const [kgVal, setKgVal] = useState('৫');
  const [hour12, setHour12] = useState('৮:৩০ PM');

  const km = parseFloat(banglaToEnglishDigits(kmVal)) || 0;
  const kg = parseFloat(banglaToEnglishDigits(kgVal)) || 0;

  return (
    <div className='bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6'>
      <div className='border-b border-slate-100 pb-4'>
        <h3 className='text-xl font-bold text-slate-900'>⏱️ পরিমাপ ও সময় রূপান্তরকারী</h3>
        <p className='text-sm text-slate-600 mt-1'>দৈর্ঘ্য, ওজন ও ১২/২৪ ঘণ্টার সময়সূচির তাৎক্ষণিক রূপান্তর।</p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Length Converter */}
        <div className='p-4 rounded-2xl bg-cyan-50/70 border border-cyan-200 space-y-3'>
          <h4 className='font-bold text-cyan-950'>📏 দৈর্ঘ্য রূপান্তর (কিমি ➔ মিটার ➔ সেমি)</h4>
          <input
            type='text'
            value={kmVal}
            onChange={(e) => setKmVal(e.target.value)}
            className='w-full px-3 py-2 rounded-xl border border-cyan-300 bg-white font-bold'
            placeholder='কিলোমিটার লিখুন'
          />
          <div className='space-y-1 text-sm text-cyan-900 font-medium'>
            <div>= <strong>{englishToBanglaDigits(km * 1000)}</strong> মিটার</div>
            <div>= <strong>{englishToBanglaDigits(km * 100000)}</strong> সেন্টিমিটার</div>
          </div>
        </div>

        {/* Weight Converter */}
        <div className='p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3'>
          <h4 className='font-bold text-amber-950'>⚖️ ওজন রূপান্তর (কেজি ➔ গ্রাম ➔ মেট্রিক টন)</h4>
          <input
            type='text'
            value={kgVal}
            onChange={(e) => setKgVal(e.target.value)}
            className='w-full px-3 py-2 rounded-xl border border-amber-300 bg-white font-bold'
            placeholder='কেজি লিখুন'
          />
          <div className='space-y-1 text-sm text-amber-900 font-medium'>
            <div>= <strong>{englishToBanglaDigits(kg * 1000)}</strong> গ্রাম</div>
            <div>= <strong>{englishToBanglaDigits(kg / 1000)}</strong> মেট্রিক টন</div>
          </div>
        </div>
      </div>
    </div>
  );
};