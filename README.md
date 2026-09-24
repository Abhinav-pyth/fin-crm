# CloudCRM - Enterprise CRM Platform

A modern, cloud-native CRM application inspired by BusinessNext CRM, built for banking and financial services.

## Features

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

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v4
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router v6
- **Animations**: Framer Motion

## Deployment to Vercel

### Option 1: Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2: GitHub Integration
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import the repository
4. Vercel auto-detects Vite configuration
5. Click Deploy

### Option 3: Direct Deploy
```bash
vercel --prod
```

## Development

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

## Cloud-Ready Architecture

This application is designed for cloud deployment:
- **Static SPA**: No server-side rendering needed
- **Client-side routing**: Configured for Vercel rewrites
- **Responsive design**: Works on all devices
- **Optimized build**: Code-split and tree-shaken

## Project Structure

```
src/
├── App.tsx              # Main app with routing
├── main.tsx             # Entry point
├── index.css            # Global styles
├── types/
│   └── index.ts         # TypeScript interfaces
├── data/
│   └── mockData.ts      # Sample data
├── components/
│   └── Sidebar.tsx      # Navigation layout
└── pages/
    ├── Dashboard.tsx     # Analytics dashboard
    ├── Customers.tsx     # Customer management
    ├── Leads.tsx         # Lead pipeline
    ├── Opportunities.tsx # Deal tracking
    ├── Tasks.tsx         # Task management
    ├── Campaigns.tsx     # Marketing campaigns
    ├── Reports.tsx       # Analytics & reports
    └── Settings.tsx      # Configuration
```
