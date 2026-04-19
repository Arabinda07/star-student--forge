import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { School, User, Users, BookOpen, ArrowRight } from "lucide-react";

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);

  const slides = [
    {
      id: "welcome",
      title: "Welcome to Drona",
      desc: "The complete coaching and tuition management platform that brings your academic community together.",
      icon: <School size={40} strokeWidth={1.5} className="text-[var(--color-brand-600)] dark:text-[var(--color-brand-400)]" />,
    },
    {
      id: "students",
      title: "For Students",
      desc: "Stay locked in on assignments, access structured class notes, and persistently track your learning streak.",
      icon: <BookOpen size={40} strokeWidth={1.5} className="text-[var(--color-brand-600)] dark:text-[var(--color-brand-400)]" />,
    },
    {
      id: "teachers",
      title: "For Teachers",
      desc: "Command your batches, schedule live sessions, and precision-monitor every student's core performance.",
      icon: <User size={40} strokeWidth={1.5} className="text-[var(--color-brand-600)] dark:text-[var(--color-brand-400)]" />,
    },
    {
      id: "parents",
      title: "For Parents",
      desc: "Maintain absolute clarity on your child's schedule, academic trajectory, and fee payment life cycles.",
      icon: <Users size={40} strokeWidth={1.5} className="text-[var(--color-brand-600)] dark:text-[var(--color-brand-400)]" />,
    }
  ];

  const handleNext = () => {
    if (step === slides.length - 1) {
      onComplete();
    } else {
      setStep(prev => prev + 1);
    }
  };

  const currentSlide = slides[step];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-50 dark:bg-stone-950 overflow-hidden font-sans">
      
      {/* Ambient background glows */}
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

      <div className="absolute top-12 right-8 z-20">
         <button 
            onClick={onComplete}
            className="text-[10px] font-bold uppercase tracking-widest text-stone-400 hover:text-stone-900 dark:hover:text-stone-50 transition-colors px-4 py-2"
          >
            Skip 
          </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          className="px-8 w-full max-w-md mx-auto flex flex-col items-center text-center z-10 mb-10"
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="w-24 h-24 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[28px] shadow-sm flex items-center justify-center mb-10 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[var(--color-brand-500)] opacity-[0.04] dark:opacity-[0.08]" />
            {currentSlide.icon}
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -15, filter: "blur(8px)" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-3xl sm:text-4xl font-bold font-display text-stone-900 dark:text-stone-50 tracking-tight leading-tight mb-5"
          >
            {currentSlide.title}
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -15, filter: "blur(8px)" }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="text-base text-stone-500 dark:text-stone-400 font-medium leading-relaxed max-w-[320px]"
          >
            {currentSlide.desc}
          </motion.p>
        </motion.div>
      </AnimatePresence>

      <div className="absolute bottom-12 left-0 right-0 px-8 flex flex-col items-center z-20 w-full mx-auto">
        <div className="flex gap-2.5 mb-10">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-700 ease-out ${i === step ? 'w-10 bg-stone-900 dark:bg-stone-100' : 'w-3 bg-stone-200 dark:bg-stone-800'}`} 
            />
          ))}
        </div>

        <button 
          onClick={handleNext}
          className="w-full max-w-[300px] h-14 bg-stone-900 dark:bg-stone-50 hover:bg-black dark:hover:bg-white text-white dark:text-stone-900 font-bold font-sans rounded-2xl flex items-center justify-center gap-3 shadow-[0_8px_16px_-6px_rgba(0,0,0,0.1)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2 active:scale-[0.98]"
        >
          {step === slides.length - 1 ? "Open Dashboard" : "Continue"}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}
