import express from 'express';
import { prisma } from '../lib/prisma.js';

const router: express.Router = express.Router();

router.post('/leads', async (req, res) => {
  const { name, email, phone, interest } = req.body;

  if (!name || !email || !interest) {
    return res.status(400).json({ error: 'Name, email, and interest are required' });
  }

  try {
    const lead = await prisma.expoLead.create({
      data: { name, email, phone, interest },
    });
    res.status(201).json({ success: true, lead });
  } catch (error) {
    console.error('Failed to save expo lead:', error);
    res.status(500).json({ error: 'Failed to save lead' });
  }
});

export default router;
