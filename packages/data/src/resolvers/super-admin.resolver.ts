// packages/data/src/resolvers/super-admin.resolver.ts
import { Resolver, Query, Args, Context } from '@nestjs/graphql';
import { UseGuards, ForbiddenException, BadRequestException } from '@nestjs/common';
import { TenantIsolationGuard } from '../../../security/src/guards/tenant-isolation.guard';
import { TenantFilterSchema, LicenseFilterSchema, DateRangeSchema } from '../../../security/src/schemas/super-admin/super-admin.schemas';

@Resolver()
@UseGuards(TenantIsolationGuard)
export class SuperAdminResolver {

    private validateSuperAdmin(context: any) {
        const { user, headers } = context;

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
    async getTenants(@Args('filters') filters: any, @Context() context: any) {
        this.validateSuperAdmin(context);

        // Zod Validation
        const validatedFilters = TenantFilterSchema.parse(filters);

        // Logic: Calls core services (to be implemented)
        return [];
    }

    @Query('licenses')
    async getLicenses(@Args('filters') filters: any, @Context() context: any) {
        this.validateSuperAdmin(context);

        const validatedFilters = LicenseFilterSchema.parse(filters);

        return [];
    }

    @Query('analytics')
    async getAnalytics(@Args('dateRange') dateRange: any, @Context() context: any) {
        this.validateSuperAdmin(context);

        const validatedRange = DateRangeSchema.parse(dateRange);

        return {
            mrr: 0,
            arr: 0,
            activeTenants: 0
        };
    }
}
