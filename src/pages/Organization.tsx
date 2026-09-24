import { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  ChevronRight,
  ChevronDown,
  Crown,
  Shield,
  Briefcase,
  UserCheck,
  Plus,
  Edit,
  Trash2,
  X,
} from 'lucide-react';
import { User, Organization, Department, Team, ROLE_HIERARCHY } from '../types/user';
import { db } from '../data/database';

export default function OrganizationPage() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set(['dept-1']));
  const [expandedTeams, setExpandedTeams] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [orgs, depts, tms, usrs] = await Promise.all([
        db.organizations.getAll(),
        db.departments.getAll(),
        db.teams.getAll(),
        db.users.getAll(),
      ]);
      setOrganization(orgs[0] || null);
      setDepartments(depts);
      setTeams(tms);
      setUsers(usrs);
    } catch (error) {
      console.error('Failed to load organization data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDept = (deptId: string) => {
    const newExpanded = new Set(expandedDepts);
    if (newExpanded.has(deptId)) {
      newExpanded.delete(deptId);
    } else {
      newExpanded.add(deptId);
    }
    setExpandedDepts(newExpanded);
  };

  const toggleTeam = (teamId: string) => {
    const newExpanded = new Set(expandedTeams);
    if (newExpanded.has(teamId)) {
      newExpanded.delete(teamId);
    } else {
      newExpanded.add(teamId);
    }
    setExpandedTeams(newExpanded);
  };

  const getDeptHead = (deptId: string) => {
    return users.find((u) => u.id === departments.find((d) => d.id === deptId)?.head_id);
  };

  const getTeamLeader = (teamId: string) => {
    return users.find((u) => u.id === teams.find((t) => t.id === teamId)?.leader_id);
  };

  const getDeptUsers = (deptId: string) => {
    return users.filter((u) => u.department_id === deptId);
  };

  const getTeamUsers = (teamId: string) => {
    return users.filter((u) => u.team_id === teamId);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Crown size={14} className="text-red-600" />;
      case 'admin':
        return <Shield size={14} className="text-purple-600" />;
      case 'leader':
        return <Briefcase size={14} className="text-blue-600" />;
      case 'manager':
        return <Users size={14} className="text-emerald-600" />;
      default:
        return <UserCheck size={14} className="text-slate-600" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const roleInfo = ROLE_HIERARCHY.find((r) => r.role === role);
    const colors: Record<string, string> = {
      super_admin: 'bg-red-50 text-red-700',
      admin: 'bg-purple-50 text-purple-700',
      leader: 'bg-blue-50 text-blue-700',
      manager: 'bg-emerald-50 text-emerald-700',
      employee: 'bg-slate-50 text-slate-700',
    };
    return (
      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${colors[role]}`}>
        {roleInfo?.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-slate-500">Loading organization structure...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Organization Structure</h1>
          <p className="text-sm text-slate-500 mt-1">View and manage your organizational hierarchy</p>
        </div>
      </div>

      {/* Organization Card */}
      {organization && (
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
              <Building2 size={32} />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold">{organization.name}</h2>
              <p className="text-blue-100 mt-1">{organization.industry}</p>
              <div className="flex items-center gap-6 mt-4 text-sm">
                <div>
                  <p className="text-blue-200 text-xs">Departments</p>
                  <p className="text-lg font-semibold">{departments.length}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-xs">Teams</p>
                  <p className="text-lg font-semibold">{teams.length}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-xs">Total Users</p>
                  <p className="text-lg font-semibold">{users.length}</p>
                </div>
                <div>
                  <p className="text-blue-200 text-xs">Active Users</p>
                  <p className="text-lg font-semibold">{users.filter((u) => u.status === 'active').length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Org Chart */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Hierarchy</h3>

        {/* Super Admin */}
        <div className="mb-6">
          {users
            .filter((u) => u.role === 'super_admin')
            .map((user) => (
              <div key={user.id} className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {user.full_name.split(' ').map((n) => n[0]).join('')}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800">{user.full_name}</p>
                    {getRoleIcon(user.role)}
                    {getRoleBadge(user.role)}
                  </div>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>
            ))}
        </div>

        {/* Departments */}
        <div className="space-y-4">
          {departments.map((dept) => {
            const deptTeams = teams.filter((t) => t.department_id === dept.id);
            const deptHead = getDeptHead(dept.id);
            const isExpanded = expandedDepts.has(dept.id);

            return (
              <div key={dept.id} className="border border-slate-200 rounded-xl overflow-hidden">
                <div
                  className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors"
                  onClick={() => toggleDept(dept.id)}
                >
                  {isExpanded ? <ChevronDown size={18} className="text-slate-400" /> : <ChevronRight size={18} className="text-slate-400" />}
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                    <Building2 size={18} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">{dept.name}</p>
                    <p className="text-xs text-slate-500">{dept.description}</p>
                  </div>
                  {deptHead && (
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Head</p>
                      <p className="text-sm font-medium text-slate-700">{deptHead.full_name}</p>
                    </div>
                  )}
                  <div className="text-right">
                    <p className="text-xs text-slate-500">Members</p>
                    <p className="text-sm font-semibold text-slate-700">{getDeptUsers(dept.id).length}</p>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 space-y-3 border-t border-slate-200">
                    {/* Teams in this department */}
                    {deptTeams.map((team) => {
                      const teamLeader = getTeamLeader(team.id);
                      const isTeamExpanded = expandedTeams.has(team.id);

                      return (
                        <div key={team.id} className="border border-slate-100 rounded-lg overflow-hidden">
                          <div
                            className="flex items-center gap-3 p-3 bg-blue-50/50 hover:bg-blue-50 cursor-pointer transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTeam(team.id);
                            }}
                          >
                            {isTeamExpanded ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white">
                              <Users size={14} />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-700">{team.name}</p>
                              <p className="text-xs text-slate-500">{team.description}</p>
                            </div>
                            {teamLeader && (
                              <div className="text-right">
                                <p className="text-xs text-slate-500">Leader</p>
                                <p className="text-xs font-medium text-slate-700">{teamLeader.full_name}</p>
                              </div>
                            )}
                            <div className="text-right">
                              <p className="text-xs text-slate-500">Members</p>
                              <p className="text-xs font-semibold text-slate-700">{getTeamUsers(team.id).length}</p>
                            </div>
                          </div>

                          {isTeamExpanded && (
                            <div className="p-3 space-y-2 border-t border-slate-100 bg-white">
                              {getTeamUsers(team.id).map((user) => (
                                <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg">
                                  <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                    {user.full_name.split(' ').map((n) => n[0]).join('')}
                                  </div>
                                  <div className="flex-1">
                                    <p className="text-sm text-slate-700">{user.full_name}</p>
                                    <p className="text-xs text-slate-500">{user.email}</p>
                                  </div>
                                  {getRoleIcon(user.role)}
                                  {getRoleBadge(user.role)}
                                </div>
                              ))}
                              {getTeamUsers(team.id).length === 0 && (
                                <p className="text-xs text-slate-400 text-center py-2">No members in this team</p>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Users directly in department (not in a team) */}
                    {getDeptUsers(dept.id).filter((u) => !u.team_id).length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs font-medium text-slate-500 mb-2">Direct Reports</p>
                        {getDeptUsers(dept.id)
                          .filter((u) => !u.team_id)
                          .map((user) => (
                            <div key={user.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg">
                              <div className="w-8 h-8 bg-gradient-to-br from-slate-400 to-slate-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                                {user.full_name.split(' ').map((n) => n[0]).join('')}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-slate-700">{user.full_name}</p>
                                <p className="text-xs text-slate-500">{user.email}</p>
                              </div>
                              {getRoleIcon(user.role)}
                              {getRoleBadge(user.role)}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
