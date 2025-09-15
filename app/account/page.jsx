import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { User, Package, Heart, Settings, MapPin, CreditCard } from 'lucide-react';

export const metadata = {
  title: "My Account - SokoAfrica",
  description: "Manage your SokoAfrica account, orders, and preferences."
};

export default function AccountPage() {
  const accountSections = [
    {
      icon: <Package className="w-8 h-8 text-blue-600" />,
      title: "My Orders",
      description: "Track orders and view purchase history",
      href: "/orders"
    },
    {
      icon: <Heart className="w-8 h-8 text-red-600" />,
      title: "Wishlist",
      description: "Save products for later",
      href: "/wishlist"
    },
    {
      icon: <MapPin className="w-8 h-8 text-green-600" />,
      title: "Addresses",
      description: "Manage shipping and billing addresses",
      href: "/account/addresses"
    },
    {
      icon: <CreditCard className="w-8 h-8 text-purple-600" />,
      title: "Payment Methods",
      description: "Manage saved payment methods",
      href: "/account/payment"
    },
    {
      icon: <Settings className="w-8 h-8 text-gray-600" />,
      title: "Account Settings",
      description: "Update profile and preferences",
      href: "/account/settings"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Account Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mr-6">
              <User className="w-10 h-10 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, John!</h1>
              <p className="text-gray-600">Manage your account and track your orders</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">12</div>
            <div className="text-gray-600">Total Orders</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">8</div>
            <div className="text-gray-600">Wishlist Items</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">2</div>
            <div className="text-gray-600">Pending Orders</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">$1,234</div>
            <div className="text-gray-600">Total Spent</div>
          </div>
        </div>

        {/* Account Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {accountSections.map((section, index) => (
            <a
              key={index}
              href={section.href}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow group"
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-orange-600 transition-colors">
                    {section.title}
                  </h3>
                  <p className="text-gray-600">{section.description}</p>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Recent Orders */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Orders</h2>
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-5 gap-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                <div>Order #</div>
                <div>Date</div>
                <div>Status</div>
                <div>Total</div>
                <div>Action</div>
              </div>
            </div>
            
            {[
              { id: "ORD-2024-001", date: "Sep 10, 2025", status: "Delivered", total: "$89.99", action: "View Details" },
              { id: "ORD-2024-002", date: "Sep 8, 2025", status: "Shipped", total: "$156.50", action: "Track Order" },
              { id: "ORD-2024-003", date: "Sep 5, 2025", status: "Processing", total: "$234.00", action: "View Details" }
            ].map((order, index) => (
              <div key={index} className="px-6 py-4 border-b border-gray-100 last:border-b-0">
                <div className="grid grid-cols-5 gap-4 items-center">
                  <div className="font-semibold text-gray-800">{order.id}</div>
                  <div className="text-gray-600">{order.date}</div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-600' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-600' :
                      'bg-yellow-100 text-yellow-600'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="font-semibold text-gray-800">{order.total}</div>
                  <div>
                    <button className="text-orange-600 hover:text-orange-700 font-semibold text-sm">
                      {order.action}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
