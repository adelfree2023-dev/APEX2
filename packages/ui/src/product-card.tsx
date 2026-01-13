// packages/ui/src/product-card.tsx
import { Card, CardContent, CardFooter, CardHeader } from './card';
import { Button } from './button';

interface Product {
    id: string;
    name: string;
    slug: string;
    price: number;
    images?: string[];
}

interface ProductCardProps {
    product: Product;
    tenantSlug: string;
}

export function ProductCard({ product, tenantSlug }: ProductCardProps) {
    const imageUrl = product.images && product.images.length > 0
        ? product.images[0]
        : null;

    return (
        <Card className="hover:shadow-xl transition-shadow">
            <CardHeader className="p-0">
                <a href={`/${tenantSlug}/product/${product.slug}`}>
                    <div className="aspect-square bg-gray-200 rounded-t-lg overflow-hidden">
                        {imageUrl ? (
                            <img
                                src={imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <p className="text-gray-400">No image</p>
                            </div>
                        )}
                    </div>
                </a>
            </CardHeader>
            <CardContent className="p-4">
                <a href={`/${tenantSlug}/product/${product.slug}`}>
                    <h3 className="font-semibold text-lg text-gray-900 hover:text-blue-600 mb-2">
                        {product.name}
                    </h3>
                </a>
                <p className="text-2xl font-bold text-green-600">
                    ${product.price.toFixed(2)}
                </p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
                <Button
                    className="w-full"
                    onClick={() => {
                        // TODO: Add to cart functionality
                        console.log(`Added ${product.name} to cart`);
                    }}
                >
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    );
}
