// apps/storefront/app/api/auth/login/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { LoginSchema } from '@apex/security';
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
        const validated = LoginSchema.parse({
            tenantId,
            email: body.email,
            password: body.password
        });

        // Find user IN THIS TENANT ONLY
        const user = await prisma.user.findFirst({
            where: {
                email: validated.email,
                tenantId: validated.tenantId
            }
        });

        if (!user) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(validated.password, user.password);

        if (!isValidPassword) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

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
        console.error('Login error:', error);
        return NextResponse.json(
            { message: error instanceof Error ? error.message : 'Login failed' },
            { status: 401 }
        );
    }
}
