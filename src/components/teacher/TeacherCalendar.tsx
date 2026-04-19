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
    <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950 overflow-hidden relative">
      <div className="px-6 py-6 pb-2 shrink-0 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans mb-1">Calendar</h1>
            <p className="text-sm font-medium text-stone-500 dark:text-stone-400 font-sans">April 2026</p>
          </div>
          <button 
            onClick={() => setAddSheet(true)}
            className="w-11 h-11 bg-stone-900 text-white rounded-full flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2">
          {WEEK_DATA.map((day, i) => {
            const isSel = i === selDay;
            return (
              <button
                key={i}
                onClick={() => setSelDay(i)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl min-w-[56px] transition-all duration-200 border cursor-pointer ${
                  isSel 
                    ? "bg-amber-500 border-amber-600 text-white shadow-md scale-105" 
                    : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 hover:border-stone-300 hover:bg-stone-50"
                }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-widest font-sans mb-1.5 ${isSel ? "text-amber-100" : ""}`}>
                  {getDayName(i)}
                </span>
                <span className={`text-xl font-bold font-mono tracking-tighter ${isSel ? "text-white" : "text-stone-900 dark:text-stone-50"}`}>
                  {day.d}
                </span>
                <div className="flex gap-1 mt-2 h-1.5">
                  {Array.from({ length: Math.min(day.events, 3) }).map((_, j) => (
                    <div key={j} className={`w-1.5 h-1.5 rounded-full ${isSel ? "bg-amber-200" : "bg-stone-300"}`} />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide relative">
        <div className="absolute left-10 top-0 bottom-0 w-px bg-stone-200 dark:bg-stone-700" />
        
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
             <div className="w-8 h-8 rounded-full border-4 border-stone-200 border-t-amber-500 animate-spin" />
          </div>
        ) : currentDayEvents.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl opacity-20 mb-3">🌴</div>
            <div className="text-sm font-semibold text-stone-500 dark:text-stone-400">No events for this day</div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 relative">
            {currentDayEvents.map((ev, i) => {
              const sc = SUBJECTS[ev.subject] || SUBJECTS.Physics;
              const isClass = ev.type === "class";
              const time = new Date(ev.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              return (
                <div key={ev.id} className="flex gap-4 relative animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="w-9 items-start pt-1 font-mono text-[11px] font-bold text-stone-500 dark:text-stone-400 text-right shrink-0">
                    {time.replace(" PM", "").replace(" AM", "")}
                  </div>
                  
                  <div className="absolute left-[13px] top-2.5 w-2 h-2 rounded-full border-2 border-white" style={{ backgroundColor: isClass ? '#f59e0b' : '#3b82f6' }} />
                  
                  <div 
                    onClick={() => setDetailSheet(ev)}
                    className="flex-1 rounded-[20px] p-4 border bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 shadow-sm cursor-pointer hover:shadow-md transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                       <div>
                         <div className="text-sm font-bold text-stone-900 dark:text-stone-50 font-sans leading-tight mb-1">
                           {ev.title}
                         </div>
                         <div className="text-xs font-medium text-stone-500 dark:text-stone-400 font-sans">
                           {ev.batch_id}
                         </div>
                       </div>
                       {isClass && (
                         <div className="text-[10px] font-bold font-mono bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2 py-1 rounded-md">
                           {ev.duration}m
                         </div>
                       )}
                    </div>
                    
                    {ev.meeting_link && (
                      <div className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2.5 py-1 rounded-lg w-max border border-emerald-100 dark:border-emerald-900/50">
                        <Video size={14} /> GMeet Link Ready
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
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${detailSheet.type === 'class' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                <span className="text-xs font-semibold tracking-wider uppercase text-stone-500 dark:text-stone-400 font-sans">
                  {detailSheet.type === 'class' ? 'Live Class' : 'Task Due'}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans mb-1">{detailSheet.title}</h2>
              <p className="text-sm font-medium text-stone-500 dark:text-stone-400 font-sans">{detailSheet.batch_id}</p>
            </div>
            
            <div className="bg-stone-50 dark:bg-stone-950 rounded-2xl p-4 border border-stone-200/60 dark:border-stone-800/60 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm font-medium text-stone-700 dark:text-stone-200">
                <Clock size={18} className="text-stone-500 dark:text-stone-400" />
                {new Date(detailSheet.start_time).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })} · {new Date(detailSheet.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {detailSheet.duration ? `(${detailSheet.duration}m)` : ''}
              </div>
              {detailSheet.count && (
                 <div className="flex items-center gap-3 text-sm font-medium text-stone-700 dark:text-stone-200">
                   <Users size={18} className="text-stone-500 dark:text-stone-400" />
                   {detailSheet.count} Students Enrolled
                 </div>
              )}
            </div>
            
            <div className="flex flex-col gap-3">
              {detailSheet.meeting_link && (
                <Btn 
                   label="Join Google Meet" 
                   variant="primary" 
                   full 
                   icon={<Video size={18} />} 
                   onClick={() => window.open(detailSheet.meeting_link, '_blank')}
                />
              )}
              <Btn label="Edit Class Details" variant="outline" full icon={<PenLine size={18} />} />
            </div>
          </div>
        )}
      </Sheet>

      <Sheet open={addSheet} onClose={() => setAddSheet(false)} title="Schedule Event">
        <div className="space-y-4">
           {/* form placeholder */}
           <div className="p-4 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-2xl flex items-center justify-center h-48">
              <span className="text-stone-500 dark:text-stone-400 font-medium text-sm">Form goes here</span>
           </div>
           <Btn label="Save to Calendar" variant="primary" full onClick={() => setAddSheet(false)} />
        </div>
      </Sheet>
    </div>
  );
}
