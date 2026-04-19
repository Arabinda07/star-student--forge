import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { CheckCircle2, ChevronRight, GraduationCap, Users, CalendarCheck, BookOpen, ShieldCheck } from "lucide-react";
import { Role } from "../../../types";

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
          icon: <GraduationCap size={48} className="text-amber-500" />
        },
        {
          title: "Manage Batches",
          desc: "Create dedicated classes, add your students, and organize your schedules in one place.",
          icon: <Users size={48} className="text-amber-500" />
        },
        {
          title: "The Library",
          desc: "Upload PDFs and class notes. Once uploaded, they are instantly available to all linked students.",
          icon: <BookOpen size={48} className="text-amber-500" />
        }
      ];
    }
    if (r === "parent") {
      return [
        {
          title: `Welcome, ${name.split(' ')[0]}`,
          desc: "Your parent dashboard gives you absolute clarity on your child's academic journey.",
          icon: <ShieldCheck size={48} className="text-sky-500" />
        },
        {
          title: "Track Schedule",
          desc: "See exactly when classes are happening, what subject is being taught, and who the teacher is.",
          icon: <CalendarCheck size={48} className="text-sky-500" />
        }
      ];
    }
    
    // Default to Student
    return [
      {
        title: `Welcome, ${name.split(' ')[0]}`,
        desc: "Your student dashboard is built to keep you completely locked in and focused.",
        icon: <GraduationCap size={48} className="text-emerald-500" />
      },
      {
        title: "My Work",
        desc: "Track pending homework, tests, and active assignments here. Never miss a deadline.",
        icon: <CheckCircle2 size={48} className="text-emerald-500" />
      },
      {
        title: "Class Notes",
        desc: "Access your teacher's uploaded PDFs and recordings instantly whenever you need to study.",
        icon: <BookOpen size={48} className="text-emerald-500" />
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 font-sans">
      <AnimatePresence mode="wait">
        <motion.div
           key={step}
           initial={{ opacity: 0, scale: 0.95, y: 10 }}
           animate={{ opacity: 1, scale: 1, y: 0 }}
           exit={{ opacity: 0, scale: 0.95, y: -10 }}
           transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
           className="w-full max-w-sm bg-white dark:bg-stone-900 rounded-3xl shadow-xl overflow-hidden"
        >
          <div className="p-8 pb-6 flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-2xl bg-stone-50 dark:bg-stone-800 flex items-center justify-center mb-6 shadow-sm border border-stone-100 dark:border-stone-700">
               {slides[step].icon}
            </div>
            <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50 mb-3 tracking-tight">
               {slides[step].title}
            </h2>
            <p className="text-[15px] font-medium text-stone-500 dark:text-stone-400 leading-relaxed">
               {slides[step].desc}
            </p>
          </div>
          
          <div className="px-6 pb-6 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex gap-1.5 pl-2">
                {slides.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-4 bg-stone-900 dark:bg-stone-100' : 'w-1.5 bg-stone-200 dark:bg-stone-800'}`} 
                  />
                ))}
              </div>
              <button 
                onClick={handleNext}
                className="h-10 px-5 bg-stone-900 dark:bg-stone-50 text-white dark:text-stone-900 hover:bg-stone-800 dark:hover:bg-white text-sm font-bold rounded-xl flex items-center gap-1 transition-colors group"
              >
                {step === slides.length - 1 ? "Let's Go" : "Next"}
                <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
