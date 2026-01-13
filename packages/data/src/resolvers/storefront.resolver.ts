// packages/data/src/resolvers/storefront.resolver.ts
import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards, BadRequestException } from '@nestjs/common';
import { TenantIsolationGuard } from '@apex/security';
import { ProductFilterSchema } from '@apex/security';
import { z } from 'zod';
import { PrismaService } from '../services/prisma.service';

@Resolver()
@UseGuards(TenantIsolationGuard)
export class StorefrontResolver {
    constructor(private prisma: PrismaService) { }

    @Query('products')
    async getProducts(
        @Args('tenantId') tenantId: string,
        @Args('filters') filters?: z.infer<typeof ProductFilterSchema>
    ) {
        if (!tenantId) {
            throw new BadRequestException('tenantId is required');
        }

        // Zod validation
        const validatedFilters = filters ? ProductFilterSchema.parse(filters) : {};

        // CRITICAL: tenant isolation - WHERE clause MUST include tenantId
        return this.prisma.product.findMany({
            where: {
                tenantId,  // ← This ensures we only fetch products for THIS tenant
                status: 'published',
                ...validatedFilters
            }
        });
    }

    @Query('product')
    async getProduct(
        @Args('tenantId') tenantId: string,
        @Args('slug') slug: string
    ) {
        if (!tenantId || !slug) {
            throw new BadRequestException('tenantId and slug are required');
        }

        // CRITICAL: tenant isolation
        const product = await this.prisma.product.findFirst({
            where: {
                tenantId,  // ← Ensures product belongs to this tenant
                slug
            }
        });

        if (!product) {
            throw new BadRequestException('Product not found');
        }

        return product;
    }
}
