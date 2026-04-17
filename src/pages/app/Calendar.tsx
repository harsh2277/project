import React, { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
  MoreVertical,
  Clock,
  MapPin,
  Users,
  X,
  Check,
  ChevronDown,
  Trash2,
  Edit2,
  AlertTriangle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const EventDrawer = ({ event, onClose, onDelete, onEdit, monthName, selectedDate }: any) => {
  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40" onClick={onClose} />
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-card z-50 flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border shrink-0">
          <div className="flex-1 pr-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: EVENT_COLORS[event.color]?.pill || EVENT_COLORS.primary.pill }} />
              <span className="text-[13px] font-bold uppercase tracking-wider" style={{ color: EVENT_COLORS[event.color]?.text || EVENT_COLORS.primary.text }}>
                {event.type}
              </span>
            </div>
            <h2 className="text-[19px] font-bold text-text-main leading-tight">{event.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-text-muted hover:text-text-main hover:bg-page transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: <CalendarIcon size={13} className="text-text-muted" />, label: 'Date', value: `${monthName} ${selectedDate}, 2026` },
              { icon: <Clock size={13} className="text-text-muted" />, label: 'Time', value: event.time },
              { icon: <MapPin size={13} className="text-text-muted" />, label: 'Location', value: event.location || 'Not specified' },
              { icon: <Users size={13} className="text-text-muted" />, label: 'Team', value: '4 Members' },
            ].map(row => (
              <div key={row.label} className="bg-page rounded-[18px] p-4">
                <div className="flex items-center gap-2 mb-2">
                  {row.icon}
                  <span className="text-[11px] font-bold text-text-muted uppercase tracking-wide">{row.label}</span>
                </div>
                <div className="text-[13px] font-bold text-text-main">{row.value}</div>
              </div>
            ))}
          </div>

          <div>
            <p className="text-[12px] font-bold text-text-muted uppercase tracking-wider mb-2 ml-1">Description</p>
            <div className="bg-page rounded-[20px] p-5">
              <p className="text-[14px] font-medium text-text-main leading-relaxed">
                {event.description || 'No detailed description provided for this event.'}
              </p>
            </div>
          </div>


        </div>

        {/* Footer */}
        <div className="shrink-0 border-t border-border p-5 flex items-center gap-3">
          <button
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-full text-[14px] font-bold text-text-main border border-border hover:bg-page transition-colors"
          >
            <Edit2 size={16} /> Edit Details
          </button>
          <button
            onClick={onDelete}
            className="p-3 rounded-full text-rose-600 border border-rose-500/20 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </motion.div>
    </>
  );
};

const modalInputCls = "w-full px-4 py-3 bg-page border border-transparent rounded-[14px] focus:bg-card focus:border-primary transition-all text-[14px] font-medium text-text-main placeholder:text-text-muted outline-none dark:bg-zinc-900";
const modalSelectCls = modalInputCls + " appearance-none cursor-pointer";

