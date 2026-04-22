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
      className="md:hidden bg-white/80 dark:bg-stone-950/80 backdrop-blur-md border-t border-stone-100 dark:border-stone-900 pb-[env(safe-area-inset-bottom)] pt-3 px-6 shrink-0 z-20 relative"
    >
      <ul role="tablist" aria-label="Navigation tabs" className="flex list-none p-0 m-0 justify-around">
        {tabs.map((tab, i) => {
          const isActive = active === i;
          return (
            <li key={i} role="presentation">
              <button
                role="tab"
                aria-selected={isActive}
                onClick={() => onNav(i)}
                className="bg-transparent border-none cursor-pointer flex flex-col items-center gap-1.5 p-2 transition-all"
              >
                <div className={`transition-colors duration-300 ${isActive ? "text-stone-900 dark:text-stone-100" : "text-stone-300 dark:text-stone-700"}`}>
                  {tab.icon}
                </div>
                <div className={`text-[10px] font-medium tracking-wider transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0"}`}>
                  {tab.label}
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function DesktopNav({ role, active, onNav }: { role: Role; active: number; onNav: (i: number) => void }) {
  const tabs = getTabs(role);
  
  return (
    <nav aria-label="Main navigation" className="p-10 flex flex-col gap-6">
      <ul role="tablist" aria-label="Navigation tabs" className="flex flex-col gap-2 list-none p-0 m-0">
        {tabs.map((tab, i) => {
          const isActive = active === i;
          return (
            <li key={i} role="presentation">
              <button
                role="tab"
                aria-selected={isActive}
                onClick={() => onNav(i)}
                className={`w-full flex items-center gap-4 px-5 py-3 rounded-xl transition-all border-none cursor-pointer text-left ${
                  isActive 
                    ? "bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100" 
                    : "text-stone-400 hover:text-stone-600 dark:text-stone-600 dark:hover:text-stone-400 bg-transparent"
                }`}
              >
                <div className={`transition-colors ${isActive ? "text-stone-900 dark:text-stone-100" : "text-stone-300 dark:text-stone-700"}`}>
                  {tab.icon}
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest font-sans">{tab.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
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
      <div className="h-[100dvh] bg-white dark:bg-stone-950 font-sans flex flex-col overflow-hidden text-body relative">
        
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
      <header className="bg-white/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-stone-100 dark:border-stone-900 shrink-0 z-40 relative">
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-2xl font-bold text-stone-900 dark:text-stone-100 tracking-tight font-display">Drona</div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleDark} 
              aria-label="Toggle dark mode"
              className="w-10 h-10 flex items-center justify-center rounded-full text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors bg-transparent border-none cursor-pointer"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Web App Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto flex overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex flex-col w-64 border-r border-stone-100 dark:border-stone-900 bg-white dark:bg-stone-950 z-10 shrink-0">
          <DesktopNav role={role} active={tab} onNav={handleTabChange} />
        </div>
        
        {/* Dynamic Content Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-white dark:bg-stone-950">
          <main
            id="main-content"
            role="tabpanel"
            tabIndex={-1}
            className="flex-1 relative overflow-y-auto w-full mx-auto flex flex-col bg-white dark:bg-stone-950"
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
