// client/src/pages/ClientDashboard.jsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { orderService } from '../services/orderService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import StatusBadge from '../components/ui/StatusBadge';
import Modal from '../components/ui/Modal';

// ── Icon Components ──────────────────────────────────────────────
const Icons = {
  Spinner: () => (
    <svg className="w-10 h-10 text-teal-500 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3"/>
      <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
    </svg>
  ),
  Plus: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  ),
  Clipboard: () => (
    <svg className="w-12 h-12 text-slate-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"/>
      <rect x="9" y="3" width="6" height="4" rx="1"/>
    </svg>
  ),
  Target: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  Paperclip: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
    </svg>
  ),
  Image: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
      <path d="M21 15l-5-5L5 21"/>
    </svg>
  ),
  Video: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="15" height="14" rx="2"/><path d="M17 9l5-3v12l-5-3V9z"/>
    </svg>
  ),
  Document: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/>
    </svg>
  ),
  File: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><path d="M13 2v7h7"/>
    </svg>
  ),
  Download: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  ),
  Circle: () => (
    <svg className="w-2 h-2" viewBox="0 0 8 8" fill="currentColor">
      <circle cx="4" cy="4" r="4"/>
    </svg>
  ),
  Bookings: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
    </svg>
  ),
  Clock: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
    </svg>
  ),
  Loader: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  ),
  CheckCircle: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  ),
  Wave: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 110-16 8 8 0 010 16z" opacity=".3"/>
      <path d="M12 6a1 1 0 100 2 1 1 0 000-2zm-4 4a1 1 0 100 2 1 1 0 000-2zm8 0a1 1 0 100 2 1 1 0 000-2zm-4 4a1 1 0 100 2 1 1 0 000-2z"/>
    </svg>
  ),
};

const fileIcon = (type) => {
  if (type === 'photo') return <Icons.Image />;
  if (type === 'video') return <Icons.Video />;
  if (type === 'document') return <Icons.Document />;
  return <Icons.File />;
};

// ── Stat Card ───────────────────────────────────────────────────
const StatCard = ({ label, value, icon: Icon, accent }) => (
  <div
    className="relative overflow-hidden rounded-2xl p-6 bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-300"
    style={{ '--accent': accent }}
  >
    <div
      className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-10"
      style={{ background: accent }}
    />
    <div
      className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4"
      style={{ background: `${accent}18`, color: accent }}
    >
      <Icon />
    </div>
    <p className="text-3xl font-bold text-slate-800 leading-none mb-1">{value}</p>
    <p className="text-sm font-medium text-slate-400 tracking-wide uppercase">{label}</p>
  </div>
);

