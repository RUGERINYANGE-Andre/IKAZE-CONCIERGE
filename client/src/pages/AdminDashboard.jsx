// client/src/pages/AdminDashboard.jsx

import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminSidebar from '../components/dashboard/admin/Sidebar';
import AdminStats from '../components/dashboard/admin/Stats';
import OrdersTable from '../components/dashboard/admin/OrdersTable';
import ServiceManager from '../components/dashboard/admin/ServiceManager';
import TestNotifications from '../components/dashboard/admin/TestNotifications';
import Users from '../components/dashboard/admin/Users';

// ── Icon ─────────────────────────────────────────────────────────
const MenuIcon = () => (
  <svg
    className="w-5 h-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
  >
    <path d="M3 12h18M3 6h18M3 18h12" />
  </svg>
);

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* ── Main Content ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-20 flex items-center justify-between px-4 py-3.5 bg-white border-b border-slate-100 shadow-sm">
          {/* Left: brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-sm">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="text-sm font-bold text-slate-800 tracking-tight">Admin</span>
          </div>

          {/* Right: hamburger */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-9 h-9 inline-flex items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-600 active:scale-95 transition-all duration-150"
            aria-label="Toggle sidebar"
          >
            <MenuIcon />
          </button>
        </header>

        {/* Desktop accent line */}
        <div className="hidden lg:block h-0.5 w-full bg-gradient-to-r from-teal-400 via-cyan-400 to-emerald-400 shrink-0" />

        {/* Scrollable content area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview"            element={<AdminStats />} />
              <Route path="/orders"             element={<OrdersTable />} />
              <Route path="/services"           element={<ServiceManager />} />
              <Route path="/users" element={<Users />} />
              <Route path="/test-notifications" element={<TestNotifications />} />
            </Routes>
          </div>
        </main>

      </div>
    </div>
  );
};

export default AdminDashboard;