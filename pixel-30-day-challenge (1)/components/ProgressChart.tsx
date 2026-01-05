
import React from 'react';
import { DayData } from '../types';

interface ProgressChartProps {
  days: DayData[];
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ days }) => {
  const maxHabits = 4;
  
  return (
    <div className="mt-8 bg-white/80 p-6 rounded-2xl border-4 border-anime-text shadow-pixel-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-pixel text-xs text-anime-text">Activity Log</h3>
        <div className="flex gap-2 text-[8px] font-pixel text-anime-text opacity-60">
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-anime-pink border border-anime-text"></div> DONE</div>
          <div className="flex items-center gap-1"><div className="w-2 h-2 bg-white border border-anime-text"></div> TODO</div>
        </div>
      </div>
      
      <div className="relative h-48 flex items-end justify-between gap-1 overflow-x-auto pb-6 pt-2 px-2 custom-scrollbar">
        {days.map((day) => {
          const completedCount = Object.values(day.habits).filter(Boolean).length;
          
          return (
            <div key={day.dayNumber} className="flex flex-col items-center flex-1 min-w-[20px] group">
              <div className="relative flex flex-col-reverse gap-1 w-full max-w-[16px]">
                {Array.from({ length: maxHabits }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-4 border-2 border-anime-text rounded-sm transition-all duration-300
                      ${i < completedCount 
                        ? 'bg-anime-pink shadow-[inset_0_-2px_0_rgba(0,0,0,0.1)]' 
                        : 'bg-white opacity-20'}
                    `}
                  />
                ))}
                
                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-anime-text text-white text-[8px] font-pixel p-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-20 whitespace-nowrap">
                  D{day.dayNumber}: {completedCount}/4
                </div>
              </div>
              <span className="mt-2 font-pixel text-[8px] text-anime-text opacity-50">{day.dayNumber}</span>
            </div>
          );
        })}
      </div>
      
      <div className="mt-2 text-center">
         <p className="font-retro text-lg text-anime-text opacity-60">Total Habits Cleared: {days.reduce((acc, d) => acc + Object.values(d.habits).filter(Boolean).length, 0)}</p>
      </div>
    </div>
  );
};
