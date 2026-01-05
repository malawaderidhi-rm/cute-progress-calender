import React, { useState, useEffect } from 'react';
import { MascotState } from '../types';

interface MascotProps {
  message: string;
  className?: string;
  customization?: MascotState;
}

export const Mascot: React.FC<MascotProps> = ({ 
  message, 
  className = '',
  customization = {
    hairColor: '#FF69B4',
    outfitColor: '#D0A9F5',
    skinColor: '#FFE0BD',
    accessory: 'bow',
    accessoryColor: '#D0A9F5'
  }
}) => {
  const { hairColor, outfitColor, skinColor, accessory, accessoryColor } = customization;
  const [isBlinking, setIsBlinking] = useState(false);
  const [lookOffset, setLookOffset] = useState(0);
  const [isWaving, setIsWaving] = useState(false);
  const [waveFrame, setWaveFrame] = useState(0);

  // Blinking Loop
  useEffect(() => {
    let timeoutId: any;
    const blink = () => {
      setIsBlinking(true);
      setTimeout(() => {
        setIsBlinking(false);
        timeoutId = setTimeout(blink, Math.random() * 3000 + 2000);
      }, 150);
    };
    timeoutId = setTimeout(blink, 2000);
    return () => clearTimeout(timeoutId);
  }, []);

  // Idle Behavior Loop (Wave & Look)
  useEffect(() => {
    const triggerBehavior = () => {
       const roll = Math.random();
       if (roll < 0.35) {
           // Look Around
           setLookOffset(-2);
           setTimeout(() => setLookOffset(2), 800);
           setTimeout(() => setLookOffset(0), 1600);
       } else if (roll < 0.6) {
           // Wave
           setIsWaving(true);
           setTimeout(() => setIsWaving(false), 2400);
       }
    };

    const interval = setInterval(triggerBehavior, 7000); // Check every 7s
    return () => clearInterval(interval);
  }, []);

  // Waving Animation Frame Toggle
  useEffect(() => {
      if (isWaving) {
          const interval = setInterval(() => {
              setWaveFrame(prev => prev === 0 ? 1 : 0);
          }, 250); // Fast toggle for waving
          return () => clearInterval(interval);
      } else {
          setWaveFrame(0);
      }
  }, [isWaving]);

  return (
    <div className={`flex flex-col items-center ${className}`}>
       {/* Speech Bubble */}
       <div className="relative bg-white border-2 border-anime-text p-4 rounded-2xl mb-4 shadow-pixel text-center max-w-[240px] animate-float z-10 transition-transform duration-300">
          <p className="font-retro text-xl leading-tight text-anime-text">{message}</p>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-anime-text rotate-45"></div>
       </div>
       
       {/* Pixel Girl SVG */}
       <svg 
         viewBox="0 0 32 32" 
         className="w-32 h-32 drop-shadow-md filter transition-all cursor-pointer hover:scale-105 animate-float"
         style={{ animationDelay: '1.5s' }}
       >
          
          {/* -- Back Hair -- */}
          <rect x="5" y="6" width="22" height="24" rx="2" fill={hairColor} />

          {/* -- Body/Outfit -- */}
          <rect x="10" y="24" width="12" height="8" fill={outfitColor} />
          {/* Collar/Detail on outfit */}
          <rect x="14" y="24" width="4" height="2" fill="#FFF" opacity="0.5" />

          {/* -- Arms -- */}
          {/* Left Arm (Viewer's Left) - Static */}
          <rect x="8" y="24" width="3" height="7" fill={outfitColor} />
          
          {/* Right Arm (Viewer's Right) - Waving Logic */}
          {isWaving ? (
             waveFrame === 0 ? (
                // Wave Frame 1 (Up and in)
                <rect x="23" y="16" width="3" height="8" fill={outfitColor} transform="rotate(-10 24.5 24)" />
             ) : (
                // Wave Frame 2 (Up and out)
                <rect x="25" y="15" width="3" height="8" fill={outfitColor} transform="rotate(10 24.5 24)" />
             )
          ) : (
             // Idle Arm
             <rect x="21" y="24" width="3" height="7" fill={outfitColor} />
          )}

          {/* -- Face Shape -- */}
          <rect x="7" y="8" width="18" height="16" fill={skinColor} />
          
          {/* -- Hair Front / Bangs -- */}
          <rect x="5" y="6" width="22" height="5" fill={hairColor} />
          {/* Side Bangs */}
          <rect x="5" y="8" width="3" height="14" fill={hairColor} />
          <rect x="24" y="8" width="3" height="14" fill={hairColor} />
          
          {/* -- Face Details Group (Moves when looking) -- */}
          <g transform={`translate(${lookOffset}, 0)`} style={{ transition: 'transform 0.2s steps(2)' }}>
              {/* Eyes (Big Anime Style) - Blinking Logic */}
              {isBlinking ? (
                <>
                    {/* Closed Eyes */}
                    <rect x="10" y="16" width="3" height="1" fill="#4A4E69" />
                    <rect x="19" y="16" width="3" height="1" fill="#4A4E69" />
                </>
              ) : (
                <>
                    {/* Open Eyes */}
                    <rect x="10" y="14" width="3" height="4" fill="#4A4E69" />
                    <rect x="10" y="14" width="1" height="2" fill="#FFF" /> {/* Glint */}
                    
                    <rect x="19" y="14" width="3" height="4" fill="#4A4E69" />
                    <rect x="19" y="14" width="1" height="2" fill="#FFF" /> {/* Glint */}
                </>
              )}

              {/* Blush */}
              <rect x="9" y="18" width="3" height="1" fill="#FFB6C1" opacity="0.8" />
              <rect x="20" y="18" width="3" height="1" fill="#FFB6C1" opacity="0.8" />

              {/* Mouth */}
              <rect x="15" y="19" width="2" height="1" fill="#D2691E" />
          </g>

          {/* -- Accessories (Move slightly less than face for parallax, or same) -- */}
          <g transform={`translate(${lookOffset}, 0)`} style={{ transition: 'transform 0.2s steps(2)' }}>
            {accessory === 'bow' && (
                <g>
                <rect x="20" y="4" width="6" height="4" fill={accessoryColor} />
                <rect x="22" y="5" width="2" height="2" fill="#FFF" />
                </g>
            )}

            {accessory === 'catEars' && (
                <g>
                <path d="M6 8 L6 2 L12 6" fill={accessoryColor} stroke={hairColor} strokeWidth="0.5" />
                <path d="M26 8 L26 2 L20 6" fill={accessoryColor} stroke={hairColor} strokeWidth="0.5" />
                <rect x="7" y="4" width="2" height="2" fill="#FFB6C1" opacity="0.7" /> {/* Ear inside */}
                <rect x="23" y="4" width="2" height="2" fill="#FFB6C1" opacity="0.7" />
                </g>
            )}

            {accessory === 'flower' && (
                <g>
                <rect x="22" y="5" width="6" height="6" fill={accessoryColor} rx="3"/>
                <rect x="24" y="7" width="2" height="2" fill="#FFF68F" />
                </g>
            )}
          </g>
       </svg>
    </div>
  );
};