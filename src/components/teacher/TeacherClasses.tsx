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
    <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950 scrollbar-hide overflow-y-auto">
      {/* Premium Header */}
      <div className="px-6 py-8 pb-4 shrink-0 animate-slide-up sticky top-0 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md z-20">
        <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans">Batches</h1>
            <p className="text-sm font-medium text-stone-500 dark:text-stone-400 mt-1">Orchestrating {batches.length} active learning groups</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="New Batch"
            className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-600/20 group"
          >
            <Plus size={24} className="group-hover:rotate-90 transition-transform" />
          </motion.button>
        </div>

        {/* Search & Filter Bar */}
        <div className="max-w-7xl mx-auto w-full mt-8 flex gap-3">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-amber-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search batches..." 
              className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm"
            />
          </div>
          <button className="w-12 h-12 flex items-center justify-center rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-500 hover:text-amber-500 transition-colors shadow-sm">
            <Filter size={18} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 px-6 pb-24 max-w-7xl mx-auto w-full mt-8">
        <AnimatePresence mode="popLayout">
          {batches.length === 0 ? (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="flex-1 flex flex-col items-center justify-center text-center py-24 px-6 bg-white dark:bg-stone-900 rounded-[40px] border border-stone-200 dark:border-stone-800 shadow-sm"
             >
                <div className="w-24 h-24 bg-stone-50 dark:bg-stone-800/50 rounded-[32px] flex items-center justify-center mb-8 border border-stone-100 dark:border-stone-700/50 text-stone-400">
                   <Users size={40} />
                </div>
                <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-50 font-sans mb-3">Create your first batch</h3>
                <p className="text-base text-stone-500 dark:text-stone-400 max-w-[320px] mx-auto font-sans leading-relaxed">Group your students into batches to track their progress, assign homework and manage schedules more effectively.</p>
                <Btn label="Add New Batch" icon={<Plus size={18} />} className="mt-8 px-10" />
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
                    className="bg-white dark:bg-stone-900 rounded-[40px] p-10 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-2xl hover:border-amber-200 dark:hover:border-amber-900/40 transition-all cursor-pointer group relative flex flex-col h-full"
                  >
                     <div className="flex justify-between items-start mb-8">
                        <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center text-4xl shadow-sm border border-stone-100 dark:border-stone-800 ${sc.bg}`}>
                          {sc.icon}
                        </div>
                        <Chip label="Active" active small />
                     </div>
  
                     <h3 className="text-2xl font-bold text-stone-900 dark:text-stone-50 font-sans mb-1 group-hover:text-amber-600 transition-colors tracking-tight">{batch.name}</h3>
                     <p className="text-xs font-bold uppercase tracking-widest mb-10" style={{ color: sc.fg }}>{batch.subject}</p>
  
                     <div className="mt-auto space-y-6">
                        <div className="flex items-center justify-between text-sm py-4 border-b border-stone-100 dark:border-stone-800/50">
                           <span className="text-stone-400 font-bold uppercase tracking-widest text-[10px]">Student Roster</span>
                           <span className="text-stone-900 dark:text-stone-50 font-black">{batch.students} Capacity</span>
                        </div>
                        <div className="flex items-center justify-between text-sm py-4 border-b border-stone-100 dark:border-stone-800/50">
                           <span className="text-stone-400 font-bold uppercase tracking-widest text-[10px]">Time Slot</span>
                           <span className="text-stone-900 dark:text-stone-50 font-black truncate pl-4">{batch.timing}</span>
                        </div>
                     </div>
  
                     <div className="mt-10 pt-6 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Next Session</span>
                          <span className="text-base font-bold text-stone-800 dark:text-stone-200">{batch.next}</span>
                        </div>
                        <motion.div 
                          whileHover={{ x: 5 }}
                          className="w-12 h-12 rounded-2xl bg-stone-50 dark:bg-stone-800 flex items-center justify-center text-stone-400 group-hover:bg-amber-600 group-hover:text-white transition-all shadow-sm"
                        >
                          <ChevronRight size={22} />
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
