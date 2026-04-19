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
    <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950 scrollbar-hide overflow-y-auto relative">
      {/* Premium Header */}
      <div className="px-6 py-8 pb-4 shrink-0 animate-slide-up sticky top-0 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md z-20">
        <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-3xl bg-amber-100 dark:bg-amber-500/10 flex items-center justify-center text-3xl shadow-sm border border-amber-200/50 dark:border-amber-500/20 text-stone-900 dark:text-amber-500">
              👨‍🏫
            </div>
            <div>
              <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans">Teacher's Desk</h1>
              <p className="text-sm font-medium text-amber-600 dark:text-amber-500">You have no pending reviews today</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Notifications" 
            className="w-12 h-12 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-center cursor-pointer shadow-sm relative group"
          >
            <Bell size={20} className="text-stone-600 dark:text-stone-300 group-hover:text-amber-500 transition-colors" />
            <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-stone-900" />
          </motion.button>
        </div>
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 items-start">
          
          {/* Main Feed Section */}
          <div className="flex flex-col gap-10">
            {/* Hero Card - Next Session Focus */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="shrink-0 rounded-[40px] p-10 bg-stone-900 text-white border border-stone-800 shadow-xl relative overflow-hidden flex items-center justify-center min-h-[260px] group"
            >
               <div className="text-center relative z-10">
                 <div className="w-20 h-20 bg-white/10 rounded-[32px] flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/10 group-hover:scale-110 transition-transform duration-500">
                   <span className="text-3xl">📅</span>
                 </div>
                 <h3 className="text-xl font-bold text-white font-sans">No upcoming classes</h3>
                 <p className="text-sm text-stone-400 font-sans mt-3 max-w-[280px] mx-auto leading-relaxed">Your teaching schedule is clear for now. Prepare for your next session or take a well-deserved break!</p>
               </div>
               
               {/* Decorative background effects */}
               <div className="absolute -top-32 -right-32 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
               <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            </motion.div>

            {/* Action Queue Section */}
            <div className="animate-slide-up [animation-delay:0.1s]">
              <div className="flex justify-between items-end mb-6">
                <SectionLabel>Action Queue</SectionLabel>
                <button className="text-xs font-bold text-amber-600 dark:text-amber-500 hover:underline">Manage roster</button>
              </div>
              <div className="bg-white dark:bg-stone-900 rounded-[40px] border border-stone-200 dark:border-stone-800 p-20 text-center shadow-sm">
                 <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mx-auto mb-6">
                   <CheckCircle2 size={28} className="text-emerald-500" />
                 </div>
                 <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50 font-sans mb-1">Inbox Zero</h3>
                 <p className="text-sm text-stone-500 dark:text-stone-400 font-sans max-w-[240px] mx-auto">No student tasks needing your attention right now. You're completely up to date!</p>
              </div>
            </div>

            {/* Recent Submissions Section */}
            <div className="animate-slide-up [animation-delay:0.15s]">
              <SectionLabel>Recent Submissions</SectionLabel>
              <div className="bg-white dark:bg-stone-900 rounded-[40px] border border-stone-200 dark:border-stone-800 p-16 text-center shadow-sm mt-4">
                 <p className="text-base font-bold text-stone-900 dark:text-stone-50 font-sans mb-1">No submissions yet</p>
                 <p className="text-sm text-stone-500 dark:text-stone-400 font-sans max-w-[240px] mx-auto">Student work will automatically appear here once submitted by your classes.</p>
              </div>
            </div>
          </div>

          {/* Side Panels - Stats / Tips */}
          <div className="flex flex-col gap-10 sticky top-32">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-stone-900 rounded-[40px] border border-stone-200 dark:border-stone-800 p-8 shadow-sm"
            >
              <h3 className="text-xs font-bold text-stone-400 dark:text-stone-500 font-sans mb-8 uppercase tracking-widest text-center">Efficiency Matrix</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 bg-stone-50 dark:bg-stone-950 rounded-[28px] text-center border border-stone-100 dark:border-stone-800/50 group hover:border-amber-200 transition-colors">
                  <div className="text-3xl font-black text-stone-900 dark:text-stone-50 font-sans group-hover:scale-110 transition-transform">0</div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-2">Active</div>
                </div>
                <div className="p-6 bg-stone-50 dark:bg-stone-950 rounded-[28px] text-center border border-stone-100 dark:border-stone-800/50 group hover:border-emerald-200 transition-colors">
                  <div className="text-3xl font-black text-stone-900 dark:text-stone-50 font-sans group-hover:scale-110 transition-transform">0%</div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-2">Success</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-amber-500 rounded-[40px] p-10 text-white shadow-2xl shadow-amber-500/20 relative overflow-hidden group"
            >
              <div className="relative z-10">
                <h3 className="text-xl font-bold font-sans mb-3">Teacher Pro Tip</h3>
                <p className="text-sm text-amber-50 font-sans leading-relaxed opacity-90">
                  Regular feedback helps students stay motivated. We recommend grading submissions within 24 hours of receipt.
                </p>
                <div className="mt-6 w-12 h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-full bg-white"
                  />
                </div>
              </div>
              <XCircle size={120} className="absolute -bottom-10 -right-10 text-white/10 group-hover:rotate-12 transition-transform duration-700" />
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
