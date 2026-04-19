import { useState } from "react";
import { SUBJECTS } from "../../constants";
import { Btn, SectionLabel } from "../shared/UI";
import { ChevronRight, Plus, Users, Clock } from "lucide-react";

export default function TeacherClasses() {
  const batches: any[] = [];

  return (
    <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950">
      <div className="px-6 py-6 pb-4 shrink-0 animate-slide-up">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans mb-1">Batches</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 font-sans">Manage your classes and schedule</p>
      </div>
      
      <div className="flex-1 px-6 pb-6 overflow-y-auto scrollbar-hide flex flex-col">
        {batches.length === 0 && (
           <div className="flex-1 flex flex-col items-center justify-center text-center py-10 px-4 bg-white dark:bg-stone-900 rounded-[24px] border border-stone-200 dark:border-stone-800 shadow-sm animate-slide-up">
              <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mb-4 text-stone-400">
                 <Users size={28} />
              </div>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-50 font-sans mb-2">Create your first batch</h3>
              <p className="text-sm text-stone-500 max-w-[200px] mx-auto font-sans">Group your students into batches to track their progress and assignments.</p>
           </div>
        )}

        <div className="grid gap-4 mt-auto pt-6">
          <Btn 
            label="Create New Batch" 
            variant="primary"
            full 
            icon={<Plus size={18} />}
          />
        </div>
      </div>
    </div>
  );
}
