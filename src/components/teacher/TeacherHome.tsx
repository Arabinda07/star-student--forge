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

  return (
    <div className="h-full flex flex-col bg-white dark:bg-stone-950 scrollbar-hide overflow-y-auto relative">
      {/* Refined Header */}
      <div className="px-10 py-12 shrink-0 border-b border-stone-100 dark:border-stone-900 sticky top-0 bg-white/80 dark:bg-stone-950/80 backdrop-blur-md z-20">
        <div className="max-w-5xl mx-auto w-full flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-heading tracking-tight mb-1 uppercase">Teacher's Desk</h1>
            <p className="text-[10px] font-medium text-muted uppercase tracking-[0.2em] leading-none">Workspace Status: Operational</p>
          </div>
          <button 
            aria-label="Notifications" 
            className="w-10 h-10 rounded-full border border-stone-100 dark:border-stone-800 flex items-center justify-center text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors bg-transparent cursor-pointer"
          >
            <Bell size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 w-full max-w-5xl mx-auto px-10 py-16 space-y-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-20 items-start">
          
          {/* Main Feed Section */}
          <div className="flex flex-col gap-16">
            {/* Hero Card - Next Session Focus */}
            <div className="rounded-3xl p-16 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800/50 text-center shadow-sm">
               <div className="w-14 h-14 bg-stone-50 dark:bg-stone-800 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-stone-100 dark:border-stone-700 shadow-inner">
                 <span className="text-2xl">📅</span>
               </div>
               <h3 className="text-2xl font-bold text-heading font-display tracking-tight mb-4 uppercase">Next session not scheduled</h3>
               <p className="text-[11px] text-muted font-medium max-w-xs mx-auto leading-relaxed uppercase tracking-wider">Your teaching workspace is clear. Review past records or prepare new modules.</p>
            </div>

            {/* Action Queue Section */}
            <div className="animate-slide-up">
              <div className="flex justify-between items-end mb-8">
                <SectionLabel>Action Queue</SectionLabel>
                <button className="text-[11px] font-semibold text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 uppercase tracking-wider transition-colors bg-transparent border-none cursor-pointer">Manage roster</button>
              </div>
              <div className="bg-white dark:bg-stone-950 rounded-3xl border border-stone-100 dark:border-stone-900/50 p-16 text-center">
                 <div className="w-10 h-10 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-100 dark:border-stone-800 flex items-center justify-center mx-auto mb-6">
                   <CheckCircle2 size={20} className="text-stone-200" />
                 </div>
                 <h3 className="text-xl font-bold text-heading font-display tracking-tight mb-3 uppercase">Inbox Clear</h3>
                 <p className="text-[11px] font-medium text-muted max-w-[200px] mx-auto leading-relaxed uppercase tracking-widest">No student tasks pending review.</p>
              </div>
            </div>
          </div>

          {/* Side Panels - Stats */}
          <div className="flex flex-col gap-12 sticky top-40">
            <div className="bg-white dark:bg-stone-950 rounded-3xl border border-stone-100 dark:border-stone-900 p-8">
              <h3 className="text-[11px] font-semibold text-stone-400 dark:text-stone-600 font-sans mb-10 uppercase tracking-widest text-center">Activity this week</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-stone-50 dark:bg-stone-900/30 rounded-2xl text-center border border-stone-100 dark:border-stone-800/50">
                  <div className="text-3xl font-bold text-heading tracking-tight mb-1">0</div>
                  <div className="text-[9px] font-bold text-muted uppercase tracking-widest">Active</div>
                </div>
                <div className="p-5 bg-stone-50 dark:bg-stone-900/30 rounded-2xl text-center border border-stone-100 dark:border-stone-800/50">
                  <div className="text-3xl font-bold text-heading tracking-tight mb-1">0%</div>
                  <div className="text-[9px] font-bold text-muted uppercase tracking-widest">Rate</div>
                </div>
              </div>
            </div>

            <div className="bg-stone-900 dark:bg-stone-100 rounded-3xl p-8 text-white dark:text-stone-900">
              <h3 className="text-[11px] font-bold font-sans tracking-widest mb-4 uppercase opacity-60">Refined Tip</h3>
              <p className="text-[14px] font-medium leading-relaxed opacity-90">
                Regular feedback helps students stay motivated. We recommend grading submissions within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={() => setActionOverlay(true)}
        className="fixed bottom-10 right-10 w-14 h-14 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-full shadow-xl flex items-center justify-center cursor-pointer z-30 transition-transform active:scale-95"
      >
        <Plus size={24} />
      </button>

      <Sheet open={actionOverlay} onClose={() => setActionOverlay(false)} title="Quick Actions">
        <div className="grid grid-cols-2 gap-4">
          {[
             { title: "Assign Homework", icon: "📝" },
             { title: "Upload Notes", icon: "📚" },
             { title: "Create Test", icon: "⚡" },
             { title: "Message Parent", icon: "💬" }
          ].map((a, i) => (
            <button key={i} className="p-6 rounded-2xl border border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 flex flex-col items-start gap-4 text-left transition-colors hover:bg-stone-50 dark:hover:bg-stone-800 cursor-pointer">
               <span className="text-2xl">{a.icon}</span>
               <span className="text-[11px] font-bold uppercase tracking-widest font-sans text-heading">{a.title}</span>
            </button>
          ))}
        </div>
      </Sheet>
    </div>
  );
}

