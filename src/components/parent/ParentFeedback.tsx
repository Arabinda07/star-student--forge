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
      <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950 scrollbar-hide overflow-y-auto">
        <div className="px-6 py-8 pb-4 shrink-0 animate-slide-up sticky top-0 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md z-30 border-b border-stone-100 dark:border-stone-800">
          <div className="max-w-4xl mx-auto w-full">
            <button 
               onClick={() => { setOpenFb(null); setReplySent(false); setReplyText(""); }} 
               className="flex items-center gap-2 bg-transparent border-none cursor-pointer font-sans text-sm font-bold text-stone-500 dark:text-stone-400 hover:text-stone-900 transition-colors mb-6 group"
            >
              <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Feed
            </button>
            
            <div className="flex justify-between items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                   <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-950/30 px-3 py-1 rounded-lg border border-amber-100 dark:border-amber-900/40">{openFb.subject}</span>
                   <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-2 border-l border-stone-200 dark:border-stone-800 ml-1">{openFb.gradedAt}</span>
                </div>
                <h2 className="text-3xl font-black text-stone-900 dark:text-stone-50 leading-tight font-sans tracking-tight">{openFb.title}</h2>
              </div>
              <div className="flex flex-col items-center gap-1 shrink-0 p-4 bg-white dark:bg-stone-900 rounded-3xl border border-stone-100 dark:border-stone-800 shadow-sm" style={{ boxShadow: `0 10px 30px -10px ${openFb.rc}22` }}>
                 <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-inner mb-2" style={{ backgroundColor: openFb.rbg }}>{openFb.icon}</div>
                 <div className="text-[10px] font-black uppercase tracking-[0.2em] font-sans" style={{ color: openFb.rc }}>{openFb.label}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 space-y-12">
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="space-y-4"
           >
              <div className="flex items-center gap-2 text-stone-400 mb-2 font-sans text-xs font-bold uppercase tracking-widest">
                <Sparkles size={14} className="text-amber-500" />
                Instructor Analysis
              </div>
              <div className="bg-white dark:bg-stone-900 p-8 rounded-[40px] border border-stone-100 dark:border-stone-800 shadow-sm text-lg font-medium text-stone-800 dark:text-stone-200 leading-relaxed italic relative">
                 <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                   <MessageSquare size={120} />
                 </div>
                 "{openFb.comment}"
              </div>
           </motion.div>

           <AnimatePresence mode="wait">
             {openFb.replied && !replySent && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="p-6 bg-stone-100 dark:bg-stone-800/50 rounded-3xl border border-stone-200 dark:border-stone-700/50 flex gap-4 text-sm text-stone-600 dark:text-stone-400 font-medium"
               >
                 <MessageSquare size={20} className="text-stone-400 shrink-0 mt-0.5" />
                 <div className="leading-relaxed">
                   <span className="font-black text-stone-900 dark:text-stone-200 block mb-1">Your reply:</span>
                   <span className="italic">"Thank you, Sir. Rohan will work on this."</span>
                 </div>
               </motion.div>
             )}
             
             {replySent && (
               <motion.div 
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className="p-6 bg-emerald-50 dark:bg-emerald-950/30 rounded-3xl border border-emerald-100 dark:border-emerald-900/50 text-sm text-emerald-800 dark:text-emerald-400 font-bold flex items-center gap-3 shadow-sm"
               >
                 <CheckCircle2 size={24} className="text-emerald-500" /> 
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
                 <div className="flex items-center gap-2 text-stone-400 mb-2 font-sans text-xs font-bold uppercase tracking-widest">
                   <MessageSquare size={14} className="text-sky-500" />
                   Draft a response
                 </div>
                 <textarea 
                   value={replyText} 
                   onChange={(e) => setReplyText(e.target.value)} 
                   placeholder="Acknowledge the feedback or ask a clarifying question…" 
                   className={`w-full box-border min-h-[160px] p-8 rounded-[40px] border-2 text-base font-medium bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 outline-none transition-all duration-300 resize-none leading-relaxed shadow-sm ${replyText ? "border-sky-500 ring-4 ring-sky-500/5 shadow-xl" : "border-stone-100 dark:border-stone-800"}`}
                 />
                 <div className="flex justify-end">
                   <Btn 
                     label="Transmit Response" 
                     className={`px-8 py-4 rounded-3xl font-black shadow-lg transition-all ${replyText.trim() ? "shadow-sky-500/20" : "opacity-50 grayscale"}`}
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
    <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950 scrollbar-hide overflow-y-auto">
      {/* Premium Header */}
      <div className="px-6 py-8 pb-4 shrink-0 animate-slide-up sticky top-0 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md z-20">
        <div className="max-w-7xl mx-auto w-full">
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans mb-1">Feedback</h1>
          <p className="text-sm font-medium text-stone-500 dark:text-stone-400 mb-8">Direct communications from the classroom</p>
          
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-amber-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search through messages..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide shrink-0 max-md:pb-2">
              {subjects.map((s) => (
                <button 
                  key={s} 
                  onClick={() => setFilterSubj(s)} 
                  className={`flex-none px-6 py-3 rounded-2xl font-sans text-xs font-black uppercase tracking-widest transition-all duration-300 cursor-pointer border ${
                    filterSubj === s ? "border-stone-900 dark:border-stone-100 bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-lg shadow-stone-900/10" : "border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-500 dark:text-stone-400 hover:border-amber-500"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 pb-24">
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
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((fb, i) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={fb.id} 
                  onClick={() => setOpenFb(fb)} 
                  className="bg-white dark:bg-stone-900 rounded-[32px] p-8 border border-stone-200 dark:border-stone-800 shadow-sm cursor-pointer hover:shadow-2xl hover:border-amber-200 dark:hover:border-amber-900/40 transition-all group flex flex-col h-full relative overflow-hidden"
                >
                  <div className="absolute top-0 bottom-0 left-0 w-2 transition-all group-hover:w-3" style={{ backgroundColor: fb.rc }} />
                  
                  <div className="flex justify-between items-start gap-4 mb-6">
                     <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black uppercase tracking-widest text-stone-500 dark:text-stone-400 bg-stone-50 dark:bg-stone-800/50 px-3 py-1.5 rounded-xl border border-stone-100 dark:border-stone-800/50">{fb.subject}</span>
                       {fb.replied && <span className="text-[9px] font-black uppercase tracking-widest text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/30 px-3 py-1.5 rounded-xl border border-sky-100 dark:border-sky-900/40">Replied</span>}
                     </div>
                     <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{fb.gradedAt}</span>
                  </div>

                  <h3 className="text-xl font-bold text-stone-900 dark:text-stone-50 font-sans leading-tight mb-4 group-hover:text-amber-600 transition-colors tracking-tight line-clamp-2">{fb.title}</h3>
                  
                  <div className="mt-auto space-y-6">
                    <div className="flex gap-4 items-center">
                       <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner shrink-0" style={{ backgroundColor: fb.rbg }}>{fb.icon}</div>
                       <div className="flex flex-col">
                          <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: fb.rc }}>{fb.label} Performance</span>
                          <p className="text-xs font-semibold text-stone-500 dark:text-stone-400 font-sans leading-relaxed line-clamp-2 italic">"{fb.comment}"</p>
                       </div>
                    </div>
                    
                    <div className="pt-6 border-t border-stone-50 dark:border-stone-800/50 flex justify-end">
                       <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-stone-300 group-hover:text-amber-600 transition-colors">
                         View details 
                         <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
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
