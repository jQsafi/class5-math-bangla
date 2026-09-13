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
          {/* Main Face Gradient: Cheerful Emerald Teal */}
          <linearGradient id='buddyFaceGrad' x1='15' y1='15' x2='85' y2='85' gradientUnits='userSpaceOnUse'>
            <stop offset='0%' stopColor='#34D399' />
            <stop offset='50%' stopColor='#10B981' />
            <stop offset='100%' stopColor='#059669' />
          </linearGradient>

          {/* Ears Gradient */}
          <linearGradient id='buddyEarGrad' x1='0' y1='0' x2='1' y2='1'>
            <stop offset='0%' stopColor='#6EE7B7' />
            <stop offset='100%' stopColor='#047857' />
          </linearGradient>

          {/* Glasses Gold Metallic */}
          <linearGradient id='buddyGlassesGrad' x1='20' y1='40' x2='80' y2='60' gradientUnits='userSpaceOnUse'>
            <stop offset='0%' stopColor='#FDE047' />
            <stop offset='100%' stopColor='#D97706' />
          </linearGradient>

          {/* Cap Gradient */}
          <linearGradient id='buddyCapGrad' x1='25' y1='10' x2='75' y2='25' gradientUnits='userSpaceOnUse'>
            <stop offset='0%' stopColor='#6366F1' />
            <stop offset='100%' stopColor='#4338CA' />
          </linearGradient>

          {/* Glow filter for antennae */}
          <filter id='starGlow' x='-20%' y='-20%' width='140%' height='140%'>
            <feGaussianBlur stdDeviation='2' result='blur' />
            <feComposite in='SourceGraphic' in2='blur' operator='over' />
          </filter>
        </defs>

        {/* 1. Left & Right Math Ears (Speaker dials with + and -) */}
        {/* Left Ear with + */}
        <circle cx='15' cy='52' r='11' fill='url(#buddyEarGrad)' stroke='#065F46' strokeWidth='2.5' />
        <circle cx='15' cy='52' r='7' fill='#047857' />
        <path d='M12 52H18M15 49V55' stroke='#A7F3D0' strokeWidth='2' strokeLinecap='round' />

        {/* Right Ear with - */}
        <circle cx='85' cy='52' r='11' fill='url(#buddyEarGrad)' stroke='#065F46' strokeWidth='2.5' />
        <circle cx='85' cy='52' r='7' fill='#047857' />
        <path d='M82 52H88' stroke='#A7F3D0' strokeWidth='2' strokeLinecap='round' />

        {/* 2. Antenna with Spring and Glowing Math Star */}
        <path
          d='M50 22 C48 16, 56 12, 48 8 C44 5, 52 2, 50 -1'
          stroke='#F59E0B'
          strokeWidth='3.5'
          strokeLinecap='round'
          fill='none'
        />
        {/* Glowing Star/Lightbulb at top */}
        <g transform='translate(50, -2)' filter='url(#starGlow)'>
          <polygon
            points='0,-7 2,-2 7,0 2,2 0,7 -2,2 -7,0 -2,-2'
            fill='#FBBF24'
            stroke='#D97706'
            strokeWidth='1'
          />
          <circle cx='0' cy='0' r='2' fill='#FEF08A' />
        </g>

        {/* 3. Main Head Shape (Friendly Squircle Robot) */}
        <rect
          x='16'
          y='20'
          width='68'
          height='62'
          rx='26'
          fill='url(#buddyFaceGrad)'
          stroke='#047857'
          strokeWidth='3'
        />

        {/* Head Highlight / Shine at top-left */}
        <path
          d='M27 26 C38 23, 62 23, 73 26 C68 28, 32 28, 27 26 Z'
          fill='#FFFFFF'
          fillOpacity='0.4'
        />

        {/* 4. Little Math Genius Mortarboard Cap (tilted playfully) */}
        <g transform='rotate(-12 50 18) translate(3, 0)'>
          {/* Cap Diamond */}
          <polygon
            points='50,6 74,15 50,22 26,15'
            fill='url(#buddyCapGrad)'
            stroke='#312E81'
            strokeWidth='1.5'
          />
          {/* Cap Button */}
          <circle cx='50' cy='14' r='2.5' fill='#FBBF24' />
          {/* Tassel */}
          <path
            d='M50 14 Q65 16 68 25'
            stroke='#FBBF24'
            strokeWidth='1.8'
            fill='none'
            strokeLinecap='round'
          />
          {/* Tassel end puff */}
          <circle cx='68' cy='25' r='2' fill='#D97706' />
        </g>

        {/* 5. Rosy Cheeks (Super Cute & Friendly) */}
        <ellipse cx='27' cy='63' rx='5.5' ry='3.5' fill='#F43F5E' fillOpacity='0.45' />
        <ellipse cx='73' cy='63' rx='5.5' ry='3.5' fill='#F43F5E' fillOpacity='0.45' />

        {/* 6. Big Funny Geeky Glasses */}
        {/* Left Rim */}
        <circle
          cx='37'
          cy='48'
          r='13.5'
          fill='#FFFFFF'
          fillOpacity='0.3'
          stroke='url(#buddyGlassesGrad)'
          strokeWidth='3'
        />
        {/* Right Rim */}
        <circle
          cx='63'
          cy='48'
          r='13.5'
          fill='#FFFFFF'
          fillOpacity='0.3'
          stroke='url(#buddyGlassesGrad)'
          strokeWidth='3'
        />
        {/* Bridge */}
        <path
          d='M48 47 Q50 44 52 47'
          stroke='url(#buddyGlassesGrad)'
          strokeWidth='3.2'
          strokeLinecap='round'
          fill='none'
        />

        {/* Glasses Temple arms */}
        <path d='M24 48 L17 49' stroke='url(#buddyGlassesGrad)' strokeWidth='2.5' strokeLinecap='round' />
        <path d='M76 48 L83 49' stroke='url(#buddyGlassesGrad)' strokeWidth='2.5' strokeLinecap='round' />

        {/* 7. Eyes based on Mood */}
        {mood === 'wink' ? (
          <>
            {/* Left Eye: Big Sparkling Star */}
            <circle cx='37' cy='48' r='7' fill='#1E293B' />
            <circle cx='35' cy='46' r='2.5' fill='#FFFFFF' />
            <circle cx='39' cy='50' r='1.2' fill='#FFFFFF' />
            {/* Right Eye: Cute Wink Curve */}
            <path
              d='M57 48 Q63 42 69 48'
              stroke='#1E293B'
              strokeWidth='3'
              strokeLinecap='round'
              fill='none'
            />
          </>
        ) : mood === 'thinking' ? (
          <>
            {/* Thinking Eyebrows */}
            <path d='M30 38 Q37 34 44 38' stroke='#065F46' strokeWidth='2.5' strokeLinecap='round' fill='none' />
            <path d='M56 36 Q63 40 70 36' stroke='#065F46' strokeWidth='2.5' strokeLinecap='round' fill='none' />

            {/* Left Eye Looking Up */}
            <circle cx='37' cy='48' r='7' fill='#1E293B' />
            <circle cx='37' cy='45' r='2.5' fill='#38BDF8' />
            <circle cx='36' cy='44' r='1' fill='#FFFFFF' />

            {/* Right Eye Looking Up */}
            <circle cx='63' cy='48' r='7' fill='#1E293B' />
            <circle cx='63' cy='45' r='2.5' fill='#38BDF8' />
            <circle cx='62' cy='44' r='1' fill='#FFFFFF' />
          </>
        ) : (
          /* Happy / Excited Eyes: Big Anime Sparkle */
          <>
            {/* Left Eye */}
            <circle cx='37' cy='48' r='7.5' fill='#0F172A' />
            <circle cx='35' cy='46' r='3' fill='#FFFFFF' />
            <circle cx='39.5' cy='51' r='1.5' fill='#38BDF8' />

            {/* Right Eye */}
            <circle cx='63' cy='48' r='7.5' fill='#0F172A' />
            <circle cx='61' cy='46' r='3' fill='#FFFFFF' />
            <circle cx='65.5' cy='51' r='1.5' fill='#38BDF8' />
          </>
        )}

        {/* 8. Mouth (Playful, Cute Open Smile) */}
        {mood === 'thinking' ? (
          /* Quirky tilted smirk */
          <path
            d='M45 66 Q52 69 57 65'
            stroke='#064E3B'
            strokeWidth='3'
            strokeLinecap='round'
            fill='none'
          />
        ) : (
          /* Big Happy Open Mouth with Tongue */
          <g>
            <path
              d='M39 63 Q50 77 61 63 Z'
              fill='#881337'
              stroke='#4C0519'
              strokeWidth='1.5'
            />
            {/* Pink Tongue */}
            <path
              d='M43 68 Q50 63 57 68 Q50 77 43 68 Z'
              fill='#FB7185'
            />
            {/* Cute Top Teeth Bar */}
            <path
              d='M42 63.5 Q50 65 58 63.5'
              stroke='#FFFFFF'
              strokeWidth='1.8'
              strokeLinecap='round'
            />
          </g>
        )}

        {/* 9. Bow Tie with Multiplication '×' */}
        <g transform='translate(50, 83)'>
          {/* Bow left wing */}
          <polygon points='0,0 -11,-6 -11,6' fill='#EF4444' stroke='#991B1B' strokeWidth='1.2' />
          {/* Bow right wing */}
          <polygon points='0,0 11,-6 11,6' fill='#EF4444' stroke='#991B1B' strokeWidth='1.2' />
          {/* Center Knot with little × */}
          <circle cx='0' cy='0' r='4' fill='#FDE047' stroke='#D97706' strokeWidth='1' />
          <path d='M-1.8 -1.8 L1.8 1.8 M-1.8 1.8 L1.8 -1.8' stroke='#92400E' strokeWidth='1' strokeLinecap='round' />
        </g>
      </svg>
    </div>
  );
};
