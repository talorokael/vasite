import express from 'express';
import { prisma } from '../lib/prisma.js';
import { authenticate } from '../middleware/auth.js';

const router: express.Router = express.Router();

// Helper to safely extract string parameter
function getStringParam(param: string | string[] | undefined): string | null {
  if (!param || Array.isArray(param)) return null;
  return param;
}

// GET /api/address – get all addresses of the logged‑in user
router.get('/', authenticate, async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const addresses = await prisma.address.findMany({
    where: { userId: req.user.id },
    orderBy: { isDefault: 'desc' },
  });
  res.json(addresses);
});

// POST /api/address – create a new address
router.post('/', authenticate, async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const { name, street, city, postalCode, country, phone, isDefault } = req.body;

  // If this is set as default, unset any existing default for this user
  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: req.user.id, isDefault: true },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: {
      userId: req.user.id,
      name,
      street,
      city,
      postalCode,
      country: country || 'South Africa',
      phone,
      isDefault: isDefault || false,
    },
  });
  res.status(201).json(address);
});

// PUT /api/address/:id – update an address
router.put('/:id', authenticate, async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const rawId = req.params.id;
  const id = getStringParam(rawId);
  if (!id) return res.status(400).json({ error: 'Invalid address ID' });

  const { name, street, city, postalCode, country, phone, isDefault } = req.body;

  // Check that the address belongs to the user
  const existing = await prisma.address.findFirst({
    where: { id, userId: req.user.id },
  });
  if (!existing) return res.status(404).json({ error: 'Address not found' });

  // If setting as default, unset any other default for this user
  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId: req.user.id, isDefault: true, id: { not: id } },
      data: { isDefault: false },
    });
  }

  const updated = await prisma.address.update({
    where: { id },
    data: {
      name,
      street,
      city,
      postalCode,
      country: country || 'South Africa',
      phone,
      isDefault: isDefault ?? existing.isDefault,
    },
  });
  res.json(updated);
});

// DELETE /api/address/:id – delete an address
router.delete('/:id', authenticate, async (req, res) => {
  if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
  const rawId = req.params.id;
  const id = getStringParam(rawId);
  if (!id) return res.status(400).json({ error: 'Invalid address ID' });

  const existing = await prisma.address.findFirst({
    where: { id, userId: req.user.id },
  });
  if (!existing) return res.status(404).json({ error: 'Address not found' });

  await prisma.address.delete({ where: { id } });
  res.status(204).send();
});

export default router;