// test/e2e/products.test.ts
import { test, expect } from '@playwright/test';

test.describe('Products Multi-Tenant Isolation', () => {
    const tenant1 = 'acme';
    const tenant2 = 'demo';

    test('shows only published products to customers', async ({ request }) => {
        // Assume we have both published and draft products
        const res = await request.get(`http://localhost:7007/api/products?tenantId=${tenant1}`, {
            headers: {
                'Apex-Tenant-ID': tenant1
            }
        });

        expect(res.status()).toBe(200);
        const products = await res.json();

        // All products should be published
        products.forEach((product: { status: string }) => {
            expect(product.status).toBe('published');
        });
    });

    test('products from tenant A not visible in tenant B shop', async ({ request }) => {
        const res = await request.get(`http://localhost:7007/api/products?tenantId=${tenant2}`, {
            headers: {
                'Apex-Tenant-ID': tenant2
            }
        });

        expect(res.status()).toBe(200);
        const products = await res.json();

        // All products should belong to tenant2
        products.forEach((product: { tenantId: string }) => {
            expect(product.tenantId).toBe(tenant2);
        });
    });

    test('slug can be same across different tenants', async ({ request }) => {
        // This test verifies @@unique([slug, tenantId]) constraint
        // Same slug in different tenants should be allowed

        // Create product with slug "test-product" in tenant1
        const res1 = await request.post('http://localhost:7007/api/products', {
            headers: {
                'Apex-Tenant-ID': tenant1,
                'Content-Type': 'application/json'
            },
            data: {
                tenantId: tenant1,
                name: 'Test Product (ACME)',
                slug: 'test-product',
                price: 29.99,
                status: 'published'
            }
        });

        // Create product with SAME slug in tenant2 (should succeed)
        const res2 = await request.post('http://localhost:7007/api/products', {
            headers: {
                'Apex-Tenant-ID': tenant2,
                'Content-Type': 'application/json'
            },
            data: {
                tenantId: tenant2,
                name: 'Test Product (Demo)',
                slug: 'test-product',
                price: 19.99,
                status: 'published'
            }
        });

        expect(res1.status()).toBe(200);
        expect(res2.status()).toBe(200);
    });

    test('draft products not visible to customers', async ({ request }) => {
        // Get products as customer (not admin)
        const res = await request.get(`http://localhost:7007/api/products?tenantId=${tenant1}`, {
            headers: {
                'Apex-Tenant-ID': tenant1
            }
        });

        expect(res.status()).toBe(200);
        const products = await res.json();

        // No draft products should be returned
        const hasDraftProducts = products.some((p: { status: string }) => p.status === 'draft');
        expect(hasDraftProducts).toBe(false);
    });

    test('product detail page loads correctly', async ({ page }) => {
        // Navigate to product detail page
        await page.goto('http://localhost:7007/acme/product/test-product');

        // Check if product name is displayed
        await expect(page.locator('h1')).toContainText('Test Product');

        // Check if price is displayed
        await expect(page.locator('text=$')).toBeVisible();

        // Check if add to cart button exists
        await expect(page.locator('button:has-text("Add to Cart")')).toBeVisible();
    });

    test('SEO meta tags are present on product page', async ({ page }) => {
        await page.goto('http://localhost:7007/acme/product/test-product');

        // Check for title tag
        const title = await page.title();
        expect(title).toBeTruthy();
        expect(title.length).toBeGreaterThan(0);
    });
});
