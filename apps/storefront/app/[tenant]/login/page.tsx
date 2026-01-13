// apps/storefront/app/[tenant]/login/page.tsx
'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

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
            localStorage.setItem('auth_token', data.token);
            router.push(`/${tenantSlug}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>
                    <p className="text-gray-600 mt-1">Login to {tenantSlug} store</p>
                </div>

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
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="your@email.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="Your password"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <p className="text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <a href={`/${tenantSlug}/register`} className="text-blue-600 hover:underline">
                            Register
                        </a>
                    </p>
                </form>
            </div>
        </div>
    );
}
