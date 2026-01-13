// apps/storefront/app/[tenant]/product/[slug]/page.tsx
import { notFound } from 'next/navigation';

interface ProductPageProps {
    params: {
        tenant: string;
        slug: string;
    };
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { tenant, slug } = params;

    // TODO: Fetch product from API with tenantId and slug

    return (
        <main className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="md:flex">
                        {/* Image Gallery */}
                        <div className="md:w-1/2 bg-gray-200 aspect-square flex items-center justify-center">
                            <p className="text-gray-500">Product Images</p>
                        </div>

                        {/* Product Details */}
                        <div className="md:w-1/2 p-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">
                                Product: {slug}
                            </h1>

                            <p className="text-2xl font-bold text-green-600 mb-6">
                                $0.00
                            </p>

                            <p className="text-gray-600 mb-6">
                                Product description will appear here...
                            </p>

                            <button className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors">
                                Add to Cart
                            </button>

                            <p className="text-sm text-gray-500 mt-4">
                                Store: {tenant}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
