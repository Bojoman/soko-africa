import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { Leaf, Recycle, Heart, Globe, Users, TreePine } from 'lucide-react';

export const metadata = {
  title: "Sustainability - SokoAfrica",
  description: "Learn about our commitment to sustainable practices and supporting African communities."
};

export default function SustainabilityPage() {
  const initiatives = [
    {
      icon: <Leaf className="w-12 h-12 text-green-600" />,
      title: "Eco-Friendly Packaging",
      description: "100% recyclable and biodegradable packaging materials sourced locally when possible.",
      stats: "95% reduction in plastic use since 2023"
    },
    {
      icon: <Users className="w-12 h-12 text-blue-600" />,
      title: "Fair Trade Practices",
      description: "Ensuring fair wages and working conditions for all artisans and producers in our network.",
      stats: "5,000+ artisans supported across 15 countries"
    },
    {
      icon: <TreePine className="w-12 h-12 text-emerald-600" />,
      title: "Carbon Neutral Shipping",
      description: "Offsetting 100% of our shipping emissions through verified carbon offset programs.",
      stats: "50,000 tons CO2 offset annually"
    },
    {
      icon: <Recycle className="w-12 h-12 text-purple-600" />,
      title: "Circular Economy",
      description: "Supporting businesses that repurpose materials and create products from recycled goods.",
      stats: "30% of products use recycled materials"
    }
  ];

  const goals = [
    {
      year: "2024",
      achievements: [
        "100% carbon-neutral shipping",
        "Zero single-use plastic packaging",
        "10,000 trees planted through partner programs",
        "Fair trade certification for 80% of suppliers"
      ]
    },
    {
      year: "2025",
      achievements: [
        "Renewable energy for all operations",
        "100% sustainable packaging materials",
        "Direct impact measurement for all communities",
        "Circular economy partnerships in 20 countries"
      ]
    },
    {
      year: "2026",
      achievements: [
        "Net positive environmental impact",
        "1 million trees planted",
        "100,000 livelihoods directly supported",
        "Carbon-negative operations"
      ]
    }
  ];

  const impactAreas = [
    {
      title: "Economic Empowerment",
      description: "Creating sustainable livelihoods for African artisans and entrepreneurs",
      icon: <Heart className="w-8 h-8 text-red-500" />,
      metrics: [
        { label: "Artisans Supported", value: "5,247" },
        { label: "Average Income Increase", value: "156%" },
        { label: "New Jobs Created", value: "2,891" }
      ]
    },
    {
      title: "Environmental Protection",
      description: "Preserving Africa's natural heritage through sustainable practices",
      icon: <Globe className="w-8 h-8 text-green-500" />,
      metrics: [
        { label: "Trees Planted", value: "12,450" },
        { label: "Plastic Waste Reduced", value: "95%" },
        { label: "Water Conservation", value: "2.3M liters" }
      ]
    },
    {
      title: "Community Development",
      description: "Investing in education, healthcare, and infrastructure",
      icon: <Users className="w-8 h-8 text-blue-500" />,
      metrics: [
        { label: "Communities Reached", value: "156" },
        { label: "Educational Programs", value: "89" },
        { label: "Healthcare Initiatives", value: "34" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">Building a Sustainable Future</h1>
              <p className="text-2xl mb-8">
                Our commitment to the planet, people, and prosperity guides everything we do. 
                Together, we're creating positive change across Africa and beyond.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
                  Our Impact Report
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-green-600 transition-colors">
                  Get Involved
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Sustainability Initiatives */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Sustainability Initiatives</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                From eco-friendly packaging to fair trade practices, we're committed to making a positive impact.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {initiatives.map((initiative, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-8 hover:shadow-lg transition-shadow">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-6">
                      {initiative.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-800 mb-3">{initiative.title}</h3>
                      <p className="text-gray-600 mb-4">{initiative.description}</p>
                      <div className="bg-gray-100 rounded-lg p-3">
                        <p className="font-semibold text-gray-800">{initiative.stats}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Areas */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Measuring Our Impact</h2>
              <p className="text-xl text-gray-600">
                Real data showing the positive change we're creating together
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {impactAreas.map((area, index) => (
                <div key={index} className="text-center">
                  <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    {area.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">{area.title}</h3>
                  <p className="text-gray-600 mb-6">{area.description}</p>
                  
                  <div className="space-y-4">
                    {area.metrics.map((metric, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-4">
                        <div className="text-3xl font-bold text-orange-600 mb-1">{metric.value}</div>
                        <div className="text-sm text-gray-600">{metric.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Sustainability Goals */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Sustainability Roadmap</h2>
              <p className="text-xl text-gray-600">
                Ambitious goals with clear timelines and measurable outcomes
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {goals.map((goal, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-orange-600 mb-2">{goal.year}</div>
                    <div className="h-1 bg-orange-600 w-16 mx-auto rounded"></div>
                  </div>
                  
                  <ul className="space-y-3">
                    {goal.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Partners Section */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Sustainability Partners</h2>
              <p className="text-xl text-gray-600">
                Working with leading organizations to maximize our positive impact
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                "UN Global Compact",
                "Fair Trade International",
                "Carbon Trust",
                "Trees for the Future",
                "African Development Bank",
                "WWF Africa",
                "Green Belt Movement",
                "One Tree Planted"
              ].map((partner, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center text-center">
                  <span className="font-semibold text-gray-700">{partner}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Get Involved */}
        <section className="py-16 bg-green-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Join Our Sustainability Mission</h2>
            <p className="text-xl mb-8">
              Every purchase makes a difference. Together, we can create a more sustainable and equitable future.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white bg-opacity-20 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3">Shop Consciously</h3>
                <p className="mb-4">Choose products from verified sustainable sellers</p>
                <button className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Browse Eco Products
                </button>
              </div>
              
              <div className="bg-white bg-opacity-20 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3">Become a Partner</h3>
                <p className="mb-4">Join our network of sustainable suppliers</p>
                <button className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Partner With Us
                </button>
              </div>
              
              <div className="bg-white bg-opacity-20 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-3">Support Communities</h3>
                <p className="mb-4">Contribute to our community development programs</p>
                <button className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
