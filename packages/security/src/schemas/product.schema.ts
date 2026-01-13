// packages/security/src/schemas/product.schema.ts
import { z } from 'zod';

export const ProductFilterSchema = z.object({
    tenantId: z.string().uuid('Invalid tenant ID'),
    status: z.enum(['draft', 'published']).optional(),
    search: z.string().optional()
});

export const CreateProductSchema = z.object({
    tenantId: z.string().uuid('Invalid tenant ID'),
    name: z.string().min(1, 'Product name is required'),
    slug: z.string().regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
    price: z.number().positive('Price must be positive'),
    description: z.string().optional(),
    images: z.array(z.string().url()).optional(),
    status: z.enum(['draft', 'published']).optional()
});

export const UpdateProductSchema = CreateProductSchema.partial().extend({
    id: z.string().uuid(),
    tenantId: z.string().uuid()
});

export type ProductFilter = z.infer<typeof ProductFilterSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
