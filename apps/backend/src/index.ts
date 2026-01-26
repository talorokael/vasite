import express from 'express'
import { prisma } from '../src/lib/prisma.js'
import authRouter from './routes/auth.js';
import { ProductType, StrainType } from '@prisma/client';
import { authenticate } from './middleware/auth.js';
import { requireRole } from './middleware/rbac.js';
import cors  from 'cors';
const app = express()

app.use(express.json())

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

const port = process.env.PORT || 3001

app.use('/api/auth', authRouter);

// Import the router (add this at the top with your other imports)
import categoriesRoutes from './routes/categories.js';

// ... later, with your other app.use() calls ...
app.use('/api/categories', categoriesRoutes);



app.get('/api/health', (_, res) => res.json({ ok: true }))

app.get('/api/products', async (_, res) => {
  try {
    const products = await prisma.product.findMany()
    res.json(products)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

// Replace the entire POST /api/products endpoint with:
app.post('/api/products', authenticate, requireRole(['ADMIN']), async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      productType,
      categoryId,
      sku,
      compareAtPrice,
      inventory,
      weight,
      strainType,
      cbdContent,
      thcContent,
      size,
      tags,
      images,
      
    } = req.body;

    // Basic validation for absolutely required fields
    if (!name || typeof price !== 'number' || !productType) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, price, and productType are required' 
      });
    }

    // Validate that productType is a valid enum value
    if (!Object.values(ProductType).includes(productType)) {
      return res.status(400).json({ 
        error: 'Invalid productType', 
        validTypes: Object.values(ProductType) 
      });
    }

    // Validate strainType if provided
    if (strainType && !Object.values(StrainType).includes(strainType)) {
      return res.status(400).json({ 
        error: 'Invalid strainType', 
        validTypes: Object.values(StrainType) 
      });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description || null,
        price,
        productType,
        categoryId: categoryId || null,
        sku: sku || null,
        compareAtPrice: compareAtPrice || null,
        inventory: inventory || 0,
        weight: weight || null,
        strainType: strainType || null,
        cbdContent: cbdContent || null,
        thcContent: thcContent || null,
        size: size || null,
        tags: tags || [],
        images: images || [],
        userId: req.user!.id 
      }
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    
    // Handle unique constraint violation (e.g., duplicate SKU)
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return res.status(409).json({ error: 'A product with this SKU already exists' });
    }
    
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`)
})