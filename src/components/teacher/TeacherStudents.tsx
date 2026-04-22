import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, Filter, Plus, CheckCircle2, UserPlus, Mail, Phone, ChevronRight } from "lucide-react";
import { Chip, Sheet, Btn } from "../shared/UI";

export default function TeacherStudents() {
  const [search, setSearch] = useState("");
  const [addSheet, setAddSheet] = useState(false);
  const [step, setStep] = useState<"form" | "confirm" | "done">("form");
  const [form, setForm] = useState({ name: "", parentName: "", phone: "", batch: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [filterBatch, setFilterBatch] = useState("all");

  const stds = [
    { id: '1', name: "Rohan Sharma", batch: "Class 10 Intensive", progress: 85, fee: 'paid', joined: "Jan 2024", email: "rohan@example.com", phone: "+91 98765 43210" },
    { id: '2', name: "Priya Patel", batch: "Class 10 Intensive", progress: 92, fee: 'due', joined: "Feb 2024", email: "priya@example.com", phone: "+91 87654 32109" },
    { id: '3', name: "Arjun Singh", batch: "Class 9 Foundational", progress: 65, fee: 'paid', joined: "Dec 2023", email: "arjun@example.com", phone: "+91 76543 21098" },
    { id: '4', name: "Sanya Gupta", batch: "Class 9 Foundational", progress: 78, fee: 'due', joined: "Mar 2024", email: "sanya@example.com", phone: "+91 65432 10987" },
    { id: '5', name: "Aavhan Ali", batch: "Science Explorer Jr", progress: 95, fee: 'paid', joined: "Apr 2024", email: "aavhan@example.com", phone: "+91 54321 09876" }
  ];

  const batches = ["all", "Class 8 Evening", "Class 9 Weekend", "Class 10 Intensive", "Science Explorer Jr"];

  const filtered = stds.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) || 
                          s.batch.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterBatch === "all" || s.batch === filterBatch;
    return matchesSearch && matchesFilter;
  });

  const handleEnroll = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Student name is required";
    if (form.phone.length !== 10) errs.phone = "Enter a valid 10-digit phone number";
    if (!form.batch) errs.batch = "Please select a batch";
    
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setStep("confirm");
  };

  const handleConfirm = () => {
    setStep("done");
    setTimeout(() => {
      setAddSheet(false);
      setStep("form");
      setForm({ name: "", parentName: "", phone: "", batch: "" });
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950 scrollbar-hide overflow-y-auto premium-texture">
      {/* Premium Header */}
      <div className="px-6 py-8 pb-6 shrink-0 animate-slide-up sticky top-0 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md z-20 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-16 h-[72px] rounded-[24px] bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800/60 flex items-center justify-center text-4xl shadow-sm -rotate-3 transition-transform hover:rotate-2 hover:scale-105 duration-500 hidden md:flex">
              🧑‍🎓
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-stone-50 tracking-tighter font-sans leading-none mb-2">Students</h1>
              <p className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest leading-none drop-shadow-sm">Nurturing {stds.length} active students</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAddSheet(true)}
              aria-label="Add Student" 
              className="w-14 h-14 rounded-full bg-amber-400 dark:bg-amber-500 text-amber-950 flex items-center justify-center cursor-pointer shadow-sm relative group overflow-hidden active:scale-95 transition-all"
            >
              <UserPlus size={24} strokeWidth={2.5} className="group-hover:scale-110 transition-transform relative z-10" />
            </motion.button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="max-w-7xl mx-auto w-full mt-8 flex flex-col md:flex-row gap-4 relative z-10">
          <div className="flex-1 relative group w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-amber-500 transition-colors" size={18} strokeWidth={2.5} />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-stone-900 border border-stone-200/60 dark:border-stone-800/60 rounded-2xl text-sm font-bold text-stone-900 dark:text-stone-50 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 flex-1 items-center">
            {batches.map(b => (
              <button
                key={b}
                onClick={() => setFilterBatch(b)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                  filterBatch === b 
                    ? "bg-amber-100 dark:bg-amber-900/40 text-amber-900 dark:text-amber-400 border-amber-200 dark:border-amber-800 shadow-sm" 
                    : "bg-white dark:bg-stone-900 text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 border-stone-200/60 dark:border-stone-800/60 hover:bg-stone-50 dark:hover:bg-stone-800 hover:border-stone-300 dark:hover:border-stone-700 shadow-sm"
                }`}
              >
                {b === "all" ? "All Batches" : b.charAt(0).toUpperCase() + b.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="flex-1 px-6 pb-24 max-w-7xl mx-auto w-full mt-10">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="flex-1 flex flex-col items-center justify-center text-center py-24 px-6 bg-white dark:bg-stone-900 rounded-[48px] border border-stone-200/60 dark:border-stone-800/60 shadow-sm relative overflow-hidden"
             >
                <div className="absolute inset-0 bg-stone-50/50 dark:bg-stone-950/20 opacity-50 pointer-events-none" />
                <div className="w-24 h-24 bg-stone-50 dark:bg-stone-800 rounded-[32px] flex items-center justify-center mb-8 border border-stone-100 dark:border-stone-700/50 text-stone-400 relative z-10 shadow-inner">
                   <Search size={40} strokeWidth={2.5} />
                </div>
                <h3 className="text-3xl lg:text-4xl font-black text-stone-900 dark:text-stone-50 font-sans tracking-tight mb-4 relative z-10">No students found</h3>
                <p className="text-base text-stone-500 dark:text-stone-400 max-w-md mx-auto font-bold leading-relaxed relative z-10">Try adjusting your search or filters to find what you're looking for.</p>
             </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {filtered.map((s, i) => (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={s.id}
                  className="bg-white dark:bg-stone-900 rounded-[32px] p-8 md:p-10 border border-stone-200/60 dark:border-stone-800/60 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-amber-200 dark:hover:border-amber-900/40 transition-all cursor-pointer group flex flex-col h-full overflow-hidden relative"
                >
                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="w-20 h-20 rounded-[24px] bg-stone-50 dark:bg-stone-800 flex items-center justify-center text-4xl shadow-inner border border-stone-100 dark:border-stone-700/50 group-hover:scale-110 transition-transform duration-500 font-sans font-black text-stone-300 dark:text-stone-600 uppercase">
                      {s.name.charAt(0)}
                    </div>
                    <Chip 
                      label={s.fee === 'due' ? 'Fee Due' : s.fee === 'paid' ? 'Paid' : 'Pending'} 
                      variant={s.fee as any} 
                      small 
                    />
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-3xl font-black text-stone-900 dark:text-stone-50 font-sans leading-none tracking-tight mb-3 group-hover:text-amber-600 transition-colors line-clamp-1">{s.name}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/10 w-max px-2 py-1 rounded-md mb-10 border border-amber-200 dark:border-amber-900/50">{s.batch}</p>
                  </div>

                  <div className="mb-10 relative z-10">
                    <div className="flex items-center justify-between mb-3">
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Growth</span>
                       <span className="text-xs font-black text-stone-900 dark:text-stone-50 font-mono">{s.progress}%</span>
                    </div>
                    <div className="h-2 bg-stone-100 dark:bg-stone-800/80 rounded-full overflow-hidden border border-stone-200/60 dark:border-stone-700/60 shadow-inner">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: `${s.progress}%` }}
                         transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
                         className={`h-full border-r border-white/20 ${s.progress >= 80 ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]' : s.progress >= 60 ? 'bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.5)]'}`} 
                       />
                    </div>
                  </div>

                  <div className="mt-auto space-y-4 text-stone-500 dark:text-stone-400 relative z-10">
                    <div className="flex items-center gap-3 group/link hover:text-amber-600 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-stone-50 dark:bg-stone-800 flex items-center justify-center border border-stone-100 dark:border-stone-700 group-hover/link:border-amber-200 dark:group-hover/link:border-amber-900/40">
                        <Mail size={14} />
                      </div>
                      <span className="text-sm font-bold truncate">{s.email || "No email"}</span>
                    </div>
                    <div className="flex items-center gap-3 group/link hover:text-amber-600 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-stone-50 dark:bg-stone-800 flex items-center justify-center border border-stone-100 dark:border-stone-700 group-hover/link:border-amber-200 dark:group-hover/link:border-amber-900/40">
                        <Phone size={14} />
                      </div>
                      <span className="text-sm font-bold">{s.phone || "No phone"}</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-6 border-t border-stone-200/60 dark:border-stone-800/60 flex items-center justify-between relative z-10">
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 mb-1">Enrolled</span>
                       <span className="text-sm font-black uppercase tracking-widest text-stone-700 dark:text-stone-300">{s.joined || "N/A"}</span>
                    </div>
                    <motion.div 
                      className="w-12 h-12 rounded-[14px] bg-stone-50 dark:bg-stone-800 flex items-center justify-center text-stone-400 group-hover:bg-amber-400 dark:group-hover:bg-amber-500 group-hover:text-amber-950 transition-all shadow-sm border border-stone-100 dark:border-stone-700 group-hover:border-transparent group-hover:translate-x-1"
                    >
                      <ChevronRight size={20} strokeWidth={2.5} />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      <Sheet open={addSheet} onClose={() => { setAddSheet(false); setStep("form"); setErrors({}); setForm({ name: "", parentName: "", phone: "", batch: "" }); }} title={step === "done" ? undefined : "Enroll Student"}>
        {step === "form" && (
          <div className="flex flex-col gap-8 p-2">
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="student-name" className="text-xs font-bold tracking-widest uppercase text-stone-400 px-1">Student Name</label>
                <input 
                  id="student-name"
                  value={form.name} 
                  onChange={(e) => { setForm({ ...form, name: e.target.value }); if (errors.name) setErrors({...errors, name: ""}); }} 
                  placeholder="e.g. Rahul Verma" 
                  className={`w-full px-6 py-4 rounded-2xl border font-sans text-sm focus:outline-none focus:ring-2 focus:border-amber-500 transition-all shadow-sm ${errors.name ? 'border-rose-300 bg-rose-50' : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 focus:ring-amber-500/10'}`}
                />
                {errors.name && <div className="text-rose-500 text-[11px] px-1 font-bold">{errors.name}</div>}
              </div>
              
              <div className="flex flex-col gap-2">
                <label htmlFor="parent-phone" className="text-xs font-bold tracking-widest uppercase text-stone-400 px-1">Parent Phone</label>
                <input 
                  id="parent-phone"
                  value={form.phone} 
                  onChange={(e) => { setForm({ ...form, phone: e.target.value.replace(/\D/g, '') }); if (errors.phone) setErrors({...errors, phone: ""}); }} 
                  placeholder="e.g. 9876543210" 
                  maxLength={10}
                  className={`w-full px-6 py-4 rounded-2xl border font-sans text-sm focus:outline-none focus:ring-2 focus:border-amber-500 transition-all shadow-sm ${errors.phone ? 'border-rose-300 bg-rose-50' : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 focus:ring-amber-500/10'}`}
                />
                {errors.phone && <div className="text-rose-500 text-[11px] px-1 font-bold">{errors.phone}</div>}
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold tracking-widest uppercase text-stone-400 px-1">Assign Batch</label>
                <div className="grid grid-cols-1 gap-2">
                  {batches.filter(b => b !== "all").map((b) => {
                    const sel = form.batch === b;
                    return (
                      <button 
                        key={b} 
                        onClick={() => { setForm({ ...form, batch: b }); if (errors.batch) setErrors({...errors, batch: ""}); }} 
                        className={`px-6 py-4 text-left rounded-2xl text-sm font-bold transition-all border ${
                          sel ? "bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-600/20" : errors.batch ? "border-rose-200 bg-rose-50" : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:border-amber-500"
                        }`}
                      >
                        {b}
                      </button>
                    );
                  })}
                </div>
                {errors.batch && <div className="text-rose-500 text-[11px] px-1 font-bold">{errors.batch}</div>}
              </div>
            </div>

            <Btn 
              label="Review enrollment" 
              full
              onClick={handleEnroll} 
            />
          </div>
        )}
        
        {step === "confirm" && (
          <div className="space-y-8 p-2">
            <div className="bg-stone-50 dark:bg-stone-950 rounded-[32px] border border-stone-200 dark:border-stone-800 p-10 text-center shadow-inner">
              <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-sm">
                <UserPlus size={32} />
              </div>
              <h2 className="text-2xl font-black text-stone-900 dark:text-stone-50 font-sans mb-1 tracking-tight">{form.name}</h2>
              <p className="text-sm font-bold text-stone-400 font-sans mb-6 tracking-wide">+91 {form.phone}</p>
              
              <div className="inline-flex items-center gap-2 bg-white dark:bg-stone-900 px-6 py-2.5 rounded-full border border-stone-200 dark:border-stone-800 text-xs font-black text-amber-600 uppercase tracking-widest">
                {form.batch}
              </div>
            </div>
            <div className="flex gap-4">
              <Btn label="Edit" variant="outline" onClick={() => setStep("form")} />
              <Btn label="Confirm & Enroll" full onClick={handleConfirm} />
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="text-center py-12 px-6">
            <motion.div 
               initial={{ scale: 0 }}
               animate={{ scale: 1 }}
               className="text-emerald-500 mb-8 flex justify-center"
            >
              <CheckCircle2 size={100} strokeWidth={2.5} />
            </motion.div>
            <h2 className="text-3xl font-black text-stone-900 dark:text-stone-50 font-sans tracking-tight mb-3">Enrolled!</h2>
            <p className="text-base font-medium text-stone-500 font-sans leading-relaxed">
              {form.name} is now part of {form.batch}.<br />Magic sync in progress.
            </p>
          </div>
        )}
      </Sheet>

    </div>
  );
}
