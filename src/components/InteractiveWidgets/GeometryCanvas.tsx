import React, { useState } from 'react';
import { englishToBanglaDigits } from '../../utils/banglaUtils';

export const GeometryCanvas: React.FC = () => {
  const [selectedShape, setSelectedShape] = useState<'angle' | 'rectangle' | 'square' | 'rhombus' | 'circle'>('angle');
  const [angleVal, setAngleVal] = useState(90);
  const [rectWidth, setRectWidth] = useState(140);
  const [rectHeight, setRectHeight] = useState(80);
  const [circleRadius, setCircleRadius] = useState(50);

  return (
    <div className='bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6'>
      <div className='border-b border-slate-100 pb-4'>
        <h3 className='text-xl font-bold text-slate-900'>📐 ইন্টারেক্টিভ জ্যামিতি ল্যাব</h3>
        <p className='text-sm text-slate-600 mt-1'>কোণ, চতুর্ভুজ ও বৃত্তের আকৃতি পরিবর্তন করে বৈশিষ্ট্য পর্যবেক্ষণ করো।</p>
      </div>

      {/* Shape Selector */}
      <div className='flex flex-wrap gap-2'>
        {[ 
          { id: 'angle', label: 'কোণ পরিমাপ (Angle)' },
          { id: 'rectangle', label: 'আয়তক্ষেত্র (Rectangle)' },
          { id: 'square', label: 'বর্গক্ষেত্র (Square)' },
          { id: 'rhombus', label: 'রম্বস (Rhombus)' },
          { id: 'circle', label: 'বৃত্ত (Circle)' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedShape(item.id as any)}
            className={'px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all ' + (selectedShape === item.id ? 'bg-emerald-600 text-white shadow' : 'bg-slate-100 text-slate-700 hover:bg-slate-200')}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Visual Canvas */}
      <div className='w-full h-72 bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center relative overflow-hidden'>
        {selectedShape === 'angle' && (
          <svg className='w-64 h-64 overflow-visible'>
            <line x1='128' y1='128' x2='230' y2='128' stroke='#1e293b' strokeWidth='4' strokeLinecap='round' />
            <line
              x1='128'
              y1='128'
              x2={128 + 102 * Math.cos((-angleVal * Math.PI) / 180)}
              y2={128 + 102 * Math.sin((-angleVal * Math.PI) / 180)}
              stroke='#059669'
              strokeWidth='4'
              strokeLinecap='round'
            />
            <circle cx='128' cy='128' r='5' fill='#e11d48' />
            <text x='140' y='110' fill='#059669' className='text-sm font-bold font-mono'>
              {englishToBanglaDigits(angleVal)}°
            </text>
          </svg>
        )}

        {selectedShape === 'rectangle' && (
          <div
            className='bg-sky-200/80 border-4 border-sky-600 rounded-lg flex items-center justify-center font-bold text-sky-950 transition-all text-xs md:text-sm'
            style={{ width: rectWidth + 'px', height: rectHeight + 'px' }}
          >
            ক্ষেত্রফল = {englishToBanglaDigits(rectWidth * rectHeight)} বর্গ একক
          </div>
        )}

        {selectedShape === 'square' && (
          <div
            className='bg-emerald-200/80 border-4 border-emerald-600 rounded-lg flex items-center justify-center font-bold text-emerald-950 transition-all text-xs md:text-sm'
            style={{ width: rectHeight + 'px', height: rectHeight + 'px' }}
          >
            বাহু = {englishToBanglaDigits(rectHeight)}
          </div>
        )}

        {selectedShape === 'rhombus' && (
          <div
            className='bg-amber-200/80 border-4 border-amber-600 rounded-lg flex items-center justify-center font-bold text-amber-950 transition-all text-xs'
            style={{ width: '120px', height: '120px', transform: 'skewX(-20deg)' }}
          >
            রম্বস (৪ বাহু সমান)
          </div>
        )}

        {selectedShape === 'circle' && (
          <div
            className='bg-rose-100 border-4 border-rose-500 rounded-full flex flex-col items-center justify-center font-bold text-rose-950 transition-all relative'
            style={{ width: (circleRadius * 2) + 'px', height: (circleRadius * 2) + 'px' }}
          >
            <div className='w-2 h-2 rounded-full bg-rose-600' />
            <span className='text-xs mt-1'>ব্যাসার্ধ (r) = {englishToBanglaDigits(circleRadius)}</span>
            <span className='text-xs font-semibold'>ব্যাস = {englishToBanglaDigits(circleRadius * 2)}</span>
          </div>
        )}
      </div>

      {/* Controls */} 
      <div className='p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3'>
        {selectedShape === 'angle' && (
          <div>
            <div className='flex justify-between text-sm font-semibold text-slate-700 mb-1'>
              <span>কোণের মান: {englishToBanglaDigits(angleVal)}°</span>
              <span className='text-emerald-700 font-bold'>
                {angleVal < 90 ? 'সূক্ষ্মকোণ (<৯০°)' : (angleVal === 90 ? 'সমকোণ (৯০°)' : 'স্থূলকোণ (>৯০°)')}
              </span>
            </div>
            <input
              type='range'
              min='15'
              max='165'
              value={angleVal}
              onChange={(e) => setAngleVal(parseInt(e.target.value))}
              className='w-full accent-emerald-600'
            />
          </div>
        )}
        {selectedShape === 'rectangle' && (
          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='text-xs font-medium text-slate-600 block mb-1'>দৈর্ঘ্য: {englishToBanglaDigits(rectWidth)}</label>
              <input type='range' min='80' max='220' value={rectWidth} onChange={(e) => setRectWidth(parseInt(e.target.value))} className='w-full accent-sky-600' />
            </div>
            <div>
              <label className='text-xs font-medium text-slate-600 block mb-1'>প্রস্থ: {englishToBanglaDigits(rectHeight)}</label>
              <input type='range' min='40' max='140' value={rectHeight} onChange={(e) => setRectHeight(parseInt(e.target.value))} className='w-full accent-sky-600' />
            </div>
          </div>
        )}
        {selectedShape === 'circle' && (
          <div>
            <label className='text-xs font-medium text-slate-600 block mb-1'>ব্যাসার্ধ (Radius): {englishToBanglaDigits(circleRadius)} একক</label>
            <input type='range' min='30' max='85' value={circleRadius} onChange={(e) => setCircleRadius(parseInt(e.target.value))} className='w-full accent-rose-600' />
          </div>
        )}
      </div>
    </div>
  );
};