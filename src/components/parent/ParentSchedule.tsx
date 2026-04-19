import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sheet, Btn, SectionLabel } from "../shared/UI";
import { Clock, Video, Users, BookOpen, Calendar as CalIcon, ChevronLeft, ChevronRight, Pin } from "lucide-react";
import { supabase } from "../../supabaseClient";

const getDayName = (dayIdx: number) => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][dayIdx];

export default function ParentSchedule() {
  const [selDay, setSelDay] = useState(3); // Thursday
  const [detailSheet, setDetailSheet] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [childName, setChildName] = useState("Your Child");

  useEffect(() => {
    fetchEverything();
  }, []);

  const fetchEverything = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Get parent profile to find child name
    const { data: parentProfile } = await supabase.from('user_profiles').select('meta').eq('id', user.id).single();
    const cName = parentProfile?.meta || "Rohan Sharma";
    setChildName(cName);

    // 2. Find child's profile to get their batch
    const { data: studentDoc } = await supabase.from('user_profiles').select('*').eq('full_name', cName).eq('role', 'student').single();
    const batchId = studentDoc?.meta || "Class 8 Evening";

    // 3. Fetch classes for this batch
    const { data: classes } = await supabase.from('classes').select('*').eq('batch_id', batchId);
    
    // 4. Fetch tasks for the student
    let combined = [...(classes || []).map(c => ({...c, type: 'class'}))];
    if (studentDoc) {
       const { data: tasks } = await supabase.from('tasks').select('*').eq('user_id', studentDoc.id);
       if (tasks) {
         combined = [...combined, ...tasks.map(t => ({...t, type: 'task', start_time: t.due_date || t.created_at}))];
       }
    }

    setEvents(combined);
    setIsLoading(false);
  };

  const WEEK_DATA = [
     { d: 19, events: events.filter(e => new Date(e.start_time).getDate() === 19).length }, 
     { d: 20, events: events.filter(e => new Date(e.start_time).getDate() === 20).length }, 
     { d: 21, events: events.filter(e => new Date(e.start_time).getDate() === 21).length }, 
     { d: 22, events: events.filter(e => new Date(e.start_time).getDate() === 22).length },
     { d: 23, events: events.filter(e => new Date(e.start_time).getDate() === 23).length }, 
     { d: 24, events: events.filter(e => new Date(e.start_time).getDate() === 24).length }, 
     { d: 25, events: events.filter(e => new Date(e.start_time).getDate() === 25).length }
  ];

  const currentDayEvents = events.filter(ev => {
    const d = new Date(ev.start_time);
    return d.getDate() === WEEK_DATA[selDay].d;
  }).sort((a,b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());

  return (
    <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950 scrollbar-hide overflow-y-auto">
      {/* Premium Header */}
      <div className="px-6 py-8 pb-4 shrink-0 animate-slide-up sticky top-0 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md z-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans mb-1">{childName}'s Schedule</h1>
              <p className="text-sm font-medium text-stone-500 dark:text-stone-400">Viewing timetable for April 19 - April 25, 2026</p>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-4">
            {WEEK_DATA.map((day, i) => {
              const isSel = i === selDay;
              return (
                <motion.button
                  key={i}
                  whileHover={{ y: isSel ? 0 : -4 }}
                  onClick={() => setSelDay(i)}
                  className={`flex-none flex flex-col items-center justify-center p-5 rounded-[28px] min-w-[80px] transition-all duration-300 border cursor-pointer ${
                    isSel 
                      ? "bg-stone-900 border-stone-100 dark:bg-stone-100 dark:border-white text-white dark:text-stone-900 shadow-xl scale-105" 
                      : "bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-800 text-stone-400 dark:text-stone-500 hover:border-amber-400 hover:bg-stone-50/50"
                  }`}
                >
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] font-sans mb-2 ${isSel ? "text-stone-400 dark:text-stone-500" : ""}`}>
                    {getDayName(i)}
                  </span>
                  <span className={`text-2xl font-black font-mono tracking-tighter ${isSel ? "text-white dark:text-stone-900" : "text-stone-900 dark:text-stone-50"}`}>
                    {day.d}
                  </span>
                  <div className="flex gap-1 mt-3">
                    {Array.from({ length: Math.min(day.events, 3) }).map((_, j) => (
                      <div key={j} className={`w-1.5 h-1.5 rounded-full ${isSel ? "bg-amber-500 shadow-sm" : "bg-stone-200 dark:bg-stone-700"}`} />
                    ))}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 pb-24 relative">
        <div className="absolute left-[84px] top-0 bottom-0 w-px bg-stone-100 dark:bg-stone-800 hidden md:block" />
        
        <AnimatePresence mode="wait">
          {isLoading ? (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="flex flex-col items-center justify-center py-24"
             >
                <div className="w-10 h-10 rounded-full border-4 border-stone-200 border-t-amber-500 animate-spin" />
                <p className="mt-4 text-xs font-black uppercase tracking-widest text-stone-400">Syncing updates...</p>
             </motion.div>
          ) : currentDayEvents.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24"
            >
              <div className="text-6xl mb-6 grayscale opacity-30">🗓️</div>
              <h3 className="text-xl font-black text-stone-900 dark:text-stone-50 tracking-tight mb-2">Academic Break</h3>
              <p className="text-sm font-medium text-stone-500 dark:text-stone-400 max-w-[240px] mx-auto leading-relaxed">No scheduled lectures or tasks for this date.</p>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-8 relative">
              {currentDayEvents.map((ev, i) => {
                const isClass = ev.type === "class";
                const date = new Date(ev.start_time);
                const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={ev.id} 
                    className="flex flex-col md:flex-row gap-6 relative group"
                  >
                    <div className="w-full md:w-32 items-start md:pt-4 font-mono text-sm font-black text-stone-400 group-hover:text-amber-600 transition-colors md:text-right shrink-0">
                      {time.replace(" PM", "").replace(" AM", "")}
                      <span className="text-[10px] ml-1 uppercase opacity-50">{time.includes("PM") ? "pm" : "am"}</span>
                    </div>
                    
                    <div className="absolute left-[80.5px] top-[22px] w-8 h-8 rounded-full border-4 border-white dark:border-stone-950 bg-stone-100 dark:bg-stone-800 items-center justify-center z-10 hidden md:flex">
                        <div className={`w-3 h-3 rounded-full ${isClass ? 'bg-sky-500 shadow-lg shadow-sky-500/50' : 'bg-emerald-500 shadow-lg shadow-emerald-500/50'}`} />
                    </div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.01, x: 4 }}
                      onClick={() => setDetailSheet(ev)}
                      className="flex-1 rounded-[32px] p-8 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 shadow-sm cursor-pointer hover:shadow-2xl hover:border-amber-200 dark:hover:border-amber-900/40 transition-all flex flex-col md:flex-row gap-6 items-start justify-between"
                    >
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg border ${
                            isClass 
                              ? "bg-sky-50 border-sky-100 text-sky-600 dark:bg-sky-950/30 dark:border-sky-900/40 dark:text-sky-400" 
                              : "bg-emerald-50 border-emerald-100 text-emerald-600 dark:bg-emerald-950/30 dark:border-emerald-900/40 dark:text-emerald-400"
                          }`}>
                            {isClass ? 'LIVE LECTURE' : 'ACADEMIC TASK'}
                          </span>
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{ev.subject}</span>
                        </div>
                        <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-50 font-sans leading-tight tracking-tight group-hover:text-amber-600 transition-colors">
                          {ev.title}
                        </h3>
                      </div>
                      
                      {isClass && ev.duration && (
                        <div className="flex items-center gap-2 bg-stone-50 dark:bg-stone-800/50 px-4 py-2 rounded-xl border border-stone-100 dark:border-stone-700/50 text-xs font-black text-stone-500">
                          <Clock size={14} />
                          {ev.duration} MINS
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>

      <Sheet open={!!detailSheet} onClose={() => setDetailSheet(null)}>
        {detailSheet && (
          <div className="space-y-10 p-2">
            <div>
              <div className="flex items-center gap-3 mb-4">
                 <div className={`w-3 h-3 rounded-full ${detailSheet.type === 'class' ? 'bg-sky-500 glow-sky' : 'bg-emerald-500 glow-emerald'}`} />
                 <span className="text-[10px] font-black tracking-[0.2em] uppercase text-stone-400 font-sans">
                   {detailSheet.type === 'class' ? 'Timetable: Live Event' : 'Task: Deadline Reminder'}
                 </span>
              </div>
              <h2 className="text-4xl font-black text-stone-900 dark:text-stone-50 tracking-tighter font-sans leading-tight mb-2">{detailSheet.title}</h2>
              <p className="text-lg font-bold text-amber-600 dark:text-amber-500 font-sans">{detailSheet.subject}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-stone-50 dark:bg-stone-900 rounded-[32px] p-8 border border-stone-100 dark:border-stone-800 flex flex-col gap-2">
                  <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">Time & Date</div>
                  <div className="flex items-center gap-3 text-lg font-black text-stone-900 dark:text-stone-100">
                    <Clock size={20} className="text-amber-500" />
                    {new Date(detailSheet.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-xs font-bold text-stone-500">{new Date(detailSheet.start_time).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</div>
               </div>
               
               {detailSheet.type === 'class' ? (
                 <div className="bg-sky-50 dark:bg-sky-950/30 rounded-[32px] p-8 border border-sky-100 dark:border-sky-900/40 flex flex-col gap-2 shadow-sm">
                    <div className="text-[10px] font-black text-sky-600 dark:text-sky-400 uppercase tracking-widest mb-1">Session Data</div>
                    <div className="flex items-center gap-3 text-lg font-black text-sky-900 dark:text-sky-200">
                      <Video size={20} className="text-sky-500" />
                      Virtual Classroom
                    </div>
                    <div className="text-xs font-bold text-sky-700 dark:text-sky-400/70">Duration: {detailSheet.duration} Minutes</div>
                 </div>
               ) : (
                 <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-[32px] p-8 border border-emerald-100 dark:border-emerald-900/40 flex flex-col gap-2 shadow-sm">
                    <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1">Submission Status</div>
                    <div className="flex items-center gap-3 text-lg font-black text-emerald-900 dark:text-emerald-200">
                      <BookOpen size={20} className="text-emerald-500" />
                      Academic Work
                    </div>
                    <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400/70">Required for internal assessment</div>
                 </div>
               )}
            </div>

            <Btn label="Close View" variant="outline" className="w-full py-5 rounded-3xl font-black transition-all" onClick={() => setDetailSheet(null)} />
          </div>
        )}
      </Sheet>
    </div>
  );
}
