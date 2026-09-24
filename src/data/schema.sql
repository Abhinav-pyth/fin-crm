-- CloudCRM Database Schema for Supabase
-- Run this in your Supabase SQL Editor to set up the database
-- FIXED: Uses SECURITY DEFINER functions to avoid RLS recursion

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLES
-- ============================================================

-- Organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo_url TEXT,
  industry TEXT,
  address TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  head_id UUID,
  parent_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teams table
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  leader_id UUID,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'leader', 'manager', 'employee')),
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  team_id UUID REFERENCES teams(id) ON DELETE SET NULL,
  manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
  avatar_url TEXT,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  designation TEXT,
  status TEXT DEFAULT 'prospect' CHECK (status IN ('active', 'inactive', 'prospect')),
  segment TEXT CHECK (segment IN ('retail', 'corporate', 'hni', 'sme')),
  risk_profile TEXT DEFAULT 'medium' CHECK (risk_profile IN ('low', 'medium', 'high')),
  total_assets BIGINT DEFAULT 0,
  last_interaction DATE,
  address TEXT,
  dob DATE,
  pan_number TEXT,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads table
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  source TEXT CHECK (source IN ('website', 'referral', 'cold_call', 'event', 'social_media')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal', 'won', 'lost')),
  product TEXT,
  estimated_value BIGINT DEFAULT 0,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  notes TEXT,
  last_follow_up DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Opportunities table
CREATE TABLE IF NOT EXISTS opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  product TEXT,
  stage TEXT DEFAULT 'prospecting' CHECK (stage IN ('prospecting', 'qualification', 'proposal', 'negotiation', 'closed_won', 'closed_lost')),
  amount BIGINT DEFAULT 0,
  probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  expected_close_date DATE,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('call', 'meeting', 'email', 'follow_up', 'document', 'other')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  due_date DATE,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  related_to TEXT,
  related_type TEXT CHECK (related_type IN ('customer', 'lead', 'opportunity')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('email', 'sms', 'whatsapp', 'push', 'direct_mail')),
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed')),
  start_date DATE,
  end_date DATE,
  target_audience TEXT,
  total_recipients INTEGER DEFAULT 0,
  delivered INTEGER DEFAULT 0,
  opened INTEGER DEFAULT 0,
  responded INTEGER DEFAULT 0,
  converted INTEGER DEFAULT 0,
  budget BIGINT DEFAULT 0,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activities/Audit log table
CREATE TABLE IF NOT EXISTS activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT CHECK (type IN ('call', 'email', 'meeting', 'note', 'task', 'system')),
  title TEXT NOT NULL,
  description TEXT,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  related_entity TEXT,
  related_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FOREIGN KEYS (added after tables exist)
-- ============================================================

-- Add foreign key references for head_id and leader_id
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_dept_head') THEN
    ALTER TABLE departments ADD CONSTRAINT fk_dept_head FOREIGN KEY (head_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'fk_team_leader') THEN
    ALTER TABLE teams ADD CONSTRAINT fk_team_leader FOREIGN KEY (leader_id) REFERENCES users(id) ON DELETE SET NULL;
  END IF;
END $$;

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_users_org ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_dept ON users(department_id);
CREATE INDEX IF NOT EXISTS idx_users_team ON users(team_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_customers_assigned ON customers(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_opportunities_stage ON opportunities(stage);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- ============================================================
-- SECURITY DEFINER FUNCTIONS (avoids RLS recursion)
-- These functions bypass RLS to read user data for policy checks
-- ============================================================

-- Function to get the current user's role (bypasses RLS)
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM users WHERE id = auth.uid() LIMIT 1;
$$;

-- Function to get the current user's organization_id (bypasses RLS)
CREATE OR REPLACE FUNCTION get_current_user_org_id()
RETURNS UUID
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT organization_id FROM users WHERE id = auth.uid() LIMIT 1;
$$;

-- Function to check if current user is super_admin
CREATE OR REPLACE FUNCTION is_super_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role = 'super_admin'
  );
$$;

-- Function to check if current user is admin or super_admin
CREATE OR REPLACE FUNCTION is_admin_or_above()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM users WHERE id = auth.uid() AND role IN ('super_admin', 'admin')
  );
$$;

-- Function to check if current user can manage a target user
-- (must be higher level or same org admin)
CREATE OR REPLACE FUNCTION can_manage_user(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM users current_user
    WHERE current_user.id = auth.uid()
    AND (
      current_user.role = 'super_admin'
      OR (
        current_user.role IN ('super_admin', 'admin')
        AND current_user.organization_id = (
          SELECT organization_id FROM users WHERE id = target_user_id
        )
      )
    )
  );
$$;

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "users_select_policy" ON users;
DROP POLICY IF EXISTS "users_insert_policy" ON users;
DROP POLICY IF EXISTS "users_update_policy" ON users;
DROP POLICY IF EXISTS "users_delete_policy" ON users;

DROP POLICY IF EXISTS "org_select_policy" ON organizations;
DROP POLICY IF EXISTS "org_insert_policy" ON organizations;
DROP POLICY IF EXISTS "org_update_policy" ON organizations;

DROP POLICY IF EXISTS "dept_select_policy" ON departments;
DROP POLICY IF EXISTS "dept_insert_policy" ON departments;
DROP POLICY IF EXISTS "dept_update_policy" ON departments;
DROP POLICY IF EXISTS "dept_delete_policy" ON departments;

DROP POLICY IF EXISTS "team_select_policy" ON teams;
DROP POLICY IF EXISTS "team_insert_policy" ON teams;
DROP POLICY IF EXISTS "team_update_policy" ON teams;
DROP POLICY IF EXISTS "team_delete_policy" ON teams;

DROP POLICY IF EXISTS "customers_select_policy" ON customers;
DROP POLICY IF EXISTS "customers_insert_policy" ON customers;
DROP POLICY IF EXISTS "customers_update_policy" ON customers;
DROP POLICY IF EXISTS "customers_delete_policy" ON customers;

DROP POLICY IF EXISTS "leads_select_policy" ON leads;
DROP POLICY IF EXISTS "leads_insert_policy" ON leads;
DROP POLICY IF EXISTS "leads_update_policy" ON leads;

DROP POLICY IF EXISTS "opportunities_select_policy" ON opportunities;
DROP POLICY IF EXISTS "opportunities_insert_policy" ON opportunities;
DROP POLICY IF EXISTS "opportunities_update_policy" ON opportunities;

DROP POLICY IF EXISTS "tasks_select_policy" ON tasks;
DROP POLICY IF EXISTS "tasks_insert_policy" ON tasks;
DROP POLICY IF EXISTS "tasks_update_policy" ON tasks;

DROP POLICY IF EXISTS "campaigns_select_policy" ON campaigns;
DROP POLICY IF EXISTS "campaigns_insert_policy" ON campaigns;
DROP POLICY IF EXISTS "campaigns_update_policy" ON campaigns;

DROP POLICY IF EXISTS "activities_select_policy" ON activities;
DROP POLICY IF EXISTS "activities_insert_policy" ON activities;

-- ============================================================
-- USERS TABLE POLICIES (using SECURITY DEFINER functions)
-- ============================================================

-- SELECT: Users can see themselves, admins see all in their org
CREATE POLICY "users_select_policy" ON users
  FOR SELECT
  USING (
    id = auth.uid()  -- always see yourself
    OR is_super_admin()  -- super admins see everyone
    OR (
      is_admin_or_above()
      AND organization_id = get_current_user_org_id()
    )
    OR (
      get_current_user_role() = 'leader'
      AND organization_id = get_current_user_org_id()
    )
    OR (
      get_current_user_role() = 'manager'
      AND organization_id = get_current_user_org_id()
      AND (
        department_id = (SELECT department_id FROM users WHERE id = auth.uid())
        OR team_id = (SELECT team_id FROM users WHERE id = auth.uid())
      )
    )
  );

-- INSERT: Only admins and above can create users
CREATE POLICY "users_insert_policy" ON users
  FOR INSERT
  WITH CHECK (
    is_admin_or_above()
    AND (organization_id = get_current_user_org_id() OR organization_id IS NULL)
  );

-- UPDATE: Users can update themselves, admins can update org users
CREATE POLICY "users_update_policy" ON users
  FOR UPDATE
  USING (
    id = auth.uid()  -- can always update yourself
    OR is_admin_or_above()
  )
  WITH CHECK (
    id = auth.uid()
    OR is_admin_or_above()
  );

-- DELETE: Only super admins can delete users
CREATE POLICY "users_delete_policy" ON users
  FOR DELETE
  USING (
    is_super_admin()
    AND id != auth.uid()  -- can't delete yourself
  );

-- ============================================================
-- ORGANIZATIONS TABLE POLICIES
-- ============================================================

CREATE POLICY "org_select_policy" ON organizations
  FOR SELECT
  USING (
    id IN (SELECT get_current_user_org_id())
    OR is_super_admin()
  );

CREATE POLICY "org_insert_policy" ON organizations
  FOR INSERT
  WITH CHECK (is_super_admin());

CREATE POLICY "org_update_policy" ON organizations
  FOR UPDATE
  USING (is_super_admin())
  WITH CHECK (is_super_admin());

-- ============================================================
-- DEPARTMENTS TABLE POLICIES
-- ============================================================

CREATE POLICY "dept_select_policy" ON departments
  FOR SELECT
  USING (
    organization_id = get_current_user_org_id()
    OR is_super_admin()
  );

CREATE POLICY "dept_insert_policy" ON departments
  FOR INSERT
  WITH CHECK (
    is_admin_or_above()
    AND organization_id = get_current_user_org_id()
  );

CREATE POLICY "dept_update_policy" ON departments
  FOR UPDATE
  USING (
    is_admin_or_above()
    AND organization_id = get_current_user_org_id()
  )
  WITH CHECK (
    is_admin_or_above()
  );

CREATE POLICY "dept_delete_policy" ON departments
  FOR DELETE
  USING (
    is_super_admin()
    AND organization_id = get_current_user_org_id()
  );

-- ============================================================
-- TEAMS TABLE POLICIES
-- ============================================================

CREATE POLICY "team_select_policy" ON teams
  FOR SELECT
  USING (
    organization_id = get_current_user_org_id()
    OR is_super_admin()
  );

CREATE POLICY "team_insert_policy" ON teams
  FOR INSERT
  WITH CHECK (
    is_admin_or_above()
    AND organization_id = get_current_user_org_id()
  );

CREATE POLICY "team_update_policy" ON teams
  FOR UPDATE
  USING (
    is_admin_or_above()
    AND organization_id = get_current_user_org_id()
  )
  WITH CHECK (is_admin_or_above());

CREATE POLICY "team_delete_policy" ON teams
  FOR DELETE
  USING (
    is_super_admin()
    AND organization_id = get_current_user_org_id()
  );

-- ============================================================
-- CUSTOMERS TABLE POLICIES
-- ============================================================

CREATE POLICY "customers_select_policy" ON customers
  FOR SELECT
  USING (
    is_super_admin()
    OR is_admin_or_above()
    OR get_current_user_role() = 'leader'
    OR assigned_to = auth.uid()
    OR (
      get_current_user_role() = 'manager'
      AND assigned_to IN (
        SELECT id FROM users WHERE team_id = (SELECT team_id FROM users WHERE id = auth.uid())
      )
    )
  );

CREATE POLICY "customers_insert_policy" ON customers
  FOR INSERT
  WITH CHECK (
    is_admin_or_above()
    OR get_current_user_role() = 'leader'
  );

CREATE POLICY "customers_update_policy" ON customers
  FOR UPDATE
  USING (
    is_admin_or_above()
    OR get_current_user_role() = 'leader'
    OR assigned_to = auth.uid()
  );

CREATE POLICY "customers_delete_policy" ON customers
  FOR DELETE
  USING (is_admin_or_above());

-- ============================================================
-- LEADS TABLE POLICIES
-- ============================================================

CREATE POLICY "leads_select_policy" ON leads
  FOR SELECT
  USING (
    is_super_admin()
    OR is_admin_or_above()
    OR get_current_user_role() = 'leader'
    OR assigned_to = auth.uid()
  );

CREATE POLICY "leads_insert_policy" ON leads
  FOR INSERT
  WITH CHECK (
    is_admin_or_above()
    OR get_current_user_role() IN ('leader', 'manager', 'employee')
  );

CREATE POLICY "leads_update_policy" ON leads
  FOR UPDATE
  USING (
    is_admin_or_above()
    OR get_current_user_role() = 'leader'
    OR assigned_to = auth.uid()
  );

-- ============================================================
-- OPPORTUNITIES TABLE POLICIES
-- ============================================================

CREATE POLICY "opportunities_select_policy" ON opportunities
  FOR SELECT
  USING (
    is_super_admin()
    OR is_admin_or_above()
    OR get_current_user_role() = 'leader'
    OR assigned_to = auth.uid()
  );

CREATE POLICY "opportunities_insert_policy" ON opportunities
  FOR INSERT
  WITH CHECK (
    is_admin_or_above()
    OR get_current_user_role() = 'leader'
  );

CREATE POLICY "opportunities_update_policy" ON opportunities
  FOR UPDATE
  USING (
    is_admin_or_above()
    OR get_current_user_role() = 'leader'
    OR assigned_to = auth.uid()
  );

-- ============================================================
-- TASKS TABLE POLICIES
-- ============================================================

CREATE POLICY "tasks_select_policy" ON tasks
  FOR SELECT
  USING (
    is_super_admin()
    OR is_admin_or_above()
    OR get_current_user_role() = 'leader'
    OR assigned_to = auth.uid()
  );

CREATE POLICY "tasks_insert_policy" ON tasks
  FOR INSERT
  WITH CHECK (true);  -- anyone can create tasks

CREATE POLICY "tasks_update_policy" ON tasks
  FOR UPDATE
  USING (
    is_admin_or_above()
    OR get_current_user_role() = 'leader'
    OR assigned_to = auth.uid()
  );

-- ============================================================
-- CAMPAIGNS TABLE POLICIES
-- ============================================================

CREATE POLICY "campaigns_select_policy" ON campaigns
  FOR SELECT
  USING (
    is_super_admin()
    OR is_admin_or_above()
  );

CREATE POLICY "campaigns_insert_policy" ON campaigns
  FOR INSERT
  WITH CHECK (is_admin_or_above());

CREATE POLICY "campaigns_update_policy" ON campaigns
  FOR UPDATE
  USING (is_admin_or_above());

-- ============================================================
-- ACTIVITIES TABLE POLICIES
-- ============================================================

CREATE POLICY "activities_select_policy" ON activities
  FOR SELECT
  USING (
    is_super_admin()
    OR is_admin_or_above()
    OR user_id = auth.uid()
  );

CREATE POLICY "activities_insert_policy" ON activities
  FOR INSERT
  WITH CHECK (true);  -- anyone can log activities

-- ============================================================
-- INSERT DEFAULT DATA
-- ============================================================

-- Insert default organization (only if not exists)
INSERT INTO organizations (id, name, slug, industry, address, website)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'CloudCRM Financial Services',
  'cloudcrm-financial',
  'Banking & Financial Services',
  'Mumbai, Maharashtra, India',
  'https://cloudcrm.com'
)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- IMPORTANT: After running this schema, create your first user:
--
-- 1. Go to Supabase Dashboard → Authentication → Users
-- 2. Click "Add user" → "Create new user"
-- 3. Enter email and password, check "Auto Confirm User"
-- 4. Copy the User UID
-- 5. Run this SQL (replace the values):
--
-- INSERT INTO users (id, email, full_name, role, organization_id, status)
-- VALUES (
--   'YOUR-USER-UID-HERE',
--   'your-email@example.com',
--   'Your Name',
--   'super_admin',
--   '00000000-0000-0000-0000-000000000001',
--   'active'
-- );
--
-- ============================================================
