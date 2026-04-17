import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import {
  User, Bell, Shield, Palette, Sliders,
  Camera, Check, ChevronRight, Moon, Sun,
  Smartphone, Mail, Github, ExternalLink,
  ChevronDown,
  Globe,
  Trash2,
  Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../components/ThemeContext';

const SettingsSection = ({ title, description, children }: any) => (
  <div className="bg-card rounded-[20px] border border-border p-6 mb-6">
    <div className="mb-6">
      <h3 className="text-[18px] font-bold text-text-main tracking-tight mb-1">{title}</h3>
      <p className="text-[14px] text-text-muted">{description}</p>
    </div>
    <div className="space-y-4">
      {children}
    </div>
  </div>
);

const SettingItem = ({ icon: Icon, label, description, rightElement, onClick }: any) => (
  <div
    className="flex items-center justify-between p-4 rounded-[16px] border border-transparent hover:border-border hover:bg-page transition-all cursor-pointer group"
    onClick={onClick}
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-[12px] bg-page flex items-center justify-center text-text-muted group-hover:text-text-main transition-colors">
        <Icon size={20} />
      </div>
      <div>
        <h4 className="text-[14px] font-bold text-text-main">{label}</h4>
        {description && <p className="text-[12px] text-text-muted font-medium">{description}</p>}
      </div>
    </div>
    {rightElement || <ChevronRight size={18} className="text-border group-hover:text-text-main transition-colors" />}
  </div>
);

const CustomToggle = ({ active, onToggle }: any) => (
  <button
    onClick={(e) => { e.stopPropagation(); onToggle(); }}
    className={`w-11 h-6 rounded-full p-1 transition-all flex items-center ${active ? 'bg-primary justify-end' : 'bg-page border border-border justify-start'}`}
  >
    <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
  </button>
);

const Settings = () => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('Account');
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);

  const tabs = [
    { id: 'Account', icon: User },
    { id: 'Notifications', icon: Bell },
    { id: 'Security', icon: Shield },
    { id: 'Appearance', icon: Palette },
    { id: 'General', icon: Sliders },
  ];

  return (
    <Layout>
      <div className="w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-[24px] font-bold text-text-main">System Settings</h1>
            <p className="text-[14px] text-text-muted mt-1 font-medium">Manage your personal preferences and account configuration</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-6 py-2.5 bg-card border border-border rounded-full text-[14px] font-bold text-text-muted hover:bg-page transition-all">
              Cancel
            </button>
            <button className="px-8 py-2.5 text-white rounded-full text-[14px] font-bold transition-all shadow-sm bg-primary hover:bg-primary-hover">
              Save Changes
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:w-64 shrink-0">
            <div className="bg-card rounded-[20px] border border-border p-2 sticky top-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-[14px] text-[14px] font-bold transition-all ${activeTab === tab.id ? 'bg-primary text-white shadow-md' : 'text-text-muted hover:bg-page hover:text-text-main'}`}
                >
                  <tab.icon size={18} />
                  {tab.id}
                </button>
              ))}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {activeTab === 'Account' && (
                <motion.div
                  key="account"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <SettingsSection title="Profile Overview" description="Update your portrait and personal details">
                    <div className="flex items-center gap-6 mb-8 p-2">
                      <div className="relative group">
                        <img
                          src="https://ui-avatars.com/api/?name=Shakib+Ali&background=003bff&color=fff&size=128"
                          className="w-20 h-20 rounded-[24px] object-cover border border-border group-hover:border-primary transition-all"
                          alt="Avatar"
                        />
                        <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-card border border-border rounded-[10px] flex items-center justify-center text-text-main hover:bg-page transition-all shadow-sm">
                          <Camera size={14} />
                        </button>
                      </div>
                      <div>
                        <h4 className="text-[18px] font-bold text-text-main">Shakib Ali</h4>
                        <p className="text-[13px] text-text-muted font-medium">shakib@proflow.io</p>
                        <div className="flex gap-4 mt-2">
                          <button className="text-[12px] font-bold text-primary hover:underline transition-all">Upload New</button>
                          <button className="text-[12px] font-bold text-rose-500 hover:underline transition-all">Remove</button>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-2">
                      <div className="space-y-2">
                        <label className="text-[12px] font-bold text-text-main">Full Name</label>
                        <input defaultValue="Shakib Ali" className="w-full px-4 py-3 bg-page border border-border rounded-[14px] text-[14px] font-bold text-text-main outline-none focus:bg-card focus:border-primary transition-all" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[12px] font-bold text-text-main">Job Title</label>
                        <input defaultValue="UI/UX Designer" className="w-full px-4 py-3 bg-page border border-border rounded-[14px] text-[14px] font-bold text-text-main outline-none focus:bg-card focus:border-primary transition-all" />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-[12px] font-bold text-text-main">Bio</label>
                        <textarea rows={3} defaultValue="Designing the future of project management at ProFlow." className="w-full px-4 py-3 bg-page border border-border rounded-[14px] text-[14px] font-bold text-text-main outline-none focus:bg-card focus:border-primary transition-all resize-none" />
                      </div>
                    </div>
                  </SettingsSection>

                  <SettingsSection title="Connected Accounts" description="Manage access from third-party platforms">
                    <SettingItem
                      icon={Github}
                      label="GitHub Integration"
                      description="Account linked as @shakibali"
                      rightElement={<span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-[11px] font-bold">Active</span>}
                    />
                    <SettingItem
                      icon={ExternalLink}
                      label="Public API"
                      description="Manage and revoke API credentials"
                    />
                  </SettingsSection>
                </motion.div>
              )}

              {activeTab === 'Notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <SettingsSection title="Alerts & Updates" description="Configure your preferred delivery methods">
                    <SettingItem
                      icon={Mail}
                      label="Email Digests"
                      description="Receive daily and weekly progress summaries"
                      rightElement={<CustomToggle active={emailNotif} onToggle={() => setEmailNotif(!emailNotif)} />}
                    />
                    <SettingItem
                      icon={Bell}
                      label="Real-time Notifications"
                      description="In-app alerts for task updates and comments"
                      rightElement={<CustomToggle active={pushNotif} onToggle={() => setPushNotif(!pushNotif)} />}
                    />
                  </SettingsSection>
                </motion.div>
              )}

              {activeTab === 'Appearance' && (
                <motion.div
                  key="appearance"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  <SettingsSection title="Interface Style" description="Select a theme that suits your working environment">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <button 
                        onClick={() => setTheme('light')}
                        className={`p-5 rounded-[20px] border-2 flex flex-col items-center gap-3 transition-all ${theme === 'light' ? 'border-primary bg-card/50' : 'border-border bg-page/50'}`}
                      >
                        <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center ${theme === 'light' ? 'bg-primary text-white' : 'bg-card text-text-muted'}`}>
                          <Sun size={20} />
                        </div>
                        <span className="text-[14px] font-bold text-text-main">System Light</span>
                        {theme === 'light' && <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center"><Check size={12} className="text-white" /></div>}
                      </button>

                      <button 
                        onClick={() => setTheme('dark')}
                        className={`p-5 rounded-[20px] border-2 flex flex-col items-center gap-3 transition-all ${theme === 'dark' ? 'border-primary bg-card/50' : 'border-border bg-page/50'}`}
                      >
                        <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center ${theme === 'dark' ? 'bg-primary text-white' : 'bg-card text-text-muted'}`}>
                          <Moon size={20} />
                        </div>
                        <span className="text-[14px] font-bold text-text-main">Lunar Dark</span>
                        {theme === 'dark' && <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center"><Check size={12} className="text-black" /></div>}
                      </button>

                      <button className="p-5 rounded-[20px] border-2 border-border bg-page flex flex-col items-center gap-3 opacity-40 cursor-not-allowed">
                        <div className="w-10 h-10 rounded-[12px] bg-card flex items-center justify-center text-text-muted">
                          <Smartphone size={20} />
                        </div>
                        <span className="text-[14px] font-bold text-text-muted">Auto Detect</span>
                      </button>
                    </div>
                  </SettingsSection>
                </motion.div>
              )}

              {activeTab === 'Security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <SettingsSection title="Password & Authentication" description="Ensure your account stays protected with robust credentials">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[12px] font-bold text-text-main">Current Password</label>
                        <div className="relative">
                          <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-page border border-border rounded-[14px] text-[14px] font-bold text-text-main outline-none focus:bg-card focus:border-primary transition-all" />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-primary text-[12px] font-bold cursor-pointer hover:underline">Forgot?</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[12px] font-bold text-text-main">New Password</label>
                          <input type="password" placeholder="Min. 8 characters" className="w-full px-4 py-3 bg-page border border-border rounded-[14px] text-[14px] font-bold text-text-main outline-none focus:bg-card focus:border-primary transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[12px] font-bold text-text-main">Confirm Password</label>
                          <input type="password" placeholder="Re-type password" className="w-full px-4 py-3 bg-page border border-border rounded-[14px] text-[14px] font-bold text-text-main outline-none focus:bg-card focus:border-primary transition-all" />
                        </div>
                      </div>
                      <button className="text-[12px] font-bold px-5 py-2.5 bg-page border border-border text-text-main rounded-xl hover:bg-primary hover:text-white hover:border-transparent transition-all">Update Password</button>
                    </div>
                  </SettingsSection>

                  <SettingsSection title="Security Safeguards" description="Additional layers of protection for your projects and data">
                    <SettingItem
                      icon={Lock}
                      label="Two-Factor Authentication (2FA)"
                      description="Add a secondary verification step to your login process"
                      rightElement={<CustomToggle active={true} onToggle={() => { }} />}
                    />
                    <SettingItem
                      icon={Smartphone}
                      label="Session Management"
                      description="View and log out from active sessions on other devices"
                      rightElement={<span className="text-[12px] font-bold text-primary">3 active</span>}
                    />
                  </SettingsSection>
                </motion.div>
              )}

              {activeTab === 'General' && (
                <motion.div
                  key="general"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-6"
                >
                  <SettingsSection title="Global Preferences" description="Configure basic application behavior and regional settings">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[12px] font-bold text-text-main">Default Language</label>
                        <div className="relative">
                          <select className="w-full px-4 py-3 bg-page border border-border rounded-[14px] text-[14px] font-bold text-text-main outline-none focus:bg-card focus:border-primary transition-all appearance-none cursor-pointer">
                            <option>English (US)</option>
                            <option>Spanish</option>
                            <option>French</option>
                            <option>German</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[12px] font-bold text-text-main">Timezone</label>
                        <div className="relative">
                          <select className="w-full px-4 py-3 bg-page border border-border rounded-[14px] text-[14px] font-bold text-text-main outline-none focus:bg-card focus:border-primary transition-all appearance-none cursor-pointer">
                            <option>(GMT-08:00) Pacific Time</option>
                            <option>(GMT+00:00) London</option>
                            <option>(GMT+05:30) Mumbai</option>
                            <option>(GMT+09:00) Tokyo</option>
                          </select>
                          <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </SettingsSection>

                  <SettingsSection title="Account Data" description="Manage your data and account visibility">
                    <SettingItem
                      icon={Globe}
                      label="Download Personal Data"
                      description="Export all your project history and activity logs"
                      rightElement={<button className="text-[12px] font-bold text-primary hover:underline">Request Export</button>}
                    />
                    <SettingItem
                      icon={Trash2}
                      label="Deactivate Account"
                      description="Permanently delete your account and all associated data"
                      rightElement={<button className="px-5 py-2.5 bg-rose-500/10 text-rose-600 rounded-xl text-[12px] font-bold hover:bg-rose-600 hover:text-white transition-all">Deactivate</button>}
                    />
                  </SettingsSection>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
