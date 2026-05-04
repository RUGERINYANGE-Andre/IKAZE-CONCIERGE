// client/src/components/dashboard/admin/OrdersTable.jsx

import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import StatusBadge from '../../ui/StatusBadge';
import Modal from '../../ui/Modal';
import Input from '../../ui/Input';
import FileUploader from './FileUploader';

const OrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, currentPage, searchTerm]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: statusFilter,
        page: currentPage,
        limit: 10,
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await api.get(`/admin/orders?${params}`);

      // ✅ api.js returns full axios response, so access response.data.data
      setOrders(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (orderId) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      // ✅ Fix data extraction
      setSelectedOrder(response.data.data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
      alert('Failed to load order details');
    }
  };

  const handleUpdateStatus = async () => {
    if (!newStatus) {
      alert('Please select a status');
      return;
    }

    try {
      await api.patch(`/admin/orders/${selectedOrder._id}/status`, {
        status: newStatus,
        note: statusNote,
      });

      alert('✅ Order status updated! Client has been notified via email.');
      setShowStatusModal(false);
      setShowDetailsModal(false);
      setNewStatus('');
      setStatusNote('');
      fetchOrders();
    } catch (error) {
      // ✅ Better error message extraction
      const message = error.response?.data?.message || 'Failed to update status';
      alert(`❌ ${message}`);
      console.error(error);
    }
  };

  const handleFileUploadSuccess = (uploadedFiles) => {
    setShowUploadModal(false);
    alert(`✅ ${uploadedFiles.length} file(s) uploaded! Client has been notified.`);
    fetchOrders();
    if (selectedOrder) {
      handleViewDetails(selectedOrder._id);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order? This cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/admin/orders/${orderId}`);
      alert('✅ Order deleted successfully!');
      setShowDetailsModal(false);
      fetchOrders();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete order';
      alert(`❌ ${message}`);
      console.error(error);
    }
  };

  const exportOrders = () => {
    const headers = ['Order Number', 'Client', 'Email', 'Phone', 'Service', 'Amount', 'Status', 'Date'];
    const csvData = orders.map((order) => [
      order.orderNumber,
      order.client?.name,
      order.client?.email,
      order.client?.phone,
      order.service?.name || order.serviceSnapshot?.name,
      order.totalAmount,
      order.status,
      new Date(order.createdAt).toLocaleDateString(),
    ]);

    const csv = [
      headers.join(','),
      ...csvData.map((row) => row.map((cell) => `"${cell || ''}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-neutral-darkNavy mb-2">
            Order Management
          </h1>
          <p className="text-neutral-gray">View and manage all client bookings</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={exportOrders} disabled={orders.length === 0}>
            📊 Export CSV
          </Button>
          <Button onClick={fetchOrders}>
            🔄 Refresh
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <Card>
        <div className="space-y-4">
          <div className="max-w-md">
            <Input
              placeholder="Search by order number, client name, or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // ✅ Reset to page 1 on search
              }}
              icon={<span>🔍</span>}
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-medium text-neutral-darkNavy">Filter:</span>
            {['all', 'pending', 'in_progress', 'completed', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setStatusFilter(status);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  statusFilter === status
                    ? 'bg-primary-teal text-white shadow-md'
                    : 'bg-neutral-lightGray text-neutral-darkGray hover:bg-neutral-gray/20'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary-teal border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-neutral-gray">Loading orders...</p>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold text-neutral-darkNavy mb-2">No orders found</h3>
            <p className="text-neutral-gray mb-6">
              {searchTerm
                ? 'Try adjusting your search terms'
                : statusFilter === 'all'
                ? 'Orders will appear here once clients start booking'
                : `No ${statusFilter.replace('_', ' ')} orders`}
            </p>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm('')}>
                Clear Search
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-lightGray">
                    <th className="text-left py-3 px-4 font-semibold text-neutral-darkGray">Order #</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-darkGray">Client</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-darkGray">Service</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-darkGray">Arrival</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-darkGray">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-darkGray">Files</th>
                    <th className="text-right py-3 px-4 font-semibold text-neutral-darkGray">Amount</th>
                    <th className="text-right py-3 px-4 font-semibold text-neutral-darkGray">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-lightGray">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-neutral-offWhite transition-colors">
                      <td className="py-4 px-4">
                        <span className="font-medium text-primary-teal">{order.orderNumber}</span>
                        <p className="text-xs text-neutral-gray mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-medium text-neutral-darkNavy">{order.client?.name}</p>
                        <p className="text-sm text-neutral-gray">{order.client?.email}</p>
                        <p className="text-xs text-neutral-gray">{order.client?.phone}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-neutral-darkGray">
                          {order.service?.name || order.serviceSnapshot?.name}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-neutral-darkGray">
                          {order.visitDetails?.arrivalDate
                            ? new Date(order.visitDetails.arrivalDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })
                            : 'N/A'}
                        </span>
                        <p className="text-xs text-neutral-gray mt-1">
                          {order.visitDetails?.numberOfPeople}{' '}
                          {order.visitDetails?.numberOfPeople === 1 ? 'person' : 'people'}
                        </p>
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="py-4 px-4">
                        {order.files && order.files.length > 0 ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary-teal/10 text-primary-teal text-xs font-medium">
                            📎 {order.files.length}
                          </span>
                        ) : (
                          <span className="text-neutral-gray text-xs">No files</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className="font-semibold text-neutral-darkNavy">
                          ${order.totalAmount}
                        </span>
                        <p className="text-xs text-neutral-gray mt-1">
                          {order.serviceSnapshot?.currency || 'USD'}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(order._id)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedOrder(order);
                              setNewStatus(order.status);
                              setShowStatusModal(true);
                            }}
                          >
                            Update
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-6 border-t border-neutral-lightGray">
                <p className="text-sm text-neutral-gray">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                  >
                    ← Previous
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Next →
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Status Update Modal */}
      <Modal
        isOpen={showStatusModal}
        onClose={() => {
          setShowStatusModal(false);
          setNewStatus('');
          setStatusNote('');
        }}
        title={`Update Order Status - ${selectedOrder?.orderNumber}`}
      >
        <div className="space-y-6">
          <div className="bg-neutral-offWhite p-4 rounded-lg">
            <p className="text-sm text-neutral-gray mb-2">Current Status</p>
            <StatusBadge status={selectedOrder?.status} />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-darkGray mb-2">
              New Status <span className="text-red-500">*</span>
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-lightGray rounded-lg outline-none focus:border-primary-teal"
            >
              <option value="">Select status...</option>
              <option value="pending">⏳ Pending</option>
              <option value="in_progress">🔄 In Progress</option>
              <option value="completed">✅ Completed</option>
              <option value="cancelled">❌ Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-darkGray mb-2">
              Note for Client (Optional)
            </label>
            <textarea
              value={statusNote}
              onChange={(e) => setStatusNote(e.target.value)}
              className="w-full px-4 py-3 border border-neutral-lightGray rounded-lg outline-none focus:border-primary-teal resize-none"
              rows="4"
              placeholder="This note will be included in the email notification..."
            />
            <p className="text-xs text-neutral-gray mt-2">
              💡 Client will receive an automatic email notification.
            </p>
          </div>

          {newStatus && newStatus !== selectedOrder?.status && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 font-semibold mb-2">📧 Email Preview</p>
              <p className="text-sm text-blue-700">
                Client will be notified that status changed to:{' '}
                <span className="font-bold">
                  {newStatus.replace('_', ' ').toUpperCase()}
                </span>
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowStatusModal(false);
                setNewStatus('');
                setStatusNote('');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateStatus}
              className="flex-1"
              disabled={!newStatus || newStatus === selectedOrder?.status}
            >
              Update & Notify Client
            </Button>
          </div>
        </div>
      </Modal>

      {/* Upload Files Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title={`Upload Files - ${selectedOrder?.orderNumber}`}
        size="lg"
      >
        {selectedOrder && (
          <FileUploader
            orderId={selectedOrder._id}
            onUploadSuccess={handleFileUploadSuccess}
            maxFiles={10}
            maxFileSize={50 * 1024 * 1024}
          />
        )}
      </Modal>

      {/* Order Details Modal */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={`Order Details - ${selectedOrder?.orderNumber}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <Button
                className="flex-1"
                onClick={() => {
                  setShowDetailsModal(false);
                  setNewStatus(selectedOrder.status);
                  setShowStatusModal(true);
                }}
              >
                📝 Update Status
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setShowDetailsModal(false);
                  setShowUploadModal(true);
                }}
              >
                📎 Upload Files
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  const message = `Hello ${selectedOrder.client?.name}, regarding your order ${selectedOrder.orderNumber}`;
                  window.open(
                    `https://wa.me/${selectedOrder.client?.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`,
                    '_blank'
                  );
                }}
              >
                💬 WhatsApp
              </Button>
            </div>

            {/* Status Overview */}
            <div className="bg-neutral-offWhite p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-gray mb-1">Current Status</p>
                  <StatusBadge status={selectedOrder.status} />
                </div>
                <div className="text-right">
                  <p className="text-sm text-neutral-gray mb-1">Order Date</p>
                  <p className="font-medium text-neutral-darkNavy">
                    {new Date(selectedOrder.createdAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            {/* Client Information */}
            <div>
              <h3 className="font-semibold text-neutral-darkNavy mb-3">👤 Client Information</h3>
              <div className="bg-neutral-offWhite p-4 rounded-lg space-y-3">
                {[
                  { label: 'Name', value: selectedOrder.client?.name },
                  { label: 'Email', value: selectedOrder.client?.email, isEmail: true },
                  { label: 'Phone', value: selectedOrder.client?.phone, isPhone: true },
                  { label: 'Country', value: selectedOrder.client?.country },
                  { label: 'Visit Purpose', value: selectedOrder.client?.visitPurpose },
                ].map(({ label, value, isEmail, isPhone }) =>
                  value ? (
                    <div key={label} className="flex justify-between items-center">
                      <span className="text-neutral-gray">{label}:</span>
                      {isEmail ? (
                        <a href={`mailto:${value}`} className="font-medium text-primary-teal hover:underline">
                          {value}
                        </a>
                      ) : isPhone ? (
                        <a href={`tel:${value}`} className="font-medium text-primary-teal hover:underline">
                          {value}
                        </a>
                      ) : (
                        <span className="font-medium text-neutral-darkNavy">{value}</span>
                      )}
                    </div>
                  ) : null
                )}
              </div>
            </div>

            {/* Service & Payment */}
            <div>
              <h3 className="font-semibold text-neutral-darkNavy mb-3">🛎️ Service & Payment</h3>
              <div className="bg-neutral-offWhite p-4 rounded-lg">
                <p className="font-medium text-lg mb-1 text-neutral-darkNavy">
                  {selectedOrder.serviceSnapshot?.name || selectedOrder.service?.name}
                </p>
                <div className="flex items-baseline mt-3">
                  <span className="text-3xl font-bold text-primary-teal">
                    ${selectedOrder.totalAmount}
                  </span>
                  <span className="text-neutral-gray ml-2">
                    {selectedOrder.serviceSnapshot?.currency || 'USD'}
                  </span>
                </div>
                <div className="mt-3 pt-3 border-t border-neutral-lightGray">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-gray">Payment Status:</span>
                    <span className={`font-medium ${
                      selectedOrder.paymentStatus === 'paid'
                        ? 'text-green-600'
                        : 'text-yellow-600'
                    }`}>
                      {selectedOrder.paymentStatus?.charAt(0).toUpperCase() +
                        selectedOrder.paymentStatus?.slice(1) || 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Visit Details */}
            <div>
              <h3 className="font-semibold text-neutral-darkNavy mb-3">📅 Visit Details</h3>
              <div className="bg-neutral-offWhite p-4 rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-neutral-gray">Arrival Date:</span>
                  <span className="font-medium text-neutral-darkNavy">
                    {selectedOrder.visitDetails?.arrivalDate
                      ? new Date(selectedOrder.visitDetails.arrivalDate).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : 'N/A'}
                  </span>
                </div>
                {selectedOrder.visitDetails?.departureDate && (
                  <div className="flex justify-between">
                    <span className="text-neutral-gray">Departure Date:</span>
                    <span className="font-medium text-neutral-darkNavy">
                      {new Date(selectedOrder.visitDetails.departureDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-neutral-gray">Number of People:</span>
                  <span className="font-medium text-neutral-darkNavy">
                    {selectedOrder.visitDetails?.numberOfPeople}
                  </span>
                </div>
                {selectedOrder.visitDetails?.specialRequests && (
                  <div className="pt-3 border-t border-neutral-lightGray">
                    <p className="text-neutral-gray text-sm mb-2">Special Requests:</p>
                    <p className="text-neutral-darkNavy bg-white p-3 rounded border border-neutral-lightGray">
                      {selectedOrder.visitDetails.specialRequests}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Uploaded Files */}
            {selectedOrder.files && selectedOrder.files.length > 0 && (
              <div>
                <h3 className="font-semibold text-neutral-darkNavy mb-3">
                  📎 Uploaded Files ({selectedOrder.files.length})
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {selectedOrder.files.map((file, index) => (
                    <div
                      key={file._id || index}
                      className="flex items-center justify-between p-3 bg-neutral-offWhite rounded-lg hover:bg-neutral-lightGray transition-colors"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <span className="text-2xl flex-shrink-0">
                          {file.fileType === 'photo' ? '📸'
                            : file.fileType === 'video' ? '🎥'
                            : file.fileType === 'itinerary' ? '📋'
                            : file.fileType === 'report' ? '📊'
                            : '📄'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-neutral-darkNavy truncate">
                            {file.fileName}
                          </p>
                          <p className="text-sm text-neutral-gray capitalize">
                            {file.fileType} •{' '}
                            {new Date(file.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary-teal hover:underline font-medium ml-4 flex-shrink-0"
                      >
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status History */}
            {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
              <div>
                <h3 className="font-semibold text-neutral-darkNavy mb-3">📜 Status History</h3>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {[...selectedOrder.statusHistory].reverse().map((history, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 bg-neutral-offWhite p-3 rounded-lg"
                    >
                      <div className="w-2 h-2 bg-primary-teal rounded-full mt-2 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <StatusBadge status={history.status} />
                          <span className="text-xs text-neutral-gray">
                            {new Date(history.timestamp).toLocaleString()}
                          </span>
                        </div>
                        {history.note && (
                          <p className="text-sm text-neutral-darkGray mt-2 bg-white p-2 rounded">
                            {history.note}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Danger Zone */}
            <div className="pt-6 border-t border-neutral-lightGray">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-800 mb-2">⚠️ Danger Zone</h4>
                <p className="text-sm text-red-600 mb-3">
                  Deleting this order is permanent and cannot be undone.
                </p>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteOrder(selectedOrder._id)}
                >
                  Delete Order
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrdersTable;