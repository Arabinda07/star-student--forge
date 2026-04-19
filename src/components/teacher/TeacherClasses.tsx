import { useState } from "react";
import { SUBJECTS } from "../../constants";
import { Btn, SectionLabel } from "../shared/UI";
import { ChevronRight, Plus, Users, Clock } from "lucide-react";

export default function TeacherClasses() {
  const batches = [
    { id: 1, name: "Class 8 Evening", subs: ["Maths", "Physics", "Science"], count: 24, next: "Today, 6:00 PM" },
    { id: 2, name: "Class 9 Weekend", subs: ["Physics"], count: 18, next: "Sat, 10:00 AM" },
    { id: 3, name: "Class 10 Intensive", subs: ["Maths", "Science"], count: 12, next: "Tomorrow, 5:00 PM" },
  ];

  return (
    <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950">
      <div className="px-6 py-6 pb-4 shrink-0 animate-slide-up">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans mb-1">Batches</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 font-sans">Manage your classes and schedule</p>
      </div>
      
      <div className="flex-1 px-6 pb-6 overflow-y-auto scrollbar-hide grid gap-4">
        {batches.map((b, i) => (
          <div 
            key={b.id} 
            className="bg-white dark:bg-stone-900 rounded-[20px] p-5 border border-stone-200 dark:border-stone-800 shadow-sm cursor-pointer hover:border-stone-300 hover:shadow-md transition-all animate-slide-up"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans mb-1.5">{b.name}</h3>
                <div className="flex gap-1.5">
                  {b.subs.map(s => {
                    const sc = SUBJECTS[s] || SUBJECTS.Physics;
                    return (
                      <span key={s} className="text-[10px] font-bold tracking-wider uppercase font-sans bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2 py-0.5 rounded-md">
                        {s}
                      </span>
                    );
                  })}
                </div>
              </div>
              <ChevronRight size={20} className="text-stone-300" />
            </div>
            
            <div className="flex items-center gap-6 mt-6 pt-4 border-t border-stone-100 dark:border-stone-800/50">
              <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                <Users size={16} />
                <span className="text-sm font-semibold font-sans">{b.count} <span className="font-medium text-stone-500 dark:text-stone-400">students</span></span>
              </div>
              <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
                <Clock size={16} />
                <span className="text-sm font-semibold font-sans">{b.next}</span>
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-4">
          <Btn 
            label="Create New Batch" 
            variant="outline"
            full 
            icon={<Plus size={18} />}
          />
        </div>
      </div>
    </div>
  );
}
