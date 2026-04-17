import React from 'react';
import { Layout, Mail, ChevronLeft, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-page relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      
      <div className="w-full max-w-md relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5"
        >
          {/* Header Section */}
          <div className="p-8 pb-10 relative overflow-hidden">
            <div className="flex justify-between items-start relative z-10">
              <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                <Layout className="text-white w-6 h-6" />
              </div>
              <button className="text-white/40 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mt-8 relative z-10">
              <h1 className="text-3xl font-bold text-white leading-tight">
                Forgot your <br />
                <span className="text-primary italic">password?</span>
              </h1>
              <p className="text-white/50 text-sm mt-2">
                Don't worry, it happens. Enter your email and we'll send you a reset link.
              </p>
            </div>

            {/* Abstract Decorative Element */}
            <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/5 rounded-full blur-2xl" />
          </div>

          {/* Body Section */}
          <div className="bg-card p-8 pt-10 rounded-t-[2.5rem] border-t border-border">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div className="space-y-1.5">
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5" />
                    <input 
                      type="email" 
                      placeholder="Email address"
                      className="w-full pl-14 pr-5 py-4 bg-page border border-border rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-text-muted text-text-main"
                    />
                  </div>
              </div>

              <button 
                type="submit"
                className="w-full py-4 bg-primary hover:opacity-90 text-white rounded-2xl font-bold text-base shadow-lg shadow-primary/25 transition-all mt-4 tracking-wide uppercase"
              >
                Send Reset Link
              </button>
            </form>

            <div className="mt-8">
              <Link to="/login" className="flex items-center justify-center gap-2 text-text-muted hover:text-primary transition-colors font-semibold text-sm">
                <ChevronLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
