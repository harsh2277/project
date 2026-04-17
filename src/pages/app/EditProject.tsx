import { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { ArrowLeft, Briefcase, Calendar, Flag, Check, ChevronDown } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

/* ─── Shared helpers (same as CreateProject) ─────────────────── */
const getStatusStyle = (s: string) => {
  switch (s) {
    case 'In Progress': return 'bg-amber-500/10 text-amber-600';
    case 'Pending':     return 'bg-blue-500/10 text-blue-600';
    case 'Planning':    return 'bg-purple-500/10 text-purple-600';
    case 'On Hold':     return 'bg-page/10 text-text-muted';
    case 'Completed':   return 'bg-emerald-500/10 text-emerald-600';
    default:            return 'bg-page text-text-muted';
  }
};

const getPriorityStyle = (p: string) => {
  switch (p) {
    case 'High':   return 'bg-rose-500/10 text-rose-600';
    case 'Medium': return 'bg-blue-500/10 text-blue-600';
    case 'Low':    return 'bg-emerald-500/10 text-emerald-600';
    default:       return 'bg-page text-text-muted';
  }
};

const Field = ({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) => (
  <div>
    <label className="block text-[13px] font-bold text-text-main mb-2">
      {label}{required && <span className="text-rose-600 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const inputCls = "w-full px-4 py-3 bg-page border border-border rounded-[14px] focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/5 transition-all text-[14px] font-bold text-text-main placeholder:text-text-muted outline-none";
const selectCls = inputCls + " appearance-none cursor-pointer";

/* ─── Pre-filled mock data for the project being edited ─────── */
const MOCK_PROJECT = {
  name:        'Figma Design System',
  description: 'Component library for design system',
  startDate:   '2026-01-30',
  deadline:    '2026-02-05',
  priority:    'High',
  status:      'In Progress',
  progress:    80,
};

/* ─── Component ─────────────────────────────────────────────────── */
const EditProject = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState(MOCK_PROJECT);
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <Layout>
      <div className="w-full">
        {/* ── Header ──────────────────────────────────────────── */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(`/projects/${id}`)}
              className="p-2.5 bg-card border border-border rounded-full text-text-muted hover:text-text-main hover:shadow-sm transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-[20px] font-bold text-text-main">Edit Project</h1>
              <p className="text-[13px] font-medium text-text-muted mt-0.5">Update the project details below.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(`/projects/${id}`)}
              className="px-5 py-2.5 rounded-full text-[14px] font-semibold text-text-muted border border-border bg-card hover:bg-page transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => navigate(`/projects/${id}`)}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full text-[14px] font-semibold hover:bg-primary-hover transition-colors shadow-sm"
            >
              <Check size={16} /> Save Changes
            </button>
          </div>
        </div>

        {/* ── Body: Form + Preview ─────────────────────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Left: Form ──────────────────────────────────────── */}
          <div className="xl:col-span-2 space-y-5">

            {/* Basic Info */}
            <div className="bg-card p-6 rounded-[20px] border border-border">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-[12px] bg-page flex items-center justify-center text-text-main">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-text-main">Basic Details</h2>
                  <p className="text-[12px] font-medium text-text-subtle">Name and description of your project.</p>
                </div>
              </div>

              <div className="space-y-4">
                <Field label="Project Name" required>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Description">
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={e => set('description', e.target.value)}
                    className={inputCls + ' resize-none'}
                  />
                </Field>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-card p-6 rounded-[20px] border border-border">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-[12px] bg-page flex items-center justify-center text-text-main">
                  <Calendar size={20} />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-text-main">Timeline & Status</h2>
                  <p className="text-[12px] font-medium text-text-subtle">Set the schedule and current state.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Start Date">
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={e => set('startDate', e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Deadline">
                  <input
                    type="date"
                    value={form.deadline}
                    onChange={e => set('deadline', e.target.value)}
                    className={inputCls}
                  />
                </Field>
              </div>
            </div>

            {/* Priority & Status */}
            <div className="bg-card p-6 rounded-[20px] border border-border">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-[12px] bg-page flex items-center justify-center text-text-main">
                  <Flag size={20} />
                </div>
                <div>
                  <h2 className="text-[15px] font-bold text-text-main">Priority & Status</h2>
                  <p className="text-[12px] font-medium text-text-subtle">Set importance level and current status.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Priority">
                  <div className="relative">
                    <select value={form.priority} onChange={e => set('priority', e.target.value)} className={selectCls}>
                      {['High', 'Medium', 'Low'].map(p => <option key={p}>{p}</option>)}
                    </select>
                    <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-subtle pointer-events-none" />
                  </div>
                </Field>
                <Field label="Status">
                  <div className="relative">
                    <select value={form.status} onChange={e => set('status', e.target.value)} className={selectCls}>
                      {['Planning', 'In Progress', 'Pending', 'On Hold', 'Completed'].map(s => <option key={s}>{s}</option>)}
                    </select>
                    <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-text-subtle pointer-events-none" />
                  </div>
                </Field>
              </div>
            </div>
          </div>

          {/* Right: Live Preview ─────────────────────────────────── */}
          <div className="space-y-5">
            <p className="text-[12px] font-bold text-text-subtle uppercase tracking-wider px-1">Live Preview</p>

            <div className="bg-card p-5 rounded-[20px] border border-border flex flex-col shadow-sm">
              <div className="flex justify-between items-start mb-0.5">
                <h3 className="text-[18px] font-bold text-text-main tracking-tight truncate max-w-[180px]">
                  {form.name || 'Project Name'}
                </h3>
                <span className={`px-3 py-1 rounded-full text-[12px] font-semibold shrink-0 ${getStatusStyle(form.status)}`}>
                  {form.status}
                </span>
              </div>

              <p className="text-[14px] text-text-muted mb-3 truncate">
                {form.description || 'Project description will appear here...'}
              </p>

              <div className="flex items-center gap-2 mb-3 text-[14px] text-text-muted">
                <Calendar size={15} className="text-text-muted" />
                <span className="font-medium text-text-main">Deadline:</span>
                <span>{form.deadline || '—'}</span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 bg-page rounded-full h-[6px]">
                  <div className="bg-primary h-full rounded-full transition-all duration-700" style={{ width: `${form.progress}%` }} />
                </div>
                <span className="text-[14px] font-bold text-text-main shrink-0">{form.progress}%</span>
              </div>

              <div className="flex items-center justify-between mb-4 border-b border-border pb-4">
                <div className="text-[12px] font-medium text-text-muted">20 tasks</div>
                <div className="text-[12px] font-medium text-text-muted text-right">75 activities</div>
              </div>

              <div className="grid grid-cols-2 gap-y-3">
                <div>
                  <p className="text-[13px] text-text-muted mb-0.5">Start Date</p>
                  <p className="text-[15px] font-bold text-text-main">{form.startDate || '—'}</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] text-text-muted mb-0.5">Priority</p>
                  <div className="flex justify-end">
                    <span className={`px-4 py-1.5 rounded-full text-[13px] font-bold ${getPriorityStyle(form.priority)}`}>
                      {form.priority}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger zone */}
            <div className="bg-card p-5 rounded-[20px] border border-rose-500/20">
              <p className="text-[13px] font-bold text-rose-600 mb-3">Danger Zone</p>
              <button className="w-full px-4 py-2.5 rounded-full text-[13px] font-semibold text-rose-600 border border-rose-500/30 hover:bg-rose-500/10 transition-colors">
                Delete Project
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditProject;
