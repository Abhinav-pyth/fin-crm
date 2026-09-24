import { useState } from 'react';
import {
  Plus,
  Search,
  Mail,
  MessageSquare,
  Bell,
  Send,
  FileText,
  Users,
  Eye,
  MousePointer,
  TrendingUp,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { campaigns } from '../data/mockData';

const typeIcons: Record<string, any> = {
  email: Mail,
  sms: MessageSquare,
  whatsapp: Send,
  push: Bell,
  direct_mail: FileText,
};

const statusColors: Record<string, string> = {
  draft: 'text-slate-600 bg-slate-50 border-slate-200',
  active: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  paused: 'text-amber-600 bg-amber-50 border-amber-200',
  completed: 'text-blue-600 bg-blue-50 border-blue-200',
};

export default function Campaigns() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCampaigns = campaigns.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
    return `₹${amount.toLocaleString()}`;
  };

  const totalStats = {
    totalCampaigns: campaigns.length,
    activeCampaigns: campaigns.filter(c => c.status === 'active').length,
    totalReach: campaigns.reduce((s, c) => s + c.totalRecipients, 0),
    totalConverted: campaigns.reduce((s, c) => s + c.converted, 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Campaigns</h1>
          <p className="text-sm text-slate-500 mt-1">Create and manage marketing campaigns across channels</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">
          <Plus size={18} />
          Create Campaign
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-100 rounded-xl">
              <Send size={20} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{totalStats.totalCampaigns}</p>
              <p className="text-xs text-slate-500">Total Campaigns</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-100 rounded-xl">
              <TrendingUp size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">{totalStats.activeCampaigns}</p>
              <p className="text-xs text-slate-500">Active Now</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-violet-100 rounded-xl">
              <Users size={20} className="text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{(totalStats.totalReach / 1000).toFixed(0)}K</p>
              <p className="text-xs text-slate-500">Total Reach</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-100 rounded-xl">
              <MousePointer size={20} className="text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{totalStats.totalConverted}</p>
              <p className="text-xs text-slate-500">Conversions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Campaign Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCampaigns.map((campaign) => {
          const TypeIcon = typeIcons[campaign.type] || Send;
          const conversionRate = campaign.totalRecipients > 0
            ? ((campaign.converted / campaign.totalRecipients) * 100).toFixed(1)
            : '0';
          const openRate = campaign.delivered > 0
            ? ((campaign.opened / campaign.delivered) * 100).toFixed(1)
            : '0';

          return (
            <div
              key={campaign.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white">
                      <TypeIcon size={20} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-800">{campaign.name}</h3>
                      <p className="text-xs text-slate-500 capitalize">{campaign.type.replace('_', ' ')} • {campaign.targetAudience}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${statusColors[campaign.status]}`}>
                    {campaign.status}
                  </span>
                </div>

                {/* Timeline */}
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                  <Calendar size={13} />
                  <span>{campaign.startDate} → {campaign.endDate}</span>
                  <span className="ml-auto flex items-center gap-1">
                    <DollarSign size={13} />
                    Budget: {formatCurrency(campaign.budget)}
                  </span>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-4 gap-3">
                  <div className="text-center p-2 bg-slate-50 rounded-lg">
                    <p className="text-sm font-bold text-slate-800">{(campaign.totalRecipients / 1000).toFixed(1)}K</p>
                    <p className="text-[10px] text-slate-500">Sent</p>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded-lg">
                    <p className="text-sm font-bold text-blue-600">{openRate}%</p>
                    <p className="text-[10px] text-slate-500">Open Rate</p>
                  </div>
                  <div className="text-center p-2 bg-slate-50 rounded-lg">
                    <p className="text-sm font-bold text-violet-600">{campaign.responded}</p>
                    <p className="text-[10px] text-slate-500">Responses</p>
                  </div>
                  <div className="text-center p-2 bg-emerald-50 rounded-lg">
                    <p className="text-sm font-bold text-emerald-600">{conversionRate}%</p>
                    <p className="text-[10px] text-slate-500">Conversion</p>
                  </div>
                </div>

                {/* Progress Bar */}
                {campaign.status === 'active' && (
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Campaign Progress</span>
                      <span>{Math.round(((new Date().getTime() - new Date(campaign.startDate).getTime()) / (new Date(campaign.endDate).getTime() - new Date(campaign.startDate).getTime())) * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                        style={{
                          width: `${Math.min(100, Math.round(((new Date().getTime() - new Date(campaign.startDate).getTime()) / (new Date(campaign.endDate).getTime() - new Date(campaign.startDate).getTime())) * 100))}%`
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
