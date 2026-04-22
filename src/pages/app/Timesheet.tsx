import React, { useMemo, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import {
  ChevronLeft, ChevronRight, Download, Check,
  Clock, CalendarDays, CheckCircle2, AlertCircle, ChevronDown, Search,
  FolderDot, TrendingUp, TimerReset, Dot, ArrowUpRight,
  X, FileText, BadgeCheck, ChevronUp,
} from 'lucide-react';

type EntryStatus = 'Approved' | 'Pending' | 'Needs Review';

interface TimeEntry {
  id: number;
  date: string;
  day: string;
  timeRange: string;
  duration: string;
  project: string;
  task: string;
  details: string;
  fullMessage: string;
  collaborators: string[];
  status: EntryStatus;
  billable: boolean;
  color: {
    dot: string;
    bg: string;
    text: string;
  };
}

const WEEK_LABELS = ['Apr 13 - Apr 19', 'Apr 20 - Apr 26', 'Apr 27 - May 03'];

const INITIAL_ENTRIES: TimeEntry[] = [
  {
    id: 1,
    date: '2026-04-13',
    day: 'Monday',
    timeRange: '09:00 AM - 11:30 AM',
    duration: '02h 30m',
    project: 'Figma Design System',
    task: 'Component Audit',
    details: 'Reviewed button states, spacing tokens, and table styles for handoff consistency.',
    fullMessage: 'Reviewed all primary and secondary button states, verified spacing tokens against the latest design system rules, checked hover and disabled treatments, and aligned the table action patterns so engineering handoff stays consistent across dashboard modules.',
    collaborators: ['Alex Lee', 'Mia Johnson'],
    status: 'Approved',
    billable: true,
    color: { dot: 'bg-primary', bg: 'bg-primary/10', text: 'text-primary' },
  },
  {
    id: 2,
    date: '2026-04-13',
    day: 'Monday',
    timeRange: '12:15 PM - 03:00 PM',
    duration: '02h 45m',
    project: 'BoostVibe 2.0',
    task: 'API Integration',
    details: 'Connected payment status states in the frontend and tested retry handling flows.',
    fullMessage: 'Connected payment status UI states in the frontend, mapped success, failed, and retry conditions, validated loader transitions during retries, and tested error handling flows with mocked gateway responses to confirm edge cases were covered.',
    collaborators: ['Sarah Kim', 'Rohan Patel'],
    status: 'Pending',
    billable: true,
    color: { dot: 'bg-emerald-500', bg: 'bg-emerald-500/10', text: 'text-emerald-600' },
  },
  {
    id: 3,
    date: '2026-04-14',
    day: 'Tuesday',
    timeRange: '09:30 AM - 12:00 PM',
    duration: '02h 30m',
    project: 'ProService Desk',
    task: 'Responsive Testing',
    details: 'Validated dashboard layouts on tablet and small desktop breakpoints.',
    fullMessage: 'Validated dashboard layouts on tablet and compact desktop breakpoints, checked header wrapping, KPI alignment, and table overflow behavior, and documented spacing issues that need polish before release.',
    collaborators: ['Tony Moore'],
    status: 'Approved',
    billable: false,
    color: { dot: 'bg-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-600' },
  },
  {
    id: 4,
    date: '2026-04-14',
    day: 'Tuesday',
    timeRange: '01:00 PM - 04:15 PM',
    duration: '03h 15m',
    project: 'Figma Design System',
    task: 'Dark Mode Implementation',
    details: 'Mapped semantic tokens and verified contrast for nav, cards, and data views.',
    fullMessage: 'Mapped semantic dark mode tokens to navigation, cards, filters, and data-heavy views, verified contrast ratios for core surfaces, and prepared a follow-up checklist for a11y review across chart and badge components.',
    collaborators: ['Alex Lee', 'Neha Singh'],
    status: 'Approved',
    billable: true,
    color: { dot: 'bg-primary', bg: 'bg-primary/10', text: 'text-primary' },
  },
  {
    id: 5,
    date: '2026-04-15',
    day: 'Wednesday',
    timeRange: '10:00 AM - 12:30 PM',
    duration: '02h 30m',
    project: 'BoostVibe 2.0',
    task: 'Onboarding Flow Redesign',
    details: 'Restructured first-run screens and simplified copy for lower drop-off.',
    fullMessage: 'Restructured the first-run onboarding screens, simplified instructional copy, cleaned the step hierarchy, and reviewed friction points in the sign-up-to-activation flow to reduce expected user drop-off.',
    collaborators: ['Sarah Kim', 'Ankit Shah'],
    status: 'Needs Review',
    billable: true,
    color: { dot: 'bg-emerald-500', bg: 'bg-emerald-500/10', text: 'text-emerald-600' },
  },
  {
    id: 6,
    date: '2026-04-15',
    day: 'Wednesday',
    timeRange: '02:00 PM - 05:00 PM',
    duration: '03h 00m',
    project: 'ProService Desk',
    task: 'Content Model Review',
    details: 'Reviewed frontend data shape and cleaned up redundant properties in dashboard cards.',
    fullMessage: 'Reviewed the frontend data model used across dashboard cards, removed redundant field usage in mock payloads, and listed the component props that should be normalized before broader reuse in the project.',
    collaborators: ['Tony Moore', 'Priya Nair'],
    status: 'Pending',
    billable: false,
    color: { dot: 'bg-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-600' },
  },
  {
    id: 7,
    date: '2026-04-16',
    day: 'Thursday',
    timeRange: '09:15 AM - 11:45 AM',
    duration: '02h 30m',
    project: 'Shoes App',
    task: 'Mobile App Design',
    details: 'Refined checkout flow layouts and updated spacing rhythm for mobile screens.',
    fullMessage: 'Refined mobile checkout flow layouts, adjusted spacing rhythm between cart summary and address steps, improved CTA grouping, and tuned card padding to better match the visual system on smaller screens.',
    collaborators: ['Mia Johnson'],
    status: 'Approved',
    billable: true,
    color: { dot: 'bg-violet-500', bg: 'bg-violet-500/10', text: 'text-violet-600' },
  },
  {
    id: 8,
    date: '2026-04-16',
    day: 'Thursday',
    timeRange: '12:30 PM - 03:30 PM',
    duration: '03h 00m',
    project: 'Figma Design System',
    task: 'Documentation Pass',
    details: 'Documented card patterns, icon usage rules, and interaction guidance for the team.',
    fullMessage: 'Documented reusable card patterns, standardized icon usage rules, and wrote interaction guidance for hover, focus, and empty states so product and frontend teams can implement the same behavior consistently.',
    collaborators: ['Neha Singh', 'Rohan Patel'],
    status: 'Approved',
    billable: true,
    color: { dot: 'bg-primary', bg: 'bg-primary/10', text: 'text-primary' },
  },
  {
    id: 9,
    date: '2026-04-17',
    day: 'Friday',
    timeRange: '09:00 AM - 12:00 PM',
    duration: '03h 00m',
    project: 'BoostVibe 2.0',
    task: 'Accessibility Audit',
    details: 'Checked keyboard flow, focus states, and label structure across marketing pages.',
    fullMessage: 'Checked keyboard flow, focus visibility, semantic labeling, and section heading structure across key marketing pages, then captured issues affecting accessibility before launch review.',
    collaborators: ['Ankit Shah', 'Sarah Kim'],
    status: 'Pending',
    billable: true,
    color: { dot: 'bg-emerald-500', bg: 'bg-emerald-500/10', text: 'text-emerald-600' },
  },
  {
    id: 10,
    date: '2026-04-17',
    day: 'Friday',
    timeRange: '01:30 PM - 04:00 PM',
    duration: '02h 30m',
    project: 'ProService Desk',
    task: 'Release Notes',
    details: 'Prepared internal changelog summary and categorized fixes for stakeholder review.',
    fullMessage: 'Prepared the internal changelog summary, grouped fixes by area, aligned wording for stakeholder review, and captured open items that still need confirmation from design and QA.',
    collaborators: ['Tony Moore'],
    status: 'Approved',
    billable: false,
    color: { dot: 'bg-amber-500', bg: 'bg-amber-500/10', text: 'text-amber-600' },
  },
];

const PROJECTS = ['All Projects', 'Figma Design System', 'BoostVibe 2.0', 'ProService Desk', 'Shoes App'];
const STATUS_FILTERS: Array<'All Status' | EntryStatus> = ['All Status', 'Approved', 'Pending', 'Needs Review'];

const parseDurationToMinutes = (duration: string) => {
  const match = duration.match(/(?:(\d+)h)?\s*(?:(\d+)m)?/i);
  if (!match) return 0;
  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  return hours * 60 + minutes;
};

const formatMinutes = (minutes: number) => {
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hrs}h ${String(mins).padStart(2, '0')}m`;
};

const formatDateLabel = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const statusBadge = (status: EntryStatus) => {
  switch (status) {
    case 'Approved':
      return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    case 'Pending':
      return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    case 'Needs Review':
      return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
    default:
      return 'bg-page text-text-muted border-border';
  }
};

const TimesheetDetailModal = ({
  entry,
  onClose,
}: {
  entry: TimeEntry;
  onClose: () => void;
}) => (
  <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
    <div className="absolute inset-0 bg-black/35 backdrop-blur-sm" onClick={onClose} />
    <div className="relative w-full max-w-3xl rounded-[28px] border border-border bg-card shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-6 py-5 border-b border-border">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${entry.color.bg}`}>
              <span className={`w-2 h-2 rounded-full ${entry.color.dot}`} />
              <span className={`text-[12px] font-bold ${entry.color.text}`}>{entry.project}</span>
            </span>
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[12px] font-bold ${statusBadge(entry.status)}`}>
              <BadgeCheck size={12} />
              {entry.status}
            </span>
          </div>
          <h2 className="text-[22px] font-bold text-text-main">{entry.task}</h2>
          <p className="text-[13px] text-text-muted mt-1">{entry.day}, {formatDateLabel(entry.date)} · {entry.timeRange}</p>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full border border-border bg-page text-text-muted hover:text-text-main hover:bg-card transition-colors flex items-center justify-center"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="rounded-[18px] border border-border bg-page px-4 py-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Tracked Time</p>
            <p className="text-[15px] font-semibold text-text-main mt-2">{entry.duration}</p>
          </div>
          <div className="rounded-[18px] border border-border bg-page px-4 py-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Work Slot</p>
            <p className="text-[15px] font-semibold text-text-main mt-2">{entry.timeRange}</p>
          </div>
          <div className="rounded-[18px] border border-border bg-page px-4 py-4">
            <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Date</p>
            <p className="text-[15px] font-semibold text-text-main mt-2">{formatDateLabel(entry.date)}</p>
          </div>
        </div>

        <div className="rounded-[22px] border border-border bg-page p-5">
          <div className="flex items-center gap-2 mb-3">
            <FileText size={16} className="text-text-muted" />
            <h3 className="text-[15px] font-bold text-text-main">Complete Work Message</h3>
          </div>
          <p className="text-[14px] leading-7 text-text-main">{entry.fullMessage}</p>
        </div>
      </div>
    </div>
  </div>
);

const TimesheetPage: React.FC = () => {
  const [entries] = useState<TimeEntry[]>(INITIAL_ENTRIES);
  const [weekOffset, setWeekOffset] = useState(0);
  const [filterProject, setFilterProject] = useState('All Projects');
  const [statusFilter, setStatusFilter] = useState<'All Status' | EntryStatus>('All Status');
  const [search, setSearch] = useState('');
  const [activeEntry, setActiveEntry] = useState<TimeEntry | null>(null);
  const [collapsedDays, setCollapsedDays] = useState<Record<string, boolean>>({});

  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesProject = filterProject === 'All Projects' || entry.project === filterProject;
      const matchesStatus = statusFilter === 'All Status' || entry.status === statusFilter;
      const query = search.trim().toLowerCase();
      const matchesSearch =
        !query ||
        entry.project.toLowerCase().includes(query) ||
        entry.task.toLowerCase().includes(query) ||
        entry.details.toLowerCase().includes(query) ||
        entry.day.toLowerCase().includes(query);

      return matchesProject && matchesStatus && matchesSearch;
    });
  }, [entries, filterProject, search, statusFilter]);

  const groupedByDay = useMemo(() => {
    const groups = new Map<
      string,
      { date: string; day: string; totalMinutes: number; entries: TimeEntry[] }
    >();

    filteredEntries.forEach((entry) => {
      const current = groups.get(entry.date);
      const minutes = parseDurationToMinutes(entry.duration);

      if (current) {
        current.entries.push(entry);
        current.totalMinutes += minutes;
        return;
      }

      groups.set(entry.date, {
        date: entry.date,
        day: entry.day,
        totalMinutes: minutes,
        entries: [entry],
      });
    });

    return Array.from(groups.values()).sort((a, b) => a.date.localeCompare(b.date));
  }, [filteredEntries]);

  const totalMinutes = filteredEntries.reduce((sum, entry) => sum + parseDurationToMinutes(entry.duration), 0);
  const approvedMinutes = filteredEntries
    .filter((entry) => entry.status === 'Approved')
    .reduce((sum, entry) => sum + parseDurationToMinutes(entry.duration), 0);
  const pendingMinutes = filteredEntries
    .filter((entry) => entry.status !== 'Approved')
    .reduce((sum, entry) => sum + parseDurationToMinutes(entry.duration), 0);
  const billableMinutes = filteredEntries
    .filter((entry) => entry.billable)
    .reduce((sum, entry) => sum + parseDurationToMinutes(entry.duration), 0);

  const projectBreakdown = useMemo(() => {
    const grouped = new Map<string, { minutes: number; tasks: Set<string>; color: TimeEntry['color'] }>();

    filteredEntries.forEach((entry) => {
      const current = grouped.get(entry.project);
      const minutes = parseDurationToMinutes(entry.duration);

      if (current) {
        current.minutes += minutes;
        current.tasks.add(entry.task);
        return;
      }

      grouped.set(entry.project, {
        minutes,
        tasks: new Set([entry.task]),
        color: entry.color,
      });
    });

    return Array.from(grouped.entries())
      .map(([project, value]) => ({
        project,
        minutes: value.minutes,
        taskCount: value.tasks.size,
        color: value.color,
      }))
      .sort((a, b) => b.minutes - a.minutes);
  }, [filteredEntries]);

  return (
    <Layout>
      <div className="space-y-6 pb-10">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-bold text-text-main tracking-tight">Timesheet</h1>
            <p className="text-[13px] text-text-muted font-medium mt-1">
              Review daily work logs with exact date, weekday, project, task, and tracked duration.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border rounded-full text-[13px] font-semibold text-text-muted hover:bg-page transition-all shadow-sm">
              <Download size={15} /> Export Report
            </button>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-full text-[13px] font-semibold hover:bg-primary-hover transition-all shadow-sm">
              <Check size={15} /> Submit Week
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            {
              label: 'Total Tracked',
              value: formatMinutes(totalMinutes),
              sub: `${filteredEntries.length} work logs in this view`,
              icon: <Clock size={18} />,
              color: 'bg-primary/10 text-primary',
            },
            {
              label: 'Approved Hours',
              value: formatMinutes(approvedMinutes),
              sub: 'already confirmed',
              icon: <CheckCircle2 size={18} />,
              color: 'bg-emerald-500/10 text-emerald-600',
            },
            {
              label: 'Pending Review',
              value: formatMinutes(pendingMinutes),
              sub: 'awaiting approval',
              icon: <AlertCircle size={18} />,
              color: 'bg-amber-500/10 text-amber-600',
            },
            {
              label: 'Billable Time',
              value: formatMinutes(billableMinutes),
              sub: 'client-facing work',
              icon: <TrendingUp size={18} />,
              color: 'bg-violet-500/10 text-violet-600',
            },
          ].map((card) => (
            <div key={card.label} className="bg-card p-6 rounded-[24px] border border-border hover:shadow-lg transition-all duration-300">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${card.color}`}>
                {card.icon}
              </div>
              <p className="text-[24px] font-bold text-text-main leading-none">{card.value}</p>
              <p className="text-[14px] font-semibold text-text-main mt-2">{card.label}</p>
              <p className="text-[12px] text-text-muted mt-1">{card.sub}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 2xl:grid-cols-[1.6fr_0.9fr] gap-6">
          <div className="bg-card rounded-[28px] border border-border overflow-hidden shadow-sm">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center border border-border rounded-full overflow-hidden bg-page">
                  <button
                    onClick={() => setWeekOffset((current) => Math.max(0, current - 1))}
                    className="p-2 hover:bg-card text-text-muted transition-colors disabled:opacity-40"
                    disabled={weekOffset === 0}
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="px-4 text-[13px] font-bold text-text-main">
                    {WEEK_LABELS[weekOffset] ?? WEEK_LABELS[0]}
                  </span>
                  <button
                    onClick={() => setWeekOffset((current) => Math.min(WEEK_LABELS.length - 1, current + 1))}
                    className="p-2 hover:bg-card text-text-muted transition-colors disabled:opacity-40"
                    disabled={weekOffset === WEEK_LABELS.length - 1}
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>

                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-page border border-border">
                  <CalendarDays size={14} className="text-text-muted" />
                  <span className="text-[12px] font-semibold text-text-main">Detailed daily work log</span>
                </div>
              </div>

              <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    className="pl-9 pr-4 py-2.5 bg-page border border-transparent rounded-full text-[13px] font-medium text-text-main placeholder:text-text-muted outline-none w-full lg:w-64 focus:bg-card focus:border-border transition-all"
                    placeholder="Search project, task, or notes..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <FolderDot size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  <select
                    className="pl-8 pr-7 py-2.5 bg-page border border-transparent rounded-full text-[13px] font-semibold text-text-main outline-none appearance-none cursor-pointer focus:bg-card focus:border-border transition-all w-full"
                    value={filterProject}
                    onChange={(e) => setFilterProject(e.target.value)}
                  >
                    {PROJECTS.map((project) => (
                      <option key={project}>{project}</option>
                    ))}
                  </select>
                  <ChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>

                <div className="relative">
                  <AlertCircle size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                  <select
                    className="pl-8 pr-7 py-2.5 bg-page border border-transparent rounded-full text-[13px] font-semibold text-text-main outline-none appearance-none cursor-pointer focus:bg-card focus:border-border transition-all w-full"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as 'All Status' | EntryStatus)}
                  >
                    {STATUS_FILTERS.map((status) => (
                      <option key={status}>{status}</option>
                    ))}
                  </select>
                  <ChevronDown size={11} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="px-6 py-5 space-y-5">
              {groupedByDay.length === 0 ? (
                <div className="rounded-[22px] border border-dashed border-border bg-page px-6 py-12 text-center">
                  <p className="text-[15px] font-bold text-text-main">No work logs match these filters.</p>
                  <p className="text-[13px] text-text-muted mt-2">Try a different project, status, or search term.</p>
                </div>
              ) : (
                groupedByDay.map((group) => (
                  <section key={group.date} className="rounded-[24px] border border-border overflow-hidden">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 px-5 py-4 bg-page border-b border-border">
                      <div>
                        <p className="text-[17px] font-bold text-text-main">{group.day}</p>
                        <p className="text-[12px] font-medium text-text-muted mt-1">{formatDateLabel(group.date)}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-card border border-border text-[12px] font-semibold text-text-main">
                          <TimerReset size={13} className="text-text-muted" />
                          {formatMinutes(group.totalMinutes)} tracked
                        </span>
                        <button
                          onClick={() =>
                            setCollapsedDays((current) => ({
                              ...current,
                              [group.date]: !current[group.date],
                            }))
                          }
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-card border border-border text-[12px] font-semibold text-text-main hover:bg-page transition-colors"
                        >
                          <Dot size={14} className="text-primary" />
                          {group.entries.length} detailed entries
                          {collapsedDays[group.date] ? <ChevronDown size={13} className="text-text-muted" /> : <ChevronUp size={13} className="text-text-muted" />}
                        </button>
                      </div>
                    </div>

                    {!collapsedDays[group.date] && (
                      <div className="divide-y divide-border">
                        {group.entries.map((entry) => (
                          <div key={entry.id} className="px-5 py-5 hover:bg-page transition-colors">
                            <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-4">
                              <div className="space-y-3 flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${entry.color.bg}`}>
                                    <span className={`w-2 h-2 rounded-full ${entry.color.dot}`} />
                                    <span className={`text-[12px] font-bold ${entry.color.text}`}>{entry.project}</span>
                                  </span>
                                </div>

                                <div>
                                  <h3 className="text-[17px] font-bold text-text-main">{entry.task}</h3>
                                  <p className="text-[13px] text-text-muted leading-relaxed mt-1">{entry.details}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
                                  <div className="rounded-[18px] border border-border bg-card px-4 py-3">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Time Slot</p>
                                    <p className="text-[13px] font-semibold text-text-main mt-1">{entry.timeRange}</p>
                                  </div>
                                  <div className="rounded-[18px] border border-border bg-card px-4 py-3">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Tracked Time</p>
                                    <p className="text-[13px] font-semibold text-text-main mt-1">{entry.duration}</p>
                                  </div>
                                  <div className="rounded-[18px] border border-border bg-card px-4 py-3">
                                    <p className="text-[11px] font-bold uppercase tracking-wider text-text-muted">Date</p>
                                    <p className="text-[13px] font-semibold text-text-main mt-1">{entry.day}, {formatDateLabel(entry.date)}</p>
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => setActiveEntry(entry)}
                                className="inline-flex items-center gap-2 self-start px-4 py-2.5 rounded-full bg-page border border-border text-[12px] font-bold text-text-main hover:bg-card transition-colors"
                              >
                                View Details <ArrowUpRight size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </section>
                ))
              )}
            </div>
          </div>

          <div className=" space-y-6 self-start sticky top-4">
            <div className="bg-card rounded-[28px] border border-border p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-[17px] font-bold text-text-main">Project Breakdown</h2>
                  <p className="text-[12px] font-medium text-text-muted mt-1">Where the week was spent</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-page border border-border flex items-center justify-center text-text-muted">
                  <TrendingUp size={17} />
                </div>
              </div>

              <div className="space-y-4">
                {projectBreakdown.map((project) => {
                  const width = totalMinutes > 0 ? (project.minutes / totalMinutes) * 100 : 0;
                  return (
                    <div key={project.project} className="space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${project.color.dot}`} />
                            <p className="text-[13px] font-bold text-text-main truncate">{project.project}</p>
                          </div>
                          <p className="text-[12px] text-text-muted mt-1">{project.taskCount} tasks logged</p>
                        </div>
                        <span className="text-[12px] font-bold text-text-main shrink-0">{formatMinutes(project.minutes)}</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-page overflow-hidden">
                        <div className={`h-full rounded-full ${project.color.dot}`} style={{ width: `${width}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-card rounded-[28px] border border-border p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-[17px] font-bold text-text-main">Week Snapshot</h2>
                  <p className="text-[12px] font-medium text-text-muted mt-1">Quick operational summary</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-page border border-border flex items-center justify-center text-text-muted">
                  <CalendarDays size={17} />
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { label: 'Days Logged', value: `${groupedByDay.length}` },
                  { label: 'Average / Day', value: groupedByDay.length ? formatMinutes(Math.round(totalMinutes / groupedByDay.length)) : '0h 00m' },
                  { label: 'Longest Day', value: groupedByDay.length ? formatMinutes(Math.max(...groupedByDay.map((group) => group.totalMinutes))) : '0h 00m' },
                  { label: 'Billable Ratio', value: totalMinutes ? `${Math.round((billableMinutes / totalMinutes) * 100)}%` : '0%' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between px-4 py-3 rounded-[18px] bg-page border border-border">
                    <span className="text-[12px] font-semibold text-text-muted">{item.label}</span>
                    <span className="text-[13px] font-bold text-text-main">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {activeEntry && (
          <TimesheetDetailModal
            entry={activeEntry}
            onClose={() => setActiveEntry(null)}
          />
        )}
      </div>
    </Layout>
  );
};

export default TimesheetPage;
