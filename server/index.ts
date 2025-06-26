import express from 'express';
import cors from 'cors';
import { db } from './db';
import { users }_ from './db/schema';_
import { eq } from 'drizzle-orm';
import { onRequest } from "firebase-functions/v2/https"; // <--- ADD THIS IMPORT

const app = express();

// Middleware
app.use(cors()); // Use this for local development if your client and server are on different ports
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
    // For now, saving directly for simplicity
    const newUser = await db.insert(users).values({ username, email, password }).returning();
    res.status(201).json(newUser[0]);
  } catch (error: any) {
    // Check for unique constraint violation
    if (error.code === '23505') { // PostgreSQL unique violation error code
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

        // IMPORTANT: You must compare the hashed password here.
        // This is a placeholder and is NOT secure.
        if (user[0].password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        // Don't send the password back to the client
        const { password: _, ...userResponse } = user[0];
        res.json({ message: 'Login successful', user: userResponse });

    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});


// --- REMOVED THE OLD SERVER LISTENING CODE ---
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//  console.log(`Server is running on port ${PORT}`);
// });
// --------------------------------------------


// --- ADD THIS LINE TO EXPORT THE APP AS A CLOUD FUNCTION ---
export const api = onRequest(app); // Changed name to 'api' to match standard practice
