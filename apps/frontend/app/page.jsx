import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import HeroSection from './components/sections/HeroSection';
import Categories from './components/sections/Categories';
import SeasonalPicksSection from './components/sections/SeasonalPicksSection';
import FeaturedProductsSection from './components/sections/FeaturedProductsSection';
import TestimonialsSection from './components/sections/TestimonialsSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        <HeroSection />
        <Categories />
        <SeasonalPicksSection />
        <FeaturedProductsSection />
        <TestimonialsSection />
      </main>
      
      <Footer />
    </div>
  );
}

