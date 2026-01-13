// test/e2e/storefront.test.ts
import { test, expect } from '@playwright/test';

test.describe('Storefront Multi-Tenant Isolation', () => {
    test('shows products only for the requested tenant', async ({ request }) => {
        // Test that products for 'acme' tenant are only visible on acme's storefront
        const res = await request.get('http://localhost:7007/acme/products', {
            headers: {
                'Apex-Tenant-ID': 'acme-tenant-id'
            }
        });

        expect(res.status()).toBe(200);
        const products = await res.json();

        // All products should belong to 'acme' tenant
        products.forEach((product: { tenantId: string }) => {
            expect(product.tenantId).toBe('acme-tenant-id');
        });
    });

    test('rejects showing products from different tenant', async ({ request }) => {
        // Try to request tenant B's products while on tenant A's storefront
        const res = await request.get('http://localhost:7007/acme/products', {
            headers: {
                'Apex-Tenant-ID': 'different-tenant-id'  // ← Wrong tenant!
            }
        });

        // Should either return empty or reject
        expect(res.status()).toBe(400);  // Or 200 with empty array
    });

    test('product detail page shows only own tenant products', async ({ request }) => {
        const res = await request.get('http://localhost:7007/acme/products/cool-shirt', {
            headers: {
                'Apex-Tenant-ID': 'acme-tenant-id'
            }
        });

        expect(res.status()).toBe(200);
        const product = await res.json();
        expect(product.tenantId).toBe('acme-tenant-id');
    });
});
