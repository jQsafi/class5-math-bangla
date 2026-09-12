import React, { useState } from 'react';
import { englishToBanglaDigits } from '../../utils/banglaUtils';

export const BarChartBuilder: React.FC = () => {
  const [data, setData] = useState([
    { label: 'ক শাখা', count: 40, color: 'bg-emerald-500' },
    { label: 'খ শাখা', count: 45, color: 'bg-sky-500' },
    { label: 'গ শাখা', count: 35, color: 'bg-amber-500' },
    { label: 'ঘ শাখা', count: 30, color: 'bg-rose-500' },
  ]);

  const maxCount = Math.max(...data.map(d => d.count), 50);

  return (
    <div className='bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6'>
      <div className='border-b border-slate-100 pb-4'>
        <h3 className='text-xl font-bold text-slate-900'>📊 স্তম্ভলেখ (Bar Chart) নির্মাতা</h3>
        <p className='text-sm text-slate-600 mt-1'>শাখাভিত্তিক শিক্ষার্থীর সংখ্যা পরিবর্তন করে স্তম্ভলেখ পর্যবেক্ষণ করো।</p>
      </div>

      {/* Bar Chart Display */}
      <div className='h-64 bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-end justify-around gap-4 pt-8'>
        {data.map((item, idx) => (
          <div key={idx} className='flex-1 flex flex-col items-center h-full justify-end group'>
            <span className='text-xs font-bold text-slate-700 mb-1 group-hover:scale-110 transition-transform'>
              {englishToBanglaDigits(item.count)}
            </span>
            <div
              className={'w-full max-w-[60px] rounded-t-xl transition-all ' + item.color}
              style={{ height: (item.count / maxCount) * 80 + '%' }}
            />
            <span className='text-xs font-semibold text-slate-600 mt-2'>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Data Sliders */}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {data.map((item, idx) => (
          <div key={idx} className='p-3 bg-slate-50 rounded-xl border border-slate-200'>
            <label className='text-xs font-bold text-slate-700 block mb-1'>{item.label}</label>
            <input
              type='range'
              min='10'
              max='60'
              value={item.count}
              onChange={(e) => { 
                const val = parseInt(e.target.value);
                setData(prev => prev.map((d, i) => i === idx ? { ...d, count: val } : d));
              }}
              className='w-full accent-purple-600'
            />
          </div>
        ))}
      </div>
    </div>
  );
};