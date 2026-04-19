import { useState } from "react";
import { SectionLabel, Btn, EmptySlate } from "../shared/UI";
import { ChevronLeft, CheckCircle2, MessageSquare } from "lucide-react";
import { Feedback } from "../../types";

const FEEDBACK_DATA: Feedback[] = [];

export default function ParentFeedback() {
  const [openFb, setOpenFb] = useState<Feedback | null>(null);
  const [filterSubj, setFilterSubj] = useState("All");
  const [replyText, setReplyText] = useState("");
  const [replySent, setReplySent] = useState(false);
  
  const subjects = ["All", "Maths", "Physics", "Science"];
  const filtered = FEEDBACK_DATA.filter((f) => filterSubj === "All" || f.subject === filterSubj);

  if (openFb) {
    return (
      <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950 animate-slideInRight relative">
        <div className="px-6 py-4 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shrink-0 sticky top-0 z-10 flex items-center justify-between">
          <button 
             onClick={() => { setOpenFb(null); setReplySent(false); setReplyText(""); }} 
             className="flex items-center gap-1 bg-transparent border-none cursor-pointer font-sans text-sm font-semibold text-stone-500 dark:text-stone-400 hover:text-stone-900 transition-colors"
           >
             <ChevronLeft size={18} /> Back
           </button>
           <div className="text-[10px] font-bold tracking-wider uppercase text-stone-500 dark:text-stone-400">Feedback Details</div>
           <div className="w-5" />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
           <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                 <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 bg-stone-200 dark:bg-stone-700 px-2 py-0.5 rounded-md">{openFb.subject}</span>
                 <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400">{openFb.gradedAt}</span>
              </div>
              <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50 leading-tight font-sans mb-4">{openFb.title}</h2>
              <div className="flex items-center gap-3 p-4 rounded-xl border" style={{ backgroundColor: openFb.rbg, borderColor: `${openFb.rc}44` }}>
                 <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0" style={{ backgroundColor: openFb.rc }}>{openFb.icon}</div>
                 <div className="font-bold font-sans" style={{ color: openFb.rc }}>{openFb.label} work</div>
              </div>
           </div>

           <div className="mb-8">
              <SectionLabel>Sir's Comments</SectionLabel>
              <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm text-sm font-medium text-stone-600 dark:text-stone-300 leading-relaxed italic">
                 "{openFb.comment}"
              </div>
           </div>

          {openFb.replied && !replySent && (
            <div className="p-4 bg-stone-100 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-800 mb-6 flex gap-3 text-sm text-stone-600 dark:text-stone-300 font-medium">
              <MessageSquare size={18} className="text-stone-500 dark:text-stone-400 shrink-0" />
              <div className="italic">You replied: "Thank you, Sir. Rohan will work on this."</div>
            </div>
          )}
          
          {replySent && (
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 mb-6 text-sm text-emerald-800 font-bold flex items-center gap-2 shadow-sm">
              <CheckCircle2 size={18} className="text-emerald-500" /> Reply sent to Sir
            </div>
          )}

          {!openFb.replied && !replySent && (
            <div className="animate-slide-up">
              <SectionLabel>Reply to Sir</SectionLabel>
              <textarea 
                value={replyText} 
                onChange={(e) => setReplyText(e.target.value)} 
                placeholder="Write a reply…" 
                className={`w-full box-border min-h-[100px] p-4 rounded-xl border text-sm font-medium bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-50 outline-none transition-all duration-200 resize-none leading-relaxed mb-4 ${replyText ? "border-sky-500 bg-white dark:bg-stone-900 ring-2 ring-sky-100 shadow-sm" : "border-stone-200 dark:border-stone-800"}`}
              />
              <Btn 
                label="Send Reply" 
                variant={replyText.trim() ? "primary" : "outline"}
                full 
                onClick={() => { if (replyText.trim()) setReplySent(true); }} 
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950">
      <div className="px-6 py-6 pb-4 shrink-0 bg-stone-50 dark:bg-stone-950 animate-slide-up sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans mb-4">Feedback</h1>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {subjects.map((s) => (
            <button 
              key={s} 
              onClick={() => setFilterSubj(s)} 
              className={`flex-none px-4 py-2 rounded-lg font-sans text-sm transition-all duration-200 cursor-pointer border ${
                filterSubj === s ? "border-stone-900 bg-stone-900 text-white shadow-sm font-semibold" : "border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-300 font-medium hover:bg-stone-50"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide grid gap-4">
        {filtered.length === 0 ? (
          <EmptySlate icon="💬" title="No feedback yet" sub="Feedback will appear here after Sir reviews Rohan's work." />
        ) : (
          filtered.map((fb, i) => (
            <div 
              key={fb.id} 
              onClick={() => setOpenFb(fb)} 
              className="bg-white dark:bg-stone-900 rounded-[20px] p-5 border border-stone-200 dark:border-stone-800 shadow-sm cursor-pointer animate-slide-up hover:border-stone-300 hover:shadow-md transition-all relative overflow-hidden"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="absolute top-0 bottom-0 left-0 w-1.5" style={{ backgroundColor: fb.rc }} />
              <div className="flex justify-between items-start gap-4 mb-3">
                 <div className="flex items-center gap-2">
                   <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-md">{fb.subject}</span>
                   {fb.replied && <span className="text-[9px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md">Replied</span>}
                 </div>
                 <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400">{fb.gradedAt}</span>
              </div>
              <div className="text-sm font-bold text-stone-900 dark:text-stone-50 font-sans leading-tight mb-2">{fb.title}</div>
              <div className="flex gap-3 items-center">
                 <span className="text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider" style={{ backgroundColor: fb.rbg, color: fb.rc }}>{fb.icon} {fb.label}</span>
                 <p className="text-xs text-stone-500 dark:text-stone-400 font-sans leading-relaxed truncate flex-1 italic mb-0">"{fb.comment}"</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
