// apps/storefront/app/(auth)/login/page.tsx
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

// استخدام المكونات من packages/ui مباشرة - بدون imports
// سنستخدم HTML عادي بدلاً من shadcn components

export default function LoginPage() {
    const params = useParams();
    const router = useRouter();
    const tenantSlug = params.tenant as string;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Apex-Tenant-ID': tenantSlug
                },
                body: JSON.stringify({
                    tenantId: tenantSlug,
                    email,
                    password
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Login failed');
            }

            const data = await response.json();

            // Store token
            localStorage.setItem('auth_token', data.token);

            // Redirect to storefront
            router.push(`/${tenantSlug}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>
                        Login to {tenantSlug} store
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Your password"
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>

                        <p className="text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <a href={`/${tenantSlug}/register`} className="text-blue-600 hover:underline">
                                Register
                            </a>
                        </p>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
