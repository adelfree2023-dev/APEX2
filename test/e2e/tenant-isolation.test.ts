import { test, expect } from '@playwright/test';

test('rejects request without Apex-Tenant-ID', async ({ request }) => {
    // This test targets the backend API which is mapped to port 7006 on the host
    const res = await request.get('http://localhost:7006/api/products');

    // Rule: Backend MUST reject requests without the tenant header
    expect(res.status()).toBe(400);

    const body = await res.json();
    expect(body).toMatchObject({
        message: 'Missing Apex-Tenant-ID'
    });
});
