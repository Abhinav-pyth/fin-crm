# 🔐 Authentication Setup Guide

## Overview

CloudCRM now includes complete authentication with Supabase Auth. Users can sign up, log in, and access role-based features.

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Fill in project details:
   - **Name**: `cloudcrm`
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to you
4. Click "Create new project" (takes ~2 minutes)

---

### Step 2: Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor** (left sidebar)
2. Click "New Query"
3. Copy the entire content from `src/data/schema.sql`
4. Paste it into the SQL Editor
5. Click **Run** (or press Ctrl+Enter)

This creates all tables including:
- `users` - User accounts with roles
- `organizations` - Company/organization data
- `departments` - Organizational departments
- `teams` - Team structures
- `customers`, `leads`, `opportunities`, `tasks`, `campaigns`

**Important:** The schema uses `SECURITY DEFINER` functions to avoid RLS recursion errors. If you had a previous version that caused the "infinite recursion" error, delete all existing tables and policies first, then re-run the schema.

**To reset (if you had errors):**
```sql
-- Drop everything and start fresh
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS campaigns CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS opportunities CASCADE;
DROP TABLE IF EXISTS leads CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS teams CASCADE;
DROP TABLE IF EXISTS departments CASCADE;
DROP TABLE IF EXISTS organizations CASCADE;
```
Then re-run the schema from `src/data/schema.sql`.

---

### Step 3: Enable Email Auth

1. Go to **Authentication** → **Providers** (left sidebar)
2. Make sure **Email** is enabled (it is by default)
3. Optional: Configure email templates in **Authentication** → **Email Templates**

---

### Step 4: Get Your API Keys

1. Go to **Project Settings** → **API** (left sidebar)
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long string)

---

### Step 5: Configure Environment Variables

#### For Local Development:

Create a file named `.env.local` in the project root:

```bash
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
```

Replace with your actual values from Step 4.

#### For Vercel Deployment:

1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add two variables:
   - **Name**: `VITE_SUPABASE_URL`
     - **Value**: Your Project URL
   - **Name**: `VITE_SUPABASE_ANON_KEY`
     - **Value**: Your anon public key
4. Select environments: **Production**, **Preview**, **Development**
5. Click **Save**
6. **Redeploy** your project (Vercel → Deployments → Redeploy)

---

### Step 6: Create First Admin User

After deployment, you need to create the first admin user:

#### Option A: Via Supabase Dashboard (Recommended)

1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Fill in:
   - **Email**: `admin@yourcompany.com`
   - **Password**: `YourSecurePassword123!`
   - **Auto Confirm User**: ✅ Check this box
4. Click **Create user**
5. Note the **UID** (e.g., `a1b2c3d4-e5f6-7890-abcd-ef1234567890`)

6. Go to **SQL Editor** → **New Query**
7. Run this SQL (replace the UID and details):

```sql
INSERT INTO users (id, email, full_name, role, organization_id, status)
VALUES (
  'YOUR-USER-UID-HERE',
  'admin@yourcompany.com',
  'Admin User',
  'super_admin',
  NULL,
  'active'
);
```

#### Option B: Via Sign Up Flow

1. Go to your deployed app URL
2. Click "Don't have an account? Sign up"
3. Fill in the form
4. Check your email and verify
5. Go to **SQL Editor** and run:

```sql
UPDATE users 
SET role = 'super_admin', status = 'active'
WHERE email = 'your-email@example.com';
```

---

## 🎯 Testing the Login

### Demo Mode (No Supabase Configured)

If you haven't set up Supabase yet, the app runs in **demo mode**:

- Click any demo credential button on the login page
- Or use: `superadmin@cloudcrm.com` / `demo123`
- No real authentication, just for testing the UI

### Production Mode (With Supabase)

1. Go to your deployed URL
2. Enter the email/password you created in Step 6
3. You should be redirected to the dashboard
4. Your name and role appear in the top-right corner
5. Click the logout icon to sign out

---

