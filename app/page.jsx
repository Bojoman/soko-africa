import Header from './components/ui/Header';
import Footer from './components/ui/Footer';
import HeroSection from './components/sections/HeroSection';
import CategoriesSection from './components/sections/CategoriesSection';
import SeasonalPicksSection from './components/sections/SeasonalPicksSection';
import FeaturedProductsSection from './components/sections/FeaturedProductsSection';
import TestimonialsSection from './components/sections/TestimonialsSection';
import WhyChooseUsSection from './components/sections/WhyChooseUsSection';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        <HeroSection />
        <CategoriesSection />
        <SeasonalPicksSection />
        <FeaturedProductsSection />
        <TestimonialsSection />
        <WhyChooseUsSection />
      </main>
      
      <Footer />
    </div>
  );
}
