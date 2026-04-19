import { useState } from "react";
import { SUBJECTS } from "../../constants";
import { Btn, Sheet } from "../shared/UI";
import { Clock, Video, Users, BookOpen } from "lucide-react";

const getDayName = (dayIdx: number) => ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][dayIdx];

export default function StudentCalendar() {
  const [selDay, setSelDay] = useState(3); // Thursday
  const [detailSheet, setDetailSheet] = useState<any>(null);

  const WEEK_DATA = [
    { d: 8, events: 2 }, { d: 9, events: 1 }, { d: 10, events: 3 }, { d: 11, events: 4 },
    { d: 12, events: 1 }, { d: 13, events: 0 }, { d: 14, events: 0 }
  ];

  const DAY_EVENTS = [
    { id: 1, type: "class", time: "6:00 PM", dur: "60m", title: "Physics Class", desc: "Newton's Laws", done: false, bg: "bg-blue-500" },
    { id: 2, type: "task", time: "11:59 PM", title: "Maths Practice Set", desc: "Quadratic Equations", done: false, bg: "bg-emerald-500" },
    { id: 3, type: "class", time: "4:00 PM", dur: "45m", title: "Science Lecture", desc: "Cell Division", done: true, bg: "bg-blue-500" },
  ].sort((a, b) => a.time.localeCompare(b.time));

  return (
    <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950 overflow-hidden relative">
      <div className="px-6 py-6 pb-2 shrink-0 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 sticky top-0 z-10 animate-fade-in">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans mb-1">Calendar</h1>
            <p className="text-sm font-medium text-stone-500 dark:text-stone-400 font-sans">April 2026</p>
          </div>
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
                    ? "bg-emerald-500 border-emerald-600 text-white shadow-md scale-105" 
                    : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-500 dark:text-stone-400 hover:border-stone-300 hover:bg-stone-50"
                }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-widest font-sans mb-1.5 ${isSel ? "text-emerald-100" : ""}`}>
                  {getDayName(i)}
                </span>
                <span className={`text-xl font-bold font-mono tracking-tighter ${isSel ? "text-white" : "text-stone-900 dark:text-stone-50"}`}>
                  {day.d}
                </span>
                <div className="flex gap-1 mt-2 h-1.5">
                  {Array.from({ length: Math.min(day.events, 3) }).map((_, j) => (
                    <div key={j} className={`w-1.5 h-1.5 rounded-full ${isSel ? "bg-emerald-200" : "bg-stone-300"}`} />
                  ))}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide relative">
        <div className="absolute left-10 top-0 bottom-0 w-px bg-stone-200 dark:bg-stone-700" />
        
        {DAY_EVENTS.length === 0 ? (
          <div className="text-center py-10">
            <div className="text-4xl opacity-20 mb-3">🌴</div>
            <div className="text-sm font-semibold text-stone-500 dark:text-stone-400">No events for this day</div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 relative">
            {DAY_EVENTS.map((ev, i) => {
              const isClass = ev.type === "class";
              
              return (
                <div key={ev.id} className="flex gap-4 relative animate-slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                  <div className="w-9 items-start pt-1 font-mono text-[11px] font-bold text-stone-500 dark:text-stone-400 text-right shrink-0">
                    {ev.time.replace(" PM", "").replace(" AM", "")}
                  </div>
                  
                  <div className="absolute left-[13px] top-2.5 w-2 h-2 rounded-full border-2 border-white" style={{ backgroundColor: isClass ? '#3b82f6' : '#10b981' }} />
                  
                  <div 
                    onClick={() => setDetailSheet(ev)}
                    className={`flex-1 rounded-[20px] p-4 border shadow-sm cursor-pointer hover:shadow-md transition-all ${
                      ev.done ? "bg-stone-50 dark:bg-stone-950 border-stone-200 dark:border-stone-800 opacity-60" : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                       <div>
                         <div className="text-xs tracking-widest uppercase font-bold text-stone-400 dark:text-stone-500 mb-1 leading-none font-sans">
                           {isClass ? 'Live Class' : 'Task Due'}
                         </div>
                         <div className="text-sm font-bold text-stone-900 dark:text-stone-50 font-sans leading-tight mb-1">
                           {ev.title}
                         </div>
                         <div className="text-xs font-medium text-stone-500 dark:text-stone-400 font-sans">
                           {ev.desc}
                         </div>
                       </div>
                       {isClass && (
                         <div className="text-[10px] font-bold font-mono bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2 py-1 rounded-md mb-auto shrink-0">
                           {ev.dur}
                         </div>
                       )}
                    </div>
                    
                    {isClass && !ev.done && (
                      <div className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-sky-600 bg-sky-50 dark:bg-sky-500/10 dark:text-sky-400 px-2.5 py-1 rounded-lg w-max border border-sky-100 dark:border-sky-900/50">
                        <Video size={14} /> Join Now
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            
            <div className="absolute left-[10px] top-[140px] right-0 flex items-center pr-2 pointer-events-none">
               <div className="w-2.5 h-2.5 rounded-full bg-rose-500 z-10" />
               <div className="flex-1 h-px bg-rose-400" />
               <div className="text-[10px] font-bold font-mono text-rose-500 ml-2 bg-stone-50 dark:bg-stone-950 py-1 pl-1">NOW</div>
            </div>
          </div>
        )}
      </div>

      <Sheet open={!!detailSheet} onClose={() => setDetailSheet(null)}>
        {detailSheet && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className={`w-2 h-2 rounded-full ${detailSheet.type === 'class' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                <span className="text-xs font-semibold tracking-wider uppercase text-stone-500 dark:text-stone-400 font-sans">
                  {detailSheet.type === 'class' ? 'Live Class' : 'Task Deadline'}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans mb-1">{detailSheet.title}</h2>
              <p className="text-sm font-medium text-stone-500 dark:text-stone-400 font-sans">{detailSheet.desc}</p>
            </div>
            
            <div className="bg-stone-50 dark:bg-stone-950 rounded-2xl p-4 border border-stone-200/60 dark:border-stone-800/60 flex flex-col gap-3">
              <div className="flex items-center gap-3 text-sm font-medium text-stone-700 dark:text-stone-200">
                <Clock size={18} className="text-stone-500 dark:text-stone-400" />
                {getDayName(selDay)}, {WEEK_DATA[selDay].d} Apr · {detailSheet.time} {detailSheet.dur ? `(${detailSheet.dur})` : ''}
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              {detailSheet.type === 'class' ? (
                <>
                  <Btn label="Join Class" variant="primary" full icon={<Video size={18} />} />
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
