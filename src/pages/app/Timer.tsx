import React, { useState, useEffect, useRef } from 'react';
import { Layout } from '../../components/layout/Layout';
import {
  Play, Pause, Square, FolderDot,
  CheckSquare, ChevronDown, Plus, Trash2, MoreHorizontal, X,
  CalendarDays, TrendingUp, Zap, Timer as TimerIcon, RotateCw, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Types ──────────────────────────────────────────────────── */
type EntryStatus = 'Complete' | 'Pending';

interface TimeEntry {
  id: number;
  project: string;
  task: string;
  description: string;
  duration: string;   // HH:MM:SS
  date: string;
  startTime: string;
  endTime: string;
  status: EntryStatus;
  color: string;
}

/* ─── Mock Data ───────────────────────────────────────────────── */
const MOCK_ENTRIES: TimeEntry[] = [
  { id: 1, project: 'Figma Design System', task: 'Component Audit', description: 'Reviewing button variants & tokens', duration: '01:30:00', date: 'Today', startTime: '09:00 AM', endTime: '10:30 AM', status: 'Complete', color: 'bg-primary' },
  { id: 2, project: 'BoostVibe 2.0', task: 'API Integration', description: 'Connecting payment gateway', duration: '02:15:00', date: 'Today', startTime: '11:00 AM', endTime: '01:15 PM', status: 'Pending', color: 'bg-primary' },
  { id: 3, project: 'ProService Desk', task: 'Layout Fixes', description: 'Mobile responsiveness', duration: '01:00:00', date: 'Yesterday', startTime: '03:00 PM', endTime: '04:00 PM', status: 'Complete', color: 'bg-emerald-500' },
  { id: 4, project: 'Figma Design System', task: 'Dark Mode', description: 'CSS variable mapping', duration: '00:45:00', date: 'Yesterday', startTime: '10:00 AM', endTime: '10:45 AM', status: 'Pending', color: 'bg-primary' },
];

const PROJECTS = ['Figma Design System', 'BoostVibe 2.0', 'ProService Desk', 'Internal Admin'];
const TASKS: Record<string, string[]> = {
  'Figma Design System': ['Component Audit', 'Dark Mode', 'Token Export', 'Documentation'],
  'BoostVibe 2.0': ['API Integration', 'Homepage Hero', 'Onboarding Flow', 'Accessibility'],
  'ProService Desk': ['Layout Fixes', 'Performance Audit', 'Database Review', 'QA Testing'],
  'Internal Admin': ['Dashboard Setup', 'User Management', 'Reports'],
};

const inputCls = "w-full px-4 py-2.5 bg-page border border-transparent rounded-[12px] focus:bg-card focus:border-primary focus:ring-2 focus:ring-primary/5 transition-all text-[13px] font-medium text-text-main placeholder:text-text-muted outline-none";
const selectCls = inputCls + " appearance-none cursor-pointer";

const projectColors: Record<string, string> = {
  'Figma Design System': 'bg-primary',
  'BoostVibe 2.0': 'bg-primary',
  'ProService Desk': 'bg-emerald-500',
  'Internal Admin': 'bg-amber-500',
};

/* ─── Helpers ─────────────────────────────────────────────────── */
const formatTime = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

const formatClockTime = (date: Date) =>
  date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const totalSeconds = (dur: string) => {
  const [h, m, s] = dur.split(':').map(Number);
  return h * 3600 + m * 60 + s;
};

const todayTotal = MOCK_ENTRIES.filter(e => e.date === 'Today').reduce((acc, e) => acc + totalSeconds(e.duration), 0);

/* ─── Timer Page ──────────────────────────────────────────────── */
const TimerPage: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [project, setProject] = useState(PROJECTS[0]);
  const [task, setTask] = useState(TASKS[PROJECTS[0]][0]);
  const [description, setDescription] = useState('');
  const [entries, setEntries] = useState<TimeEntry[]>(MOCK_ENTRIES);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [showStopModal, setShowStopModal] = useState(false);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [stopDraft, setStopDraft] = useState<{
    project: string;
    task: string;
    description: string;
    duration: string;
    startTime: string;
    endTime: string;
    status: EntryStatus;
    color: string;
  } | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => setElapsed(p => p + 1), 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, isPaused]);

  const handleStart = () => {
    setStartedAt(new Date());
    setIsRunning(true);
    setIsPaused(false);
  };
  const handlePause = () => setIsPaused(true);
  const handleResume = () => setIsPaused(false);
  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    const end = new Date();
    const start = startedAt ?? new Date(Date.now() - elapsed * 1000);
    setStopDraft({
      project,
      task,
      description: description || '',
      duration: formatTime(elapsed),
      startTime: formatClockTime(start),
      endTime: formatClockTime(end),
      status: 'Complete',
      color: projectColors[project] || 'bg-page0',
    });
    setShowStopModal(true);
  };
  const handleDelete = (id: number) => setEntries(prev => prev.filter(e => e.id !== id));
  const handleContinue = (entry: TimeEntry) => {
    setProject(entry.project);
    setTask(entry.task);
    setDescription(entry.description === 'No description' ? '' : entry.description);
    setElapsed(totalSeconds(entry.duration)); // ← resume from existing time
    setStartedAt(new Date(Date.now() - totalSeconds(entry.duration) * 1000));
    setIsRunning(true);
    setIsPaused(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleConfirmStop = (draft: NonNullable<typeof stopDraft>) => {
    const newEntry: TimeEntry = {
      id: Date.now(),
      project: draft.project,
      task: draft.task,
      description: draft.description || 'No description',
      duration: draft.duration,
      date: 'Today',
      startTime: draft.startTime,
      endTime: draft.endTime,
      status: draft.status,
      color: draft.color,
    };
    setEntries((prev) => [newEntry, ...prev]);
    setElapsed(0);
    setStartedAt(null);
    setDescription('');
    setShowStopModal(false);
    setStopDraft(null);
  };
  const handleCloseStopModal = () => {
    setShowStopModal(false);
    setStopDraft(null);
    setElapsed(0);
    setStartedAt(null);
    setDescription('');
  };

  const progress = Math.min((elapsed / 3600) * 100, 100);
  const circumference = 2 * Math.PI * 110;

  return (
    <Layout>
      <div className="space-y-6 pb-8">
        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[22px] font-bold text-text-main tracking-tight">Time Tracker</h1>
            <p className="text-[13px] font-medium text-text-muted mt-0.5">Track your working hours across projects</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-card border border-border rounded-2xl px-5 py-3 flex items-center gap-3 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <TrendingUp size={15} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Today</p>
                <p className="text-[15px] font-black text-text-main leading-none">{formatTime(todayTotal)}</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl px-5 py-3 flex items-center gap-3 shadow-sm">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <CalendarDays size={15} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">This Week</p>
                <p className="text-[15px] font-black text-text-main leading-none">28h 40m</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Main Content: Timer  +  Log ── */}
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_380px] gap-6">

          {/* ── Left: Active Timer Card ── */}
          <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
            {/* Card Header bar */}
            <div className="px-8 pt-7 pb-5 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className={`w-2.5 h-2.5 rounded-full ${isRunning && !isPaused ? 'bg-emerald-500 animate-pulse' : 'bg-page'}`} />
                <span className="text-[13px] font-bold text-text-main">
                  {!isRunning ? 'Ready to Track' : isPaused ? 'Paused' : 'Tracking Now'}
                </span>
              </div>
              <span className="text-[12px] font-semibold text-text-muted">
                {new Date().toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>

            {/* Clock + Controls */}
            <div className="flex flex-col items-center px-8 py-10">
              {/* Ring Clock */}
              <div className="relative w-64 h-64 mb-10">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[12px] font-bold text-text-muted uppercase tracking-[0.2em] mb-1">Elapsed</span>
                  <span className={`text-[4rem] font-black font-mono leading-none tracking-tight ${isRunning && !isPaused ? 'text-text-main' : 'text-text-muted'}`}>
                    {formatTime(elapsed)}
                  </span>
                </div>
              </div>

              {/* Controls Row */}
              <div className="flex items-center gap-3 mb-10">
                {!isRunning ? (
                  <button
                    onClick={handleStart}
                    className="flex items-center gap-2.5 px-8 py-3.5 bg-primary text-white rounded-full text-[14px] font-bold hover:bg-primary-hover transition-all shadow-lg shadow-black/10 hover:-translate-y-0.5"
                  >
                    <Play size={16} fill="white" /> Start Timer
                  </button>
                ) : (
                  <>
                    <button
                      onClick={isPaused ? handleResume : handlePause}
                      className={`flex items-center gap-2.5 px-7 py-3.5 rounded-full text-[14px] font-bold transition-all hover:-translate-y-0.5 ${isPaused
                        ? 'bg-primary text-white shadow-lg shadow-black/10'
                        : 'bg-page text-text-main'
                        }`}
                    >
                      {isPaused ? <><Play size={15} fill="currentColor" /> Continue</> : <><Pause size={15} /> Pause</>}
                    </button>
                    <button
                      onClick={handleStop}
                      className="flex items-center gap-2.5 px-7 py-3.5 bg-rose-500/10 text-rose-600 rounded-full text-[14px] font-bold hover:bg-rose-500/20 transition-all hover:-translate-y-0.5"
                    >
                      <Square size={15} fill="currentColor" /> Stop
                    </button>
                  </>
                )}
              </div>

              {/* Project / Task / Description form */}
              <div className="w-full max-w-lg space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1.5">Project</label>
                    <div className="relative">
                      <FolderDot size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                      <select
                        className={selectCls + " pl-9 text-[13px]"}
                        value={project}
                        onChange={e => { setProject(e.target.value); setTask(TASKS[e.target.value][0]); }}
                      >
                        {PROJECTS.map(p => <option key={p}>{p}</option>)}
                      </select>
                      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1.5">Task</label>
                    <div className="relative">
                      <CheckSquare size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                      <select
                        className={selectCls + " pl-9 text-[13px]"}
                        value={task}
                        onChange={e => setTask(e.target.value)}
                      >
                        {(TASKS[project] || []).map(t => <option key={t}>{t}</option>)}
                      </select>
                      <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-text-muted uppercase tracking-wider mb-1.5">What are you working on?</label>
                  <input
                    className={inputCls}
                    placeholder="Add a description..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: Today's Breakdown Sidebar ── */}
          <div className="flex flex-col gap-5">
            {/* Mini stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Entries Today', value: entries.filter(e => e.date === 'Today').length.toString(), icon: <TimerIcon size={15} />, color: 'bg-primary/10 text-primary' },
                { label: 'Avg Per Entry', value: '1h 22m', icon: <Zap size={15} />, color: 'bg-amber-100 text-amber-600' },
              ].map(stat => (
                <div key={stat.label} className="bg-card rounded-2xl border border-border p-4 shadow-sm">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>{stat.icon}</div>
                  <p className="text-[18px] font-black text-text-main">{stat.value}</p>
                  <p className="text-[11px] font-bold text-text-muted mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Weekly bar chart */}
            <div className="bg-card rounded-3xl border border-border p-6 shadow-sm">
              <p className="text-[12px] font-bold text-text-muted uppercase tracking-wider mb-4">This Week</p>
              <div className="flex items-end gap-2" style={{ height: 80 }}>
                {[{ d: 'M', h: 6.5 }, { d: 'T', h: 8 }, { d: 'W', h: 7 }, { d: 'T', h: 4.5 }, { d: 'F', h: 3 }, { d: 'S', h: 1.5 }, { d: 'S', h: 0 }].map((item, i) => {
                  const maxH = 8;
                  const barH = Math.max(item.h / maxH * 60, item.h === 0 ? 4 : 6);
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: barH }}
                        transition={{ delay: i * 0.06, duration: 0.5, ease: 'easeOut' }}
                        className={`w-full rounded-t-md ${item.h === 0 ? 'bg-page' : 'bg-primary'}`}
                        style={{ minHeight: 4 }}
                      />
                      <span className="text-[10px] font-bold text-text-muted">{item.d}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Project breakdown */}
            <div className="bg-card rounded-3xl border border-border p-6 shadow-sm flex-1">
              <p className="text-[12px] font-bold text-text-muted uppercase tracking-wider mb-4">By Project</p>
              <div className="space-y-3.5">
                {[
                  { name: 'Figma Design System', hours: 12.5, color: 'bg-primary' },
                  { name: 'BoostVibe 2.0', hours: 9, color: 'bg-primary' },
                  { name: 'ProService Desk', hours: 7, color: 'bg-emerald-500' },
                ].map(p => (
                  <div key={p.name}>
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[12px] font-semibold text-text-muted">{p.name}</span>
                      <span className="text-[12px] font-bold text-text-main">{p.hours}h</span>
                    </div>
                    <div className="w-full h-1.5 bg-page rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(p.hours / 28.5) * 100}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${p.color}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Time Log Table ── */}
        <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
          <div className="px-7 py-5 border-b border-border flex items-center justify-between">
            <div>
              <h2 className="text-[15px] font-bold text-text-main">Time Log</h2>
              <p className="text-[12px] font-medium text-text-muted mt-0.5">{entries.length} entries recorded</p>
            </div>
            <button
              onClick={() => setShowNewEntry(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-full text-[13px] font-semibold hover:bg-primary-hover transition-colors"
            >
              <Plus size={15} /> Add Manual Entry
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-page border-b border-border">
                  {['Project', 'Task', 'Status', 'Description', 'Date', 'Start', 'End', 'Duration', '', ''].map((h, i) => (
                    <th key={i} className="px-6 py-3.5 text-left text-[11px] font-bold text-text-muted uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {entries.map((entry, i) => (
                    <motion.tr
                      key={entry.id}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 40 }}
                      transition={{ delay: i * 0.03 }}
                      className="border-b border-border hover:bg-page transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${entry.color}`} />
                          <span className="text-[13px] font-semibold text-text-main whitespace-nowrap">{entry.project}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[13px] font-medium text-text-main whitespace-nowrap">{entry.task}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold ${entry.status === 'Complete' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                          {entry.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[13px] text-text-muted max-w-[200px] truncate">{entry.description}</td>
                      <td className="px-6 py-4 text-[12px] font-semibold text-text-muted whitespace-nowrap">{entry.date}</td>
                      <td className="px-6 py-4 text-[12px] font-semibold text-text-main whitespace-nowrap">{entry.startTime}</td>
                      <td className="px-6 py-4 text-[12px] font-semibold text-text-main whitespace-nowrap">{entry.endTime}</td>
                      <td className="px-6 py-4">
                        <span className="text-[13px] font-black text-text-main font-mono">{entry.duration}</span>
                      </td>
                      <td className="px-3 py-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleContinue(entry)}
                          title="Continue this entry"
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-bold text-primary bg-primary/10 hover:bg-primary/20 transition-all whitespace-nowrap"
                        >
                          <RotateCw size={13} /> Continue
                        </button>
                      </td>
                      <td className="px-3 py-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleDelete(entry.id)}
                          title="Delete entry"
                          className="p-1.5 rounded-lg text-text-muted hover:text-rose-600 hover:bg-rose-500/10 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Manual Entry Modal */}
      <AnimatePresence>
        {showNewEntry && (
          <ManualEntryModal
            onClose={() => setShowNewEntry(false)}
            onAdd={(entry) => { setEntries(prev => [{ ...entry, id: Date.now() }, ...prev]); setShowNewEntry(false); }}
          />
        )}
        {showStopModal && stopDraft && (
          <StopTimerModal
            draft={stopDraft}
            onClose={handleCloseStopModal}
            onSave={handleConfirmStop}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
};

/* ─── Manual Entry Modal ──────────────────────────────────────── */
const ManualEntryModal = ({ onClose, onAdd }: { onClose: () => void; onAdd: (e: Omit<TimeEntry, 'id'>) => void }) => {
  const [form, setForm] = useState({
    project: PROJECTS[0], task: TASKS[PROJECTS[0]][0],
    description: '', date: 'Today',
    startTime: '09:00 AM', endTime: '10:00 AM', duration: '01:00:00',
    status: 'Complete' as EntryStatus,
    color: projectColors[PROJECTS[0]]
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.94, y: 10, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 10, opacity: 0 }}
        className="relative bg-card rounded-[24px] border border-border shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[12px] bg-primary text-white flex items-center justify-center">
              <Plus size={17} />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-text-main">Manual Entry</h2>
              <p className="text-[12px] font-medium text-text-muted">Log time manually for any task</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-text-muted hover:text-text-main hover:bg-page transition-all">
            <X size={18} />
          </button>
        </div>

        <div className="px-7 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-text-main mb-2">Project</label>
              <select className={selectCls} value={form.project} onChange={e => { set('project', e.target.value); set('task', TASKS[e.target.value][0]); set('color', projectColors[e.target.value]); }}>
                {PROJECTS.map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[12px] font-bold text-text-main mb-2">Task</label>
              <select className={selectCls} value={form.task} onChange={e => set('task', e.target.value)}>
                {(TASKS[form.project] || []).map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-text-main mb-2">Description</label>
            <input className={inputCls} placeholder="What did you work on?" value={form.description} onChange={e => set('description', e.target.value)} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[12px] font-bold text-text-main mb-2">Start Time</label>
              <input className={inputCls} placeholder="09:00 AM" value={form.startTime} onChange={e => set('startTime', e.target.value)} />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-text-main mb-2">End Time</label>
              <input className={inputCls} placeholder="10:00 AM" value={form.endTime} onChange={e => set('endTime', e.target.value)} />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-text-main mb-2">Duration</label>
              <input className={inputCls + " font-mono"} placeholder="01:00:00" value={form.duration} onChange={e => set('duration', e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-text-main mb-2">Status</label>
            <select className={selectCls} value={form.status} onChange={e => set('status', e.target.value)}>
              <option>Complete</option>
              <option>Pending</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between px-7 pb-7 pt-2">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full text-[14px] font-semibold text-text-muted border border-border hover:bg-page transition-colors">Cancel</button>
          <button
            onClick={() => onAdd(form)}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full text-[14px] font-semibold hover:bg-primary-hover transition-colors shadow-sm"
          >
            <Plus size={15} /> Add Entry
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const StopTimerModal = ({
  draft,
  onClose,
  onSave,
}: {
  draft: {
    project: string;
    task: string;
    description: string;
    duration: string;
    startTime: string;
    endTime: string;
    status: EntryStatus;
    color: string;
  };
  onClose: () => void;
  onSave: (draft: {
    project: string;
    task: string;
    description: string;
    duration: string;
    startTime: string;
    endTime: string;
    status: EntryStatus;
    color: string;
  }) => void;
}) => {
  const [form, setForm] = useState(draft);
  const set = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/25 backdrop-blur-sm" onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.94, y: 10, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 10, opacity: 0 }}
        className="relative bg-card rounded-[24px] border border-border shadow-2xl w-full max-w-xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-7 pt-7 pb-5 border-b border-border">
          <div>
            <h2 className="text-[17px] font-bold text-text-main">Save Timer Entry</h2>
            <p className="text-[12px] font-medium text-text-muted mt-1">Review the tracked session before adding it to the log.</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-text-muted hover:text-text-main hover:bg-page transition-all">
            <X size={18} />
          </button>
        </div>

        <div className="px-7 py-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[12px] font-bold text-text-main mb-2">Project</label>
              <input className={inputCls} value={form.project} readOnly />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-text-main mb-2">Task Name</label>
              <input className={inputCls} value={form.task} readOnly />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[12px] font-bold text-text-main mb-2">Start Time</label>
              <input className={inputCls} value={form.startTime} readOnly />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-text-main mb-2">End Time</label>
              <input className={inputCls} value={form.endTime} readOnly />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-text-main mb-2">Total Spent</label>
              <input className={inputCls + " font-mono"} value={form.duration} readOnly />
            </div>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-text-main mb-2">Status</label>
            <select className={selectCls} value={form.status} onChange={(e) => set('status', e.target.value)}>
              <option>Complete</option>
              <option>Pending</option>
            </select>
          </div>

          <div>
            <label className="block text-[12px] font-bold text-text-main mb-2">Description</label>
            <textarea
              rows={4}
              className={inputCls + " resize-none py-3"}
              placeholder="Write what you completed in this session..."
              value={form.description}
              onChange={(e) => set('description', e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-7 pb-7 pt-2">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full text-[14px] font-semibold text-text-muted border border-border hover:bg-page transition-colors">Cancel</button>
          <button
            onClick={() => onSave(form)}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full text-[14px] font-semibold hover:bg-primary-hover transition-colors shadow-sm"
          >
            <Check size={15} /> Save Entry
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default TimerPage;
