
import React, { useEffect, useState } from 'react';
import { DayData } from '../types';
import { PixelButton } from './PixelButton';
import { Dumbbell, Salad, BookOpen, Terminal, Heart, X, Sparkles } from 'lucide-react';
import { getEncouragement } from '../services/messages';

interface DayModalProps {
  day: DayData;
  onClose: () => void;
  onToggleHabit: (dayNumber: number, habit: keyof DayData['habits']) => void;
  userName: string;
}

export const DayModal: React.FC<DayModalProps> = ({ day, onClose, onToggleHabit, userName }) => {
  const [flavorText, setFlavorText] = useState<string | null>(null);

  const habitsList = [
    { key: 'workout', label: 'Workout', icon: <Dumbbell className="w-5 h-5" />, color: 'bg-red-100 text-red-500' },
    { key: 'eatingClean', label: 'Eat Clean', icon: <Salad className="w-5 h-5" />, color: 'bg-green-100 text-green-500' },
    { key: 'learning', label: 'Learning', icon: <BookOpen className="w-5 h-5" />, color: 'bg-blue-100 text-blue-500' },
    { key: 'coding', label: 'Coding', icon: <Terminal className="w-5 h-5" />, color: 'bg-purple-100 text-purple-500' },
  ] as const;

  const handleToggle = (habitKey: keyof DayData['habits']) => {
    onToggleHabit(day.dayNumber, habitKey);
    if (!day.habits[habitKey]) {
      const msg = getEncouragement(userName, habitKey);
      setFlavorText(msg);
    }
  };

  useEffect(() => {
    if (day.flavorText) {
      setFlavorText(day.flavorText);
    }
  }, [day.flavorText]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-purple-900/40 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-white border-4 border-anime-text rounded-3xl shadow-pixel relative animate-[bounce_0.5s_ease-out] overflow-hidden">
        <div className="bg-anime-pink p-4 border-b-4 border-anime-text flex justify-between items-center">
          <h2 className="font-pixel text-white text-lg drop-shadow-md">Day {day.dayNumber}</h2>
          <button onClick={onClose} className="bg-white text-anime-pink hover:bg-red-100 p-1 rounded-full border-2 border-anime-text transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 bg-anime-bg">
          {flavorText && (
            <div className="mb-6 p-4 bg-white rounded-2xl border-2 border-anime-purple font-retro text-xl text-center text-anime-text shadow-sm relative">
               <Sparkles className="absolute -top-3 -left-2 w-6 h-6 text-yellow-400 animate-spin"/>
               {flavorText}
               <Sparkles className="absolute -bottom-3 -right-2 w-6 h-6 text-yellow-400 animate-spin"/>
            </div>
          )}

          <div className="space-y-3">
            {habitsList.map((habit) => (
              <button
                key={habit.key}
                onClick={() => handleToggle(habit.key)}
                className={`w-full group relative flex items-center p-2 rounded-xl border-2 border-anime-text transition-all duration-200
                  ${day.habits[habit.key] 
                    ? 'bg-anime-cream opacity-80 translate-y-1' 
                    : 'bg-white shadow-pixel-sm hover:translate-y-[-2px]'}
                `}
              >
                <div className={`p-2 rounded-lg border-2 border-anime-text mr-4 ${habit.color}`}>
                    {habit.icon}
                </div>
                <div className="flex-1 text-left">
                  <span className={`font-retro text-2xl ${day.habits[habit.key] ? 'line-through text-gray-400' : 'text-anime-text'}`}>
                    {habit.label}
                  </span>
                </div>
                {day.habits[habit.key] && <div className="absolute right-4"><Heart className="w-6 h-6 text-pink-500 fill-current animate-ping" /></div>}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 bg-white border-t-4 border-anime-text text-center">
            <PixelButton onClick={onClose} variant="secondary" className="w-full rounded-xl">Back to Map</PixelButton>
        </div>
      </div>
    </div>
  );
};