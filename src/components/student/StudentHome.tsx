import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SUBJECTS } from "../../constants";
import { SectionLabel, Btn, Chip, EmptySlate } from "../shared/UI";
import { Bell, Play, ChevronRight, Info, Calendar as CalendarIcon, Clock, Sparkles, Pin, CheckCircle2, TrendingUp, Search, Filter } from "lucide-react";
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
  const [selectedDate, setSelectedDate] = useState<number>(new Date().getDate());
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
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
    setLoading(false);
  };

  const getDayDetails = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return {
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      date: d.getDate(),
      full: d.toDateString()
    };
  };

  const calendarDays = [-3, -2, -1, 0, 1, 2, 3].map(getDayDetails);

  type ScheduleItem = { id: number; type: "class" | "task"; time: string; title: string; subject: string; color: string };
  const scheduleData: Record<number, ScheduleItem[]> = {};

  const selectedSchedule = scheduleData[selectedDate] || [];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full flex flex-col overflow-y-auto scrollbar-hide bg-stone-50 dark:bg-stone-950"
    >
      {/* Premium Header */}
      <div className="px-6 py-10 pb-4 shrink-0 animate-slide-up sticky top-0 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md z-30">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-end">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-[28px] bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 flex items-center justify-center text-4xl shadow-xl shadow-stone-900/5 rotate-3 transition-transform hover:rotate-0">
              🎓
            </div>
            <div>
              <h1 className="text-4xl font-black text-stone-900 dark:text-stone-50 tracking-tighter font-sans leading-none mb-1">Academy Hall</h1>
              <p className="text-sm font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest leading-none">Curating your intellectual journey</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 rounded-[22px] bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 flex items-center justify-center cursor-pointer shadow-lg shadow-stone-900/5 relative group"
          >
            <Bell size={24} className="text-stone-300 dark:text-stone-600 group-hover:text-amber-500 transition-colors" />
            <div className="absolute top-4 right-4 w-3 h-3 bg-rose-500 rounded-full border-2 border-white dark:border-stone-900" />
          </motion.button>
        </div>
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-10 pb-24 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16 items-start">
          
          {/* Main Feed Section */}
          <div className="flex flex-col gap-16">
            {/* Hero Card - Dynamic State */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group rounded-[48px] p-12 bg-stone-900 dark:bg-stone-900 border border-stone-800 shadow-2xl relative overflow-hidden flex flex-col justify-center min-h-[340px]"
            >
               <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                 <div className="w-24 h-24 bg-white/5 backdrop-blur-xl rounded-[32px] flex items-center justify-center shrink-0 border border-white/10 group-hover:rotate-6 transition-transform duration-700">
                    <Sparkles size={40} className="text-amber-400" />
                 </div>
                 <div className="text-center md:text-left">
                   <div className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] mb-4">Real-time sync active</div>
                   <h3 className="text-3xl font-black text-white font-sans tracking-tight leading-tight mb-4">Your teaching schedule is currently in "Zen Mode"</h3>
                   <p className="text-base font-medium text-stone-400 font-sans max-w-sm leading-relaxed">
                     Perfect alignment detected. All academic sessions for the immediate hour are cleared.
                   </p>
                   <div className="mt-8">
                     <Btn label="Browse Archives" variant="outline" className="text-white border-white/20 hover:bg-white hover:text-stone-900 rounded-[18px] px-8 font-black text-[10px] uppercase tracking-widest" />
                   </div>
                 </div>
               </div>
               
               {/* Decorative atmospheric shapes */}
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
               <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none" />
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />
            </motion.div>

            {/* Content Blocks */}
            <div className="space-y-12">
               <div className="flex items-end justify-between px-2">
                  <div>
                    <SectionLabel>Active Mission Log</SectionLabel>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-tight mt-1">Pending artifacts for submission</p>
                  </div>
                  <Btn label="Index All" variant="outline" className="rounded-xl border px-4 py-2" />
               </div>

               <div className="grid gap-6">
                 {loading ? (
                    <div className="p-20 flex flex-col items-center gap-4">
                       <div className="w-10 h-10 border-4 border-stone-100 border-t-amber-500 animate-spin rounded-full" />
                       <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Loading Intelligence...</span>
                    </div>
                 ) : tasks.length === 0 ? (
                    <div className="bg-white dark:bg-stone-900/30 border border-stone-100 dark:border-stone-800 rounded-[48px] p-20 text-center flex flex-col items-center">
                       <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-[32px] flex items-center justify-center mb-8 border border-emerald-100 dark:border-emerald-500/20 shadow-inner">
                         <CheckCircle2 size={32} className="text-emerald-500" />
                       </div>
                       <h3 className="text-2xl font-black text-stone-900 dark:text-stone-50 tracking-tighter mb-2">Total Clearance</h3>
                       <p className="text-sm font-medium text-stone-400 max-w-[280px] leading-relaxed italic">"The mind is free when the task log is empty."</p>
                    </div>
                 ) : (
                    tasks.map((task, i) => {
                      const sc = SUBJECTS[task.subject] || SUBJECTS.Physics;
                      return (
                         <motion.div 
                           initial={{ opacity: 0, x: -20 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: i * 0.1 }}
                           key={task.id}
                           className="group flex flex-col md:flex-row md:items-center gap-8 p-10 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-[40px] hover:shadow-2xl hover:border-amber-200 transition-all cursor-pointer relative overflow-hidden"
                         >
                            <div className={`w-16 h-20 rounded-3xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-500 ${sc.bg}`}>
                               {sc.icon}
                            </div>
                            <div className="flex-1">
                               <div className="flex items-center gap-2 mb-2">
                                  <Chip label={task.subject} color={sc.fg} border={`${sc.fg}22`} bg={`${sc.fg}11`} />
                                  <span className="text-[10px] font-black text-stone-300 uppercase tracking-widest ml-1">{task.type}</span>
                               </div>
                               <h4 className="text-2xl font-black text-stone-900 dark:text-stone-100 leading-none tracking-tight mb-2 group-hover:text-amber-600 transition-colors uppercase">{task.title}</h4>
                               <div className="flex items-center gap-4 text-xs font-bold text-stone-400 uppercase tracking-widest leading-none">
                                  <Clock size={12} strokeWidth={3} /> {task.due}
                               </div>
                            </div>
                            <div className="ml-auto flex items-center gap-4">
                               <div className="w-12 h-12 rounded-full border border-stone-50 dark:border-stone-800 flex items-center justify-center text-stone-200 group-hover:border-amber-500 group-hover:text-amber-500 transition-all group-hover:translate-x-1">
                                  <ChevronRight size={24} />
                               </div>
                            </div>
                            <div className="absolute top-0 bottom-0 left-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: sc.fg }} />
                         </motion.div>
                      );
                    })
                 )}
               </div>
            </div>
          </div>

          {/* Sidebar / Context Panels */}
          <div className="flex flex-col gap-12 sticky top-32">
            
            {/* Planner Widget */}
            <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-[48px] p-10 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-5 grayscale pointer-events-none group-hover:opacity-10 transition-opacity">
                  <CalendarIcon size={120} />
               </div>
               
               <div className="flex items-center justify-between mb-10 relative z-10">
                <h3 className="text-xl font-black text-stone-900 dark:text-stone-50 font-sans flex items-center gap-3 tracking-tighter uppercase">
                  <Pin size={20} className="text-amber-500 rotate-45" />
                  Agenda
                </h3>
                <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest">April Wave</div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-12 relative z-10">
                {calendarDays.map((cal, i) => {
                  const isSelected = selectedDate === cal.date;
                  const isToday = i === 3;

                  return (
                    <button 
                      key={i} 
                      onClick={() => setSelectedDate(cal.date)}
                      className={`flex flex-col items-center py-4 rounded-[18px] transition-all cursor-pointer relative ${
                        isSelected 
                          ? "bg-stone-900 text-white shadow-2xl shadow-stone-900/20 scale-110 z-10" 
                          : "bg-transparent text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800"
                      }`}
                    >
                      <span className={`text-[9px] font-black tracking-widest uppercase font-sans mb-2 ${isSelected ? "text-stone-500" : ""}`}>{cal.day[0]}</span>
                      <span className={`text-base font-black tabular-nums font-sans leading-none ${isSelected ? "text-white" : isToday ? "text-amber-600 dark:text-amber-500" : "text-stone-900 dark:text-stone-50"}`}>
                        {cal.date}
                      </span>
                      {isToday && !isSelected && (
                         <div className="absolute bottom-2 w-1.5 h-1.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-6 relative z-10">
                <AnimatePresence mode="wait">
                  {selectedSchedule.length === 0 ? (
                    <motion.div 
                      key="empty-schedule"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-10"
                    >
                      <div className="text-4xl mb-6 opacity-40 grayscale group-hover:grayscale-0 group-hover:rotate-12 transition-all transition-duration-700">📜</div>
                      <p className="text-xs font-bold text-stone-400 dark:text-stone-500 font-sans px-12 leading-relaxed uppercase tracking-widest italic">
                        The agenda is perfectly clear for this cycle.
                      </p>
                    </motion.div>
                  ) : (
                    selectedSchedule.map((item) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={item.id} 
                        className="flex items-start gap-4 p-5 rounded-3xl bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800/50 hover:border-amber-200 transition-colors cursor-pointer group/item"
                      >
                        <div className={`w-1.5 h-10 rounded-full transition-all group-hover/item:scale-y-110 ${item.type === 'class' ? 'bg-blue-500' : 'bg-amber-500'}`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-black font-sans text-stone-400 flex items-center gap-1.5 mb-1.5 uppercase tracking-[0.2em]">
                             {item.time}
                          </div>
                          <div className="text-base font-black text-stone-900 dark:text-stone-50 font-sans truncate tracking-tight uppercase">
                            {item.title}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Performance Widget */}
            <motion.div 
              whileHover={{ y: -4 }}
              className="shrink-0 rounded-[48px] p-10 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 shadow-sm relative overflow-hidden group cursor-pointer"
            >
               <div className="absolute top-0 right-0 p-8 opacity-5 grayscale pointer-events-none group-hover:opacity-10 transition-opacity">
                  <TrendingUp size={120} />
               </div>
               
               <div className="flex items-center gap-6 mb-10 relative z-10">
                 <div className="w-16 h-16 rounded-[22px] bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-3xl shadow-inner group-hover:rotate-12 transition-transform duration-500">🔥</div>
                 <div>
                   <h3 className="text-xl font-black text-stone-900 dark:text-stone-50 tracking-tighter uppercase leading-none mb-1">
                     4 Day Cycle
                   </h3>
                   <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest leading-none">Perfect Engagement</p>
                 </div>
               </div>

               <div className="flex gap-4 items-end h-24 relative z-10 px-2">
                 {[40, 60, 100, 80, 20, 15, 10].map((h, i) => (
                   <div key={i} className="flex-1 flex flex-col items-center group/bar">
                     <div className="relative w-full flex justify-center">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height: `${h}%` }}
                          transition={{ duration: 1.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                          className={`rounded-full w-2.5 shadow-inner transition-all duration-500 ${
                            i < 4 ? "bg-amber-500 shadow-xl shadow-amber-500/20" : "bg-stone-100 dark:bg-stone-800"
                          }`}
                        />
                        <div className="absolute -top-6 opacity-0 group-hover/bar:opacity-100 transition-opacity text-[8px] font-black font-mono">{h}%</div>
                     </div>
                     <div className={`mt-4 text-[9px] font-black font-sans leading-none ${i <= 3 ? "text-amber-600 dark:text-amber-500" : "text-stone-300"}`}>
                       {["M", "T", "W", "T", "F", "S", "S"][i]}
                     </div>
                   </div>
                 ))}
               </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
