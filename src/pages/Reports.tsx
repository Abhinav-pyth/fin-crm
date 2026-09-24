import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  DollarSign,
  Calendar,
  Download,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import { revenueData, pipelineData, segmentData } from '../data/mockData';

const monthlyLeads = [
  { month: 'Jul', new: 45, converted: 12, lost: 5 },
  { month: 'Aug', new: 52, converted: 15, lost: 7 },
  { month: 'Sep', new: 48, converted: 18, lost: 4 },
  { month: 'Oct', new: 61, converted: 22, lost: 8 },
  { month: 'Nov', new: 55, converted: 20, lost: 6 },
  { month: 'Dec', new: 70, converted: 28, lost: 9 },
  { month: 'Jan', new: 65, converted: 24, lost: 7 },
];

const productMix = [
  { name: 'Term Loan', value: 35, color: '#3b82f6' },
  { name: 'Working Capital', value: 25, color: '#8b5cf6' },
  { name: 'Trade Finance', value: 20, color: '#10b981' },
  { name: 'Equipment Finance', value: 12, color: '#f59e0b' },
  { name: 'Overdraft', value: 8, color: '#ef4444' },
];

const teamPerformance = [
  { name: 'Sales Team A', deals: 28, revenue: 4.2, target: 5.0 },
  { name: 'Sales Team B', deals: 22, revenue: 3.5, target: 4.0 },
  { name: 'Sales Team C', deals: 18, revenue: 2.8, target: 3.5 },
  { name: 'Sales Team D', deals: 15, revenue: 2.1, target: 3.0 },
];

const customerAcquisition = [
  { month: 'Jul', retail: 120, corporate: 15, hni: 8, sme: 25 },
  { month: 'Aug', retail: 135, corporate: 18, hni: 10, sme: 30 },
  { month: 'Sep', retail: 128, corporate: 20, hni: 12, sme: 28 },
  { month: 'Oct', retail: 145, corporate: 22, hni: 11, sme: 35 },
  { month: 'Nov', retail: 155, corporate: 25, hni: 14, sme: 32 },
  { month: 'Dec', retail: 180, corporate: 30, hni: 18, sme: 40 },
  { month: 'Jan', retail: 165, corporate: 28, hni: 15, sme: 38 },
];

export default function Reports() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reports & Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Comprehensive business intelligence and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option>Last 7 Months</option>
            <option>Last 30 Days</option>
            <option>This Quarter</option>
            <option>This Year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 hover:bg-slate-50 transition-all">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DollarSign size={20} className="text-blue-600" />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
              <ArrowUpRight size={12} /> 12.5%
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-3">₹42.8 Cr</p>
          <p className="text-xs text-slate-500 mt-1">Total Revenue (YTD)</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <Target size={20} className="text-emerald-600" />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
              <ArrowUpRight size={12} /> 8.3%
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-3">24.5%</p>
          <p className="text-xs text-slate-500 mt-1">Conversion Rate</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-violet-100 rounded-lg">
              <Users size={20} className="text-violet-600" />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-emerald-600">
              <ArrowUpRight size={12} /> 15.2%
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-3">2,847</p>
          <p className="text-xs text-slate-500 mt-1">Total Customers</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="p-2 bg-amber-100 rounded-lg">
              <BarChart3 size={20} className="text-amber-600" />
            </div>
            <span className="flex items-center gap-1 text-xs font-medium text-red-600">
              <ArrowDownRight size={12} /> 2.1%
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-800 mt-3">₹48.2L</p>
          <p className="text-xs text-slate-500 mt-1">Avg Deal Size</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Revenue Trend */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-1">Revenue Performance</h3>
          <p className="text-sm text-slate-500 mb-4">Monthly revenue vs target</p>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `₹${v / 1000000}M`} />
              <Tooltip
                formatter={(value: number) => [`₹${(value / 10000000).toFixed(1)} Cr`, '']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
              />
              <Legend />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2.5} fill="url(#colorRev)" name="Revenue" />
              <Area type="monotone" dataKey="target" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="5 5" fill="none" name="Target" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Lead Funnel */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-1">Lead Conversion Funnel</h3>
          <p className="text-sm text-slate-500 mb-4">New leads vs conversions vs losses</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyLeads}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Legend />
              <Bar dataKey="new" fill="#3b82f6" radius={[4, 4, 0, 0]} name="New Leads" />
              <Bar dataKey="converted" fill="#10b981" radius={[4, 4, 0, 0]} name="Converted" />
              <Bar dataKey="lost" fill="#ef4444" radius={[4, 4, 0, 0]} name="Lost" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Customer Acquisition */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-1">Customer Acquisition by Segment</h3>
          <p className="text-sm text-slate-500 mb-4">New customers added per month</p>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={customerAcquisition}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} />
              <YAxis stroke="#94a3b8" fontSize={12} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }} />
              <Legend />
              <Line type="monotone" dataKey="retail" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} name="Retail" />
              <Line type="monotone" dataKey="corporate" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} name="Corporate" />
              <Line type="monotone" dataKey="hni" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} name="HNI" />
              <Line type="monotone" dataKey="sme" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} name="SME" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Product Mix */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-1">Product Mix</h3>
          <p className="text-sm text-slate-500 mb-4">Revenue by product</p>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie
                data={productMix}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {productMix.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {productMix.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-600 text-xs">{item.name}</span>
                </span>
                <span className="font-semibold text-slate-800 text-xs">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Performance */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-800 mb-1">Team Performance</h3>
        <p className="text-sm text-slate-500 mb-6">Revenue achievement by sales team</p>
        <div className="space-y-4">
          {teamPerformance.map((team, index) => {
            const achievement = (team.revenue / team.target) * 100;
            return (
              <div key={index} className="flex items-center gap-4">
                <div className="w-32 text-sm font-medium text-slate-700">{team.name}</div>
                <div className="flex-1">
                  <div className="h-6 bg-slate-100 rounded-full overflow-hidden relative">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, achievement)}%` }}
                    ></div>
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-slate-700">
                      {achievement.toFixed(0)}% of target
                    </span>
                  </div>
                </div>
                <div className="w-24 text-right">
                  <p className="text-sm font-semibold text-slate-800">₹{team.revenue} Cr</p>
                  <p className="text-[11px] text-slate-500">{team.deals} deals</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
