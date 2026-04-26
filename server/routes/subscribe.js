import { Router } from 'express';
import prisma from '../lib/prisma.js';

const router = Router();

router.post('/', async (req, res) => {
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Valid email is required.' });
  }

  try {
    const subscriber = await prisma.subscriber.create({
      data: { email },
    });
    res.status(201).json({ success: true, subscriber });
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Email already subscribed.' });
    }
    console.error(err);
    res.status(500).json({ error: 'Failed to subscribe.' });
  }
});

export default router;
