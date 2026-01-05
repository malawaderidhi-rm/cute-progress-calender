import React from 'react';

// Pixel Art SVGs as components for easier reuse
const BobaTea = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none">
    {/* Cup */}
    <path d="M7 6H17V20C17 21.1 16.1 22 15 22H9C7.9 22 7 21.1 7 20V6Z" fill="#F4D03F" opacity="0.6"/>
    {/* Straw */}
    <rect x="11" y="2" width="2" height="6" fill="#4A4E69"/>
    {/* Pearls */}
    <circle cx="10" cy="18" r="1.5" fill="#000"/>
    <circle cx="14" cy="18" r="1.5" fill="#000"/>
    <circle cx="12" cy="15" r="1.5" fill="#000"/>
    {/* Lid Line */}
    <path d="M7 6H17" stroke="#4A4E69" strokeWidth="2"/>
    <path d="M7 6V20C7 21.1 7.9 22 9 22H15C16.1 22 17 21.1 17 20V6" stroke="#4A4E69" strokeWidth="2"/>
  </svg>
);

const Bunny = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    {/* Ears */}
    <path d="M7 4V12H11V4H7Z" fill="#FFB7C5" stroke="#4A4E69" strokeWidth="1.5"/>
    <path d="M13 4V12H17V4H13Z" fill="#FFB7C5" stroke="#4A4E69" strokeWidth="1.5"/>
    {/* Head */}
    <rect x="6" y="11" width="12" height="10" rx="4" fill="#FFF" stroke="#4A4E69" strokeWidth="1.5"/>
    {/* Eyes */}
    <rect x="9" y="15" width="2" height="2" fill="#4A4E69"/>
    <rect x="13" y="15" width="2" height="2" fill="#4A4E69"/>
    {/* Mouth */}
    <rect x="11" y="18" width="2" height="1" fill="#FF99C8"/>
  </svg>
);

const Ribbon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M12 12L4 8L4 16L12 12Z" fill="#A0E7E5" stroke="#4A4E69" strokeWidth="1.5"/>
    <path d="M12 12L20 8L20 16L12 12Z" fill="#A0E7E5" stroke="#4A4E69" strokeWidth="1.5"/>
    <rect x="11" y="11" width="2" height="2" fill="#FF69B4" stroke="#4A4E69" strokeWidth="1.5"/>
  </svg>
);

const Heart = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="#FF99C8" opacity="0.4"/>
  </svg>
);

export const BackgroundDecorations = () => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Top Left Area */}
      <BobaTea className="absolute top-10 left-[10%] w-16 h-16 animate-float-slow opacity-80" />
      <Ribbon className="absolute top-32 left-[5%] w-12 h-12 animate-float-reverse opacity-70" />
      
      {/* Top Right Area */}
      <Bunny className="absolute top-12 right-[15%] w-20 h-20 animate-float opacity-80" />
      <Heart className="absolute top-40 right-[8%] w-8 h-8 animate-pulse opacity-60" />
      
      {/* Middle Areas */}
      <BobaTea className="absolute top-1/2 left-[2%] w-12 h-12 animate-float opacity-60" />
      <Ribbon className="absolute top-[60%] right-[3%] w-16 h-16 animate-float-slow opacity-70" />
      
      {/* Bottom Areas */}
      <Bunny className="absolute bottom-20 left-[15%] w-16 h-16 animate-float-reverse opacity-80" />
      <BobaTea className="absolute bottom-32 right-[20%] w-14 h-14 animate-float opacity-70" />
      <Heart className="absolute bottom-10 left-[40%] w-10 h-10 animate-bounce-slow opacity-50" />
      
      {/* Random small sprinkles */}
      <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-yellow-300 rounded-full animate-ping" />
      <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-blue-300 rotate-45 animate-pulse" />
      <div className="absolute top-20 right-1/3 w-2 h-2 bg-pink-300 rounded-full animate-bounce" />
    </div>
  );
};