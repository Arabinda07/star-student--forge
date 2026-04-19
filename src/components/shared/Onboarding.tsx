import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { School, User, Users, ArrowRight, Sparkles, Compass } from "lucide-react";
import { Role } from "../../types";

export interface IntakeData {
  role: Role;
  name: string;
  meta: string;
}

interface OnboardingProps {
  onComplete: (data: IntakeData) => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [selectedRole, setSelectedRole] = useState<Role>("student");
  const [formData, setFormData] = useState({ name: "", meta: "" });
  const [error, setError] = useState<string | null>(null);

  const introSlides = [
    {
      title: "Welcome to Drona",
      desc: "The complete coaching platform designed to sync students, teachers, and parents perfectly.",
      icon: <School size={40} strokeWidth={1.5} className="text-[var(--color-brand-600)] dark:text-[var(--color-brand-400)]" />,
    },
    {
      title: "Clarity & Progress",
      desc: "We replace scattered WhatsApp groups and missing notes with a tailored, focused workspace.",
      icon: <Sparkles size={40} strokeWidth={1.5} className="text-[var(--color-brand-600)] dark:text-[var(--color-brand-400)]" />,
    }
  ];

  const handleNext = () => {
    // If on Intro Slides
    if (step < introSlides.length) {
      setStep(step + 1);
      return;
    }

    // If on Role Selection
    if (step === introSlides.length) {
      setStep(step + 1);
      return;
    }

    // If on Final Form (Validation)
    if (step === introSlides.length + 1) {
      if (!formData.name.trim() || !formData.meta.trim()) {
        setError("Please fill out all fields to continue.");
        return;
      }
      setError(null);
      onComplete({
        role: selectedRole,
        name: formData.name.trim(),
        meta: formData.meta.trim() // Represents class/subject/child name depending on role
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
          className="flex flex-col items-center text-center w-full"
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-24 h-24 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[28px] shadow-sm flex items-center justify-center mb-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-[var(--color-brand-500)] opacity-[0.04] dark:opacity-[0.08]" />
            {slide.icon}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-stone-900 dark:text-stone-50 tracking-tight leading-tight mb-4">
            {slide.title}
          </h1>
          <p className="text-base text-stone-500 dark:text-stone-400 font-medium leading-relaxed max-w-[320px]">
            {slide.desc}
          </p>
        </motion.div>
      );
    }

    if (step === introSlides.length) {
      return (
        <motion.div
          key="role-selection"
          className="flex flex-col items-center w-full"
          initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="w-20 h-20 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[24px] shadow-sm flex items-center justify-center mb-6 relative overflow-hidden">
             <Compass size={32} strokeWidth={1.5} className="text-[var(--color-brand-600)] dark:text-[var(--color-brand-400)]" />
          </div>
          <h1 className="text-3xl font-bold font-display text-stone-900 dark:text-stone-50 tracking-tight mb-2 text-center">
            How will you use Drona?
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 font-medium text-center mb-8">
            Select your role to personalize the app features for your workflow.
          </p>
          
          <div className="w-full space-y-3">
            {[
              { id: "student", label: "I am a Student", icon: <User size={18} /> },
              { id: "teacher", label: "I am a Teacher", icon: <School size={18} /> },
              { id: "parent", label: "I am a Parent", icon: <Users size={18} /> }
            ].map((r) => {
              const isActive = selectedRole === r.id;
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedRole(r.id as Role)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center gap-4 transition-all duration-200 ${
                    isActive 
                      ? 'border-[var(--color-brand-600)] bg-[var(--color-brand-50)] dark:bg-[var(--color-brand-500)]/10 text-[var(--color-brand-700)] dark:text-[var(--color-brand-300)] shadow-sm ring-1 ring-[var(--color-brand-600)]/20' 
                      : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:border-stone-300 dark:hover:border-stone-700'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-[var(--color-brand-600)] text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-500'}`}>
                     {r.icon}
                  </div>
                  <span className="font-bold tracking-wide flex-1 text-[15px]">{r.label}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      );
    }

    // Final Form Step
    return (
      <motion.div
          key="details-form"
          className="flex flex-col w-full text-left"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-3xl font-bold font-display text-stone-900 dark:text-stone-50 tracking-tight mb-2">
            Let's get specific
          </h1>
          <p className="text-sm text-stone-500 dark:text-stone-400 font-medium mb-8 leading-relaxed">
            {selectedRole === 'student' && "Enter your details so your teachers know exactly who is submitting work."}
            {selectedRole === 'teacher' && "Enter your specialization to set up your core teaching dashboard."}
            {selectedRole === 'parent'  && "Link your profile so you can properly track payments and feedback."}
          </p>

          <div className="space-y-5">
             <div>
                <label className="block text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-2">
                  What is your full name?
                </label>
                <input
                  type="text"
                  placeholder="e.g., Rohan Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3.5 border border-stone-200 dark:border-stone-800 rounded-xl shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)] focus:border-transparent sm:text-sm bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 transition-all font-medium"
                />
             </div>

             <div>
                <label className="block text-[11px] font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest mb-2">
                  {selectedRole === 'student' && "What class / grade are you in?"}
                  {selectedRole === 'teacher' && "What is your main teaching subject?"}
                  {selectedRole === 'parent'  && "What is your child's full name?"}
                </label>
                <input
                  type="text"
                  placeholder={
                    selectedRole === 'student' ? "e.g., Class 10 (Science)" :
                    selectedRole === 'teacher' ? "e.g., Advanced Mathematics" :
                    "e.g., Rohan Sharma"
                  }
                  value={formData.meta}
                  onChange={(e) => setFormData({...formData, meta: e.target.value})}
                  className="w-full px-4 py-3.5 border border-stone-200 dark:border-stone-800 rounded-xl shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-500)] focus:border-transparent sm:text-sm bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-50 transition-all font-medium"
                />
             </div>

             {error && (
               <motion.div initial={{opacity:0, y:-10}} animate={{opacity:1,y:0}} className="text-rose-500 text-xs font-bold mt-2">
                 {error}
               </motion.div>
             )}
          </div>
        </motion.div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-50 dark:bg-stone-950 overflow-hidden font-sans">
      
      {/* Ambient backgrounds */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ opacity: [0.03, 0.05, 0.03] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[var(--color-brand-500)] blur-3xl mix-blend-multiply dark:mix-blend-screen"
        />
        <motion.div 
          animate={{ opacity: [0.04, 0.06, 0.04] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[var(--color-brand-400)] blur-3xl mix-blend-multiply dark:mix-blend-screen"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`container-${step}`}
          className={`px-8 w-full max-w-md mx-auto z-10 flex flex-col justify-center ${step < introSlides.length ? 'mb-10 text-center' : 'mb-16'}`}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-12 left-0 right-0 px-8 flex flex-col items-center z-20 w-full mx-auto">
        <div className="flex gap-2.5 mb-10">
          {Array.from({ length: introSlides.length + 2 }).map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-700 ease-out ${i === step ? 'w-10 bg-stone-900 dark:bg-stone-100' : 'w-3 bg-stone-200 dark:bg-stone-800'}`} 
            />
          ))}
        </div>

        <button 
          onClick={handleNext}
          className="w-full max-w-[300px] h-14 bg-stone-900 dark:bg-stone-50 hover:bg-black dark:hover:bg-white text-white dark:text-stone-900 font-bold font-sans rounded-xl flex items-center justify-center gap-3 shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 active:scale-[0.98] mt-2 group relative overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            {isFinalStep ? "Create My Account" : "Continue"}
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </span>
        </button>
      </div>
    </div>
  );
}
