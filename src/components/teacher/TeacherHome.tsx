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

  const reviews = [
    { id: 1, type: "Homework", path: "Physics / Newton's Laws", count: 12, urgent: true },
    { id: 2, type: "Parent Message", path: "Rohan's relative", count: 1, urgent: false },
    { id: 3, type: "Assignments", path: "Science / Diagram", count: 4, urgent: false },
  ];

  const recent = [
    { name: "Rahul Verma", time: "10m ago", subject: "Maths" },
    { name: "Sneha Roy", time: "1h ago", subject: "Physics" },
    { name: "Aryan Khan", time: "2h ago", subject: "Science" },
  ];

  return (
    <div className="h-full flex flex-col overflow-y-auto scrollbar-hide bg-stone-50 dark:bg-stone-950 relative">
      <div className="px-6 py-6 pb-4 shrink-0 animate-slide-up flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-2xl">
            👨‍🏫
          </div>
          <div>
            <div className="text-lg font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans">
              Arabinda Sir
            </div>
            <div className="text-sm font-medium text-amber-600 font-sans">
              17 items to review
            </div>
          </div>
        </div>
        <button aria-label="Notifications" className="w-11 h-11 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-center cursor-pointer shadow-sm relative hover:bg-stone-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500">
          <Bell size={20} className="text-stone-600 dark:text-stone-300" />
          <div className="absolute top-0 right-0 bg-rose-500 text-white w-2.5 h-2.5 rounded-full border-2 border-white" />
        </button>
      </div>

      <div className="flex-1 px-6 pb-24 flex flex-col gap-8 overflow-y-auto scrollbar-hide">
        <div className="shrink-0 rounded-[24px] p-6 bg-stone-900 text-white relative overflow-hidden animate-slide-up [animation-delay:0.05s] shadow-lg">
          <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
          <div className="flex justify-between items-center mb-5">
            <div>
              <div className="text-xs font-semibold tracking-wider uppercase text-amber-600 mb-2 font-sans">
                Next class
              </div>
              <div className="text-xl font-bold tracking-tight font-sans mb-1">Class 8 Evening</div>
              <div className="text-sm font-medium text-stone-500 dark:text-stone-400 font-sans">Physics · 24 Students</div>
            </div>
            <div className="bg-stone-800 border border-stone-700 rounded-2xl px-3 py-3 text-center min-w-[80px] shrink-0">
              <div className="text-2xl font-bold font-mono tracking-tight tabular-nums mb-1 text-white">
                {fmt(secs)}
              </div>
              <div className="text-[11px] font-bold tracking-widest uppercase text-stone-500 dark:text-stone-400 font-sans">
                til start
              </div>
            </div>
          </div>
          <Btn 
            label="Start Class" 
            variant="outline"
            full 
            icon={<span className="text-sm">⚡</span>}
          />
        </div>

        <div className="shrink-0 animate-slide-up [animation-delay:0.1s]">
          <SectionLabel>Action Queue</SectionLabel>
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-sm">
            {reviews.map((r, i) => (
              <div key={r.id} className="flex items-center gap-4 p-4 border-b border-stone-100 dark:border-stone-800/50 last:border-0 hover:bg-stone-50 cursor-pointer transition-colors">
                 <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-stone-900 dark:text-stone-50 font-sans">{r.type}</span>
                      {r.urgent && <span className="w-2 h-2 rounded-full bg-rose-500" />}
                    </div>
                    <div className="text-xs text-stone-500 dark:text-stone-400 font-sans">{r.path}</div>
                 </div>
                 <div className={`px-3 py-1 rounded-full text-xs font-bold font-mono ${r.urgent ? 'bg-rose-50 text-rose-700' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'}`}>
                    {r.count}
                 </div>
              </div>
            ))}
          </div>
        </div>

        <div className="shrink-0 animate-slide-up [animation-delay:0.15s]">
          <SectionLabel>Recent Submissions</SectionLabel>
          <div className="flex flex-col gap-3">
             {recent.map((s, i) => {
               const sc = SUBJECTS[s.subject] || SUBJECTS.Physics;
               return (
                 <div key={i} className="bg-white dark:bg-stone-900 p-4 rounded-xl border border-stone-200 dark:border-stone-800 shadow-sm flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg ${sc.bg}`}>{sc.icon}</div>
                      <div>
                        <div className="text-sm font-bold text-stone-900 dark:text-stone-50 font-sans mb-1">{s.name}</div>
                        <div className="text-xs font-medium text-stone-500 dark:text-stone-400">{s.time}</div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 text-stone-700 dark:text-stone-200 text-xs font-bold rounded-lg transition-colors">
                      Review
                    </button>
                 </div>
               )
             })}
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
