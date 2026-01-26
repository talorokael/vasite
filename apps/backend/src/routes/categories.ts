// apps/backend/src/routes/categories.ts
import express from 'express';
import { prisma } from '../lib/prisma.js'; // Import the shared Prisma client instance

// Create a new Express Router. This allows us to define routes
// that will be mounted under a specific path (e.g., '/api/categories')
const router: express.Router = express.Router();

/**
 * GET /api/categories
 * Fetches all product categories, including a count of products in each.
 * This is a PUBLIC endpoint (no authentication required for MP4).
 */
router.get('/', async (req, res) => {
  try {
    // 1. QUERY THE DATABASE using Prisma's fluent API.
    // We use `prisma.category.findMany()` to get all records from the Category model.
    const categories = await prisma.category.findMany({
      // 2. USE `select` TO SPECIFY EXACT RESPONSE SHAPE.
      // This is more efficient than `include` when we know the exact fields needed.
      // It also ensures we never accidentally expose sensitive data.
      select: {
        id: true,          // Include the category's unique ID
        name: true,        // Include the category name
        description: true, // Include the description
        // 3. COUNTING RELATED RECORDS using Prisma's `_count` feature.
        // This performs a count of all related Product records where
        // `product.categoryId` equals this category's `id`.
        _count: {
          select: {
            products: true, // The key 'products' comes from the `products` relation field defined in your Prisma schema.
          },
        },
      },
      // 4. (Optional) SORTING: Order results alphabetically by name.
      // Removing `orderBy` would return categories in database order (often by creation date).
      orderBy: {
        name: 'asc', // 'asc' for ascending (A-Z), 'desc' for descending (Z-A)
      },
    });

    // 5. SEND SUCCESS RESPONSE.
    // The `categories` variable is an array of objects with the structure defined in the `select` clause above.
    // Status code 200 means "OK". We send the data as JSON, which is the standard for APIs.
    res.status(200).json(categories);

  } catch (error) {
    // 6. ERROR HANDLER: Catch any unexpected errors (e.g., database connection issues).
    // This follows the exact same pattern as your auth.ts for consistency.
    console.error('Failed to fetch categories:', error);
    // Status code 500 means "Internal Server Error". We send a generic error message
    // to avoid leaking internal details, but log the full error for debugging.
    res.status(500).json({ error: 'Internal server error while fetching categories' });
  }
});

// Export the router so it can be imported and used in your main server file (e.g., index.ts).
export default router;