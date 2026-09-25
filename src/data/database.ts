import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { User, Organization, Department, Team, UserRole } from '../types/user';
import { mockUsers, mockOrganizations, mockDepartments, mockTeams } from './mockData';

// Database service - uses Supabase if configured, otherwise falls back to mock data
export const db = {
  // Users
  users: {
    getAll: async (): Promise<User[]> => {
      if (!isSupabaseConfigured()) return mockUsers;
      try {
        const { data, error } = await supabase.from('users').select('*').order('created_at', { ascending: false });
        if (error) {
          console.error('Error fetching users:', error);
          return mockUsers; // fallback to mock data on error
        }
        return data || [];
      } catch (err) {
        console.error('Exception fetching users:', err);
        return mockUsers;
      }
    },
    getById: async (id: string): Promise<User | null> => {
      if (!isSupabaseConfigured()) return mockUsers.find((u: User) => u.id === id) || null;
      try {
        const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
        if (error) {
          console.error('Error fetching user by id:', error);
          return mockUsers.find((u: User) => u.id === id) || null;
        }
        return data;
      } catch (err) {
        console.error('Exception fetching user by id:', err);
        return mockUsers.find((u: User) => u.id === id) || null;
      }
    },
    getByEmail: async (email: string): Promise<User | null> => {
      if (!isSupabaseConfigured()) return mockUsers.find((u: User) => u.email === email) || null;
      try {
        const { data, error } = await supabase.from('users').select('*').eq('email', email).single();
        if (error) {
          console.error('Error fetching user by email:', error);
          return mockUsers.find((u: User) => u.email === email) || null;
        }
        return data;
      } catch (err) {
        console.error('Exception fetching user by email:', err);
        return mockUsers.find((u: User) => u.email === email) || null;
      }
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
      try {
        const { data, error } = await supabase.from('users').insert(user).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Error creating user:', err);
        throw err;
      }
    },
    update: async (id: string, updates: Partial<User>): Promise<User> => {
      if (!isSupabaseConfigured()) {
        const idx = mockUsers.findIndex((u: User) => u.id === id);
        if (idx === -1) throw new Error('User not found');
        mockUsers[idx] = { ...mockUsers[idx], ...updates, updated_at: new Date().toISOString() };
        return mockUsers[idx];
      }
      try {
        const { data, error } = await supabase.from('users').update(updates).eq('id', id).select().single();
        if (error) throw error;
        return data;
      } catch (err) {
        console.error('Error updating user:', err);
        throw err;
      }
    },
    delete: async (id: string): Promise<void> => {
      if (!isSupabaseConfigured()) {
        const idx = mockUsers.findIndex((u: User) => u.id === id);
        if (idx !== -1) mockUsers.splice(idx, 1);
        return;
      }
      try {
        const { error } = await supabase.from('users').delete().eq('id', id);
        if (error) throw error;
      } catch (err) {
        console.error('Error deleting user:', err);
        throw err;
      }
    },
    getByOrganization: async (orgId: string): Promise<User[]> => {
      if (!isSupabaseConfigured()) return mockUsers.filter((u: User) => u.organization_id === orgId);
      try {
        const { data, error } = await supabase.from('users').select('*').eq('organization_id', orgId);
        if (error) {
          console.error('Error fetching users by org:', error);
          return mockUsers.filter((u: User) => u.organization_id === orgId);
        }
        return data || [];
      } catch (err) {
        console.error('Exception fetching users by org:', err);
        return mockUsers.filter((u: User) => u.organization_id === orgId);
      }
    },
    getByDepartment: async (deptId: string): Promise<User[]> => {
      if (!isSupabaseConfigured()) return mockUsers.filter((u: User) => u.department_id === deptId);
      try {
        const { data, error } = await supabase.from('users').select('*').eq('department_id', deptId);
        if (error) {
          console.error('Error fetching users by dept:', error);
          return mockUsers.filter((u: User) => u.department_id === deptId);
        }
        return data || [];
      } catch (err) {
        console.error('Exception fetching users by dept:', err);
        return mockUsers.filter((u: User) => u.department_id === deptId);
      }
    },
    getByTeam: async (teamId: string): Promise<User[]> => {
      if (!isSupabaseConfigured()) return mockUsers.filter((u: User) => u.team_id === teamId);
      try {
        const { data, error } = await supabase.from('users').select('*').eq('team_id', teamId);
        if (error) {
          console.error('Error fetching users by team:', error);
          return mockUsers.filter((u: User) => u.team_id === teamId);
        }
        return data || [];
      } catch (err) {
        console.error('Exception fetching users by team:', err);
        return mockUsers.filter((u: User) => u.team_id === teamId);
      }
    },
  },

  // Organizations
  organizations: {
    getAll: async (): Promise<Organization[]> => {
      if (!isSupabaseConfigured()) return mockOrganizations;
      try {
        const { data, error } = await supabase.from('organizations').select('*');
        if (error) {
          console.error('Error fetching organizations:', error);
          return mockOrganizations;
        }
        return data || [];
      } catch (err) {
        console.error('Exception fetching organizations:', err);
        return mockOrganizations;
      }
    },
    getById: async (id: string): Promise<Organization | null> => {
      if (!isSupabaseConfigured()) return mockOrganizations.find((o: Organization) => o.id === id) || null;
      try {
        const { data, error } = await supabase.from('organizations').select('*').eq('id', id).single();
        if (error) {
          console.error('Error fetching organization:', error);
          return mockOrganizations.find((o: Organization) => o.id === id) || null;
        }
        return data;
      } catch (err) {
        console.error('Exception fetching organization:', err);
        return mockOrganizations.find((o: Organization) => o.id === id) || null;
      }
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
        const idx = mockOrganizations.findIndex((o: Organization) => o.id === id);
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
      try {
        const { data, error } = await supabase.from('departments').select('*');
        if (error) {
          console.error('Error fetching departments:', error);
          return mockDepartments;
        }
        return data || [];
      } catch (err) {
        console.error('Exception fetching departments:', err);
        return mockDepartments;
      }
    },
    getByOrganization: async (orgId: string): Promise<Department[]> => {
      if (!isSupabaseConfigured()) return mockDepartments.filter((d: Department) => d.organization_id === orgId);
      try {
        const { data, error } = await supabase.from('departments').select('*').eq('organization_id', orgId);
        if (error) {
          console.error('Error fetching departments by org:', error);
          return mockDepartments.filter((d: Department) => d.organization_id === orgId);
        }
        return data || [];
      } catch (err) {
        console.error('Exception fetching departments by org:', err);
        return mockDepartments.filter((d: Department) => d.organization_id === orgId);
      }
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
        const idx = mockDepartments.findIndex((d: Department) => d.id === id);
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
        const idx = mockDepartments.findIndex((d: Department) => d.id === id);
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
      try {
        const { data, error } = await supabase.from('teams').select('*');
        if (error) {
          console.error('Error fetching teams:', error);
          return mockTeams;
        }
        return data || [];
      } catch (err) {
        console.error('Exception fetching teams:', err);
        return mockTeams;
      }
    },
    getByDepartment: async (deptId: string): Promise<Team[]> => {
      if (!isSupabaseConfigured()) return mockTeams.filter((t: Team) => t.department_id === deptId);
      try {
        const { data, error } = await supabase.from('teams').select('*').eq('department_id', deptId);
        if (error) {
          console.error('Error fetching teams by dept:', error);
          return mockTeams.filter((t: Team) => t.department_id === deptId);
        }
        return data || [];
      } catch (err) {
        console.error('Exception fetching teams by dept:', err);
        return mockTeams.filter((t: Team) => t.department_id === deptId);
      }
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
        const idx = mockTeams.findIndex((t: Team) => t.id === id);
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
        const idx = mockTeams.findIndex((t: Team) => t.id === id);
        if (idx !== -1) mockTeams.splice(idx, 1);
        return;
      }
      const { error } = await supabase.from('teams').delete().eq('id', id);
      if (error) throw error;
    },
  },
};
