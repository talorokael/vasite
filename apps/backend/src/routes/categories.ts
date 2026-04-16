// apps/backend/src/routes/categories.ts
import express from 'express';
import { prisma } from '../lib/prisma.js';
import { getCached } from '../lib/cache.js';   

const router: express.Router = express.Router();

router.get('/', async (req, res) => {
  try {
    // ✅ Wrap the query with getCached (TTL = 300 seconds = 5 minutes)
    const categories = await getCached('categories', 300, async () => {
      return await prisma.category.findMany({
        select: {
          id: true,
          name: true,
          description: true,
          _count: {
            select: {
              products: true,
            },
          },
        },
        orderBy: {
          name: 'asc',
        },
      });
    });

    res.status(200).json(categories);
  } catch (error) {
    console.error('Failed to fetch categories:', error);
    res.status(500).json({ error: 'Internal server error while fetching categories' });
  }
});

export default router;