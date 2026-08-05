import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import HeroSection from './components/sections/HeroSection';
import Categories from './components/sections/Categories';
import SeasonalPicksSection from './components/sections/SeasonalPicksSection';
import FeaturedProductsSection from './components/sections/FeaturedProductsSection';
import TestimonialsSection from './components/sections/TestimonialsSection';
import { fetchHomeCategories, fetchHomeProducts } from './lib/home-data';

export default async function Home() {
  const [products, categories] = await Promise.all([
    fetchHomeProducts(12),
    fetchHomeCategories()
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main>
        <HeroSection initialProducts={products} />
        <Categories initialCategories={categories} />
        <SeasonalPicksSection />
        <FeaturedProductsSection initialProducts={products} />
        <TestimonialsSection />
      </main>

      <Footer />
    </div>
  );
}
