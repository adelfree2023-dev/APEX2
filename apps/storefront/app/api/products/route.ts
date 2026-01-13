// apps/storefront/app/api/products/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { ProductFilterSchema } from '@apex/security';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
    try {
        const searchParams = req.nextUrl.searchParams;
        const tenantId = req.headers.get('apex-tenant-id') || searchParams.get('tenantId');
        const search = searchParams.get('search');
        const isAdmin = searchParams.get('isAdmin') === 'true';

        if (!tenantId) {
            return NextResponse.json(
                { message: 'tenantId is required' },
                { status: 400 }
            );
        }

        // Zod validation
        const validated = ProductFilterSchema.parse({
            tenantId,
            search: search || undefined
        });

        // CRITICAL: Customers see ONLY published products
        const statusFilter = isAdmin ? {} : { status: 'published' };

        const products = await prisma.product.findMany({
            where: {
                tenantId: validated.tenantId,
                ...statusFilter,
                ...(validated.search && {
                    OR: [
                        { name: { contains: validated.search, mode: 'insensitive' } },
                        { description: { contains: validated.search, mode: 'insensitive' } }
                    ]
                })
            },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error('Products fetch error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Failed to fetch products' },
            { status: 400 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const tenantId = req.headers.get('apex-tenant-id') || body.tenantId;

        // Check if slug already exists in this tenant
        const existingProduct = await prisma.product.findFirst({
            where: {
                tenantId,
                slug: body.slug
            }
        });

        if (existingProduct) {
            return NextResponse.json(
                { message: 'Product with this slug already exists in this store' },
                { status: 400 }
            );
        }

        const product = await prisma.product.create({
            data: {
                name: body.name,
                slug: body.slug,
                price: body.price,
                description: body.description,
                images: body.images || [],
                status: body.status || 'draft',
                tenantId
            }
        });

        return NextResponse.json(product);
    } catch (error) {
        console.error('Product create error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Failed to create product' },
            { status: 400 }
        );
    }
}
