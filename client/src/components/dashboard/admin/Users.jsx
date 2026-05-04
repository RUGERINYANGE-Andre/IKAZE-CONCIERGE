// client/src/components/dashboard/admin/Users.jsx
// Route: /admin/users  — add to AdminDashboard routes:
//   import Users from '../components/dashboard/admin/Users';
//   <Route path="/users" element={<Users />} />
//
// Backend required — add to server/routes/admin.js:
//   const { getAllUsers, toggleUserStatus } = require('../controllers/adminController');
//   router.get('/users', getAllUsers);
//   router.patch('/users/:id/toggle', toggleUserStatus);
//
// Add to server/controllers/adminController.js:
//   exports.getAllUsers = async (req, res) => {
//     try {
//       const { page = 1, limit = 20, search, role } = req.query;
//       const query = {};
//       if (role && role !== 'all') query.role = role;
//       if (search) {
//         const r = new RegExp(search, 'i');
//         query.$or = [{ name: r }, { email: r }, { phone: r }, { country: r }];
//       }
//       const total = await User.countDocuments(query);
//       const users = await User.find(query)
//         .select('-password')
//         .sort({ createdAt: -1 })
//         .skip((+page - 1) * +limit)
//         .limit(+limit);
//       const orderCounts = await Order.aggregate([
//         { $group: { _id: '$client', count: { $sum: 1 } } }
//       ]);
//       const countMap = Object.fromEntries(orderCounts.map(o => [o._id.toString(), o.count]));
//       const usersWithOrders = users.map(u => ({
//         ...u.toObject(),
//         orderCount: countMap[u._id.toString()] || 0,
//       }));
//       res.json({ success: true, data: usersWithOrders, total, totalPages: Math.ceil(total / +limit), currentPage: +page });
//     } catch (error) { res.status(500).json({ success: false, message: error.message }); }
//   };
//   exports.toggleUserStatus = async (req, res) => {
//     try {
//       const user = await User.findById(req.params.id);
//       if (!user) return res.status(404).json({ success: false, message: 'User not found' });
//       user.isActive = !user.isActive;
//       await user.save();
//       res.json({ success: true, data: user });
//     } catch (error) { res.status(500).json({ success: false, message: error.message }); }
//   };

import React, { useState, useEffect, useCallback } from 'react';
import api from '../../../services/api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faSearch,
  faRefresh,
  faTriangleExclamation,
  faCircleCheck,
  faBan,
  faUserShield,
  faUser,
  faBoxOpen,
  faPhone,
  faGlobe,
  faEllipsisVertical,
  faToggleOn,
  faToggleOff,
  faAngleLeft,
  faAngleRight,
  faCalendar,
  faEnvelope,
  faFilter,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

// ── Helpers ───────────────────────────────────────────────
const initials = (name = '') =>
  name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

const roleColor = (role) =>
  role === 'admin'
    ? 'bg-purple-500/15 text-purple-400 border-purple-500/20'
    : 'bg-teal-500/15 text-teal-400 border-teal-500/20';

const avatarGradient = (name = '') => {
  const hue = (name.charCodeAt(0) * 37 + name.charCodeAt(1) * 13) % 360;
  return `hsl(${hue},55%,38%)`;
};

// ── Skeleton ──────────────────────────────────────────────
const Skeleton = ({ className }) => (
  <div className={`animate-pulse bg-white/[0.06] rounded-lg ${className}`} />
);

