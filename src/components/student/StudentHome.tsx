import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
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
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="h-full flex flex-col overflow-y-auto scrollbar-hide bg-stone-50 dark:bg-stone-950"
    >
      {/* Header */}
      <div className="px-6 py-6 pb-4 shrink-0 animate-slide-up flex justify-between items-start w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center text-3xl shadow-sm border border-emerald-200/50">
            🎓
          </div>
          <div>
            <div className="text-xl font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans leading-tight mb-0.5">
              Welcome back
            </div>
            <div className="text-sm font-medium text-stone-500 dark:text-stone-400 font-sans">Ready to learn something new today?</div>
          </div>
        </div>
        <button aria-label="Notifications" className="w-11 h-11 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-center cursor-pointer shadow-sm relative hover:bg-stone-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500">
          <Bell size={20} className="text-stone-600 dark:text-stone-300" />
        </button>
      </div>

      {/* Main Content Grid */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] xl:grid-cols-[1fr_360px] gap-8 items-start">
          
          {/* Main Feed */}
          <div className="flex flex-col gap-10">
            {/* Next Class Card - Focus Element */}
            <motion.div 
              whileHover={{ y: -4, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
              className="shrink-0 rounded-[32px] p-8 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm relative overflow-hidden animate-slide-up [animation-delay:0.05s] flex items-center justify-center min-h-[220px]"
            >
               <div className="text-center">
                 <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4 border border-stone-200/50 dark:border-stone-700">
                   <CalendarIcon size={24} className="text-stone-400" />
                 </div>
                 <p className="text-lg font-bold text-stone-900 dark:text-stone-50 font-sans leading-tight">No upcoming classes</p>
                 <p className="text-sm text-stone-500 font-sans mt-2 max-w-xs mx-auto">Your schedule is completely clear for now. Enjoy the break!</p>
               </div>
               
               {/* Decorative background shape */}
               <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
               <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/5 rounded-full -ml-12 -mb-12 pointer-events-none" />
            </motion.div>

            {/* Tasks Section */}
            <div className="animate-slide-up [animation-delay:0.1s]">
              <div className="flex justify-between items-end mb-6">
                <SectionLabel>Today's Tasks</SectionLabel>
                <button className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline">View all</button>
              </div>
              <div className="bg-white dark:bg-stone-900 rounded-[32px] border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
                {tasks.length === 0 ? (
                   <div className="p-12 text-center">
                      <p className="text-base font-bold text-stone-900 dark:text-stone-50 font-sans mb-1">You're all caught up!</p>
                      <p className="text-sm text-stone-500 font-sans">No pending assignments to show today.</p>
                   </div>
                ) : (
                  <div className="divide-y divide-stone-100 dark:divide-stone-800">
                   {tasks.map((task, i) => {
                     const sc = SUBJECTS[task.subject] || SUBJECTS.Physics;
                     const done = task.status === "submitted";
                     return (
                       <div
                         key={task.id}
                         className={`flex items-center gap-5 p-6 transition-all duration-200 group ${
                           done ? "opacity-60" : "hover:bg-stone-50/50 dark:hover:bg-stone-800/30 cursor-pointer"
                         }`}
                       >
                         <div className={`w-12 h-12 rounded-2xl shrink-0 flex items-center justify-center text-2xl shadow-sm ${done ? "bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400" : sc.bg}`}>
                           {done ? "✓" : sc.icon}
                         </div>
                         <div className="flex-1 min-w-0">
                           <div className="text-[10px] font-bold tracking-widest uppercase mb-1 font-sans opacity-70" style={{ color: done ? '#a8a29e' : sc.fg }}>
                             {task.subject}
                           </div>
                           <div className={`text-base font-bold leading-tight font-sans truncate pr-4 ${done ? "text-stone-500 dark:text-stone-400 line-through" : "text-stone-900 dark:text-stone-50"}`}>
                             {task.title}
                           </div>
                           <div className={`text-xs font-medium font-sans mt-1.5 flex items-center gap-2 ${task.urgent && !done ? "text-rose-600" : "text-stone-500 dark:text-stone-400"}`}>
                             {task.urgent && !done && <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />}{task.due}
                           </div>
                         </div>
                         {!done && <ChevronRight size={20} className="text-stone-300 group-hover:text-stone-500 transition-colors" />}
                       </div>
                     );
                   })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Side Panels - Desktop Only Columns */}
          <div className="flex flex-col gap-8 sticky top-6">
            {/* Calendar / Schedule Widget */}
            <div className="shrink-0 animate-slide-up [animation-delay:0.15s] bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[32px] p-6 shadow-sm overflow-hidden relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-base font-bold text-stone-900 dark:text-stone-50 font-sans flex items-center gap-2 tracking-tight">
                  <CalendarIcon size={18} className="text-emerald-500" />
                  Planner
                </h3>
                <span className="text-[10px] font-bold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2.5 py-1 rounded-full uppercase tracking-widest">April</span>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-8">
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
                      className={`flex flex-col items-center py-2 rounded-xl transition-all cursor-pointer ${
                        isSelected 
                          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-105" 
                          : "bg-transparent text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800"
                      }`}
                    >
                      <span className={`text-[8px] font-bold tracking-widest uppercase font-sans mb-1 ${isSelected ? "text-emerald-50" : ""}`}>{cal.day[0]}</span>
                      <span className={`text-sm font-bold tabular-nums font-sans ${isSelected ? "text-white" : isToday ? "text-emerald-600 dark:text-emerald-400" : "text-stone-900 dark:text-stone-50"}`}>
                        {cal.date}
                      </span>
                      
                      {/* Indicators */}
                      <div className="flex gap-0.5 mt-1 h-0.5">
                        {(classCount > 0 || taskCount > 0) && <div className={`w-1 h-1 rounded-full ${isSelected ? "bg-white" : "bg-emerald-400"}`} />}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-4">
                {selectedSchedule.length === 0 ? (
                  <div className="text-center py-6">
                    <div className="text-2xl mb-2 opacity-30">✨</div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 font-medium font-sans px-4">
                      No classes or tasks scheduled for this day.
                    </p>
                  </div>
                ) : (
                  selectedSchedule.map((item) => (
                    <div key={item.id} className="flex items-start gap-3 p-3 rounded-2xl bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800/50">
                      <div className={`w-1 self-stretch rounded-full ${item.type === 'class' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-bold font-sans text-stone-500 dark:text-stone-400 flex items-center gap-1.5 mb-1 uppercase tracking-wide">
                          <Clock size={10} /> {item.time}
                        </div>
                        <div className="text-sm font-semibold text-stone-900 dark:text-stone-50 font-sans truncate">
                          {item.title}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Streak Card */}
            <div className="shrink-0 rounded-[32px] p-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 cursor-pointer animate-slide-up [animation-delay:0.2s] group hover:scale-[1.02] transition-transform">
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl group-hover:rotate-12 transition-transform">🔥</span>
                <div>
                  <div className="text-lg font-bold text-amber-900 dark:text-amber-500 tracking-tight font-sans mb-0.5">
                    4 Day Streak!
                  </div>
                  <div className="text-xs font-semibold text-amber-700/70 dark:text-amber-500/50 font-sans uppercase tracking-widest">Keep it up!</div>
                </div>
              </div>
              <div className="flex gap-2 items-end h-16">
                {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`rounded-full w-2 mb-2 transition-all duration-500 ease-out ${
                        i < 4 ? "h-[100%] bg-amber-500" : i === 4 ? "h-[40%] bg-amber-300" : "h-[20%] bg-amber-200 dark:bg-stone-800"
                      }`}
                    />
                    <div className={`text-[9px] font-sans ${i <= 3 ? "font-bold text-amber-700" : "font-medium text-stone-400"}`}>
                      {d}
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
    </motion.div>
  );
}
