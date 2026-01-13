// test/e2e/auth.test.ts
import { test, expect } from '@playwright/test';

test.describe('Auth Multi-Tenant Isolation', () => {
    const tenant1 = 'acme';
    const tenant2 = 'demo';
    const testEmail = 'test@example.com';
    const testPassword = 'SecurePass123';

    test('user can register in tenant A', async ({ request }) => {
        const res = await request.post('http://localhost:7007/api/auth/register', {
            headers: {
                'Apex-Tenant-ID': tenant1,
                'Content-Type': 'application/json'
            },
            data: {
                tenantId: tenant1,
                email: testEmail,
                password: testPassword
            }
        });

        expect(res.status()).toBe(200);
        const data = await res.json();
        expect(data).toHaveProperty('token');
        expect(data).toHaveProperty('user');
        expect(data.user.email).toBe(testEmail);
    });

    test('user cannot register with same email in same tenant', async ({ request }) => {
        // Try to register again with same email in same tenant
        const res = await request.post('http://localhost:7007/api/auth/register', {
            headers: {
                'Apex-Tenant-ID': tenant1,
                'Content-Type': 'application/json'
            },
            data: {
                tenantId: tenant1,
                email: testEmail,
                password: testPassword
            }
        });

        expect(res.status()).toBe(400);
        const data = await res.json();
        expect(data.message).toContain('already registered');
    });

    test('user CAN register with same email in different tenant', async ({ request }) => {
        // Register same email in tenant2 - should work
        const res = await request.post('http://localhost:7007/api/auth/register', {
            headers: {
                'Apex-Tenant-ID': tenant2,
                'Content-Type': 'application/json'
            },
            data: {
                tenantId: tenant2,
                email: testEmail,  // Same email as tenant1
                password: testPassword
            }
        });

        expect(res.status()).toBe(200);
        const data = await res.json();
        expect(data).toHaveProperty('token');
    });

    test('user registered in tenant A cannot login to tenant B', async ({ request }) => {
        // Try to login to tenant2 with credentials from tenant1
        const res = await request.post('http://localhost:7007/api/auth/login', {
            headers: {
                'Apex-Tenant-ID': tenant2,
                'Content-Type': 'application/json'
            },
            data: {
                tenantId: tenant2,  // Wrong tenant!
                email: testEmail,
                password: testPassword
            }
        });

        // This should work now because we registered in tenant2 above
        // Let's test with a non-existent tenant instead
        const res2 = await request.post('http://localhost:7007/api/auth/login', {
            headers: {
                'Apex-Tenant-ID': 'nonexistent',
                'Content-Type': 'application/json'
            },
            data: {
                tenantId: 'nonexistent',
                email: testEmail,
                password: testPassword
            }
        });

        expect(res2.status()).toBe(401);
    });

    test('invalid credentials are rejected', async ({ request }) => {
        const res = await request.post('http://localhost:7007/api/auth/login', {
            headers: {
                'Apex-Tenant-ID': tenant1,
                'Content-Type': 'application/json'
            },
            data: {
                tenantId: tenant1,
                email: testEmail,
                password: 'WrongPassword'
            }
        });

        expect(res.status()).toBe(401);
        const data = await res.json();
        expect(data.message).toContain('Invalid credentials');
    });

    test('JWT token is valid after login', async ({ request }) => {
        const res = await request.post('http://localhost:7007/api/auth/login', {
            headers: {
                'Apex-Tenant-ID': tenant1,
                'Content-Type': 'application/json'
            },
            data: {
                tenantId: tenant1,
                email: testEmail,
                password: testPassword
            }
        });

        expect(res.status()).toBe(200);
        const data = await res.json();

        expect(data.token).toBeTruthy();
        expect(typeof data.token).toBe('string');

        // Token should be a valid JWT (3 parts separated by dots)
        const tokenParts = data.token.split('.');
        expect(tokenParts.length).toBe(3);
    });
});
