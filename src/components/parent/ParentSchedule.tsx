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
    <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950 scrollbar-hide overflow-y-auto premium-texture">
      {/* Premium Header */}
      <div className="px-6 py-8 pb-4 shrink-0 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 sticky top-0 z-20 animate-slide-up">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-8">
            <div className="flex items-center gap-6">
              <div className="w-16 h-[72px] rounded-[24px] bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800/60 flex items-center justify-center text-4xl shadow-sm -rotate-3 transition-transform hover:rotate-2 hover:scale-105 duration-500 hidden md:flex">
                🗓️
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-stone-50 tracking-tighter font-sans leading-none mb-2">{childName}'s Schedule</h1>
                <p className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest leading-none drop-shadow-sm">Viewing timetable for April 19 - April 25</p>
              </div>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 px-1">
            {WEEK_DATA.map((day, i) => {
              const isSel = i === selDay;
              return (
                <button
                  key={i}
                  onClick={() => setSelDay(i)}
                  className={`flex flex-col items-center justify-center py-4 px-5 rounded-[20px] min-w-[76px] transition-all duration-300 border cursor-pointer ${
                    isSel 
                      ? "bg-stone-900 dark:bg-stone-100 border-transparent text-white dark:text-stone-900 shadow-md transform -translate-y-1" 
                      : "bg-white dark:bg-stone-900 border-stone-200/60 dark:border-stone-800/60 text-stone-500 dark:text-stone-400 hover:border-amber-300 dark:hover:border-amber-700/50 hover:bg-stone-50 md:hover:bg-amber-50/50 dark:hover:bg-stone-800/80 shadow-sm hover:-translate-y-0.5"
                  }`}
                >
                  <span className={`text-[10px] font-black uppercase tracking-widest font-sans mb-1.5 ${isSel ? "text-stone-400 dark:text-stone-500" : ""}`}>
                    {getDayName(i)}
                  </span>
                  <span className={`text-2xl font-black font-sans tracking-tight leading-none mb-2 ${isSel ? "text-white dark:text-stone-900" : "text-stone-900 dark:text-stone-50"}`}>
                    {day.d}
                  </span>
                  <div className="flex gap-1 h-1.5 items-center justify-center w-full">
                    {Array.from({ length: Math.min(day.events, 3) }).map((_, j) => (
                      <div key={j} className={`w-1.5 h-1.5 rounded-full transition-colors ${isSel ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" : "bg-stone-300 dark:bg-stone-600"}`} />
                    ))}
                    {day.events === 0 && <div className="w-1.5 h-1.5 rounded-full bg-transparent" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 pb-24 relative mt-8">
        <div className="absolute left-[84px] top-0 bottom-0 w-px bg-stone-200/60 dark:bg-stone-800/60 hidden md:block" />
        
        <AnimatePresence mode="wait">
          {isLoading ? (
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="flex flex-col items-center justify-center py-24"
             >
                <div className="w-12 h-12 rounded-full border-[3px] border-stone-200/60 dark:border-stone-800/60 border-t-amber-500 animate-spin" />
                <p className="mt-6 text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500">Syncing updates...</p>
             </motion.div>
          ) : currentDayEvents.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-24 px-4 bg-white dark:bg-stone-900 rounded-[40px] border border-stone-200/60 dark:border-stone-800/60 shadow-sm opacity-80"
            >
              <div className="text-6xl mb-8 grayscale opacity-30 drop-shadow-sm filter">🗓️</div>
              <h3 className="text-3xl font-black text-stone-900 dark:text-stone-50 tracking-tight font-sans mb-3">Academic Break</h3>
              <p className="text-base font-bold text-stone-500 dark:text-stone-400 max-w-[280px] mx-auto leading-relaxed">No scheduled lectures or tasks for this date.</p>
            </motion.div>
          ) : (
            <div className="flex flex-col gap-10 relative">
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
                    className="flex flex-col md:flex-row gap-8 relative group"
                  >
                    <div className="w-full md:w-32 items-start md:pt-6 font-mono text-[15px] font-bold text-stone-500 dark:text-stone-400 group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors md:text-right shrink-0 tabular-nums">
                      {time.replace(" PM", "").replace(" AM", "")}
                      <span className="text-[10px] ml-1.5 uppercase font-black tracking-widest opacity-60">{time.includes("PM") ? "pm" : "am"}</span>
                    </div>
                    
                    <div className="absolute left-[80.5px] top-[22px] w-8 h-8 rounded-full border-4 border-stone-50 dark:border-stone-950 bg-stone-100 dark:bg-stone-800 items-center justify-center z-10 hidden md:flex transition-transform group-hover:scale-110 duration-300">
                        <div className={`w-3 h-3 rounded-full transition-colors ${isClass ? 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)] group-hover:bg-sky-500' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)] group-hover:bg-emerald-500'}`} />
                    </div>
                    
                    <motion.div 
                      whileHover={{ scale: 1.01, x: 4 }}
                      onClick={() => setDetailSheet(ev)}
                      className="flex-1 rounded-[32px] p-8 md:p-10 bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800/60 shadow-sm cursor-pointer hover:shadow-lg transition-all flex flex-col md:flex-row gap-6 items-start justify-between relative overflow-hidden"
                    >
                      <div className="space-y-5 relative z-10">
                        <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border ${
                            isClass 
                              ? "bg-sky-50 border-sky-200 text-sky-600 dark:bg-sky-500/10 dark:border-sky-900/50 dark:text-sky-400" 
                              : "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-500/10 dark:border-emerald-900/50 dark:text-emerald-400"
                          }`}>
                            {isClass ? 'LIVE LECTURE' : 'ACADEMIC TASK'}
                          </span>
                          <span className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest">{ev.subject}</span>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-black text-stone-900 dark:text-stone-50 font-sans leading-tight tracking-tight uppercase group-hover:text-amber-600 transition-colors">
                          {ev.title}
                        </h3>
                      </div>
                      
                      {isClass && ev.duration && (
                        <div className="flex items-center gap-2.5 bg-stone-50 dark:bg-stone-800/50 px-4 py-2.5 rounded-[12px] border border-stone-200/60 dark:border-stone-700/50 text-[11px] font-black text-stone-500 dark:text-stone-400 tracking-widest relative z-10 w-max shrink-0">
                          <Clock size={16} strokeWidth={2.5} />
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
          <div className="space-y-10 p-2 max-w-2xl mx-auto w-full">
            <div>
              <div className="flex items-center gap-3 mb-6 bg-stone-50 md:bg-stone-100/50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800/60 shadow-sm w-max px-3 py-1.5 rounded-lg">
                 <div className={`w-2 h-2 rounded-full ${detailSheet.type === 'class' ? 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'}`} />
                 <span className="text-[10px] font-black tracking-widest uppercase text-stone-500 dark:text-stone-400 font-sans">
                   {detailSheet.type === 'class' ? 'Timetable: Live Event' : 'Task: Deadline Reminder'}
                 </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-stone-900 dark:text-stone-50 tracking-tight font-sans uppercase leading-none mb-4">{detailSheet.title}</h2>
              <p className="text-sm font-bold text-amber-600 dark:text-amber-500 font-sans uppercase tracking-widest">{detailSheet.subject}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-stone-50 dark:bg-stone-900 rounded-[28px] p-8 border border-stone-200/60 dark:border-stone-800/60 flex flex-col gap-2 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                    <Clock size={80} strokeWidth={1} />
                  </div>
                  <div className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1 relative z-10">Time & Date</div>
                  <div className="flex items-center gap-3 text-xl font-black text-stone-900 dark:text-stone-100 font-sans tracking-tight relative z-10">
                    <Clock size={20} strokeWidth={2.5} className="text-amber-500" />
                    {new Date(detailSheet.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-sm font-bold text-stone-500 dark:text-stone-400 relative z-10">{new Date(detailSheet.start_time).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</div>
               </div>
               
               {detailSheet.type === 'class' ? (
                 <div className="bg-sky-50 dark:bg-sky-500/5 rounded-[28px] p-8 border border-sky-200 dark:border-sky-900/40 flex flex-col gap-2 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                       <Video size={80} strokeWidth={1} className="text-sky-500" />
                    </div>
                    <div className="text-[10px] font-black text-sky-600 dark:text-sky-400 uppercase tracking-widest mb-1 relative z-10">Session Data</div>
                    <div className="flex items-center gap-3 text-xl font-black text-sky-900 dark:text-sky-100 tracking-tight relative z-10">
                      <Video size={20} strokeWidth={2.5} className="text-sky-500" />
                      Virtual Classroom
                    </div>
                    <div className="text-sm font-bold text-sky-700 dark:text-sky-400/80 relative z-10">Duration: {detailSheet.duration} Minutes</div>
                 </div>
               ) : (
                 <div className="bg-emerald-50 dark:bg-emerald-500/5 rounded-[28px] p-8 border border-emerald-200 dark:border-emerald-900/40 flex flex-col gap-2 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-10">
                       <BookOpen size={80} strokeWidth={1} className="text-emerald-500" />
                    </div>
                    <div className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-1 relative z-10">Submission Status</div>
                    <div className="flex items-center gap-3 text-xl font-black text-emerald-900 dark:text-emerald-100 tracking-tight relative z-10">
                      <BookOpen size={20} strokeWidth={2.5} className="text-emerald-500" />
                      Academic Work
                    </div>
                    <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400/80 relative z-10">Required for internal assessment</div>
                 </div>
               )}
            </div>

            <div className="pt-6 border-t border-stone-200/60 dark:border-stone-800/60">
               <Btn label="Close View" variant="outline" full className="py-5" onClick={() => setDetailSheet(null)} />
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
