// apps/storefront/app/[tenant]/page.tsx
import { notFound } from 'next/navigation';

interface StorefrontPageProps {
    params: {
        tenant: string;
    };
}

export default async function StorefrontPage({ params }: StorefrontPageProps) {
    const { tenant } = params;

    // Requirement: Fetch products only for this tenant
    // TODO: Connect to /api/products with Apex-Tenant-ID header

    return (
        <main className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {tenant} Store
                    </h1>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Product Grid will go here */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Placeholder for products */}
                    <p className="col-span-full text-center text-gray-500">
                        Products loading... (tenant: {tenant})
                    </p>
                </div>
            </div>
        </main>
    );
}
