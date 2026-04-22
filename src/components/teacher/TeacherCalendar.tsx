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
    <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950 overflow-hidden relative premium-texture">
      <div className="px-6 py-8 pb-4 shrink-0 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 sticky top-0 z-20 animate-slide-up">
        <div className="flex justify-between items-start mb-8 max-w-7xl mx-auto w-full relative z-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-stone-50 tracking-tighter font-sans leading-none mb-2">Calendar</h1>
            <p className="text-[10px] font-black text-stone-400 dark:text-stone-500 font-sans uppercase tracking-widest drop-shadow-sm">April 2026</p>
          </div>
          <button 
            onClick={() => setAddSheet(true)}
            className="w-14 h-14 bg-amber-400 dark:bg-amber-500 text-amber-950 rounded-full flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all outline-none border border-transparent hover:border-amber-500/20"
          >
            <Plus size={24} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 max-w-7xl mx-auto w-full relative z-10 px-1">
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

      <div className="flex-1 overflow-y-auto px-6 py-10 scrollbar-hide relative max-w-7xl mx-auto w-full">
        <div className="absolute left-[64px] top-0 bottom-0 w-px bg-stone-200 dark:bg-stone-800" />
        
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
                    className="flex-1 rounded-[24px] p-6 bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800/60 shadow-sm cursor-pointer hover:shadow-xl hover:-translate-y-0.5 hover:border-amber-200 dark:hover:border-amber-900/40 transition-all ml-2 mb-2 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-stone-50/50 to-transparent dark:from-stone-800/20 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                    <div className="flex justify-between items-start mb-4 relative z-10">
                       <div>
                         <div className="text-xl font-black text-stone-900 dark:text-stone-50 font-sans leading-tight tracking-tight mb-2 relative z-10 group-hover/item:text-amber-600 dark:group-hover/item:text-amber-500 transition-colors">
                           {ev.title}
                         </div>
                         <div className="text-[10px] font-black text-stone-400 dark:text-stone-500 font-sans uppercase tracking-[0.2em] flex items-center gap-2">
                           <span className="w-1 h-1 rounded-full bg-stone-300 dark:bg-stone-600" />
                           {ev.batch_id}
                         </div>
                       </div>
                       {isClass && (
                         <div className="text-[10px] font-black font-mono bg-stone-100 dark:bg-stone-800/80 border border-stone-200/60 dark:border-stone-700/60 text-stone-600 dark:text-stone-400 px-3 py-1.5 rounded-lg uppercase tracking-widest tabular-nums top-1 relative shadow-sm">
                           {ev.duration} MIN
                         </div>
                       )}
                    </div>
                    
                    {ev.meeting_link && (
                      <div className="flex items-center gap-1.5 mt-5 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1.5 rounded-lg w-max border border-emerald-200/60 dark:border-emerald-900/50 relative z-10">
                        <Video size={12} strokeWidth={2.5} /> Live Link Attached
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
