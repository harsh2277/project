import React, { useState } from 'react';
import { Layout } from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { 
  FolderPlus, Clock, CheckCircle2, AlertCircle, Calendar as CalendarIcon, CheckSquare, ArrowRight
} from 'lucide-react';

const ProjectCard = ({ title, status, dueDate, progress, tasks }: any) => {
  const getStatusColor = () => {
    switch(status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-600';
      case 'In Progress': return 'bg-indigo-50 text-indigo-600';
      case 'Delayed': return 'bg-orange-50 text-orange-600';
      case 'At Risk': return 'bg-rose-50 text-rose-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  const getStatusIcon = () => {
    switch(status) {
      case 'Completed': return <CheckCircle2 size={14} />;
      case 'In Progress': return <Clock size={14} />;
      case 'Delayed': return <AlertCircle size={14} />;
      case 'At Risk': return <AlertCircle size={14} />;
      default: return <Clock size={14} />;
    }
  };

  return (
    <div className="bg-white p-7 rounded-3xl border border-[#f5f5f5] flex flex-col group cursor-pointer">
      
      <div className="flex justify-between items-start mb-5">
        <div className={`px-3 py-1.5 rounded-xl text-[12px] font-bold flex items-center gap-1.5 ${getStatusColor()}`}>
          {getStatusIcon()} {status}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[12px] font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl">
            <CalendarIcon size={14} />
            {dueDate}
          </div>
          <button className="p-1.5 text-slate-400 bg-slate-50 rounded-xl transition-all duration-300 group-hover:bg-violet-600 group-hover:text-white">
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:-rotate-45" />
          </button>
        </div>
      </div>

      <h3 className="text-[19px] font-bold text-slate-800 mb-2.5 tracking-tight group-hover:text-violet-600 transition-colors">
        {title}
      </h3>
      
      <p className="text-[14px] font-medium text-slate-500 mb-8 flex-1 line-clamp-2 leading-relaxed">
        A comprehensive redesign of the main marketing website focusing on conversion rate optimization and user experience.
      </p>

      <div className="mt-auto">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-[13px] font-bold text-slate-600">
            <CheckSquare size={16} className="text-violet-500" />
            {tasks} Tasks
          </div>
          <div className="text-[13px] font-bold text-slate-800">
            {progress}% Completed
          </div>
        </div>
        
        <div className="w-full bg-slate-100 rounded-full h-2">
          <div 
            className="bg-violet-600 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      
    </div>
  );
};

const MOCK_PROJECTS = [
  {
    id: 1,
    title: "BoostApp Social Revamp",
    status: "Completed",
    dueDate: "Nov 07, 2024",
    progress: 100,
    tasks: 42,
    team: [{ initials: 'AL', bg: 'bg-indigo-100 text-indigo-600' }, { initials: 'SA', bg: 'bg-rose-100 text-rose-600' }]
  },
  {
    id: 2,
    title: "Brainbubble Research",
    status: "In Progress",
    dueDate: "Nov 23, 2024",
    progress: 65,
    tasks: 18,
    team: [{ initials: 'MK', bg: 'bg-emerald-100 text-emerald-600' }, { initials: 'JN', bg: 'bg-amber-100 text-amber-600' }, { initials: 'EM', bg: 'bg-purple-100 text-purple-600' }]
  },
  {
    id: 3,
    title: "EcoLeadpunt Website",
    status: "Delayed",
    dueDate: "Nov 12, 2024",
    progress: 40,
    tasks: 24,
    team: [{ initials: 'LC', bg: 'bg-rose-100 text-rose-600' }]
  },
  {
    id: 4,
    title: "Drip Page A/B Test",
    status: "At Risk",
    dueDate: "Nov 24, 2024",
    progress: 15,
    tasks: 8,
    team: [{ initials: 'TM', bg: 'bg-blue-100 text-blue-600' }, { initials: 'KT', bg: 'bg-orange-100 text-orange-600' }]
  },
  {
    id: 5,
    title: "Design System v2",
    status: "In Progress",
    dueDate: "Dec 01, 2024",
    progress: 80,
    tasks: 56,
    team: [{ initials: 'CR', bg: 'bg-teal-100 text-teal-600' }, { initials: 'VR', bg: 'bg-slate-200 text-slate-700' }]
  },
  {
    id: 6,
    title: "Marketing Assets Q4",
    status: "In Progress",
    dueDate: "Dec 15, 2024",
    progress: 35,
    tasks: 12,
    team: [{ initials: 'PL', bg: 'bg-sky-100 text-sky-600' }]
  }
];

const Projects = () => {
  const [activeTab, setActiveTab] = useState("All Projects");
  const navigate = useNavigate();

  const filteredProjects = MOCK_PROJECTS.filter(p => {
    if (activeTab === "All Projects") return true;
    if (activeTab === "In Progress") return p.status === "In Progress" || p.status === "Delayed" || p.status === "At Risk";
    if (activeTab === "Completed") return p.status === "Completed";
    if (activeTab === "Archived") return p.status === "Archived";
    return true;
  });

  return (
    <Layout>
      <div className="w-full">
        {/* Projects Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Active Projects</h1>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/projects/new')}
              className="flex items-center gap-2 px-4 py-2 bg-violet-600 rounded-xl shadow-sm border border-transparent text-sm font-semibold text-white hover:bg-violet-700 transition-colors"
            >
              <FolderPlus size={16} /> New Project
            </button>
          </div>
        </div>

        {/* Filters/Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-px">
          {["All Projects", "In Progress", "Completed", "Archived"].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm transition-colors ${
                activeTab === tab 
                  ? 'font-bold text-violet-600 border-b-2 border-violet-600 -mb-px' 
                  : 'font-semibold text-slate-500 hover:text-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-4">
          {filteredProjects.map(project => (
            <div key={project.id} onClick={() => navigate(`/projects/${project.id}`)} className="h-full">
              <ProjectCard {...project} />
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
};

export default Projects;
