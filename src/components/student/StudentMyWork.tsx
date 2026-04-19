import { useState } from "react";
import { SUBJECTS } from "../../constants";
import { Chip } from "../shared/UI";
import { ChevronRight } from "lucide-react";

export default function StudentMyWork() {
  const [tab, setTab] = useState("upcoming");
  const tabConfig: Record<string, string> = {
    upcoming: "Upcoming",
    overdue: "Overdue",
    submitted: "Submitted",
    graded: "Graded"
  };

  const ITEMS: Record<string, any[]> = {
    overdue: [
      { id: 1, subject: "Maths", title: "Algebra — Practice Set A", due: "3 days ago", type: "Homework" },
      { id: 2, subject: "Physics", title: "Velocity & Speed Problems", due: "Yesterday", type: "Homework" }
    ],
    upcoming: [
      { id: 4, subject: "Physics", title: "Newton's Laws — Q 1–6", due: "Tomorrow, 6 PM", type: "Homework" },
      { id: 5, subject: "Maths", title: "Quadratic Equations — Set B", due: "In 3 days", type: "Homework" },
      { id: 6, subject: "Science", title: "Cell Division — Diagram", due: "In 5 days", type: "Assignment" }
    ],
    submitted: [
      { id: 7, subject: "Physics", title: "Chapter 3 MCQs", due: "2 days ago", type: "Homework" },
      { id: 8, subject: "Maths", title: "Number Systems — Test", due: "Yesterday", type: "Class Test" }
    ],
    graded: [
      { id: 9, subject: "Physics", title: "Motion Diagrams", due: "3 days ago", type: "Assignment", fb: "Great" },
      { id: 10, subject: "Science", title: "Food Chain Poster", due: "5 days ago", type: "Assignment", fb: "Good" }
    ],
  };

  const items = ITEMS[tab] || [];
  const isDone = tab === "submitted" || tab === "graded";

  return (
    <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950">
      <div className="px-6 py-6 pb-0 shrink-0 animate-slide-up">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans mb-6">My Work</h1>
        
        <div className="flex overflow-x-auto scrollbar-hide border-b border-stone-200 dark:border-stone-800">
          {Object.entries(tabConfig).map(([key, label]) => {
            const isActive = tab === key;
            const count = (ITEMS[key] || []).length;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-none px-4 pb-3 border-b-2 font-sans text-sm transition-colors duration-200 flex items-center gap-2 whitespace-nowrap ${
                  isActive 
                    ? "border-emerald-600 text-emerald-700 font-semibold" 
                    : "border-transparent text-stone-500 dark:text-stone-400 font-medium hover:text-stone-700"
                }`}
              >
                {label}
                <span 
                  className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${
                    isActive ? "bg-emerald-100 text-emerald-700" : "bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
        <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
          {items.map((item, i) => {
            const sc = SUBJECTS[item.subject] || SUBJECTS.Physics;
            return (
              <div
                key={item.id}
                className="flex items-start gap-4 p-5 border-b border-stone-100 dark:border-stone-800/50 last:border-0 transition-colors hover:bg-stone-50 cursor-pointer animate-slide-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div 
                  className={`w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-xl ${
                    isDone ? "bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 grayscale" : sc.bg
                  }`}
                >
                  {isDone ? "✓" : sc.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span 
                      className="text-[10px] font-bold tracking-wider uppercase font-sans"
                      style={{ color: isDone ? '#a8a29e' : sc.fg }}
                    >
                      {item.subject}
                    </span>
                    <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 rounded-md px-1.5 py-0.5 font-sans">
                      {item.type}
                    </span>
                  </div>
                  <div 
                    className={`text-[15px] font-semibold leading-snug font-sans mb-1 ${
                      isDone ? "text-stone-500 dark:text-stone-400 line-through" : "text-stone-900 dark:text-stone-50"
                    }`}
                  >
                    {item.title}
                  </div>
                  <div 
                    className={`text-xs font-medium font-sans ${
                      tab === "overdue" ? "text-rose-600" : "text-stone-500 dark:text-stone-400"
                    }`}
                  >
                    {tab === "overdue" && "⚠ "}{item.due}
                  </div>
                </div>
                {tab === "graded" && item.fb && (
                  <div className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md mt-1">
                    {item.fb}
                  </div>
                )}
                {!isDone && <ChevronRight size={20} className="text-stone-300 mt-1 shrink-0" />}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
