import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Products - Men\'s Fashion Collection | GLOBAL CITY',
  description: 'Browse our complete collection of men\'s fashion including bags, hoodies, t-shirts, trousers, jackets, sneakers, and more. Free shipping on orders over £50.',
  openGraph: {
    title: 'Products - Men\'s Fashion Collection | GLOBAL CITY',
    description: 'Browse our complete collection of men\'s fashion. Free shipping on orders over £50.',
    type: 'website',
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