// ── Main Component ───────────────────────────────────────────────
const ClientDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getMyOrders();
      setOrders(response.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (orderId) => {
    try {
      const response = await orderService.getOrderById(orderId);
      setSelectedOrder(response.data);
      setShowDetailsModal(true);
    } catch (error) {
      console.error('Failed to fetch order details:', error);
    }
  };

  const getStatusStats = () => ({
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    inProgress: orders.filter(o => o.status === 'in_progress').length,
    completed: orders.filter(o => o.status === 'completed').length,
  });

  const stats = getStatusStats();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Icons.Spinner />
          <p className="text-sm font-medium text-slate-400 tracking-widest uppercase">Loading your orders</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top gradient bar */}
      <div className="h-1 w-full bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Header ──────────────────────────────── */}
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-widest text-teal-500 uppercase mb-1">
              Client Portal
            </p>
            <h1 className="text-3xl font-bold text-slate-800 leading-tight">
              Welcome back, {user?.name}
            </h1>
            <p className="text-slate-400 mt-1 text-sm">
              Track your bookings and access your travel documents
            </p>
          </div>

          <button
            onClick={() => window.location.href = '/booking'}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow transition-all duration-200"
          >
            <Icons.Plus />
            New Booking
          </button>
        </div>

        {/* ── Stats Grid ───────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total Bookings" value={stats.total} icon={Icons.Bookings} accent="#0d9488" />
          <StatCard label="Pending" value={stats.pending} icon={Icons.Clock} accent="#f59e0b" />
          <StatCard label="In Progress" value={stats.inProgress} icon={Icons.Loader} accent="#3b82f6" />
          <StatCard label="Completed" value={stats.completed} icon={Icons.CheckCircle} accent="#10b981" />
        </div>

        {/* ── Orders Table ─────────────────────────── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Your Bookings</h2>
          </div>

          {orders.length === 0 ? (
            <div className="py-20 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-slate-100 mb-5">
                <Icons.Clipboard />
              </div>
              <h3 className="text-lg font-semibold text-slate-700 mb-1">No bookings yet</h3>
              <p className="text-sm text-slate-400 mb-6">Start planning your perfect Rwanda visit today</p>
              <button
                onClick={() => window.location.href = '/booking'}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-semibold rounded-xl shadow-sm transition-all"
              >
                <Icons.Target />
                Plan My Visit
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    {['Order #', 'Service', 'Date', 'Status', 'Files', ''].map(h => (
                      <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold text-slate-400 uppercase tracking-wider last:text-right">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="group hover:bg-slate-50 transition-colors duration-150"
                    >
                      <td className="px-5 py-4 font-mono text-sm font-semibold text-teal-600">
                        {order.orderNumber}
                      </td>
                      <td className="px-5 py-4">
                        <p className="font-semibold text-slate-700">
                          {order.serviceSnapshot?.name || order.service?.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          ${order.totalAmount} USD
                        </p>
                      </td>
                      <td className="px-5 py-4 text-slate-500">
                        {new Date(order.visitDetails?.arrivalDate).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-4">
                        {order.files?.length > 0 ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-50 text-teal-600 text-xs font-semibold">
                            <Icons.Paperclip />
                            {order.files.length} file{order.files.length > 1 ? 's' : ''}
                          </span>
                        ) : (
                          <span className="text-slate-300 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleViewDetails(order._id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-600 border border-slate-200 rounded-lg hover:border-teal-400 hover:text-teal-600 transition-all duration-200"
                        >
                          Details
                          <Icons.ChevronRight />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Order Details Modal ──────────────────────── */}
      <Modal
        isOpen={showDetailsModal}
        onClose={() => setShowDetailsModal(false)}
        title={`Order ${selectedOrder?.orderNumber}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6 p-1">

            {/* Status */}
            <div className="flex items-center gap-3">
              <StatusBadge status={selectedOrder.status} />
            </div>

            {/* Service Info */}
            <div className="rounded-xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-100 p-5">
              <p className="text-xs font-semibold text-teal-500 uppercase tracking-widest mb-1">Service</p>
              <p className="font-bold text-slate-800 text-lg">{selectedOrder.serviceSnapshot?.name}</p>
              <p className="text-2xl font-bold text-teal-600 mt-1">${selectedOrder.totalAmount} <span className="text-sm font-normal text-slate-400">USD</span></p>
            </div>

            {/* Visit Details */}
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">Visit Details</p>
              <div className="rounded-xl border border-slate-100 divide-y divide-slate-100">
                <Row label="Arrival" value={new Date(selectedOrder.visitDetails?.arrivalDate).toLocaleDateString()} />
                {selectedOrder.visitDetails?.departureDate && (
                  <Row label="Departure" value={new Date(selectedOrder.visitDetails.departureDate).toLocaleDateString()} />
                )}
                <Row label="Guests" value={selectedOrder.visitDetails?.numberOfPeople} />
                {selectedOrder.visitDetails?.specialRequests && (
                  <div className="px-4 py-3">
                    <p className="text-xs text-slate-400 mb-1">Special Requests</p>
                    <p className="text-slate-700 text-sm">{selectedOrder.visitDetails.specialRequests}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Files */}
            {selectedOrder.files?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-3">
                  Files · {selectedOrder.files.length}
                </p>
                <div className="space-y-2">
                  {selectedOrder.files.map((file) => (
                    <div
                      key={file._id}
                      className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-500 shadow-sm">
                          {fileIcon(file.fileType)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{file.fileName}</p>
                          <p className="text-xs text-slate-400 capitalize">{file.fileType}</p>
                        </div>
                      </div>
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 px-3 py-1.5 rounded-lg hover:bg-teal-50 transition-all"
                      >
                        <Icons.Download />
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Status History */}
            {selectedOrder.statusHistory?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Timeline</p>
                <div className="relative pl-5 border-l-2 border-slate-100 space-y-5">
                  {selectedOrder.statusHistory.map((h, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[1.35rem] w-3.5 h-3.5 rounded-full bg-white border-2 border-teal-400 top-0.5" />
                      <p className="font-semibold text-slate-700 capitalize text-sm">
                        {h.status.replace('_', ' ')}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(h.timestamp).toLocaleString()}
                      </p>
                      {h.note && <p className="text-xs text-slate-500 mt-1 italic">{h.note}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}
      </Modal>
    </div>
  );
};

// ── Helper ───────────────────────────────────────────────────────
const Row = ({ label, value }) => (
  <div className="flex justify-between items-center px-4 py-3">
    <span className="text-sm text-slate-400">{label}</span>
    <span className="text-sm font-semibold text-slate-700">{value}</span>
  </div>
);

export default ClientDashboard;