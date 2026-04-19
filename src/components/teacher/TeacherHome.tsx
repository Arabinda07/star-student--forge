import { useState, useEffect } from "react";
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
    <div className="h-full flex flex-col overflow-y-auto scrollbar-hide bg-stone-50 dark:bg-stone-950 relative">
      {/* Header */}
      <div className="px-6 py-6 pb-4 shrink-0 animate-slide-up flex justify-between items-start w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 flex items-center justify-center text-3xl shadow-sm border border-amber-200">
            👨‍🏫
          </div>
          <div>
            <div className="text-xl font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans leading-tight mb-0.5">
              Welcome back
            </div>
            <div className="text-sm font-medium text-amber-600 dark:text-amber-500 font-sans">
              You have no pending reviews today
            </div>
          </div>
        </div>
        <button aria-label="Notifications" className="w-11 h-11 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-center cursor-pointer shadow-sm relative hover:bg-stone-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500">
          <Bell size={20} className="text-stone-600 dark:text-stone-300" />
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-8 items-start">
          
          {/* Main Feed */}
          <div className="flex flex-col gap-10">
            {/* Hero Card */}
            <div className="shrink-0 rounded-[32px] p-8 bg-stone-900 text-white relative overflow-hidden animate-slide-up [animation-delay:0.05s] shadow-xl flex items-center justify-center min-h-[220px]">
               <div className="text-center relative z-10">
                 <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/10">
                   <span className="text-2xl">📅</span>
                 </div>
                 <p className="text-lg font-bold text-white font-sans leading-tight">No upcoming classes</p>
                 <p className="text-sm text-stone-400 font-sans mt-2 max-w-xs mx-auto">Your teaching schedule is clear for now. Use the time to prepare!</p>
               </div>
               
               {/* Decorative background effects */}
               <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
               <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
            </div>

            {/* Action Queue */}
            <div className="shrink-0 animate-slide-up [animation-delay:0.1s]">
              <div className="flex justify-between items-end mb-6">
                <SectionLabel>Action Queue</SectionLabel>
                <button className="text-xs font-bold text-amber-600 dark:text-amber-500 hover:underline">Manage Queue</button>
              </div>
              <div className="bg-white dark:bg-stone-900 rounded-[32px] border border-stone-200 dark:border-stone-800 p-12 text-center shadow-sm">
                 <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
                   <CheckCircle2 size={28} className="text-emerald-500" />
                 </div>
                 <p className="text-base font-bold text-stone-900 dark:text-stone-50 font-sans mb-1">Inbox Zero</p>
                 <p className="text-sm text-stone-500 font-sans">You have no student tasks needing review or attention.</p>
              </div>
            </div>

            {/* Recent Submissions */}
            <div className="shrink-0 animate-slide-up [animation-delay:0.15s]">
              <SectionLabel>Recent Submissions</SectionLabel>
              <div className="bg-white dark:bg-stone-900 rounded-[32px] border border-stone-200 dark:border-stone-800 p-10 text-center shadow-sm mt-4">
                 <p className="text-base font-bold text-stone-900 dark:text-stone-50 font-sans mb-1">No submissions yet</p>
                 <p className="text-sm text-stone-500 font-sans">Student work will automatically appear here once submitted.</p>
              </div>
            </div>
          </div>

          {/* Quick Stats / Sidebar */}
          <div className="flex flex-col gap-8 sticky top-6">
            <div className="bg-white dark:bg-stone-900 rounded-[32px] border border-stone-200 dark:border-stone-800 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-stone-900 dark:text-stone-50 font-sans mb-6 uppercase tracking-widest text-center">Daily Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-2xl text-center border border-stone-100 dark:border-stone-800/50">
                  <div className="text-2xl font-bold text-stone-900 dark:text-stone-50 font-sans">0</div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wide mt-1">Students</div>
                </div>
                <div className="p-4 bg-stone-50 dark:bg-stone-950 rounded-2xl text-center border border-stone-100 dark:border-stone-800/50">
                  <div className="text-2xl font-bold text-stone-900 dark:text-stone-50 font-sans">0%</div>
                  <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wide mt-1">Graded</div>
                </div>
              </div>
            </div>

            <div className="bg-amber-500 rounded-[32px] p-6 text-white shadow-lg shadow-amber-500/20">
              <h3 className="text-base font-bold font-sans mb-2">Teacher Pro Tip</h3>
              <p className="text-sm text-amber-50 font-sans leading-relaxed opacity-90">
                Regular feedback helps students stay motivated. Try to grade submissions within 24 hours.
              </p>
            </div>
          </div>
        </div>
      </div>

      <button 
        onClick={() => setActionOverlay(true)}
        className="absolute bottom-[20px] right-6 w-14 h-14 bg-stone-900 text-white rounded-2xl shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-20"
      >
        <Plus size={24} />
      </button>

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
