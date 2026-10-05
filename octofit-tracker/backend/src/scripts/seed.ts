import mongoose from 'mongoose';
import { connectDatabase } from '../config/database';
import Activity from '../models/Activity';
import Leaderboard from '../models/Leaderboard';
import Team from '../models/Team';
import User from '../models/User';
import Workout from '../models/Workout';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await connectDatabase();

    await Promise.all([
      Activity.deleteMany({}),
      Leaderboard.deleteMany({}),
      Team.deleteMany({}),
      User.deleteMany({}),
      Workout.deleteMany({}),
    ]);

    const users = await User.insertMany([
      { name: 'Mina Park', email: 'mina.park@example.test', grade: 9 },
      { name: 'Jordan Lee', email: 'jordan.lee@example.test', grade: 10 },
      { name: 'Sam Rivera', email: 'sam.rivera@example.test', grade: 11 },
      { name: 'Alex Morgan', email: 'alex.morgan@example.test', grade: 9 },
    ]);

    const teams = await Team.insertMany([
      {
        name: 'Morning Movers',
        description: 'A steady start to every school day.',
        memberIds: [users[0]._id, users[1]._id],
      },
      {
        name: 'Trail Blazers',
        description: 'A team for runners, walkers, and outdoor explorers.',
        memberIds: [users[2]._id, users[3]._id],
      },
    ]);

    const now = new Date();
    const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

    await Activity.insertMany([
      { userId: users[0]._id, type: 'running', durationMinutes: 28, distanceKm: 4.1, points: 41, completedAt: daysAgo(0) },
      { userId: users[1]._id, type: 'strength', durationMinutes: 35, points: 35, completedAt: daysAgo(1) },
      { userId: users[2]._id, type: 'walking', durationMinutes: 42, distanceKm: 3.2, points: 32, completedAt: daysAgo(1) },
      { userId: users[3]._id, type: 'running', durationMinutes: 24, distanceKm: 3.5, points: 35, completedAt: daysAgo(2) },
    ]);

    await Leaderboard.insertMany([
      { userId: users[0]._id, teamId: teams[0]._id, period: 'weekly', points: 126, rank: 1 },
      { userId: users[2]._id, teamId: teams[1]._id, period: 'weekly', points: 112, rank: 2 },
      { userId: users[1]._id, teamId: teams[0]._id, period: 'weekly', points: 98, rank: 3 },
      { userId: users[3]._id, teamId: teams[1]._id, period: 'weekly', points: 87, rank: 4 },
    ]);

    await Workout.insertMany([
      {
        name: 'Easy Interval Run',
        description: 'Alternate a relaxed jog with short brisk intervals.',
        category: 'cardio',
        difficulty: 'beginner',
        durationMinutes: 25,
        equipment: [],
      },
      {
        name: 'Bodyweight Strength',
        description: 'A balanced circuit of squats, push-ups, and planks.',
        category: 'strength',
        difficulty: 'beginner',
        durationMinutes: 20,
        equipment: [],
      },
      {
        name: 'Mobility Reset',
        description: 'Gentle dynamic stretches for a full-body cooldown.',
        category: 'mobility',
        difficulty: 'beginner',
        durationMinutes: 12,
        equipment: [],
      },
    ]);

    console.log('Database seeding complete');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
