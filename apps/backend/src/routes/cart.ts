import express from "express";
import { prisma } from "../lib/prisma.js";
import { authenticate } from "../middleware/auth.js";

const router: express.Router = express.Router();

// Helper to ensure id is string
const getParamId = (id: string | string[] | undefined): string | null => {
  if (!id || Array.isArray(id)) return null;
  return id;
};

// GET /api/cart
router.get("/", authenticate, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id;

    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: { product: true },
        },
      },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
        include: {
          items: {
            include: { product: true },
          },
        },
      });
    }

    res.json(cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

// POST /api/cart/items
router.post("/items", authenticate, async (req, res) => {
  const { productId, quantity } = req.body;

  if (!productId || typeof quantity !== "number" || quantity < 1) {
    return res
      .status(400)
      .json({ error: "Invalid productId or quantity" });
  }

  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id;

    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    const cartItem = await prisma.cartItem.upsert({
      where: {
        cartId_productId: {
          cartId: cart.id,
          productId,
        },
      },
      update: {
        quantity: {
          increment: quantity,
        },
      },
      create: {
        cartId: cart.id,
        productId,
        quantity,
      },
      include: {
        product: true,
      },
    });

    res.status(201).json(cartItem);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Failed to add item to cart" });
  }
});

// PUT /api/cart/items/:id
router.put("/items/:id", authenticate, async (req, res) => {
  const rawId = req.params.id;
  const id = getParamId(rawId);

  if (!id) {
    return res.status(400).json({ error: "Invalid cart item ID" });
  }

  const { quantity } = req.body;

  if (typeof quantity !== "number" || quantity < 0) {
    return res.status(400).json({ error: "Invalid quantity" });
  }

  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      include: {
        cart: true,
      },
    });

    if (!cartItem || cartItem.cart.userId !== req.user.id) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    if (quantity === 0) {
      await prisma.cartItem.delete({
        where: { id },
      });
    } else {
      await prisma.cartItem.update({
        where: { id },
        data: { quantity },
      });
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error updating cart item:", error);
    res.status(500).json({ error: "Failed to update cart item" });
  }
});

// DELETE /api/cart/items/:id
router.delete("/items/:id", authenticate, async (req, res) => {
  const rawId = req.params.id;
  const id = getParamId(rawId);

  if (!id) {
    return res.status(400).json({ error: "Invalid cart item ID" });
  }

  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const cartItem = await prisma.cartItem.findUnique({
      where: { id },
      include: {
        cart: true,
      },
    });

    if (!cartItem || cartItem.cart.userId !== req.user.id) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    await prisma.cartItem.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(500).json({ error: "Failed to delete cart item" });
  }
});

// POST /api/cart/merge
// Expects:
// {
//   items: [
//     { productId: string, quantity: number }
//   ]
// }
router.post("/merge", authenticate, async (req, res) => {
  const { items } = req.body as {
    items?: Array<{
      productId: string;
      quantity: number;
    }>;
  };

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      error: "items array is required and cannot be empty",
    });
  }

  // Validate all items
  const invalidItem = items.find(
    (item) =>
      !item.productId ||
      typeof item.quantity !== "number" ||
      item.quantity < 1,
  );

  if (invalidItem) {
    return res.status(400).json({
      error: "Each item must contain a valid productId and quantity >= 1",
    });
  }

  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user.id;

    // Get or create cart
    let cart = await prisma.cart.findUnique({
      where: { userId },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId },
      });
    }

    // Merge all items atomically
    await prisma.$transaction(
      items.map(({ productId, quantity }) =>
        prisma.cartItem.upsert({
          where: {
            cartId_productId: {
              cartId: cart!.id,
              productId,
            },
          },
          update: {
            quantity: {
              increment: quantity,
            },
          },
          create: {
            cartId: cart!.id,
            productId,
            quantity,
          },
        }),
      ),
    );

    // Return updated cart
    const mergedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    res.json(mergedCart);
  } catch (error) {
    console.error("Cart merge error:", error);
    res.status(500).json({ error: "Failed to merge cart" });
  }
});

export default router;