import { useState, ReactNode, useEffect } from "react";
import { Role } from "./types";
import { 
  Home as HomeIcon, 
  Users, 
  Calendar as CalendarIcon, 
  Library, 
  FileText, 
  Coins, 
  MessageSquare, 
  School,
  User,
  Sun,
  Moon
} from "lucide-react";

import StudentHome from "./components/student/StudentHome";
import StudentMyWork from "./components/student/StudentMyWork";
import StudentNotes from "./components/student/StudentNotes";

import TeacherHome from "./components/teacher/TeacherHome";
import TeacherClasses from "./components/teacher/TeacherClasses";
import TeacherStudents from "./components/teacher/TeacherStudents";
import TeacherCalendar from "./components/teacher/TeacherCalendar";
import TeacherLibrary from "./components/teacher/TeacherLibrary";

import ParentHome from "./components/parent/ParentHome";
import ParentFees from "./components/parent/ParentFees";
import ParentFeedback from "./components/parent/ParentFeedback";

import ProfileSettings from "./components/shared/ProfileSettings";

// Placeholders for screens not yet implemented
const PlaceholderScreen = ({ icon, title }: { icon: string, title: string }) => (
  <div className="h-full flex flex-col items-center justify-center gap-4 p-8 text-center animate-slide-up">
    <div className="text-[48px] opacity-80">{icon}</div>
    <div>
      <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50 font-sans mb-2">{title}</h2>
      <p className="text-sm text-stone-500 dark:text-stone-400 font-sans leading-relaxed max-w-[240px]">This feature is part of the next sprint. We're currently building the foundation.</p>
    </div>
  </div>
);

