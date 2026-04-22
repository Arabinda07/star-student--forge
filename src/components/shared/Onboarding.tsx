import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  GraduationCap, 
  User, 
  Users, 
  ArrowRight, 
  Sparkle, 
  Compass,
  Books,
  ChalkboardTeacher,
  Waveform,
  GlobeHemisphereEast,
  ShieldCheck
} from "@phosphor-icons/react";
import { Role } from "../../types";

export interface IntakeData {
  role: Role;
  name: string;
  meta: string;
}

interface OnboardingProps {
  onComplete: (data: IntakeData) => void;
  onSkip?: () => void;
}

export default function Onboarding({ onComplete, onSkip }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<Role>("student");
  const [formData, setFormData] = useState({ name: "", meta: "" });
  const [error, setError] = useState<string | null>(null);

  const introSlides = [
    {
      title: "A workspace that works with you",
      desc: "Drona brings students, teachers, and parents together in one place.",
      icon: <GraduationCap size={44} weight="duotone" className="text-brand-600 dark:text-brand-400" />,
      tag: "Community"
    },
    {
      title: "Focus on what matters",
      desc: "Stay on top of notes and assignments without the clutter.",
      icon: <Sparkle size={44} weight="duotone" className="text-brand-600 dark:text-brand-400" />,
      tag: "Focus"
    },
    {
      title: "Built to last",
      desc: "A platform designed for real learning, not just for show.",
      icon: <GlobeHemisphereEast size={44} weight="duotone" className="text-brand-600 dark:text-brand-400" />,
      tag: "Precision"
    }
  ];

  const handleNext = () => {
    if (step < introSlides.length) {
      setStep(step + 1);
      return;
    }

    if (step === introSlides.length) {
      setStep(step + 1);
      return;
    }

    if (step === introSlides.length + 1) {
      if (!formData.name.trim() || !formData.meta.trim()) {
        setError("Please complete all fields to continue.");
        return;
      }
      setError(null);
      onComplete({
        role: selectedRole,
        name: formData.name.trim(),
        meta: formData.meta.trim()
      });
    }
  };

  const isFinalStep = step === introSlides.length + 1;

  const renderContent = () => {
    if (step < introSlides.length) {
      const slide = introSlides[step];
      return (
        <motion.div
          key={`intro-${step}`}
          className="flex flex-col items-center text-center w-full px-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
           <div className="mb-10 relative">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute inset-0 -m-4 border border-brand-500/10 rounded-full" 
            />
            <div className="w-32 h-32 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[44px] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] flex items-center justify-center relative overflow-hidden group transition-all duration-700 hover:rounded-[32px]">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative z-10 transition-all duration-700 group-hover:scale-110">
                {slide.icon}
              </div>
            </div>
          </div>
          
          <div className="text-[11px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-[0.5em] mb-4 italic flex items-center gap-2">
            <span className="w-8 h-px bg-brand-500/30" />
            {slide.tag}
            <span className="w-8 h-px bg-brand-500/30" />
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-display text-stone-900 dark:text-stone-50 tracking-tight leading-[0.85] mb-8 uppercase italic">
            {slide.title}
          </h1>
          <p className="text-base sm:text-lg text-stone-500 dark:text-stone-400 font-bold leading-relaxed max-w-[360px] font-sans opacity-80 italic">
            {slide.desc}
          </p>
        </motion.div>
      );
    }

    if (step === introSlides.length) {
      return (
        <motion.div
            key="role-selection"
            className="flex flex-col items-center w-full px-4"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
          <div className="w-16 h-16 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-2xl shadow-sm flex items-center justify-center mb-6 relative group">
             <div className="absolute inset-0 bg-brand-500/5 animate-pulse rounded-full blur-xl" />
             <Compass size={32} weight="duotone" className="text-brand-600 dark:text-brand-400 transition-transform duration-1000 group-hover:rotate-180 relative z-10" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-stone-900 dark:text-stone-50 tracking-tighter mb-4 text-center uppercase italic leading-none">
            How will you use Drona?
          </h1>
          <p className="text-[10px] font-black text-stone-400 dark:text-stone-500 font-sans text-center mb-8 uppercase tracking-[0.2em]">
            We'll customize your workspace based on your role.
          </p>
          
          <div className="w-full space-y-3 max-w-sm">
            {[
              { id: "student", label: "Student", icon: <User size={20} weight="duotone" />, desc: "Track assignments, notes, and progress" },
              { id: "teacher", label: "Educator", icon: <ChalkboardTeacher size={20} weight="duotone" />, desc: "Manage classes and student growth" },
              { id: "parent", label: "Guardian", icon: <Users size={20} weight="duotone" />, desc: "Oversee schedules and updates" }
            ].map((r) => {
              const isActive = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRole(r.id as Role)}
                  className={`w-full p-6 rounded-[32px] border text-left flex items-center gap-6 transition-all duration-500 relative group overflow-hidden cursor-pointer ${
                    isActive 
                      ? 'border-brand-500/40 bg-brand-50/50 dark:bg-brand-500/10 text-stone-900 dark:text-stone-50 shadow-[0_32px_64px_-12px_rgba(var(--color-brand-500-rgb),0.15)]' 
                      : 'border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-400 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <div className={`w-14 h-16 rounded-[20px] flex items-center justify-center transition-all duration-700 shrink-0 ${isActive ? 'bg-brand-500 text-white shadow-xl rotate-3' : 'bg-stone-50 dark:bg-stone-800 text-stone-300 group-hover:bg-stone-100 group-hover:scale-105'}`}>
                     {r.icon}
                  </div>
                  <div className="flex-1">
                    <div className="font-black tracking-tighter text-xl font-display uppercase italic leading-none mb-1">{r.label}</div>
                    <div className={`text-[10px] font-black uppercase tracking-widest transition-opacity italic ${isActive ? 'text-brand-600 dark:text-brand-400 opacity-100' : 'opacity-40'}`}>{r.desc}</div>
                  </div>
                  <AnimatePresence>
                    {isActive && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0 }}
                        className="w-3 h-3 rounded-full bg-brand-500 shadow-lg shadow-brand-500/50" 
                      />
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div
          key="details-form"
          className="flex flex-col w-full text-left px-4"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8">
            <div className="w-12 h-12 rounded-[16px] bg-brand-500 text-white flex items-center justify-center italic font-black text-xl shadow-lg shadow-brand-500/20 rotate-3">03</div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black font-display text-stone-900 dark:text-stone-50 tracking-tighter uppercase italic leading-none">
                Almost there
              </h1>
              <p className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.2em] mt-2">Just a few final details</p>
            </div>
          </div>
          
          <p className="text-sm text-stone-500 dark:text-stone-400 font-bold mb-8 leading-relaxed font-sans max-w-sm italic opacity-80 uppercase tracking-tight">
            {selectedRole === 'student' && "Your name helps teachers identify your work."}
            {selectedRole === 'teacher' && "Your subject helps us set up your class view."}
            {selectedRole === 'parent'  && "Your child's name links their progress to your account."}
          </p>

          <div className="space-y-6 max-w-sm">
             <div className="space-y-3">
                <label className="block text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.2em] ml-1">
                  Your Full Name
                </label>
                <div className="relative group">
                  <User size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-brand-500 transition-colors" />
                  <input
                    type="text"
                    placeholder="E.G. ARTHUR PENDRAKE"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-12 pr-6 h-14 border border-stone-100 dark:border-stone-800 rounded-[20px] shadow-sm placeholder:text-stone-200 focus:outline-none focus:ring-8 focus:ring-brand-500/5 focus:border-brand-500 sm:text-sm bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 transition-all font-black font-sans uppercase italic tracking-wider"
                  />
                </div>
             </div>

             <div className="space-y-3">
                <label className="block text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.2em] ml-1">
                  {selectedRole === 'student' && "Current Grade"}
                  {selectedRole === 'teacher' && "Subject taught"}
                  {selectedRole === 'parent'  && "Child's name"}
                </label>
                <div className="relative group">
                  <ShieldCheck size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-brand-500 transition-colors" />
                  <input
                    type="text"
                    placeholder={
                      selectedRole === 'student' ? "E.g. Grade 10" :
                      selectedRole === 'teacher' ? "E.g. Mathematics" :
                      "E.g. Rohan Sharma"
                    }
                    value={formData.meta}
                    onChange={(e) => setFormData({...formData, meta: e.target.value})}
                    className="w-full pl-12 pr-6 h-14 border border-stone-100 dark:border-stone-800 rounded-[20px] shadow-sm placeholder:text-stone-200 focus:outline-none focus:ring-8 focus:ring-brand-500/5 focus:border-brand-500 sm:text-sm bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 transition-all font-black font-sans uppercase italic tracking-wider"
                  />
                </div>
             </div>

             {error && (
               <motion.div 
                initial={{opacity:0, y:-10}} 
                animate={{opacity:1, y:0}} 
                className="flex items-center gap-3 text-rose-500 text-[10px] font-black uppercase tracking-[0.2em] italic px-6 py-4 bg-rose-50/50 dark:bg-rose-500/10 rounded-2xl border border-rose-100 dark:border-rose-900/30"
               >
                  <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shrink-0" />
                  {error}
               </motion.div>
             )}
          </div>
        </motion.div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-stone-50 dark:bg-stone-950 overflow-hidden font-sans premium-texture">
      
      {/* Sophisticated organic background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Soft Organic Blob 1 */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            x: [0, 50, 0],
            y: [0, 30, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1/4 -left-1/4 w-[80vw] h-[80vw] rounded-full bg-gradient-to-br from-brand-500/10 to-brand-300/5 blur-[120px] dark:blur-[180px] opacity-40 dark:opacity-20"
        />
        {/* Soft Organic Blob 2 */}
        <motion.div 
          animate={{ 
            scale: [1.2, 1, 1.2],
            rotate: [0, -60, 0],
            x: [0, -40, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-1/4 -right-1/4 w-[70vw] h-[70vw] rounded-full bg-gradient-to-tr from-stone-200/20 to-brand-500/10 blur-[100px] dark:blur-[160px] opacity-30 dark:opacity-10"
        />
        {/* Blueprint Grid with subtle gradient mask */}
        <div 
          className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
          style={{ 
            backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`, 
            backgroundSize: '80px 80px',
            maskImage: 'radial-gradient(circle at center, black, transparent 80%)'
          }} 
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center overflow-hidden py-10 px-6">
        <div className="w-full max-w-lg z-10 flex flex-col justify-center items-center">
          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>
        </div>
      </div>

      {/* refined footer action */}
      <div className="shrink-0 w-full max-w-md mx-auto px-8 pb-12 pt-6 z-20 flex flex-col items-center rounded-t-[40px] sm:rounded-none">
        <div className="flex gap-3 mb-8 w-full justify-center">
          {Array.from({ length: introSlides.length + 2 }).map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-1000 ease-[0.16, 1, 0.3, 1] ${i === step ? 'w-12 bg-stone-900 dark:bg-stone-50' : 'w-3 bg-stone-200 dark:bg-stone-800'}`} 
            />
          ))}
        </div>

        <motion.button 
          whileHover={{ scale: 1.02, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNext}
          className="w-full h-16 bg-stone-900 dark:bg-stone-50 hover:bg-black dark:hover:bg-white text-stone-50 dark:text-stone-900 font-black font-sans text-[10px] uppercase tracking-[0.25em] rounded-[24px] flex items-center justify-center gap-4 shadow-xl shadow-stone-900/10 dark:shadow-stone-100/5 border-none cursor-pointer group active:brightness-90 transition-all italic"
        >
          <span className="flex items-center gap-3">
            {isFinalStep ? "Get Started" : "Next"}
            <ArrowRight size={20} weight="bold" className="group-hover:translate-x-2 transition-transform duration-500" />
          </span>
        </motion.button>

        <div className="mt-6 flex items-center justify-center">
          <button
            onClick={onSkip}
            className="text-[10px] font-black text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 uppercase tracking-[0.3em] italic transition-colors border-none bg-transparent cursor-pointer py-2 px-4"
          >
            Already have an account? Sign in
          </button>
        </div>

        <div className="mt-4 flex items-center gap-4 opacity-20 hover:opacity-40 transition-opacity duration-500">
           <p className="text-[9px] font-black text-stone-500 dark:text-stone-400 uppercase tracking-[0.4em] italic">
            Drona Platform · Build 2.1.1
          </p>
        </div>
      </div>
    </div>
  );
}


