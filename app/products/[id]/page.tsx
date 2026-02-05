import { Metadata } from "next";
import { ProductDetailClient } from "./ProductDetailClient";

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/products/${params.id}`, {
      cache: 'no-store',
    });
    
    if (res.ok) {
      const { product } = await res.json();
      
      return {
        title: `${product.name} | GLOBAL CITY`,
        description: product.description || `Shop ${product.name} at GLOBAL CITY. Premium ${product.category} for men.`,
        openGraph: {
          title: product.name,
          description: product.description || `Shop ${product.name} at GLOBAL CITY`,
          images: product.images && product.images.length > 0 
            ? [{ url: product.images[0], width: 1200, height: 630, alt: product.name }]
            : [],
        },
        twitter: {
          card: 'summary_large_image',
          title: product.name,
          description: product.description || `Shop ${product.name} at GLOBAL CITY`,
          images: product.images && product.images.length > 0 ? [product.images[0]] : [],
        },
      };
    }
  } catch (error) {
    console.error('Error generating metadata:', error);
  }

  return {
    title: 'Product | GLOBAL CITY',
    description: 'Shop premium men\'s fashion at GLOBAL CITY',
  };
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return <ProductDetailClient productId={params.id} />;
}
