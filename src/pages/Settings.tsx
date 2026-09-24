import { useState } from 'react';
import {
  User,
  Building2,
  Bell,
  Shield,
  Palette,
  Globe,
  Database,
  Key,
  Mail,
  Smartphone,
  Check,
} from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'organization', label: 'Organization', icon: Building2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'integrations', label: 'Integrations', icon: Globe },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your account and platform preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Tabs */}
        <div className="w-56 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Profile Settings</h3>
                <p className="text-sm text-slate-500">Update your personal information</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  AK
                </div>
                <div>
                  <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-all">
                    Change Photo
                  </button>
                  <p className="text-xs text-slate-500 mt-1">JPG, PNG. Max 2MB</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">First Name</label>
                  <input type="text" defaultValue="Admin" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Last Name</label>
                  <input type="text" defaultValue="User" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                  <input type="email" defaultValue="admin@cloudcrm.com" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
                  <input type="tel" defaultValue="+91 98765 43210" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
                  <input type="text" defaultValue="Branch Manager" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" disabled />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
                  <input type="text" defaultValue="Sales & Operations" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button className="px-5 py-2.5 text-slate-600 bg-slate-100 rounded-xl text-sm font-medium hover:bg-slate-200 transition-all">
                  Cancel
                </button>
                <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'organization' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Organization Settings</h3>
                <p className="text-sm text-slate-500">Configure your organization details</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Organization Name</label>
                  <input type="text" defaultValue="CloudCRM Financial Services" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Industry</label>
                  <select className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20">
                    <option>Banking & Financial Services</option>
                    <option>Insurance</option>
                    <option>NBFC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Branch Code</label>
                  <input type="text" defaultValue="BR-MUM-001" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">IFSC Code</label>
                  <input type="text" defaultValue="CLOUD0001234" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
                  <textarea defaultValue="Tower B, 5th Floor, BKC, Bandra Kurla Complex, Mumbai - 400051" className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 h-20 resize-none" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button className="px-5 py-2.5 text-slate-600 bg-slate-100 rounded-xl text-sm font-medium hover:bg-slate-200 transition-all">
                  Cancel
                </button>
                <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Notification Preferences</h3>
                <p className="text-sm text-slate-500">Choose how you want to be notified</p>
              </div>
              <div className="space-y-4">
                {[
                  { title: 'New Lead Assigned', desc: 'When a new lead is assigned to you', email: true, push: true, sms: false },
                  { title: 'Task Reminders', desc: 'Before task due dates', email: true, push: true, sms: true },
                  { title: 'Deal Updates', desc: 'When opportunity stage changes', email: true, push: false, sms: false },
                  { title: 'Customer Interactions', desc: 'When customer activities are logged', email: false, push: true, sms: false },
                  { title: 'Campaign Results', desc: 'Daily campaign performance summary', email: true, push: false, sms: false },
                  { title: 'System Alerts', desc: 'Important system notifications', email: true, push: true, sms: true },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{item.title}</p>
                      <p className="text-xs text-slate-500">{item.desc}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Mail size={14} />
                        <input type="checkbox" defaultChecked={item.email} className="rounded text-blue-600" />
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Bell size={14} />
                        <input type="checkbox" defaultChecked={item.push} className="rounded text-blue-600" />
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Smartphone size={14} />
                        <input type="checkbox" defaultChecked={item.sms} className="rounded text-blue-600" />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all">
                  Save Preferences
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Security Settings</h3>
                <p className="text-sm text-slate-500">Manage your account security</p>
              </div>
              <div className="space-y-4">
                <div className="p-4 border border-slate-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-100 rounded-lg">
                        <Key size={18} className="text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">Password</p>
                        <p className="text-xs text-slate-500">Last changed 30 days ago</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-all">
                      Change
                    </button>
                  </div>
                </div>
                <div className="p-4 border border-slate-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Shield size={18} className="text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">Two-Factor Authentication</p>
                        <p className="text-xs text-slate-500">Add extra security to your account</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check size={16} className="text-emerald-600" />
                      <span className="text-xs font-medium text-emerald-600">Enabled</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 border border-slate-200 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-violet-100 rounded-lg">
                        <Database size={18} className="text-violet-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">Active Sessions</p>
                        <p className="text-xs text-slate-500">2 devices currently logged in</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-all">
                      Revoke All
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-slate-800">Integrations</h3>
                <p className="text-sm text-slate-500">Connect with third-party services</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'Core Banking System', desc: 'Connect to your CBS for real-time data', status: 'connected', icon: '🏦' },
                  { name: 'Email Service', desc: 'Send emails via SMTP/SES', status: 'connected', icon: '📧' },
                  { name: 'SMS Gateway', desc: 'Send SMS notifications', status: 'connected', icon: '📱' },
                  { name: 'WhatsApp Business', desc: 'WhatsApp messaging integration', status: 'available', icon: '💬' },
                  { name: 'CIBIL/Credit Bureau', desc: 'Credit score lookup', status: 'connected', icon: '📊' },
                  { name: 'Document Management', desc: 'Cloud document storage', status: 'available', icon: '📁' },
                  { name: 'Video KYC', desc: 'Video verification service', status: 'available', icon: '🎥' },
                  { name: 'Payment Gateway', desc: 'Collect payments online', status: 'connected', icon: '💳' },
                ].map((integration, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border border-slate-200 rounded-xl hover:border-blue-200 transition-all">
                    <div className="text-2xl">{integration.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">{integration.name}</p>
                      <p className="text-xs text-slate-500">{integration.desc}</p>
                    </div>
                    <button className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      integration.status === 'connected'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100'
                    }`}>
                      {integration.status === 'connected' ? 'Connected' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
