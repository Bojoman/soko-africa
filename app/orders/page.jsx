"use client";
import React, { useState } from 'react';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { useAuth } from '../contexts/AuthContext';
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  Eye, 
  X,
  Download,
  MessageCircle,
  Star,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function OrdersPage() {
  const { user } = useAuth();
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  
  // Mock orders data - replace with real API calls
  const [orders] = useState([
    {
      id: 'ORD-2024-001',
      date: 'January 15, 2024',
      status: 'delivered',
      total: 89.97,
      tracking: 'TRK123456789',
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main Street',
        city: 'Nairobi',
        postalCode: '00100',
        country: 'Kenya'
      },
      products: [
        { 
          name: 'Fresh Kenyan Avocados (6 pack)', 
          quantity: 2, 
          price: 12.99,
          image: '/products/avocados in the farm.png'
        },
        { 
          name: 'Ethiopian Single Origin Coffee', 
          quantity: 1, 
          price: 24.99,
          image: '/hero/avocado.png'
        },
        { 
          name: 'Maasai Hand-woven Basket', 
          quantity: 1, 
          price: 35.99,
          image: '/hero/massai wall art.png'
        }
      ]
    },
    {
      id: 'ORD-2024-002',
      date: 'January 10, 2024',
      status: 'shipped',
      total: 67.50,
      tracking: 'TRK987654321',
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main Street',
        city: 'Nairobi',
        postalCode: '00100',
        country: 'Kenya'
      },
      products: [
        { 
          name: 'Authentic Ankara Fabric (6 yards)', 
          quantity: 1, 
          price: 45.00,
          image: '/hero/Ankara fabric.png'
        },
        { 
          name: 'Raw Shea Butter Skincare Set', 
          quantity: 1, 
          price: 32.00,
          image: '/products/avocados in the farm.png'
        }
      ]
    },
    {
      id: 'ORD-2024-003',
      date: 'January 8, 2024',
      status: 'processing',
      total: 45.99,
      tracking: null,
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main Street',
        city: 'Nairobi',
        postalCode: '00100',
        country: 'Kenya'
      },
      products: [
        { 
          name: 'Wild African Honey (500ml)', 
          quantity: 1, 
          price: 18.99,
          image: '/hero/avocado.png'
        },
        { 
          name: 'Premium Macadamia Nuts (500g)', 
          quantity: 1, 
          price: 28.50,
          image: '/products/mangoes.png'
        }
      ]
    },
    {
      id: 'ORD-2024-004',
      date: 'January 5, 2024',
      status: 'cancelled',
      total: 32.00,
      tracking: null,
      shippingAddress: {
        name: 'John Doe',
        address: '123 Main Street',
        city: 'Nairobi',
        postalCode: '00100',
        country: 'Kenya'
      },
      products: [
        { 
          name: 'Moroccan Argan Oil (100ml)', 
          quantity: 1, 
          price: 29.99,
          image: '/hero/avocado.png'
        }
      ]
    }
  ]);

  const getStatusInfo = (status) => {
    const statusMap = {
      processing: {
        label: 'Processing',
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock
      },
      shipped: {
        label: 'Shipped',
        color: 'bg-blue-100 text-blue-800',
        icon: Truck
      },
      delivered: {
        label: 'Delivered',
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle
      },
      cancelled: {
        label: 'Cancelled',
        color: 'bg-red-100 text-red-800',
        icon: X
      }
    };
    return statusMap[status] || statusMap.processing;
  };

  const getOrderCounts = () => {
    const counts = {
      all: orders.length,
      processing: orders.filter(order => order.status === 'processing').length,
      shipped: orders.filter(order => order.status === 'shipped').length,
      delivered: orders.filter(order => order.status === 'delivered').length,
      cancelled: orders.filter(order => order.status === 'cancelled').length,
    };
    return counts;
  };

  const filteredOrders = orders.filter(order => {
    return statusFilter === 'all' || order.status === statusFilter;
  });

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const closeOrderDetails = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  const counts = getOrderCounts();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-orange-600 mb-2">My Orders</h1>
            <p className="text-gray-600">Track and manage your orders</p>
          </div>

          {/* Filter Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { key: 'all', label: `All Orders (${counts.all})` },
                  { key: 'processing', label: `Processing (${counts.processing})` },
                  { key: 'shipped', label: `Shipped (${counts.shipped})` },
                  { key: 'delivered', label: `Delivered (${counts.delivered})` },
                  { key: 'cancelled', label: `Cancelled (${counts.cancelled})` }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setStatusFilter(tab.key)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      statusFilter === tab.key
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Orders */}
          <div className="space-y-6">
            {filteredOrders.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <Package className="mx-auto text-gray-400 mb-4" size={64} />
                <h3 className="text-xl font-medium text-gray-900 mb-2">No orders found</h3>
                <p className="text-gray-600 mb-6">
                  {statusFilter !== 'all' 
                    ? `You don't have any ${statusFilter} orders.`
                    : 'You haven\'t placed any orders yet.'
                  }
                </p>
                <Link
                  href="/categories"
                  className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              filteredOrders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                
                return (
                  <div key={order.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {/* Order Header */}
                    <div className="p-6 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-blue-50 rounded-lg">
                            <Package className="text-blue-600" size={20} />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Order #{order.id}</h3>
                            <p className="text-sm text-gray-500">Placed on {order.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">${order.total}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {order.products.map((product, index) => (
                          <div key={index} className="flex items-center space-x-3">
                            <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                              <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  e.target.src = '/hero/avocado.png';
                                }}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {product.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                Qty: {product.quantity} × ${product.price}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3">
                        <button
                          onClick={() => handleViewDetails(order)}
                          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                          <Eye size={16} className="mr-2" />
                          View Details
                        </button>
                        
                        {order.status === 'delivered' && (
                          <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            <Star size={16} className="mr-2" />
                            Leave Review
                          </button>
                        )}
                        
                        {order.status === 'shipped' && (
                          <button className="flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                            <Truck size={16} className="mr-2" />
                            Track Package
                          </button>
                        )}
                        
                        <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                          <Download size={16} className="mr-2" />
                          Download Invoice
                        </button>
                        
                        <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                          <MessageCircle size={16} className="mr-2" />
                          Contact Support
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </main>

        {/* Order Details Modal */}
        {showOrderDetails && selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
                <button
                  onClick={closeOrderDetails}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Order Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Order Information</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order ID:</span>
                        <span className="font-medium">{selectedOrder.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Date:</span>
                        <span className="font-medium">{selectedOrder.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusInfo(selectedOrder.status).color}`}>
                          {getStatusInfo(selectedOrder.status).label}
                        </span>
                      </div>
                      {selectedOrder.tracking && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tracking:</span>
                          <span className="font-medium text-blue-600">{selectedOrder.tracking}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Shipping Address */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Shipping Address</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p className="font-medium text-gray-900">{selectedOrder.shippingAddress.name}</p>
                      <p>{selectedOrder.shippingAddress.address}</p>
                      <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                      <p>{selectedOrder.shippingAddress.country}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {selectedOrder.products.map((product, index) => (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="relative w-16 h-16 bg-white rounded-lg overflow-hidden">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              e.target.src = '/hero/avocado.png';
                            }}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{product.name}</h4>
                          <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">${product.price}</p>
                          <p className="text-sm text-gray-600">each</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t border-gray-200 pt-4 mt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-orange-600">${selectedOrder.total}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </ProtectedRoute>
  );
}