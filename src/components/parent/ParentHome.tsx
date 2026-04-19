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
    <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950 scrollbar-hide overflow-y-auto">
      {/* Premium Header */}
      <div className="px-6 py-8 pb-4 shrink-0 animate-slide-up sticky top-0 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md z-20">
        <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-3xl bg-sky-100 dark:bg-sky-500/10 flex items-center justify-center text-3xl shadow-sm border border-sky-200/50 dark:border-sky-500/20">
              👨‍👩‍👦
            </div>
            <div>
              <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans">Family Desk</h1>
              <p className="text-sm font-medium text-stone-500 dark:text-stone-400">Everything is synced and secure</p>
            </div>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Notifications" 
            className="w-12 h-12 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 flex items-center justify-center cursor-pointer shadow-sm relative group"
          >
            <Bell size={20} className="text-stone-600 dark:text-stone-300 group-hover:text-sky-500 transition-colors" />
            <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white dark:border-stone-900" />
          </motion.button>
        </div>
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-10 items-start">
          
          {/* Main Content Feed */}
          <div className="flex flex-col gap-10">
            {/* Hero Card - No Upcoming Classes */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="shrink-0 rounded-[40px] p-10 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm relative overflow-hidden flex items-center justify-center min-h-[260px] group"
            >
              <div className="text-center relative z-10">
                 <div className="w-20 h-20 bg-stone-100 dark:bg-stone-800 rounded-[32px] flex items-center justify-center mx-auto mb-6 border border-stone-200/50 dark:border-stone-700 shadow-inner group-hover:scale-110 transition-transform duration-500 text-stone-400">
                    <CalendarIcon size={32} />
                 </div>
                 <h3 className="text-xl font-bold text-stone-900 dark:text-stone-50 font-sans">No upcoming classes</h3>
                 <p className="text-sm text-stone-500 dark:text-stone-400 font-sans mt-3 max-w-[280px] mx-auto leading-relaxed">Your child's schedule is completely clear for today. View the full calendar for future updates.</p>
               </div>
               {/* Decorative background shape */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
               <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl -ml-24 -mb-24 pointer-events-none" />
            </motion.div>

            <div className="animate-slide-up [animation-delay:0.1s]">
              <SectionLabel>Weekly Overview</SectionLabel>
              <div className="bg-white dark:bg-stone-900 p-12 border border-stone-200 dark:border-stone-800 rounded-[40px] text-center shadow-sm relative overflow-hidden">
                 <div className="absolute top-6 right-6 opacity-10">
                    <Star size={48} className="text-emerald-500" />
                 </div>
                 <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl">✨</span>
                 </div>
                 <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50 font-sans mb-1">Homework Complete</h3>
                 <p className="text-sm text-stone-500 dark:text-stone-400 font-sans max-w-[260px] mx-auto">No pending assignments requiring your review this week. Your child is ahead of schedule!</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <motion.div 
                 whileHover={{ y: -5, shadow: "0 25px 50px -12px rgb(0 0 0 / 0.1)" }}
                 className="bg-white dark:bg-stone-900 rounded-[32px] p-8 border border-amber-200 dark:border-amber-900/40 shadow-sm flex flex-col gap-6 cursor-pointer relative overflow-hidden group"
               >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-125 transition-transform text-amber-500">
                  <Wallet size={80} />
                </div>
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center text-3xl shrink-0">
                    💰
                  </div>
                  <Chip label="Due in 3 days" variant="due" small />
                </div>
                <div>
                  <div className="text-[10px] font-bold tracking-widest uppercase text-amber-600 mb-1 font-sans">May 2025 Tuition</div>
                  <div className="text-2xl font-bold text-stone-900 dark:text-stone-50 font-mono tracking-tight">₹2,500</div>
                </div>
                <button className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 group/btn">
                  Pay Now <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </motion.div>

              <motion.div 
                 whileHover={{ y: -5, shadow: "0 25px 50px -12px rgb(0 0 0 / 0.1)" }}
                 className="bg-white dark:bg-stone-900 rounded-[32px] p-8 border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col gap-6 cursor-pointer group"
              >
                <div className="flex justify-between items-start">
                  <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-2xl shrink-0 font-display font-black">
                    A+
                  </div>
                  <Chip label="Excellent" variant="positive" small />
                </div>
                <div>
                  <div className="text-[10px] font-bold tracking-widest uppercase text-emerald-600 mb-1">Latest Insight</div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50 font-sans mb-1 leading-tight line-clamp-1">Great work on Physics Diagrams</h3>
                  <p className="text-xs font-medium text-stone-500 dark:text-stone-400 font-sans italic line-clamp-2 leading-relaxed">"Excellent work, Rohan! Your diagrams are very clean and precise…"</p>
                </div>
                <button className="text-xs font-bold text-stone-400 group-hover:text-emerald-500 transition-colors flex items-center gap-1">
                  Read full report <ChevronRight size={14} />
                </button>
              </motion.div>
            </div>
          </div>

          {/* Quick Actions / Desktop Sidebar */}
          <div className="flex flex-col gap-10 sticky top-32">
            <div>
              <SectionLabel>Quick Connect</SectionLabel>
              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: "#000" }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setContactSheet(true)}
                className="w-full bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 rounded-[40px] p-10 border-none cursor-pointer flex flex-col items-center text-center gap-6 shadow-2xl shadow-stone-900/20 hover:shadow-stone-900/40 transition-all group relative overflow-hidden"
              >
                <div className="w-20 h-20 rounded-[28px] bg-white/10 dark:bg-stone-900/5 flex items-center justify-center text-white dark:text-stone-900 shrink-0 mb-2 group-hover:scale-110 transition-transform duration-500">
                  <MessageSquare size={32} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-sans mb-2">Message Sir</h3>
                  <p className="text-sm font-medium opacity-70 font-sans leading-relaxed">Reach out for quick updates or progress queries.</p>
                </div>
                <div className="mt-4 py-3 px-8 bg-white/20 dark:bg-stone-900/10 rounded-full text-[10px] font-bold tracking-widest uppercase group-hover:bg-sky-500 group-hover:text-white transition-colors">Start Chat</div>
              </motion.button>
            </div>

            <div className="bg-white dark:bg-stone-900 rounded-[40px] border border-stone-200 dark:border-stone-800 p-8 shadow-sm">
                <SectionLabel>Quick Links</SectionLabel>
                <div className="space-y-3">
                  {["Performance Reports", "Attendance History", "Fee Receipts", "Notice Board"].map((item, i) => (
                    <button key={i} className="w-full py-5 px-6 bg-stone-50 dark:bg-stone-950 rounded-2xl flex items-center justify-between group hover:bg-stone-100 dark:hover:bg-stone-800 transition-all border border-transparent hover:border-stone-200/50">
                      <span className="text-sm font-bold text-stone-700 dark:text-stone-300 group-hover:text-stone-900">{item}</span>
                      <ChevronRight size={18} className="text-stone-300 group-hover:text-stone-500 group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
            </div>
          </div>
        </div>
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
