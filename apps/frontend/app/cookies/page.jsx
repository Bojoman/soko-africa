import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { Cookie, Settings, Shield } from 'lucide-react';

export const metadata = {
  title: "Cookie Policy - SokoAfrica",
  description: "Learn about how SokoAfrica uses cookies and how you can control them."
};

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Cookie className="w-10 h-10 text-yellow-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Cookie Policy</h1>
            <p className="text-gray-600">Last updated: September 15, 2025</p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">What Are Cookies?</h2>
              <p className="text-gray-600">
                Cookies are small text files that are stored on your device when you visit our website. 
                They help us provide you with a better browsing experience and allow certain features to function properly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Types of Cookies We Use</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Essential Cookies</h3>
                  <p className="text-gray-600 mb-3">
                    These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Session management</li>
                    <li>Security features</li>
                    <li>Shopping cart functionality</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Analytics Cookies</h3>
                  <p className="text-gray-600 mb-3">
                    These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Google Analytics</li>
                    <li>Page view tracking</li>
                    <li>User behavior analysis</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Marketing Cookies</h3>
                  <p className="text-gray-600 mb-3">
                    These cookies are used to deliver personalized advertisements and measure the effectiveness of advertising campaigns.
                  </p>
                  <ul className="list-disc list-inside text-gray-600 space-y-1">
                    <li>Personalized ads</li>
                    <li>Social media integration</li>
                    <li>Retargeting campaigns</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Managing Your Cookie Preferences</h2>
              <p className="text-gray-600 mb-4">
                You can control and manage cookies in several ways:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Use our cookie preference center when you first visit our site</li>
                <li>Adjust your browser settings to block or delete cookies</li>
                <li>Opt out of third-party advertising cookies</li>
                <li>Use private/incognito browsing modes</li>
              </ul>
            </section>

            <section className="bg-orange-50 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Cookie Settings</h2>
              <p className="text-gray-600 mb-6">
                Manage your cookie preferences below. Note that disabling certain cookies may affect your browsing experience.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-800">Essential Cookies</h3>
                    <p className="text-sm text-gray-600">Required for basic site functionality</p>
                  </div>
                  <div className="text-gray-500 font-semibold">Always Active</div>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-800">Analytics Cookies</h3>
                    <p className="text-sm text-gray-600">Help us improve our website</p>
                  </div>
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold">Enabled</button>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                  <div>
                    <h3 className="font-semibold text-gray-800">Marketing Cookies</h3>
                    <p className="text-sm text-gray-600">Personalize your ad experience</p>
                  </div>
                  <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold">Disabled</button>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg font-bold transition-colors">
                  Save Preferences
                </button>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about our use of cookies, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@sokoafrica.com<br />
                  <strong>Address:</strong> Westlands Business Center, Ring Road Westlands, Nairobi, Kenya
                </p>
              </div>
            </section>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
