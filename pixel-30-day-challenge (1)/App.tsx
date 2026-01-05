
import React, { useState, useEffect, useMemo } from 'react';
import { UserState, DayData, GameScreen, TOTAL_DAYS, XP_PER_HABIT, XP_PER_DAY_BONUS, MascotState } from './types';
import { PixelButton } from './components/PixelButton';
import { DayModal } from './components/DayModal';
import { Mascot } from './components/Mascot';
import { CustomizeModal } from './components/CustomizeModal';
import { BackgroundDecorations } from './components/BackgroundDecorations';
import { ProgressChart } from './components/ProgressChart';
import { Trophy, Star, Heart, LogOut, Sparkles, Shirt, Flame, Lock, Server, Loader2, BarChart3 } from 'lucide-react';
import { getQuestFlavor } from './services/messages';

const API_URL = 'http://localhost:3001/api';

const DEFAULT_MASCOT: MascotState = {
  hairColor: '#FF69B4',
  outfitColor: '#D0A9F5',
  skinColor: '#FFE0BD',
  accessory: 'bow',
  accessoryColor: '#FFFFFF'
};

const INITIAL_DAYS: DayData[] = Array.from({ length: TOTAL_DAYS }, (_, i) => ({
  id: i + 1,
  dayNumber: i + 1,
  unlocked: true, // All days are now available by default
  completed: false,
  habits: { workout: false, eatingClean: false, learning: false, coding: false },
}));

