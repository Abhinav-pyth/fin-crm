import { useState } from 'react';
import {
  Search,
  Plus,
  TrendingUp,
  Calendar,
  User,
  DollarSign,
  ChevronRight,
  Filter,
  ArrowUpRight,
} from 'lucide-react';
import { opportunities } from '../data/mockData';

const stageConfig = {
  prospecting: { label: 'Prospecting', color: 'bg-slate-500', progress: 20 },
  qualification: { label: 'Qualification', color: 'bg-blue-500', progress: 40 },
  proposal: { label: 'Proposal', color: 'bg-violet-500', progress: 60 },
  negotiation: { label: 'Negotiation', color: 'bg-amber-500', progress: 80 },
  closed_won: { label: 'Closed Won', color: 'bg-emerald-500', progress: 100 },
  closed_lost: { label: 'Closed Lost', color: 'bg-red-500', progress: 0 },
};

export default function Opportunities() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStage, setFilterStage] = useState('all');

  const filteredOpps = opportunities.filter((o) => {
    const matchesSearch =
      o.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.product.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = filterStage === 'all' || o.stage === filterStage;
    return matchesSearch && matchesStage;
  });

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
    if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
    return `₹${amount.toLocaleString()}`;
  };

  const totalPipeline = opportunities.reduce((sum, o) => {
    if (o.stage !== 'closed_lost') return sum + o.amount;
    return sum;
  }, 0);

  const weightedPipeline = opportunities.reduce((sum, o) => {
    if (o.stage !== 'closed_lost') return sum + (o.amount * o.probability / 100);
    return sum;
  }, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Opportunities</h1>
          <p className="text-sm text-slate-500 mt-1">Track deals and manage your sales pipeline</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">
          <Plus size={18} />
          New Opportunity
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">Total Pipeline</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(totalPipeline)}</p>
          <p className="text-xs text-slate-500 mt-1">{opportunities.filter(o => o.stage !== 'closed_lost' && o.stage !== 'closed_won').length} active deals</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">Weighted Pipeline</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(weightedPipeline)}</p>
          <p className="text-xs text-slate-500 mt-1">Probability adjusted</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">Won This Month</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {formatCurrency(opportunities.filter(o => o.stage === 'closed_won').reduce((s, o) => s + o.amount, 0))}
          </p>
          <p className="text-xs text-slate-500 mt-1">{opportunities.filter(o => o.stage === 'closed_won').length} deals closed</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <p className="text-xs font-medium text-slate-500 uppercase">Avg Deal Size</p>
          <p className="text-2xl font-bold text-slate-800 mt-1">
            {formatCurrency(totalPipeline / Math.max(opportunities.filter(o => o.stage !== 'closed_lost').length, 1))}
          </p>
          <p className="text-xs text-slate-500 mt-1">Per opportunity</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search opportunities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
          />
        </div>
        <select
          value={filterStage}
          onChange={(e) => setFilterStage(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">All Stages</option>
          <option value="prospecting">Prospecting</option>
          <option value="qualification">Qualification</option>
          <option value="proposal">Proposal</option>
          <option value="negotiation">Negotiation</option>
          <option value="closed_won">Closed Won</option>
          <option value="closed_lost">Closed Lost</option>
        </select>
      </div>

      {/* Opportunities List */}
      <div className="space-y-3">
        {filteredOpps.map((opp) => {
          const config = stageConfig[opp.stage];
          return (
            <div
              key={opp.id}
              className="bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-base font-semibold text-slate-800">{opp.title}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full text-white ${config.color}`}>
                      {config.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-3">{opp.description}</p>
                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <User size={14} className="text-slate-400" />
                      <span>{opp.customerName}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <DollarSign size={14} className="text-slate-400" />
                      <span className="font-semibold">{formatCurrency(opp.amount)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <Calendar size={14} className="text-slate-400" />
                      <span>Close: {opp.expectedCloseDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-slate-600">
                      <TrendingUp size={14} className="text-slate-400" />
                      <span>{opp.probability}% probability</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-slate-800">{formatCurrency(opp.amount)}</p>
                  <p className="text-xs text-slate-500">{opp.product}</p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="mt-4">
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${config.color} transition-all duration-500`}
                    style={{ width: `${config.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
