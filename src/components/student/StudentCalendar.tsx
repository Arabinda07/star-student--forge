import { useState, useEffect } from "react";
import { SUBJECTS } from "../../constants";
import { Btn, Sheet } from "../shared/UI";
import { Clock, Video, Users, BookOpen, Calendar as CalIcon } from "lucide-react";
import { supabase } from "../../supabaseClient";

const getDayName = (dayIdx: number) => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][dayIdx];

export default function StudentCalendar() {
  const [selDay, setSelDay] = useState(3); // Thursday
  const [detailSheet, setDetailSheet] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEverything();
  }, []);

  const fetchEverything = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Get student profile for batch
    const { data: profile } = await supabase.from('user_profiles').select('meta').eq('id', user.id).single();
    const batchId = profile?.meta?.batchId || profile?.meta?.batch || "Class 8 Evening";

    // 2. Fetch classes for this batch
    const { data: classes } = await supabase.from('classes').select('*').eq('batch_id', batchId);
    
    // 3. Fetch personal tasks
    const { data: tasks } = await supabase.from('tasks').select('*').eq('user_id', user.id);

    const combined = [
      ...(classes || []).map(c => ({ ...c, type: 'class' })),
      ...(tasks || []).map(t => ({ ...t, type: 'task', start_time: t.due_date || t.created_at })) // Using a fallback for sorting
    ];

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
    <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950 overflow-hidden relative">
      <div className="px-6 py-8 pb-4 shrink-0 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 sticky top-0 z-20 animate-fade-in">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-black text-stone-900 dark:text-stone-50 tracking-tighter font-sans mb-1">Calendar</h1>
              <p className="text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400 font-sans">April 2026</p>
            </div>
          </div>

          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2">
            {WEEK_DATA.map((day, i) => {
              const isSel = i === selDay;
              return (
                <button
                  key={i}
                  onClick={() => setSelDay(i)}
                  className={`flex flex-col items-center justify-center p-4 rounded-[20px] min-w-[64px] transition-all duration-300 border cursor-pointer ${
                    isSel 
                      ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 shadow-md scale-105" 
                      : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 hover:border-emerald-200 dark:hover:border-emerald-900/40 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5 hover:shadow-lg"
                  }`}
                >
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] font-sans mb-2 ${isSel ? "text-emerald-600 dark:text-emerald-400" : "text-stone-400 dark:text-stone-500"}`}>
                    {getDayName(i)}
                  </span>
                  <span className={`text-2xl font-black font-sans tracking-tight mb-2 ${isSel ? "text-emerald-600 dark:text-emerald-400" : "text-stone-900 dark:text-stone-50"}`}>
                    {day.d}
                  </span>
                  <div className="flex gap-1 h-1.5 flex-wrap justify-center max-w-[40px]">
                    {Array.from({ length: Math.min(day.events, 3) }).map((_, j) => (
                      <div key={j} className={`w-1.5 h-1.5 rounded-full ${isSel ? "bg-emerald-400 dark:bg-emerald-500" : "bg-stone-300 dark:bg-stone-700"}`} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide relative bg-stone-50 md:bg-white dark:bg-stone-950 md:dark:bg-stone-900 border-x border-stone-100 dark:border-stone-800/50 max-w-4xl mx-auto w-full shadow-inner premium-texture">
        <div className="absolute left-10 top-0 bottom-0 w-px bg-stone-200 dark:bg-stone-800" />
        
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
             <div className="w-8 h-8 rounded-full border-4 border-stone-200 border-t-emerald-500 animate-spin" />
          </div>
        ) : currentDayEvents.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl opacity-20 mb-3">🌴</div>
            <div className="text-[10px] uppercase font-black tracking-[0.2em] text-stone-500 dark:text-stone-400">No events for this day</div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 relative">
            {currentDayEvents.map((ev, i) => {
              const isClass = ev.type === "class";
              const time = new Date(ev.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              
              return (
                <div key={ev.id} className="flex gap-4 relative animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="w-9 items-start pt-1 font-mono text-[11px] font-bold text-stone-500 dark:text-stone-400 text-right shrink-0">
                    {time.replace(" PM", "").replace(" AM", "")}
                  </div>
                  
                  <div className="absolute left-[13px] top-2.5 w-2 h-2 rounded-full border-2 border-stone-50 md:border-white dark:border-stone-950 md:dark:border-stone-900" style={{ backgroundColor: isClass ? '#3b82f6' : '#10b981' }} />
                  
                  <div 
                    onClick={() => setDetailSheet(ev)}
                    className="flex-1 rounded-[32px] p-6 border shadow-sm cursor-pointer hover:shadow-xl transition-all bg-white dark:bg-stone-900 border-stone-200/60 dark:border-stone-800/60 group hover:-translate-y-1 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none duration-700">
                      <div className="text-6xl">{isClass ? <Video size={64}/> : <CalendarIcon size={64}/>}</div>
                    </div>
                    <div className="flex justify-between items-start mb-2 relative z-10">
                       <div>
                         <div className={`text-[10px] tracking-widest uppercase font-black mb-2 leading-none font-sans ${isClass ? 'text-blue-500' : 'text-emerald-500'}`}>
                           {isClass ? 'Live Class' : 'Task Due'}
                         </div>
                         <div className="text-xl font-black text-stone-900 dark:text-stone-50 font-sans leading-tight mb-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                           {ev.title}
                         </div>
                         <div className="text-sm font-bold text-stone-500 dark:text-stone-400 font-sans">
                           {ev.subject}
                         </div>
                       </div>
                       {isClass && (
                         <div className="text-[10px] font-black font-mono bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2 py-1 rounded-md mb-auto shrink-0 border border-stone-200 dark:border-stone-700 shadow-inner">
                           {ev.duration}m
                         </div>
                       )}
                    </div>
                    
                    {isClass && ev.meeting_link && (
                      <div className="flex items-center gap-1.5 mt-4 text-[10px] font-black uppercase tracking-widest text-sky-600 bg-sky-50 dark:bg-sky-500/10 dark:text-sky-400 px-3 py-1.5 rounded-xl w-max border border-sky-100 dark:border-sky-900/50 relative z-10 group-hover:bg-sky-100 transition-colors">
                        <Video size={14} /> Join Now
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Sheet open={!!detailSheet} onClose={() => setDetailSheet(null)}>
        {detailSheet && (
          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-2 h-2 rounded-full ${detailSheet.type === 'class' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                <span className="text-[10px] font-black tracking-[0.25em] uppercase text-stone-500 dark:text-stone-400 font-sans">
                  {detailSheet.type === 'class' ? 'Live Class' : 'Task Deadline'}
                </span>
              </div>
              <h2 className="text-3xl font-black text-stone-900 dark:text-stone-50 tracking-tighter font-sans mb-2">{detailSheet.title}</h2>
              <p className="text-sm font-bold text-stone-500 dark:text-stone-400 font-sans">{detailSheet.subject}</p>
            </div>
            
            <div className="bg-stone-50 dark:bg-stone-950 rounded-[24px] p-5 border border-stone-200/60 dark:border-stone-800/60 flex flex-col gap-3 shadow-inner">
              <div className="flex items-center gap-4 text-sm font-bold text-stone-700 dark:text-stone-200">
                <div className="w-10 h-10 rounded-2xl bg-white dark:bg-stone-900 flex items-center justify-center border border-stone-200 dark:border-stone-800 shadow-sm shrink-0">
                  <Clock size={18} className="text-stone-500 dark:text-stone-400" />
                </div>
                <div>
                  <div className="text-stone-900 dark:text-stone-50">{new Date(detailSheet.start_time).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  <div className="text-xs text-stone-500 font-medium font-mono">{new Date(detailSheet.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {detailSheet.duration ? `(${detailSheet.duration}m)` : ''}</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 pt-4">
              {detailSheet.type === 'class' ? (
                <>
                  {detailSheet.meeting_link && (
                    <Btn 
                       label="Join Class" 
                       variant="primary" 
                       full 
                       icon={<Video size={18} />} 
                       onClick={() => window.open(detailSheet.meeting_link, '_blank')}
                    />
                  )}
                  <Btn label="Prepare Material" variant="outline" full icon={<BookOpen size={18} />} />
                </>
              ) : (
                <Btn label="Submit Work" variant="primary" full icon={<Users size={18} />} />
              )}
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
