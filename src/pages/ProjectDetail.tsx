import { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Layout } from '../components/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft, Plus, MoreHorizontal, Calendar, MessageSquare,
  GripHorizontal, Activity, Target, Clock, FileText,
  CheckCircle2, DownloadCloud, Search, UploadCloud, Check,
  Paperclip, Pencil, X, ChevronDown, Flag, Trash2, Edit2, AlertTriangle,
  Settings, Link2, RefreshCw, Bug, ShieldCheck, User2, Loader2, ArrowRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

/* ─── Mock Data ─────────────────────────────────────────────── */
const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Design System Update', tag: 'Design', date: 'Nov 08', comments: 3 },
    'task-2': { id: 'task-2', content: 'User Research Synthesis', tag: 'Research', date: 'Nov 09', comments: 1 },
    'task-3': { id: 'task-3', content: 'Homepage Hero Redesign', tag: 'UI', date: 'Nov 10', comments: 5 },
    'task-4': { id: 'task-4', content: 'Responsive Testing', tag: 'QA', date: 'Nov 12', comments: 0 },
    'task-5': { id: 'task-5', content: 'Performance Audit', tag: 'Dev', date: 'Nov 14', comments: 2 },
  },
  columns: {
    'column-1': { id: 'column-1', title: 'To Do', taskIds: ['task-1', 'task-2'] },
    'column-2': { id: 'column-2', title: 'In Progress', taskIds: ['task-3'] },
    'column-3': { id: 'column-3', title: 'In Review', taskIds: ['task-4'] },
    'column-4': { id: 'column-4', title: 'Completed', taskIds: ['task-5'] },
  },
  columnOrder: ['column-1', 'column-2', 'column-3', 'column-4'],
};

/* ─── Helpers ───────────────────────────────────────────────── */
const getTagStyle = (tag: string) => {
  switch (tag) {
    case 'Design': return 'bg-[#FFF3E0] text-[#EF6C00]';
    case 'Research': return 'bg-[#FFF8E1] text-[#F9A825]';
    case 'UI': return 'bg-[#F3E5F5] text-[#7B1FA2]';
    case 'QA': return 'bg-[#E1F5FE] text-[#0288D1]';
    case 'Dev': return 'bg-[#E8F5E9] text-[#2E7D32]';
    default: return 'bg-[#F5F5F5] text-[#666666]';
  }
};

const TABS = ['Overview', 'Board', 'Tasks', 'Files', 'Activity', 'Settings'];

/* ─── Activity Hours Bar Chart ──────────────────────────────── */
const HOURS_DATA = [
  { month: 'Jan', logged: 38, manual: 8 },
  { month: 'Feb', logged: 22, manual: 6 },
  { month: 'Mar', logged: 55, manual: 14 },
  { month: 'Apr', logged: 30, manual: 4 },
  { month: 'May', logged: 20, manual: 10 },
  { month: 'Jun', logged: 68, manual: 18 },
  { month: 'Jul', logged: 48, manual: 9 },
  { month: 'Aug', logged: 28, manual: 13 },
  { month: 'Sep', logged: 42, manual: 7 },
  { month: 'Oct', logged: 75, manual: 22 },
  { month: 'Nov', logged: 50, manual: 16 },
  { month: 'Dec', logged: 33, manual: 9 },
];

