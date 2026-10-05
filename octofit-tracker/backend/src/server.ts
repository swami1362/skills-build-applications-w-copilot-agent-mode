import express from 'express';
import { connectDatabase } from './config/database';
import Activity from './models/Activity';
import Leaderboard from './models/Leaderboard';
import Team from './models/Team';
import User from './models/User';
import Workout from './models/Workout';

const app = express();
const port = Number(process.env.PORT) || 8000;
const codespaceName = process.env.CODESPACE_NAME;

export const baseUrl = codespaceName
  ? `https://${codespaceName}-8000.app.github.dev`
  : 'http://localhost:8000';

app.use(express.json());

app.get('/api/users/', async (_request, response) => response.json(await User.find().lean()));
app.get('/api/teams/', async (_request, response) => response.json(await Team.find().lean()));
app.get('/api/activities/', async (_request, response) => response.json(await Activity.find().lean()));
app.get('/api/leaderboard/', async (_request, response) =>
  response.json(await Leaderboard.find().sort({ rank: 1 }).lean()),
);
app.get('/api/workouts/', async (_request, response) => response.json(await Workout.find().lean()));

app.get('/api/health', (_request, response) => {
  response.json({ status: 'ok' });
});

async function startServer() {
  await connectDatabase();
  app.listen(port, '0.0.0.0', () => {
    console.log(`OctoFit API listening at ${baseUrl}`);
  });
}

startServer().catch((error: unknown) => {
  console.error('Failed to start OctoFit API:', error);
  process.exit(1);
});

export default app;