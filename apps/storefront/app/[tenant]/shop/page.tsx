// apps/storefront/app/[tenant]/shop/page.tsx
import { notFound } from 'next/navigation';

interface ShopPageProps {
    params: {
        tenant: string;
    };
}

export default async function ShopPage({ params }: ShopPageProps) {
    const { tenant } = params;

    // TODO: Fetch products from API with Apex-Tenant-ID header

    return (
        <main className="min-h-screen bg-gray-50">
            <header className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        {tenant} Shop
                    </h1>
                    <p className="text-gray-600 mt-2">
                        Browse our products
                    </p>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Product Grid will go here */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {/* Placeholder - will be replaced with actual products */}
                    <p className="col-span-full text-center text-gray-500">
                        Loading products...
                    </p>
                </div>
            </div>
        </main>
    );
}
