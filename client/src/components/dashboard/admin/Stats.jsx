// client/src/components/dashboard/admin/Stats.jsx
// Requires: @fortawesome/react-fontawesome + @fortawesome/free-solid-svg-icons

import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import StatusBadge from '../../ui/StatusBadge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBoxOpen,
  faHourglassHalf,
  faArrowsRotate,
  faCircleCheck,
  faBan,
  faDollarSign,
  faUsers,
  faArrowTrendUp,
  faAngleRight,
  faTriangleExclamation,
  faRefresh,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

// ── Mini Sparkline (pure SVG) ────────────────────────────
const Sparkline = ({ color = '#14b8a6' }) => {
  const pts = [18, 28, 22, 35, 30, 42, 38, 52, 46, 58];
  const max = Math.max(...pts);
  const min = Math.min(...pts);
  const norm = pts.map(p => 36 - ((p - min) / (max - min)) * 32);
  const d = norm.map((y, i) => `${i === 0 ? 'M' : 'L'}${i * 11.1},${y}`).join(' ');
  return (
    <svg viewBox="0 0 100 40" className="w-20 h-8" preserveAspectRatio="none">
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
    </svg>
  );
};

// ── Stat Card ────────────────────────────────────────────
const StatCard = ({ label, value, subtitle, icon, gradient, sparkColor, delay = 0 }) => (
  <div
    className="relative overflow-hidden rounded-2xl p-5 text-white shadow-lg"
    style={{ background: gradient, animationDelay: `${delay}ms` }}
  >
    {/* Background decoration */}
    <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10" />
    <div className="absolute -right-1 -bottom-6 w-16 h-16 rounded-full bg-white/5" />

    {/* Icon */}
    <div className="relative flex items-start justify-between mb-4">
      <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shadow-inner">
        <FontAwesomeIcon icon={icon} className="text-white text-sm" />
      </div>
      <Sparkline color={sparkColor} />
    </div>

    {/* Value */}
    <p className="text-3xl font-bold leading-none mb-1">{value ?? '—'}</p>
    <p className="text-sm font-semibold opacity-90">{label}</p>
    <p className="text-xs opacity-60 mt-0.5">{subtitle}</p>
  </div>
);

// ── Revenue Card ─────────────────────────────────────────
const RevenueCard = ({ value }) => (
  <div className="relative overflow-hidden rounded-2xl bg-[#0d1117] border border-white/[0.07] p-6 text-white col-span-full lg:col-span-2">
    <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 via-transparent to-emerald-500/5 pointer-events-none" />
    <div className="relative flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
            <FontAwesomeIcon icon={faDollarSign} className="text-teal-400 text-sm" />
          </div>
          <p className="text-xs font-bold tracking-widest text-teal-400 uppercase">Total Revenue</p>
        </div>
        <p className="text-4xl font-bold text-white">
          ${(value || 0).toLocaleString()}
          <span className="text-lg font-normal text-slate-400 ml-1">USD</span>
        </p>
        <p className="text-xs text-slate-500 mt-1">From all non-cancelled orders</p>
      </div>
      <div className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/15 text-emerald-400 text-sm font-semibold">
        <FontAwesomeIcon icon={faArrowTrendUp} className="text-xs" />
        Active
      </div>
    </div>
  </div>
);

// ── Loading skeleton ─────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-slate-800/60 rounded-xl ${className}`} />
);

