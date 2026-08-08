// apps/backend/src/routes/products.ts
import { clearCache } from "../lib/cache.js";
import express, { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";
import { ProductType, StrainType, Prisma } from "@prisma/client";
import { authenticate } from "../middleware/auth.js";
import { requireRole } from "../middleware/rbac.js";

const router: express.Router = express.Router();

// Type definitions for product creation
interface ProductInput {
  name: string;
  description?: string | null;
  price: number;
  productType: ProductType;
  categoryId?: string | null;
  sku?: string;
  compareAtPrice?: number;
  inventory?: number;
  weight?: number;
  strainType?: StrainType;
  cbdContent?: number;
  thcContent?: number;
  size?: string;
  tags?: string[];
  images?: string[];
  isAvailable?: boolean;
}

/**
 * Helper function to build Prisma update data from partial input
 * Safe with exactOptionalPropertyTypes + Prisma semantics
 */
function buildProductUpdateData(
  input: Partial<ProductInput>,
): Prisma.ProductUpdateInput {
  const updateData: Prisma.ProductUpdateInput = {};

  const assignIfDefined = <K extends keyof Prisma.ProductUpdateInput>(
    key: K,
    value: Prisma.ProductUpdateInput[K] | undefined,
  ) => {
    if (value !== undefined) {
      updateData[key] = value;
    }
  };

  // Scalars
  assignIfDefined("name", input.name);
  assignIfDefined("price", input.price);
  assignIfDefined("productType", input.productType);
  assignIfDefined("isAvailable", input.isAvailable);

  // Nullable strings ("" → null, undefined → omit)
  if (input.description !== undefined) {
    assignIfDefined(
      "description",
      input.description === "" ? null : input.description,
    );
  }

  if (input.sku !== undefined) {
    assignIfDefined("sku", input.sku === "" ? null : input.sku);
  }

  if (input.size !== undefined) {
    assignIfDefined("size", input.size === "" ? null : input.size);
  }

  // Nullable numbers
  assignIfDefined("compareAtPrice", input.compareAtPrice);
  assignIfDefined("weight", input.weight);
  assignIfDefined("cbdContent", input.cbdContent);
  assignIfDefined("thcContent", input.thcContent);

  // Enum
  assignIfDefined("strainType", input.strainType);

  // Arrays
  assignIfDefined("tags", input.tags);
  assignIfDefined("images", input.images);

  // Inventory (0 is valid)
  if (input.inventory !== undefined) {
    updateData.inventory = input.inventory;
  }

  // Category relation
  if (input.categoryId !== undefined) {
    if (input.categoryId === null) {
      updateData.category = { disconnect: true };
    } else {
      updateData.category = { connect: { id: input.categoryId } };
    }
  }

  return updateData;
}

// GET /api/products
router.get("/", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    // NEW: category filter
    const categoryName = req.query.category as string;

    const where: Prisma.ProductWhereInput = {};

    if (categoryName) {
      where.category = {
        name: { equals: categoryName, mode: "insensitive" },
      };
    }

    // Apply filter to count
    const totalCount = await prisma.product.count({
      where,
    });

    // Apply filter to findMany
    const products = await prisma.product.findMany({
      where,
      skip,
      take: limit,
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const productsWithCategory = products.map((product) => ({
      ...product,
      categoryName: product.category?.name || null,
    }));

    res.json({
      products: productsWithCategory,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error: unknown) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// GET /api/products/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ error: "Product ID is required" });
    }

    const product = await prisma.product.findUnique({
      where: { id: id as string },
      include: {
        category: {
          select: { id: true, name: true },
        },
      },
    });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const productWithCategory = {
      ...product,
      categoryName: product.category?.name || null,
    };

    res.json(productWithCategory);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
});

// POST /api/products
router.post("/", authenticate, requireRole(["ADMIN"]), async (req, res) => {
  try {
    const input: ProductInput = req.body;

    if (!input.name || typeof input.price !== "number" || !input.productType) {
      return res.status(400).json({
        error: "Missing required fields: name, price, and productType",
      });
    }

    const createData: Prisma.ProductCreateInput = {
      name: input.name,
      description: input.description ?? null,
      price: input.price,
      productType: input.productType,
      sku: input.sku ?? null,
      compareAtPrice: input.compareAtPrice ?? null,
      inventory: input.inventory ?? 0,
      weight: input.weight ?? null,
      strainType: input.strainType ?? null,
      cbdContent: input.cbdContent ?? null,
      thcContent: input.thcContent ?? null,
      size: input.size ?? null,
      tags: input.tags ?? [],
      images: input.images ?? [],
      user: { connect: { id: req.user!.id } },
    };

    if (input.categoryId) {
      createData.category = { connect: { id: input.categoryId } };
    }

    const product = await prisma.product.create({ data: createData });
    clearCache("dashboard-stats");
    clearCache("products");
    res.status(201).json(product);
  } catch (error: unknown) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Failed to create product" });
  }
});

// PUT /api/products/:id
router.put("/:id", authenticate, requireRole(["ADMIN"]), async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "Product ID is required" });
  }

  const updateInput: Partial<ProductInput> = req.body;

  const existingProduct = await prisma.product.findUnique({
    where: { id: id as string },
  });

  if (!existingProduct) {
    return res.status(404).json({ error: "Product not found" });
  }

  const updateData = buildProductUpdateData(updateInput);

  const updatedProduct = await prisma.product.update({
    where: { id: id as string },
    data: updateData,
  });

  res.json(updatedProduct);
  clearCache("dashboard-stats");
  clearCache("products");
});

// DELETE /api/products/:id
// DELETE /api/products/:id - Soft delete product (Admin only)
router.delete(
  "/:id",
  authenticate,
  requireRole(["ADMIN"]),
  async (req, res) => {
    try {
      const { id } = req.params;

      // Narrow id early (required for Prisma WhereUniqueInput)
      if (!id) {
        return res.status(400).json({ error: "Product ID is required" });
      }

      // Verify product exists
      const existingProduct = await prisma.product.findUnique({
        where: { id: id as string },
      });

      if (!existingProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      // Soft delete: mark as unavailable
      await prisma.product.update({
        where: { id: id as string },
        data: { isAvailable: false },
      });

      // 204 = successful request, no response body
      res.status(204).send();
      clearCache("dashboard-stats");
      clearCache("products");
    } catch (error: unknown) {
      console.error("Error deleting product:", error);
      res.status(500).json({ error: "Failed to delete product" });
    }
  },
);

export default router;
