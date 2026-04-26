import { Router } from 'express';
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const router = Router();

// In-memory token store (survives until server restart)
const activeTokens = new Map();

// Clean expired tokens every hour
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of activeTokens) {
    if (now > data.expiresAt) activeTokens.delete(token);
  }
}, 60 * 60 * 1000);

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: 'Password is required.' });
    }

    const hash = process.env.ADMIN_PASSWORD_HASH;
    if (!hash) {
      console.error('ADMIN_PASSWORD_HASH not set in .env');
      return res.status(500).json({ error: 'Server misconfigured.' });
    }

    const match = await bcrypt.compare(password, hash);
    if (!match) {
      return res.status(401).json({ error: 'Invalid password.' });
    }

    // Generate token valid for 24 hours
    const token = crypto.randomUUID();
    activeTokens.set(token, {
      createdAt: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    });

    res.json({ token });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed.' });
  }
});

// POST /api/auth/verify
router.post('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false });
  }

  const token = authHeader.split(' ')[1];
  const tokenData = activeTokens.get(token);

  if (!tokenData || Date.now() > tokenData.expiresAt) {
    activeTokens.delete(token);
    return res.status(401).json({ valid: false });
  }

  res.json({ valid: true });
});

// Middleware for protecting routes
export function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  const token = authHeader.split(' ')[1];
  const tokenData = activeTokens.get(token);

  if (!tokenData || Date.now() > tokenData.expiresAt) {
    activeTokens.delete(token);
    return res.status(401).json({ error: 'Session expired. Please login again.' });
  }

  next();
}

export default router;