const ActivityHoursChart = () => {
  const [activeBar, setActiveBar] = useState<string | null>('Jun');

  return (
    <div
      className="flex items-end justify-between gap-2 mt-6"
      style={{ height: '180px' }}
      onMouseLeave={() => setActiveBar('Jun')}
    >
      {HOURS_DATA.map((item) => {
        const isActive = activeBar === item.month;
        return (
          <div
            key={item.month}
            className="flex flex-col items-center gap-2 relative h-full pt-8 cursor-pointer flex-1"
            onMouseEnter={() => setActiveBar(item.month)}
          >
            {/* Tooltip */}
            <div
              className={`absolute top-0 bg-white p-2.5 rounded-[14px] shadow-lg border border-[#EEEEEE] text-xs z-20 w-28 transition-all duration-200 pointer-events-none ${isActive ? 'opacity-100 -translate-y-1' : 'opacity-0 translate-y-0'
                }`}
            >
              <p className="text-[#999999] mb-1.5 font-medium">{item.month} hours</p>
              <div className="flex items-center gap-1.5 mb-1">
                <div className="w-2 h-2 rounded-sm bg-primary" />
                <span>Logged: {item.logged}h</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-sm bg-[#CCCCCC]" />
                <span>Manual: {item.manual}h</span>
              </div>
            </div>

            {/* Stacked bar */}
            <div
              className={`w-full flex flex-col justify-end rounded-[10px] overflow-hidden flex-1 transition-colors ${isActive ? 'bg-[#EFEFEF] shadow-md' : 'bg-[#F5F5F5]'
                }`}
            >
              {/* Manual segment — lighter striped layer on top */}
              <div
                className="w-full transition-all duration-700 ease-out"
                style={{
                  height: `${item.manual}%`,
                  background:
                    'repeating-linear-gradient(45deg, transparent, transparent 2px, #AAAAAA 2px, #AAAAAA 4px)',
                  opacity: 0.55,
                }}
              />
              {/* Logged segment — solid dark */}
              <div
                className={`w-full rounded-b-[10px] transition-all duration-700 ease-out ${isActive ? 'bg-[#333333]' : 'bg-primary'
                  }`}
                style={{ height: `${item.logged}%` }}
              >
                {isActive && (
                  <div className="w-2 h-2 bg-white rounded-full mx-auto mt-1 opacity-80" />
                )}
              </div>
            </div>

            <span
              className={`text-[11px] font-semibold shrink-0 transition-colors ${isActive ? 'text-[#1A1A1A]' : 'text-[#999999]'
                }`}
            >
              {item.month}
            </span>
          </div>
        );
      })}
    </div>
  );
};

/* ─── Kanban Task Drawer (view-only) ───────────────────────────── */
const KanbanTaskDrawer = ({
  task, columnTitle, onClose, onEdit, onDelete,
}: {
  task: any; columnTitle: string;
  onClose: () => void; onEdit: () => void; onDelete: (id: string) => void;
}) => (
  <>
    <div className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40" onClick={onClose} />
    <div
      className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-white z-50 flex flex-col shadow-2xl"
      style={{ animation: 'slideInRight 0.25s cubic-bezier(0.16,1,0.3,1)' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between p-6 border-b border-[#F5F5F5] shrink-0">
        <div className="flex-1 pr-4">
          <span className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-semibold mb-2 ${getTagStyle(task.tag)}`}>{task.tag}</span>
          <h2 className="text-[17px] font-bold text-[#1A1A1A] leading-snug">{task.content}</h2>
          <p className="text-[12px] font-medium text-[#999999] mt-1">In <span className="font-semibold text-[#1A1A1A]">{columnTitle}</span></p>
        </div>
        <button onClick={onClose} className="p-2 rounded-full text-[#999999] hover:text-[#1A1A1A] hover:bg-[#F5F5F5] transition-all">
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: <Flag size={13} className="text-[#999999]" />, label: 'Tag', value: <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${getTagStyle(task.tag)}`}>{task.tag}</span> },
            { icon: <Calendar size={13} className="text-[#999999]" />, label: 'Due Date', value: <span className="text-[13px] font-semibold text-[#1A1A1A]">{task.date}</span> },
            { icon: <MessageSquare size={13} className="text-[#999999]" />, label: 'Comments', value: <span className="text-[13px] font-semibold text-[#1A1A1A]">{task.comments}</span> },
          ].map(row => (
            <div key={row.label} className="bg-[#F8F8F8] rounded-[14px] p-3.5">
              <div className="flex items-center gap-1.5 mb-1.5">{row.icon}<span className="text-[11px] font-bold text-[#999999] uppercase tracking-wide">{row.label}</span></div>
              {row.value}
            </div>
          ))}
        </div>
        <div>
          <p className="text-[12px] font-bold text-[#999999] uppercase tracking-wider mb-2">Description</p>
          <div className="bg-[#F8F8F8] rounded-[14px] p-4">
            <p className="text-[13px] font-medium text-[#666666] leading-relaxed">No description added yet. Click Edit Task to add one.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-[#F5F5F5] p-4 flex items-center gap-3">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-[13px] font-semibold text-[#1A1A1A] border border-[#EEEEEE] hover:bg-[#F5F5F5] transition-colors"
        >
          <Edit2 size={14} /> Edit Task
        </button>
        <button
          onClick={() => { if (window.confirm('Delete this task?')) { onDelete(task.id); onClose(); } }}
          className="p-2.5 rounded-full text-[#D32F2F] border border-[#FFCDD2] hover:bg-[#FFEBEE] transition-colors"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
    <style>{`@keyframes slideInRight{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
  </>
);

/* ─── Edit Kanban Task Modal ──────────────────────────────── */
const inputCls = "w-full px-4 py-3 bg-[#F5F5F5] border border-transparent rounded-[14px] focus:bg-white focus:border-[#1A1A1A] focus:ring-2 focus:ring-black/5 transition-all text-[14px] font-medium text-[#1A1A1A] placeholder:text-[#999999] outline-none";
const selectCls = inputCls + " appearance-none cursor-pointer";

const EditKanbanTaskModal = ({
  task, onClose, onSave,
}: {
  task: any; onClose: () => void; onSave: (updated: any) => void;
}) => {
  const [form, setForm] = useState({ ...task });
  const set = (k: string, v: string) => setForm((f: any) => ({ ...f, [k]: v }));

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[24px] border border-[#EEEEEE] shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#F5F5F5]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-[12px] bg-[#F5F5F5] flex items-center justify-center text-[#1A1A1A]">
              <Edit2 size={17} />
            </div>
            <div>
              <h2 className="text-[16px] font-bold text-[#1A1A1A]">Edit Task</h2>
              <p className="text-[12px] font-medium text-[#999999]">Update the task details below.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-[#999999] hover:text-[#1A1A1A] hover:bg-[#F5F5F5] transition-all">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-[#1A1A1A] mb-2">Task Title <span className="text-[#D32F2F]">*</span></label>
            <input value={form.content} onChange={e => set('content', e.target.value)} placeholder="Task title" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-bold text-[#1A1A1A] mb-2">Tag</label>
              <div className="relative">
                <select value={form.tag} onChange={e => set('tag', e.target.value)} className={selectCls}>
                  {['Design', 'Research', 'UI', 'QA', 'Dev'].map(t => <option key={t}>{t}</option>)}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#1A1A1A] mb-2">Due Date</label>
              <input type="date" defaultValue={form.date} onChange={e => set('date', e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label className="block text-[13px] font-bold text-[#1A1A1A] mb-2">Notes</label>
            <textarea rows={3} placeholder="Any additional notes..." className={inputCls + ' resize-none'} />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 pb-6 pt-2">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full text-[14px] font-semibold text-[#666666] border border-[#EEEEEE] bg-white hover:bg-[#F5F5F5] transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { onSave(form); onClose(); }}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full text-[14px] font-semibold hover:bg-primary-hover transition-colors shadow-sm"
          >
            <Check size={16} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Delete Project Modal ──────────────────────────────────── */
const PROJECT_NAME = 'Figma Design System';

const DeleteProjectModal = ({
  onClose, onConfirm,
}: { onClose: () => void; onConfirm: () => void }) => {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleDelete = () => {
    if (input.trim() === PROJECT_NAME) {
      onConfirm();
    } else {
      setError(true);
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative bg-white rounded-[24px] border border-[#EEEEEE] shadow-2xl w-full max-w-md mx-4 overflow-hidden"
        style={{ animation: 'modalPop 0.22s cubic-bezier(0.16,1,0.3,1)' }}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#F5F5F5]">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[14px] bg-[#FFEBEE] flex items-center justify-center text-[#D32F2F]">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h2 className="text-[17px] font-bold text-[#1A1A1A]">Delete Project</h2>
                <p className="text-[12px] font-medium text-[#999999] mt-0.5">This action is permanent and cannot be undone.</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-full text-[#999999] hover:text-[#1A1A1A] hover:bg-[#F5F5F5] transition-all">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div className="bg-[#FFF5F5] border border-[#FFCDD2] rounded-[14px] p-4">
            <p className="text-[13px] font-medium text-[#D32F2F] leading-relaxed">
              You are about to permanently delete <span className="font-bold">{PROJECT_NAME}</span> and all its tasks, files, and activity. This cannot be recovered.
            </p>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#1A1A1A] mb-1.5">
              Type the project name to confirm
            </label>
            <p className="text-[12px] font-medium text-[#999999] mb-3">
              Please type <span className="font-bold text-[#1A1A1A]">{PROJECT_NAME}</span> to proceed.
            </p>
            <input
              autoFocus
              value={input}
              onChange={e => { setInput(e.target.value); setError(false); }}
              onKeyDown={e => e.key === 'Enter' && handleDelete()}
              placeholder={PROJECT_NAME}
              className={`w-full px-4 py-3 rounded-[14px] border text-[14px] font-medium outline-none transition-all ${error
                  ? 'border-[#D32F2F] bg-[#FFF5F5] text-[#D32F2F] focus:ring-2 focus:ring-red-200'
                  : 'border-[#EEEEEE] bg-[#F5F5F5] text-[#1A1A1A] focus:bg-white focus:border-[#1A1A1A] focus:ring-2 focus:ring-black/5'
                } ${shaking ? 'animate-shake' : ''}`}
            />
            {error && (
              <p className="mt-2 text-[12px] font-semibold text-[#D32F2F] flex items-center gap-1.5">
                <AlertTriangle size={12} /> Project name doesn't match. Please try again.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 pb-6 pt-2">
          <button onClick={onClose} className="px-5 py-2.5 rounded-full text-[14px] font-semibold text-[#666666] border border-[#EEEEEE] bg-white hover:bg-[#F5F5F5] transition-colors">Cancel</button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#D32F2F] text-white rounded-full text-[14px] font-semibold hover:bg-[#B71C1C] transition-colors shadow-sm"
          >
            <Trash2 size={15} /> Delete Project
          </button>
        </div>
      </div>
      <style>{`
        @keyframes modalPop{from{transform:scale(0.94) translateY(8px);opacity:0}to{transform:scale(1) translateY(0);opacity:1}}
        @keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-6px)}40%,80%{transform:translateX(6px)}}
        .animate-shake{animation:shake 0.45s ease;}
      `}</style>
    </div>
  );
};

const MOCK_JIRA_PROJECTS = [
  { name: 'Marketing Web', key: 'MKT', id: 'mkt-1' },
  { name: 'Mobile App', key: 'APP', id: 'app-2' },
  { name: 'Design System', key: 'DS', id: 'ds-3' },
  { name: 'Core Infrastructure', key: 'INF', id: 'inf-4' },
];

const MOCK_JIRA_TASKS = [
  { id: 'ABC-123', title: 'Implement dynamic hero section', status: 'In Progress', assignee: 'Alex Lee', priority: 'High', date: 'Today' },
  { id: 'ABC-124', title: 'Fix navigation overflow on mobile', status: 'To Do', assignee: 'Sarah A.', priority: 'Medium', date: 'Tomorrow' },
  { id: 'ABC-125', title: 'Add performance monitoring', status: 'Done', assignee: 'Tony M.', priority: 'Low', date: 'Yesterday' },
  { id: 'ABC-126', title: 'Update dependencies to v4', status: 'In Review', assignee: 'Alex Lee', priority: 'High', date: '2 days ago' },
];

/* ─── Component ─────────────────────────────────────────────── */
const ProjectDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(initialData);
  const [activeTab, setActiveTab] = useState('Overview');

  // Jira Integration States
  const [isJiraIntegrated, setIsJiraIntegrated] = useState(localStorage.getItem('jira_connected') === 'true');
  const [isLinkingJira, setIsLinkingJira] = useState(false);
  const [linkedJiraProject, setLinkedJiraProject] = useState<any>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [showJiraLinkModal, setShowJiraLinkModal] = useState(false);
  const [syncError, setSyncError] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskForm, setTaskForm] = useState({ title: '', tag: 'Design', status: 'To Do', date: '', comments: '' });
  const [activeKanbanTask, setActiveKanbanTask] = useState<{ task: any; columnTitle: string } | null>(null);
  const [editKanbanTask, setEditKanbanTask] = useState<any | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  /* Drag-and-Drop */
  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const startCol = data.columns[source.droppableId as keyof typeof data.columns];
    const finishCol = data.columns[destination.droppableId as keyof typeof data.columns];

    if (startCol === finishCol) {
      const newIds = Array.from(startCol.taskIds);
      newIds.splice(source.index, 1);
      newIds.splice(destination.index, 0, draggableId);
      setData({ ...data, columns: { ...data.columns, [startCol.id]: { ...startCol, taskIds: newIds } } });
      return;
    }

    const startIds = Array.from(startCol.taskIds); startIds.splice(source.index, 1);
    const finishIds = Array.from(finishCol.taskIds); finishIds.splice(destination.index, 0, draggableId);
    setData({
      ...data,
      columns: {
        ...data.columns,
        [startCol.id]: { ...startCol, taskIds: startIds },
        [finishCol.id]: { ...finishCol, taskIds: finishIds },
      },
    });
  };

  return (
    <Layout>
      <div className="w-full h-full flex flex-col">

        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-6 gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/projects')}
              className="p-2.5 bg-white border border-[#EEEEEE] rounded-full text-[#999999] hover:text-[#1A1A1A] hover:shadow-sm transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-[20px] font-bold text-[#1A1A1A] tracking-tight">Figma Design System</h1>
                <span className="bg-[#E8F5E9] text-[#2E7D32] px-3 py-1 rounded-full text-[12px] font-semibold">
                  In Progress
                </span>
              </div>
              <p className="text-[13px] font-medium text-[#999999] mt-0.5">
                Marketing Division · Created Jan 30, 2026
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Edit Project */}
            <button
              onClick={() => navigate(`/projects/${id}/edit`)}
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-[#EEEEEE] text-[#1A1A1A] rounded-full text-[14px] font-semibold hover:bg-[#F5F5F5] transition-colors"
            >
              <Pencil size={16} />
              Edit
            </button>
            {/* Add Task */}
            <button
              onClick={() => setShowTaskModal(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full text-[14px] font-semibold hover:bg-primary-hover transition-colors shadow-sm"
            >
              <Plus size={18} />
              Add Task
            </button>
            {/* 3-dot menu */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowMenu(prev => !prev)}
                className="w-10 h-10 flex items-center justify-center bg-white border border-[#EEEEEE] rounded-full text-[#666666] hover:bg-[#F5F5F5] hover:text-[#1A1A1A] transition-all shadow-sm"
              >
                <MoreHorizontal size={18} />
              </button>
              {showMenu && (
                <div
                  className="absolute right-0 top-full mt-2 w-48 bg-white border border-[#EEEEEE] rounded-[16px] shadow-[0_8px_32px_rgba(0,0,0,0.1)] z-50 py-1.5 overflow-hidden"
                  style={{ animation: 'menuDrop 0.18s cubic-bezier(0.16,1,0.3,1)' }}
                >
                  <button
                    onClick={() => { setShowMenu(false); setShowDeleteModal(true); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-semibold text-[#D32F2F] hover:bg-[#FFF5F5] transition-colors text-left"
                  >
                    <Trash2 size={15} />
                    Delete Project
                  </button>
                </div>
              )}
              <style>{`@keyframes menuDrop{from{transform:translateY(-6px) scale(0.97);opacity:0}to{transform:translateY(0) scale(1);opacity:1}}`}</style>
            </div>
          </div>
        </div>

        {/* ── Tabs ───────────────────────────────────────────── */}
        <div className="flex items-center gap-1 border-b border-[#EEEEEE] shrink-0 mb-6">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-[14px] font-semibold transition-all relative ${activeTab === tab
                ? 'text-[#1A1A1A]'
                : 'text-[#999999] hover:text-[#1A1A1A]'
                }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-primary rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* ══════════════════════════════════════════════════════
            OVERVIEW TAB
        ══════════════════════════════════════════════════════ */}
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pb-8 overflow-y-auto">

            {/* Left column */}
            <div className="xl:col-span-2 space-y-6">

              {/* Project Goal */}
              <div className="bg-white p-6 rounded-[20px] border border-[#EEEEEE]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-[12px] bg-[#F5F5F5] text-[#1A1A1A] flex items-center justify-center">
                    <Target size={20} />
                  </div>
                  <h2 className="text-[16px] font-bold text-[#1A1A1A]">Project Goal & Scope</h2>
                </div>
                <p className="text-[14px] leading-relaxed text-[#666666]">
                  We are embarking on a comprehensive redesign of the main marketing website. The primary
                  objective is to significantly improve conversion rate optimization through A/B testing and
                  to overhaul the user experience for seamless navigation. We aim to launch this prior to
                  the Q4 holiday stretch, focusing explicitly on mobile-first interactions and reduced
                  payload times.
                </p>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: <CheckCircle2 size={22} />, value: '68%', label: 'Overall Progress' },
                  { icon: <Activity size={22} />, value: '12', label: 'Open Tasks' },
                  { icon: <Clock size={22} />, value: '14h', label: 'Tracked Time' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white p-5 rounded-[20px] border border-[#EEEEEE] flex flex-col">
                    <div className="text-[#999999] mb-3">{stat.icon}</div>
                    <p className="text-[28px] font-bold text-[#1A1A1A] mb-0.5">{stat.value}</p>
                    <p className="text-[13px] font-medium text-[#999999]">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Progress */}
              <div className="bg-white p-6 rounded-[20px] border border-[#EEEEEE]">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-[16px] font-bold text-[#1A1A1A]">Progress</h2>
                  <span className="text-[14px] font-bold text-[#1A1A1A]">68%</span>
                </div>
                <div className="w-full bg-[#F5F5F5] rounded-full h-[8px]">
                  <div className="bg-primary h-full rounded-full transition-all duration-700" style={{ width: '68%' }} />
                </div>
                <div className="flex justify-between mt-3 text-[12px] font-medium text-[#999999]">
                  <span>Jan 30, 2026</span>
                  <span>Feb 5, 2026</span>
                </div>
              </div>

              {/* Recent Deliverables */}
              <div className="bg-white p-6 rounded-[20px] border border-[#EEEEEE]">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[12px] bg-[#F5F5F5] text-[#1A1A1A] flex items-center justify-center">
                      <FileText size={20} />
                    </div>
                    <h2 className="text-[16px] font-bold text-[#1A1A1A]">Recent Deliverables</h2>
                  </div>
                  <button className="text-[13px] font-semibold text-[#1A1A1A] hover:text-black transition-colors underline underline-offset-2">
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { type: 'PDF', name: 'Wireframes_v2.pdf', sub: 'Added yesterday by Alex', bg: 'bg-[#FFEBEE] text-[#D32F2F]' },
                    { type: 'DOC', name: 'Copywriting_Draft.docx', sub: 'Added 3 days ago by Sarah', bg: 'bg-[#E1F5FE] text-[#0288D1]' },
                  ].map(f => (
                    <div key={f.name} className="flex items-center gap-3 p-4 rounded-[14px] border border-[#EEEEEE] hover:bg-[#F5F5F5] transition-colors cursor-pointer group">
                      <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center font-bold text-[11px] ${f.bg}`}>{f.type}</div>
                      <div>
                        <p className="text-[14px] font-bold text-[#1A1A1A] group-hover:text-primary transition-colors">{f.name}</p>
                        <p className="text-[12px] font-medium text-[#999999]">{f.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">

              {/* Details */}
              <div className="bg-white p-6 rounded-[20px] border border-[#EEEEEE]">
                <h2 className="text-[16px] font-bold text-[#1A1A1A] mb-5">Details</h2>
                <div className="space-y-4 divide-y divide-[#F5F5F5]">
                  <div className="pb-4">
                    <p className="text-[12px] font-medium text-[#999999] mb-1">Status</p>
                    <span className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#2E7D32]">
                      <span className="w-2 h-2 rounded-full bg-[#2E7D32]" />In Progress
                    </span>
                  </div>
                  <div className="py-4">
                    <p className="text-[12px] font-medium text-[#999999] mb-1">Priority</p>
                    <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-[#FFEBEE] text-[#D32F2F]">High</span>
                  </div>
                  <div className="py-4">
                    <p className="text-[12px] font-medium text-[#999999] mb-1">Start Date</p>
                    <span className="flex items-center gap-2 text-[14px] font-medium text-[#1A1A1A]">
                      <Calendar size={14} className="text-[#999999]" />Jan 30, 2026
                    </span>
                  </div>
                  <div className="py-4">
                    <p className="text-[12px] font-medium text-[#999999] mb-1">Deadline</p>
                    <span className="flex items-center gap-2 text-[14px] font-medium text-[#1A1A1A]">
                      <Calendar size={14} className="text-[#999999]" />Feb 5, 2026
                    </span>
                  </div>
                  <div className="pt-4">
                    <p className="text-[12px] font-medium text-[#999999] mb-1">Budget</p>
                    <span className="text-[14px] font-bold text-[#1A1A1A]">$12,000 / $15,000</span>
                  </div>
                </div>
              </div>


            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            BOARD TAB
        ══════════════════════════════════════════════════════ */}
        {activeTab === 'Board' && (
          <div className="overflow-x-auto pb-8">
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="flex gap-5 items-start w-max">
                {data.columnOrder.map(columnId => {
                  const column = data.columns[columnId as keyof typeof data.columns];
                  const tasks = column.taskIds.map(tid => data.tasks[tid as keyof typeof data.tasks]);

                  return (
                    <div key={column.id} className="flex flex-col w-[300px] bg-[#FFFFFF] rounded-[20px] p-4">
                      {/* Column Header */}
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-[15px] text-[#1A1A1A]">{column.title}</h3>
                          <span className="bg-white text-[#666666] px-2 py-0.5 rounded-full text-[11px] font-bold border border-[#EEEEEE]">
                            {tasks.length}
                          </span>
                        </div>
                        <button className="text-[#999999] hover:text-[#1A1A1A] transition-colors p-1 rounded-lg hover:bg-white">
                          <MoreHorizontal size={18} />
                        </button>
                      </div>

                      {/* Droppable */}
                      <Droppable droppableId={column.id}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            className={`flex-1 min-h-[150px] rounded-[14px] transition-colors ${snapshot.isDraggingOver
                              ? 'bg-[#EFEFEF]'
                              : ''
                              }`}
                          >
                            <div className="flex flex-col gap-3">
                              {tasks.map((task, index) => (
                                <Draggable key={task.id} draggableId={task.id} index={index}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className={`bg-white rounded-[20px] border ${snapshot.isDragging
                                        ? 'border-[#CCCCCC] shadow-xl scale-[1.02] rotate-1 z-50'
                                        : 'border-[#EEEEEE] shadow-sm'
                                        } transition-all duration-300 group`}
                                    >
                                      {/* inner clickable area — DnD doesn't intercept this div's click */}
                                      <div
                                        className="p-5 cursor-pointer hover:bg-[#FAFAFA] rounded-[20px] transition-colors"
                                        onClick={() => setActiveKanbanTask({ task, columnTitle: column.title })}
                                      >
                                        <div className="flex justify-between items-start mb-3">
                                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${getTagStyle(task.tag)}`}>
                                            {task.tag}
                                          </span>
                                          <div
                                            {...provided.dragHandleProps}
                                            className="text-[#CCCCCC] hover:text-[#999999] cursor-grab active:cursor-grabbing p-1 transition-colors"
                                          >
                                            <GripHorizontal size={16} />
                                          </div>
                                        </div>

                                        <p className="font-bold text-[14px] text-[#1A1A1A] mb-4 leading-tight group-hover:text-primary transition-colors">
                                          {task.content}
                                        </p>

                                        <div className="flex items-center justify-between border-t border-[#F5F5F5] pt-3">
                                          <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#999999]">
                                            <Calendar size={13} />
                                            {task.date}
                                          </div>
                                          <div className="flex items-center gap-1.5 text-[12px] font-medium text-[#999999]">
                                            <MessageSquare size={13} />
                                            {task.comments}
                                          </div>
                                        </div>
                                      </div>{/* end clickable */}
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          </div>
                        )}
                      </Droppable>

                      {/* Add Task */}
                      <button className="flex items-center justify-center gap-2 mt-3 px-4 py-3 rounded-[14px] border-2 border-dashed border-[#DDDDDD] text-[#999999] font-semibold text-[13px] hover:border-[#1A1A1A] hover:text-[#1A1A1A] hover:bg-white transition-all w-full group">
                        <Plus size={16} className="group-hover:scale-110 transition-transform" />
                        Add Task
                      </button>
                    </div>
                  );
                })}
              </div>
            </DragDropContext>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            FILES TAB
        ══════════════════════════════════════════════════════ */}
        {activeTab === 'Files' && (
          <div className="flex flex-col gap-6 pb-8 overflow-y-auto">

            {/* Upload Zone */}
            <div className="w-full border-2 border-dashed border-[#EEEEEE] rounded-[20px] p-12 flex flex-col items-center justify-center text-center bg-[#FAFAFA] hover:bg-[#F5F5F5] hover:border-[#1A1A1A] transition-all cursor-pointer group">
              <div className="w-14 h-14 bg-white text-[#999999] group-hover:bg-primary group-hover:text-white transition-all rounded-[14px] flex items-center justify-center mb-4 shadow-sm border border-[#EEEEEE]">
                <UploadCloud size={26} />
              </div>
              <h3 className="text-[16px] font-bold text-[#1A1A1A] mb-1">Click to upload deliverables</h3>
              <p className="text-[13px] font-medium text-[#999999]">Supported: PDF, DOCX, ZIP, Figma · Max 50 MB</p>
            </div>

            {/* Files List */}
            <div className="bg-white rounded-[20px] border border-[#EEEEEE] p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-[16px] font-bold text-[#1A1A1A]">All Project Files</h2>
                <div className="relative w-56">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#999999]"><Search size={15} /></span>
                  <input
                    type="text"
                    placeholder="Search files..."
                    className="w-full pl-10 pr-4 py-2.5 bg-[#F5F5F5] border border-transparent rounded-full text-[13px] font-medium text-[#1A1A1A] placeholder:text-[#999999] focus:bg-white focus:border-[#EEEEEE] outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: 'Wireframes_v2.pdf', size: '4.2 MB', type: 'PDF', bg: 'bg-[#FFEBEE] text-[#D32F2F]' },
                  { name: 'Copywriting_Draft.docx', size: '12 KB', type: 'DOC', bg: 'bg-[#E1F5FE] text-[#0288D1]' },
                  { name: 'User_Research_Data.zip', size: '14.8 MB', type: 'ZIP', bg: 'bg-[#FFF3E0] text-[#EF6C00]' },
                  { name: 'Figma_Prototype_Links', size: '1 KB', type: 'URL', bg: 'bg-[#E8F5E9] text-[#2E7D32]' },
                  { name: 'Brand_Guidelines_2024.pdf', size: '8.1 MB', type: 'PDF', bg: 'bg-[#FFEBEE] text-[#D32F2F]' },
                ].map((file, i) => (
                  <div key={i} className="flex flex-col p-5 rounded-[20px] border border-[#EEEEEE] hover:shadow-md transition-all group cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center font-bold text-[12px] ${file.bg}`}>
                        {file.type}
                      </div>
                      <button className="text-[#999999] hover:text-[#1A1A1A] bg-[#F5F5F5] hover:bg-[#EEEEEE] p-2 rounded-full transition-colors">
                        <DownloadCloud size={15} />
                      </button>
                    </div>
                    <h4 className="text-[14px] font-bold text-[#1A1A1A] mb-1 truncate group-hover:text-primary transition-colors">{file.name}</h4>
                    <p className="text-[12px] font-medium text-[#999999]">{file.size} · Version 1.0</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            TASKS TAB (Jira Integrated)
        ══════════════════════════════════════════════════════ */}
        {activeTab === 'Tasks' && (
          <div className="flex flex-col h-full bg-white rounded-[24px] border border-[#EEEEEE] overflow-hidden">
            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-[#F5F5F5] flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-primary-light text-primary rounded-lg">
                  <Bug size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Jira Active</span>
                </div>
                <div className="h-6 w-px bg-[#EEEEEE]" />
                <div className="flex items-center gap-2 text-[13px] font-medium text-[#999999]">
                  {isSyncing ? (
                    <span className="flex items-center gap-2"><Loader2 size={14} className="animate-spin" /> Syncing with Jira...</span>
                  ) : (
                    <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-[#2E7D32]" /> Synced at {lastSync}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsSyncing(true);
                    setTimeout(() => {
                      setIsSyncing(false);
                      setLastSync(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
                    }, 1500);
                  }}
                  disabled={isSyncing}
                  className="p-2 text-[#999999] hover:text-[#1A1A1A] hover:bg-[#F5F5F5] rounded-xl transition-all"
                >
                  <RefreshCw size={18} className={isSyncing ? 'animate-spin' : ''} />
                </button>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#CCCCCC]" />
                  <input
                    type="text"
                    placeholder="Search Jira issues..."
                    className="pl-9 pr-4 py-2 bg-[#F5F5F5] border-none rounded-xl text-sm focus:ring-1 focus:ring-blue-500/20 w-64 outline-none"
                  />
                </div>
                <button
                  onClick={() => setShowTaskModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary-light"
                >
                  <Plus size={16} /> Create Task
                </button>
              </div>
            </div>

            {/* Task List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
              {!linkedJiraProject ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="w-16 h-16 bg-primary-light text-primary rounded-[20px] flex items-center justify-center">
                    <Link2 size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1A1A1A]">No Jira Project Linked</h3>
                    <p className="text-sm text-[#999999] max-w-xs mx-auto mt-2">
                      Connect a Jira project to this project to start syncing issues and tracking progress natively.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('Settings')}
                    className="px-6 py-2.5 bg-primary text-white rounded-full text-sm font-bold hover:bg-primary-hover transition-all"
                  >
                    Go to Settings
                  </button>
                </div>
              ) : syncError ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                  <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-[20px] flex items-center justify-center">
                    <AlertTriangle size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1A1A1A]">Unable to fetch Jira tasks</h3>
                    <p className="text-sm text-[#999999] max-w-xs mx-auto mt-2">
                      There was a problem communicating with Atlassian. Please try reconnecting your account.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/integrations')}
                    className="px-6 py-2.5 bg-rose-600 text-white rounded-full text-sm font-bold hover:bg-rose-700 transition-all"
                  >
                    Reconnect Jira
                  </button>
                </div>
              ) : (
                <>
                  {MOCK_JIRA_TASKS.map(task => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-4 rounded-2xl border border-[#F0F0F0] hover:border-blue-200 hover:shadow-md transition-all group flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary border border-slate-100">
                          <Bug size={20} />
                        </div>
                        <div>
                          <p className="text-[12px] font-black text-primary uppercase tracking-tighter mb-0.5">{task.id}</p>
                          <h4 className="text-sm font-bold text-[#1A1A1A] group-hover:text-primary transition-colors">{task.title}</h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="flex flex-col items-end">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${task.status === 'Done' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                              task.status === 'In Progress' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                'bg-slate-50 text-slate-500 border border-slate-200'
                            }`}>
                            {task.status}
                          </span>
                          <span className="text-[10px] font-medium text-[#999999] mt-1">{task.date}</span>
                        </div>

                        <div className="flex flex-col items-end w-24">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${task.priority === 'High' ? 'text-rose-600' : 'text-slate-400'
                            }`}>
                            {task.priority} Priority
                          </span>
                        </div>

                        <div className="flex -space-x-2">
                          <img src={`https://ui-avatars.com/api/?name=${task.assignee}&background=random&color=fff`} className="w-8 h-8 rounded-full border-2 border-white ring-1 ring-slate-100" />
                        </div>

                        <button className="p-2 text-slate-300 hover:text-slate-600 rounded-lg hover:bg-slate-50">
                          <MoreHorizontal size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                  <div className="py-8 text-center">
                    <p className="text-xs font-bold text-[#CCCCCC] uppercase tracking-widest">End of Sync</p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            SETTINGS TAB (Integrations)
        ══════════════════════════════════════════════════════ */}
        {activeTab === 'Settings' && (
          <div className="max-w-4xl space-y-8 pb-12">
            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-800">Project Settings</h2>
              <p className="text-slate-500 font-medium leading-relaxed">Customize your project workflow and connect external tools.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col justify-between h-full group hover:shadow-md transition-all">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="w-14 h-14 bg-primary-light rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                      <Bug size={32} />
                    </div>
                    {linkedJiraProject && (
                      <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-wider border border-emerald-100">
                        <ShieldCheck size={14} /> Linked
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-800">Jira Integration</h3>
                    <p className="text-sm text-slate-500 font-medium leading-relaxed">
                      Automatically sync Jira issues with this project. See real-time statuses, assignees, and priority levels.
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  {!isJiraIntegrated ? (
                    <button
                      onClick={() => navigate('/integrations')}
                      className="w-full py-3.5 bg-slate-50 text-slate-600 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                    >
                      Setup Global Integration <ArrowRight size={16} />
                    </button>
                  ) : linkedJiraProject ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-slate-800 font-black text-sm shadow-sm">
                            {linkedJiraProject.key}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-[#999999] uppercase tracking-wider">Linked Project</p>
                            <p className="text-sm font-bold text-[#1A1A1A]">{linkedJiraProject.name}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => setLinkedJiraProject(null)}
                          className="text-[#999999] hover:text-rose-500 p-2 rounded-xl transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <button
                        onClick={() => setShowJiraLinkModal(true)}
                        className="w-full py-3.5 bg-white border border-slate-200 text-slate-800 rounded-2xl font-bold text-sm hover:bg-slate-50 transition-all"
                      >
                        Change Linked Project
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowJiraLinkModal(true)}
                      className="w-full py-3.5 bg-primary text-white rounded-2xl font-bold text-sm hover:bg-primary-hover transition-all shadow-lg shadow-primary-light flex items-center justify-center gap-2"
                    >
                      Connect Jira Project <Link2 size={18} />
                    </button>
                  )}
                </div>
              </div>

              {/* Empty placeholder for more integrations */}
              <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-8 rounded-[32px] flex flex-col items-center justify-center text-center group cursor-pointer hover:bg-white hover:border-violet-300 transition-all">
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-slate-300 group-hover:text-violet-500 transition-colors shadow-sm mb-4">
                  <Plus size={32} />
                </div>
                <h3 className="text-sm font-bold text-slate-400 group-hover:text-slate-800">Add More Integrations</h3>
                <p className="text-[11px] text-slate-400 font-medium max-w-[120px] mt-2">Slack, GitHub, and more coming soon.</p>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            ACTIVITY TAB
        ══════════════════════════════════════════════════════ */}
        {activeTab === 'Activity' && (
          <div className="space-y-6 pb-8 overflow-y-auto">
            {/* KPI Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Tasks Completed', value: '5', sub: 'this week', icon: <CheckCircle2 size={20} />, color: 'text-[#2E7D32]', bg: 'bg-[#E8F5E9]' },
                { label: 'Hours Logged', value: '14h', sub: 'this week', icon: <Clock size={20} />, color: 'text-[#0288D1]', bg: 'bg-[#E1F5FE]' },
                { label: 'Files Uploaded', value: '3', sub: 'this week', icon: <UploadCloud size={20} />, color: 'text-[#EF6C00]', bg: 'bg-[#FFF3E0]' },
                { label: 'Productivity', value: '92%', sub: 'score', icon: <Activity size={20} />, color: 'text-[#7B1FA2]', bg: 'bg-[#F3E5F5]' },
              ].map(k => (
                <div key={k.label} className="bg-white p-5 rounded-[20px] border border-[#EEEEEE] flex flex-col gap-3">
                  <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center ${k.bg} ${k.color}`}>{k.icon}</div>
                  <div>
                    <p className="text-[26px] font-bold text-[#1A1A1A] leading-none mb-1">{k.value}</p>
                    <p className="text-[12px] font-medium text-[#999999]">{k.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-3 bg-white rounded-[20px] border border-[#EEEEEE] p-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h2 className="text-[16px] font-bold text-[#1A1A1A]">Activity Hours</h2>
                    <p className="text-[13px] font-medium text-[#999999] mt-0.5">Logged vs manual hours — this year</p>
                  </div>
                  <span className="text-[12px] font-semibold text-[#2E7D32] bg-[#E8F5E9] px-3 py-1 rounded-full">+14% vs last year</span>
                </div>
                <div className="flex items-center gap-5 text-[12px] font-semibold text-[#666666] mb-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full border-2 border-[#1A1A1A]" />
                    Logged
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full border-2 border-[#CCCCCC]" />
                    Manual
                  </div>
                </div>
                <ActivityHoursChart />
              </div>

              <div className="lg:col-span-2 bg-white rounded-[20px] border border-[#EEEEEE] p-6">
                <h2 className="text-[16px] font-bold text-[#1A1A1A] mb-1">Task Breakdown</h2>
                <p className="text-[13px] font-medium text-[#999999] mb-5">By current status</p>
                <div className="flex items-center gap-6">
                  <div className="relative shrink-0" style={{ width: 100, height: 100 }}>
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#F5F5F5" strokeWidth="3.2" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#1A1A1A" strokeWidth="3.2" strokeDasharray="34 66" strokeDashoffset="0" strokeLinecap="round" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#0288D1" strokeWidth="3.2" strokeDasharray="24 76" strokeDashoffset="-34" strokeLinecap="round" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#EF6C00" strokeWidth="3.2" strokeDasharray="20 80" strokeDashoffset="-58" strokeLinecap="round" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#CCCCCC" strokeWidth="3.2" strokeDasharray="22 78" strokeDashoffset="-78" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[16px] font-bold text-[#1A1A1A]">20</span>
                      <span className="text-[10px] font-medium text-[#999999]">tasks</span>
                    </div>
                  </div>
                  <div className="space-y-2.5 flex-1">
                    {[
                      { label: 'Completed', pct: '34%', dot: 'bg-primary' },
                      { label: 'In Progress', pct: '24%', dot: 'bg-[#0288D1]' },
                      { label: 'In Review', pct: '20%', dot: 'bg-[#EF6C00]' },
                      { label: 'To Do', pct: '22%', dot: 'bg-[#CCCCCC]' },
                    ].map(s => (
                      <div key={s.label} className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${s.dot}`} />
                          <span className="text-[12px] font-medium text-[#666666]">{s.label}</span>
                        </div>
                        <span className="text-[12px] font-bold text-[#1A1A1A]">{s.pct}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Progress by Category */}
            <div className="bg-white rounded-[20px] border border-[#EEEEEE] p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-[16px] font-bold text-[#1A1A1A]">Progress by Category</h2>
                  <p className="text-[13px] font-medium text-[#999999] mt-0.5">Completion rate across task types</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-5">
                {[
                  { label: 'Design', pct: 80, color: 'bg-[#FFF3E0]', bar: 'bg-[#EF6C00]' },
                  { label: 'UI', pct: 65, color: 'bg-[#F3E5F5]', bar: 'bg-[#7B1FA2]' },
                  { label: 'Research', pct: 55, color: 'bg-[#FFF8E1]', bar: 'bg-[#F9A825]' },
                  { label: 'QA', pct: 70, color: 'bg-[#E1F5FE]', bar: 'bg-[#0288D1]' },
                  { label: 'Dev', pct: 45, color: 'bg-[#E8F5E9]', bar: 'bg-[#2E7D32]' },
                  { label: 'Planning', pct: 90, color: 'bg-[#F5F5F5]', bar: 'bg-primary' },
                ].map(c => (
                  <div key={c.label}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-semibold text-[#1A1A1A]">{c.label}</span>
                      <span className="text-[13px] font-bold text-[#1A1A1A]">{c.pct}%</span>
                    </div>
                    <div className="w-full bg-[#F5F5F5] rounded-full h-[7px]">
                      <div className={`h-full rounded-full transition-all duration-700 ${c.bar}`} style={{ width: `${c.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity Timeline */}
            <div className="bg-white rounded-[20px] border border-[#EEEEEE] p-6">
              <h2 className="text-[16px] font-bold text-[#1A1A1A] mb-6">Recent Activity</h2>
              <div className="relative border-l-2 border-[#EEEEEE] ml-4 space-y-8">
                {[
                  {
                    icon: <Check size={14} />, bg: 'bg-[#E8F5E9] text-[#2E7D32]',
                    time: 'Today, 10:42 AM',
                    content: <><span className="font-bold text-[#1A1A1A]">Alex Lee</span> moved task <span className="font-bold text-primary">"Design System Update"</span> to Completed.</>,
                  },
                  {
                    icon: <MessageSquare size={13} />, bg: 'bg-[#FFEBEE] text-[#D32F2F]',
                    time: 'Yesterday, 4:15 PM',
                    content: <><span className="font-bold text-[#1A1A1A]">Sarah Adams</span> commented on <span className="font-bold text-primary">"Homepage Hero Redesign"</span></>,
                    quote: '"I think we need to push image assets through tinypng before uploading. They\'re feeling heavy on mobile."',
                  },
                  {
                    icon: <UploadCloud size={13} />, bg: 'bg-[#E8F5E9] text-[#2E7D32]',
                    time: 'Nov 05, 9:20 AM',
                    content: <><span className="font-bold text-[#1A1A1A]">Alex Lee</span> uploaded <span className="font-bold text-[#1A1A1A]">Wireframes_v2.pdf</span>.</>,
                  },
                  {
                    icon: <Paperclip size={13} />, bg: 'bg-[#E1F5FE] text-[#0288D1]',
                    time: 'Oct 12, 11:00 AM',
                    content: <><span className="font-bold text-[#1A1A1A]">Tony Moore</span> created project <span className="font-bold text-primary">"Figma Design System"</span> and added 2 members.</>,
                  },
                ].map((item, i) => (
                  <div key={i} className="relative pl-8">
                    <div className={`absolute -left-[18px] top-1 w-9 h-9 rounded-full border-4 border-white flex items-center justify-center shadow-sm ${item.bg}`}>
                      {item.icon}
                    </div>
                    <span className="text-[12px] font-medium text-[#999999] mb-1 block">{item.time}</span>
                    <p className="text-[14px] text-[#666666] font-medium">{item.content}</p>
                    {item.quote && (
                      <div className="mt-2 p-4 bg-[#F5F5F5] rounded-[14px] border border-[#EEEEEE] text-[13px] text-[#666666] italic">
                        {item.quote}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── Jira Link Modal ── */}
      <AnimatePresence>
        {showJiraLinkModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowJiraLinkModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl relative z-10"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black text-slate-800">Link Jira Project</h2>
                  <button onClick={() => setShowJiraLinkModal(false)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400"><X size={20} /></button>
                </div>

                <div className="space-y-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search Jira projects..."
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-5 py-4 text-sm font-medium outline-none focus:border-blue-300 transition-all"
                    />
                  </div>

                  <div className="max-h-60 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                    {MOCK_JIRA_PROJECTS.map(p => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setLinkedJiraProject(p);
                          setShowJiraLinkModal(false);
                          setActiveTab('Tasks');
                        }}
                        className="w-full p-4 rounded-2xl border border-slate-50 text-left hover:border-blue-200 hover:bg-primary-light/50 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center text-slate-800 font-black text-xs">
                            {p.key}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-800">{p.name}</p>
                            <p className="text-xs text-slate-400 font-medium">{p.key} Project Key</p>
                          </div>
                        </div>
                        <ArrowRight size={16} className="text-slate-200 group-hover:text-blue-500 transition-colors" />
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 text-center">
                    <p className="text-xs font-medium text-slate-400">
                      Can't find your project? <span className="text-primary font-bold cursor-pointer">Re-sync Jira</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── Kanban Task Drawer — rendered via portal so it always escapes overflow/stacking ── */}
      {activeKanbanTask && ReactDOM.createPortal(
        <KanbanTaskDrawer
          task={activeKanbanTask.task}
          columnTitle={activeKanbanTask.columnTitle}
          onClose={() => setActiveKanbanTask(null)}
          onEdit={() => setEditKanbanTask(activeKanbanTask.task)}
          onDelete={(taskId) => {
            setData(prev => {
              const newTasks = { ...prev.tasks };
              delete newTasks[taskId as keyof typeof newTasks];
              const newColumns = Object.fromEntries(
                Object.entries(prev.columns).map(([cid, col]: any) => [
                  cid,
                  { ...col, taskIds: col.taskIds.filter((t: string) => t !== taskId) },
                ])
              ) as typeof prev.columns;
              return { ...prev, tasks: newTasks, columns: newColumns };
            });
          }}
        />,
        document.body
      )}

      {/* Edit Task Modal — portal */}
      {editKanbanTask && ReactDOM.createPortal(
        <EditKanbanTaskModal
          task={editKanbanTask}
          onClose={() => setEditKanbanTask(null)}
          onSave={(updated) => {
            setData(prev => ({ ...prev, tasks: { ...prev.tasks, [updated.id]: updated } }));
            setActiveKanbanTask(prev => prev ? { ...prev, task: updated } : null);
            setEditKanbanTask(null);
          }}
        />,
        document.body
      )}

      {/* ── Add Task Modal ── */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowTaskModal(false)}
          />

          {/* Modal Panel */}
          <div className="relative bg-white rounded-[24px] border border-[#EEEEEE] shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-[#F5F5F5]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-[12px] bg-[#F5F5F5] flex items-center justify-center text-[#1A1A1A]">
                  <Flag size={18} />
                </div>
                <div>
                  <h2 className="text-[16px] font-bold text-[#1A1A1A]">Add New Task</h2>
                  <p className="text-[12px] font-medium text-[#999999]">Fill in the task details below.</p>
                </div>
              </div>
              <button
                onClick={() => setShowTaskModal(false)}
                className="p-2 rounded-full text-[#999999] hover:text-[#1A1A1A] hover:bg-[#F5F5F5] transition-all"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-5 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-[13px] font-bold text-[#1A1A1A] mb-2">
                  Task Title <span className="text-[#D32F2F]">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Design homepage mockup"
                  value={taskForm.title}
                  onChange={e => setTaskForm(f => ({ ...f, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-[#F5F5F5] border border-transparent rounded-[14px] focus:bg-white focus:border-[#1A1A1A] focus:ring-2 focus:ring-black/5 transition-all text-[14px] font-medium text-[#1A1A1A] placeholder:text-[#999999] outline-none"
                />
              </div>

              {/* Tag & Status row */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-bold text-[#1A1A1A] mb-2">Tag</label>
                  <div className="relative">
                    <select
                      value={taskForm.tag}
                      onChange={e => setTaskForm(f => ({ ...f, tag: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#F5F5F5] border border-transparent rounded-[14px] focus:bg-white focus:border-[#1A1A1A] focus:ring-2 focus:ring-black/5 transition-all text-[14px] font-medium text-[#1A1A1A] appearance-none outline-none cursor-pointer"
                    >
                      {['Design', 'Research', 'UI', 'QA', 'Dev'].map(t => <option key={t}>{t}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-[#1A1A1A] mb-2">Column</label>
                  <div className="relative">
                    <select
                      value={taskForm.status}
                      onChange={e => setTaskForm(f => ({ ...f, status: e.target.value }))}
                      className="w-full px-4 py-3 bg-[#F5F5F5] border border-transparent rounded-[14px] focus:bg-white focus:border-[#1A1A1A] focus:ring-2 focus:ring-black/5 transition-all text-[14px] font-medium text-[#1A1A1A] appearance-none outline-none cursor-pointer"
                    >
                      {['To Do', 'In Progress', 'In Review', 'Completed'].map(s => <option key={s}>{s}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#999999] pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-[13px] font-bold text-[#1A1A1A] mb-2">Due Date</label>
                <input
                  type="date"
                  value={taskForm.date}
                  onChange={e => setTaskForm(f => ({ ...f, date: e.target.value }))}
                  className="w-full px-4 py-3 bg-[#F5F5F5] border border-transparent rounded-[14px] focus:bg-white focus:border-[#1A1A1A] focus:ring-2 focus:ring-black/5 transition-all text-[14px] font-medium text-[#1A1A1A] outline-none"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-[13px] font-bold text-[#1A1A1A] mb-2">Notes</label>
                <textarea
                  rows={3}
                  placeholder="Any additional notes or context..."
                  value={taskForm.comments}
                  onChange={e => setTaskForm(f => ({ ...f, comments: e.target.value }))}
                  className="w-full px-4 py-3 bg-[#F5F5F5] border border-transparent rounded-[14px] focus:bg-white focus:border-[#1A1A1A] focus:ring-2 focus:ring-black/5 transition-all text-[14px] font-medium text-[#1A1A1A] placeholder:text-[#999999] outline-none resize-none"
                />
              </div>

              {activeTab === 'Tasks' && (
                <div className="p-4 bg-primary-light border border-primary-light rounded-2xl flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-primary shadow-sm">
                    <Bug size={16} />
                  </div>
                  <p className="text-xs font-bold text-primary">Note: This task will be created directly in Jira.</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 pb-6 pt-2">
              <button
                onClick={() => setShowTaskModal(false)}
                className="px-5 py-2.5 rounded-full text-[14px] font-semibold text-[#666666] border border-[#EEEEEE] bg-white hover:bg-[#F5F5F5] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowTaskModal(false)}
                className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full text-[14px] font-semibold hover:bg-primary-hover transition-colors shadow-sm"
              >
                <Check size={16} /> Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <DeleteProjectModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => {
            setShowDeleteModal(false);
            navigate('/projects');
          }}
        />
      )}
    </Layout>
  );
};

export default ProjectDetail;
