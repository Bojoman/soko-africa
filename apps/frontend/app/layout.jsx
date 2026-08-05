import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { cn } from '@/lib/utils';

// Single family keeps LCP/CLS lean; weights cover body → font-extrabold (800).
const inter = Inter({
  // Drives both Tailwind `font-sans` and body text (see globals.css).
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  preload: true
});

export const metadata = {
  title: 'Soko Africa - Authentic African Products | Global Marketplace',
  description:
    'Discover authentic African products from across the continent. Shop handcrafted goods, textiles, coffee, and more. Supporting African artisans and businesses worldwide.',
  keywords:
    'African products, handcrafted goods, African textiles, coffee, authentic, marketplace, artisans, fair trade',
  openGraph: {
    title: 'Soko Africa - Authentic African Products',
    description: 'Discover authentic African products from across the continent',
    type: 'website',
    locale: 'en_US'
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={cn(inter.variable, 'font-sans')}>
      <body className="antialiased" suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>{children}</WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
