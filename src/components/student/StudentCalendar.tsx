import { useState, useEffect } from "react";
import { SUBJECTS } from "../../constants";
import { Btn, Sheet } from "../shared/UI";
import { 
  Clock, 
  VideoCamera, 
  Users, 
  BookOpen, 
  CalendarBlank 
} from "@phosphor-icons/react";
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
    <div className="h-full flex flex-col bg-white dark:bg-stone-950 overflow-hidden relative">
      <div className="px-6 py-12 pb-4 shrink-0 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 sticky top-0 z-20 animate-fade-in">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h1 className="text-3xl font-bold text-heading tracking-tight mb-1 uppercase">Calendar</h1>
              <p className="text-[10px] font-medium text-muted uppercase tracking-[0.2em] leading-none">April 2026 Cycle</p>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-6 -mx-2 px-2">
            {WEEK_DATA.map((day, i) => {
              const isSel = i === selDay;
              return (
                <button
                  key={i}
                  onClick={() => setSelDay(i)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl min-w-[64px] transition-all duration-300 border cursor-pointer ${
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
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-10 scrollbar-hide relative bg-white dark:bg-stone-950 border-x border-stone-100/50 dark:border-stone-800/30 max-w-4xl mx-auto w-full">
        <div className="absolute left-10 top-0 bottom-0 w-px bg-stone-100 dark:bg-stone-800" />
        
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
             <div className="w-8 h-8 rounded-full border-4 border-stone-200 border-t-brand-500 animate-spin" />
          </div>
        ) : currentDayEvents.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl grayscale opacity-20 mb-8 animate-bounce transition-duration-1000">🌴</div>
            <div className="text-[11px] uppercase font-black tracking-[0.4em] text-stone-400 dark:text-stone-600 italic">No cycles scheduled for this period</div>
          </div>
        ) : (
          <div className="flex flex-col gap-8 relative">
            {currentDayEvents.map((ev, i) => {
              const isClass = ev.type === "class";
              const time = new Date(ev.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              
              return (
                <div key={ev.id} className="flex gap-6 relative animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="w-10 items-start pt-1 font-mono text-[11px] font-bold text-stone-400 dark:text-stone-500 text-right shrink-0 tabular">
                    {time.replace(" PM", "").replace(" AM", "")}
                  </div>
                  
                  <div className="absolute left-[13px] top-3.5 w-2 h-2 rounded-full border-2 border-stone-50 md:border-white dark:border-stone-950 md:dark:border-stone-900 z-10" style={{ backgroundColor: isClass ? '#3b82f6' : '#10b981' }} />
                  
                  <div 
                    onClick={() => setDetailSheet(ev)}
                    className="flex-1 rounded-3xl p-8 border border-stone-100 dark:border-stone-800/50 shadow-sm cursor-pointer hover:shadow-xl transition-all bg-white dark:bg-stone-900 group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none duration-700">
                      <div className="text-6xl">{isClass ? <VideoCamera size={80} weight="duotone"/> : <CalendarBlank size={80} weight="duotone"/>}</div>
                    </div>
                    <div className="flex justify-between items-start mb-4 relative z-10">
                       <div>
                         <div className={`text-[10px] tracking-widest uppercase font-bold mb-3 leading-none font-sans ${isClass ? 'text-blue-500' : 'text-emerald-500'}`}>
                           {isClass ? 'Live Session' : 'Assignment'}
                         </div>
                         <div className="text-2xl font-bold text-heading font-display leading-tight mb-3 group-hover:text-brand-600 transition-colors uppercase tracking-tight">
                           {ev.title}
                         </div>
                         <div className="text-[10px] font-medium text-muted font-sans uppercase tracking-widest">
                           {ev.subject}
                         </div>
                       </div>
                       {isClass && (
                         <div className="text-[10px] font-bold font-mono bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2.5 py-1 rounded-lg mb-auto shrink-0 border border-stone-100 dark:border-stone-700">
                           {ev.duration}m
                         </div>
                       )}
                    </div>
                    
                    {isClass && ev.meeting_link && (
                      <div className="flex items-center gap-2 mt-6 text-[10px] font-bold uppercase tracking-widest text-white bg-stone-900 hover:bg-black dark:bg-stone-50 dark:text-stone-900 px-5 py-3 rounded-xl w-max relative z-10 transition-all shadow-lg">
                        <VideoCamera size={14} weight="bold" /> Start Session
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
          <div className="space-y-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className={`w-3 h-3 rounded-full ${detailSheet.type === 'class' ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`} />
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-stone-500 dark:text-stone-400 font-sans italic">
                  {detailSheet.type === 'class' ? 'Live Coordination' : 'Assignment Protocol'}
                </span>
              </div>
              <h2 className="text-4xl font-black text-stone-900 dark:text-stone-50 tracking-tighter font-display uppercase italic leading-[0.9] mb-4">{detailSheet.title}</h2>
              <p className="text-xs font-bold text-stone-400 dark:text-stone-500 font-sans uppercase tracking-widest">{detailSheet.subject}</p>
            </div>
            
            <div className="bg-stone-50 dark:bg-stone-950 rounded-[32px] p-6 border border-stone-100 dark:border-stone-800 flex flex-col gap-4 shadow-inner">
              <div className="flex items-center gap-5 text-sm font-bold text-stone-700 dark:text-stone-200">
                <div className="w-14 h-14 rounded-[20px] bg-white dark:bg-stone-900 flex items-center justify-center border border-stone-100 dark:border-stone-800 shadow-sm shrink-0">
                  <Clock size={24} weight="duotone" className="text-stone-500" />
                </div>
                <div>
                  <div className="text-stone-900 dark:text-stone-50 font-black uppercase tracking-tight italic text-lg">{new Date(detailSheet.start_time).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                  <div className="text-[11px] text-stone-500 font-black font-mono uppercase tracking-widest">{new Date(detailSheet.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {detailSheet.duration ? `• ${detailSheet.duration} minute duration` : ''}</div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 pt-6">
              {detailSheet.type === 'class' ? (
                <>
                  {detailSheet.meeting_link && (
                    <Btn 
                       label="Initialize Uplink" 
                       variant="primary" 
                       full 
                       className="h-16 rounded-[24px] uppercase tracking-[0.2em] italic font-black shadow-2xl"
                       icon={<VideoCamera size={20} weight="bold" />} 
                       onClick={() => window.open(detailSheet.meeting_link, '_blank')}
                    />
                  )}
                  <Btn label="Briefing Materials" variant="outline" full className="h-16 rounded-[24px] uppercase tracking-[0.2em] italic font-black" icon={<BookOpen size={20} weight="duotone" />} />
                </>
              ) : (
                <Btn label="Submit Artifact" variant="primary" full className="h-16 rounded-[24px] uppercase tracking-[0.2em] italic font-black shadow-2xl" icon={<Users size={20} weight="bold" />} />
              )}
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
