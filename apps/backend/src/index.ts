import express from 'express'
import { prisma } from '../src/lib/prisma.js'

const app = express()

app.use(express.json())

const port = process.env.PORT || 3001



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

app.post('/api/products', async (req, res) => {
  try {
    const { name, price } = req.body;
    
    // Basic validation
    if (!name || typeof price !== 'number') {
      return res.status(400).json({ error: 'Invalid input' });
    }
    
    const product = await prisma.product.create({
      data: { name, price }
    });
    
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

app.listen(port, () => {
  console.log(`Backend running on port ${port}`)
})