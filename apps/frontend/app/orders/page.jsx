"use client";
import React, { useState, useEffect } from 'react';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';
import { get } from '../lib/api';
import { formatQuantity } from '../lib/product-utils';
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

function formatOrderDate(iso) {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return String(iso);
  }
}

function formatMoneyAmount(amount, currency) {
  const n = Number(amount);
  const cur = currency || 'USD';
  if (cur === 'KES') return `KSh ${n.toFixed(2)}`;
  return `$${n.toFixed(2)}`;
}

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [orders, setOrders] = useState([]);
  const [listLoading, setListLoading] = useState(true);
  const [listError, setListError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setListLoading(true);
      setListError(null);
      try {
        const data = await get('/orders');
        if (!cancelled) setOrders(data.orders || []);
      } catch (e) {
        if (!cancelled) setListError(e.message || 'Could not load orders');
      } finally {
        if (!cancelled) setListLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

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
      processing: orders.filter((order) => order.uiStatus === 'processing')
        .length,
      shipped: orders.filter((order) => order.uiStatus === 'shipped').length,
      delivered: orders.filter((order) => order.uiStatus === 'delivered')
        .length,
      cancelled: orders.filter((order) => order.uiStatus === 'cancelled')
        .length
    };
    return counts;
  };

  const filteredOrders = orders.filter((order) => {
    return statusFilter === 'all' || order.uiStatus === statusFilter;
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

          {listError && (
            <div className="mb-6 rounded-lg bg-red-50 text-red-800 px-4 py-3 text-sm">
              {listError}
            </div>
          )}
          {listLoading && (
            <p className="text-gray-500 mb-6">Loading your orders…</p>
          )}

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
                const statusInfo = getStatusInfo(order.uiStatus);
                
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
                            <h3 className="text-lg font-semibold text-gray-900">Order #{order.id.slice(0, 8)}</h3>
                            <p className="text-sm text-gray-500">Placed on {formatOrderDate(order.createdAt)}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                          <div className="text-right">
                            <p className="text-lg font-bold text-gray-900">{formatMoneyAmount(order.total, order.currency)}</p>
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
                                src={product.image || '/hero/Black beans.png'}
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
                                Qty: {formatQuantity(product.quantity, product, { force: true })} × {formatMoneyAmount(product.price, order.currency)}
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
                        
                        {order.uiStatus === 'delivered' && (
                          <button className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            <Star size={16} className="mr-2" />
                            Leave Review
                          </button>
                        )}
                        
                        {order.uiStatus === 'shipped' && (
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
                        <span className="font-medium">{selectedOrder.id.slice(0, 8)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Order Date:</span>
                        <span className="font-medium">{formatOrderDate(selectedOrder.createdAt)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusInfo(selectedOrder.uiStatus).color}`}>
                          {getStatusInfo(selectedOrder.uiStatus).label}
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
                    {selectedOrder.shippingAddress ? (
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-medium text-gray-900">{selectedOrder.shippingAddress.name}</p>
                        <p>{selectedOrder.shippingAddress.address}</p>
                        {selectedOrder.shippingAddress.line2 && (
                          <p>{selectedOrder.shippingAddress.line2}</p>
                        )}
                        <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}</p>
                        <p>{selectedOrder.shippingAddress.country}</p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">No shipping address on file.</p>
                    )}
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
                            src={product.image || '/hero/Black beans.png'}
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
                          <p className="text-sm text-gray-600">
                            Quantity: {formatQuantity(product.quantity, product, { force: true })}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-900">{formatMoneyAmount(product.price, selectedOrder.currency)}</p>
                          <p className="text-sm text-gray-600">each</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="border-t border-gray-200 pt-4 mt-6">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-orange-600">{formatMoneyAmount(selectedOrder.total, selectedOrder.currency)}</span>
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