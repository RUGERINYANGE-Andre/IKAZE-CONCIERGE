// client/src/components/dashboard/admin/Sidebar.jsx
// Requires: @fortawesome/react-fontawesome + @fortawesome/free-solid-svg-icons
// npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/fontawesome-svg-core

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartPie,
  faBoxOpen,
  faConciergeBell,
  faBell,
  faUsers,
  faGlobe,
  faRightFromBracket,
  faShieldHalved,
} from '@fortawesome/free-solid-svg-icons';

const navItems = [
  { name: 'Overview',           path: '/admin/overview',            icon: faChartPie,       desc: 'Analytics & KPIs' },
  { name: 'Orders',             path: '/admin/orders',              icon: faBoxOpen,        desc: 'Manage bookings' },
  { name: 'Services',           path: '/admin/services',            icon: faConciergeBell,  desc: 'Service catalog' },
  { name: 'Users',              path: '/admin/users',               icon: faUsers,          desc: 'Client accounts' },
  { name: 'Notifications',      path: '/admin/test-notifications',  icon: faBell,           desc: 'Test alerts' },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // First letter of name for avatar fallback
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'AD';

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar shell */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-30
          w-[17rem] flex flex-col
          bg-[#0d1117] border-r border-white/[0.06]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* ── Brand ─────────────────────────────────────────── */}
        <div className="px-6 py-6 border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            {/* Logo chip */}
            <div className="relative w-10 h-10 shrink-0">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 opacity-20 blur-md" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center shadow-lg">
                <FontAwesomeIcon icon={faShieldHalved} className="text-white text-sm" />
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-teal-400 uppercase">
                Ikaze Concierge
              </p>
              <h2 className="text-white font-bold text-base leading-tight tracking-tight">
                Admin Panel
              </h2>
            </div>
          </div>
        </div>

        {/* ── User card ──────────────────────────────────────── */}
        <div className="mx-4 my-4 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.07]">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-600 flex items-center justify-center shrink-0 shadow">
              <span className="text-xs font-bold text-white">{initials}</span>
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <p className="text-[11px] text-slate-400 font-medium">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Section label ─────────────────────────────────── */}
        <p className="px-6 mb-2 text-[10px] font-bold tracking-[0.18em] text-slate-500 uppercase">
          Navigation
        </p>

        {/* ── Nav links ─────────────────────────────────────── */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3.5 py-3 rounded-xl
                 transition-all duration-200 cursor-pointer
                 ${isActive
                   ? 'bg-teal-500/15 text-teal-400'
                   : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                 }`
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active left bar */}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full bg-teal-400" />
                  )}

                  {/* Icon box */}
                  <span
                    className={`
                      w-8 h-8 rounded-lg flex items-center justify-center shrink-0
                      transition-all duration-200 text-sm
                      ${isActive
                        ? 'bg-teal-400/20 text-teal-400'
                        : 'bg-white/[0.05] text-slate-400 group-hover:bg-white/10 group-hover:text-white'
                      }
                    `}
                  >
                    <FontAwesomeIcon icon={item.icon} />
                  </span>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-none">{item.name}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5 truncate">{item.desc}</p>
                  </div>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* ── Footer actions ────────────────────────────────── */}
        <div className="p-3 border-t border-white/[0.06] space-y-1">
          <button
            onClick={() => { window.open('/', '_blank'); setIsOpen(false); }}
            className="group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl
                       text-slate-400 hover:text-white hover:bg-white/[0.05]
                       transition-all duration-200"
          >
            <span className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0
                             text-xs group-hover:bg-white/10 transition-colors">
              <FontAwesomeIcon icon={faGlobe} />
            </span>
            <span className="text-sm font-medium">View Website</span>
          </button>

          <button
            onClick={handleLogout}
            className="group w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl
                       text-slate-400 hover:text-red-400 hover:bg-red-500/10
                       transition-all duration-200"
          >
            <span className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0
                             text-xs group-hover:bg-red-500/15 group-hover:text-red-400 transition-colors">
              <FontAwesomeIcon icon={faRightFromBracket} />
            </span>
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;