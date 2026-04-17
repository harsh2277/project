import React, { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import {
  ChevronLeft, ChevronRight, Download, Check,
  FolderDot, Clock, TrendingUp, CalendarDays,
  CheckCircle2, AlertCircle, ChevronDown, Search,
  FileText, MoreHorizontal, X, Filter
} from 'lucide-react';

/* ─── Types ──────────────────────────────────────────────────── */
interface TimesheetRow {
  id: number;
  project: string;
  task: string;
  color: {
    dot: string;
    bg: string;
    text: string;
  };
  hours: Record<string, string>;
}

/* ─── Data ───────────────────────────────────────────────────── */
const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WEEK_DATES = ['Sept 8', 'Sept 8', 'Sept 8', 'Sept 8', 'Sept 8', 'Sept 8', 'Sept 8'];

const INITIAL_ROWS: TimesheetRow[] = [
  {
    id: 1,
    project: 'Adventure',
    task: 'Project Management',
    color: { dot: 'bg-primary', bg: 'bg-primary/10', text: 'text-primary' },
    hours: { Sun: '04:00:15', Mon: '', Tue: '04:00:15', Wed: '', Thu: '04:00:15', Fri: '04:00:15', Sat: '' }
  },
  {
    id: 2,
    project: 'Skincare',
    task: 'Frontend Development',
    color: { dot: 'bg-emerald-500', bg: 'bg-emerald-500/10', text: 'text-emerald-600' },
    hours: { Sun: '', Mon: '04:00:15', Tue: '', Wed: '', Thu: '', Fri: '', Sat: '04:00:15' }
  },
  {
    id: 3,
    project: 'Time Tracker',
    task: 'Backend API',
    color: { dot: 'bg-primary', bg: 'bg-primary/10', text: 'text-primary' },
    hours: { Sun: '', Mon: '', Tue: '', Wed: '04:00:15', Thu: '', Fri: '', Sat: '' }
  },
  {
    id: 4,
    project: 'Shoes App',
    task: 'Mobile App Design',
    color: { dot: 'bg-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-600' },
    hours: { Sun: '', Mon: '', Tue: '', Wed: '04:00:15', Thu: '', Fri: '', Sat: '' }
  },
];

const PROJECTS = ['All', 'Adventure', 'Skincare', 'Time Tracker', 'Shoes App'];

/* ─── Helpers ────────────────────────────────────────────────── */
const rowTotal = (r: TimesheetRow) => {
  // Simple concatenation or just returning the same time for now as in the image
  return '04:00:15';
};

/* ─── Page ───────────────────────────────────────────────────── */
const TimesheetPage: React.FC = () => {
  const [rows, setRows] = useState<TimesheetRow[]>(INITIAL_ROWS);
  const [weekOffset, setWeekOffset] = useState(0);
  const [filterProject, setFilterProject] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = rows.filter(r => {
    const byProject = filterProject === 'All' || r.project === filterProject;
    const bySearch = !search || r.task.toLowerCase().includes(search.toLowerCase()) || r.project.toLowerCase().includes(search.toLowerCase());
    return byProject && bySearch;
  });

  return (
    <Layout>
      <div className="space-y-6 pb-10">

        {/* ── Page Header ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-[22px] font-bold text-text-main tracking-tight">Timesheet</h1>
            <p className="text-[13px] text-text-muted font-medium mt-0.5">Weekly log of hours across all projects</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-full text-[13px] font-semibold text-text-muted hover:bg-page transition-all shadow-sm">
              <Download size={15} /> Export
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full text-[13px] font-semibold hover:bg-primary-hover transition-all shadow-sm">
              <Check size={15} /> Submit Today's work
            </button>
          </div>
        </div>

        {/* ── Summary Cards ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Hours', value: '42h', sub: 'logged this week', icon: <Clock size={18} />, color: 'bg-primary/10 text-primary' },
            { label: 'Approved', value: '36h', sub: 'confirmed hours', icon: <CheckCircle2 size={18} />, color: 'bg-emerald-500/10 text-emerald-600' },
            { label: 'Pending', value: '6h', sub: 'awaiting review', icon: <AlertCircle size={18} />, color: 'bg-amber-500/10 text-amber-600' },
            { label: 'Goal Progress', value: '85%', sub: 'of 40h weekly target', icon: <Clock size={18} />, color: 'bg-primary/10 text-primary' },
          ].map(c => (
            <div key={c.label} className="bg-card p-6 rounded-[24px] border border-border hover:shadow-lg transition-all duration-300">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${c.color}`}>
                {c.icon}
              </div>
              <p className="text-[24px] font-bold text-text-main leading-none">{c.value}</p>
              <p className="text-[14px] font-semibold text-text-main mt-2">{c.label}</p>
              <p className="text-[12px] text-text-muted mt-1">{c.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Timesheet Table ── */}
        <div className="bg-card rounded-[24px] border border-border overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-border rounded-full overflow-hidden bg-page">
                <button onClick={() => setWeekOffset(w => w - 1)} className="p-2 hover:bg-card text-text-muted transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <span className="px-4 text-[13px] font-bold text-text-main">
                  {weekOffset === 0 ? 'This Week' : weekOffset === -1 ? 'Last Week' : `${Math.abs(weekOffset)}w ago`}
                </span>
                <button onClick={() => setWeekOffset(w => w + 1)} className="p-2 hover:bg-card text-text-muted transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
              <span className="text-[12px] text-text-muted font-medium">Apr 13 – Apr 19</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  className="pl-9 pr-8 py-2 bg-transparent border border-transparent rounded-full text-[13px] font-medium text-text-main placeholder:text-text-muted outline-none w-44 focus:bg-card focus:border-border transition-all"
                  style={{ background: 'transparent' }}
                  placeholder="Search..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <div className="relative">
                <FolderDot size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                <select
                  className="pl-8 pr-7 py-2 bg-page border border-transparent rounded-full text-[13px] font-semibold text-text-main outline-none appearance-none cursor-pointer focus:bg-card focus:border-border transition-all"
                  value={filterProject}
                  onChange={e => setFilterProject(e.target.value)}
                >
                  {PROJECTS.map(p => <option key={p}>{p}</option>)}
                </select>
                <ChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-6 text-[15px] font-bold text-text-main min-w-[200px] border-r border-border">Projects</th>
                  {WEEK_DAYS.map((d, i) => (
                    <th key={d} className="px-4 py-4 border-r border-border min-w-[120px]">
                      <div className="text-[15px] font-bold text-text-main">{d}</div>
                      <div className="text-[12px] text-text-muted font-medium mt-1">{WEEK_DATES[i]}</div>
                    </th>
                  ))}
                  <th className="px-6 py-6 text-[15px] font-bold text-text-main min-w-[140px]">Total Time</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border hover:bg-page transition-colors"
                  >
                    {/* Projects Column */}
                    <td className="px-6 py-6 border-r border-border text-left">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${row.color.bg}`}>
                        <div className={`w-2 h-2 rounded-full ${row.color.dot}`} />
                        <span className={`text-[14px] font-bold ${row.color.text}`}>{row.project}</span>
                      </div>
                    </td>

                    {/* Day cells */}
                    {WEEK_DAYS.map(day => {
                      const time = row.hours[day];
                      return (
                        <td key={day} className="px-4 py-6 border-r border-border">
                          {time && (
                            <div className="inline-flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-xl shadow-sm">
                              <Clock size={14} className="text-text-muted" />
                              <span className="text-[13px] font-bold text-text-main">{time}</span>
                            </div>
                          )}
                        </td>
                      );
                    })}

                    {/* Total Time Column */}
                    <td className="px-6 py-6">
                      <span className="text-[15px] font-bold text-text-main">{rowTotal(row)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* View All Footer */}
          <div className="flex justify-end p-6 bg-card">
            <button className="text-[15px] font-bold text-text-main hover:opacity-70 transition-opacity">
              View All
            </button>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default TimesheetPage;
