
export interface DayData {
  id: number;
  dayNumber: number;
  unlocked: boolean;
  completed: boolean;
  habits: {
    workout: boolean;
    eatingClean: boolean;
    learning: boolean;
    coding: boolean;
  };
  flavorText?: string;
}

export interface MascotState {
  hairColor: string;
  outfitColor: string;
  skinColor: string;
  accessory: 'bow' | 'catEars' | 'flower';
  accessoryColor: string;
}

export interface UserState {
  _id?: string;
  name: string;
  isLoggedIn: boolean;
  level: number;
  xp: number;
  maxXp: number;
  mascot: MascotState;
}

export enum GameScreen {
  LOGIN,
  DASHBOARD,
}

export const TOTAL_DAYS = 30;
export const XP_PER_HABIT = 15;
export const XP_PER_DAY_BONUS = 60;
