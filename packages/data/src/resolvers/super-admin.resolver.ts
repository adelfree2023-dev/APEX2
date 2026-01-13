// packages/data/src/resolvers/super-admin.resolver.ts
import { Resolver, Query, Args, Context } from '@nestjs/graphql';
import { UseGuards, ForbiddenException, BadRequestException, ExecutionContext } from '@nestjs/common';
import { TenantIsolationGuard } from '@apex/security';
import { TenantFilterSchema, LicenseFilterSchema, DateRangeSchema } from '@apex/security';
import { z } from 'zod';

@Resolver()
@UseGuards(TenantIsolationGuard)
export class SuperAdminResolver {

    private validateSuperAdmin(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const { user, headers } = request;

        // Rule: Must be a SUPER_ADMIN
        if (user?.role !== 'SUPER_ADMIN') {
            throw new ForbiddenException('Access restricted to Super Admin only');
        }

        // Rule: Must use the HQ tenant anchor
        if (headers['apex-tenant-id'] !== 'hq') {
            throw new BadRequestException('Super Admin operations must use the HQ tenant context');
        }
    }

    @Query('tenants')
    async getTenants(
        @Args('filters') filters: z.infer<typeof TenantFilterSchema>,
        @Context() context: ExecutionContext
    ) {
        this.validateSuperAdmin(context);

        // Zod Validation
        const validatedFilters = TenantFilterSchema.parse(filters);

        // Logic: Calls core services (to be implemented)
        return [];
    }

    @Query('licenses')
    async getLicenses(
        @Args('filters') filters: z.infer<typeof LicenseFilterSchema>,
        @Context() context: ExecutionContext
    ) {
        this.validateSuperAdmin(context);

        const validatedFilters = LicenseFilterSchema.parse(filters);

        return [];
    }

    @Query('analytics')
    async getAnalytics(
        @Args('dateRange') dateRange: z.infer<typeof DateRangeSchema>,
        @Context() context: ExecutionContext
    ) {
        this.validateSuperAdmin(context);

        const validatedRange = DateRangeSchema.parse(dateRange);

        return {
            mrr: 0,
            arr: 0,
            activeTenants: 0
        };
    }
}
