import { useState, useEffect } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Shield,
  MoreVertical,
  X,
  Check,
  UserCheck,
  UserX,
  Crown,
  Users as UsersIcon,
  Briefcase,
} from 'lucide-react';
import { User, UserRole, ROLE_HIERARCHY, canPerformAction } from '../types/user';
import { db } from '../data/database';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Current user (simulating logged-in user as super_admin)
  const currentUser: User = {
    id: 'user-1',
    email: 'superadmin@cloudcrm.com',
    full_name: 'Rajesh Kumar',
    role: 'super_admin',
    organization_id: 'org-1',
    status: 'active',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2024-01-15T10:30:00Z',
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await db.users.getAll();
      setUsers(data);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    const matchesStatus = filterStatus === 'all' || u.status === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getRoleBadge = (role: UserRole) => {
    const roleInfo = ROLE_HIERARCHY.find((r) => r.role === role);
    const colors: Record<UserRole, string> = {
      super_admin: 'bg-red-50 text-red-700 border-red-200',
      admin: 'bg-purple-50 text-purple-700 border-purple-200',
      leader: 'bg-blue-50 text-blue-700 border-blue-200',
      manager: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      employee: 'bg-slate-50 text-slate-700 border-slate-200',
    };
    return (
      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${colors[role]}`}>
        {roleInfo?.label || role}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      inactive: 'bg-slate-50 text-slate-700 border-slate-200',
      suspended: 'bg-red-50 text-red-700 border-red-200',
    };
    return (
      <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${colors[status]}`}>
        {status}
      </span>
    );
  };

  const handleDelete = async (id: string) => {
    if (!canPerformAction(currentUser.role, 'can_delete_records')) {
      alert('You do not have permission to delete users');
      return;
    }
    if (confirm('Are you sure you want to delete this user?')) {
      await db.users.delete(id);
      loadUsers();
    }
  };

  const handleToggleStatus = async (user: User) => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    await db.users.update(user.id, { status: newStatus });
    loadUsers();
  };

  const roleStats = {
    super_admin: users.filter((u) => u.role === 'super_admin').length,
    admin: users.filter((u) => u.role === 'admin').length,
    leader: users.filter((u) => u.role === 'leader').length,
    manager: users.filter((u) => u.role === 'manager').length,
    employee: users.filter((u) => u.role === 'employee').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">User Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage users, roles, and permissions</p>
        </div>
        {canPerformAction(currentUser.role, 'can_manage_users') && (
          <button
            onClick={() => {
              setEditingUser(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
          >
            <Plus size={18} />
            Add User
          </button>
        )}
      </div>

      {/* Role Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {ROLE_HIERARCHY.map((role) => (
          <div key={role.role} className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                role.role === 'super_admin' ? 'bg-red-100' :
                role.role === 'admin' ? 'bg-purple-100' :
                role.role === 'leader' ? 'bg-blue-100' :
                role.role === 'manager' ? 'bg-emerald-100' :
                'bg-slate-100'
              }`}>
                {role.role === 'super_admin' ? <Crown size={18} className="text-red-600" /> :
                 role.role === 'admin' ? <Shield size={18} className="text-purple-600" /> :
                 role.role === 'leader' ? <Briefcase size={18} className="text-blue-600" /> :
                 role.role === 'manager' ? <UsersIcon size={18} className="text-emerald-600" /> :
                 <UserCheck size={18} className="text-slate-600" />}
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{roleStats[role.role]}</p>
                <p className="text-xs text-slate-500">{role.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">All Roles</option>
          {ROLE_HIERARCHY.map((r) => (
            <option key={r.role} value={r.role}>{r.label}</option>
          ))}
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-100">
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Department</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Last Login</th>
              <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredUsers.map((user) => {
              const dept = user.department_id ? `Dept ${user.department_id.split('-')[1]}` : '—';
              return (
                <tr key={user.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {user.full_name.split(' ').map((n) => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{user.full_name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{dept}</td>
                  <td className="px-6 py-4">{getStatusBadge(user.status)}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      {canPerformAction(currentUser.role, 'can_manage_users') && (
                        <>
                          <button
                            onClick={() => {
                              setEditingUser(user);
                              setShowModal(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user)}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                            title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            {user.status === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}
                          </button>
                          {user.id !== currentUser.id && (
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete"
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* User Modal */}
      {showModal && (
        <UserModal
          user={editingUser}
          onClose={() => setShowModal(false)}
          onSave={async (userData) => {
            if (editingUser) {
              await db.users.update(editingUser.id, userData);
            } else {
              await db.users.create({
                ...userData,
                organization_id: currentUser.organization_id,
              } as any);
            }
            setShowModal(false);
            loadUsers();
          }}
        />
      )}
    </div>
  );
}

interface UserModalProps {
  user: User | null;
  onClose: () => void;
  onSave: (user: Partial<User>) => Promise<void>;
}

function UserModal({ user, onClose, onSave }: UserModalProps) {
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    role: user?.role || 'employee' as UserRole,
    phone: user?.phone || '',
    status: user?.status || 'active',
    department_id: user?.department_id || '',
    team_id: user?.team_id || '',
    manager_id: user?.manager_id || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">{user ? 'Edit User' : 'Add New User'}</h3>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-all">
              <X size={20} />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <input
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {ROLE_HIERARCHY.map((r) => (
                  <option key={r.role} value={r.role}>{r.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-slate-600 bg-slate-100 rounded-xl text-sm font-medium hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
            >
              {user ? 'Update User' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
