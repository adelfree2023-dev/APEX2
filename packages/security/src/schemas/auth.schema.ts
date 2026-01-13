// packages/security/src/schemas/auth.schema.ts
import { z } from 'zod';

export const RegisterSchema = z.object({
    tenantId: z.string().uuid('Invalid tenant ID'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters')
});

export const LoginSchema = z.object({
    tenantId: z.string().uuid('Invalid tenant ID'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
});

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
