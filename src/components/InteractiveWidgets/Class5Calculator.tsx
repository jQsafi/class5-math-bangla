import React, { useState } from 'react';
import { englishToBanglaDigits, banglaToEnglishDigits } from '../../utils/banglaUtils';

export const Class5Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevVal, setPrevVal] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [resetNext, setResetNext] = useState(false);

  const handleBtn = (val: string) => {
    if (val === 'AC') {
      setDisplay('0');
      setPrevVal(null);
      setOperation(null);
      setResetNext(false);
    } else if (val === 'C') {
      setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
    } else if (['+', '-', '×', '÷'].includes(val)) {
      const current = parseFloat(banglaToEnglishDigits(display)) || 0;
      setPrevVal(current);
      setOperation(val);
      setResetNext(true);
    } else if (val === '=') {
      if (prevVal !== null && operation) {
        const current = parseFloat(banglaToEnglishDigits(display)) || 0;
        let result = 0;
        if (operation === '+') result = prevVal + current;
        else if (operation === '-') result = prevVal - current;
        else if (operation === '×') result = prevVal * current;
        else if (operation === '÷') result = current !== 0 ? prevVal / current : 0;
        const rounded = Math.round(result * 10000) / 10000;
        setDisplay(englishToBanglaDigits(rounded.toString()));
        setPrevVal(null);
        setOperation(null);
        setResetNext(true);
      }
    } else {
      if (display === '0' || resetNext) {
        setDisplay(val);
        setResetNext(false);
      } else {
        setDisplay(display + val);
      }
    }
  };

  return (
    <div className='max-w-xs mx-auto bg-slate-900 rounded-3xl p-5 shadow-xl border-4 border-slate-700 text-white'>
      <div className='text-right text-xs text-slate-400 h-5 overflow-hidden font-mono'>
        {prevVal !== null && operation ? (englishToBanglaDigits(prevVal) + ' ' + operation) : ''}
      </div>
      <div className='text-right text-3xl font-black text-emerald-400 font-mono my-2 py-2 px-3 bg-slate-800 rounded-xl overflow-x-auto'>
        {display}
      </div>
      <div className='grid grid-cols-4 gap-2 pt-2'>
        {['AC', 'C', '÷', '×', '৭', '৮', '৯', '-', '৪', '৫', '৬', '+', '১', '২', '৩', '=', '০', '০০', '.'].map((b, i) => (
          <button
            key={i}
            onClick={() => handleBtn(b)}
            className={'h-12 rounded-xl font-bold text-base transition-all active:scale-95 ' + (b === '=' ? 'col-span-2 bg-emerald-500 text-slate-950 font-black' : (['AC', 'C'].includes(b) ? 'bg-rose-600 text-white' : (['+', '-', '×', '÷'].includes(b) ? 'bg-amber-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-white')))}
          >
            {b}
          </button>
        ))}
      </div>
    </div>
  );
};