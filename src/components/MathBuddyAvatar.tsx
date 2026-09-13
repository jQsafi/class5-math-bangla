import React from 'react';

export type BuddyMood = 'happy' | 'thinking' | 'wink' | 'excited';

interface MathBuddyAvatarProps {
  mood?: BuddyMood;
  size?: number | string;
  className?: string;
  animated?: boolean;
}

export const MathBuddyAvatar: React.FC<MathBuddyAvatarProps> = ({
  mood = 'happy',
  size = 40,
  className = '',
  animated = false,
}) => {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;

  return (
    <div
      style={{ width: pixelSize, height: pixelSize }}
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${
        animated ? 'transition-transform hover:scale-110 active:rotate-6' : ''
      } ${className}`}
      title='গণিত বন্ধু'
    >
      <svg
        viewBox='0 0 100 100'
        className='w-full h-full drop-shadow-md overflow-visible'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <defs>
          <radialGradient id='owlBodyGrad' cx='50%' cy='45%' r='55%'>
            <stop offset='0%' stopColor='#FDE68A' />
            <stop offset='60%' stopColor='#FBBF24' />
            <stop offset='100%' stopColor='#F59E0B' />
          </radialGradient>
          <linearGradient id='owlWingL' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0%' stopColor='#C084FC' />
            <stop offset='100%' stopColor='#7C3AED' />
          </linearGradient>
          <linearGradient id='owlWingR' x1='1' y1='0' x2='0' y2='1'>
            <stop offset='0%' stopColor='#F472B6' />
            <stop offset='100%' stopColor='#DB2777' />
          </linearGradient>
          <radialGradient id='owlTummyGrad' cx='50%' cy='40%' r='55%'>
            <stop offset='0%' stopColor='#FEF9C3' />
            <stop offset='100%' stopColor='#FEF08A' />
          </radialGradient>
          <linearGradient id='capGrad' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0%' stopColor='#818CF8' />
            <stop offset='100%' stopColor='#4338CA' />
          </linearGradient>
          <filter id='glow' x='-30%' y='-30%' width='160%' height='160%'>
            <feGaussianBlur stdDeviation='2.5' result='blur' />
            <feComposite in='SourceGraphic' in2='blur' operator='over' />
          </filter>
        </defs>

        {/* Wings behind body */}
        <ellipse cx='18' cy='62' rx='14' ry='20' fill='url(#owlWingL)'
          stroke='#6D28D9' strokeWidth='1.5' transform='rotate(-20 18 62)' />
        <path d='M10 55 Q14 65 11 75' stroke='#A855F7' strokeWidth='1.5' strokeLinecap='round' fill='none' />
        <path d='M15 53 Q19 64 16 74' stroke='#A855F7' strokeWidth='1.5' strokeLinecap='round' fill='none' />
        <ellipse cx='82' cy='62' rx='14' ry='20' fill='url(#owlWingR)'
          stroke='#BE185D' strokeWidth='1.5' transform='rotate(20 82 62)' />
        <path d='M90 55 Q86 65 89 75' stroke='#F9A8D4' strokeWidth='1.5' strokeLinecap='round' fill='none' />
        <path d='M85 53 Q81 64 84 74' stroke='#F9A8D4' strokeWidth='1.5' strokeLinecap='round' fill='none' />

        {/* Main Body */}
        <ellipse cx='50' cy='64' rx='28' ry='30' fill='url(#owlBodyGrad)' stroke='#D97706' strokeWidth='2.5' />
        {/* Tummy */}
        <ellipse cx='50' cy='70' rx='17' ry='18' fill='url(#owlTummyGrad)' stroke='#FCD34D' strokeWidth='1.5' />
        <text x='43' y='67' fontSize='7' fontWeight='bold' fill='#B45309' fontFamily='monospace'>÷×</text>
        <text x='43' y='76' fontSize='7' fontWeight='bold' fill='#B45309' fontFamily='monospace'>+=</text>

        {/* Head */}
        <circle cx='50' cy='36' r='26' fill='url(#owlBodyGrad)' stroke='#D97706' strokeWidth='2.5' />
        {/* Ear tufts */}
        <path d='M30 14 Q26 5 33 10 Q34 4 37 12' fill='#F59E0B' stroke='#D97706' strokeWidth='1.2' />
        <path d='M70 14 Q74 5 67 10 Q66 4 63 12' fill='#F59E0B' stroke='#D97706' strokeWidth='1.2' />

        {/* Mortarboard Cap */}
        <g transform='rotate(-8 50 20)'>
          <rect x='28' y='22' width='44' height='6' rx='3' fill='url(#capGrad)' stroke='#312E81' strokeWidth='1.2' />
          <polygon points='50,8 72,20 50,24 28,20' fill='url(#capGrad)' stroke='#312E81' strokeWidth='1.2' />
          <circle cx='50' cy='16' r='2.5' fill='#FCD34D' />
          <path d='M50 16 Q62 18 65 28' stroke='#FCD34D' strokeWidth='2' fill='none' strokeLinecap='round' />
          <circle cx='65' cy='28' r='2.5' fill='#F59E0B' />
        </g>

        {/* Eye rings */}
        <circle cx='37' cy='38' r='13' fill='white' stroke='#FB923C' strokeWidth='2.5' />
        <circle cx='63' cy='38' r='13' fill='white' stroke='#34D399' strokeWidth='2.5' />

        {/* Eyes by mood */}
        {mood === 'thinking' ? (
          <>
            <path d='M29 28 Q37 24 45 28' stroke='#78350F' strokeWidth='2' strokeLinecap='round' fill='none' />
            <path d='M55 26 Q63 30 71 26' stroke='#78350F' strokeWidth='2' strokeLinecap='round' fill='none' />
            <circle cx='37' cy='39' r='7.5' fill='#1E293B' />
            <circle cx='35' cy='36.5' r='2.8' fill='white' />
            <circle cx='37' cy='42' r='1.2' fill='#38BDF8' />
            <circle cx='63' cy='39' r='7.5' fill='#1E293B' />
            <circle cx='61' cy='36.5' r='2.8' fill='white' />
            <circle cx='63' cy='42' r='1.2' fill='#38BDF8' />
          </>
        ) : mood === 'wink' ? (
          <>
            <circle cx='37' cy='38' r='7.5' fill='#1E293B' />
            <circle cx='35' cy='36' r='3' fill='white' />
            <circle cx='39' cy='41' r='1.5' fill='#38BDF8' />
            <path d='M54 38 Q63 32 72 38' stroke='#1E293B' strokeWidth='3' strokeLinecap='round' fill='none' />
          </>
        ) : (
          <>
            <circle cx='37' cy='38' r='8' fill='#0F172A' />
            <circle cx='34.5' cy='35.5' r='3.2' fill='white' />
            <circle cx='40' cy='42' r='1.8' fill='#38BDF8' />
            <circle cx='63' cy='38' r='8' fill='#0F172A' />
            <circle cx='60.5' cy='35.5' r='3.2' fill='white' />
            <circle cx='66' cy='42' r='1.8' fill='#F472B6' />
          </>
        )}

        {/* Rosy cheeks */}
        <ellipse cx='26' cy='46' rx='6' ry='4' fill='#F43F5E' fillOpacity='0.4' />
        <ellipse cx='74' cy='46' rx='6' ry='4' fill='#F43F5E' fillOpacity='0.4' />

        {/* Beak */}
        <path d='M44 48 L50 56 L56 48 Z' fill='#FB923C' stroke='#EA580C' strokeWidth='1.5' strokeLinejoin='round' />

        {/* Smile */}
        {mood === 'thinking' ? (
          <path d='M44 57 Q50 62 56 57' stroke='#EA580C' strokeWidth='2.5' strokeLinecap='round' fill='none' />
        ) : (
          <path d='M42 58 Q50 67 58 58' stroke='#EA580C' strokeWidth='2.5' strokeLinecap='round' fill='none' />
        )}

        {/* Sparkle dots */}
        <g filter='url(#glow)'>
          <circle cx='16' cy='18' r='3' fill='#FBBF24' opacity='0.9' />
          <circle cx='84' cy='18' r='3' fill='#34D399' opacity='0.9' />
          <circle cx='14' cy='25' r='1.5' fill='#FDE68A' opacity='0.7' />
          <circle cx='86' cy='25' r='1.5' fill='#6EE7B7' opacity='0.7' />
        </g>

        {/* Feet */}
        <path d='M38 91 L34 97 M38 91 L38 98 M38 91 L42 97' stroke='#F59E0B' strokeWidth='2.5' strokeLinecap='round' />
        <path d='M62 91 L58 97 M62 91 L62 98 M62 91 L66 97' stroke='#F59E0B' strokeWidth='2.5' strokeLinecap='round' />
      </svg>
    </div>
  );
};
