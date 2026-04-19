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
      <div className="px-6 py-6 pb-4 shrink-0 animate-slide-up flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl">
            👨‍🏫
          </div>
          <div>
            <div className="text-lg font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans">
              Welcome back
            </div>
            <div className="text-sm font-medium text-amber-600 font-sans">
              No pending reviews
            </div>
          </div>
        </div>
        <button aria-label="Notifications" className="w-11 h-11 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-center cursor-pointer shadow-sm relative hover:bg-stone-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500">
          <Bell size={20} className="text-stone-600 dark:text-stone-300" />
        </button>
      </div>

      <div className="flex-1 px-6 pb-24 flex flex-col gap-8 overflow-y-auto scrollbar-hide">
        <div className="shrink-0 rounded-[24px] p-6 bg-stone-900 text-white relative overflow-hidden animate-slide-up [animation-delay:0.05s] shadow-lg flex items-center justify-center min-h-[160px]">
           <div className="text-center">
             <div className="w-12 h-12 bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-3">
               <span className="text-xl">📅</span>
             </div>
             <p className="text-sm font-bold text-white font-sans">No upcoming classes</p>
             <p className="text-xs text-stone-400 font-sans mt-1">Schedule a session to get started.</p>
           </div>
        </div>

        <div className="shrink-0 animate-slide-up [animation-delay:0.1s]">
          <SectionLabel>Action Queue</SectionLabel>
          <div className="bg-white dark:bg-stone-900 p-6 border border-stone-200 dark:border-stone-800 rounded-2xl text-center shadow-sm">
             <p className="text-sm font-bold text-stone-900 dark:text-stone-50 font-sans mb-1">Inbox Zero</p>
             <p className="text-xs text-stone-500 font-sans">You have no tasks needing attention.</p>
          </div>
        </div>

        <div className="shrink-0 animate-slide-up [animation-delay:0.15s]">
          <SectionLabel>Recent Submissions</SectionLabel>
          <div className="bg-white dark:bg-stone-900 p-6 border border-stone-200 dark:border-stone-800 rounded-2xl text-center shadow-sm">
             <p className="text-sm font-bold text-stone-900 dark:text-stone-50 font-sans mb-1">No submissions yet</p>
             <p className="text-xs text-stone-500 font-sans">Student work will appear here once submitted.</p>
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
