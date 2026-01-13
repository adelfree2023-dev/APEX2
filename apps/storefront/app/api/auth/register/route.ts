// apps/storefront/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { RegisterSchema } from '@apex/security';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'apex-platform-secret-change-in-production';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const tenantId = req.headers.get('apex-tenant-id') || body.tenantId;

        // Zod validation
        const validated = RegisterSchema.parse({
            tenantId,
            email: body.email,
            password: body.password
        });

        // Check if user exists in this tenant
        const existingUser = await prisma.user.findFirst({
            where: {
                email: validated.email,
                tenantId: validated.tenantId
            }
        });

        if (existingUser) {
            return NextResponse.json(
                { message: 'Email already registered in this store' },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(validated.password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email: validated.email,
                password: hashedPassword,
                tenantId: validated.tenantId,
                role: 'customer'
            }
        });

        // Generate JWT
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                tenantId: user.tenantId,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '15m' }
        );

        return NextResponse.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Registration failed' },
            { status: 400 }
        );
    }
}
