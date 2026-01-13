// packages/data/tests/resolvers/super-admin.test.ts
import { test, expect, describe, beforeEach } from 'vitest';
import { SuperAdminResolver } from '../../src/resolvers/super-admin.resolver';

describe('SuperAdminResolver', () => {
    let resolver: SuperAdminResolver;

    beforeEach(() => {
        resolver = new SuperAdminResolver();
    });

    test('should throw ForbiddenException if user is not SUPER_ADMIN', async () => {
        const context = { user: { role: 'STAFF' }, headers: { 'apex-tenant-id': 'hq' } };
        await expect(resolver.getTenants({}, context)).rejects.toThrow('Access restricted to Super Admin only');
    });

    test('should throw BadRequestException if tenantId is not hq', async () => {
        const context = { user: { role: 'SUPER_ADMIN' }, headers: { 'apex-tenant-id': 'demo' } };
        await expect(resolver.getTenants({}, context)).rejects.toThrow('Super Admin operations must use the HQ tenant context');
    });

    test('should return empty array when authorized', async () => {
        const context = { user: { role: 'SUPER_ADMIN' }, headers: { 'apex-tenant-id': 'hq' } };
        const result = await resolver.getTenants({}, context);
        expect(result).toEqual([]);
    });
});
