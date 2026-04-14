import { Layout } from '../components/Layout';
import { ArrowLeft, Calendar, Briefcase, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CreateProject = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <div className="w-full max-w-4xl mx-auto pb-12">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate('/projects')}
            className="p-2.5 bg-white border border-[#f5f5f5] rounded-2xl text-slate-400 hover:text-slate-800 hover:shadow-sm transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Create a New Project</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Setup your project details and assign resources.</p>
          </div>
        </div>

        {/* Main Card container */}
        <div className="bg-white rounded-[2rem] border border-[#f5f5f5] p-8 md:p-10">
          
          <form className="space-y-12">
            
            {/* Section 1: Basic Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-violet-50 flex items-center justify-center text-violet-600">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Basic Details</h2>
                  <p className="text-sm font-medium text-slate-400">Name and description of your project.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-2">Project Name <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    placeholder="e.g. Website Redesign Q4" 
                    className="w-full px-5 py-4 bg-[#f8f9fa] border border-transparent rounded-2xl focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none" 
                  />
                </div>
                
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-2">Description</label>
                  <textarea 
                    rows={4}
                    placeholder="Briefly describe what this project is about..." 
                    className="w-full px-5 py-4 bg-[#f8f9fa] border border-transparent rounded-2xl focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all font-medium text-slate-700 placeholder:text-slate-400 focus:outline-none resize-none" 
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Timeline & Status */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
                <div className="w-10 h-10 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600">
                  <Calendar size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Timeline & Status</h2>
                  <p className="text-sm font-medium text-slate-400">Set the schedule and current state.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-2">Start Date</label>
                  <input 
                    type="date" 
                    className="w-full px-5 py-4 bg-[#f8f9fa] border border-transparent rounded-2xl focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all font-medium text-slate-600 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-2">Due Date</label>
                  <input 
                    type="date" 
                    className="w-full px-5 py-4 bg-[#f8f9fa] border border-transparent rounded-2xl focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all font-medium text-slate-600 focus:outline-none" 
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-bold text-slate-700 mb-2">Priority</label>
                  <div className="relative">
                    <select className="w-full px-5 py-4 bg-[#f8f9fa] border border-transparent rounded-2xl focus:bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 transition-all font-medium text-slate-600 appearance-none focus:outline-none">
                      <option>High Priority</option>
                      <option>Medium Priority</option>
                      <option>Low Priority</option>
                    </select>
                    {/* Custom Dropdown Arrow */}
                    <div className="absolute inset-y-0 right-5 flex items-center pointer-events-none">
                       <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>



            {/* Submit Block */}
            <div className="pt-6 mt-8 border-t border-[#f5f5f5] flex items-center justify-between">
              <button 
                type="button"
                onClick={() => navigate('/projects')}
                className="px-6 py-3.5 rounded-2xl font-bold text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
              >
                Discard
              </button>
              
              <button 
                type="button"
                onClick={() => navigate('/projects')}
                className="flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold text-white bg-violet-600 hover:bg-violet-700 transition-colors shadow-[0_8px_20px_rgba(124,58,237,0.2)]"
              >
                <Check size={18} /> Create Project
              </button>
            </div>

          </form>

        </div>
      </div>
    </Layout>
  );
};

export default CreateProject;
