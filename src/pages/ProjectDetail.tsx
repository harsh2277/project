import { useState } from 'react';
import { Layout } from '../components/Layout';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, MoreHorizontal, Calendar, MessageSquare, GripHorizontal, Activity, Target, Clock, Users, FileText, CheckCircle2, DownloadCloud, Search, UploadCloud, Link as LinkIcon, Check } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const initialData = {
  tasks: {
    'task-1': { id: 'task-1', content: 'Design System Update', tag: 'Design', date: 'Nov 08', comments: 3 },
    'task-2': { id: 'task-2', content: 'User Research Synthesis', tag: 'Research', date: 'Nov 09', comments: 1 },
    'task-3': { id: 'task-3', content: 'Homepage Hero Redesign', tag: 'UI', date: 'Nov 10', comments: 5 },
    'task-4': { id: 'task-4', content: 'Responsive Testing', tag: 'QA', date: 'Nov 12', comments: 0 },
    'task-5': { id: 'task-5', content: 'Performance Audit', tag: 'Dev', date: 'Nov 14', comments: 2 },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: ['task-1', 'task-2'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: ['task-3'],
    },
    'column-3': {
      id: 'column-3',
      title: 'In Review',
      taskIds: ['task-4'],
    },
    'column-4': {
      id: 'column-4',
      title: 'Completed',
      taskIds: ['task-5'],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3', 'column-4'],
};

const getTagColor = (tag: string) => {
  switch(tag) {
    case 'Design': return 'bg-pink-50 text-pink-600';
    case 'Research': return 'bg-amber-50 text-amber-600';
    case 'UI': return 'bg-violet-50 text-violet-600';
    case 'QA': return 'bg-blue-50 text-blue-600';
    case 'Dev': return 'bg-emerald-50 text-emerald-600';
    default: return 'bg-slate-50 text-slate-600';
  }
};

const ProjectDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState(initialData);

  const [activeTab, setActiveTab] = useState('Overview');

  // ... drag and drop function omitted for brevity in thought, I will place all body here.

  const onDragEnd = (result: any) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startColumn = data.columns[source.droppableId as keyof typeof data.columns];
    const finishColumn = data.columns[destination.droppableId as keyof typeof data.columns];

    if (startColumn === finishColumn) {
      const newTaskIds = Array.from(startColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...startColumn,
        taskIds: newTaskIds,
      };

      setData({
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      });
      return;
    }

    const startTaskIds = Array.from(startColumn.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...startColumn,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finishColumn.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finishColumn,
      taskIds: finishTaskIds,
    };

    setData({
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    });
  };

  return (
    <Layout>
      <div className="w-full h-full flex flex-col">
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between xl:mb-2 mb-2 gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/projects')}
              className="p-2.5 bg-white border border-[#f5f5f5] rounded-2xl text-slate-400 hover:text-slate-800 hover:shadow-sm transition-all"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-slate-800 tracking-tight">BoostApp Social Revamp</h1>
                <span className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-lg text-[11px] font-bold">On Track</span>
              </div>
              <p className="text-sm font-medium text-slate-500 mt-1">Marketing Division • Created Oct 12, 2024</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex -space-x-2 mr-2">
                <div className="w-9 h-9 rounded-full border-2 border-[#f8f9fa] bg-indigo-100 flex items-center justify-center text-[11px] font-bold text-indigo-700 relative z-20">AL</div>
                <div className="w-9 h-9 rounded-full border-2 border-[#f8f9fa] bg-rose-100 flex items-center justify-center text-[11px] font-bold text-rose-700 relative z-10">SA</div>
             </div>
            <button className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 rounded-xl shadow-sm text-sm font-bold text-white hover:bg-violet-700 transition-colors">
              <Plus size={18} /> Add Task
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-slate-100 shrink-0 mb-6">
          {['Overview', 'Board', 'Files', 'Activity'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-4 text-[14.5px] font-bold transition-all relative ${
                activeTab === tab 
                  ? 'text-violet-600' 
                  : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <div className="absolute bottom-0 left-0 w-full h-[3px] bg-violet-600 rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        {/* OVERVIEW CONTENT */}
        {activeTab === 'Overview' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 pb-8 overflow-y-auto pr-1">
            
            {/* Left Col */}
            <div className="xl:col-span-2 space-y-6">
              {/* Description Box */}
              <div className="bg-white p-7 md:p-8 rounded-[2rem] border border-[#f5f5f5]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Target size={20} />
                  </div>
                  <h2 className="text-[17px] font-bold text-slate-800">Project Goal & Scope</h2>
                </div>
                <p className="text-[14.5px] leading-relaxed text-slate-500 font-medium">
                  We are embarking on a comprehensive redesign of the main marketing website. The primary objective is to significantly improve conversion rate optimization through A/B testing and to overhaul the user experience for seamless navigation. We aim to launch this prior to the Q4 holiday stretch, focusing explicitly on mobile-first interactions and reduced payload times.
                </p>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-[2rem] border border-[#f5f5f5] flex flex-col">
                  <div className="text-slate-400 mb-4"><CheckCircle2 size={24} /></div>
                  <h4 className="text-[28px] font-extrabold text-slate-800 mb-1">68%</h4>
                  <p className="text-[13px] font-bold text-slate-500">Overall Progress</p>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-[#f5f5f5] flex flex-col">
                  <div className="text-violet-400 mb-4"><Activity size={24} /></div>
                  <h4 className="text-[28px] font-extrabold text-slate-800 mb-1">12</h4>
                  <p className="text-[13px] font-bold text-slate-500">Open Tasks</p>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-[#f5f5f5] flex flex-col">
                  <div className="text-emerald-400 mb-4"><Clock size={24} /></div>
                  <h4 className="text-[28px] font-extrabold text-slate-800 mb-1">14h</h4>
                  <p className="text-[13px] font-bold text-slate-500">Tracked Time</p>
                </div>
              </div>

              {/* Recent Documents */}
              <div className="bg-white p-7 md:p-8 rounded-[2rem] border border-[#f5f5f5]">
                 <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                        <FileText size={20} />
                      </div>
                      <h2 className="text-[17px] font-bold text-slate-800">Recent Deliverables</h2>
                    </div>
                    <button className="text-sm font-bold text-violet-600 hover:text-violet-700">View All</button>
                 </div>
                 <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center font-bold text-xs">PDF</div>
                          <div>
                            <p className="text-[14px] font-bold text-slate-700 group-hover:text-violet-600 transition-colors">Wireframes_v2.pdf</p>
                            <p className="text-[12px] font-medium text-slate-400">Added yesterday by Alex</p>
                          </div>
                       </div>
                    </div>
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group">
                       <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-xs">DOC</div>
                          <div>
                            <p className="text-[14px] font-bold text-slate-700 group-hover:text-violet-600 transition-colors">Copywriting_Draft.docx</p>
                            <p className="text-[12px] font-medium text-slate-400">Added 3 days ago by Sarah</p>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

            </div>

            {/* Right Col */}
            <div className="space-y-6">
               <div className="bg-white p-7 md:p-8 rounded-[2rem] border border-[#f5f5f5]">
                  <h2 className="text-[17px] font-bold text-slate-800 mb-6">Details</h2>
                  <div className="space-y-5">
                    
                    <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-bold text-slate-400">Status</span>
                      <span className="text-[14px] font-bold text-emerald-600 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-bold text-slate-400">Due Date</span>
                      <span className="text-[14px] font-bold text-slate-700 flex items-center gap-2">
                        <Calendar size={16} className="text-slate-400" /> Nov 07, 2024
                      </span>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[13px] font-bold text-slate-400">Budget</span>
                      <span className="text-[14px] font-bold text-slate-700">$12,000 / $15,000</span>
                    </div>

                  </div>
               </div>

               <div className="bg-white p-7 md:p-8 rounded-[2rem] border border-[#f5f5f5]">
                  <div className="flex items-center gap-2 mb-6">
                    <Users size={20} className="text-slate-400" />
                    <h2 className="text-[17px] font-bold text-slate-800">Team Resources</h2>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-[12px] font-bold text-indigo-700">AL</div>
                        <div>
                          <p className="text-[14px] font-bold text-slate-700">Alex Lee</p>
                          <p className="text-[12px] font-medium text-slate-400">Lead Designer</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-[12px] font-bold text-rose-700">SA</div>
                        <div>
                          <p className="text-[14px] font-bold text-slate-700">Sarah Adams</p>
                          <p className="text-[12px] font-medium text-slate-400">Project Manager</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>

          </div>
        )}

        {/* BOARD CONTENT */}
        {activeTab === 'Board' && (
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 h-full items-start w-max">
              {data.columnOrder.map(columnId => {
                const column = data.columns[columnId as keyof typeof data.columns];
                const tasks = column.taskIds.map(taskId => data.tasks[taskId as keyof typeof data.tasks]);

                return (
                  <div key={column.id} className="flex flex-col w-[320px] max-h-full">
                    {/* Column Header */}
                    <div className="flex justify-between items-center mb-4 px-2 shrink-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-[15px] text-slate-800">{column.title}</h3>
                        <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md text-[11px] font-bold">
                          {tasks.length}
                        </span>
                      </div>
                      <button className="text-slate-400 hover:text-slate-700 transition-colors p-1 rounded-md hover:bg-slate-100">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>

                    {/* Droppable Area */}
                    <Droppable droppableId={column.id}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className={`flex-1 transition-colors min-h-[150px] p-2 rounded-2xl ${
                            snapshot.isDraggingOver ? 'bg-slate-50 border border-slate-200' : 'bg-transparent border border-transparent'
                          }`}
                        >
                          <div className="flex flex-col gap-3">
                            {tasks.map((task, index) => (
                              <Draggable key={task.id} draggableId={task.id} index={index}>
                                {(provided, snapshot) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`bg-white p-5 rounded-2xl border ${
                                      snapshot.isDragging ? 'border-violet-300 shadow-[0_20px_40px_rgba(124,58,237,0.15)] scale-[1.02] rotate-1 z-50' : 'border-[#f5f5f5] shadow-sm'
                                    } transition-all duration-300 ease-out group`}
                                  >
                                    <div className="flex justify-between items-start mb-3">
                                      <div className={`px-2.5 py-1 rounded-[8px] text-[11px] font-bold ${getTagColor(task.tag)}`}>
                                        {task.tag}
                                      </div>
                                      <div
                                        {...provided.dragHandleProps}
                                        className="text-slate-300 hover:text-slate-500 cursor-grab active:cursor-grabbing p-1 transition-colors"
                                      >
                                        <GripHorizontal size={16} />
                                      </div>
                                    </div>
                                    
                                    <p className="font-bold text-[14px] text-slate-800 mb-4 leading-tight group-hover:text-violet-600 transition-colors">
                                      {task.content}
                                    </p>

                                    <div className="flex items-center justify-between text-slate-400">
                                      <div className="flex items-center gap-1.5 text-[12px] font-semibold">
                                        <Calendar size={14} />
                                        {task.date}
                                      </div>
                                      <div className="flex items-center gap-1.5 text-[12px] font-semibold">
                                        <MessageSquare size={14} />
                                        {task.comments}
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </div>
                        </div>
                      )}
                    </Droppable>

                    {/* Add Task Button beneath column */}
                    <button className="flex items-center gap-2 mt-2 px-4 py-3 shrink-0 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 font-bold text-[13px] hover:border-slate-300 hover:bg-slate-50 hover:text-slate-600 transition-all w-full justify-center group pointer-events-auto">
                      <Plus size={16} className="group-hover:scale-110 transition-transform" />
                      Add Task
                    </button>
                  </div>
                );
              })}
            </div>
          </DragDropContext>
        )}

        {/* FILES CONTENT */}
        {activeTab === 'Files' && (
          <div className="flex flex-col gap-6 pb-8 pr-1 overflow-y-auto">
            {/* Upload Zone */}
            <div className="w-full border-2 border-dashed border-slate-200 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center bg-[#f8f9fa] hover:bg-slate-50 hover:border-violet-300 transition-all cursor-pointer group">
              <div className="w-16 h-16 bg-white text-slate-400 group-hover:bg-violet-50 group-hover:text-violet-600 transition-colors rounded-[1.5rem] flex items-center justify-center mb-5 shadow-sm border border-slate-100 group-hover:border-violet-100">
                <UploadCloud size={28} />
              </div>
              <h3 className="text-[16px] font-bold text-slate-700 mb-1">Click to upload newest deliverables</h3>
              <p className="text-[14px] font-medium text-slate-500">Supported formats: PDF, DOCX, ZIP, Figma up to 50MB</p>
            </div>

            {/* Files List Details */}
            <div className="bg-white rounded-[2rem] border border-[#f5f5f5] p-6 md:p-8">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-[17px] font-bold text-slate-800">All Project Files</h2>
                <div className="w-64 relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Search size={16} /></span>
                  <input type="text" placeholder="Search files..." className="w-full pl-11 pr-4 py-3 bg-slate-50 border-transparent rounded-2xl text-[14px] font-bold text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 outline-none transition-all" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { name: "Wireframes_v2.pdf", size: "4.2 MB", type: "PDF", color: "text-rose-500 bg-rose-50" },
                  { name: "Copywriting_Draft.docx", size: "12 KB", type: "DOC", color: "text-blue-500 bg-blue-50" },
                  { name: "User_Research_Data.zip", size: "14.8 MB", type: "ZIP", color: "text-amber-500 bg-amber-50" },
                  { name: "Figma_Prototype_Links", size: "1 KB", type: "URL", color: "text-emerald-500 bg-emerald-50" },
                  { name: "Brand_Guidelines_2024.pdf", size: "8.1 MB", type: "PDF", color: "text-rose-500 bg-rose-50" },
                ].map((file, i) => (
                  <div key={i} className="flex flex-col p-5 rounded-3xl border border-slate-100 hover:border-violet-100 hover:shadow-sm transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center font-bold text-[13px] ${file.color}`}>
                        {file.type}
                      </div>
                      <button className="text-slate-400 hover:text-violet-600 bg-slate-50 hover:bg-violet-50 p-2 rounded-xl transition-colors">
                        <DownloadCloud size={16} />
                      </button>
                    </div>
                    <h4 className="text-[15px] font-bold text-slate-800 mb-1 truncate">{file.name}</h4>
                    <p className="text-[13px] font-medium text-slate-400">{file.size} • Version 1.0</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ACTIVITY CONTENT */}
        {activeTab === 'Activity' && (
          <div className="w-full max-w-4xl mx-auto pb-8 pr-1">
            
            {/* Charts & Metrics Dashboard */}
            <div className="bg-white rounded-[2rem] border border-[#f5f5f5] p-8 md:p-10 mb-8 flex flex-col md:flex-row gap-8">
               <div className="flex-1">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[17px] font-bold text-slate-800">Activity Velocity (Past 7 Days)</h3>
                    <span className="text-[12px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-[8px]">+14% vs last week</span>
                  </div>
                  
                  <div className="flex items-end justify-between h-40 gap-3 xl:gap-4">
                     {[
                        { day: 'Mon', value: 40, count: 4 },
                        { day: 'Tue', value: 75, count: 7 },
                        { day: 'Wed', value: 45, count: 4 },
                        { day: 'Thu', value: 90, count: 9 },
                        { day: 'Fri', value: 65, count: 6 },
                        { day: 'Sat', value: 25, count: 2 },
                        { day: 'Sun', value: 35, count: 3 },
                     ].map(stat => (
                        <div key={stat.day} className="flex flex-col items-center gap-3 w-full group cursor-pointer relative">
                           {/* Hover tooltip */}
                           <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap pointer-events-none">
                              {stat.count} Actions
                           </div>

                           <div className="w-full bg-slate-50 hover:bg-slate-100 rounded-[12px] relative overflow-hidden flex items-end h-full transition-colors">
                              <div className="w-full bg-violet-600 rounded-[12px] transition-all duration-500 hover:bg-violet-500 shadow-[0_0_15px_rgba(124,58,237,0.3)]" style={{ height: `${stat.value}%` }}></div>
                           </div>
                           <span className="text-[12px] font-bold text-slate-400 group-hover:text-slate-700 transition-colors">{stat.day}</span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Right Side Stats block */}
               <div className="w-full md:w-56 flex flex-col gap-6 justify-center border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
                  <div>
                     <p className="text-[13px] font-bold text-slate-500 mb-1">Weekly Actions Total</p>
                     <h4 className="text-[32px] font-extrabold text-slate-800">35</h4>
                  </div>
                  <div className="w-full h-[1px] bg-slate-100"></div>
                  <div>
                     <p className="text-[13px] font-bold text-slate-500 mb-1">Productivity Score</p>
                     <h4 className="text-[32px] font-extrabold text-violet-600">92%</h4>
                  </div>
               </div>
            </div>

            {/* Timeline Area */}
            <div className="bg-white rounded-[2rem] border border-[#f5f5f5] p-8 md:p-10 mb-8">
              <h2 className="text-[19px] font-bold text-slate-800 mb-8">Detailed Timeline</h2>
              
              <div className="relative border-l-2 border-slate-100 ml-4 space-y-10">
                
                <div className="relative pl-8">
                  <div className="absolute -left-[18px] top-1 w-9 h-9 rounded-full bg-violet-100 border-4 border-white flex items-center justify-center text-violet-600 shadow-sm">
                    <Check size={16} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold text-slate-400 mb-1">Today, 10:42 AM</span>
                    <p className="text-[15px] text-slate-700 font-medium whitespace-pre-wrap"><span className="font-bold text-slate-800">Alex Lee</span> moved task <span className="font-bold text-indigo-600">"Design System Update"</span> to Completed.</p>
                  </div>
                </div>

                <div className="relative pl-8">
                  <div className="absolute -left-[18px] top-1 w-9 h-9 rounded-full bg-rose-100 border-4 border-white flex items-center justify-center text-rose-600 shadow-sm">
                    <MessageSquare size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold text-slate-400 mb-1">Yesterday, 4:15 PM</span>
                    <p className="text-[15px] text-slate-700 font-medium whitespace-pre-wrap"><span className="font-bold text-slate-800">Sarah Adams</span> commented on <span className="font-bold text-indigo-600">"Homepage Hero Redesign"</span></p>
                    <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-[14px] text-slate-600 italic">
                      "I think we need to push the image assets through tinypng before uploading them. They're feeling a bit heavy on mobile."
                    </div>
                  </div>
                </div>

                <div className="relative pl-8">
                  <div className="absolute -left-[18px] top-1 w-9 h-9 rounded-full bg-emerald-100 border-4 border-white flex items-center justify-center text-emerald-600 shadow-sm">
                    <UploadCloud size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold text-slate-400 mb-1">Nov 05, 9:20 AM</span>
                    <p className="text-[15px] text-slate-700 font-medium whitespace-pre-wrap"><span className="font-bold text-slate-800">Alex Lee</span> uploaded a new file <span className="font-bold text-slate-800">Wireframes_v2.pdf</span>.</p>
                  </div>
                </div>
                
                <div className="relative pl-8">
                  <div className="absolute -left-[18px] top-1 w-9 h-9 rounded-full bg-sky-100 border-4 border-white flex items-center justify-center text-sky-600 shadow-sm">
                    <Target size={14} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[12px] font-bold text-slate-400 mb-1">Oct 12, 11:00 AM</span>
                    <p className="text-[15px] text-slate-700 font-medium whitespace-pre-wrap"><span className="font-bold text-slate-800">Tony Moore</span> created the project <span className="font-bold text-indigo-600">"BoostApp Social Revamp"</span> and added 2 members.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProjectDetail;
