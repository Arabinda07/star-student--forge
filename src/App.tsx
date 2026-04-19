import { useState, ReactNode, useEffect, useLayoutEffect } from "react";
import { motion } from "motion/react";
import { Role } from "./types";
import { flushSync } from "react-dom";
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
import StudentCalendar from "./components/student/StudentCalendar";

import TeacherHome from "./components/teacher/TeacherHome";
import TeacherClasses from "./components/teacher/TeacherClasses";
import TeacherStudents from "./components/teacher/TeacherStudents";
import TeacherCalendar from "./components/teacher/TeacherCalendar";
import TeacherLibrary from "./components/teacher/TeacherLibrary";

import ParentHome from "./components/parent/ParentHome";
import ParentFees from "./components/parent/ParentFees";
import ParentFeedback from "./components/parent/ParentFeedback";
import ParentSchedule from "./components/parent/ParentSchedule";

import ProfileSettings from "./components/shared/ProfileSettings";
import Onboarding from "./components/shared/Onboarding";

import { supabase } from "./supabaseClient";
import SignIn from "./components/shared/SignIn";
import SignUp from "./components/shared/SignUp";

import Walkthrough from "./components/shared/Walkthrough";

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

interface Tab {
  icon: ReactNode;
  label: string;
  badge?: number;
}

const getTabs = (role: Role): Tab[] => {
  if (role === "teacher") {
    return [
      { icon: <HomeIcon size={20} />, label: "Home" },
      { icon: <School size={20} />, label: "Classes" },
      { icon: <Users size={20} />, label: "Students" },
      { icon: <CalendarIcon size={20} />, label: "Calendar" },
      { icon: <Library size={20} />, label: "Library" },
      { icon: <User size={20} />, label: "Me" }
    ];
  }
  if (role === "parent") {
    return [
      { icon: <HomeIcon size={20} />, label: "Home" },
      { icon: <CalendarIcon size={20} />, label: "Schedule" },
      { icon: <Coins size={20} />, label: "Fees" },
      { icon: <MessageSquare size={20} />, label: "Feedback" },
      { icon: <User size={20} />, label: "Me" }
    ];
  }
  return [
    { icon: <HomeIcon size={20} />, label: "Home" },
    { icon: <FileText size={20} />, label: "My Work", badge: 2 },
    { icon: <School size={20} />, label: "Notes" },
    { icon: <CalendarIcon size={20} />, label: "Calendar" },
    { icon: <User size={20} />, label: "Me" }
  ];
};

const getRoleColorClass = (role: Role) => {
  if (role === 'student') return "text-emerald-600 dark:text-emerald-500";
  if (role === 'teacher') return "text-amber-600 dark:text-amber-500";
  return "text-sky-600 dark:text-sky-500";
};

const getRoleBgClass = (role: Role) => {
  if (role === 'student') return "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
  if (role === 'teacher') return "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300";
  return "bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300";
};

