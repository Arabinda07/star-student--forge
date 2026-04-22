import { useState, useEffect } from "react";
import { SUBJECTS } from "../../constants";
import { Btn, SectionLabel, Sheet } from "../shared/UI";
import { ChevronRight, Plus, Calendar as CalIcon, Clock, Users, Play, PenLine, Video } from "lucide-react";
import { supabase } from "../../supabaseClient";

const getDayName = (dayIdx: number) => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][dayIdx];

export default function TeacherCalendar() {
  const [selDay, setSelDay] = useState(3); // Thursday
  const [addSheet, setAddSheet] = useState(false);
  const [detailSheet, setDetailSheet] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch classes for this teacher
    // We'll also fetch notes as "tasks" if we want them here, but let's stick to classes table
    const { data } = await supabase
      .from('classes')
      .select('*')
      .eq('teacher_id', user.id);
    
    if (data) setEvents(data);
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
    <div className="h-full flex flex-col bg-white dark:bg-stone-950 overflow-hidden relative">
      <div className="px-6 py-8 pb-4 shrink-0 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 sticky top-0 z-20 animate-slide-up">
        <div className="flex justify-between items-start mb-8 max-w-7xl mx-auto w-full relative z-10">
          <div>
            <h1 className="text-3xl font-bold text-heading tracking-tight mb-1 uppercase">Calendar</h1>
            <p className="text-[10px] font-medium text-muted uppercase tracking-[0.2em] leading-none">April 2026 Cycle</p>
          </div>
          <button 
            onClick={() => setAddSheet(true)}
            className="w-12 h-12 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-full flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all outline-none border-none"
          >
            <Plus size={20} weight="bold" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 max-w-7xl mx-auto w-full relative z-10 px-1">
          {WEEK_DATA.map((day, i) => {
            const isSel = i === selDay;
            return (
              <button
                key={i}
                onClick={() => setSelDay(i)}
                className={`flex flex-col items-center justify-center py-4 px-5 rounded-2xl min-w-[64px] transition-all duration-300 border cursor-pointer ${
                  isSel 
                    ? "bg-stone-900 border-stone-900 shadow-xl scale-105" 
                    : "bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-800 hover:border-brand-500/20 hover:bg-stone-50 dark:hover:bg-stone-800/50"
                }`}
              >
                <span className={`text-[9px] font-bold uppercase tracking-wider font-sans mb-2 ${isSel ? "text-stone-500" : "text-muted"}`}>
                  {getDayName(i)}
                </span>
                <span className={`text-xl font-bold font-display tracking-tight mb-2 ${isSel ? "text-white" : "text-heading"}`}>
                  {day.d}
                </span>
                <div className="flex gap-1 h-1.5 flex-wrap justify-center max-w-[40px]">
                  {Array.from({ length: Math.min(day.events, 3) }).map((_, j) => (
                    <div key={j} className={`w-1 h-1 rounded-full ${isSel ? "bg-brand-400" : "bg-stone-200 dark:bg-stone-700"}`} />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-10 scrollbar-hide relative bg-white dark:bg-stone-950 border-x border-stone-100/50 dark:border-stone-800/30 max-w-4xl mx-auto w-full">
        <div className="absolute left-[64px] top-0 bottom-0 w-px bg-stone-100 dark:bg-stone-800" />
        
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
             <div className="w-8 h-8 rounded-full border-4 border-stone-200 border-t-amber-500 animate-spin" />
          </div>
        ) : currentDayEvents.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center">
            <div className="w-24 h-24 bg-stone-100/50 dark:bg-stone-900/50 rounded-full flex items-center justify-center mb-6">
              <span className="text-4xl opacity-40 grayscale -scale-x-100">🌴</span>
            </div>
            <div className="text-2xl lg:text-3xl font-black text-stone-900 dark:text-stone-50 font-sans tracking-tight mb-2 relative z-10">Free time</div>
            <p className="text-sm font-bold text-stone-500 dark:text-stone-400 relative z-10">No events scheduled for this day.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 relative">
            {currentDayEvents.map((ev, i) => {
              const sc = SUBJECTS[ev.subject] || SUBJECTS.Physics;
              const isClass = ev.type === "class";
              const time = new Date(ev.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div key={ev.id} className="flex gap-4 sm:gap-6 relative animate-slide-up group/item" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="w-12 items-start pt-4 font-mono text-[11px] font-black text-stone-400 dark:text-stone-500 group-hover/item:text-amber-500 transition-colors text-right shrink-0 tabular-nums">
                    {time.replace(" PM", "").replace(" AM", "")}
                    <span className="block text-[8px] uppercase tracking-widest opacity-60 mt-0.5">{time.includes("PM") ? "pm" : "am"}</span>
                  </div>
                  
                  <div className="absolute left-[40px] top-[26px] w-[9px] h-[9px] rounded-full border-[1.5px] border-white dark:border-stone-950 flex items-center justify-center bg-stone-300 dark:bg-stone-600 z-10 group-hover/item:bg-amber-400 group-hover/item:border-amber-100 dark:group-hover/item:border-amber-900 transition-colors shadow-sm" />
                  
                  <div 
                    onClick={() => setDetailSheet(ev)}
                    className="flex-1 rounded-3xl p-8 border border-stone-100 dark:border-stone-800/50 shadow-sm cursor-pointer hover:shadow-xl transition-all bg-white dark:bg-stone-900 group relative overflow-hidden"
                  >
                    <div className="flex justify-between items-start mb-4 relative z-10">
                       <div>
                         <div className="text-xl font-bold text-heading font-display leading-tight tracking-tight mb-2 uppercase group-hover:text-brand-600 transition-colors">
                           {ev.title}
                         </div>
                         <div className="text-[10px] font-medium text-muted font-sans uppercase tracking-widest flex items-center gap-2">
                           <span className="w-1 h-1 rounded-full bg-stone-100 dark:bg-stone-800" />
                           {ev.batch_id}
                         </div>
                       </div>
                       {isClass && (
                         <div className="text-[10px] font-bold font-mono bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2.5 py-1 rounded-lg mb-auto shrink-0 border border-stone-100 dark:border-stone-700">
                           {ev.duration} MIN
                         </div>
                       )}
                    </div>
                    
                    {ev.meeting_link && (
                      <div className="flex items-center gap-1.5 mt-5 text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg w-max border border-emerald-100 dark:border-emerald-900/30 relative z-10">
                        <Video size={12} weight="bold" /> Session Link
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
          <div className="space-y-10 p-2 max-w-2xl mx-auto w-full">
            <div>
              <div className="flex items-center gap-3 mb-6 bg-stone-50 md:bg-stone-100/50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800/60 shadow-sm w-max px-3 py-1.5 rounded-lg">
                 <div className={`w-2 h-2 rounded-full ${detailSheet.type === 'class' ? 'bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.6)]' : 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]'}`} />
                 <span className="text-[10px] font-black tracking-widest uppercase text-stone-500 dark:text-stone-400 font-sans">
                   {detailSheet.type === 'class' ? 'Timetable: Live Event' : 'Task: Deadline Reminder'}
                 </span>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-stone-900 dark:text-stone-50 tracking-tight font-sans leading-none mb-3">{detailSheet.title}</h2>
              <p className="text-sm font-bold text-stone-500 dark:text-stone-400 font-sans">{detailSheet.batch_id}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="bg-stone-50 dark:bg-stone-900 rounded-[28px] border border-stone-200/60 dark:border-stone-800/60 p-8 flex flex-col gap-2 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="absolute top-0 right-0 p-6 opacity-10">
                     <Clock size={80} strokeWidth={1} />
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-1 relative z-10">Schedule</div>
                  <div className="flex items-center gap-3 text-xl font-black text-stone-900 dark:text-stone-50 font-sans tracking-tight relative z-10">
                    <Clock size={20} strokeWidth={2.5} className="text-amber-500" />
                    {new Date(detailSheet.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div className="text-sm font-bold text-stone-500 dark:text-stone-400 max-w-[120px] relative z-10">{new Date(detailSheet.start_time).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</div>
               </div>
               
               {detailSheet.count && (
                  <div className="bg-stone-50 dark:bg-stone-900 rounded-[28px] border border-stone-200/60 dark:border-stone-800/60 p-8 flex flex-col gap-2 relative overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                     <div className="absolute top-0 right-0 p-6 opacity-10">
                        <Users size={80} strokeWidth={1} />
                     </div>
                     <div className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-1 relative z-10">Roster</div>
                     <div className="flex items-center gap-3 text-xl font-black text-stone-900 dark:text-stone-50 font-sans tracking-tight relative z-10">
                        <Users size={20} strokeWidth={2.5} className="text-sky-500" />
                        {detailSheet.count} Capacity
                     </div>
                     <div className="text-sm font-bold text-stone-500 dark:text-stone-400 relative z-10">Enrolled Students</div>
                  </div>
               )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-stone-200/60 dark:border-stone-800/60">
              {detailSheet.meeting_link && (
                 <div className="w-full sm:w-auto flex-1">
                   <Btn 
                      label="Join Google Meet" 
                      variant="primary" 
                      full 
                      icon={<Video size={18} strokeWidth={2.5} />} 
                      onClick={() => window.open(detailSheet.meeting_link, '_blank')}
                   />
                 </div>
              )}
              <div className="w-full sm:w-auto flex-1 text-center">
                <Btn label="Edit Details" variant="outline" full icon={<PenLine size={18} strokeWidth={2.5} />} />
              </div>
            </div>
          </div>
        )}
      </Sheet>

      <Sheet open={addSheet} onClose={() => setAddSheet(false)} title="Schedule Event">
        <div className="space-y-6 max-w-2xl mx-auto w-full p-2">
           <div className="p-8 bg-stone-50 dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800/60 rounded-[32px] flex items-center justify-center h-48 shadow-sm">
              <span className="text-stone-500 dark:text-stone-400 font-bold text-sm tracking-wide">Form implementation goes here</span>
           </div>
           <Btn label="Save Event" variant="primary" full onClick={() => setAddSheet(false)} />
        </div>
      </Sheet>
    </div>
  );
}
