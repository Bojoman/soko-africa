import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { Shield, Eye, Bell, Lock, Database, Globe } from 'lucide-react';

export const metadata = {
  title: "Privacy Settings - SokoAfrica",
  description: "Manage your privacy preferences and data settings on SokoAfrica."
};

export default function PrivacySettingsPage() {
  const privacyCategories = [
    {
      title: "Account Privacy",
      icon: <Lock className="w-6 h-6 text-orange-600" />,
      description: "Control who can see your profile and activity",
      settings: [
        { name: "Profile Visibility", current: "Public", options: ["Public", "Friends Only", "Private"] },
        { name: "Purchase History", current: "Private", options: ["Public", "Private"] },
        { name: "Wishlist Visibility", current: "Friends Only", options: ["Public", "Friends Only", "Private"] }
      ]
    },
    {
      title: "Communication Preferences",
      icon: <Bell className="w-6 h-6 text-green-600" />,
      description: "Choose how we communicate with you",
      settings: [
        { name: "Email Notifications", current: "Enabled", options: ["Enabled", "Disabled"] },
        { name: "SMS Notifications", current: "Order Updates Only", options: ["All", "Order Updates Only", "Disabled"] },
        { name: "Marketing Emails", current: "Weekly", options: ["Daily", "Weekly", "Monthly", "Disabled"] }
      ]
    },
    {
      title: "Data & Analytics",
      icon: <Database className="w-6 h-6 text-blue-600" />,
      description: "Manage how your data is used for analytics",
      settings: [
        { name: "Analytics Tracking", current: "Enabled", options: ["Enabled", "Disabled"] },
        { name: "Personalized Ads", current: "Enabled", options: ["Enabled", "Disabled"] },
        { name: "Data Sharing with Partners", current: "Disabled", options: ["Enabled", "Disabled"] }
      ]
    },
    {
      title: "Location & Shipping",
      icon: <Globe className="w-6 h-6 text-purple-600" />,
      description: "Control location-based features",
      settings: [
        { name: "Location Services", current: "Enabled", options: ["Enabled", "Disabled"] },
        { name: "Auto-fill Shipping Address", current: "Enabled", options: ["Enabled", "Disabled"] },
        { name: "Local Deals & Offers", current: "Enabled", options: ["Enabled", "Disabled"] }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-orange-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Privacy Settings</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Control your privacy preferences and manage how your data is used. 
            Your privacy is important to us.
          </p>
        </div>

        {/* Privacy Categories */}
        <div className="space-y-8">
          {privacyCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center mb-4">
                {category.icon}
                <div className="ml-3">
                  <h2 className="text-2xl font-bold text-gray-800">{category.title}</h2>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                {category.settings.map((setting, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div>
                      <h3 className="font-semibold text-gray-800">{setting.name}</h3>
                      <p className="text-sm text-gray-600">Current: {setting.current}</p>
                    </div>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-orange-500">
                      {setting.options.map((option, optIdx) => (
                        <option key={optIdx} value={option} selected={option === setting.current}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Data Management */}
        <div className="mt-12 bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Data Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border border-gray-200 rounded-lg">
              <div className="flex items-center mb-4">
                <Database className="w-6 h-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-800">Download Your Data</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Get a copy of all the data we have about you, including your orders, 
                preferences, and account information.
              </p>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                Request Data Export
              </button>
            </div>
            
            <div className="p-6 border border-red-200 rounded-lg bg-red-50">
              <div className="flex items-center mb-4">
                <Eye className="w-6 h-6 text-red-600 mr-3" />
                <h3 className="text-lg font-semibold text-red-800">Delete Account</h3>
              </div>
              <p className="text-red-700 mb-4">
                Permanently delete your account and all associated data. 
                This action cannot be undone.
              </p>
              <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Save Changes */}
        <div className="mt-8 text-center">
          <button className="bg-orange-600 hover:bg-orange-700 text-white px-12 py-4 rounded-lg font-semibold text-lg transition-colors">
            Save All Changes
          </button>
          <p className="text-sm text-gray-500 mt-4">
            Changes will take effect immediately. Some changes may require you to log in again.
          </p>
        </div>

        {/* Privacy Policy Link */}
        <div className="mt-12 text-center p-6 bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Questions About Privacy?</h3>
          <p className="text-gray-600 mb-4">
            Learn more about how we protect your privacy and use your data.
          </p>
          <div className="space-x-4">
            <a href="/privacy" className="text-orange-600 hover:text-orange-700 font-semibold">
              Read Privacy Policy
            </a>
            <a href="/contact" className="text-orange-600 hover:text-orange-700 font-semibold">
              Contact Privacy Team
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