const AddEventModal = ({ onClose, onAdd, selectedDate, monthName }: any) => {
  const [form, setForm] = React.useState({
    title: '',
    time: '10:00 AM',
    type: 'meeting',
    description: '',
    location: ''
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.94, y: 8, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 8, opacity: 0 }}
        className="relative bg-card rounded-[24px] border border-border shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[12px] bg-primary flex items-center justify-center text-white">
              <CalendarIcon size={17} />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-text-main">Add New Event</h2>
              <p className="text-[12px] font-medium text-text-muted">Scheduling for {monthName} {selectedDate}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-text-muted hover:text-text-main hover:bg-page transition-all"><X size={18} /></button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-text-main mb-2">Event Title <span className="text-rose-500">*</span></label>
            <input
              autoFocus
              className={modalInputCls}
              placeholder="e.g. Weekly Synchronization"
              value={form.title}
              onChange={e => set('title', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-text-main mb-2">Time</label>
              <div className="relative">
                <input
                  type="time"
                  className={modalInputCls}
                  value={form.time}
                  onChange={e => set('time', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-text-main mb-2">Event Type</label>
              <div className="relative">
                <select
                  className={modalSelectCls}
                  value={form.type}
                  onChange={e => set('type', e.target.value)}
                >
                  <option value="meeting">Meeting</option>
                  <option value="task">Task</option>
                  <option value="deadline">Deadline</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-text-main mb-2">Location / Link</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                className={modalInputCls + " pl-11"}
                placeholder="Google Meet or Office Room"
                value={form.location}
                onChange={e => set('location', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-text-main mb-2">Description</label>
            <textarea
              rows={3}
              className={modalInputCls + ' resize-none'}
              placeholder="What is this event about?"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-6 pb-6 pt-2">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full text-[14px] font-semibold text-text-muted border border-border bg-card hover:bg-page transition-colors">Cancel</button>
          <button
            onClick={() => onAdd(form)}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full text-[14px] font-semibold hover:bg-primary-hover transition-colors shadow-sm"
          >
            <Check size={16} /> Create Event
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const AddDailyTaskModal = ({ onClose, onAdd, selectedDate, monthName }: any) => {
  const [title, setTitle] = React.useState('');
  const [priority, setPriority] = React.useState('Medium');

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.94, y: 8, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 8, opacity: 0 }}
        className="relative bg-card rounded-[24px] border border-border shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[12px] bg-primary flex items-center justify-center text-white">
              <Plus size={17} />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-text-main">Add Daily Task</h2>
              <p className="text-[12px] font-medium text-text-muted">Scheduled for {monthName} {selectedDate}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-text-muted hover:text-text-main hover:bg-page transition-all"><X size={18} /></button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-text-main mb-2">Task Title</label>
            <input
              autoFocus
              className={modalInputCls}
              placeholder="e.g. Review codebase"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-[13px] font-bold text-text-main mb-2">Priority</label>
            <div className="flex gap-2">
              {['Low', 'Medium', 'High'].map(p => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${priority === p
                    ? 'bg-primary text-white border-transparent shadow-md'
                    : 'bg-page text-text-muted border-border hover:bg-card'
                    }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-6 pb-6 pt-2">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full text-[14px] font-semibold text-text-muted border border-border bg-card hover:bg-page transition-colors">Cancel</button>
          <button
            onClick={() => onAdd({ title, priority })}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full text-[14px] font-semibold hover:bg-primary-hover transition-colors shadow-sm"
          >
            <Plus size={16} /> Add Task
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const EditEventModal = ({ event, onClose, onSave, selectedDate, monthName }: any) => {
  const [form, setForm] = React.useState({ ...event });
  const set = (k: string, v: string) => setForm((f: any) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.94, y: 8, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 8, opacity: 0 }}
        className="relative bg-card rounded-[24px] border border-border shadow-2xl w-full max-w-lg overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[12px] bg-primary flex items-center justify-center text-white">
              <Edit2 size={17} />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-text-main">Edit Event</h2>
              <p className="text-[12px] font-medium text-text-muted">Updates for {monthName} {selectedDate}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-text-muted hover:text-text-main hover:bg-page transition-all"><X size={18} /></button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-text-main mb-2">Event Title <span className="text-rose-500">*</span></label>
            <input
              autoFocus
              className={modalInputCls}
              placeholder="e.g. Weekly Synchronization"
              value={form.title}
              onChange={e => set('title', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-text-main mb-2">Time</label>
              <div className="relative">
                <input
                  type="time"
                  className={modalInputCls}
                  value={form.time}
                  onChange={e => set('time', e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-text-main mb-2">Event Type</label>
              <div className="relative">
                <select
                  className={modalSelectCls}
                  value={form.type}
                  onChange={e => set('type', e.target.value)}
                >
                  <option value="meeting">Meeting</option>
                  <option value="task">Task</option>
                  <option value="deadline">Deadline</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-text-main mb-2">Location / Link</label>
            <div className="relative">
              <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                className={modalInputCls + " pl-11"}
                placeholder="Google Meet or Office Room"
                value={form.location || ''}
                onChange={e => set('location', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-text-main mb-2">Description</label>
            <textarea
              rows={3}
              className={modalInputCls + ' resize-none'}
              placeholder="What is this event about?"
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center justify-between px-6 pb-6 pt-2">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full text-[14px] font-semibold text-text-muted border border-border bg-card hover:bg-page transition-colors">Cancel</button>
          <button
            onClick={() => onSave(form)}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full text-[14px] font-semibold hover:bg-primary-hover transition-colors shadow-sm"
          >
            <Check size={16} /> Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const DeleteEventModal = ({ event, onClose, onDelete }: any) => {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.94, y: 8, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 8, opacity: 0 }}
        className="relative bg-card rounded-[24px] border border-border shadow-2xl w-full max-w-sm overflow-hidden p-6"
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500 mb-4 animate-bounce">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-[18px] font-bold text-text-main mb-2">Delete Event?</h2>
          <p className="text-[14px] font-medium text-text-muted mb-8">
            Are you sure you want to delete <span className="text-text-main font-bold">"{event.title}"</span>? This action cannot be undone.
          </p>

          <div className="grid grid-cols-2 gap-3 w-full">
            <button
              onClick={onClose}
              className="py-3 rounded-xl text-[14px] font-bold text-text-muted bg-page hover:bg-card border border-border transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onDelete(event.id)}
              className="py-3 rounded-xl text-[14px] font-bold text-white bg-rose-500 hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/10"
            >
              Delete
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

interface Event {
  id: number;
  title: string;
  time: string;
  type: 'meeting' | 'task' | 'deadline';
  color: string;
  description: string;
}

const EVENT_COLORS: Record<string, { bg: string; text: string; border: string; pill: string }> = {
  primary:      { bg: 'rgba(0,59,255,0.12)',  text: '#003bff', border: '#003bff', pill: '#003bff' },
  emerald:      { bg: 'rgba(16,185,129,0.12)', text: '#059669', border: '#10b981', pill: '#10b981' },
  amber:        { bg: 'rgba(245,158,11,0.12)', text: '#d97706', border: '#f59e0b', pill: '#f59e0b' },
  rose:         { bg: 'rgba(239,68,68,0.12)',  text: '#dc2626', border: '#ef4444', pill: '#ef4444' },
  violet:       { bg: 'rgba(139,92,246,0.12)', text: '#7c3aed', border: '#8b5cf6', pill: '#8b5cf6' },
};

const MOCK_EVENTS: Record<number, Event[]> = {
  8: [
    { id: 1, title: 'Design Review', time: '10:00 AM', type: 'meeting', color: 'primary', description: 'Weekly sync with the design team' },
  ],
  12: [
    { id: 2, title: 'Client Call', time: '02:00 PM', type: 'meeting', color: 'emerald', description: 'Project update with Sellora team' },
    { id: 3, title: 'Fix Layout Bug', time: '04:30 PM', type: 'task', color: 'amber', description: 'CSS fixes for mobile view' },
  ],
  15: [
    { id: 4, title: 'Project Deadline', time: '11:59 PM', type: 'deadline', color: 'rose', description: 'Submit final assets' },
  ],
  20: [
    { id: 5, title: 'Product Demo', time: '01:00 PM', type: 'meeting', color: 'primary', description: 'Showcase new prototype' },
  ],
  24: [
    { id: 6, title: 'Sprint Planning', time: '09:00 AM', type: 'meeting', color: 'primary', description: 'Q2 Sprint roadmap planning' },
  ]
};

const CalendarPage: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // April 2026 for demo
  const [selectedDate, setSelectedDate] = useState<number | null>(12);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [showEditEvent, setShowEditEvent] = useState(false);
  const [showDeleteEvent, setShowDeleteEvent] = useState(false);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.getFullYear();

  const days = [];
  const totalDays = daysInMonth(currentDate.getFullYear(), currentDate.getMonth());
  const startDay = firstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

  // Padding for previous month
  const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);
  const prevMonthDaysTotal = prevMonthDate.getDate();
  for (let i = startDay - 1; i >= 0; i--) {
    days.push({ day: prevMonthDaysTotal - i, current: false });
  }

  // Current month days
  for (let i = 1; i <= totalDays; i++) {
    days.push({ day: i, current: true });
  }

  // Padding for next month to fill the grid (6 rows * 7 days = 42)
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ day: i, current: false });
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <Layout>
      <div className="w-full flex flex-col gap-6">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-text-main tracking-tight">Calendar</h1>
            <p className="text-sm font-medium text-text-muted mt-0.5">Manage your schedule and upcoming tasks</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-card border border-border rounded-xl overflow-hidden shadow-sm">
              <button
                onClick={prevMonth}
                className="p-2.5 hover:bg-page text-text-muted hover:text-text-main transition-colors"
                title="Previous Month"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="px-4 py-2 font-bold text-text-main min-w-[140px] text-center border-x border-border">
                {monthName} {year}
              </div>
              <button
                onClick={nextMonth}
                className="p-2.5 hover:bg-page text-text-muted hover:text-text-main transition-colors"
                title="Next Month"
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <button
              onClick={() => setShowAddEvent(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-hover transition-all shadow-lg"
            >
              <Plus size={18} />
              New Event
            </button>
          </div>
        </div>

        {/* Main Calendar Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 min-h-[700px]">
          {/* Left Side: Calendar Grid */}
          <div className="xl:col-span-3 flex flex-col gap-4">
            <div className="bg-card rounded-[2rem] border border-border shadow-xl overflow-hidden">
              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b border-border">
                {dayNames.map(day => (
                  <div key={day} className="py-4 text-center text-xs font-bold text-text-muted/50 uppercase tracking-wider">
                    {day}
                  </div>
                ))}
              </div>

              {/* Grid Cells */}
              <div className="grid grid-cols-7">
                {days.map((d, index) => {
                  const events = d.current ? MOCK_EVENTS[d.day] || [] : [];
                  const isSelected = d.current && selectedDate === d.day;
                  const isToday = d.current && d.day === 15 && currentDate.getMonth() === 3; // Mock today as April 15

                  return (
                    <div
                      key={index}
                      onClick={() => d.current && setSelectedDate(d.day)}
                      className={`min-h-[120px] p-2 border-r border-b border-border transition-all duration-300 cursor-pointer group relative ${!d.current ? 'bg-page/30' : 'bg-card hover:bg-page/50'
                        } ${index % 7 === 6 ? 'border-r-0' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-1 text-text-muted/30">
                        <span className={`text-sm font-bold flex items-center justify-center w-8 h-8 rounded-full transition-all ${!d.current ? 'text-text-muted/30' :
                          isToday ? 'bg-primary text-white shadow-md' :
                            isSelected ? 'bg-text-main text-card' : 'text-text-main group-hover:bg-page'
                          }`}>
                          {d.day}
                        </span>
                        {events.length > 0 && (
                          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
                        )}
                      </div>

                      <div className="space-y-1">
                        {events.slice(0, 2).map(event => {
                          const c = EVENT_COLORS[event.color] || EVENT_COLORS.primary;
                          return (
                            <motion.div
                              initial={{ opacity: 0, x: -5 }}
                              animate={{ opacity: 1, x: 0 }}
                              key={event.id}
                              onClick={(e) => { e.stopPropagation(); setActiveEvent(event); }}
                              className="px-2 py-1 rounded-lg text-[10px] font-bold truncate border-l-2 hover:brightness-95 transition-all outline-none cursor-pointer"
                              style={{ backgroundColor: c.bg, color: c.text, borderColor: c.border }}
                            >
                              {event.time} {event.title}
                            </motion.div>
                          );
                        })}
                        {events.length > 2 && (
                          <div className="text-[10px] font-bold text-text-muted/50 pl-2">
                            +{events.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Side: Day Details & Upcoming */}
          <div className="xl:col-span-1 flex flex-col gap-6">
            <div className="bg-card rounded-[2rem] border border-border shadow-xl p-6 flex flex-col gap-6 sticky top-6">
              <div>
                <h3 className="text-lg font-bold text-text-main">
                  {selectedDate ? `Events for ${monthName} ${selectedDate}` : 'Select a date'}
                </h3>
                <p className="text-xs font-semibold text-text-muted mt-1 uppercase tracking-wider">
                  {selectedDate ? (MOCK_EVENTS[selectedDate]?.length || 0) : 0} scheduled events
                </p>
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="wait">
                  {selectedDate && MOCK_EVENTS[selectedDate] ? (
                    MOCK_EVENTS[selectedDate].map(event => (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        key={event.id}
                        onClick={() => setActiveEvent(event)}
                        className="group bg-page border border-border rounded-2xl p-4 hover:bg-card hover:shadow-xl hover:border-primary/20 transition-all duration-300 cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-3 text-text-muted">
                        <div className={`p-2 rounded-xl bg-card shadow-sm`} style={{ color: EVENT_COLORS[event.color]?.text || EVENT_COLORS.primary.text }}>
                            <Clock size={18} />
                          </div>
                          <button className="p-1 text-text-muted hover:text-text-main">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                        <h4 className="font-bold text-text-main mb-1 group-hover:text-primary transition-colors">{event.title}</h4>
                        <p className="text-xs font-medium text-text-muted mb-4 leading-relaxed">{event.description}</p>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-text-muted">
                            <Clock size={12} />
                            {event.time}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] font-bold text-text-muted">
                            <Users size={12} />
                            4 Team Members
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <div className="w-16 h-16 bg-page rounded-full flex items-center justify-center text-text-muted/30 mb-4">
                        <CalendarIcon size={32} />
                      </div>
                      <p className="text-sm font-bold text-text-muted/50">No events scheduled for this day</p>
                      <button onClick={() => setShowAddEvent(true)} className="mt-4 text-xs font-bold text-primary hover:underline">Add an event</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {selectedDate && (
                <button
                  onClick={() => setShowAddTask(true)}
                  className="w-full py-3 bg-page hover:bg-card text-text-muted rounded-xl font-bold text-sm transition-colors border border-dashed border-border"
                >
                  + Add task for this day
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddEvent && (
          <AddEventModal
            onClose={() => setShowAddEvent(false)}
            onAdd={(data: any) => { console.log(data); setShowAddEvent(false); }}
            selectedDate={selectedDate}
            monthName={monthName}
          />
        )}
        {showAddTask && (
          <AddDailyTaskModal
            onClose={() => setShowAddTask(false)}
            onAdd={(data: any) => { console.log(data); setShowAddTask(false); }}
            selectedDate={selectedDate}
            monthName={monthName}
          />
        )}
        {activeEvent && (
          <EventDrawer
            event={activeEvent}
            onClose={() => setActiveEvent(null)}
            onDelete={() => setShowDeleteEvent(true)}
            onEdit={() => setShowEditEvent(true)}
            selectedDate={selectedDate}
            monthName={monthName}
          />
        )}
        {showEditEvent && activeEvent && (
          <EditEventModal
            event={activeEvent}
            onClose={() => setShowEditEvent(false)}
            onSave={(updated: any) => { console.log('Saved', updated); setShowEditEvent(false); setActiveEvent(updated); }}
            selectedDate={selectedDate}
            monthName={monthName}
          />
        )}
        {showDeleteEvent && activeEvent && (
          <DeleteEventModal
            event={activeEvent}
            onClose={() => setShowDeleteEvent(false)}
            onDelete={(id: any) => { console.log('Deleted', id); setShowDeleteEvent(false); setActiveEvent(null); }}
          />
        )}
      </AnimatePresence>
    </Layout>
  );
};

export default CalendarPage;
