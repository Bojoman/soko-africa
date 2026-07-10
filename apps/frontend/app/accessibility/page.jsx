import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { Eye, Ear, Hand, Heart } from 'lucide-react';

export const metadata = {
  title: "Accessibility - SokoAfrica", 
  description: "SokoAfrica's commitment to accessibility and inclusive design for all users."
};

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Accessibility Statement</h1>
            <p className="text-gray-600">Our commitment to making SokoAfrica accessible to everyone</p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Commitment</h2>
              <p className="text-gray-600">
                SokoAfrica is committed to ensuring that our website is accessible to people with disabilities. 
                We believe that everyone should have equal access to the authentic African products and cultural experiences we offer.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Accessibility Features</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Eye className="w-8 h-8 text-blue-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-800">Visual</h3>
                  </div>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>High contrast color schemes</li>
                    <li>Scalable fonts and images</li>
                    <li>Alt text for all images</li>
                    <li>Screen reader compatibility</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Hand className="w-8 h-8 text-green-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-800">Motor</h3>
                  </div>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Keyboard navigation support</li>
                    <li>Large clickable areas</li>
                    <li>No time-sensitive actions required</li>
                    <li>Voice control compatibility</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Ear className="w-8 h-8 text-purple-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-800">Auditory</h3>
                  </div>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Captions for video content</li>
                    <li>Visual indicators for audio alerts</li>
                    <li>Text alternatives for audio content</li>
                    <li>Adjustable audio controls</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <Heart className="w-8 h-8 text-red-600 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-800">Cognitive</h3>
                  </div>
                  <ul className="list-disc list-inside text-gray-600 space-y-2">
                    <li>Clear, simple language</li>
                    <li>Consistent navigation</li>
                    <li>Error prevention and recovery</li>
                    <li>Content organization and structure</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Web Standards Compliance</h2>
              <p className="text-gray-600 mb-4">
                Our website aims to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards. These guidelines explain how to make web content more accessible for people with disabilities.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Semantic HTML markup</li>
                <li>Proper heading structure</li>
                <li>Focus indicators for keyboard navigation</li>
                <li>Color contrast ratios meeting WCAG standards</li>
                <li>Form labels and error messages</li>
                <li>Skip navigation links</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Assistive Technology Support</h2>
              <p className="text-gray-600 mb-4">
                Our website is designed to work with commonly used assistive technologies, including:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Screen readers (JAWS, NVDA, VoiceOver)</li>
                <li>Voice recognition software</li>
                <li>Keyboard-only navigation</li>
                <li>Screen magnification tools</li>
                <li>Alternative input devices</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Ongoing Improvements</h2>
              <p className="text-gray-600 mb-4">
                We continuously work to improve the accessibility of our website. Our efforts include:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Regular accessibility audits</li>
                <li>User testing with people with disabilities</li>
                <li>Staff training on accessibility best practices</li>
                <li>Incorporating accessibility in our design process</li>
                <li>Monitoring and updating content for accessibility</li>
              </ul>
            </section>

            <section className="bg-orange-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Accessibility Support</h2>
              <p className="text-gray-600 mb-4">
                If you encounter any accessibility barriers while using our website, please don't hesitate to contact us. 
                We're committed to providing equal access and will work with you to resolve any issues.
              </p>
              
              <div className="bg-white rounded-lg p-4 mt-4">
                <h3 className="font-semibold text-gray-800 mb-2">Contact Information:</h3>
                <p className="text-gray-700">
                  <strong>Email:</strong> accessibility@sokoafrica.com<br />
                  <strong>Phone:</strong> +254 700 123 456<br />
                  <strong>Mail:</strong> SokoAfrica Accessibility Team<br />
                  Westlands Business Center, Ring Road Westlands<br />
                  Nairobi, Kenya
                </p>
              </div>
              
              <p className="text-gray-600 mt-4 text-sm">
                Please include "Accessibility" in the subject line and provide as much detail as possible about the issue you encountered.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Alternative Formats</h2>
              <p className="text-gray-600">
                If you need information from our website in an alternative format, such as large print, braille, or audio, 
                please contact our accessibility team. We'll work to provide the information in your preferred format within a reasonable timeframe.
              </p>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