// ── Action Menu ───────────────────────────────────────────
const ActionMenu = ({ user, onToggle }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500
                   hover:text-white hover:bg-white/10 transition-all"
      >
        <FontAwesomeIcon icon={faEllipsisVertical} className="text-xs" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-9 z-20 w-44 rounded-xl bg-[#1a1f2e] border border-white/10 shadow-2xl overflow-hidden">
            <button
              onClick={() => { onToggle(user); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors
                ${user.isActive
                  ? 'text-red-400 hover:bg-red-500/10'
                  : 'text-emerald-400 hover:bg-emerald-500/10'
                }`}
            >
              <FontAwesomeIcon icon={user.isActive ? faToggleOff : faToggleOn} />
              {user.isActive ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// ── User Detail Drawer ────────────────────────────────────
const UserDrawer = ({ user, onClose, onToggle }) => {
  if (!user) return null;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-[#0d1117] border-l border-white/[0.07] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <h3 className="text-white font-bold">User Profile</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400
                       hover:text-white hover:bg-white/10 transition-all"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Avatar & name */}
          <div className="flex flex-col items-center text-center gap-3">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg"
              style={{ background: avatarGradient(user.name) }}
            >
              {initials(user.name)}
            </div>
            <div>
              <p className="text-white text-lg font-bold">{user.name}</p>
              <span className={`inline-flex items-center gap-1.5 mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${roleColor(user.role)}`}>
                <FontAwesomeIcon icon={user.role === 'admin' ? faUserShield : faUser} className="text-[9px]" />
                {user.role}
              </span>
            </div>
            {/* Active badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${user.isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
              {user.isActive ? 'Active' : 'Deactivated'}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-3">
            {[
              { icon: faEnvelope, label: 'Email', value: user.email },
              { icon: faPhone, label: 'Phone', value: user.phone },
              { icon: faGlobe, label: 'Country', value: user.country || '—' },
              { icon: faBoxOpen, label: 'Total Orders', value: user.orderCount ?? 0 },
              { icon: faCalendar, label: 'Joined', value: new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04]">
                <div className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center shrink-0">
                  <FontAwesomeIcon icon={icon} className="text-slate-400 text-xs" />
                </div>
                <div>
                  <p className="text-[11px] text-slate-500">{label}</p>
                  <p className="text-white text-sm font-medium truncate">{value}</p>
                </div>
              </div>
            ))}
            {user.visitPurpose && (
              <div className="p-3 rounded-xl bg-white/[0.04]">
                <p className="text-[11px] text-slate-500 mb-1">Visit Purpose</p>
                <p className="text-white text-sm">{user.visitPurpose}</p>
              </div>
            )}
          </div>

          {/* Action */}
          <button
            onClick={() => { onToggle(user); onClose(); }}
            className={`w-full py-3 rounded-xl text-sm font-semibold transition-all
              ${user.isActive
                ? 'bg-red-500/15 text-red-400 hover:bg-red-500/25'
                : 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
              }`}
          >
            <FontAwesomeIcon icon={user.isActive ? faToggleOff : faToggleOn} className="mr-2" />
            {user.isActive ? 'Deactivate Account' : 'Activate Account'}
          </button>
        </div>
      </div>
    </>
  );
};

// ── Main Component ────────────────────────────────────────
const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const LIMIT = 15;

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({ page, limit: LIMIT });
      if (search) params.set('search', search);
      if (roleFilter !== 'all') params.set('role', roleFilter);
      const res = await api.get(`/admin/users?${params}`);
      const d = res.data;
      setUsers(d.data || []);
      setTotalPages(d.totalPages || 1);
      setTotal(d.total || 0);
    } catch (err) {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  }, [page, search, roleFilter]);

  useEffect(() => {
    const t = setTimeout(fetchUsers, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [fetchUsers]);

  // Reset page when filter/search changes
  useEffect(() => { setPage(1); }, [search, roleFilter]);

  const handleToggle = async (user) => {
    setTogglingId(user._id);
    try {
      await api.patch(`/admin/users/${user._id}/toggle`);
      setUsers(prev =>
        prev.map(u => u._id === user._id ? { ...u, isActive: !u.isActive } : u)
      );
      if (selectedUser?._id === user._id) {
        setSelectedUser(prev => ({ ...prev, isActive: !prev.isActive }));
      }
    } catch (err) {
      console.error('Toggle failed:', err);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <div className="space-y-6">

      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[0.2em] text-teal-400 uppercase mb-1">
            Admin · Users
          </p>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-slate-400 text-sm mt-1">
            {total} registered account{total !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="w-9 h-9 rounded-xl border border-white/10 flex items-center justify-center
                     text-slate-400 hover:text-white hover:border-white/20 transition-all"
        >
          <FontAwesomeIcon icon={faRefresh} className="text-sm" />
        </button>
      </div>

      {/* ── Filters bar ────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <FontAwesomeIcon
            icon={faSearch}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs"
          />
          <input
            type="text"
            placeholder="Search by name, email, phone, country…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08]
                       text-white text-sm placeholder-slate-500 outline-none
                       focus:border-teal-500/50 focus:bg-white/[0.07] transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xs" />
            </button>
          )}
        </div>

        {/* Role filter */}
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.07] shrink-0">
          {['all', 'client', 'admin'].map(r => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize
                ${roleFilter === r
                  ? 'bg-teal-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
                }`}
            >
              {r === 'all' ? 'All roles' : r}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────── */}
      <div className="rounded-2xl bg-[#0d1117] border border-white/[0.07] overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-500/15 flex items-center justify-center mx-auto mb-3">
              <FontAwesomeIcon icon={faTriangleExclamation} className="text-red-400 text-lg" />
            </div>
            <p className="text-slate-400 text-sm">{error}</p>
            <button onClick={fetchUsers} className="mt-3 text-teal-400 text-sm hover:underline">
              Try again
            </button>
          </div>
        ) : users.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-3">
              <FontAwesomeIcon icon={faUsers} className="text-slate-500 text-lg" />
            </div>
            <p className="text-slate-400 text-sm">No users found</p>
            {(search || roleFilter !== 'all') && (
              <button
                onClick={() => { setSearch(''); setRoleFilter('all'); }}
                className="mt-2 text-teal-400 text-xs hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.05]">
                    {['User', 'Contact', 'Role', 'Orders', 'Status', 'Joined', ''].map((h, i) => (
                      <th
                        key={h + i}
                        className={`px-5 py-3 text-[10px] font-bold tracking-widest text-slate-500 uppercase
                                    ${i === 6 ? 'text-right' : 'text-left'}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04]">
                  {users.map((u) => (
                    <tr
                      key={u._id}
                      className="group hover:bg-white/[0.03] transition-colors"
                    >
                      {/* User */}
                      <td className="px-5 py-3.5">
                        <div
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => setSelectedUser(u)}
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0"
                            style={{ background: avatarGradient(u.name) }}
                          >
                            {initials(u.name)}
                          </div>
                          <div>
                            <p className="text-white font-semibold text-xs leading-tight group-hover:text-teal-400 transition-colors">
                              {u.name}
                            </p>
                            {u.country && (
                              <p className="text-slate-500 text-[11px] mt-0.5">{u.country}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="px-5 py-3.5">
                        <p className="text-slate-300 text-xs">{u.email}</p>
                        <p className="text-slate-500 text-[11px] mt-0.5">{u.phone}</p>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${roleColor(u.role)}`}>
                          <FontAwesomeIcon icon={u.role === 'admin' ? faUserShield : faUser} className="text-[9px]" />
                          {u.role}
                        </span>
                      </td>

                      {/* Orders */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <FontAwesomeIcon icon={faBoxOpen} className="text-slate-500 text-[10px]" />
                          <span className="text-white text-xs font-semibold">{u.orderCount ?? 0}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold
                          ${u.isActive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-emerald-400' : 'bg-red-400'}`} />
                          {u.isActive ? 'Active' : 'Inactive'}
                        </div>
                      </td>

                      {/* Joined */}
                      <td className="px-5 py-3.5 text-slate-400 text-xs">
                        {new Date(u.createdAt).toLocaleDateString('en-US', {
                          month: 'short', day: 'numeric', year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5 text-right">
                        {togglingId === u._id ? (
                          <div className="w-4 h-4 border-2 border-teal-400 border-t-transparent rounded-full animate-spin ml-auto" />
                        ) : (
                          <ActionMenu user={u} onToggle={handleToggle} />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-white/[0.05]">
                <p className="text-xs text-slate-500">
                  Page {page} of {totalPages} · {total} users
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10
                               text-slate-400 hover:text-white hover:border-white/20 transition-all
                               disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <FontAwesomeIcon icon={faAngleLeft} className="text-xs" />
                  </button>
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const p = i + 1;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all
                          ${page === p
                            ? 'bg-teal-500 text-white'
                            : 'text-slate-400 hover:text-white hover:bg-white/10'
                          }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-8 h-8 rounded-lg flex items-center justify-center border border-white/10
                               text-slate-400 hover:text-white hover:border-white/20 transition-all
                               disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <FontAwesomeIcon icon={faAngleRight} className="text-xs" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Detail drawer ─────────────────────────────── */}
      {selectedUser && (
        <UserDrawer
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onToggle={handleToggle}
        />
      )}
    </div>
  );
};

export default Users;