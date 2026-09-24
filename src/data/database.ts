import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User, Organization, Department, Team, UserRole } from '../types/user';
import { mockUsers, mockOrganizations, mockDepartments, mockTeams } from './mockData';

// Database service - uses Supabase if configured, otherwise falls back to mock data
export const db = {
  // Users
  users: {
    getAll: async (): Promise<User[]> => {
      if (!isSupabaseConfigured()) return mockUsers;
      const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    },
    getById: async (id: string): Promise<User | null> => {
      if (!isSupabaseConfigured()) return mockUsers.find((u) => u.id === id) || null;
      const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
    create: async (user: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> => {
      if (!isSupabaseConfigured()) {
        const newUser: User = {
          ...user,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockUsers.push(newUser);
        return newUser;
      }
      const { data, error } = await supabase.from('users').insert(user).select().single();
      if (error) throw error;
      return data;
    },
    update: async (id: string, updates: Partial<User>): Promise<User> => {
      if (!isSupabaseConfigured()) {
        const idx = mockUsers.findIndex((u) => u.id === id);
        if (idx === -1) throw new Error('User not found');
        mockUsers[idx] = { ...mockUsers[idx], ...updates, updated_at: new Date().toISOString() };
        return mockUsers[idx];
      }
      const { data, error } = await supabase.from('users').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    delete: async (id: string): Promise<void> => {
      if (!isSupabaseConfigured()) {
        const idx = mockUsers.findIndex((u) => u.id === id);
        if (idx !== -1) mockUsers.splice(idx, 1);
        return;
      }
      const { error } = await supabase.from('users').delete().eq('id', id);
      if (error) throw error;
    },
    getByOrganization: async (orgId: string): Promise<User[]> => {
      if (!isSupabaseConfigured()) return mockUsers.filter((u) => u.organization_id === orgId);
      const { data, error } = await supabase.from('users').select('*').eq('organization_id', orgId);
      if (error) throw error;
      return data || [];
    },
    getByDepartment: async (deptId: string): Promise<User[]> => {
      if (!isSupabaseConfigured()) return mockUsers.filter((u) => u.department_id === deptId);
      const { data, error } = await supabase.from('users').select('*').eq('department_id', deptId);
      if (error) throw error;
      return data || [];
    },
    getByTeam: async (teamId: string): Promise<User[]> => {
      if (!isSupabaseConfigured()) return mockUsers.filter((u) => u.team_id === teamId);
      const { data, error } = await supabase.from('users').select('*').eq('team_id', teamId);
      if (error) throw error;
      return data || [];
    },
  },

  // Organizations
  organizations: {
    getAll: async (): Promise<Organization[]> => {
      if (!isSupabaseConfigured()) return mockOrganizations;
      const { data, error } = await supabase.from('organizations').select('*');
      if (error) throw error;
      return data || [];
    },
    getById: async (id: string): Promise<Organization | null> => {
      if (!isSupabaseConfigured()) return mockOrganizations.find((o) => o.id === id) || null;
      const { data, error } = await supabase.from('organizations').select('*').eq('id', id).single();
      if (error) throw error;
      return data;
    },
    create: async (org: Omit<Organization, 'id' | 'created_at'>): Promise<Organization> => {
      if (!isSupabaseConfigured()) {
        const newOrg: Organization = { ...org, id: crypto.randomUUID(), created_at: new Date().toISOString() };
        mockOrganizations.push(newOrg);
        return newOrg;
      }
      const { data, error } = await supabase.from('organizations').insert(org).select().single();
      if (error) throw error;
      return data;
    },
    update: async (id: string, updates: Partial<Organization>): Promise<Organization> => {
      if (!isSupabaseConfigured()) {
        const idx = mockOrganizations.findIndex((o) => o.id === id);
        if (idx === -1) throw new Error('Organization not found');
        mockOrganizations[idx] = { ...mockOrganizations[idx], ...updates };
        return mockOrganizations[idx];
      }
      const { data, error } = await supabase.from('organizations').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
  },

  // Departments
  departments: {
    getAll: async (): Promise<Department[]> => {
      if (!isSupabaseConfigured()) return mockDepartments;
      const { data, error } = await supabase.from('departments').select('*');
      if (error) throw error;
      return data || [];
    },
    getByOrganization: async (orgId: string): Promise<Department[]> => {
      if (!isSupabaseConfigured()) return mockDepartments.filter((d) => d.organization_id === orgId);
      const { data, error } = await supabase.from('departments').select('*').eq('organization_id', orgId);
      if (error) throw error;
      return data || [];
    },
    create: async (dept: Omit<Department, 'id' | 'created_at'>): Promise<Department> => {
      if (!isSupabaseConfigured()) {
        const newDept: Department = { ...dept, id: crypto.randomUUID(), created_at: new Date().toISOString() };
        mockDepartments.push(newDept);
        return newDept;
      }
      const { data, error } = await supabase.from('departments').insert(dept).select().single();
      if (error) throw error;
      return data;
    },
    update: async (id: string, updates: Partial<Department>): Promise<Department> => {
      if (!isSupabaseConfigured()) {
        const idx = mockDepartments.findIndex((d) => d.id === id);
        if (idx === -1) throw new Error('Department not found');
        mockDepartments[idx] = { ...mockDepartments[idx], ...updates };
        return mockDepartments[idx];
      }
      const { data, error } = await supabase.from('departments').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    delete: async (id: string): Promise<void> => {
      if (!isSupabaseConfigured()) {
        const idx = mockDepartments.findIndex((d) => d.id === id);
        if (idx !== -1) mockDepartments.splice(idx, 1);
        return;
      }
      const { error } = await supabase.from('departments').delete().eq('id', id);
      if (error) throw error;
    },
  },

  // Teams
  teams: {
    getAll: async (): Promise<Team[]> => {
      if (!isSupabaseConfigured()) return mockTeams;
      const { data, error } = await supabase.from('teams').select('*');
      if (error) throw error;
      return data || [];
    },
    getByDepartment: async (deptId: string): Promise<Team[]> => {
      if (!isSupabaseConfigured()) return mockTeams.filter((t) => t.department_id === deptId);
      const { data, error } = await supabase.from('teams').select('*').eq('department_id', deptId);
      if (error) throw error;
      return data || [];
    },
    create: async (team: Omit<Team, 'id' | 'created_at'>): Promise<Team> => {
      if (!isSupabaseConfigured()) {
        const newTeam: Team = { ...team, id: crypto.randomUUID(), created_at: new Date().toISOString() };
        mockTeams.push(newTeam);
        return newTeam;
      }
      const { data, error } = await supabase.from('teams').insert(team).select().single();
      if (error) throw error;
      return data;
    },
    update: async (id: string, updates: Partial<Team>): Promise<Team> => {
      if (!isSupabaseConfigured()) {
        const idx = mockTeams.findIndex((t) => t.id === id);
        if (idx === -1) throw new Error('Team not found');
        mockTeams[idx] = { ...mockTeams[idx], ...updates };
        return mockTeams[idx];
      }
      const { data, error } = await supabase.from('teams').update(updates).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    delete: async (id: string): Promise<void> => {
      if (!isSupabaseConfigured()) {
        const idx = mockTeams.findIndex((t) => t.id === id);
        if (idx !== -1) mockTeams.splice(idx, 1);
        return;
      }
      const { error } = await supabase.from('teams').delete().eq('id', id);
      if (error) throw error;
    },
  },
};