## 👥 Creating Additional Users

### Via User Management Page (Admin Only)

1. Log in as `super_admin` or `admin`
2. Go to **User Management** (in sidebar)
3. Click **+ Add User**
4. Fill in user details and assign role
5. User receives email invitation (if configured)

### Via SQL (Manual)

```sql
-- Create user in Supabase Auth
-- (Do this via Dashboard → Authentication → Users → Add User)

-- Then add to users table
INSERT INTO users (id, email, full_name, role, organization_id, status)
VALUES (
  'USER-UID-FROM-AUTH',
  'user@company.com',
  'John Doe',
  'manager',
  NULL,
  'active'
);
```

---

## 🔒 Role-Based Access Control

The app enforces these permissions:

| Role | Can Manage Users | Can View All Data | Can Approve Deals |
|------|------------------|-------------------|-------------------|
| **Super Admin** | ✅ | ✅ | ✅ |
| **Admin** | ✅ | ✅ | ✅ |
| **Leader** | ❌ | ✅ | ✅ |
| **Manager** | ❌ | ❌ | ✅ |
| **Employee** | ❌ | ❌ | ❌ |

---

## 🛠️ Troubleshooting

### "Invalid credentials" error

- **Demo Mode**: Use exact demo credentials or create a user first
- **Production**: Check if user exists in Supabase → Authentication → Users

### User can log in but sees no data

- User record must exist in the `users` table
- Check `users` table in Supabase → Table Editor
- Ensure `status = 'active'`

### Environment variables not working on Vercel

- Variable names must start with `VITE_`
- Redeploy after adding environment variables
- Check variable names are exactly: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Email verification not received

- Check Supabase → Authentication → Email Templates
- Verify SMTP is configured (Supabase provides default)
- Check spam folder
- Or disable email confirmation in Supabase → Authentication → Settings

### "User already registered" error

- User email already exists in Supabase Auth
- Go to Authentication → Users to see existing users
- Or use a different email

---

## 📊 User Management Features

### What You Can Do

- ✅ View all users in your organization
- ✅ Create new users with specific roles
- ✅ Edit user details (name, role, department, team)
- ✅ Activate/deactivate users
- ✅ Delete users (super admin only)
- ✅ Filter users by role or status
- ✅ Search users by name or email

### Role Hierarchy

```
Super Admin (Level 1)
  └─ Admin (Level 2)
      └─ Leader (Level 3)
          └─ Manager (Level 4)
              └─ Employee (Level 5)
```

Higher-level roles can manage lower-level roles.

---

## 🎨 Customization

### Change Login Page Branding

Edit `src/pages/Login.tsx`:
- Change logo, colors, text
- Add your company branding
- Customize demo credentials

### Add OAuth Providers

Supabase supports Google, GitHub, etc.

1. Go to Supabase → Authentication → Providers
2. Enable desired provider (e.g., Google)
3. Configure OAuth credentials
4. Update `src/contexts/AuthContext.tsx` to add OAuth login

---

## 📚 Next Steps

1. ✅ Set up Supabase project
2. ✅ Run database schema
3. ✅ Configure environment variables
4. ✅ Create first admin user
5. ✅ Test login flow
6. ✅ Deploy to Vercel with env vars
7. ✅ Create additional users via User Management
8. ✅ Customize login page branding

---

## 🔗 Useful Links

- [Supabase Docs](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## 💡 Tips

- **Security**: Never commit `.env.local` to Git (it's in `.gitignore`)
- **Passwords**: Use strong passwords (min 6 characters)
- **Roles**: Start with one super admin, then create other roles as needed
- **Testing**: Use demo mode for UI testing, production mode for real data
- **Backup**: Regularly backup your Supabase database

---

## 🆘 Need Help?

- Check Supabase logs: Dashboard → Logs
- Check browser console for errors (F12)
- Verify environment variables are set correctly
- Ensure database schema was run successfully

---

**You're all set! Your CRM now has secure, role-based authentication.** 🎉
