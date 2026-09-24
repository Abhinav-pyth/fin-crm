import { useState } from 'react';
import {
  Search,
  Plus,
  Phone,
  Mail,
  Calendar,
  Tag,
  ArrowRight,
  Filter,
  Star,
  MoreHorizontal,
  GripVertical,
} from 'lucide-react';
import { leads } from '../data/mockData';
import { Lead } from '../types';

const stages = [
  { id: 'new', label: 'New', color: 'bg-blue-500', lightColor: 'bg-blue-50 border-blue-200' },
  { id: 'contacted', label: 'Contacted', color: 'bg-amber-500', lightColor: 'bg-amber-50 border-amber-200' },
  { id: 'qualified', label: 'Qualified', color: 'bg-violet-500', lightColor: 'bg-violet-50 border-violet-200' },
  { id: 'proposal', label: 'Proposal', color: 'bg-indigo-500', lightColor: 'bg-indigo-50 border-indigo-200' },
  { id: 'won', label: 'Won', color: 'bg-emerald-500', lightColor: 'bg-emerald-50 border-emerald-200' },
  { id: 'lost', label: 'Lost', color: 'bg-red-500', lightColor: 'bg-red-50 border-red-200' },
];

export default function Leads() {
  const [viewMode, setViewMode] = useState<'pipeline' | 'list'>('pipeline');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const filteredLeads = leads.filter((l) =>
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.product.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStageLeads = (stageId: string) => filteredLeads.filter((l) => l.status === stageId);

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
    return `₹${amount.toLocaleString()}`;
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'website': return '🌐';
      case 'referral': return '🤝';
      case 'cold_call': return '📞';
      case 'event': return '🎪';
      case 'social_media': return '📱';
      default: return '📋';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-amber-600 bg-amber-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Lead Management</h1>
          <p className="text-sm text-slate-500 mt-1">Track and convert leads through your sales pipeline</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setViewMode('pipeline')}
              className={`px-4 py-2 text-sm font-medium ${viewMode === 'pipeline' ? 'bg-blue-50 text-blue-600' : 'text-slate-500'}`}
            >
              Pipeline
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 text-sm font-medium ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-500'}`}
            >
              List
            </button>
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">
            <Plus size={18} />
            New Lead
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search leads..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
        />
      </div>

      {/* Pipeline View */}
      {viewMode === 'pipeline' ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map((stage) => {
            const stageLeads = getStageLeads(stage.id);
            const totalValue = stageLeads.reduce((sum, l) => sum + l.estimatedValue, 0);
            return (
              <div key={stage.id} className="min-w-[300px] flex-shrink-0">
                <div className={`rounded-xl border p-3 ${stage.lightColor}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${stage.color}`}></span>
                      <h3 className="text-sm font-semibold text-slate-700">{stage.label}</h3>
                      <span className="text-xs bg-white px-2 py-0.5 rounded-full text-slate-500 font-medium">
                        {stageLeads.length}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-slate-500">{formatCurrency(totalValue)}</span>
                  </div>
                  <div className="space-y-3">
                    {stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer"
                        onClick={() => setSelectedLead(lead)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center text-xs font-semibold text-slate-600">
                              {lead.name.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-slate-800">{lead.name}</p>
                              <p className="text-[11px] text-slate-500">{lead.email}</p>
                            </div>
                          </div>
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${getPriorityColor(lead.priority)} capitalize`}>
                            {lead.priority}
                          </span>
                        </div>
                        <div className="mt-3 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500 flex items-center gap-1">
                              <Tag size={11} /> {lead.product}
                            </span>
                            <span className="text-xs font-semibold text-slate-700">{formatCurrency(lead.estimatedValue)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-slate-500">
                              {getSourceIcon(lead.source)} {lead.source.replace('_', ' ')}
                            </span>
                            <span className="text-[11px] text-slate-400">{lead.lastFollowUp}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100">
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Lead</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Product</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Source</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Value</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLeads.map((lead) => {
                const stage = stages.find(s => s.id === lead.status);
                return (
                  <tr
                    key={lead.id}
                    className="hover:bg-blue-50/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-800">{lead.name}</p>
                          <p className="text-xs text-slate-500">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700">{lead.product}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm">{getSourceIcon(lead.source)} {lead.source.replace('_', ' ')}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-slate-800">{formatCurrency(lead.estimatedValue)}</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${stage?.lightColor} border`}>
                        {stage?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${getPriorityColor(lead.priority)}`}>
                        {lead.priority}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-lg font-bold backdrop-blur-sm">
                    {selectedLead.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{selectedLead.name}</h3>
                    <p className="text-sm text-blue-100">{selectedLead.product} • {formatCurrency(selectedLead.estimatedValue)}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedLead(null)} className="p-2 hover:bg-white/10 rounded-lg transition-all">
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={14} className="text-slate-400" />
                  <span className="text-slate-600">{selectedLead.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={14} className="text-slate-400" />
                  <span className="text-slate-600">{selectedLead.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={14} className="text-slate-400" />
                  <span className="text-slate-600">Created: {selectedLead.createdAt}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Tag size={14} className="text-slate-400" />
                  <span className="text-slate-600">Source: {selectedLead.source.replace('_', ' ')}</span>
                </div>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-xs font-medium text-slate-500 mb-1">Notes</p>
                <p className="text-sm text-slate-700">{selectedLead.notes}</p>
              </div>
              <div className="flex gap-3 pt-2">
                <button className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all">
                  Convert to Customer
                </button>
                <button className="flex-1 py-2.5 bg-slate-100 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-200 transition-all">
                  Schedule Follow-up
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
