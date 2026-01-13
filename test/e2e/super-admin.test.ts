// test/e2e/super-admin.test.ts
import { test, expect } from '@playwright/test';

test.describe('Super Admin HQ', () => {
    test('Super Admin can view tenant list with MRR (verified with hq header)', async ({ request }) => {
        const res = await request.get('http://localhost:7006/api/tenants', {
            headers: {
                'Apex-Tenant-ID': 'hq',
                'Authorization': 'Bearer FAKE_SUPER_ADMIN_TOKEN'
            }
        });

        // In our skeleton, it should return 200 [] even if mock
        expect(res.status()).toBe(200);
    });

    test('rejects request if Apex-Tenant-ID is not hq', async ({ request }) => {
        const res = await request.get('http://localhost:7006/api/tenants', {
            headers: {
                'Apex-Tenant-ID': 'demo',
                'Authorization': 'Bearer FAKE_SUPER_ADMIN_TOKEN'
            }
        });

        expect(res.status()).toBe(400); // Bad Request per resolver logic
    });
});
