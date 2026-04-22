import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SectionLabel, Btn, EmptySlate } from "../shared/UI";
import { ChevronLeft, CheckCircle2, MessageSquare, Search, Filter, Sparkles, ChevronRight } from "lucide-react";
import { Feedback } from "../../types";

const FEEDBACK_DATA: Feedback[] = [];

export default function ParentFeedback() {
  const [openFb, setOpenFb] = useState<Feedback | null>(null);
  const [filterSubj, setFilterSubj] = useState("All");
  const [replyText, setReplyText] = useState("");
  const [replySent, setReplySent] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  const subjects = ["All", "Maths", "Physics", "Science"];
  const filtered = FEEDBACK_DATA.filter((f) => 
    (filterSubj === "All" || f.subject === filterSubj) &&
    (f.title.toLowerCase().includes(searchQuery.toLowerCase()) || f.comment.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (openFb) {
    return (
      <div className="h-full flex flex-col bg-white dark:bg-stone-950 scrollbar-hide overflow-y-auto">
        <div className="px-6 py-8 pb-6 shrink-0 animate-slide-up sticky top-0 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md z-30 border-b border-stone-200/60 dark:border-stone-800/60">
          <div className="max-w-4xl mx-auto w-full relative z-10">
            <button 
               onClick={() => { setOpenFb(null); setReplySent(false); setReplyText(""); }} 
               className="flex items-center gap-2 bg-transparent border-none cursor-pointer font-sans text-[10px] uppercase tracking-[0.2em] font-bold text-muted hover:text-heading transition-colors mb-6 group"
            >
              <div className="w-8 h-8 rounded-full border border-stone-100 dark:border-stone-800 flex items-center justify-center bg-white dark:bg-stone-900 shadow-sm transition-all group-hover:-translate-x-1">
                <ChevronLeft size={16} weight="bold" />
              </div>
              Back to Feed
            </button>
            
            <div className="flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                   <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-100 dark:border-amber-900/30 shadow-sm">{openFb.subject}</span>
                   <span className="text-[10px] font-medium text-muted uppercase tracking-wider flex items-center gap-2">
                       <span className="w-1 h-1 rounded-full bg-stone-100 dark:bg-stone-800" />
                       {openFb.gradedAt}
                   </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-heading leading-tight font-display tracking-tight uppercase">{openFb.title}</h2>
              </div>
              <div className="flex flex-col items-center gap-2 shrink-0 p-5 bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-stone-800/50 shadow-sm">
                 <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner border border-black/5 dark:border-white/5" style={{ backgroundColor: openFb.rbg }}>
                    <span className="drop-shadow-sm">{openFb.icon}</span>
                 </div>
                 <div className="text-[9px] font-bold uppercase tracking-widest font-sans" style={{ color: openFb.rc }}>{openFb.label}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-10 pb-24 space-y-10 mt-8">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="space-y-4"
           >
              <div className="flex items-center gap-2 text-stone-400 dark:text-stone-500 mb-3 font-sans text-[10px] font-black uppercase tracking-widest">
                <Sparkles size={16} strokeWidth={2.5} className="text-amber-500" />
                Instructor Analysis
              </div>
              <div className="bg-white dark:bg-stone-900 p-10 md:p-12 rounded-[32px] border border-stone-200/60 dark:border-stone-800/60 shadow-sm text-lg md:text-xl font-bold text-stone-700 dark:text-stone-300 leading-relaxed italic relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
                   <MessageSquare size={160} strokeWidth={1} />
                 </div>
                 <div className="relative z-10">"{openFb.comment}"</div>
              </div>
           </motion.div>

           <AnimatePresence mode="wait">
             {openFb.replied && !replySent && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="p-8 bg-stone-100 dark:bg-stone-800/50 rounded-[32px] border border-stone-200/60 dark:border-stone-700/50 flex gap-5 text-base text-stone-600 dark:text-stone-400 font-medium"
               >
                 <MessageSquare size={24} className="text-stone-400 shrink-0 mt-0.5" />
                 <div className="leading-relaxed">
                   <span className="font-bold text-stone-900 dark:text-stone-200 block mb-2 font-sans text-xs uppercase tracking-widest text-[10px]">Your reply:</span>
                   <span className="italic text-lg md:text-xl font-bold text-stone-700 dark:text-stone-300">"Thank you, Sir. Rohan will work on this."</span>
                 </div>
               </motion.div>
             )}
             
             {replySent && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="p-8 bg-emerald-50 dark:bg-emerald-950/30 rounded-[32px] border border-emerald-200/60 dark:border-emerald-900/50 text-base text-emerald-800 dark:text-emerald-400 font-bold flex items-center gap-4 shadow-sm"
               >
                 <CheckCircle2 size={28} className="text-emerald-500" /> 
                 <div className="flex items-center gap-2">
                   Response successfully dispatched to Instructor
                 </div>
               </motion.div>
             )}

             {!openFb.replied && !replySent && (
               <motion.div 
                 initial={{ opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="space-y-6"
               >
                 <div className="flex items-center gap-2 text-stone-400 dark:text-stone-500 mb-3 font-sans text-[10px] font-black uppercase tracking-widest">
                   <MessageSquare size={16} strokeWidth={2.5} className="text-sky-500" />
                   Draft a response
                 </div>
                 <textarea 
                   value={replyText} 
                   onChange={(e) => setReplyText(e.target.value)} 
                   placeholder="Acknowledge the feedback or ask a clarifying question…" 
                   className={`w-full box-border min-h-[160px] p-8 md:p-10 rounded-[32px] border-2 text-lg md:text-xl font-bold bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 outline-none transition-all duration-300 resize-none leading-relaxed shadow-sm block ${replyText ? "border-sky-500 ring-4 ring-sky-500/10 shadow-xl" : "border-stone-200/60 dark:border-stone-800/60"}`}
                 />
                 <div className="flex justify-end pt-4">
                   <Btn 
                     label="Transmit Response" 
                     className={`px-10 py-5 rounded-[24px] font-black text-sm uppercase tracking-widest shadow-lg transition-all ${replyText.trim() ? "shadow-sky-500/20" : "opacity-50 grayscale"}`}
                     onClick={() => { if (replyText.trim()) setReplySent(true); }} 
                   />
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white dark:bg-stone-950 scrollbar-hide overflow-y-auto">
      {/* Premium Header */}
      <div className="px-6 py-12 md:py-16 pb-6 shrink-0 animate-slide-up sticky top-0 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md z-30 border-b border-stone-200/60 dark:border-stone-800/60 relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none -translate-y-8 select-none">
          <MessageSquare size={320} strokeWidth={0.5} />
        </div>
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 flex items-center justify-center text-3xl shadow-sm hidden md:flex">
              💭
            </div>
            <div>
              <h1 className="text-3xl font-bold text-heading tracking-tight mb-1 uppercase">Feedback</h1>
              <p className="text-[10px] font-medium text-muted uppercase tracking-[0.2em] leading-none">Direct communications from the classroom</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-amber-500 transition-colors" size={20} strokeWidth={2.5}/>
              <input 
                type="text" 
                placeholder="Search through messages..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-5 bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800/60 rounded-[28px] text-base font-bold text-stone-800 dark:text-stone-200 placeholder:text-stone-400 outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500/50 transition-all shadow-sm block box-border"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide shrink-0 max-md:pb-2 pt-1 md:pt-0">
              {subjects.map((s) => (
                <button 
                  key={s} 
                  onClick={() => setFilterSubj(s)} 
                  className={`flex-none px-8 py-5 rounded-[24px] font-sans text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer border ${
                    filterSubj === s ? "border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xl shadow-stone-900/10" : "border-stone-200/60 dark:border-stone-800/60 bg-white dark:bg-stone-900 text-stone-500 dark:text-stone-400 hover:border-amber-500 hover:text-amber-600 shadow-sm hover:shadow-md"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 md:py-16 pb-24">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="py-20"
            >
              <EmptySlate icon="💬" title="In-box empty" sub={searchQuery ? "No communications match your search criteria." : "Ongoing feedback from Sir will accumulate here."} />
            </motion.div>
          ) : (
            <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((fb, i) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={fb.id} 
                  onClick={() => setOpenFb(fb)} 
                  className="bg-white dark:bg-stone-900 rounded-3xl p-8 border border-stone-100 dark:border-stone-800/50 shadow-sm cursor-pointer hover:shadow-xl hover:border-brand-500/10 transition-all duration-300 group flex flex-col h-full relative overflow-hidden"
                >
                  <div className="absolute top-0 bottom-0 left-0 w-1.5 transition-all duration-300 group-hover:w-2" style={{ backgroundColor: fb.rc }} />
                  
                  <div className="flex justify-between items-start gap-4 mb-8">
                     <div className="flex flex-wrap items-center gap-2">
                       <span className="text-[10px] font-bold uppercase tracking-wider text-muted bg-stone-50 dark:bg-stone-800 px-2 py-1 rounded-lg border border-stone-100 dark:border-stone-800">{fb.subject}</span>
                       {fb.replied && <span className="text-[9px] font-bold uppercase tracking-widest text-brand-600 bg-brand-50 dark:bg-brand-500/10 px-2 py-1 rounded-lg border border-brand-100 dark:border-brand-900/30">Replied</span>}
                     </div>
                     <span className="text-[10px] font-medium text-muted uppercase tracking-widest tabular-nums shrink-0">{fb.gradedAt}</span>
                  </div>

                  <h3 className="text-xl font-bold text-heading leading-tight font-display tracking-tight mb-4 group-hover:text-brand-600 transition-colors line-clamp-2 uppercase">{fb.title}</h3>
                  
                  <div className="mt-auto space-y-6">
                    <div className="flex gap-4 items-center">
                       <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-inner shrink-0 border border-black/5 dark:border-white/5" style={{ backgroundColor: fb.rbg }}>{fb.icon}</div>
                       <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] font-bold uppercase tracking-widest" style={{ color: fb.rc }}>{fb.label} Performance</span>
                          <p className="text-xs font-medium text-muted font-sans leading-relaxed line-clamp-1">"{fb.comment}"</p>
                       </div>
                    </div>
                    
                    <div className="pt-6 border-t border-stone-50 dark:border-stone-800 flex justify-end">
                       <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-muted group-hover:text-brand-500 transition-colors">
                          Details 
                          <ChevronRight size={14} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