// ── Main Component ───────────────────────────────────────
const Stats = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchAnalytics(); }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/admin/analytics');
      setAnalytics(response.data?.data || response.data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError('Failed to load analytics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const stats = analytics?.stats || {};
  const recentOrders = analytics?.recentOrders || [];

  // ── Loading state ──────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-36" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <Skeleton className="lg:col-span-2 h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-72" />
      </div>
    );
  }

  // ── Error state ────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-red-500/15 flex items-center justify-center">
          <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-400 text-xl" />
        </div>
        <div>
          <p className="text-white font-semibold mb-1">Something went wrong</p>
          <p className="text-slate-400 text-sm">{error}</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500/20 text-teal-400 text-sm font-semibold hover:bg-teal-500/30 transition-colors"
        >
          <FontAwesomeIcon icon={faRefresh} />
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* ── Page header ───────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-teal-400 uppercase mb-1">
            Admin · Overview
          </p>
          <h1 className="text-2xl font-bold text-white leading-tight">
            Dashboard Overview
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Monitor your business performance at a glance
          </p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center
                     text-slate-400 hover:text-white hover:border-white/20 transition-all"
          title="Refresh"
        >
          <FontAwesomeIcon icon={faRefresh} className="text-sm" />
        </button>
      </div>

      {/* ── Primary stats grid ────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Orders"
          value={stats.totalOrders}
          subtitle="All-time bookings"
          icon={faBoxOpen}
          gradient="linear-gradient(135deg, #0d9488 0%, #0891b2 100%)"
          sparkColor="#5eead4"
          delay={0}
        />
        <StatCard
          label="Pending"
          value={stats.pendingOrders}
          subtitle="Awaiting action"
          icon={faHourglassHalf}
          gradient="linear-gradient(135deg, #d97706 0%, #ea580c 100%)"
          sparkColor="#fcd34d"
          delay={60}
        />
        <StatCard
          label="In Progress"
          value={stats.inProgressOrders}
          subtitle="Currently active"
          icon={faArrowsRotate}
          gradient="linear-gradient(135deg, #2563eb 0%, #7c3aed 100%)"
          sparkColor="#93c5fd"
          delay={120}
        />
        <StatCard
          label="Completed"
          value={stats.completedOrders}
          subtitle="Delivered successfully"
          icon={faCircleCheck}
          gradient="linear-gradient(135deg, #059669 0%, #0d9488 100%)"
          sparkColor="#6ee7b7"
          delay={180}
        />
      </div>

      {/* ── Secondary row ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Revenue — spans 2 cols */}
        <RevenueCard value={stats.totalRevenue} />

        {/* Cancelled */}
        <div className="rounded-2xl bg-[#0d1117] border border-white/[0.07] p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-red-500/15 flex items-center justify-center shrink-0">
            <FontAwesomeIcon icon={faBan} className="text-red-400 text-sm" />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{stats.cancelledOrders ?? 0}</p>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">Cancelled</p>
          </div>
        </div>

        {/* Total Clients */}
        <div
          className="rounded-2xl bg-[#0d1117] border border-white/[0.07] p-5 flex items-center gap-4 cursor-pointer hover:border-teal-500/30 transition-colors group"
          onClick={() => navigate('/admin/users')}
        >
          <div className="w-11 h-11 rounded-xl bg-teal-500/15 flex items-center justify-center shrink-0">
            <FontAwesomeIcon icon={faUsers} className="text-teal-400 text-sm" />
          </div>
          <div className="flex-1">
            <p className="text-2xl font-bold text-white">{stats.totalClients ?? 0}</p>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">Total Clients</p>
          </div>
          <FontAwesomeIcon icon={faAngleRight} className="text-slate-600 group-hover:text-teal-400 transition-colors text-xs" />
        </div>
      </div>

      {/* ── Recent Orders table ───────────────────────── */}
      <div className="rounded-2xl bg-[#0d1117] border border-white/[0.07] overflow-hidden">
        {/* Table header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h2 className="text-base font-bold text-white">Recent Orders</h2>
          <button
            onClick={() => navigate('/admin/orders')}
            className="text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-1"
          >
            View all <FontAwesomeIcon icon={faAngleRight} className="text-[10px]" />
          </button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3">
              <FontAwesomeIcon icon={faBoxOpen} className="text-slate-500 text-lg" />
            </div>
            <p className="text-slate-400 text-sm">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.05]">
                  {['Order', 'Client', 'Service', 'Date', 'Status', 'Amount'].map((h, i) => (
                    <th
                      key={h}
                      className={`px-5 py-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase
                                  ${i === 5 ? 'text-right' : 'text-left'}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {recentOrders.map((order) => (
                  <tr
                    key={order._id}
                    className="group hover:bg-white/[0.03] transition-colors cursor-pointer"
                    onClick={() => navigate('/admin/orders')}
                  >
                    <td className="px-5 py-3.5 font-mono text-xs font-bold text-teal-400">
                      {order.orderNumber}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-white font-medium text-xs">{order.client?.name}</p>
                      <p className="text-slate-500 text-[11px]">{order.client?.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-slate-300 text-xs">
                      {order.service?.name || order.serviceSnapshot?.name}
                    </td>
                    <td className="px-5 py-3.5 text-slate-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', year: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-3.5 text-right font-bold text-white text-xs">
                      ${order.totalAmount?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default Stats;