function BottomNav({ role, active, onNav }: { role: Role; active: number; onNav: (i: number) => void }) {
  interface Tab {
    icon: ReactNode;
    label: string;
    badge?: number;
  }
  
  const studentTabs: Tab[] = [
    { icon: <HomeIcon size={20} />, label: "Home" },
    { icon: <FileText size={20} />, label: "My Work", badge: 2 },
    { icon: <School size={20} />, label: "Notes" },
    { icon: <CalendarIcon size={20} />, label: "Calendar" },
    { icon: <User size={20} />, label: "Me" }
  ];
  const teacherTabs: Tab[] = [
    { icon: <HomeIcon size={20} />, label: "Home" },
    { icon: <School size={20} />, label: "Classes" },
    { icon: <Users size={20} />, label: "Students" },
    { icon: <CalendarIcon size={20} />, label: "Calendar" },
    { icon: <Library size={20} />, label: "Library" }
  ];
  const parentTabs: Tab[] = [
    { icon: <HomeIcon size={20} />, label: "Home" },
    { icon: <CalendarIcon size={20} />, label: "Schedule" },
    { icon: <Coins size={20} />, label: "Fees" },
    { icon: <MessageSquare size={20} />, label: "Feedback" }
  ];

  const tabs = role === "teacher" ? teacherTabs : role === "parent" ? parentTabs : studentTabs;
  
  const getActiveColor = () => {
    if (role === 'student') return "text-emerald-600";
    if (role === 'teacher') return "text-amber-600";
    return "text-sky-600";
  };

  return (
    <div className="bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800/50 flex pb-safe pt-2 px-2 shadow-[0_-4px_24px_rgba(0,0,0,0.02)] shrink-0 z-20 relative">
      {tabs.map((tab, i) => {
        const isActive = active === i;
        return (
          <button
            key={i}
            role="tab"
            aria-selected={isActive}
            aria-label={tab.label}
            onClick={() => onNav(i)}
            className="flex-1 border-none bg-transparent cursor-pointer flex flex-col items-center justify-center gap-1 p-2 relative group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 rounded-xl"
          >
            <div className={`transition-all duration-200 ${isActive ? getActiveColor() : "text-stone-500 dark:text-stone-400"} ${isActive ? "-translate-y-1" : ""}`}>
              {tab.icon}
            </div>
            {tab.badge !== undefined && !isActive && (
              <div className="absolute top-1 left-1/2 ml-1 bg-rose-500 text-white rounded-full min-w-[16px] h-4 px-1 text-[11px] font-bold flex items-center justify-center border-2 border-white">
                {tab.badge}
              </div>
            )}
            <div
              className={`text-[11px] font-sans transition-all duration-200 ${isActive ? "font-semibold opacity-100" : "font-medium opacity-0 translate-y-1"} ${getActiveColor()}`}
              style={{ position: isActive ? 'relative' : 'absolute', bottom: isActive ? 'auto' : '2px' }}
            >
              {tab.label}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export default function App() {
  const [role, setRole] = useState<Role>("student");
  const [tab, setTab] = useState(0);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Setup initial from local storage or matchMedia
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDark = () => {
    setIsDark(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return next;
    });
  };

  const switchRole = (r: Role) => {
    if (r !== role) {
      setRole(r);
      setTab(0);
    }
  };

  return (
    <div className="h-screen bg-stone-100 dark:bg-stone-800 font-sans flex flex-col overflow-hidden text-stone-900 dark:text-stone-50">
      {/* App Header & Role Switcher */}
      <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shrink-0 z-20 relative">
        <div className="max-w-md sm:max-w-lg md:max-w-xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="text-xl font-bold text-stone-900 dark:text-stone-50 tracking-tight">Drona</div>
            <div className="text-[11px] bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 px-2 py-0.5 rounded-md font-mono font-medium uppercase tracking-widest hidden sm:block">Platform</div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={toggleDark} 
              aria-label="Toggle dark mode"
              className="p-1.5 rounded-full text-stone-500 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="flex gap-1 bg-stone-50 dark:bg-stone-950 p-1 rounded-xl border border-stone-100 dark:border-stone-800/50">
              {[
                { r: "student", label: "Student" },
              { r: "teacher", label: "Teacher" },
              { r: "parent", label: "Parent" },
            ].map(({ r, label }) => {
              const isActive = role === r;
              return (
                <button
                  key={r}
                  aria-pressed={isActive}
                  onClick={() => switchRole(r as Role)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400 ${
                    isActive 
                      ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 shadow-sm border border-stone-200/50" 
                      : "bg-transparent text-stone-500 dark:text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 dark:hover:text-stone-200 dark:hover:bg-stone-800/50"
                  }`}
                >
                  {label}
                </button>
              );
            })}
            </div>
          </div>
        </div>
      </header>

      {/* Main Web App Container */}
      <div className="flex-1 w-full mx-auto max-w-md sm:max-w-lg md:max-w-xl bg-stone-50 dark:bg-stone-950 flex flex-col relative overflow-hidden sm:border-x border-stone-200 dark:border-stone-800 shadow-sm">
        {/* Dynamic Content Area */}
        <div className="flex-1 relative overflow-hidden bg-stone-50 dark:bg-stone-950 flex flex-col">
          {role === 'student' && tab === 0 && <StudentHome />}
          {role === 'student' && tab === 1 && <StudentMyWork />}
          {role === 'student' && tab === 2 && <StudentNotes />}
          {role === 'student' && tab === 3 && <PlaceholderScreen icon="📅" title="Student Calendar" />}
          {role === 'student' && tab === 4 && <ProfileSettings role={role} />}
          
          {role === 'teacher' && tab === 0 && <TeacherHome />}
          {role === 'teacher' && tab === 1 && <TeacherClasses />}
          {role === 'teacher' && tab === 2 && <TeacherStudents />}
          {role === 'teacher' && tab === 3 && <TeacherCalendar />}
          {role === 'teacher' && tab === 4 && <TeacherLibrary />}

          {role === 'parent' && tab === 0 && <ParentHome />}
          {role === 'parent' && tab === 1 && <PlaceholderScreen icon="📅" title="Rohan's Schedule" />}
          {role === 'parent' && tab === 2 && <ParentFees />}
          {role === 'parent' && tab === 3 && <ParentFeedback />}
        </div>

        <BottomNav role={role} active={tab} onNav={setTab} />
      </div>
    </div>

  );
}
