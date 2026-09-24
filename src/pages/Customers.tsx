import { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  MoreVertical,
  Phone,
  Mail,
  MapPin,
  Building,
  Calendar,
  Shield,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  X,
  ChevronRight,
} from 'lucide-react';
import { customers } from '../data/mockData';
import { Customer } from '../types';

export default function Customers() {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSegment, setFilterSegment] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSegment = filterSegment === 'all' || c.segment === filterSegment;
    return matchesSearch && matchesSegment;
  });

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
    return `₹${amount.toLocaleString()}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'inactive': return 'bg-red-50 text-red-700 border-red-200';
      case 'prospect': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-emerald-600 bg-emerald-50';
      case 'medium': return 'text-amber-600 bg-amber-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Customers</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your customer relationships (Customer 360°)</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, company, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>
        <select
          value={filterSegment}
          onChange={(e) => setFilterSegment(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">All Segments</option>
          <option value="retail">Retail</option>
          <option value="corporate">Corporate</option>
          <option value="hni">HNI</option>
          <option value="sme">SME</option>
        </select>
        <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-2 text-sm ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-500'}`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-2 text-sm ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-slate-500'}`}
          >
            Grid
          </button>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {viewMode === 'list' ? (
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Company</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Segment</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Risk</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Assets</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedCustomer(customer)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{customer.name}</p>
                        <p className="text-xs text-slate-500">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-700">{customer.company}</p>
                    <p className="text-xs text-slate-500">{customer.designation}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full capitalize">
                      {customer.segment}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getStatusColor(customer.status)} capitalize`}>
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${getRiskColor(customer.riskProfile)}`}>
                      {customer.riskProfile}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-semibold text-slate-800">{formatCurrency(customer.totalAssets)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" onClick={(e) => { e.stopPropagation(); setSelectedCustomer(customer); }}>
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                        <Edit size={16} />
                      </button>
                      <button className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="border border-slate-100 rounded-xl p-5 hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
                onClick={() => setSelectedCustomer(customer)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {customer.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{customer.name}</p>
                      <p className="text-xs text-slate-500">{customer.designation}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${getStatusColor(customer.status)} capitalize`}>
                    {customer.status}
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Building size={13} />
                    <span>{customer.company}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin size={13} />
                    <span>{customer.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <TrendingUp size={13} />
                    <span className="font-semibold text-slate-700">{formatCurrency(customer.totalAssets)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customer 360 Detail Panel */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-end">
          <div className="w-full max-w-2xl h-full bg-white overflow-y-auto shadow-2xl animate-slide-in">
            <div className="sticky top-0 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-slate-800">Customer 360° View</h2>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 hover:bg-slate-100 rounded-xl transition-all"
              >
                <X size={20} className="text-slate-500" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/25">
                  {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">{selectedCustomer.name}</h3>
                  <p className="text-sm text-slate-500">{selectedCustomer.designation} at {selectedCustomer.company}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${getStatusColor(selectedCustomer.status)} capitalize`}>
                      {selectedCustomer.status}
                    </span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${getRiskColor(selectedCustomer.riskProfile)}`}>
                      {selectedCustomer.riskProfile} risk
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Mail size={14} />
                    <span className="text-xs font-medium">Email</span>
                  </div>
                  <p className="text-sm font-medium text-slate-700">{selectedCustomer.email}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Phone size={14} />
                    <span className="text-xs font-medium">Phone</span>
                  </div>
                  <p className="text-sm font-medium text-slate-700">{selectedCustomer.phone}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <MapPin size={14} />
                    <span className="text-xs font-medium">Address</span>
                  </div>
                  <p className="text-sm font-medium text-slate-700">{selectedCustomer.address}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <Calendar size={14} />
                    <span className="text-xs font-medium">Customer Since</span>
                  </div>
                  <p className="text-sm font-medium text-slate-700">{selectedCustomer.createdAt}</p>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 text-white">
                <h4 className="text-sm font-medium text-blue-100 mb-3">Financial Summary</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-2xl font-bold">{formatCurrency(selectedCustomer.totalAssets)}</p>
                    <p className="text-xs text-blue-200 mt-1">Total Assets</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">₹12.5L</p>
                    <p className="text-xs text-blue-200 mt-1">Outstanding</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">750+</p>
                    <p className="text-xs text-blue-200 mt-1">Credit Score</p>
                  </div>
                </div>
              </div>

              {/* KYC Details */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Shield size={16} className="text-blue-600" />
                  KYC & Compliance
                </h4>
                <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">PAN Number</span>
                    <span className="text-sm font-medium text-slate-700">{selectedCustomer.panNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">Date of Birth</span>
                    <span className="text-sm font-medium text-slate-700">{selectedCustomer.dob}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">KYC Status</span>
                    <span className="text-sm font-medium text-emerald-600">✓ Verified</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-500">Aadhaar Linked</span>
                    <span className="text-sm font-medium text-emerald-600">✓ Yes</span>
                  </div>
                </div>
              </div>

              {/* Products & Services */}
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Products & Services</h4>
                <div className="space-y-2">
                  {['Current Account', 'Term Loan - ₹50L', 'Trade Finance - LC/BG', 'Fixed Deposit - ₹2Cr'].map((product, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <span className="text-sm text-slate-700">{product}</span>
                      <ChevronRight size={16} className="text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all">
                  Create Opportunity
                </button>
                <button className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-all">
                  Schedule Task
                </button>
                <button className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-all">
                  Send Communication
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
