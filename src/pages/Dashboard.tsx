import {
  Users,
  UserPlus,
  Target,
  DollarSign,
  TrendingUp,
  Clock,
  Award,
  Activity,
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
  Legend,
} from 'recharts';
import { revenueData, pipelineData, segmentData, activities, customers, leads, tasks } from '../data/mockData';

const metrics = [
  {
    label: 'Total Customers',
    value: '2,847',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    color: 'from-blue-500 to-blue-600',
    bgLight: 'bg-blue-50',
  },
  {
    label: 'Active Leads',
    value: '156',
    change: '+8.2%',
    trend: 'up',
    icon: UserPlus,
    color: 'from-emerald-500 to-emerald-600',
    bgLight: 'bg-emerald-50',
  },
  {
    label: 'Open Opportunities',
    value: '89',
    change: '+15.3%',
    trend: 'up',
    icon: Target,
    color: 'from-violet-500 to-violet-600',
    bgLight: 'bg-violet-50',
  },
  {
    label: 'Revenue (MTD)',
    value: '₹5.8 Cr',
    change: '-2.1%',
    trend: 'down',
    icon: DollarSign,
    color: 'from-amber-500 to-amber-600',
    bgLight: 'bg-amber-50',
  },
];

const recentActivities = [
  { icon: '📞', title: 'Call with Rajesh Kumar', desc: 'Discussed expansion loan requirements', time: '2h ago', type: 'call' },
  { icon: '📧', title: 'Proposal sent to Priya Sharma', desc: 'Working capital proposal emailed', time: '4h ago', type: 'email' },
  { icon: '🤝', title: 'Meeting with Amit Patel', desc: 'Trade finance discussion', time: '6h ago', type: 'meeting' },
  { icon: '✅', title: 'Deal closed - Nair Pharma', desc: '₹1.8 Cr equipment finance', time: '1d ago', type: 'deal' },
  { icon: '📋', title: 'New lead assigned', desc: 'Arjun Mehta - Business Loan', time: '1d ago', type: 'lead' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back! Here's your CRM overview.</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This Year</option>
          </select>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">
            Export Report
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.color} shadow-lg`}>
                  <Icon size={22} className="text-white" />
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                    metric.trend === 'up'
                      ? 'text-emerald-700 bg-emerald-50'
                      : 'text-red-700 bg-red-50'
                  }`}
                >
                  {metric.trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                  {metric.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-slate-800">{metric.value}</p>
                <p className="text-sm text-slate-500 mt-1">{metric.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-800">Revenue Trend</h3>
              <p className="text-sm text-slate-500">Monthly revenue vs target</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span> Revenue
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-slate-300"></span> Target
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
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
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fill="url(#colorRevenue)"
              />
              <Area
                type="monotone"
                dataKey="target"
                stroke="#cbd5e1"
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="none"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Segment Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-1">Customer Segments</h3>
          <p className="text-sm text-slate-500 mb-4">Distribution by segment</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={segmentData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {segmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {segmentData.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-600">{item.name}</span>
                </span>
                <span className="font-semibold text-slate-800">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Pipeline & Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Pipeline Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-800 mb-1">Sales Pipeline</h3>
          <p className="text-sm text-slate-500 mb-6">Opportunities by stage</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={pipelineData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" stroke="#94a3b8" fontSize={12} tickFormatter={(v) => `₹${v / 10000000}Cr`} />
              <YAxis dataKey="stage" type="category" stroke="#94a3b8" fontSize={12} width={100} />
              <Tooltip
                formatter={(value: number) => [`₹${(value / 10000000).toFixed(1)} Cr`, 'Value']}
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0' }}
              />
              <Bar dataKey="value" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800">Recent Activity</h3>
            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-base flex-shrink-0">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-700 truncate">{activity.title}</p>
                  <p className="text-xs text-slate-500 truncate">{activity.desc}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Conversion Rate</p>
              <p className="text-3xl font-bold mt-2">24.5%</p>
              <p className="text-blue-200 text-xs mt-2">↑ 3.2% from last month</p>
            </div>
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <TrendingUp size={28} />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-xl shadow-emerald-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Tasks Due Today</p>
              <p className="text-3xl font-bold mt-2">12</p>
              <p className="text-emerald-200 text-xs mt-2">5 high priority</p>
            </div>
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Clock size={28} />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-6 text-white shadow-xl shadow-violet-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-violet-100 text-sm">Customer Satisfaction</p>
              <p className="text-3xl font-bold mt-2">4.8/5</p>
              <p className="text-violet-200 text-xs mt-2">Based on 342 reviews</p>
            </div>
            <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Award size={28} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
