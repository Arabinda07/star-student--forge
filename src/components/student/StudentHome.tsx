import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SUBJECTS } from "../../constants";
import { SectionLabel, Btn, Chip, EmptySlate } from "../shared/UI";
import { 
  Bell, 
  Play, 
  CaretRight, 
  Info, 
  CalendarBlank, 
  Clock, 
  Sparkle, 
  PushPin, 
  CheckCircle, 
  TrendUp, 
  MagnifyingGlass, 
  Faders 
} from "@phosphor-icons/react";
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
      className="h-full flex flex-col overflow-y-auto scrollbar-hide bg-white dark:bg-stone-950"
    >
      {/* Premium Header */}
      <div className="px-6 py-8 md:px-8 md:py-14 pb-6 shrink-0 animate-slide-up sticky top-0 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-xl z-30 border-b border-stone-100/50 dark:border-stone-800/30">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 flex items-center justify-center text-3xl shadow-sm transition-transform hover:scale-105 duration-500">
              🎓
            </div>
            <div>
              <h1 className="text-3xl font-bold text-heading tracking-tight mb-1 uppercase">Dashboard</h1>
              <p className="text-[10px] font-medium text-muted uppercase tracking-[0.2em] leading-none">Your school workspace</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-12 h-12 rounded-xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 flex items-center justify-center cursor-pointer shadow-sm relative group overflow-hidden"
            >
              <div className="absolute inset-0 bg-brand-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Bell size={22} weight="duotone" className="text-muted group-hover:text-brand-500 transition-colors relative z-10" />
              <div className="absolute top-3 right-3 w-2 h-2 bg-rose-500 rounded-full border-2 border-white dark:border-stone-900" />
            </motion.button>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-10 pb-24 space-y-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16 items-start">
          
          {/* Main Feed Section */}
          <div className="flex flex-col gap-16">
            {/* Hero Card - Dynamic State */}
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="group rounded-3xl p-12 bg-stone-900 dark:bg-stone-900 shadow-xl relative overflow-hidden flex flex-col justify-center min-h-[320px]"
            >
               <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                 <div className="w-20 h-20 bg-white/5 backdrop-blur-2xl rounded-2xl flex items-center justify-center shrink-0 border border-white/10 group-hover:scale-105 transition-transform duration-700 shadow-2xl">
                    <Sparkle size={36} weight="duotone" className="text-amber-400" />
                 </div>
                 <div className="text-center md:text-left">
                   <div className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.3em] mb-4">Focus Mode</div>
                   <h3 className="text-3xl font-bold text-white font-display tracking-tight leading-tight mb-4 uppercase">You're free for the next hour</h3>
                   <p className="text-sm font-medium text-white/60 font-sans max-w-sm leading-relaxed uppercase tracking-tight">
                     No classes or deadlines right now. Good time to get ahead.
                   </p>
                   <div className="mt-8">
                     <Btn label="See all work" variant="outline" className="text-white border-white/20 hover:bg-white hover:text-stone-900 font-bold uppercase tracking-widest text-[11px]" />
                   </div>
                 </div>
               </div>
               
               <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-500/10 rounded-full blur-[120px] -mr-60 -mt-60 pointer-events-none" />
               <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none mix-blend-overlay" />
            </motion.div>

            {/* Content Blocks */}
            <div className="space-y-12">
               <div className="flex items-end justify-between px-2">
                  <div>
                    <SectionLabel>Upcoming work</SectionLabel>
                    <p className="text-[10px] font-medium text-muted uppercase tracking-[0.2em] mt-1">Assignments due soon</p>
                  </div>
                  <Btn label="See all" variant="outline" className="rounded-lg border px-3 py-1.5 font-bold text-[10px] uppercase tracking-widest" />
               </div>

               <div className="grid gap-6">
                 {loading ? (
                    <div className="p-20 flex flex-col items-center gap-4">
                       <div className="w-10 h-10 border-4 border-stone-100 border-t-amber-500 animate-spin rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">Loading...</span>
                    </div>
                 ) : tasks.length === 0 ? (
                    <div className="bg-white dark:bg-stone-900/30 border border-stone-100 dark:border-stone-800 rounded-[48px] p-20 text-center flex flex-col items-center">
                       <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-[32px] flex items-center justify-center mb-8 border border-emerald-100 dark:border-emerald-500/20 shadow-inner">
                         <CheckCircle size={32} weight="duotone" className="text-emerald-500" />
                       </div>
                        <h3 className="text-3xl font-black text-stone-900 dark:text-stone-50 tracking-tighter mb-2 uppercase font-display italic leading-none">You're all caught up</h3>
                        <p className="text-xs font-black text-stone-400 max-w-[280px] leading-relaxed italic uppercase tracking-widest opacity-60">No tasks due right now. Enjoy the break.</p>
                    </div>
                 ) : (
                    tasks.map((task, i) => {
                      const sc = SUBJECTS[task.subject] || SUBJECTS.Physics;
                      return (
                         <motion.div 
                           initial={{ opacity: 0, x: -15 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: i * 0.05 }}
                           key={task.id}
                           className="group flex items-center gap-6 p-6 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800/50 rounded-2xl hover:shadow-lg transition-all cursor-pointer relative overflow-hidden"
                         >
                            <div className={`w-12 h-16 rounded-xl flex items-center justify-center text-2xl border border-white/5 dark:border-black/5 ${sc.bg}`}>
                               {sc.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                               <div className="flex items-center gap-3 mb-2">
                                  <Chip label={task.subject} bg={`${sc.fg}11`} color={sc.fg} border="transparent" small />
                                  <span className="text-[9px] font-bold text-muted uppercase tracking-wider">{task.type}</span>
                                </div>
                               <h4 className="text-xl font-bold text-heading leading-tight truncate uppercase font-display">{task.title}</h4>
                               <div className="flex items-center gap-3 text-[10px] font-medium text-muted uppercase tracking-widest mt-2">
                                  <Clock size={12} className="text-stone-300" /> 
                                  <span className="tabular">{task.due}</span>
                               </div>
                            </div>
                            <div className="ml-auto">
                               <div className="w-8 h-8 rounded-full border border-stone-100 dark:border-stone-800 flex items-center justify-center text-stone-200 group-hover:border-brand-500 group-hover:text-brand-500 transition-all group-hover:translate-x-1">
                                  <CaretRight size={18} weight="bold" />
                                </div>
                            </div>
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
                  <CalendarBlank size={120} weight="duotone" />
               </div>
               
               <div className="flex items-center justify-between mb-8 relative z-10">
                <h3 className="text-lg font-bold text-heading font-display flex items-center gap-2.5 tracking-tight uppercase">
                  <PushPin size={18} weight="duotone" className="text-amber-500 rotate-45" />
                  Agenda
                </h3>
                <div className="text-[10px] font-bold text-muted uppercase tracking-widest leading-none">April</div>
              </div>

              <div className="grid grid-cols-7 gap-2 mb-12 relative z-10">
                {calendarDays.map((cal, i) => {
                  const isSelected = selectedDate === cal.date;
                  const isToday = i === 3;

                  return (
                    <button 
                      key={i} 
                      onClick={() => setSelectedDate(cal.date)}
                      className={`flex flex-col items-center py-4 rounded-[18px] transition-all cursor-pointer relative border-none ${
                        isSelected 
                          ? "bg-stone-900 text-white shadow-2xl shadow-stone-900/20 scale-110 z-10" 
                          : "bg-transparent text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800"
                      }`}
                    >
                      <span className={`text-[9px] font-black tracking-widest uppercase font-sans mb-2 ${isSelected ? "text-stone-500" : ""}`}>{cal.day[0]}</span>
                      <span className={`text-lg font-black tabular font-display leading-none ${isSelected ? "text-white" : isToday ? "text-brand-600 dark:text-brand-500" : "text-stone-900 dark:text-stone-50"}`}>
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
                      <p className="text-[10px] font-black text-stone-400 dark:text-stone-500 font-sans px-12 leading-relaxed uppercase tracking-widest italic opacity-60">
                        Nothing planned for this day.
                      </p>
                    </motion.div>
                  ) : (
                    selectedSchedule.map((item) => (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        key={item.id} 
                        className="flex items-start gap-4 p-5 rounded-3xl bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800/50 hover:border-brand-500/30 transition-colors cursor-pointer group/item"
                      >
                        <div className={`w-1.5 h-10 rounded-full transition-all group-hover/item:scale-y-110 ${item.type === 'class' ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]'}`} />
                        <div className="flex-1 min-w-0">
                          <div className="text-[10px] font-black font-sans text-stone-400 flex items-center gap-1.5 mb-2 uppercase tracking-[0.2em] italic">
                             <span className="tabular">{item.time}</span>
                          </div>
                          <div className="text-lg font-black text-stone-900 dark:text-stone-50 font-display truncate tracking-tighter uppercase leading-none italic">
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
                  <TrendUp size={120} weight="duotone" />
               </div>
               
                <div className="flex items-center gap-6 mb-12 relative z-10">
                  <div className="w-16 h-16 rounded-[22px] bg-brand-500/5 dark:bg-brand-500/10 flex items-center justify-center text-4xl shadow-inner group-hover:rotate-12 transition-transform duration-500">🔥</div>
                  <div>
                    <h3 className="text-2xl font-black text-stone-900 dark:text-stone-50 tracking-tighter uppercase leading-none mb-2 font-display italic">
                      4-day streak
                    </h3>
                    <p className="text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] leading-none italic">Keep it going</p>
                  </div>
                </div>

                <div className="flex gap-4 items-end h-28 relative z-10 px-2">
                  {[40, 60, 100, 80, 20, 15, 10].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center group/bar">
                      <div className="relative w-full flex justify-center h-full">
                         <motion.div 
                           initial={{ height: 0 }}
                           animate={{ height: `${h}%` }}
                           transition={{ duration: 1.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                           className={`rounded-full w-2 shadow-inner transition-all duration-500 ${
                             i < 4 ? "bg-brand-500 shadow-[0_10px_20px_rgba(0,0,0,0.1)] group-hover/bar:bg-brand-600" : "bg-stone-100 dark:bg-stone-800"
                           }`}
                         />
                         <div className="absolute -top-7 opacity-0 group-hover/bar:opacity-100 transition-opacity text-[10px] font-black font-mono text-brand-600 tabular">{h}%</div>
                      </div>
                      <div className={`mt-6 text-[10px] font-black font-sans leading-none italic ${i <= 3 ? "text-brand-600 dark:text-brand-500" : "text-stone-300 dark:text-stone-700"}`}>
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

