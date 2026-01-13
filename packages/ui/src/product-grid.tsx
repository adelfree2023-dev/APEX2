// packages/ui/src/product-grid.tsx
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './card';
import { Button } from './button';

interface Product {
    id: string;
    name: string;
    slug: string;
    price?: number;
    image?: string;
}

interface ProductGridProps {
    products: Product[];
    tenantSlug: string;
}

export function ProductGrid({ products, tenantSlug }: ProductGridProps) {
    if (products.length === 0) {
        return (
            <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No products available yet.</p>
            </div>
        );
    }

    return (
        <>
            {products.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        {product.image && (
                            <div className="aspect-square bg-gray-200 rounded-md mb-4" />
                        )}
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {product.price && (
                            <p className="text-2xl font-bold text-green-600">
                                ${product.price}
                            </p>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            onClick={() => {
                                // TODO: Add to cart functionality
                                console.log(`Added ${product.name} to cart for ${tenantSlug}`);
                            }}
                        >
                            Add to Cart
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </>
    );
}
