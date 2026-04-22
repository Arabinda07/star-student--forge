import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SUBJECTS } from "../../constants";
import { Btn, SectionLabel, Chip } from "../shared/UI";
import { ChevronRight, Plus, Users, Clock, Search, Filter } from "lucide-react";

export default function TeacherClasses() {
  const batches = [
    { id: '1', name: "Class 10 Intensive", students: 24, timing: "4:00 PM - 6:00 PM", next: "Today", subject: "Maths" },
    { id: '2', name: "Class 9 Foundational", students: 18, timing: "10:00 AM - 12:00 PM", next: "Tomorrow", subject: "Physics" },
    { id: '3', name: "Science Explorer Jr", students: 12, timing: "3:00 PM - 4:30 PM", next: "Mon", subject: "Chemistry" }
  ];

  return (
    <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950 scrollbar-hide overflow-y-auto premium-texture">
      {/* Premium Header */}
      <div className="px-6 py-8 pb-6 shrink-0 animate-slide-up sticky top-0 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md z-20 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-[72px] rounded-[24px] bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800/60 flex items-center justify-center text-4xl shadow-sm -rotate-3 transition-transform hover:rotate-2 hover:scale-105 duration-500 hidden md:flex">
              👥
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-stone-50 tracking-tighter font-sans leading-none mb-2">Batches</h1>
              <p className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest leading-none drop-shadow-sm">Orchestrating {batches.length} active learning groups</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="New Batch" 
              className="w-14 h-14 rounded-full bg-amber-400 dark:bg-amber-500 text-amber-950 flex items-center justify-center cursor-pointer shadow-sm relative group overflow-hidden active:scale-95 transition-all"
            >
              <Plus size={24} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform relative z-10" />
            </motion.button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="max-w-7xl mx-auto w-full mt-8 flex gap-3 relative z-10">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-amber-500 transition-colors" size={18} strokeWidth={2.5} />
            <input 
              type="text" 
              placeholder="Search batches..." 
              className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800/60 rounded-2xl text-sm font-bold text-stone-900 dark:text-stone-50 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm"
            />
          </div>
          <button className="w-[52px] h-[52px] flex items-center justify-center rounded-2xl border border-stone-200/60 dark:border-stone-800/60 bg-white dark:bg-stone-900 text-stone-500 hover:text-amber-500 transition-colors shadow-sm active:scale-95">
            <Filter size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 px-6 pb-24 max-w-7xl mx-auto w-full mt-10">
        <AnimatePresence mode="popLayout">
          {batches.length === 0 ? (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="flex-1 flex flex-col items-center justify-center text-center py-24 px-6 bg-white dark:bg-stone-900 rounded-[48px] border border-stone-200/60 dark:border-stone-800/60 shadow-sm relative overflow-hidden"
             >
                <div className="absolute inset-0 bg-stone-50/50 dark:bg-stone-950/20 opacity-50 pointer-events-none" />
                <div className="w-24 h-24 bg-stone-50 dark:bg-stone-800 rounded-[32px] flex items-center justify-center mb-8 border border-stone-100 dark:border-stone-700/50 text-stone-400 relative z-10 shadow-inner">
                   <Users size={40} strokeWidth={2.5} />
                </div>
                <h3 className="text-3xl lg:text-4xl font-black text-stone-900 dark:text-stone-50 font-sans tracking-tight mb-4 relative z-10">Create your first batch</h3>
                <p className="text-base text-stone-500 dark:text-stone-400 max-w-md mx-auto font-bold leading-relaxed relative z-10">Group your students into batches to track their progress, assign homework and manage schedules more effectively.</p>
                <div className="relative z-10 mt-8">
                  <Btn label="Add New Batch" icon={<Plus size={18} />} />
                </div>
             </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {batches.map((batch, i) => {
                const sc = SUBJECTS[batch.subject] || SUBJECTS.Maths;
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={batch.id}
                    className="bg-white dark:bg-stone-900 rounded-[32px] p-8 md:p-10 border border-stone-200/60 dark:border-stone-800/60 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-amber-200 dark:hover:border-amber-900/40 transition-all cursor-pointer group relative flex flex-col h-full overflow-hidden"
                  >
                     <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center text-3xl shadow-inner border border-white/20 dark:border-black/20 ${sc.bg}`}>
                          {sc.icon}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-900/50">Active</span>
                     </div>
  
                     <div className="relative z-10">
                       <h3 className="text-3xl font-black text-stone-900 dark:text-stone-50 font-sans mb-3 group-hover:text-amber-600 transition-colors tracking-tight leading-none">{batch.name}</h3>
                       <p className="text-[10px] font-black uppercase tracking-widest mb-10 w-max px-2 py-1 rounded-md" style={{ color: sc.fg, backgroundColor: `${sc.fg}15` }}>{batch.subject}</p>
                     </div>
  
                     <div className="mt-auto space-y-4 relative z-10">
                        <div className="flex items-center justify-between text-sm py-4 border-t border-stone-100 dark:border-stone-800/50">
                           <span className="text-stone-400 dark:text-stone-500 font-black uppercase tracking-[0.2em] text-[10px]">Student Roster</span>
                           <span className="text-stone-900 dark:text-stone-50 font-sans font-black">{batch.students} Capacity</span>
                        </div>
                        <div className="flex items-center justify-between text-sm py-4 border-t border-stone-100 dark:border-stone-800/50">
                           <span className="text-stone-400 dark:text-stone-500 font-black uppercase tracking-[0.2em] text-[10px]">Time Slot</span>
                           <span className="text-stone-900 dark:text-stone-50 font-sans font-black truncate pl-4">{batch.timing}</span>
                        </div>
                     </div>
  
                     <div className="mt-8 pt-6 border-t border-stone-200/60 dark:border-stone-800/60 flex items-center justify-between relative z-10">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-1">Next Session</span>
                          <span className="text-xl font-black text-stone-800 dark:text-stone-200 tracking-tight font-sans">{batch.next}</span>
                        </div>
                        <motion.div 
                          className="w-12 h-12 rounded-[14px] bg-stone-50 dark:bg-stone-800 flex items-center justify-center text-stone-400 group-hover:bg-amber-400 dark:group-hover:bg-amber-500 group-hover:text-amber-950 transition-all shadow-sm border border-stone-100 dark:border-stone-700 group-hover:border-transparent group-hover:translate-x-1"
                        >
                          <ChevronRight size={20} strokeWidth={2.5} />
                        </motion.div>
                     </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