export default function App() {
  const [screen, setScreen] = useState<GameScreen>(GameScreen.LOGIN);
  const [isServerMode, setIsServerMode] = useState(false);
  const [user, setUser] = useState<UserState>({
    name: '',
    isLoggedIn: false,
    level: 1,
    xp: 0,
    maxXp: 100,
    mascot: DEFAULT_MASCOT
  });
  const [days, setDays] = useState<DayData[]>(INITIAL_DAYS);
  const [selectedDay, setSelectedDay] = useState<DayData | null>(null);
  const [loginName, setLoginName] = useState('');
  const [mascotMessage, setMascotMessage] = useState("Welcome, Traveler! (◕‿◕✿)");
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);

    fetch(`${API_URL}/auth/login`, { method: 'HEAD', signal: controller.signal })
      .then(() => {
        setIsServerMode(true);
        clearTimeout(timeout);
      })
      .catch(() => {
        setIsServerMode(false);
        clearTimeout(timeout);
      });
  }, []);

  const startLocalMode = (name: string) => {
    setUser(prev => ({ ...prev, name, isLoggedIn: true }));
    setScreen(GameScreen.DASHBOARD);
    setMascotMessage(`Local Mode active! (｡♥‿♥｡)`);
    setLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = loginName.trim();
    if (!trimmedName) return;
    setLoading(true);

    if (isServerMode) {
      try {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: trimmedName })
        });
        
        if (!res.ok) throw new Error("Server rejected login");
        
        const data = await res.json();
        if (data && data.user) {
          setUser({ ...data.user, isLoggedIn: true });
          setDays(data.days || INITIAL_DAYS);
          setScreen(GameScreen.DASHBOARD);
          setMascotMessage(`Server Synced! Ready, ${data.user.name}-senpai?`);
        } else {
          throw new Error("Invalid server data");
        }
      } catch (err) {
        setIsServerMode(false);
        startLocalMode(trimmedName);
      } finally {
        setLoading(false);
      }
    } else {
      startLocalMode(trimmedName);
    }
  };

  const toggleHabit = async (dayNumber: number, habitKey: keyof DayData['habits']) => {
    let xpChange = 0;
    const targetDay = days.find(d => d.dayNumber === dayNumber);
    if (!targetDay) return;

    const wasHabitDone = targetDay.habits[habitKey];
    xpChange = !wasHabitDone ? XP_PER_HABIT : -XP_PER_HABIT;

    setDays(prev => prev.map(d => {
      if (d.dayNumber === dayNumber) {
        const newHabits = { ...d.habits, [habitKey]: !wasHabitDone };
        const allDone = Object.values(newHabits).every(Boolean);
        return { ...d, habits: newHabits, completed: allDone };
      }
      return d;
    }));

    if (isServerMode && user._id) {
      fetch(`${API_URL}/days/toggle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user._id, dayNumber, habitKey })
      }).catch(err => console.error("Sync error", err));
    }

    setUser(prev => {
      let newXp = prev.xp + xpChange;
      let newLevel = prev.level;
      let newMaxXp = prev.maxXp;
      while (newXp >= newMaxXp) { newXp -= newMaxXp; newLevel++; newMaxXp = Math.floor(newMaxXp * 1.2); }
      while (newXp < 0 && newLevel > 1) { newLevel--; newMaxXp = Math.floor(newMaxXp / 1.2); newXp += newMaxXp; }
      const updated = { ...prev, xp: Math.max(0, newXp), level: newLevel, maxXp: newMaxXp };
      
      if (isServerMode && user._id) {
        fetch(`${API_URL}/user/update`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user._id, updates: { xp: updated.xp, level: updated.level, maxXp: updated.maxXp } })
        }).catch(err => console.error("Sync error", err));
      }
      return updated;
    });
  };

  const handleDayClick = (day: DayData) => {
    // Progress-based restriction removed so all days are available immediately
    setSelectedDay(day);
    const flavor = getQuestFlavor(day.dayNumber, user.name);
    setDays(prev => prev.map(d => d.dayNumber === day.dayNumber ? { ...d, flavorText: flavor } : d));
    setMascotMessage(flavor);
  };

  const currentStreak = useMemo(() => {
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].completed) streak++;
      else if (streak > 0) break;
    }
    return streak;
  }, [days]);

  if (screen === GameScreen.LOGIN) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <BackgroundDecorations />
        <div className="z-10 relative mb-12 animate-float text-center">
            <h1 className="font-pixel text-4xl md:text-5xl text-anime-pink drop-shadow-hard mb-2" style={{ textShadow: '4px 4px 0px #4A4E69' }}>PIXEL QUEST</h1>
            <p className="font-pixel text-anime-purple text-lg tracking-widest">30 DAY CHALLENGE</p>
        </div>

        <div className="w-full max-w-md bg-white border-[6px] border-anime-text rounded-[2rem] shadow-pixel-lg p-8 text-center relative z-10">
          <div className="flex justify-center -mt-24 mb-6"><Mascot message={mascotMessage} customization={user.mascot} /></div>
          
          <div className="mb-4 flex items-center justify-center gap-2 font-pixel text-[8px] text-anime-text opacity-60">
            <Server className={`w-3 h-3 ${isServerMode ? 'text-green-500' : 'text-gray-400'}`} />
            {isServerMode ? 'SERVER READY' : 'LOCAL CACHE MODE'}
          </div>

          <form onSubmit={handleLogin} className="space-y-6 max-w-[280px] mx-auto">
            <input
              type="text"
              value={loginName}
              onChange={(e) => setLoginName(e.target.value)}
              placeholder="Enter Hero Name..."
              className="w-full border-4 border-anime-text rounded-xl p-3 font-retro text-2xl outline-none focus:bg-anime-cream text-center"
              maxLength={12}
              required
            />
            <PixelButton type="submit" disabled={!loginName.trim() || loading} className="w-full py-4 text-base">
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  LOADING...
                </>
              ) : 'START GAME'}
            </PixelButton>
          </form>
          <p className="mt-4 font-retro text-lg text-anime-text opacity-40">Workout • Eating • Learning • Coding</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 relative flex flex-col items-center">
      <BackgroundDecorations />
      <div className="w-full max-w-7xl flex flex-col md:flex-row gap-8 relative z-10 mt-10">
        <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-6">
          <div className="bg-white/90 backdrop-blur-md border-4 border-anime-text rounded-[2rem] p-6 shadow-pixel-lg">
            <div className="flex justify-center mb-2 relative">
                <Mascot message={mascotMessage} customization={user.mascot} />
                <button onClick={() => setIsCustomizeOpen(true)} className="absolute top-0 right-0 p-2 bg-white border-2 border-anime-text rounded-xl hover:bg-anime-pink shadow-pixel-sm transition-transform active:scale-95"><Shirt className="w-5 h-5" /></button>
            </div>
            <div className="bg-anime-bg rounded-xl p-4 border-2 border-anime-text space-y-4 mt-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2"><Flame className="w-5 h-5 text-orange-500 fill-orange-400" /><span className="font-pixel text-[10px]">STREAK</span></div>
                    <span className="font-pixel text-xl text-orange-500">{currentStreak}</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-pixel"><span>LVL {user.level}</span><span>{Math.floor(user.xp)}/{user.maxXp}</span></div>
                  <div className="w-full bg-white h-4 rounded-full border-2 border-anime-text overflow-hidden">
                    <div className="bg-anime-pink h-full transition-all duration-500" style={{ width: `${(user.xp / user.maxXp) * 100}%` }} />
                  </div>
                </div>
            </div>
            <PixelButton onClick={() => setScreen(GameScreen.LOGIN)} variant="secondary" size="sm" className="w-full mt-6">
                <LogOut className="w-4 h-4" /> EXIT
            </PixelButton>
          </div>
        </div>

        <div className="flex-1 space-y-8">
          <div className="bg-white/60 backdrop-blur-sm border-4 border-anime-text rounded-[2rem] p-6 shadow-pixel-lg relative">
              <div className="absolute -top-5 left-8 bg-anime-blue border-4 border-anime-text px-6 py-2 rounded-xl text-white font-pixel text-sm drop-shadow-md">MAP PROGRESS</div>
              <div className="mt-8 grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-6 gap-4">
                 {days.map((day) => (
                      <button
                        key={day.dayNumber}
                        onClick={() => handleDayClick(day)}
                        disabled={!day.unlocked}
                        className={`aspect-square rounded-xl border-b-4 border-r-4 transition-all relative flex flex-col items-center justify-center
                          ${!day.unlocked 
                            ? 'bg-gray-200 border-gray-300 cursor-not-allowed opacity-60' 
                            : day.completed 
                              ? 'bg-anime-pink border-anime-text text-white translate-y-1 border-b-0 border-r-0' 
                              : 'bg-white border-anime-text hover:-translate-y-1 shadow-pixel-sm'}
                        `}
                      >
                          <span className="font-pixel text-lg">{day.dayNumber}</span>
                          {!day.unlocked ? (
                            <Lock className="w-4 h-4 opacity-40 mt-1" />
                          ) : day.completed ? (
                            <Star className="w-5 h-5 text-yellow-300 fill-yellow-300 animate-bounce-slow mt-1" />
                          ) : (
                            <div className="flex gap-0.5 mt-1">
                              {Object.values(day.habits).map((h, i) => (
                                <div key={i} className={`w-1.5 h-1.5 rounded-full ${h ? 'bg-green-400' : 'bg-gray-200 border border-gray-300'}`} />
                              ))}
                            </div>
                          )}
                      </button>
                 ))}
              </div>
          </div>

          <ProgressChart days={days} />
        </div>
      </div>

      {selectedDay && <DayModal day={selectedDay} onClose={() => setSelectedDay(null)} onToggleHabit={toggleHabit} userName={user.name} />}
      {isCustomizeOpen && <CustomizeModal initialMascot={user.mascot} onClose={() => setIsCustomizeOpen(false)} onSave={(m) => { setUser(p => ({...p, mascot: m})); setIsCustomizeOpen(false); }} />}
    </div>
  );
}
