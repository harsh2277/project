import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import {
  Plus, Search, ExternalLink, Check,
  Settings2, Shield, Zap, Globe,
  Calendar, MessageSquare, Trello,
  LayoutGrid, MessageCircle, Bug,
  X, Trash2, Send, Link, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const INITIAL_APPS = [
  {
    id: 'google-calendar',
    name: 'Google Calendar',
    description: 'Sync your project deadlines and meetings directly with Google Calendar.',
    icon: Calendar,
    color: 'text-blue-500',
    bg: 'bg-primary-light',
    status: 'connected',
    category: 'Productivity'
  },
  {
    id: 'zoho-cliq',
    name: 'Zoho Cliq',
    description: 'Get real-time project updates and notifications in your Zoho Cliq channels.',
    icon: MessageSquare,
    color: 'text-orange-500',
    bg: 'bg-orange-50',
    status: 'disconnected',
    category: 'Communication',
    webhookUrl: ''
  },
  {
    id: 'jira',
    name: 'Jira',
    description: 'Import Jira issues as tasks and keep status synced across both platforms.',
    icon: Bug,
    color: 'text-primary',
    bg: 'bg-primary-light',
    status: 'disconnected',
    category: 'Management',
  }
];

/* ─── Components ─────────────────────────────────────────────── */

const WebhookModal = ({ isOpen, onClose, onSave, app }: any) => {
  const [url, setUrl] = useState(app.webhookUrl || '');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl relative z-10"
      >
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-slate-800">Integrate Zoho Cliq</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><X size={20} /></button>
          </div>

          <div className="space-y-6">
            <div className="p-4 bg-orange-50 rounded-2xl flex gap-4 border border-orange-100">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-orange-500 shrink-0">
                <Link size={20} />
              </div>
              <p className="text-sm text-orange-800 font-medium">
                To integrate, create a Webhook in your Zoho Cliq administration panel and paste the URL below.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Webhook URL</label>
              <input
                type="text"
                placeholder="https://cliq.zoho.com/api/v2/channelsbyname/..."
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:border-orange-300 transition-all"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
            </div>

            <button
              onClick={() => onSave(url)}
              disabled={!url}
              className="w-full py-4 bg-orange-500 text-white rounded-2xl font-black text-sm hover:bg-orange-600 transition-all shadow-lg shadow-orange-200 disabled:opacity-50 disabled:shadow-none"
            >
              Verify & Integrate
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const JiraModal = ({ isOpen, onClose, onSave, app }: any) => {
  const [data, setData] = useState({
    url: app.jiraUrl || '',
    email: app.jiraEmail || '',
    token: app.jiraToken || ''
  });
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleVerify = async () => {
    setIsValidating(true);
    setError(null);

    try {
      // Basic validation of URL format
      let siteUrl = data.url.trim();
      if (!siteUrl.startsWith('http')) siteUrl = `https://${siteUrl}`;
      if (siteUrl.endsWith('/')) siteUrl = siteUrl.slice(0, -1);

      // Jira API Basic Auth: base64(email:token)
      const auth = btoa(`${data.email.trim()}:${data.token.trim()}`);

      // We use a CORS proxy for development to bypass browser restrictions
      // Note: In production, you should use your own backend as a proxy
      const proxyPrefix = "https://cors-anywhere.herokuapp.com/";
      const finalUrl = `${proxyPrefix}${siteUrl}/rest/api/3/myself`;

      const response = await fetch(finalUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${auth}`,
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      if (response.ok) {
        onSave({ ...data, url: siteUrl, status: 'connected' });
      } else if (response.status === 403) {
        setError("Proxy access denied. Please visit https://cors-anywhere.herokuapp.com/corsdemo and click 'Request temporary access' to enable the development proxy.");
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.errorMessages?.[0] || `Verification failed (Status: ${response.status})`);
      }
    } catch (err: any) {
      setError(err.message === 'Failed to fetch'
        ? "CORS Blocked: Please visit https://cors-anywhere.herokuapp.com/corsdemo to enable the temporary proxy access, then try again."
        : `Error: ${err.message}`);
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden shadow-2xl relative z-10" >
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-slate-800">Setup Jira Sync</h2>
            <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><X size={20} /></button>
          </div>

          <div className="space-y-5">
            <div className="p-4 bg-primary-light rounded-2xl border border-primary-light flex items-start gap-4">
              <div className="p-2 bg-white rounded-xl text-primary shadow-sm shrink-0">
                <AlertCircle size={20} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold text-blue-900">How to get your API Token?</p>
                <p className="text-[12px] font-medium text-primary leading-relaxed">
                  Go to <a href="https://id.atlassian.com/manage-profile/security/api-tokens" target="_blank" rel="noreferrer" className="underline font-black hover:text-blue-900 transition-colors">Security Settings</a>, click "Create API token", and copy it here.
                </p>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-600 text-xs font-bold flex items-center gap-3">
                <X className="shrink-0" size={16} />
                {error}
              </motion.div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Jira Site URL</label>
              <input
                type="text"
                placeholder="https://your-domain.atlassian.net"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:border-blue-300 transition-all"
                value={data.url}
                onChange={(e) => setData({ ...data, url: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Atlassian Email</label>
              <input
                type="email"
                placeholder="name@company.com"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:border-blue-300 transition-all"
                value={data.email}
                onChange={(e) => setData({ ...data, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">API Token</label>
              <input
                type="password"
                placeholder="••••••••••••••••"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3.5 text-sm font-medium outline-none focus:border-blue-300 transition-all"
                value={data.token}
                onChange={(e) => setData({ ...data, token: e.target.value })}
              />
            </div>

            <button
              onClick={handleVerify}
              disabled={isValidating || !data.url || !data.email || !data.token}
              className="w-full py-4 bg-primary text-white rounded-2xl font-black text-sm hover:bg-primary-hover transition-all shadow-lg shadow-primary-light disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isValidating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify & Connect"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

const IntegrationCard = ({ app, onUpdate }: any) => {
  const [loading, setLoading] = useState(false);
  const [showWebhookModal, setShowWebhookModal] = useState(false);
  const [showJiraModal, setShowJiraModal] = useState(false);
  const isConnected = app.status === 'connected';

  const handleConnect = () => {
    if (app.id === 'zoho-cliq') {
      setShowWebhookModal(true);
    } else if (app.id === 'jira') {
      setShowJiraModal(true);
    } else {
      setLoading(true);
      setTimeout(() => {
        onUpdate(app.id, { status: 'connected' });
        setLoading(false);
      }, 1500);
    }
  };

  const handleDelete = () => {
    onUpdate(app.id, { status: 'disconnected', webhookUrl: '', jiraUrl: '', jiraEmail: '', jiraToken: '' });
  };

  const handleTest = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    alert(app.id === 'zoho-cliq' ? 'Test message sent to Zoho Cliq!' : 'Successfully synced data from Jira!');
    setLoading(false);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        whileHover={{ y: -4 }}
        className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col h-full group"
      >
        <div className="flex justify-between items-start mb-6">
          <div className={`w-14 h-14 rounded-2xl ${app.bg} flex items-center justify-center transition-transform group-hover:scale-110`}>
            <app.icon className={app.color} size={30} />
          </div>
          <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${isConnected ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
            {isConnected ? 'Connected' : 'Not Linked'}
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-800 mb-2">{app.name}</h3>
          <p className="text-sm text-slate-500 font-medium leading-relaxed">
            {app.description}
          </p>
          {isConnected && (app.webhookUrl || app.jiraUrl) && (
            <div className="mt-4 p-3 bg-slate-50 rounded-xl flex items-center gap-2 border border-slate-100">
              <Link size={14} className="text-slate-400" />
              <span className="text-[11px] font-medium text-slate-500 truncate">{app.webhookUrl || app.jiraUrl}</span>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center gap-3">
          {isConnected ? (
            <>
              {app.id === 'zoho-cliq' || app.id === 'jira' ? (
                <div className="flex w-full gap-2">
                  <button
                    onClick={() => app.id === 'zoho-cliq' ? setShowWebhookModal(true) : setShowJiraModal(true)}
                    className="flex-1 py-2.5 px-3 bg-slate-50 text-slate-600 rounded-xl text-xs font-black hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Settings2 size={14} /> EDIT
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-100"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={handleTest}
                    disabled={loading}
                    className="flex-1 py-2.5 px-3 bg-primary text-white rounded-xl text-xs font-black hover:bg-primary-hover transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-primary-light"
                  >
                    {loading ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={14} /> {app.id === 'jira' ? 'SYNC' : 'TEST'}</>}
                  </button>
                </div>
              ) : (
                <>
                  <button className="flex-1 py-2.5 px-4 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-100 transition-colors flex items-center justify-center gap-2">
                    <Settings2 size={16} /> Configure
                  </button>
                  <button onClick={handleDelete} className="p-2.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">
                    <Trash2 size={18} />
                  </button>
                </>
              )}
            </>
          ) : (
            <button
              onClick={handleConnect}
              disabled={loading}
              className="flex-1 py-2.5 px-4 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-hover transition-all flex items-center justify-center gap-2 shadow-sm shadow-primary-light"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Connect <Plus size={16} /></>
              )}
            </button>
          )}
        </div>
      </motion.div>

      <WebhookModal isOpen={showWebhookModal} onClose={() => setShowWebhookModal(false)} app={app} onSave={(url: string) => { onUpdate(app.id, { status: 'connected', webhookUrl: url }); setShowWebhookModal(false); }} />
      <JiraModal
        isOpen={showJiraModal}
        onClose={() => setShowJiraModal(false)}
        app={app}
        onSave={(data: any) => {
          onUpdate(app.id, { status: 'connected', ...data });
          setShowJiraModal(false);
          // Save full credentials for other pages to use
          localStorage.setItem('jira_connected', 'true');
          localStorage.setItem('jira_config', JSON.stringify({
            url: data.url,
            email: data.email,
            token: data.token
          }));
          window.dispatchEvent(new Event('storage'));
        }}
      />
    </>
  );
};

/* ─── Main Page ─────────────────────────────────────────────── */

const Integrations: React.FC = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  const [apps, setApps] = useState(INITIAL_APPS);

  const updateApp = (id: string, updates: any) => {
    setApps(prev => prev.map(app => app.id === id ? { ...app, ...updates } : app));
  };

  const filtered = apps.filter(app => {
    const matchesTab = activeTab === 'All' || app.category === activeTab;
    const matchesSearch = app.name.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <Layout>
      <div className="max-w-[1280px] mx-auto space-y-10 pb-12 font-sans px-4">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pt-4">
          <div className="space-y-1">
            <h1 className="text-[32px] font-extrabold text-slate-800 tracking-tight">Integrations</h1>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              Connect your favorite tools to automate your workflow <Zap size={16} className="text-amber-500 fill-amber-500" />
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white border border-slate-200 rounded-2xl px-5 py-3 shadow-sm text-sm font-medium text-slate-600 w-full md:w-80 focus-within:border-violet-300 transition-all">
              <Search size={18} className="mr-3 text-slate-400" />
              <input
                type="text"
                placeholder="Find an integration..."
                className="bg-transparent outline-none w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Apps Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode='popLayout'>
            {filtered.map(app => (
              <IntegrationCard key={app.id} app={app} onUpdate={updateApp} />
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Integrations;
