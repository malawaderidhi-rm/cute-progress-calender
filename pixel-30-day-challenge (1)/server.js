
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import { User, Day } from './models.js';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;
const MONGODB_URI = 'mongodb://localhost:27017/pixelquest';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Auth / User Init
app.post('/api/auth/login', async (req, res) => {
  const { name } = req.body;
  try {
    let user = await User.findOne({ name });
    if (!user) {
      user = await User.create({ name });
      // Initialize 30 days - All unlocked by default
      const days = Array.from({ length: 30 }, (_, i) => ({
        userId: user._id,
        dayNumber: i + 1,
        unlocked: true,
        habits: { workout: false, eatingClean: false, learning: false, coding: false }
      }));
      await Day.insertMany(days);
    }
    const days = await Day.find({ userId: user._id }).sort({ dayNumber: 1 });
    res.json({ user, days });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Habit
app.post('/api/days/toggle', async (req, res) => {
  const { userId, dayNumber, habitKey } = req.body;
  try {
    const day = await Day.findOne({ userId, dayNumber });
    if (!day) return res.status(404).json({ error: 'Day not found' });

    day.habits[habitKey] = !day.habits[habitKey];
    
    // Check if all 4 are completed
    const allDone = Object.values(day.habits).every(Boolean);
    day.completed = allDone;

    // Unlock logic kept for safety/legacy, but redundant if all are true
    if (allDone && dayNumber < 30) {
      await Day.findOneAndUpdate(
        { userId, dayNumber: dayNumber + 1 },
        { unlocked: true }
      );
    }

    await day.save();
    res.json(day);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update User Stats
app.post('/api/user/update', async (req, res) => {
  const { userId, updates } = req.body;
  try {
    const user = await User.findByIdAndUpdate(userId, updates, { new: true });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
