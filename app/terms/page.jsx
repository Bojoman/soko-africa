import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { FileText, Scale, AlertCircle } from 'lucide-react';

export const metadata = {
  title: "Terms of Service - SokoAfrica",
  description: "Terms and conditions for using SokoAfrica marketplace."
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Scale className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Terms of Service</h1>
            <p className="text-gray-600">Last updated: September 15, 2025</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Acceptance of Terms</h2>
              <p className="text-gray-600 mb-4">
                By accessing and using SokoAfrica's services, you accept and agree to be bound by the terms and provision of this agreement. 
                If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Use License</h2>
              <p className="text-gray-600 mb-4">
                Permission is granted to temporarily access SokoAfrica for personal, non-commercial transitory viewing only. This includes:
              </p>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Browsing and purchasing products for personal use</li>
                <li>Creating an account to manage orders and preferences</li>
                <li>Communicating with sellers through our platform</li>
                <li>Leaving reviews and ratings for purchased products</li>
              </ul>
              
              <p className="text-gray-600 mb-4">This license shall automatically terminate if you violate any of these restrictions.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">User Accounts</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Account Creation</h3>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>You must provide accurate and complete information</li>
                <li>You are responsible for maintaining account security</li>
                <li>You must be at least 18 years old to create an account</li>
                <li>One account per person is permitted</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Account Responsibilities</h3>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Keep your login credentials secure</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Update your information when it changes</li>
                <li>Use the platform in accordance with these terms</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Purchasing and Payment</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Orders</h3>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>All orders are subject to acceptance and availability</li>
                <li>Prices are subject to change without notice</li>
                <li>We reserve the right to limit quantities</li>
                <li>Orders may be cancelled for various reasons including stock unavailability</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Payment</h3>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Payment is required at time of order</li>
                <li>We accept major credit cards and digital payment methods</li>
                <li>All transactions are processed securely</li>
                <li>Refunds are processed according to our return policy</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Shipping and Returns</h2>
              <p className="text-gray-600 mb-4">
                Shipping times and return policies vary by seller and product. Please review individual product pages for specific details.
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>We are not responsible for shipping delays beyond our control</li>
                <li>Returns must be initiated within 30 days of delivery</li>
                <li>Products must be in original condition for returns</li>
                <li>Return shipping costs may apply unless item is defective</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Prohibited Uses</h2>
              <p className="text-gray-600 mb-4">You may not use our platform to:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Upload malicious code or viruses</li>
                <li>Engage in fraudulent activities</li>
                <li>Harass or abuse other users</li>
                <li>Create fake accounts or reviews</li>
                <li>Resell products for commercial purposes without permission</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Content and Reviews</h2>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">User-Generated Content</h3>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>You retain ownership of content you submit</li>
                <li>You grant us license to use, display, and distribute your content</li>
                <li>Content must be accurate and not misleading</li>
                <li>We reserve the right to remove inappropriate content</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Product Reviews</h3>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Reviews must be based on genuine experiences</li>
                <li>Fake or incentivized reviews are prohibited</li>
                <li>Reviews should be helpful and relevant</li>
                <li>Offensive or inappropriate reviews will be removed</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Limitation of Liability</h2>
              <p className="text-gray-600 mb-4">
                SokoAfrica shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
                including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Dispute Resolution</h2>
              <p className="text-gray-600 mb-4">
                Any disputes arising from these terms or your use of our services will be resolved through binding arbitration 
                in accordance with the laws of Kenya.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Changes to Terms</h2>
              <p className="text-gray-600 mb-4">
                We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting. 
                Your continued use of the service constitutes acceptance of the modified terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Information</h2>
              <p className="text-gray-600 mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> legal@sokoafrica.com<br />
                  <strong>Address:</strong> Westlands Business Center, Ring Road Westlands, Nairobi, Kenya<br />
                  <strong>Phone:</strong> +254 700 123 456
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
