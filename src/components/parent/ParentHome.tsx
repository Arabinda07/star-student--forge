import { useState, useEffect } from "react";
import { SUBJECTS } from "../../constants";
import { SectionLabel, Btn, Chip, Sheet } from "../shared/UI";
import { Bell, ChevronRight, MessageSquare } from "lucide-react";

function useClock(init = 554) {
  const [s, setS] = useState(init);
  useEffect(() => {
    const t = setInterval(() => setS(p => Math.max(0, p - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  return s;
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

export default function ParentHome() {
  const secs = useClock();
  const [contactSheet, setContactSheet] = useState(false);
  const [msgSent, setMsgSent] = useState(false);
  const [customMsg, setCustomMsg] = useState("");
  const [selTemplate, setSelTemplate] = useState<number | null>(null);
  
  const templates = [
    "Child unwell today — won't attend class",
    "Fee payment done via UPI",
    "Question about homework assignment",
    "Request to reschedule a class",
    "General query"
  ];

  return (
    <div className="h-full flex flex-col overflow-y-auto scrollbar-hide bg-stone-50 dark:bg-stone-950">
      <div className="px-6 py-6 pb-4 shrink-0 animate-slide-up flex justify-between items-start sticky top-0 bg-stone-50 dark:bg-stone-950 z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center text-2xl">
            👨‍👩‍👦
          </div>
          <div>
            <div className="text-lg font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans">Welcome back</div>
            <div className="text-sm font-medium text-stone-500 dark:text-stone-400 font-sans">Everything is up to date</div>
          </div>
        </div>
        <button aria-label="Notifications" className="w-11 h-11 rounded-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-center cursor-pointer shadow-sm relative hover:bg-stone-50 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500">
          <Bell size={20} className="text-stone-600 dark:text-stone-300" />
        </button>
      </div>

      <div className="flex-1 px-6 pb-8 flex flex-col gap-6 overflow-y-auto scrollbar-hide">
        <div className="shrink-0 rounded-[24px] p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm relative overflow-hidden animate-slide-up [animation-delay:0.05s] flex items-center justify-center min-h-[160px]">
          <div className="text-center">
             <div className="w-12 h-12 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-3">
               <span className="text-xl">📅</span>
             </div>
             <p className="text-sm font-bold text-stone-900 dark:text-stone-50 font-sans">No upcoming classes</p>
             <p className="text-xs text-stone-500 font-sans mt-1">Check back later for updates.</p>
           </div>
        </div>

        <div className="shrink-0 animate-slide-up [animation-delay:0.1s]">
          <SectionLabel>This Week's Work</SectionLabel>
          <div className="bg-white dark:bg-stone-900 p-6 border border-stone-200 dark:border-stone-800 rounded-[20px] text-center shadow-sm">
             <p className="text-sm font-bold text-stone-900 dark:text-stone-50 font-sans mb-1">All caught up</p>
             <p className="text-xs text-stone-500 font-sans">No recent homework to display.</p>
          </div>
        </div>

        <div className="shrink-0 bg-white dark:bg-stone-900 rounded-[20px] p-5 border border-amber-200 shadow-sm animate-slide-up [animation-delay:0.15s] flex items-center gap-4 cursor-pointer hover:shadow-md transition-all relative overflow-hidden">
          <div className="absolute top-0 bottom-0 left-0 w-1 bg-amber-400" />
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-2xl shrink-0">
            💰
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10px] font-bold tracking-wider uppercase text-amber-600 mb-1 font-sans">May 2025 Fee</div>
            <div className="text-lg font-bold text-stone-900 dark:text-stone-50 font-mono tracking-tight">₹2,500 due</div>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <Chip label="Due in 3 days" variant="due" small />
          </div>
        </div>

        <div className="shrink-0 bg-white dark:bg-stone-900 rounded-[20px] p-5 border border-stone-200 dark:border-stone-800 animate-slide-up [animation-delay:0.2s] shadow-sm flex items-start gap-4">
          <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg shrink-0 font-bold">★</div>
          <div className="flex-1">
            <div className="text-sm font-bold text-stone-900 dark:text-stone-50 font-sans mb-1">Great work on Motion Diagrams</div>
            <div className="text-xs font-medium text-stone-600 dark:text-stone-300 font-sans italic leading-relaxed">"Excellent work, Rohan! Your diagrams are very clean…"</div>
            <button className="mt-3 text-[11px] font-bold tracking-wider uppercase text-sky-600 bg-transparent border-none cursor-pointer font-sans block hover:text-sky-700">Read full feedback →</button>
          </div>
        </div>

        <button 
          onClick={() => setContactSheet(true)}
          className="shrink-0 bg-stone-900 text-white rounded-[20px] p-5 border-none cursor-pointer flex items-center gap-4 animate-slide-up [animation-delay:0.3s] shadow-sm hover:bg-stone-800 transition-all text-left w-full relative overflow-hidden"
        >
          <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center text-white shrink-0">
            <MessageSquare size={18} fill="currentColor" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-base font-bold font-sans mb-1">Message Arabinda Sir</div>
            <div className="text-sm font-medium text-white/70 font-sans">Quick updates or queries</div>
          </div>
          <ChevronRight size={20} className="text-white/50 shrink-0" />
        </button>
      </div>

      <Sheet open={contactSheet} onClose={() => { setContactSheet(false); setMsgSent(false); setSelTemplate(null); setCustomMsg(""); }} title={msgSent ? undefined : "Message Sir"}>
        {msgSent ? (
          <div className="text-center py-8">
            <div className="text-sky-500 mb-4 flex justify-center animate-slide-up">
               <MessageSquare size={64} fill="currentColor" />
            </div>
            <div className="text-2xl font-bold text-stone-900 dark:text-stone-50 font-sans tracking-tight mb-2">Message Sent!</div>
            <div className="text-sm font-medium text-stone-500 dark:text-stone-400 font-sans leading-relaxed">Sir will reply in the app soon.</div>
          </div>
        ) : (
          <div className="space-y-6">
            <div>
              <div className="text-xs font-semibold tracking-wider uppercase text-stone-500 dark:text-stone-400 font-sans mb-3">Quick Templates</div>
              <div className="flex flex-col gap-2">
                {templates.map((t, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelTemplate(i === selTemplate ? null : i)} 
                    className={`text-left p-3 rounded-xl border text-sm font-medium transition-all duration-200 flex items-center gap-3 cursor-pointer ${
                      selTemplate === i ? "border-sky-500 bg-sky-50 text-sky-900 shadow-sm" : "border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-700 dark:text-stone-200 hover:bg-white"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${selTemplate === i ? "border-sky-500 bg-sky-500" : "border-stone-300 dark:border-stone-700"}`}>
                      {selTemplate === i && <span className="w-1.5 h-1.5 bg-white dark:bg-stone-900 rounded-full" />}
                    </div>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <div className="text-xs font-semibold tracking-wider uppercase text-stone-500 dark:text-stone-400 font-sans mb-3">Or type a message</div>
              <textarea 
                value={customMsg} 
                onChange={(e) => setCustomMsg(e.target.value)} 
                placeholder="Write your message here…" 
                className={`w-full box-border min-h-[100px] p-4 rounded-xl border text-sm bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-50 outline-none transition-all duration-200 resize-none leading-relaxed ${customMsg ? "border-sky-500 bg-white dark:bg-stone-900 shadow-sm ring-2 ring-sky-100" : "border-stone-200 dark:border-stone-800"}`}
              />
            </div>
            
            <Btn 
              label="Send Message" 
              variant="primary"
              full 
              onClick={() => { if (selTemplate !== null || customMsg.trim()) setMsgSent(true); }} 
            />
          </div>
        )}
      </Sheet>
    </div>
  );
}
