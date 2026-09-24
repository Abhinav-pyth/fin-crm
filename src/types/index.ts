export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  designation: string;
  status: 'active' | 'inactive' | 'prospect';
  segment: 'retail' | 'corporate' | 'hni' | 'sme';
  riskProfile: 'low' | 'medium' | 'high';
  totalAssets: number;
  lastInteraction: string;
  createdAt: string;
  avatar?: string;
  address: string;
  dob: string;
  panNumber: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: 'website' | 'referral' | 'cold_call' | 'event' | 'social_media';
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'won' | 'lost';
  product: string;
  estimatedValue: number;
  assignedTo: string;
  createdAt: string;
  lastFollowUp: string;
  notes: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Opportunity {
  id: string;
  title: string;
  customerId: string;
  customerName: string;
  product: string;
  stage: 'prospecting' | 'qualification' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  amount: number;
  probability: number;
  expectedCloseDate: string;
  assignedTo: string;
  createdAt: string;
  description: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'call' | 'meeting' | 'email' | 'follow_up' | 'document' | 'other';
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  assignedTo: string;
  relatedTo: string;
  relatedType: 'customer' | 'lead' | 'opportunity';
  createdAt: string;
}

export interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'whatsapp' | 'push' | 'direct_mail';
  status: 'draft' | 'active' | 'paused' | 'completed';
  startDate: string;
  endDate: string;
  targetAudience: string;
  totalRecipients: number;
  delivered: number;
  opened: number;
  responded: number;
  converted: number;
  budget: number;
  createdBy: string;
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task' | 'system';
  title: string;
  description: string;
  timestamp: string;
  userId: string;
  relatedEntity: string;
  relatedType: string;
}

export interface DashboardMetrics {
  totalCustomers: number;
  activeLeads: number;
  openOpportunities: number;
  revenueThisMonth: number;
  conversionRate: number;
  avgDealSize: number;
  tasksDueToday: number;
  customerSatisfaction: number;
}
