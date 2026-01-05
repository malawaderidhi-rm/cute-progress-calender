
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  level: { type: Number, default: 1 },
  xp: { type: Number, default: 0 },
  maxXp: { type: Number, default: 100 },
  mascot: {
    hairColor: { type: String, default: '#FF69B4' },
    outfitColor: { type: String, default: '#D0A9F5' },
    skinColor: { type: String, default: '#FFE0BD' },
    accessory: { type: String, default: 'bow' },
    accessoryColor: { type: String, default: '#FFFFFF' }
  }
});

const DaySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dayNumber: { type: Number, required: true },
  unlocked: { type: Boolean, default: false },
  completed: { type: Boolean, default: false },
  habits: {
    workout: { type: Boolean, default: false },
    eatingClean: { type: Boolean, default: false },
    learning: { type: Boolean, default: false },
    coding: { type: Boolean, default: false }
  },
  flavorText: { type: String }
});

// Compound index to ensure one entry per day per user
DaySchema.index({ userId: 1, dayNumber: 1 }, { unique: true });

export const User = mongoose.model('User', UserSchema);
export const Day = mongoose.model('Day', DaySchema);
