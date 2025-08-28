import React from 'react';
import Link from 'next/link';
import Header from '../components/ui/Header';
import { ArrowLeft, Shield, CreditCard, Package, AlertCircle } from 'lucide-react';

const SellerTermsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/partner" className="inline-flex items-center text-orange-500 hover:text-orange-600 mb-4">
            <ArrowLeft size={20} className="mr-2" />
            Back to Partner Application
          </Link>
          <h1 className="text-3xl font-bold text-orange-600">Seller Terms and Conditions</h1>
          <p className="text-gray-600 mt-2">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-orange-600">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Welcome to SokoAfrica! These Seller Terms and Conditions ("Terms") govern your use of our 
              platform as a seller. By registering as a seller, you agree to comply with these terms.
            </p>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
              <div className="flex items-center">
                <AlertCircle className="text-blue-500 mr-2" size={20} />
                <p className="text-blue-800 font-medium">
                  Please read these terms carefully before submitting your seller application.
                </p>
              </div>
            </div>
          </section>

          {/* Seller Requirements */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-orange-600 flex items-center">
              <Shield className="mr-2 text-orange-500" size={24} />
              2. Seller Requirements
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold mb-2">2.1 Eligibility</h3>
                <ul className="text-gray-700 space-y-1 ml-4 list-disc">
                  <li>Must be 18 years or older, or a registered business entity</li>
                  <li>Must provide accurate and complete registration information</li>
                  <li>Must have legal right to sell the products offered</li>
                  <li>Must comply with all applicable laws and regulations</li>
                </ul>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold mb-2">2.2 Documentation</h3>
                <ul className="text-gray-700 space-y-1 ml-4 list-disc">
                  <li>Valid government-issued ID or business registration certificate</li>
                  <li>Bank account details for payment processing</li>
                  <li>Tax identification number (where applicable)</li>
                  <li>Product certifications (where required)</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Product Listing Standards */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-orange-600 flex items-center">
              <Package className="mr-2 text-orange-500" size={24} />
              3. Product Listing Standards
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold mb-2">3.1 Prohibited Items</h3>
                <p className="text-gray-700 mb-2">The following items are strictly prohibited:</p>
                <ul className="text-gray-700 space-y-1 ml-4 list-disc">
                  <li>Illegal or controlled substances</li>
                  <li>Weapons, ammunition, or military equipment</li>
                  <li>Counterfeit or pirated goods</li>
                  <li>Adult content or services</li>
                  <li>Live animals or animal parts from endangered species</li>
                  <li>Hazardous materials or chemicals</li>
                </ul>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold mb-2">3.2 Quality Standards</h3>
                <ul className="text-gray-700 space-y-1 ml-4 list-disc">
                  <li>Products must be accurately described and photographed</li>
                  <li>All claims about product benefits must be truthful</li>
                  <li>Images must be original and not misleading</li>
                  <li>Pricing must be clearly stated in the specified currency</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Payment Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-orange-600 flex items-center">
              <CreditCard className="mr-2 text-orange-500" size={24} />
              4. Payment Terms
            </h2>
            <div className="space-y-4">
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold mb-2">4.1 Commission Structure</h3>
                <ul className="text-gray-700 space-y-1 ml-4 list-disc">
                  <li>SokoAfrica charges a commission of 8-15% per successful sale</li>
                  <li>Commission rates vary by product category</li>
                  <li>Payment processing fees are deducted from seller payments</li>
                  <li>No monthly subscription fees for basic seller accounts</li>
                </ul>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold mb-2">4.2 Payment Schedule</h3>
                <ul className="text-gray-700 space-y-1 ml-4 list-disc">
                  <li>Payments are processed bi-weekly (every 14 days)</li>
                  <li>Minimum payout threshold: $50 USD or local equivalent</li>
                  <li>Payments are subject to a 7-day holding period for new sellers</li>
                  <li>Refunds and chargebacks may be deducted from future payments</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Order Fulfillment */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-orange-600">5. Order Fulfillment</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold mb-2">5.1 Processing Time</h3>
                <ul className="text-gray-700 space-y-1 ml-4 list-disc">
                  <li>Orders must be processed within 2 business days</li>
                  <li>Sellers must provide tracking information when available</li>
                  <li>Communication with customers must be prompt and professional</li>
                </ul>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold mb-2">5.2 Shipping Requirements</h3>
                <ul className="text-gray-700 space-y-1 ml-4 list-disc">
                  <li>Products must be securely packaged to prevent damage</li>
                  <li>International shipping must comply with customs regulations</li>
                  <li>Delivery timeframes must be accurately communicated</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Customer Service */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-orange-600">6. Customer Service</h2>
            <div className="border-l-4 border-orange-500 pl-4">
              <ul className="text-gray-700 space-y-2 ml-4 list-disc">
                <li>Respond to customer inquiries within 24 hours</li>
                <li>Handle returns and refunds according to stated policies</li>
                <li>Maintain professional communication at all times</li>
                <li>Resolve disputes in good faith through our resolution center</li>
              </ul>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-orange-600">7. Intellectual Property</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold mb-2">7.1 Your Content</h3>
                <p className="text-gray-700">
                  You retain ownership of your product listings, images, and descriptions. 
                  However, you grant SokoAfrica a license to use this content for platform operations.
                </p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold mb-2">7.2 Respect Others' Rights</h3>
                <p className="text-gray-700">
                  You must not infringe on others' intellectual property rights. 
                  This includes trademarks, copyrights, and patents.
                </p>
              </div>
            </div>
          </section>

          {/* Account Suspension */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-orange-600">8. Account Suspension and Termination</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold mb-2 text-red-800">8.1 Grounds for Suspension</h3>
                <ul className="text-gray-700 space-y-1 ml-4 list-disc">
                  <li>Violation of these terms and conditions</li>
                  <li>Sale of prohibited items</li>
                  <li>Fraudulent or deceptive practices</li>
                  <li>Poor performance metrics (high cancellation rates, etc.)</li>
                  <li>Customer complaints about product quality or service</li>
                </ul>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold mb-2">8.2 Appeal Process</h3>
                <p className="text-gray-700">
                  Suspended sellers may appeal the decision by contacting support@sokoafrica.com 
                  with relevant documentation within 30 days of suspension.
                </p>
              </div>
            </div>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-orange-600">9. Limitation of Liability</h2>
            <div className="border-l-4 border-orange-500 pl-4">
              <p className="text-gray-700">
                SokoAfrica provides the platform "as is" and makes no warranties about 
                uninterrupted service. Our liability is limited to the fees paid by sellers 
                in the preceding 12 months.
              </p>
            </div>
          </section>

          {/* Changes to Terms */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-orange-600">10. Changes to Terms</h2>
            <div className="border-l-4 border-orange-500 pl-4">
              <p className="text-gray-700">
                We may update these terms from time to time. Sellers will be notified 
                of significant changes via email. Continued use of the platform after 
                changes constitutes acceptance of the new terms.
              </p>
            </div>
          </section>

          {/* Contact Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-orange-600">11. Contact Information</h2>
            <div className="border-l-4 border-orange-500 pl-4">
              <p className="text-gray-700 mb-2">
                If you have questions about these terms, please contact us:
              </p>
              <ul className="text-gray-700 space-y-1 ml-4 list-disc">
                <li>Email: legal@sokoafrica.com</li>
                <li>Support: support@sokoafrica.com</li>
                <li>Phone: +254 XXX XXX XXX</li>
              </ul>
            </div>
          </section>

          {/* Agreement */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mt-8">
            <h3 className="font-semibold text-lg mb-3 text-orange-800">Agreement Acknowledgment</h3>
            <p className="text-orange-700">
              By checking the agreement box in your seller application, you acknowledge that you have 
              read, understood, and agree to be bound by these Seller Terms and Conditions.
            </p>
          </div>

          {/* Back to Application */}
          <div className="text-center mt-8">
            <Link href="/partner" className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors">
              <ArrowLeft size={20} className="mr-2" />
              Return to Seller Application
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerTermsPage;
