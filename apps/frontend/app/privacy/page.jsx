import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { Shield, Eye, Lock, Database } from 'lucide-react';

export const metadata = {
  title: "Privacy Policy - SokoAfrica",
  description: "SokoAfrica's privacy policy and data protection practices."
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-soko-orange/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-10 h-10 text-soko-orange" />
            </div>
            <h1 className="text-4xl font-bold text-soko-dark-teal mb-4">Privacy Policy</h1>
            <p className="text-gray-600">Last updated: May 28, 2026</p>
          </div>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Introduction</h2>
              <p className="text-gray-600 mb-4">
                At SokoAfrica, we are committed to protecting your privacy and ensuring the security of your personal information. 
                This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Personal Information</h3>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Name, email address, and contact information</li>
                <li>Billing and shipping addresses</li>
                <li>Payment information (processed securely by our payment partners)</li>
                <li>Account credentials and preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Usage Information</h3>
              <ul className="list-disc list-inside text-gray-600 mb-4 space-y-2">
                <li>Browsing behavior and purchase history</li>
                <li>Device information and IP address</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Communication preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">How We Use Your Information</h2>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>Process and fulfill your orders</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Send important updates about your orders and account</li>
                <li>Personalize your shopping experience</li>
                <li>Improve our products and services</li>
                <li>Comply with legal obligations</li>
                <li>Prevent fraud and ensure platform security</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Information Sharing</h2>
              <p className="text-gray-600 mb-4">
                We do not sell, trade, or rent your personal information. We may share your information only in these circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>With trusted service providers who assist in operating our platform</li>
                <li>With sellers to fulfill your orders</li>
                <li>When required by law or to protect our rights</li>
                <li>In connection with a business transfer or merger</li>
                <li>With your explicit consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Data Security</h2>
              <p className="text-gray-600 mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li>SSL encryption for all data transmission</li>
                <li>Secure data storage with access controls</li>
                <li>Regular security assessments and updates</li>
                <li>Employee training on data protection</li>
                <li>Compliance with international security standards</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Rights</h2>
              <p className="text-gray-600 mb-4">You have the following rights regarding your personal information:</p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Receive your data in a machine-readable format</li>
                <li><strong>Objection:</strong> Object to certain uses of your data</li>
                <li><strong>Restriction:</strong> Limit how we process your data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-soko-dark-teal mb-4">Payment processors</h2>
              <p className="text-gray-600 mb-4">
                When you pay on SokoAfrica, your payment is processed by trusted third-party providers.
                We do not store full card numbers on our servers. Depending on your chosen method, data may be
                handled by:
              </p>
              <ul className="list-disc list-inside text-gray-600 space-y-2">
                <li><strong>Stripe</strong> — card payments (PCI-DSS compliant)</li>
                <li><strong>PayPal</strong> — PayPal wallet and linked funding sources</li>
                <li><strong>Safaricom M-Pesa (Daraja)</strong> — mobile money STK Push in Kenya</li>
              </ul>
              <p className="text-gray-600 mt-4">
                Each provider&apos;s own privacy policy applies to payment data they process on our behalf.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-soko-dark-teal mb-4">Authentication cookies</h2>
              <p className="text-gray-600 mb-4">
                We use httpOnly, secure session cookies to keep you signed in. These cookies are not accessible
                to JavaScript in the browser, which helps protect your account from cross-site scripting attacks.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-soko-dark-teal mb-4">Cookies and Tracking</h2>
              <p className="text-gray-600 mb-4">
                We use cookies and similar technologies to enhance your experience. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">International Transfers</h2>
              <p className="text-gray-600 mb-4">
                Your information may be transferred to and processed in countries other than your own. 
                We ensure appropriate safeguards are in place for international data transfers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Children's Privacy</h2>
              <p className="text-gray-600 mb-4">
                Our services are not intended for children under 16. We do not knowingly collect personal information from children under 16.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
              <p className="text-gray-600 mb-4">
                If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
              </p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700">
                  <strong>Email:</strong> privacy@sokoafrica.com<br />
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
