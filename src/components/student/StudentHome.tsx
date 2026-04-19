import { useState, useEffect } from "react";
import { SUBJECTS } from "../../constants";
import { SectionLabel, Btn } from "../shared/UI";
import { Bell, Play, ChevronRight, Info, Calendar as CalendarIcon, Clock } from "lucide-react";
import { supabase } from "../../supabaseClient";

function useClock(init = 847) {
  const [s, setS] = useState(init);
  useEffect(() => {
    const t = setInterval(() => setS((p) => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  return s;
}

const fmt = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

export default function StudentHome() {
  const secs = useClock(574);
  const [overlay, setOverlay] = useState(false);
  const [selectedDate, setSelectedDate] = useState<number>(11);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .neq('status', 'graded')
      .order('created_at', { ascending: false })
      .limit(3);

    if (data) {
      setTasks(data);
    }
  };

  const calendarDays = [
    { day: "Mon", date: 8 },
    { day: "Tue", date: 9 },
    { day: "Wed", date: 10 },
    { day: "Thu", date: 11, active: true },
    { day: "Fri", date: 12 },
    { day: "Sat", date: 13 },
    { day: "Sun", date: 14 }
  ];

  type ScheduleItem = { id: number; type: "class" | "task"; time: string; title: string; subject: string; color: string };
  const scheduleData: Record<number, ScheduleItem[]> = {};

  const selectedSchedule = scheduleData[selectedDate] || [];

  return (
    <div className="h-full flex flex-col overflow-y-auto scrollbar-hide bg-stone-50 dark:bg-stone-950">
      {/* Header */}
      <div className="px-6 py-6 pb-4 shrink-0 animate-slide-up flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl">
            🎓
          </div>
          <div>
            <div className="text-lg font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans">
              Welcome back
            </div>
            <div className="text-sm font-medium text-stone-500 dark:text-stone-400 font-sans">Ready to learn?</div>
          </div>
        </div>
        <button aria-label="Notifications" className="w-11 h-11 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-center cursor-pointer shadow-sm relative hover:bg-stone-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500">
          <Bell size={20} className="text-stone-600 dark:text-stone-300" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 pb-8 flex flex-col gap-8 overflow-y-auto scrollbar-hide">
        {/* Next Class Card - Focus Element */}
        <div className="shrink-0 rounded-[24px] p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm relative overflow-hidden animate-slide-up [animation-delay:0.05s] flex items-center justify-center min-h-[160px]">
           <div className="text-center">
             <div className="w-12 h-12 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-3">
               <CalendarIcon size={20} className="text-stone-400" />
             </div>
             <p className="text-sm font-bold text-stone-900 dark:text-stone-50 font-sans">No upcoming classes</p>
             <p className="text-xs text-stone-500 font-sans mt-1">Your schedule is completely clear for now.</p>
           </div>
        </div>

        {/* Tasks Section */}
        <div className="shrink-0 animate-slide-up [animation-delay:0.1s]">
          <div className="flex justify-between items-end mb-4">
            <SectionLabel>Today's Tasks</SectionLabel>
          </div>
          <div className="flex flex-col">
            {tasks.length === 0 ? (
               <div className="bg-white dark:bg-stone-900 p-6 rounded-2xl border border-stone-200 dark:border-stone-800 text-center">
                  <p className="text-sm font-bold text-stone-900 dark:text-stone-50 font-sans mb-1">You're all caught up!</p>
                  <p className="text-xs text-stone-500 font-sans">No pending assignments to show.</p>
               </div>
            ) : (
               tasks.map((task, i) => {
                 const sc = SUBJECTS[task.subject] || SUBJECTS.Physics;
                 const done = task.status === "submitted";
                 return (
                   <div
                     key={task.id}
                     className={`flex items-center gap-4 py-4 border-b border-stone-200 dark:border-stone-800 last:border-0 relative transition-transform duration-200 ${
                       done ? "opacity-60" : "hover:translate-x-1 cursor-pointer"
                     }`}
                   >
                     <div className={`w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-xl ${done ? "bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400" : sc.bg}`}>
                       {done ? "✓" : sc.icon}
                     </div>
                     <div className="flex-1 min-w-0">
                       <div className="text-xs font-semibold tracking-wider uppercase mb-1 font-sans" style={{ color: done ? '#a8a29e' : sc.fg }}>
                         {task.subject}
                       </div>
                       <div className={`text-sm font-semibold leading-tight font-sans truncate pr-4 ${done ? "text-stone-500 dark:text-stone-400 line-through" : "text-stone-900 dark:text-stone-50"}`}>
                         {task.title}
                       </div>
                       <div className={`text-xs font-medium font-sans mt-1 flex items-center gap-1.5 ${task.urgent && !done ? "text-rose-600" : "text-stone-500 dark:text-stone-400"}`}>
                         {task.urgent && !done && <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />}{task.due}
                       </div>
                     </div>
                     {!done && <ChevronRight size={20} className="text-stone-300" />}
                   </div>
                 );
               })
            )}
          </div>
        </div>

        {/* Calendar / Schedule Widget */}
        <div className="shrink-0 animate-slide-up [animation-delay:0.15s] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[24px] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-bold text-stone-900 dark:text-stone-50 font-sans flex items-center gap-2 tracking-tight">
              <CalendarIcon size={18} className="text-emerald-500" />
              Schedule & planner
            </h3>
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-full">April 2026</span>
          </div>

          <div className="flex justify-between items-center mb-6 px-1">
            {calendarDays.map((cal, i) => {
              const isSelected = selectedDate === cal.date;
              const isToday = cal.active;
              const items = scheduleData[cal.date] || [];
              const classCount = items.filter(itm => itm.type === 'class').length;
              const taskCount = items.filter(itm => itm.type === 'task').length;

              return (
                <button 
                  key={i} 
                  onClick={() => setSelectedDate(cal.date)}
                  className={`flex flex-col items-center p-2 rounded-2xl min-w-[42px] transition-all cursor-pointer ${
                    isSelected 
                      ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/20 scale-105" 
                      : "bg-transparent text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800"
                  }`}
                >
                  <span className={`text-[10px] font-bold tracking-widest uppercase font-sans mb-1.5 ${isSelected ? "text-emerald-50" : ""}`}>{cal.day}</span>
                  <span className={`text-base font-bold tabular-nums font-sans ${isSelected ? "text-white" : isToday ? "text-emerald-600 dark:text-emerald-400" : "text-stone-900 dark:text-stone-50"}`}>
                    {cal.date}
                  </span>
                  
                  {/* Indicators */}
                  <div className="flex gap-0.5 mt-1.5 h-1">
                    {classCount > 0 && <div className={`w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-blue-500"}`} />}
                    {taskCount > 0 && <div className={`w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-amber-500"}`} />}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            {selectedSchedule.length === 0 ? (
              <div className="text-center py-6 text-sm text-stone-500 dark:text-stone-400 font-medium font-sans">
                No classes or tasks scheduled for this day! ✨
              </div>
            ) : (
              selectedSchedule.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800/50">
                  <div className={`w-1.5 self-stretch rounded-full ${item.type === 'class' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold font-sans text-stone-500 dark:text-stone-400 flex items-center gap-1.5 mb-0.5">
                      <Clock size={12} /> {item.time} ({item.type})
                    </div>
                    <div className="text-sm font-semibold text-stone-900 dark:text-stone-50 font-sans truncate pr-2">
                      {item.title}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Streak Card */}
        <div className="shrink-0 rounded-[24px] p-5 bg-amber-50 border border-amber-200 cursor-pointer animate-slide-up [animation-delay:0.2s]">
          <div className="flex items-center gap-4 mb-5">
            <span className="text-3xl">🔥</span>
            <div>
              <div className="text-base font-bold text-amber-800 tracking-tight font-sans mb-0.5">
                4 days in a row!
              </div>
              <div className="text-sm font-medium text-amber-700/70 font-sans">Submit today to keep it going</div>
            </div>
          </div>
          <div className="flex gap-2 items-end">
            {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
              <div key={i} className="flex-1 text-center">
                <div 
                  className={`rounded-full mx-auto w-1.5 mb-2 transition-all duration-300 ${
                    i < 4 ? "h-6 bg-amber-500" : i === 4 ? "h-3 bg-amber-300" : "h-2 bg-amber-200"
                  }`}
                />
                <div className={`text-[10px] font-sans ${i <= 4 ? "font-bold text-amber-700" : "font-medium text-amber-600/50"}`}>
                  {d}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Overlay Sheet */}
      {overlay && (
        <div className="absolute inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-end animate-fade-in" onClick={() => setOverlay(false)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full bg-white dark:bg-stone-900 rounded-t-[32px] pt-2 shadow-2xl animate-slide-sheet">
            <div className="w-12 h-1.5 rounded-full bg-stone-200 dark:bg-stone-700 mx-auto mb-6" />
            <div className="px-6 pb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-xs font-semibold tracking-wider uppercase text-emerald-600 mb-1 font-sans">
                    Class in 9 minutes
                  </div>
                  <div className="text-2xl font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans mb-1">Physics</div>
                  <div className="text-sm font-medium text-stone-500 dark:text-stone-400 font-sans">Arabinda Sir · Today 6:00 PM</div>
                </div>
                <button 
                  onClick={() => setOverlay(false)} 
                  className="w-8 h-8 rounded-full border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-500 dark:text-stone-400 hover:bg-stone-100 cursor-pointer flex items-center justify-center transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="text-sm font-semibold tracking-wider uppercase text-stone-500 dark:text-stone-400 font-sans mb-4">
                Bring to class
              </div>
              {["Textbook p.45", "Rough notebook", "Calculator"].map((item, i) => (
                <div key={i} className={`flex items-center gap-3 py-3 ${i < 2 ? "border-b border-stone-100 dark:border-stone-800/50" : ""}`}>
                  <div className="w-5 h-5 rounded-md bg-stone-50 dark:bg-stone-950 border-2 border-stone-200 dark:border-stone-800 shrink-0" />
                  <span className="text-sm font-medium font-sans text-stone-700 dark:text-stone-200">{item}</span>
                </div>
              ))}
              <div className="mt-8">
                <Btn label="Join via Google Meet" variant="primary" full onClick={() => setOverlay(false)} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
