// packages/security/src/schemas/super-admin/super-admin.schemas.ts
import { z } from 'zod';

export const TenantFilterSchema = z.object({
    status: z.enum(['active', 'suspended', 'pending']).optional(),
    search: z.string().optional(),
});

export const LicenseFilterSchema = z.object({
    status: z.enum(['active', 'expired', 'suspended']).optional(),
    tenantId: z.string().optional(),
});

export const DateRangeSchema = z.object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
});
