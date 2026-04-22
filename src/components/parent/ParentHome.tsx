import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SUBJECTS } from "../../constants";
import { SectionLabel, Btn, Chip, Sheet } from "../shared/UI";
import { Bell, ChevronRight, MessageSquare, Calendar as CalendarIcon, Wallet, Star } from "lucide-react";

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
    <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950 scrollbar-hide overflow-y-auto premium-texture">
      {/* Premium Header */}
      <div className="px-6 py-8 pb-6 shrink-0 animate-slide-up sticky top-0 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md z-20 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-[72px] rounded-[24px] bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800/60 flex items-center justify-center text-4xl shadow-sm -rotate-3 transition-transform hover:rotate-2 hover:scale-105 duration-500">
              👨‍👩‍👦
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-stone-50 tracking-tighter font-sans leading-none mb-2">Family Desk</h1>
              <p className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest leading-none drop-shadow-sm">Everything is synced and secure</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Notifications" 
              className="w-14 h-14 rounded-full bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800/60 flex items-center justify-center cursor-pointer shadow-sm relative group overflow-hidden active:scale-95 transition-all"
            >
              <div className="absolute inset-0 bg-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <Bell size={24} strokeWidth={2.5} className="text-stone-400 dark:text-stone-500 group-hover:text-sky-500 transition-colors relative z-10" />
              <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-stone-900 shadow-sm" />
            </motion.button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-10 pb-24 space-y-16 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 lg:gap-16 items-start">
          
          {/* Main Content Feed */}
          <div className="flex flex-col gap-16">
            {/* Hero Card - No Upcoming Classes */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="shrink-0 rounded-[40px] p-12 bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800/60 shadow-sm relative overflow-hidden flex items-center justify-center min-h-[300px] group"
            >
              <div className="text-center relative z-10">
                 <div className="w-24 h-24 bg-stone-50 dark:bg-stone-800 rounded-[32px] flex items-center justify-center mx-auto mb-8 border border-stone-100 dark:border-stone-700/50 shadow-inner group-hover:scale-105 transition-transform duration-500 text-stone-400">
                    <CalendarIcon size={40} strokeWidth={2.5} />
                 </div>
                 <h3 className="text-3xl md:text-4xl font-black text-stone-900 dark:text-stone-50 font-sans tracking-tight mb-4">No upcoming classes</h3>
                 <p className="text-base text-stone-500 dark:text-stone-400 font-bold max-w-sm mx-auto leading-relaxed">Your child's schedule is completely clear for today. View the full calendar for future updates.</p>
               </div>
               {/* Decorative background shape */}
               <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/5 dark:bg-sky-400/5 rounded-full blur-3xl -mr-40 -mt-40 pointer-events-none" />
               <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/5 dark:bg-amber-400/5 rounded-full blur-3xl -ml-32 -mb-32 pointer-events-none" />
            </motion.div>

            <div className="animate-slide-up [animation-delay:0.1s] space-y-6">
              <SectionLabel>Weekly Overview</SectionLabel>
              <div className="bg-white dark:bg-stone-900 p-12 lg:p-16 border border-stone-200/60 dark:border-stone-800/60 rounded-[32px] text-center shadow-sm relative overflow-hidden group">
                 <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Star size={48} strokeWidth={2.5} className="text-emerald-500" />
                 </div>
                 <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-emerald-100 dark:border-emerald-900/40">
                    <span className="text-3xl filter drop-shadow-sm">✨</span>
                 </div>
                 <h3 className="text-2xl font-black text-stone-900 dark:text-stone-50 font-sans tracking-tight mb-3">Homework Complete</h3>
                 <p className="text-base text-stone-500 dark:text-stone-400 font-bold max-w-xs mx-auto leading-relaxed">No pending assignments requiring your review this week. Your child is ahead of schedule!</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <motion.div 
                 whileHover={{ y: -4 }}
                 className="bg-white dark:bg-stone-900 rounded-[32px] p-8 border border-amber-200/60 dark:border-amber-900/40 shadow-sm hover:shadow-lg flex flex-col gap-6 cursor-pointer relative overflow-hidden group transition-all"
               >
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-500 text-amber-500">
                  <Wallet size={80} strokeWidth={1} />
                </div>
                <div className="flex justify-between items-start relative z-10">
                  <div className="w-16 h-16 rounded-[20px] bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-3xl shrink-0 shadow-inner border border-amber-100 dark:border-amber-900/40">
                    <span className="drop-shadow-sm">💰</span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 px-3 py-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50">Due in 3 days</span>
                </div>
                <div className="relative z-10">
                  <div className="text-[10px] font-black tracking-widest uppercase text-stone-400 dark:text-stone-500 mb-2 font-sans">May 2025 Tuition</div>
                  <div className="text-3xl font-black text-stone-900 dark:text-stone-50 font-sans tracking-tight leading-none">₹2,500</div>
                </div>
                <button className="text-[11px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 flex items-center gap-1.5 group/btn mt-2 relative z-10 w-max">
                  Pay Now <ChevronRight size={14} strokeWidth={3} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </motion.div>

              <motion.div 
                 whileHover={{ y: -4 }}
                 className="bg-white dark:bg-stone-900 rounded-[32px] p-8 border border-stone-200/60 dark:border-stone-800/60 shadow-sm hover:shadow-lg flex flex-col gap-6 cursor-pointer group transition-all"
              >
                <div className="flex justify-between items-start">
                  <div className="w-16 h-16 rounded-[20px] bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl shrink-0 font-sans font-black shadow-inner border border-emerald-100 dark:border-emerald-900/40">
                    A+
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-900/50">Excellent</span>
                </div>
                <div>
                  <div className="text-[10px] font-black tracking-widest uppercase text-stone-400 dark:text-stone-500 mb-2">Latest Insight</div>
                  <h3 className="text-xl font-black text-stone-900 dark:text-stone-50 font-sans mb-3 leading-tight tracking-tight line-clamp-2">Great work on Physics Diagrams</h3>
                  <p className="text-sm font-bold text-stone-500 dark:text-stone-400 font-sans leading-relaxed line-clamp-2 border-l-2 border-emerald-200 dark:border-emerald-900/50 pl-3">"Excellent work, Rohan! Your diagrams are very clean and precise…"</p>
                </div>
                <button className="text-[11px] font-black uppercase tracking-widest text-stone-400 group-hover:text-emerald-500 transition-colors flex items-center gap-1.5 mt-2 w-max group/btn">
                  Read full report <ChevronRight size={14} strokeWidth={3} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            </div>
          </div>

          {/* Quick Actions / Desktop Sidebar */}
          <div className="flex flex-col gap-6 sticky top-40">
            <div className="space-y-6">
              <SectionLabel>Quick Connect</SectionLabel>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setContactSheet(true)}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 rounded-[32px] p-10 border-none cursor-pointer flex flex-col items-center text-center gap-6 shadow-md shadow-stone-900/10 dark:shadow-stone-100/10 transition-all group relative overflow-hidden"
              >
                <div className="w-20 h-20 rounded-[28px] bg-white/10 dark:bg-stone-900/5 flex items-center justify-center text-white dark:text-stone-900 shrink-0 mb-2 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  <MessageSquare size={36} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-2xl font-black font-sans tracking-tight mb-3">Message Sir</h3>
                  <p className="text-base font-bold opacity-70 font-sans leading-relaxed max-w-[200px] mx-auto">Reach out for quick updates or progress queries.</p>
                </div>
                <div className="mt-4 py-4 px-10 bg-white/20 dark:bg-stone-900/10 rounded-full text-[10px] font-black tracking-widest uppercase group-hover:bg-sky-500 group-hover:text-white transition-colors">Start Chat</div>
              </motion.button>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-[32px] border border-stone-200/60 dark:border-stone-800/60 p-8 shadow-sm">
                <SectionLabel>Quick Links</SectionLabel>
                <div className="space-y-3 mt-6">
                  {["Performance Reports", "Attendance History", "Fee Receipts", "Notice Board"].map((item, i) => (
                    <button key={i} className="w-full py-5 px-6 bg-stone-50 dark:bg-stone-950 rounded-[20px] flex items-center justify-between group hover:bg-stone-100 dark:hover:bg-stone-800 transition-all border border-stone-200/60 dark:border-stone-800/60 hover:border-stone-300 dark:hover:border-stone-700 shadow-sm">
                      <span className="text-sm font-bold text-stone-700 dark:text-stone-300 group-hover:text-stone-900 dark:group-hover:text-stone-50">{item}</span>
                      <div className="w-8 h-8 rounded-full bg-white dark:bg-stone-900 flex items-center justify-center border border-stone-200/60 dark:border-stone-800/60 group-hover:border-amber-200 dark:group-hover:border-amber-900/40 transition-colors shadow-sm">
                        <ChevronRight size={14} strokeWidth={2.5} className="text-stone-400 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </button>
                  ))}
                </div>
            </div>
          </div>
        </div>
      </div>

      <Sheet open={contactSheet} onClose={() => { setContactSheet(false); setMsgSent(false); setSelTemplate(null); setCustomMsg(""); }} title={msgSent ? undefined : "Message Sir"}>
        {msgSent ? (
          <div className="text-center py-12 flex flex-col items-center">
            <div className="text-sky-500 mb-6 flex justify-center animate-slide-up w-24 h-24 rounded-full bg-sky-50 dark:bg-sky-500/10 items-center border border-sky-100 dark:border-sky-900/40 shadow-inner">
               <MessageSquare size={40} className="fill-current" />
            </div>
            <div className="text-3xl font-black text-stone-900 dark:text-stone-50 font-sans tracking-tight mb-3">Message Sent!</div>
            <div className="text-base font-bold text-stone-500 dark:text-stone-400 font-sans leading-relaxed">Sir will reply in the app soon.</div>
          </div>
        ) : (
          <div className="space-y-10 p-2 max-w-2xl mx-auto w-full">
            <div>
              <div className="text-[10px] font-black tracking-widest uppercase text-stone-400 dark:text-stone-500 font-sans mb-4">Quick Templates</div>
              <div className="flex flex-col gap-3">
                {templates.map((t, i) => (
                  <button 
                    key={i} 
                    onClick={() => setSelTemplate(i === selTemplate ? null : i)} 
                    className={`text-left p-5 rounded-[20px] border text-sm font-bold transition-all duration-200 flex items-center gap-4 cursor-pointer shadow-sm ${
                      selTemplate === i ? "border-sky-400 bg-sky-50 dark:bg-sky-500/10 text-sky-900 dark:text-sky-100" : "border-stone-200/60 dark:border-stone-800/60 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-700 hover:-translate-y-0.5"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-colors shadow-inner ${selTemplate === i ? "border-sky-500 bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]" : "border-stone-300 dark:border-stone-600 bg-stone-50 dark:bg-stone-800"}`}>
                      {selTemplate === i && <span className="w-2 h-2 bg-white dark:bg-stone-900 rounded-full" />}
                    </div>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <div className="text-[10px] font-black tracking-widest uppercase text-stone-400 dark:text-stone-500 font-sans mb-4">Or type a message</div>
              <textarea 
                value={customMsg} 
                onChange={(e) => setCustomMsg(e.target.value)} 
                placeholder="Write your message here…" 
                className={`w-full box-border min-h-[140px] p-6 rounded-[24px] border text-sm font-bold bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 outline-none transition-all duration-200 resize-none leading-relaxed shadow-sm ${customMsg ? "border-sky-400 ring-2 ring-sky-500/20" : "border-stone-200/60 dark:border-stone-800/60 focus:border-sky-400 focus:ring-2 focus:ring-sky-500/20"}`}
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
