import express from 'express';
import cors from 'cors';
import { db } from './db';
import { users } from './db/schema'; // <--- THIS LINE IS NOW FIXED
import { eq } from 'drizzle-orm';
import { onRequest } from "firebase-functions/v2/https";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- User Routes ---

// 1. Get all users
app.get('/api/users', async (req, res) => {
  try {
    const allUsers = await db.select().from(users);
    res.json(allUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// 2. Create a new user (Sign up)
app.post('/api/users/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // You should hash the password here before saving
    const newUser = await db.insert(users).values({ username, email, password }).returning();
    res.status(201).json(newUser[0]);
  } catch (error: any) {
    if (error.code === '23505') {
        return res.status(409).json({ error: 'Email or username already exists.' });
    }
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// 3. User login
app.post('/api/users/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        const user = await db.select().from(users).where(eq(users.email, email)).limit(1);

        if (user.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        // IMPORTANT: You must compare a hashed password here.
        if (user[0].password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const { password: _, ...userResponse } = user[0];
        res.json({ message: 'Login successful', user: userResponse });

    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Export your Express app to be used by Cloud Functions
export const api = onRequest(app);
