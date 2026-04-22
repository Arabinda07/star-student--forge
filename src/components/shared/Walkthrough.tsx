import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle, 
  ArrowRight, 
  GraduationCap, 
  Users, 
  CalendarCheck, 
  Books, 
  ShieldCheck 
} from "@phosphor-icons/react";
import { Role } from "../../types";

interface WalkthroughProps {
  role: Role;
  name: string;
  onComplete: () => void;
}

export default function Walkthrough({ role, name, onComplete }: WalkthroughProps) {
  const [step, setStep] = useState(0);

  const getSlides = (r: Role) => {
    if (r === "teacher") {
      return [
        {
          title: `Welcome, ${name.split(' ')[0]}`,
          desc: "Your core teaching dashboard is ready. Let's look at how Drona simplifies your workflow.",
          icon: <GraduationCap size={48} weight="duotone" className="text-amber-500" />
        },
        {
          title: "Manage Batches",
          desc: "Create dedicated classes, add your students, and organize your schedules in one place.",
          icon: <Users size={48} weight="duotone" className="text-amber-500" />
        },
        {
          title: "The Library",
          desc: "Upload PDFs and class notes. Once uploaded, they are instantly available to all linked students.",
          icon: <Books size={48} weight="duotone" className="text-amber-500" />
        }
      ];
    }
    if (r === "parent") {
      return [
        {
          title: `Welcome, ${name.split(' ')[0]}`,
          desc: "Your parent dashboard gives you absolute clarity on your child's academic journey.",
          icon: <ShieldCheck size={48} weight="duotone" className="text-sky-500" />
        },
        {
          title: "Track Schedule",
          desc: "See exactly when classes are happening, what subject is being taught, and who the teacher is.",
          icon: <CalendarCheck size={48} weight="duotone" className="text-sky-500" />
        }
      ];
    }
    
    // Default to Student
    return [
      {
        title: `Welcome, ${name.split(' ')[0]}`,
        desc: "Your student dashboard is built to keep you completely locked in and focused.",
        icon: <GraduationCap size={48} weight="duotone" className="text-emerald-500" />
      },
      {
        title: "My Work",
        desc: "Track pending homework, tests, and active assignments here. Never miss a deadline.",
        icon: <CheckCircle size={48} weight="duotone" className="text-emerald-500" />
      },
      {
        title: "Class Notes",
        desc: "Access your teacher's uploaded PDFs and recordings instantly whenever you need to study.",
        icon: <Books size={48} weight="duotone" className="text-emerald-500" />
      }
    ];
  };

  const slides = getSlides(role);

  const handleNext = () => {
    if (step === slides.length - 1) {
      onComplete();
    } else {
      setStep(s => s + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 font-sans premium-texture">
      <AnimatePresence mode="wait">
        <motion.div
           key={step}
           initial={{ opacity: 0, scale: 0.95, y: 20 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.95, y: -20 }}
           transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
           className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-[40px] shadow-2xl overflow-hidden border border-stone-200 dark:border-stone-800"
        >
          <div className="p-10 pb-8 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-[32px] bg-stone-50 dark:bg-stone-800 flex items-center justify-center mb-8 shadow-inner border border-stone-100 dark:border-stone-700">
               {slides[step].icon}
            </div>
            <h2 className="text-3xl font-black text-stone-900 dark:text-stone-50 mb-4 tracking-tighter uppercase italic font-display">
               {slides[step].title}
            </h2>
            <p className="text-[15px] font-bold text-stone-500 dark:text-stone-400 leading-relaxed font-sans opacity-80">
               {slides[step].desc}
            </p>
          </div>
          
          <div className="px-8 pb-8 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {slides.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-500 ${i === step ? 'w-8 bg-stone-900 dark:bg-stone-100' : 'w-2 bg-stone-200 dark:bg-stone-800'}`} 
                  />
                ))}
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleNext}
                className="h-12 px-6 bg-stone-900 dark:bg-stone-50 text-white dark:text-stone-900 hover:bg-black dark:hover:bg-white text-[10px] font-black uppercase tracking-widest rounded-2xl flex items-center gap-2 transition-all group shadow-lg shadow-stone-900/10 cursor-pointer border-none"
              >
                {step === slides.length - 1 ? "Let's Go" : "Next"}
                <ArrowRight size={16} weight="bold" className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

