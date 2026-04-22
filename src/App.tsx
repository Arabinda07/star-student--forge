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
    <div className="md:hidden bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border-t border-stone-100 dark:border-stone-800/50 flex pb-[env(safe-area-inset-bottom)] pt-3 px-4 shadow-[0_-8px_30px_rgba(0,0,0,0.04)] shrink-0 z-20 relative">
      {tabs.map((tab, i) => {
        const isActive = active === i;
        return (
          <motion.button
            key={i}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            role="tab"
            aria-selected={isActive}
            aria-label={tab.label}
            onClick={() => onNav(i)}
            className="flex-1 border-none bg-transparent cursor-pointer flex flex-col items-center justify-center gap-1.5 p-2 relative group rounded-2xl transition-all"
          >
            <div className={`transition-all duration-300 ${isActive ? getRoleColorClass(role) : "text-stone-400 dark:text-stone-600"} ${isActive ? "-translate-y-0.5 scale-110" : ""}`}>
              {tab.icon}
            </div>
            {tab.badge !== undefined && !isActive && (
              <div className="absolute top-1 left-1/2 ml-2 bg-rose-500 text-white rounded-full min-w-[14px] h-3.5 px-0.5 text-[9px] font-black flex items-center justify-center border-2 border-white dark:border-stone-900 shadow-sm">
                {tab.badge}
              </div>
            )}
            <div
              className={`text-[9px] font-black font-sans uppercase tracking-[0.1em] transition-all duration-300 ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-75 translate-y-1"} ${getRoleColorClass(role)}`}
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
    <nav className="p-6 flex flex-col gap-3">
      {tabs.map((tab, i) => {
        const isActive = active === i;
        return (
          <motion.button
            key={i}
            whileHover={{ x: 6 }}
            whileTap={{ scale: 0.98 }}
            role="tab"
            aria-selected={isActive}
            aria-label={tab.label}
            onClick={() => onNav(i)}
            className={`w-full flex items-center justify-between px-5 py-4 rounded-[18px] transition-all cursor-pointer relative group ${
              isActive 
                ? getRoleBgClass(role) + " shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] border border-black/5 dark:border-white/5" 
                : "text-stone-500 dark:text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800/30"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`transition-transform duration-500 ${isActive ? getRoleColorClass(role) + " scale-110" : "text-stone-400 dark:text-stone-600 group-hover:scale-110"}`}>
                {tab.icon}
              </div>
              <span className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all ${isActive ? "opacity-100" : "opacity-80"}`}>{tab.label}</span>
            </div>
            {tab.badge !== undefined && (
              <div className={`rounded-full min-w-[20px] h-5 px-1.5 text-[10px] font-black flex items-center justify-center shadow-sm ${isActive ? "bg-rose-500 text-white" : "bg-stone-100 dark:bg-stone-800 text-stone-500"}`}>
                {tab.badge}
              </div>
            )}
            {isActive && (
               <motion.div 
                 layoutId="active-nav-indicator"
                 className="absolute left-0 w-1 h-6 bg-current rounded-full" 
               />
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
      <header className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-xl border-b border-stone-200 dark:border-stone-800 shrink-0 z-40 relative">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-3xl font-black text-stone-900 dark:text-stone-50 tracking-tighter font-display uppercase italic">Drona</div>
            <div className="h-4 w-px bg-stone-200 dark:bg-stone-800 mx-2" />
            <div className="text-[10px] bg-stone-950 dark:bg-white text-white dark:text-stone-950 px-3 py-1 rounded-full font-sans font-black uppercase tracking-[0.25em] scale-90">v2.1</div>
          </div>
          
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDark} 
              aria-label="Toggle dark mode"
              className="w-10 h-10 flex items-center justify-center rounded-2xl bg-stone-50 dark:bg-stone-800 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-all border border-stone-100 dark:border-stone-700 shadow-sm"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </motion.button>
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