function BottomNav({ role, active, onNav }: { role: Role; active: number; onNav: (i: number) => void }) {
  const tabs = getTabs(role);
  
  return (
    <div className="md:hidden bg-white dark:bg-stone-900 border-t border-stone-100 dark:border-stone-800/50 flex pb-safe pt-2 px-2 shadow-[0_-4px_24px_rgba(0,0,0,0.02)] shrink-0 z-20 relative">
      {tabs.map((tab, i) => {
        const isActive = active === i;
        return (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            role="tab"
            aria-selected={isActive}
            aria-label={tab.label}
            onClick={() => onNav(i)}
            className="flex-1 border-none bg-transparent cursor-pointer flex flex-col items-center justify-center gap-1 p-2 relative group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 rounded-xl"
          >
            <div className={`transition-all duration-200 ${isActive ? getRoleColorClass(role) : "text-stone-500 dark:text-stone-400"} ${isActive ? "-translate-y-1" : ""}`}>
              {tab.icon}
            </div>
            {tab.badge !== undefined && !isActive && (
              <div className="absolute top-1 left-1/2 ml-1 bg-rose-500 text-white rounded-full min-w-[16px] h-4 px-1 text-[11px] font-bold flex items-center justify-center border-2 border-white dark:border-stone-900">
                {tab.badge}
              </div>
            )}
            <div
              className={`text-[11px] font-sans transition-all duration-200 ${isActive ? "font-semibold opacity-100" : "font-medium opacity-0 translate-y-1"} ${getRoleColorClass(role)}`}
              style={{ position: isActive ? 'relative' : 'absolute', bottom: isActive ? 'auto' : '2px' }}
            >
              {tab.label}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}

function DesktopNav({ role, active, onNav }: { role: Role; active: number; onNav: (i: number) => void }) {
  const tabs = getTabs(role);
  
  return (
    <nav className="p-4 flex flex-col gap-2">
      {tabs.map((tab, i) => {
        const isActive = active === i;
        return (
          <motion.button
            key={i}
            whileHover={{ x: 4, backgroundColor: "rgba(0,0,0,0.02)" }}
            whileTap={{ scale: 0.98 }}
            role="tab"
            aria-selected={isActive}
            aria-label={tab.label}
            onClick={() => onNav(i)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500 cursor-pointer ${
              isActive 
                ? getRoleBgClass(role) + " font-bold shadow-sm ring-1 ring-inset ring-black/5 dark:ring-white/5" 
                : "text-stone-600 dark:text-stone-400 font-medium hover:bg-stone-50 dark:hover:bg-stone-800/50"
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={isActive ? getRoleColorClass(role) : "text-stone-500 dark:text-stone-400"}>
                {tab.icon}
              </div>
              <span className="text-sm tracking-wide">{tab.label}</span>
            </div>
            {tab.badge !== undefined && (
              <div className={`text-white rounded-full min-w-[20px] h-5 px-1.5 text-xs font-bold flex items-center justify-center shadow-sm ${isActive ? "bg-rose-500" : "bg-stone-300 dark:bg-stone-600 text-stone-700 dark:text-stone-200"}`}>
                {tab.badge}
              </div>
            )}
          </motion.button>
        );
      })}
    </nav>
  );
}

export default function App() {
  const [role, setRole] = useState<Role>("student");
  const [tab, setTab] = useState(0);
  const [isDark, setIsDark] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('drona_onboarding_done');
  });
  const [session, setSession] = useState<any>(null);
  const [authMode, setAuthMode] = useState<"signIn" | "signUp">("signIn");
  const [loadingSession, setLoadingSession] = useState(true);
  const [showWalkthrough, setShowWalkthrough] = useState(false);
  const [profileName, setProfileName] = useState("");

  useEffect(() => {
    // Sync theme
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }

    // Check supabase session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoadingSession(false);
      if (session) {
        fetchUserProfile(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchUserProfile(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    // If they just onboarded before having a session, we need to push that stored profile up
    const pendingProfileStr = sessionStorage.getItem('drona_pending_profile');

    if (pendingProfileStr) {
      const pendingProfile = JSON.parse(pendingProfileStr);
      await supabase.from('user_profiles').upsert({
         id: userId,
         role: pendingProfile.role,
         full_name: pendingProfile.name,
         meta: pendingProfile.meta
      });
      sessionStorage.removeItem('drona_pending_profile');
      localStorage.removeItem('drona_pending_role'); // Clean up old legacy keys if necessary
      setRole(pendingProfile.role as Role);
      setProfileName(pendingProfile.name);
      
      // Since they just created their account, trigger the post-signup walkthrough immediately
      if (!localStorage.getItem('drona_walkthrough_done')) {
         setShowWalkthrough(true);
      }
      return;
    }

    // Legacy fallback just in case
    const pendingRole = localStorage.getItem('drona_pending_role');
    if (pendingRole) {
      await supabase.from('user_profiles').upsert({
         id: userId,
         role: pendingRole
      });
      localStorage.removeItem('drona_pending_role');
      setRole(pendingRole as Role);
      return;
    }

    const { data } = await supabase
      .from('user_profiles')
      .select('role, full_name')
      .eq('id', userId)
      .single();
    
    if (data) {
      if (data.role) setRole(data.role as Role);
      if (data.full_name) setProfileName(data.full_name);
    }
  };

  const handleCompleteOnboarding = async (data: any) => {
    // Stage 1 completed: Store complex data in session storage securely
    sessionStorage.setItem('drona_pending_profile', JSON.stringify(data));
    localStorage.setItem('drona_onboarding_done', 'true');
    setRole(data.role);
    setShowOnboarding(false);

    if (session?.user?.id) {
       // Edge-case: In rare event they had an active session skipped somehow, persist via DB immediately
       await supabase.from('user_profiles').upsert({
         id: session.user.id,
         role: data.role,
         full_name: data.name,
       });
    } else {
       // Standard flow: Queue up the role metadata for the Signup component to find
       localStorage.setItem('drona_pending_role', data.role);
       setAuthMode("signUp");
    }
  };

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
      startTransition(() => {
        setRole(r);
        setTab(0);
      });
    }
  };

  const startTransition = (callback: () => void) => {
    if (!document.startViewTransition) {
      callback();
      return;
    }
    document.startViewTransition(() => {
      flushSync(() => {
        callback();
      });
    });
  };

  const handleTabChange = (t: number) => {
    startTransition(() => {
      setTab(t);
    });
  };

  if (loadingSession) {
    return (
      <div className="h-screen bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
        <div className="animate-pulse w-8 h-8 rounded-full bg-[var(--color-brand-500)]" />
      </div>
    );
  }

  if (!session) {
    if (showOnboarding) {
      return <Onboarding onComplete={handleCompleteOnboarding} />;
    }
    if (authMode === "signIn") {
      return (
        <SignIn 
          onSuccess={() => {}} 
          onBackToOnboarding={() => {
            localStorage.removeItem('drona_onboarding_done');
            setShowOnboarding(true);
          }}
          onNavigateToSignUp={() => setAuthMode("signUp")} 
        />
      );
    }
    return (
      <SignUp 
        onSuccess={() => {}} 
        onBackToOnboarding={() => {
          localStorage.removeItem('drona_onboarding_done');
          setShowOnboarding(true);
        }}
        onNavigateToSignIn={() => setAuthMode("signIn")} 
      />
    );
  }

  if (session) {
    return (
      <div className="h-screen bg-stone-100 dark:bg-stone-800 font-sans flex flex-col overflow-hidden text-stone-900 dark:text-stone-50 relative premium-texture">
        
        {showWalkthrough && (
          <Walkthrough 
            role={role} 
            name={profileName} 
            onComplete={() => {
              setShowWalkthrough(false);
              localStorage.setItem('drona_walkthrough_done', 'true');
            }} 
          />
        )}

      {/* App Header & Role Switcher */}
      <header className="bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shrink-0 z-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
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
          </div>
        </div>
      </header>

      {/* Main Web App Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex overflow-hidden bg-stone-50 dark:bg-stone-950/50 md:border-x border-stone-200 dark:border-stone-800 shadow-sm">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex flex-col w-64 border-r border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 z-10 shrink-0">
          <DesktopNav role={role} active={tab} onNav={handleTabChange} />
          <div className="mt-auto p-6 hidden md:block">
            <div className="text-[10px] text-stone-400 dark:text-stone-500 uppercase tracking-widest font-bold">Drona Platform</div>
            <div className="text-xs text-stone-500 dark:text-stone-400 mt-1">v2.1.1</div>
          </div>
        </div>
        
        {/* Dynamic Content Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-stone-50 dark:bg-stone-950">
          <div className="flex-1 relative overflow-y-auto w-full mx-auto flex flex-col bg-stone-50 dark:bg-stone-950">
            {role === 'student' && tab === 0 && <StudentHome />}
            {role === 'student' && tab === 1 && <StudentMyWork />}
            {role === 'student' && tab === 2 && <StudentNotes />}
            {role === 'student' && tab === 3 && <StudentCalendar />}
            {role === 'student' && tab === 4 && <ProfileSettings role={role} />}
            
            {role === 'teacher' && tab === 0 && <TeacherHome />}
            {role === 'teacher' && tab === 1 && <TeacherClasses />}
            {role === 'teacher' && tab === 2 && <TeacherStudents />}
            {role === 'teacher' && tab === 3 && <TeacherCalendar />}
            {role === 'teacher' && tab === 4 && <TeacherLibrary />}
            {role === 'teacher' && tab === 5 && <ProfileSettings role={role} />}

            {role === 'parent' && tab === 0 && <ParentHome />}
            {role === 'parent' && tab === 1 && <ParentSchedule />}
            {role === 'parent' && tab === 2 && <ParentFees />}
            {role === 'parent' && tab === 3 && <ParentFeedback />}
            {role === 'parent' && tab === 4 && <ProfileSettings role={role} />}
          </div>

          <BottomNav role={role} active={tab} onNav={handleTabChange} />
        </div>
      </div>
    </div>
  );
}
}
