import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send } from 'lucide-react';

export const metadata = {
  title: "Contact Us - SokoAfrica",
  description: "Get in touch with SokoAfrica. Customer support, partnerships, and general inquiries."
};

export default function ContactPage() {
  const contactMethods = [
    {
      icon: <Phone className="w-8 h-8 text-green-600" />,
      title: "Phone Support",
      description: "Speak directly with our customer service team",
      contact: "+254 700 123 456",
      hours: "Mon-Fri: 8AM-8PM EAT"
    },
    {
      icon: <Mail className="w-8 h-8 text-blue-600" />,
      title: "Email Support",
      description: "Send us an email and we'll respond within 24 hours",
      contact: "support@sokoafrica.com",
      hours: "Response within 24 hours"
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-purple-600" />,
      title: "Live Chat",
      description: "Get instant help with your questions",
      contact: "Available on our website",
      hours: "Mon-Fri: 8AM-8PM EAT"
    },
    {
      icon: <MapPin className="w-8 h-8 text-orange-600" />,
      title: "Visit Our Office",
      description: "Meet us in person at our Nairobi headquarters",
      contact: "Westlands, Nairobi, Kenya",
      hours: "Mon-Fri: 9AM-5PM EAT"
    }
  ];

  const departments = [
    {
      name: "Customer Support",
      email: "support@sokoafrica.com",
      description: "Order issues, returns, account help"
    },
    {
      name: "Business Partnerships",
      email: "partners@sokoafrica.com",
      description: "B2B inquiries, wholesale, collaborations"
    },
    {
      name: "Seller Support",
      email: "sellers@sokoafrica.com",
      description: "Become a seller, seller account help"
    },
    {
      name: "Media & Press",
      email: "press@sokoafrica.com",
      description: "Press inquiries, media requests"
    },
    {
      name: "Technical Support",
      email: "tech@sokoafrica.com",
      description: "Website issues, technical problems"
    },
    {
      name: "General Inquiries",
      email: "hello@sokoafrica.com",
      description: "All other questions and feedback"
    }
  ];

  const offices = [
    {
      city: "Nairobi",
      country: "Kenya",
      address: "Westlands Business Center, Ring Road Westlands",
      phone: "+254 700 123 456",
      isHeadquarters: true
    },
    {
      city: "Lagos",
      country: "Nigeria",
      address: "Victoria Island, Lagos State",
      phone: "+234 901 234 5678",
      isHeadquarters: false
    },
    {
      city: "Cape Town",
      country: "South Africa",
      address: "V&A Waterfront, Cape Town",
      phone: "+27 21 123 4567",
      isHeadquarters: false
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-600 to-green-600 text-white py-20">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <h1 className="text-5xl font-bold mb-6">Get in Touch</h1>
            <p className="text-2xl mb-8 max-w-3xl mx-auto">
              We're here to help! Whether you have questions about your order, 
              want to partner with us, or just want to say hello.
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">How Can We Help You?</h2>
              <p className="text-xl text-gray-600">
                Choose the best way to reach us
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">
                    {method.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{method.title}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{method.description}</p>
                  <div className="text-gray-800 font-semibold mb-2">{method.contact}</div>
                  <div className="text-sm text-gray-500">{method.hours}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Send Us a Message</h2>
              <p className="text-xl text-gray-600">
                Fill out the form below and we'll get back to you as soon as possible
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">First Name</label>
                    <input className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200" type="text" required />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Last Name</label>
                    <input className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200" type="text" required />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200" type="email" required />
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2">Phone (Optional)</label>
                    <input className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200" type="tel" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Subject</label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200" required>
                    <option value="">Select a subject</option>
                    <option value="order">Order Support</option>
                    <option value="return">Returns & Exchanges</option>
                    <option value="partnership">Business Partnership</option>
                    <option value="seller">Become a Seller</option>
                    <option value="technical">Technical Issue</option>
                    <option value="general">General Inquiry</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Message</label>
                  <textarea className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200" rows="6" placeholder="Please provide as much detail as possible..." required></textarea>
                </div>
                
                <div className="text-center">
                  <button className="bg-orange-600 hover:bg-orange-700 text-white px-12 py-4 rounded-lg font-bold text-lg transition-colors inline-flex items-center">
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Department Contacts */}
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Direct Department Contacts</h2>
              <p className="text-xl text-gray-600">
                Reach out directly to the right team for faster assistance
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {departments.map((dept, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{dept.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm">{dept.description}</p>
                  <a href={`mailto:${dept.email}`} className="text-orange-600 hover:text-orange-700 font-semibold">
                    {dept.email}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Office Locations */}
        <section className="py-16 bg-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Offices</h2>
              <p className="text-xl text-gray-600">
                Visit us in person across Africa
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {offices.map((office, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-8 text-center">
                  <div className="flex justify-center mb-4">
                    <MapPin className="w-12 h-12 text-orange-600" />
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">{office.city}</h3>
                    <p className="text-gray-600">{office.country}</p>
                    {office.isHeadquarters && (
                      <span className="inline-block bg-orange-100 text-orange-600 px-2 py-1 rounded-full text-xs font-semibold mt-1">
                        Headquarters
                      </span>
                    )}
                  </div>
                  
                  <div className="text-gray-700 mb-4">
                    <p className="mb-2">{office.address}</p>
                    <p className="flex items-center justify-center">
                      <Phone className="w-4 h-4 mr-2" />
                      {office.phone}
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-center text-gray-600 text-sm">
                    <Clock className="w-4 h-4 mr-2" />
                    Mon-Fri: 9AM-5PM
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

