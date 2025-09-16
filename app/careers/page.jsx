import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { Briefcase, MapPin, Clock, Users, Heart, Globe } from 'lucide-react';

export const metadata = {
  title: "Careers - SokoAfrica",
  description: "Join our mission to connect Africa with the world. Explore career opportunities at SokoAfrica."
};

export default function CareersPage() {
  const benefits = [
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "Health & Wellness",
      description: "Comprehensive health insurance, mental health support, and wellness programs"
    },
    {
      icon: <Globe className="w-8 h-8 text-blue-500" />,
      title: "Remote First",
      description: "Work from anywhere with flexible hours and home office setup allowance"
    },
    {
      icon: <Users className="w-8 h-8 text-green-500" />,
      title: "Learning & Growth",
      description: "Professional development budget, conferences, and internal training programs"
    },
    {
      icon: <Briefcase className="w-8 h-8 text-purple-500" />,
      title: "Equity & Impact",
      description: "Equity participation and direct involvement in connecting African businesses globally"
    }
  ];

  const jobOpenings = [
    {
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "Remote (Africa/Europe)",
      type: "Full-time",
      description: "Join our tech team to build beautiful, scalable web applications that connect African businesses with global markets."
    },
    {
      title: "Partnership Manager - West Africa",
      department: "Business Development",
      location: "Lagos, Nigeria",
      type: "Full-time",
      description: "Develop strategic partnerships with artisans, suppliers, and businesses across West Africa."
    },
    {
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      description: "Drive growth through digital marketing campaigns, content creation, and brand building initiatives."
    },
    {
      title: "Customer Success Associate",
      department: "Customer Success",
      location: "Nairobi, Kenya",
      type: "Full-time",
      description: "Ensure exceptional customer experiences and help sellers succeed on our platform."
    },
    {
      title: "Data Analyst",
      department: "Analytics",
      location: "Remote",
      type: "Contract",
      description: "Analyze marketplace data to drive insights and improve platform performance."
    },
    {
      title: "Content Creator (Swahili)",
      department: "Marketing",
      location: "Remote",
      type: "Part-time",
      description: "Create engaging content in Swahili to connect with our East African community."
    }
  ];

  const departments = [
    { name: "Engineering", count: 12, description: "Building the platform that powers African commerce" },
    { name: "Business Development", count: 8, description: "Expanding our network of partners across Africa" },
    { name: "Marketing", count: 6, description: "Telling the story of African craftsmanship to the world" },
    { name: "Customer Success", count: 10, description: "Ensuring every customer has an amazing experience" },
    { name: "Operations", count: 15, description: "Managing logistics and supply chain across continents" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-600 to-green-600 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">Join Our Mission</h1>
            <p className="text-2xl mb-8 max-w-4xl mx-auto">
              Help us connect Africa's finest products and artisans with the global marketplace. 
              Build something meaningful while advancing your career.
            </p>
            <button className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
              View Open Positions
            </button>
          </div>
        </section>

        {/* Company Values */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Join SokoAfrica?</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We're more than just a marketplace - we're a movement to showcase Africa's creativity and entrepreneurship to the world.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Departments */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Teams</h2>
              <p className="text-xl text-gray-600">
                Diverse teams working together to build the future of African commerce
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((dept, index) => (
                <div key={index} className="p-6 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-gray-800">{dept.name}</h3>
                    <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-sm font-semibold">
                      {dept.count} people
                    </span>
                  </div>
                  <p className="text-gray-600">{dept.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Job Openings */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Open Positions</h2>
              <p className="text-xl text-gray-600">
                Ready to make an impact? Check out our current opportunities.
              </p>
            </div>
            
            <div className="space-y-6">
              {jobOpenings.map((job, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-2">
                        <h3 className="text-2xl font-semibold text-gray-800">{job.title}</h3>
                        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-semibold w-fit">
                          {job.department}
                        </span>
                      </div>
                      
                      <div className="flex flex-col md:flex-row md:items-center md:space-x-6 text-gray-600 mb-3">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>{job.type}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600">{job.description}</p>
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:ml-6">
                      <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors w-full md:w-auto">
                        Apply Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Hiring Process</h2>
              <p className="text-xl text-gray-600">
                We believe in a fair and transparent hiring process
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {[
                { step: "1", title: "Application", description: "Submit your application and tell us why you're excited about SokoAfrica" },
                { step: "2", title: "Phone Screen", description: "Quick chat with our team to learn more about you and the role" },
                { step: "3", title: "Technical/Case Study", description: "Showcase your skills through a relevant project or case study" },
                { step: "4", title: "Final Interview", description: "Meet the team and dive deeper into how you'll contribute to our mission" }
              ].map((process, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-orange-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-lg">
                    {process.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{process.title}</h3>
                  <p className="text-gray-600">{process.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-orange-600 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Join Our Team?</h2>
            <p className="text-xl mb-8">
              Don't see a perfect fit? We're always looking for talented people who share our passion for Africa.
            </p>
            <div className="space-x-4">
              <button className="bg-white text-orange-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
                Browse All Jobs
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-orange-600 transition-colors">
                Send General Application
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
