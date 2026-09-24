# CloudCRM - Enterprise CRM Platform

A modern, cloud-native CRM application inspired by BusinessNext CRM, built for banking and financial services.

## 🗄️ Database Architecture

### Where is the data stored?

**Option 1: Supabase Cloud Database (Recommended for Production)**
- PostgreSQL database hosted on Supabase
- Real-time sync capabilities
- Built-in authentication
- Row-level security (RLS)
- Free tier available

**Option 2: Mock Data (Demo Mode)**
- In-memory data for demonstration
- No database required
- Data resets on page refresh

### Setting Up Supabase (Cloud Database)

1. **Create a Supabase Account**
   - Go to [supabase.com](https://supabase.com) and sign up
   - Create a new project

2. **Set Up the Database Schema**
   - Go to SQL Editor in your Supabase dashboard
   - Copy and run the SQL from `src/data/schema.sql`
   - This creates all tables: organizations, departments, teams, users, customers, leads, opportunities, tasks, campaigns, activities

3. **Configure Environment Variables**
   - Copy `.env.example` to `.env.local`
   ```bash
   cp .env.example .env.local
   ```
   - Get your credentials from Supabase:
     - Project Settings → API → Project URL → `VITE_SUPABASE_URL`
     - Project Settings → API → anon/public key → `VITE_SUPABASE_ANON_KEY`

4. **Deploy to Vercel**
   - In Vercel dashboard, add environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Redeploy your project

## 👥 User Management & Roles

### Role Hierarchy

| Role | Level | Description | Permissions |
|------|-------|-------------|-------------|
| **Super Admin** | 1 | Full system access | Everything |
| **Admin** | 2 | Manages users & settings | All except org management |
| **Leader** | 3 | Team leadership | View all data, approve deals |
| **Manager** | 4 | Team management | Manage own team's data |
| **Employee** | 5 | Basic access | Assigned tasks & leads only |

### Organization Structure

```
Organization
├── Super Admin
├── Admins
│   ├── Department Heads
│   │   ├── Team Leaders
│   │   │   ├── Managers
│   │   │   │   └── Employees
│   │   │   └── Employees (direct reports)
│   │   └── ...
│   └── ...
└── ...
```

### Features

- **User Management Page** (`/users`)
  - Create, edit, delete users
  - Assign roles and departments
  - Activate/deactivate users
  - Filter by role and status

- **Organization Structure Page** (`/organization`)
  - Visual hierarchy view
  - Department and team management
  - See reporting structure
  - Member counts per team

## 📦 Features

### 📊 Dashboard
- Real-time KPIs (Customers, Leads, Opportunities, Revenue)
- Revenue trend charts with target comparison
- Sales pipeline visualization
- Customer segment distribution
- Recent activity feed

### 👥 Customer 360° View
- Complete customer profiles with financial summary
- KYC & compliance tracking
- Product & service portfolio
- Risk profiling
- Segment classification (Retail, Corporate, HNI, SME)

### 🎯 Lead Management
- Visual pipeline/kanban board
- Lead stages: New → Contacted → Qualified → Proposal → Won/Lost
- Lead source tracking
- Priority management
- Quick conversion to customer

### 💼 Opportunity Management
- Deal tracking with probability weighting
- Pipeline value calculation
- Stage progression
- Weighted revenue forecasting

### ✅ Tasks & Activities
- Task management with types (Call, Meeting, Email, Document, Follow-up)
- Status tracking (Pending, In Progress, Completed, Overdue)
- Priority levels
- Related entity linking

### 📢 Campaign Management
- Multi-channel campaigns (Email, SMS, WhatsApp, Push)
- Performance metrics (Delivery, Open Rate, Conversion)
- Budget tracking
- Campaign progress monitoring

### 📈 Reports & Analytics
- Revenue performance analysis
- Lead conversion funnel
- Customer acquisition by segment
- Product mix analysis
- Team performance tracking

### ⚙️ Settings
- Profile management
- Organization configuration
- Notification preferences
- Security (2FA, Sessions)
- Third-party integrations (CBS, Email, SMS, CIBIL, etc.)

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router v6
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel

## 🚀 Deployment to Vercel

### Option 1: Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2: GitHub Integration
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import the repository
4. Add environment variables in Vercel dashboard
5. Click Deploy

### Option 3: Direct Deploy
```bash
vercel --prod
```

## 💻 Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📁 Project Structure

```
src/
├── App.tsx                    # Main app with routing
├── main.tsx                   # Entry point
├── index.css                  # Global styles
├── vite-env.d.ts              # Vite environment types
├── lib/
│   └── supabase.ts            # Supabase client configuration
├── types/
│   ├── index.ts               # Core TypeScript interfaces
│   └── user.ts                # User, Role, Organization types
├── data/
│   ├── mockData.ts            # Sample data (fallback)
│   ├── database.ts            # Database service layer
│   └── schema.sql             # Supabase SQL schema
├── components/
│   └── Sidebar.tsx            # Navigation layout
└── pages/
    ├── Dashboard.tsx          # Analytics dashboard
    ├── Customers.tsx          # Customer management
    ├── Leads.tsx              # Lead pipeline
    ├── Opportunities.tsx      # Deal tracking
    ├── Tasks.tsx              # Task management
    ├── Campaigns.tsx          # Marketing campaigns
    ├── Reports.tsx            # Analytics & reports
    ├── Users.tsx              # User management
    ├── Organization.tsx       # Org structure
    └── Settings.tsx           # Configuration
```

## 🔐 Security

- Row Level Security (RLS) enabled on all tables
- Role-based access control (RBAC)
- Users can only see data within their organization
- Super admins have full access
- Environment variables for sensitive credentials

## 📝 License

MIT
