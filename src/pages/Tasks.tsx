import { useState } from 'react';
import {
  Plus,
  Search,
  Phone,
  Mail,
  Users,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Circle,
  Filter,
  Calendar,
} from 'lucide-react';
import { tasks } from '../data/mockData';

const typeIcons: Record<string, any> = {
  call: Phone,
  meeting: Users,
  email: Mail,
  document: FileText,
  follow_up: Clock,
  other: Circle,
};

const typeColors: Record<string, string> = {
  call: 'bg-blue-100 text-blue-600',
  meeting: 'bg-violet-100 text-violet-600',
  email: 'bg-emerald-100 text-emerald-600',
  document: 'bg-amber-100 text-amber-600',
  follow_up: 'bg-indigo-100 text-indigo-600',
  other: 'bg-slate-100 text-slate-600',
};

const statusColors: Record<string, string> = {
  pending: 'text-amber-600 bg-amber-50 border-amber-200',
  in_progress: 'text-blue-600 bg-blue-50 border-blue-200',
  completed: 'text-emerald-600 bg-emerald-50 border-emerald-200',
  overdue: 'text-red-600 bg-red-50 border-red-200',
};

export default function Tasks() {
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.relatedTo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const taskStats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Tasks & Activities</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your daily tasks and follow-ups</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">
          <Plus size={18} />
          New Task
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm text-center">
          <p className="text-2xl font-bold text-slate-800">{taskStats.total}</p>
          <p className="text-xs text-slate-500 mt-1">Total Tasks</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm text-center">
          <p className="text-2xl font-bold text-amber-600">{taskStats.pending}</p>
          <p className="text-xs text-slate-500 mt-1">Pending</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm text-center">
          <p className="text-2xl font-bold text-blue-600">{taskStats.inProgress}</p>
          <p className="text-xs text-slate-500 mt-1">In Progress</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm text-center">
          <p className="text-2xl font-bold text-emerald-600">{taskStats.completed}</p>
          <p className="text-xs text-slate-500 mt-1">Completed</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm text-center">
          <p className="text-2xl font-bold text-red-600">{taskStats.overdue}</p>
          <p className="text-xs text-slate-500 mt-1">Overdue</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[250px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks..."
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
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="all">All Types</option>
          <option value="call">Call</option>
          <option value="meeting">Meeting</option>
          <option value="email">Email</option>
          <option value="document">Document</option>
          <option value="follow_up">Follow Up</option>
        </select>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => {
          const TypeIcon = typeIcons[task.type] || Circle;
          return (
            <div
              key={task.id}
              className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all p-5 ${
                task.status === 'overdue' ? 'border-red-200 bg-red-50/30' : 'border-slate-100'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2.5 rounded-xl ${typeColors[task.type]}`}>
                  <TypeIcon size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-800">{task.title}</h3>
                      <p className="text-sm text-slate-500 mt-0.5">{task.description}</p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${statusColors[task.status]} capitalize`}>
                      {task.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 flex-wrap">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar size={13} />
                      <span>Due: {task.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span className={`px-1.5 py-0.5 rounded font-medium ${
                        task.priority === 'high' ? 'bg-red-50 text-red-600' :
                        task.priority === 'medium' ? 'bg-amber-50 text-amber-600' :
                        'bg-green-50 text-green-600'
                      }`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Related: <span className="font-medium text-slate-700">{task.relatedTo}</span>
                    </div>
                    <div className="text-xs text-slate-500">
                      Assigned: <span className="font-medium text-slate-700">{task.assignedTo}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
