// packages/data/src/resolvers/product.resolver.ts
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards, ForbiddenException } from '@nestjs/common';
import { TenantIsolationGuard } from '@apex/security';
import { ProductFilterSchema, CreateProductSchema, UpdateProductSchema } from '@apex/security';
import { z } from 'zod';
import { PrismaService } from '../services/prisma.service';

@Resolver()
@UseGuards(TenantIsolationGuard)
export class ProductResolver {
    constructor(private prisma: PrismaService) { }

    @Query('products')
    async getProducts(
        @Args('tenantId') tenantId: string,
        @Args('filters') filters?: z.infer<typeof ProductFilterSchema>,
        @Args('isAdmin') isAdmin?: boolean
    ) {
        // Zod validation
        const validated = ProductFilterSchema.parse({ tenantId, ...filters });

        // CRITICAL: Customers see ONLY published products
        const statusFilter = isAdmin ? {} : { status: 'published' };

        return this.prisma.product.findMany({
            where: {
                tenantId: validated.tenantId,  // ← Tenant isolation
                ...statusFilter,               // ← Published-only for customers
                ...(validated.search && {
                    OR: [
                        { name: { contains: validated.search, mode: 'insensitive' } },
                        { description: { contains: validated.search, mode: 'insensitive' } }
                    ]
                })
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    @Query('product')
    async getProduct(
        @Args('tenantId') tenantId: string,
        @Args('slug') slug: string,
        @Args('isAdmin') isAdmin?: boolean
    ) {
        // CRITICAL: Customers see ONLY published products
        const statusFilter = isAdmin ? {} : { status: 'published' };

        const product = await this.prisma.product.findFirst({
            where: {
                tenantId,      // ← Tenant isolation
                slug,
                ...statusFilter
            }
        });

        if (!product) {
            throw new ForbiddenException('Product not found');
        }

        return product;
    }

    @Mutation('createProduct')
    async createProduct(
        @Args('data') data: z.infer<typeof CreateProductSchema>
    ) {
        // Zod validation
        const validated = CreateProductSchema.parse(data);

        // Check if slug already exists in this tenant
        const existingProduct = await this.prisma.product.findFirst({
            where: {
                tenantId: validated.tenantId,
                slug: validated.slug
            }
        });

        if (existingProduct) {
            throw new ForbiddenException('Product with this slug already exists in this store');
        }

        return this.prisma.product.create({
            data: {
                name: validated.name,
                slug: validated.slug,
                price: validated.price,
                description: validated.description,
                images: validated.images || [],
                status: validated.status || 'draft',
                tenantId: validated.tenantId
            }
        });
    }

    @Mutation('updateProduct')
    async updateProduct(
        @Args('id') id: string,
        @Args('tenantId') tenantId: string,
        @Args('data') data: z.infer<typeof UpdateProductSchema>
    ) {
        // Verify product belongs to this tenant
        const product = await this.prisma.product.findFirst({
            where: { id, tenantId }
        });

        if (!product) {
            throw new ForbiddenException('Product not found');
        }

        return this.prisma.product.update({
            where: { id },
            data: {
                ...data,
                tenantId  // ← Ensure tenantId doesn't change
            }
        });
    }
}
