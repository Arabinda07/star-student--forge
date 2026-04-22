import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SUBJECTS } from "../../constants";
import { SectionLabel, Btn, Sheet } from "../shared/UI";
import { Bell, Plus, FileText, CheckCircle2, XCircle, Search } from "lucide-react";

function useClock(init = 3540) {
  const [s, setS] = useState(init);
  useEffect(() => {
    const t = setInterval(() => setS(p => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  return s;
}

const fmt = (s: number) => `${Math.floor(s / 60)}h ${s % 60}m`;

export default function TeacherHome() {
  const secs = useClock();
  const [actionOverlay, setActionOverlay] = useState(false);

  const reviews: any[] = [];
  const recent: any[] = [];

  return (
    <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950 scrollbar-hide overflow-y-auto relative premium-texture">
      {/* Premium Header */}
      <div className="px-6 py-8 pb-6 shrink-0 animate-slide-up sticky top-0 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md z-20 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-[72px] rounded-[24px] bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800/60 flex items-center justify-center text-4xl shadow-sm -rotate-3 transition-transform hover:rotate-2 hover:scale-105 duration-500">
              👨‍🏫
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-stone-50 tracking-tighter font-sans leading-none mb-2">Teacher's Desk</h1>
              <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest leading-none drop-shadow-sm">You have no pending reviews today</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Notifications" 
              className="w-14 h-14 rounded-full bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800/60 flex items-center justify-center cursor-pointer shadow-sm relative group overflow-hidden active:scale-95 transition-all"
            >
              <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Bell size={24} className="text-stone-400 dark:text-stone-500 group-hover:text-amber-500 transition-colors relative z-10" />
              <div className="absolute top-[18px] right-[18px] w-2.5 h-2.5 bg-rose-500 rounded-full border border-white dark:border-stone-900 ring-2 ring-rose-500/20" />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-10 pb-24 space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16 items-start">

          
          {/* Main Feed Section */}
          <div className="flex flex-col gap-12">
            {/* Hero Card - Next Session Focus */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="shrink-0 rounded-[48px] p-12 bg-stone-900 text-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] relative overflow-hidden flex items-center justify-center min-h-[360px] border border-stone-800 group"
            >
               <div className="text-center relative z-10">
                 <div className="w-24 h-24 bg-white/10 rounded-[32px] flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                   <span className="text-4xl">📅</span>
                 </div>
                 <h3 className="text-4xl md:text-5xl font-black text-white font-sans tracking-tight mb-4 drop-shadow-sm">No upcoming classes</h3>
                 <p className="text-base text-stone-400 font-bold mt-2 max-w-sm mx-auto leading-relaxed">Your teaching schedule is clear for now. Prepare for your next session or take a well-deserved break!</p>
               </div>
               
               {/* Decorative background effects */}
               <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
               <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none mix-blend-color-dodge mix-blend-overlay" />
            </motion.div>

            {/* Action Queue Section */}
            <div className="animate-slide-up [animation-delay:0.1s]">
              <div className="flex justify-between items-end mb-8 pl-4 pr-2">
                <SectionLabel>Action Queue</SectionLabel>
                <button className="text-[10px] font-black text-amber-600 dark:text-amber-500 hover:text-amber-700 uppercase tracking-widest transition-colors">Manage roster</button>
              </div>
              <div className="bg-white dark:bg-stone-900 rounded-[40px] border border-stone-200/60 dark:border-stone-800/60 p-20 lg:p-24 text-center shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                 <div className="absolute inset-0 bg-stone-50 dark:bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="relative z-10">
                   <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/30 rounded-[28px] border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center mx-auto mb-8 shadow-inner group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                     <CheckCircle2 size={32} className="text-emerald-500" strokeWidth={3} />
                   </div>
                   <h3 className="text-3xl font-black text-stone-900 dark:text-stone-50 font-sans tracking-tight mb-4 drop-shadow-sm">Inbox Zero</h3>
                   <p className="text-sm font-bold text-stone-500 dark:text-stone-400 font-sans max-w-[280px] mx-auto leading-relaxed">No student tasks needing your attention right now. You're completely up to date!</p>
                 </div>
              </div>
            </div>

            {/* Recent Submissions Section */}
            <div className="animate-slide-up [animation-delay:0.15s] mt-4">
              <div className="pl-4 mb-8">
                <SectionLabel>Recent Submissions</SectionLabel>
              </div>
              <div className="bg-white dark:bg-stone-900 rounded-[40px] border border-stone-200/60 dark:border-stone-800/60 p-16 text-center shadow-sm relative overflow-hidden group transition-all hover:shadow-lg">
                 <div className="absolute inset-0 bg-stone-50 dark:bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="relative z-10 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-stone-50 dark:bg-stone-800 rounded-full flex items-center justify-center mb-6 text-stone-400 dark:text-stone-500 group-hover:-translate-y-2 transition-transform duration-500 border border-stone-100 dark:border-stone-700 shadow-inner">
                       <FileText size={24} />
                    </div>
                    <p className="text-2xl font-black text-stone-900 dark:text-stone-50 font-sans tracking-tight mb-3">No submissions yet</p>
                    <p className="text-sm font-bold text-stone-500 dark:text-stone-400 font-sans max-w-[280px] mx-auto leading-relaxed">Student work will automatically appear here once submitted by your classes.</p>
                 </div>
              </div>
            </div>
          </div>

          {/* Side Panels - Stats / Tips */}
          <div className="flex flex-col gap-10 sticky top-40">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-stone-900 rounded-[40px] border border-stone-200/60 dark:border-stone-800/60 p-10 shadow-sm"
            >
              <h3 className="text-[10px] font-black text-stone-400 dark:text-stone-500 font-sans mb-8 uppercase tracking-[0.25em] text-center w-full">Efficiency Matrix</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-8 bg-stone-50 dark:bg-stone-950/50 rounded-[32px] text-center border border-stone-100 dark:border-stone-800/50 group hover:border-amber-200 dark:hover:border-amber-900/40 transition-colors shadow-inner flex flex-col justify-center min-h-[140px]">
                  <div className="text-5xl font-black text-stone-900 dark:text-stone-50 font-sans tracking-tighter group-hover:scale-110 transition-transform mb-2">0</div>
                  <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-1">Active</div>
                </div>
                <div className="p-8 bg-stone-50 dark:bg-stone-950/50 rounded-[32px] text-center border border-stone-100 dark:border-stone-800/50 group hover:border-emerald-200 dark:hover:border-emerald-900/40 transition-colors shadow-inner flex flex-col justify-center min-h-[140px]">
                  <div className="text-5xl font-black text-stone-900 dark:text-stone-50 font-sans tracking-tighter group-hover:scale-110 transition-transform mb-2">0<span className="text-2xl text-stone-400 -ml-1">%</span></div>
                  <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mt-1">Success</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-amber-400 dark:bg-amber-500 rounded-[40px] p-10 text-stone-900 shadow-xl shadow-amber-500/20 relative overflow-hidden group"
            >
              <div className="relative z-10">
                <h3 className="text-lg font-black font-sans tracking-tight mb-4 text-amber-950 flex items-center gap-2">
                  <span className="bg-amber-950 text-amber-400 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-widest">Tip</span> Teacher Pro Mode
                </h3>
                <p className="text-sm text-amber-950 font-bold leading-relaxed opacity-90 max-w-[240px]">
                  Regular feedback helps students stay motivated. We recommend grading submissions within 24 hours of receipt.
                </p>
                <div className="mt-8 w-16 h-2 bg-amber-950/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-full bg-amber-950/80"
                  />
                </div>
              </div>
              <XCircle size={160} className="absolute -bottom-16 -right-16 text-amber-950/10 group-hover:rotate-12 transition-transform duration-700 blur-[2px]" />
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none mix-blend-overlay" />
            </motion.div>
          </div>
        </div>
      </div>

      <motion.button 
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setActionOverlay(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-stone-900 text-white rounded-[24px] shadow-2xl flex items-center justify-center cursor-pointer z-30 group"
      >
        <Plus size={28} className="group-hover:stroke-[3px] transition-all" />
      </motion.button>

      <Sheet open={actionOverlay} onClose={() => setActionOverlay(false)} title="Quick Actions">
        <div className="grid grid-cols-2 gap-4">
          {[
             { title: "Assign Homework", icon: "📝", c: "bg-blue-50 text-blue-700 border-blue-200" },
             { title: "Upload Notes", icon: "📚", c: "bg-emerald-50 text-emerald-700 border-emerald-200" },
             { title: "Create Test", icon: "⚡", c: "bg-amber-50 text-amber-700 border-amber-200" },
             { title: "Message Parent", icon: "💬", c: "bg-sky-50 text-sky-700 border-sky-200" }
          ].map((a, i) => (
            <button key={i} className={`p-4 rounded-2xl border flex flex-col items-start gap-4 text-left transition-all hover:shadow-md ${a.c}`}>
               <span className="text-2xl">{a.icon}</span>
               <span className="text-sm font-bold font-sans">{a.title}</span>
            </button>
          ))}
        </div>
      </Sheet>
    </div>
  );
}
