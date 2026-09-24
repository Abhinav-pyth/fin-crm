export type UserRole = 'super_admin' | 'admin' | 'leader' | 'manager' | 'employee';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  organization_id: string;
  department_id?: string;
  team_id?: string;
  manager_id?: string;
  avatar_url?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'suspended';
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  industry?: string;
  address?: string;
  website?: string;
  created_at: string;
}

export interface Department {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  head_id?: string;
  parent_id?: string;
  created_at: string;
}

export interface Team {
  id: string;
  organization_id: string;
  department_id: string;
  name: string;
  leader_id?: string;
  description?: string;
  created_at: string;
}

export interface RolePermissions {
  role: UserRole;
  label: string;
  description: string;
  level: number; // 1 = highest (super_admin), 5 = lowest (employee)
  permissions: {
    can_manage_users: boolean;
    can_manage_org: boolean;
    can_view_all_data: boolean;
    can_manage_customers: boolean;
    can_manage_leads: boolean;
    can_manage_opportunities: boolean;
    can_view_reports: boolean;
    can_manage_campaigns: boolean;
    can_approve_deals: boolean;
    can_delete_records: boolean;
  };
}

export const ROLE_HIERARCHY: RolePermissions[] = [
  {
    role: 'super_admin',
    label: 'Super Admin',
    description: 'Full system access, manages organizations and all users',
    level: 1,
    permissions: {
      can_manage_users: true,
      can_manage_org: true,
      can_view_all_data: true,
      can_manage_customers: true,
      can_manage_leads: true,
      can_manage_opportunities: true,
      can_view_reports: true,
      can_manage_campaigns: true,
      can_approve_deals: true,
      can_delete_records: true,
    },
  },
  {
    role: 'admin',
    label: 'Admin',
    description: 'Manages users, departments, and system settings',
    level: 2,
    permissions: {
      can_manage_users: true,
      can_manage_org: false,
      can_view_all_data: true,
      can_manage_customers: true,
      can_manage_leads: true,
      can_manage_opportunities: true,
      can_view_reports: true,
      can_manage_campaigns: true,
      can_approve_deals: true,
      can_delete_records: true,
    },
  },
  {
    role: 'leader',
    label: 'Team Leader',
    description: 'Leads teams, approves deals, oversees performance',
    level: 3,
    permissions: {
      can_manage_users: false,
      can_manage_org: false,
      can_view_all_data: true,
      can_manage_customers: true,
      can_manage_leads: true,
      can_manage_opportunities: true,
      can_view_reports: true,
      can_manage_campaigns: false,
      can_approve_deals: true,
      can_delete_records: false,
    },
  },
  {
    role: 'manager',
    label: 'Manager',
    description: 'Manages team members and their tasks',
    level: 4,
    permissions: {
      can_manage_users: false,
      can_manage_org: false,
      can_view_all_data: false,
      can_manage_customers: true,
      can_manage_leads: true,
      can_manage_opportunities: true,
      can_view_reports: true,
      can_manage_campaigns: false,
      can_approve_deals: false,
      can_delete_records: false,
    },
  },
  {
    role: 'employee',
    label: 'Employee',
    description: 'Basic access to assigned tasks and customers',
    level: 5,
    permissions: {
      can_manage_users: false,
      can_manage_org: false,
      can_view_all_data: false,
      can_manage_customers: false,
      can_manage_leads: true,
      can_manage_opportunities: false,
      can_view_reports: false,
      can_manage_campaigns: false,
      can_approve_deals: false,
      can_delete_records: false,
    },
  },
];

export const getRoleByLevel = (level: number): UserRole | undefined => {
  return ROLE_HIERARCHY.find((r) => r.level === level)?.role;
};

export const getRolePermissions = (role: UserRole): RolePermissions | undefined => {
  return ROLE_HIERARCHY.find((r) => r.role === role);
};

export const canPerformAction = (
  userRole: UserRole,
  action: keyof RolePermissions['permissions']
): boolean => {
  const perms = getRolePermissions(userRole);
  return perms?.permissions[action] ?? false;
};
