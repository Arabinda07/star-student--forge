import { useState, ReactNode, useEffect } from "react";
import { motion } from "motion/react";
import { Role } from "./types";
import { flushSync } from "react-dom";
import { 
  HouseLine, 
  Users, 
  CalendarBlank, 
  Books, 
  FileText, 
  Coins, 
  ChatCenteredText, 
  GraduationCap,
  User,
  Sun,
  Moon
} from "@phosphor-icons/react";

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
      <h2 className="text-xl font-black text-stone-900 dark:text-stone-50 font-sans mb-2 uppercase italic tracking-tight">{title}</h2>
      <p className="text-sm text-stone-500 dark:text-stone-400 font-bold font-sans leading-relaxed max-w-[240px] opacity-70 italic">This feature is part of the next sprint. We're currently building the foundation.</p>
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
      { icon: <HouseLine weight="duotone" size={24} />, label: "Home" },
      { icon: <GraduationCap weight="duotone" size={24} />, label: "Classes" },
      { icon: <Users weight="duotone" size={24} />, label: "Students" },
      { icon: <CalendarBlank weight="duotone" size={24} />, label: "Calendar" },
      { icon: <Books weight="duotone" size={24} />, label: "Library" },
      { icon: <User weight="duotone" size={24} />, label: "Me" }
    ];
  }
  if (role === "parent") {
    return [
      { icon: <HouseLine weight="duotone" size={24} />, label: "Home" },
      { icon: <CalendarBlank weight="duotone" size={24} />, label: "Schedule" },
      { icon: <Coins weight="duotone" size={24} />, label: "Fees" },
      { icon: <ChatCenteredText weight="duotone" size={24} />, label: "Feedback" },
      { icon: <User weight="duotone" size={24} />, label: "Me" }
    ];
  }
  return [
    { icon: <HouseLine weight="duotone" size={24} />, label: "Home" },
    { icon: <FileText weight="duotone" size={24} />, label: "My Work", badge: 2 },
    { icon: <GraduationCap weight="duotone" size={24} />, label: "Notes" },
    { icon: <CalendarBlank weight="duotone" size={24} />, label: "Calendar" },
    { icon: <User weight="duotone" size={24} />, label: "Me" }
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
    <nav
      aria-label="Main navigation"
      className="md:hidden bg-white/90 dark:bg-stone-900/90 backdrop-blur-2xl border-t border-stone-100 dark:border-stone-800 pb-[env(safe-area-inset-bottom)] pt-4 px-6 shadow-[0_-10px_40px_rgba(0,0,0,0.08)] shrink-0 z-20 relative rounded-t-[32px]"
    >
      <div role="tablist" aria-label="Navigation tabs" className="flex">
        {tabs.map((tab, i) => {
          const isActive = active === i;
          const tabId = `nav-tab-${i}`;
          return (
            <motion.button
              key={i}
              id={tabId}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              role="tab"
              aria-selected={isActive}
              aria-controls="main-content"
              aria-label={tab.label}
              onClick={() => onNav(i)}
              className="flex-1 border-none bg-transparent cursor-pointer flex flex-col items-center justify-center gap-2 p-2 relative group rounded-2xl transition-all"
            >
              <div className={`transition-all duration-500 ${isActive ? getRoleColorClass(role) : "text-stone-300 dark:text-stone-700"} ${isActive ? "-translate-y-1 scale-110" : ""}`}>
                {tab.icon}
              </div>
              {tab.badge !== undefined && !isActive && (
                <div className="absolute top-1 left-1/2 ml-3 bg-rose-500 text-white rounded-full min-w-[16px] h-4 px-1 text-[8px] font-black flex items-center justify-center border-2 border-white dark:border-stone-900 shadow-md">
                  {tab.badge}
                </div>
              )}
              <div
                className={`text-[8px] font-black font-sans uppercase tracking-[0.2em] italic transition-all duration-500 ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-75 translate-y-2"} ${getRoleColorClass(role)}`}
              >
                {tab.label}
              </div>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
}

function DesktopNav({ role, active, onNav }: { role: Role; active: number; onNav: (i: number) => void }) {
  const tabs = getTabs(role);
  
  return (
    <nav aria-label="Main navigation" className="p-8 flex flex-col gap-4">
      <div role="tablist" aria-label="Navigation tabs" className="flex flex-col gap-4">
        {tabs.map((tab, i) => {
          const isActive = active === i;
          const tabId = `desktop-tab-${i}`;
          return (
            <motion.button
              key={i}
              id={tabId}
              whileHover={{ x: 8 }}
              whileTap={{ scale: 0.98 }}
              role="tab"
              aria-selected={isActive}
              aria-controls="main-content"
              aria-label={tab.label}
              onClick={() => onNav(i)}
              className={`w-full flex items-center justify-between px-6 py-5 rounded-[24px] transition-all cursor-pointer relative group ${
                isActive 
                  ? getRoleBgClass(role) + " shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-black/5 dark:border-white/5 backdrop-blur-md" 
                  : "text-stone-400 dark:text-stone-600 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-50 dark:hover:bg-stone-800/30"
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`transition-all duration-700 ${isActive ? getRoleColorClass(role) + " scale-125 rotate-6" : "text-stone-300 dark:text-stone-700 group-hover:scale-110 group-hover:text-stone-900"}`}>
                  {tab.icon}
                </div>
                <span className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all italic font-display ${isActive ? "opacity-100 translate-x-1" : "opacity-60 translate-x-0"}`}>{tab.label}</span>
              </div>
              {tab.badge !== undefined && (
                <div className={`rounded-full min-w-[24px] h-6 px-2 text-[9px] font-black flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110 ${isActive ? "bg-rose-500 text-white" : "bg-stone-100 dark:bg-stone-800 text-stone-400"}`}>
                  {tab.badge}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
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
        // A session means this user has registered before — skip onboarding always
        localStorage.setItem('drona_onboarding_done', 'true');
        setShowOnboarding(false);
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
      <div className="h-[100dvh] bg-stone-50 dark:bg-stone-950 flex items-center justify-center">
        <div className="animate-pulse w-8 h-8 rounded-full bg-[var(--color-brand-500)]" />
      </div>
    );
  }

  if (!session) {
    if (showOnboarding) {
      return (
        <Onboarding
          onComplete={handleCompleteOnboarding}
          onSkip={() => {
            localStorage.setItem('drona_onboarding_done', 'true');
            setShowOnboarding(false);
            setAuthMode('signIn');
          }}
        />
      );
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
      <div className="h-[100dvh] bg-stone-100 dark:bg-stone-800 font-sans flex flex-col overflow-hidden text-stone-900 dark:text-stone-50 relative premium-texture">
        
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
      <header className="bg-white/90 dark:bg-stone-900/90 backdrop-blur-2xl border-b border-stone-100 dark:border-stone-800 shrink-0 z-40 relative">
        <div className="max-w-7xl mx-auto px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="text-4xl font-black text-stone-900 dark:text-stone-50 tracking-tighter font-display uppercase italic leading-none">Drona</div>
            <div className="h-6 w-px bg-stone-100 dark:bg-stone-800 mx-1" />
            <div className="text-[10px] bg-stone-900 dark:bg-white text-white dark:text-stone-950 px-4 py-1.5 rounded-xl font-sans font-black uppercase tracking-[0.4em] italic shadow-xl">v2.1</div>
          </div>
          
          <div className="flex items-center gap-6">
            <motion.button 
              whileHover={{ scale: 1.1, rotate: 10 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleDark} 
              aria-label="Toggle dark mode"
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-stone-900 text-stone-400 hover:text-stone-900 dark:text-stone-500 dark:hover:text-stone-100 transition-all border border-stone-100 dark:border-stone-800 shadow-xl"
            >
              {isDark ? <Sun size={22} weight="duotone" /> : <Moon size={22} weight="duotone" />}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Web App Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex overflow-hidden bg-stone-50 dark:bg-stone-950/50 md:border-x border-stone-200 dark:border-stone-800 shadow-sm">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex flex-col w-72 border-r border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 z-10 shrink-0">
          <DesktopNav role={role} active={tab} onNav={handleTabChange} />
          <div className="mt-auto p-10 hidden md:block">
            <div className="text-[10px] text-stone-300 dark:text-stone-600 uppercase tracking-[0.4em] font-black italic">Drona Protocol</div>
            <div className="text-[10px] font-black text-stone-200 dark:text-stone-700 mt-2 italic tracking-widest">BUILD v2.1.1</div>
          </div>
        </div>
        
        {/* Dynamic Content Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-stone-50 dark:bg-stone-950">
          <main
            id="main-content"
            role="tabpanel"
            tabIndex={-1}
            className="flex-1 relative overflow-y-auto w-full mx-auto flex flex-col bg-stone-50 dark:bg-stone-950"
          >
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
          </main>

          <BottomNav role={role} active={tab} onNav={handleTabChange} />
        </div>
      </div>
    </div>
  );
  }
}
