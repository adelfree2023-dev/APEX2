// packages/data/src/resolvers/auth.resolver.ts
import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { RegisterSchema, LoginSchema } from '@apex/security';
import { z } from 'zod';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../services/prisma.service';

const JWT_SECRET = process.env.JWT_SECRET || 'apex-platform-secret-change-in-production';
const JWT_EXPIRES_IN = '15m';

interface JWTPayload {
    userId: string;
    email: string;
    tenantId: string;
    role: string;
}

@Resolver()
export class AuthResolver {
    constructor(private prisma: PrismaService) { }

    @Mutation('register')
    async register(
        @Args('tenantId') tenantId: string,
        @Args('email') email: string,
        @Args('password') password: string
    ) {
        // Zod validation
        const validated = RegisterSchema.parse({ tenantId, email, password });

        // CRITICAL: Check if user already exists in THIS tenant
        const existingUser = await this.prisma.user.findFirst({
            where: {
                email: validated.email,
                tenantId: validated.tenantId  // ← Ensures we check within this tenant only
            }
        });

        if (existingUser) {
            throw new BadRequestException('Email already registered in this store');
        }

        // Hash password with bcrypt
        const hashedPassword = await bcrypt.hash(validated.password, 10);

        // Create user
        const user = await this.prisma.user.create({
            data: {
                email: validated.email,
                password: hashedPassword,
                tenantId: validated.tenantId,
                role: 'customer'  // Default role for storefront users
            }
        });

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                tenantId: user.tenantId,
                role: user.role
            } as JWTPayload,
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        };
    }

    @Mutation('login')
    async login(
        @Args('tenantId') tenantId: string,
        @Args('email') email: string,
        @Args('password') password: string
    ) {
        // Zod validation
        const validated = LoginSchema.parse({ tenantId, email, password });

        // CRITICAL: Find user IN THIS TENANT ONLY
        const user = await this.prisma.user.findFirst({
            where: {
                email: validated.email,
                tenantId: validated.tenantId  // ← Prevents login from different tenant
            }
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Verify password
        const isValidPassword = await bcrypt.compare(validated.password, user.password);

        if (!isValidPassword) {
            throw new UnauthorizedException('Invalid credentials');
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                tenantId: user.tenantId,
                role: user.role
            } as JWTPayload,
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role
            }
        };
    }
}
