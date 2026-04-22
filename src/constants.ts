import { SubjectInfo } from "./types";

// Role background + text classes — used for nav active state, badges
export const ROLE_COLORS = {
  student: "bg-emerald-600 text-white",
  studentLight: "bg-emerald-50 text-emerald-700",
  teacher: "bg-amber-500 text-stone-900 dark:text-stone-50",
  teacherLight: "bg-amber-50 text-amber-700",
  parent: "bg-sky-500 text-white",
  parentLight: "bg-sky-50 text-sky-700"
};

export const SUBJECTS: Record<string, SubjectInfo> = {
  Maths:   { icon: "📐", fg: "text-blue-600",    bg: "bg-blue-50",    bar: "border-blue-500" },
  Physics: { icon: "⚡", fg: "text-amber-600",   bg: "bg-amber-50",   bar: "border-amber-500" },
  Science: { icon: "🔬", fg: "text-emerald-600", bg: "bg-emerald-50", bar: "border-emerald-500" },
  Biology: { icon: "🧬", fg: "text-purple-600",  bg: "bg-purple-50",  bar: "border-purple-500" },
};
