import { SubjectInfo } from "./types";

// We have unified the color palette to rely primarily on Tailwind's native utility classes 
// for improved semantic consistency and simpler maintenance.
export const ROLE_COLORS = {
  student: "bg-emerald-600 text-white",
  studentLight: "bg-emerald-50 text-emerald-700",
  teacher: "bg-amber-500 text-stone-900 dark:text-stone-50",
  teacherLight: "bg-amber-50 text-amber-700", 
  parent: "bg-sky-500 text-white",
  parentLight: "bg-sky-50 text-sky-700"
};

export const SUBJECTS: Record<string, SubjectInfo> = {
  Maths: { icon: "📐", fg: "text-blue-600", bg: "bg-blue-50", bar: "border-blue-500" },
  Physics: { icon: "⚡", fg: "text-amber-600", bg: "bg-amber-50", bar: "border-amber-500" },
  Science: { icon: "🔬", fg: "text-emerald-600", bg: "bg-emerald-50", bar: "border-emerald-500" },
  Biology: { icon: "🧬", fg: "text-purple-600", bg: "bg-purple-50", bar: "border-purple-500" },
};

// Legacy COLORS object kept minimally for any missed usages, mapped to standard hexes
export const COLORS = {
  canvas: "#f5f5f4", // stone-50
  surface: "#ffffff",
  borderOat: "#e7e5e4", // stone-200
  borderLight: "#f5f5f4", // stone-100
  ink: "#1c1917", // stone-900
  inkMid: "#57534e", // stone-600
  inkMute: "#78716c", // stone-500
  inkFaint: "#a8a29e", // stone-400
  s500: "#10b981", // emerald-500
  s800: "#065f46", // emerald-800
  sBg: "#ecfdf5", // emerald-50
  t500: "#f59e0b", // amber-500
  t700: "#b45309", // amber-700
  t800: "#78350f", // amber-900
  tBg: "#fffbeb", // amber-50
  p500: "#0ea5e9", // sky-500
  p800: "#0369a1", // sky-700
  pBg: "#f0f9ff", // sky-50
  danger: "#f43f5e", // rose-500
  dangerBg: "#fff1f2", // rose-50
  dangerDark: "#be123c", // rose-700
  warn: "#f59e0b", // amber-500
  warnBg: "#fffbeb", // amber-50
  warnDark: "#b45309", // amber-700
  ok: "#10b981", // emerald-500
  okBg: "#ecfdf5", // emerald-50
  okDark: "#047857", // emerald-700
  purple: "#8b5cf6", // violet-500
  purpleBg: "#f5f3ff", // violet-50
  purpleDark: "#6d28d9", // violet-700
  clay: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  mid: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  hard: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  pill: "9999px",
  card: "1rem",
  feat: "1.5rem",
  sect: "2rem",
};
