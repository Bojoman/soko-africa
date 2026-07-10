import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, Camera, Globe, Link2 } from 'lucide-react';

export const metadata = {
  title: "Contact Us - Soko Africa",
  description: "Get in touch with Soko Africa. We're here to help with orders, partnerships, or just to chat."
};

export default function ContactPage() {
  const contactMethods = [
    {
      icon: <Phone className="w-8 h-8 text-soko-dark-teal" />,
      title: "Call or WhatsApp",
      description: "Speak with our Nairobi-based support team",
      contact: "+254 700 123 456",
      hours: "Mon-Sat: 8AM-8PM EAT"
    },
    {
      icon: <Mail className="w-8 h-8 text-soko-dark-teal" />,
      title: "Email Us",
      description: "We'll respond within 24 hours, usually faster",
      contact: "support@sokoafrica.com",
      hours: "support@sokoafrica.com"
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-soko-dark-teal" />,
      title: "Live Chat",
      description: "Chat with us on the website or WhatsApp",
      contact: "Click the chat bubble",
      hours: "Mon-Sat: 8AM-8PM EAT"
    },
    {
      icon: <MapPin className="w-8 h-8 text-soko-dark-teal" />,
      title: "Visit Us",
      description: "Come by our Nairobi office",
      contact: "Westlands, Nairobi",
      hours: "Mon-Fri: 9AM-5PM"
    }
  ];

  const departments = [
    {
      name: "Order Help",
      email: "support@sokoafrica.com",
      description: "Questions about your order, delivery, or returns"
    },
    {
      name: "Sell With Us",
      email: "sellers@sokoafrica.com",
      description: "Become a seller or get help with your seller account"
    },
    {
      name: "Partner With Us",
      email: "partners@sokoafrica.com",
      description: "Business partnerships, logistics, or technology"
    },
    {
      name: "Press & Media",
      email: "press@sokoafrica.com",
      description: "Interview requests, press kits, media inquiries"
    }
  ];

  return (
    <div className="min-h-screen bg-soko-cream/30">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-soko-dark-teal text-white py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <span className="inline-block bg-soko-bright-cyan/20 text-soko-bright-cyan px-4 py-1 rounded-full text-sm font-medium mb-6">
              We're Here to Help
            </span>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-soko-light-blue/90 max-w-2xl mx-auto">
              Questions about an order? Want to sell your products? 
              Just want to say hello? We'd love to hear from you.
            </p>
          </div>
        </section>

        {/* Quick Response Banner */}
        <section className="py-4 bg-soko-orange text-white">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <p className="font-medium">
              Average response time: Under 4 hours for email, instant for WhatsApp
            </p>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block text-soko-orange-red font-semibold text-sm uppercase tracking-wider mb-2">
                How to Reach Us
              </span>
              <h2 className="text-3xl font-bold text-soko-dark-teal mb-4">
                Choose What Works for You
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {contactMethods.map((method, index) => (
                <div key={index} className="bg-soko-cream/30 rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                  <div className="flex justify-center mb-4">
                    <div className="bg-soko-dark-teal/10 p-3 rounded-full">
                      {method.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-soko-dark-teal mb-2">{method.title}</h3>
                  <p className="text-soko-dark-brown/70 mb-3 text-sm">{method.description}</p>
                  <div className="text-soko-dark-teal font-semibold mb-1">{method.contact}</div>
                  <div className="text-xs text-soko-dark-brown/50">{method.hours}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Two Column: Form + Info */}
        <section className="py-16 bg-soko-cream/30">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <span className="inline-block text-soko-orange-red font-semibold text-sm uppercase tracking-wider mb-2">
                  Send a Message
                </span>
                <h2 className="text-3xl font-bold text-soko-dark-teal mb-6">
                  Drop Us a Line
                </h2>
                <p className="text-soko-dark-brown/70 mb-8">
                  Fill out the form and we'll get back to you as soon as possible. 
                  For urgent issues, WhatsApp is fastest.
                </p>
                
                <form className="space-y-6 bg-white p-8 rounded-xl shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-soko-dark-teal text-sm font-semibold mb-2">First Name</label>
                      <input 
                        className="w-full px-4 py-3 border border-soko-dark-teal/20 rounded-lg focus:outline-none focus:border-soko-orange focus:ring-1 focus:ring-soko-orange bg-white" 
                        type="text" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-soko-dark-teal text-sm font-semibold mb-2">Last Name</label>
                      <input 
                        className="w-full px-4 py-3 border border-soko-dark-teal/20 rounded-lg focus:outline-none focus:border-soko-orange focus:ring-1 focus:ring-soko-orange bg-white" 
                        type="text" 
                        required 
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-soko-dark-teal text-sm font-semibold mb-2">Email</label>
                    <input 
                      className="w-full px-4 py-3 border border-soko-dark-teal/20 rounded-lg focus:outline-none focus:border-soko-orange focus:ring-1 focus:ring-soko-orange bg-white" 
                      type="email" 
                      required 
                    />
                  </div>
                  
                  <div>
                    <label className="block text-soko-dark-teal text-sm font-semibold mb-2">What do you need help with?</label>
                    <select 
                      className="w-full px-4 py-3 border border-soko-dark-teal/20 rounded-lg focus:outline-none focus:border-soko-orange focus:ring-1 focus:ring-soko-orange bg-white" 
                      required
                    >
                      <option value="">Select a topic</option>
                      <option value="order">I have a question about my order</option>
                      <option value="return">I want to return or exchange something</option>
                      <option value="seller">I want to sell on Soko Africa</option>
                      <option value="partner">I want to partner with Soko Africa</option>
                      <option value="product">I have a question about a product</option>
                      <option value="other">Something else</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-soko-dark-teal text-sm font-semibold mb-2">Your Message</label>
                    <textarea 
                      className="w-full px-4 py-3 border border-soko-dark-teal/20 rounded-lg focus:outline-none focus:border-soko-orange focus:ring-1 focus:ring-soko-orange bg-white" 
                      rows="5" 
                      placeholder="Tell us what's on your mind..."
                      required
                    ></textarea>
                  </div>
                  
                  <button className="w-full bg-soko-orange hover:bg-soko-orange-red text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center justify-center">
                    <Send className="w-5 h-5 mr-2" />
                    Send Message
                  </button>
                </form>
              </div>

              {/* Direct Contacts */}
              <div>
                <span className="inline-block text-soko-orange-red font-semibold text-sm uppercase tracking-wider mb-2">
                  Direct Lines
                </span>
                <h2 className="text-3xl font-bold text-soko-dark-teal mb-6">
                  Email the Right Team
                </h2>
                <p className="text-soko-dark-brown/70 mb-8">
                  Skip the general inbox. Email the team that can help you directly.
                </p>
                
                <div className="space-y-4">
                  {departments.map((dept, index) => (
                    <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
                      <h3 className="text-lg font-semibold text-soko-dark-teal mb-1">{dept.name}</h3>
                      <p className="text-soko-dark-brown/60 text-sm mb-3">{dept.description}</p>
                      <a 
                        href={`mailto:${dept.email}`} 
                        className="text-soko-orange-red hover:text-soko-dark-teal font-medium transition-colors"
                      >
                        {dept.email}
                      </a>
                    </div>
                  ))}
                </div>

                {/* Social */}
                <div className="mt-8 bg-soko-dark-teal rounded-xl p-6 text-white">
                  <h3 className="text-lg font-semibold mb-4">Find Us on Social</h3>
                  <p className="text-soko-light-blue/80 text-sm mb-4">
                    Follow us for new products, seller stories, and behind-the-scenes content.
                  </p>
                  <div className="flex gap-4">
                    <a href="#" className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors" aria-label="Instagram">
                      <Camera className="w-5 h-5" />
                    </a>
                    <a href="#" className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors" aria-label="Facebook">
                      <Globe className="w-5 h-5" />
                    </a>
                    <a href="#" className="bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors" aria-label="Twitter">
                      <Link2 className="w-5 h-5" />
                    </a>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10 text-sm text-soko-light-blue/80">
                    @sokoafrica on all platforms
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Office Location */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-6">
            <div className="text-center mb-12">
              <span className="inline-block text-soko-orange-red font-semibold text-sm uppercase tracking-wider mb-2">
                Our Headquarters
              </span>
              <h2 className="text-3xl font-bold text-soko-dark-teal mb-4">
                Visit Us in Nairobi
              </h2>
              <p className="text-soko-dark-brown/70">
                We're a Kenyan company, built in Africa for the world.
              </p>
            </div>
            
            <div className="bg-soko-cream/30 rounded-xl p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-soko-orange p-2 rounded-full">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-soko-dark-teal">Soko Africa HQ</h3>
                  </div>
                  
                  <div className="space-y-3 text-soko-dark-brown/80">
                    <p>Westlands Business Center</p>
                    <p>Ring Road Westlands</p>
                    <p>Nairobi, Kenya</p>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-soko-dark-teal/10">
                    <div className="flex items-center gap-2 text-soko-dark-teal">
                      <Phone className="w-5 h-5" />
                      <span className="font-semibold">+254 700 123 456</span>
                    </div>
                    <div className="flex items-center gap-2 text-soko-dark-brown/60 mt-2">
                      <Clock className="w-5 h-5" />
                      <span>Mon-Fri: 9AM-5PM EAT</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-soko-dark-teal rounded-xl p-8 text-white text-center">
                  <div className="text-5xl mb-4">KE</div>
                  <p className="text-soko-light-blue/90">
                    Proudly headquartered in Nairobi, Kenya - serving customers and sellers across Africa and beyond.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}
