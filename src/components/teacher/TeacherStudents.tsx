import { useState } from "react";
import { Search, Filter, Plus, CheckCircle2, UserPlus } from "lucide-react";
import { Chip, Sheet, Btn } from "../shared/UI";

export default function TeacherStudents() {
  const [search, setSearch] = useState("");
  const [addSheet, setAddSheet] = useState(false);
  const [step, setStep] = useState<"form" | "confirm" | "done">("form");
  const [form, setForm] = useState({ name: "", parentName: "", phone: "", batch: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const stds: any[] = [];
  const filtered = stds;

  const batches = ["Class 8 Evening", "Class 9 Weekend", "Class 10 Intensive"];

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
    // In real app, this would append to 'stds' state and trigger backend call
    setTimeout(() => {
      setAddSheet(false);
      setStep("form");
      setForm({ name: "", parentName: "", phone: "", batch: "" });
    }, 1500);
  };

  return (
    <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950">
      <div className="px-6 py-6 pb-4 shrink-0 animate-slide-up sticky top-0 z-10 bg-stone-50 dark:bg-stone-950">
        <div className="flex justify-between items-start mb-5">
           <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans">Students</h1>
           <button 
             aria-label="Add Student"
             onClick={() => setAddSheet(true)} 
             className="w-11 h-11 bg-sky-500 text-white rounded-full flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-500"
           >
             <Plus size={20} />
           </button>
        </div>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 dark:text-stone-400" />
            <input 
              type="text" 
              placeholder="Search students..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl text-sm font-sans text-stone-900 dark:text-stone-50 focus:outline-none focus:ring-2 focus:ring-stone-200 focus:border-stone-400 transition-all shadow-sm"
            />
          </div>
          <button aria-label="Filter" className="w-11 h-11 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-xl flex items-center justify-center text-stone-600 dark:text-stone-300 hover:bg-stone-50 shadow-sm transition-colors shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500">
            <Filter size={18} />
          </button>
        </div>
      </div>
      
      <div className="flex-1 px-6 pb-6 overflow-y-auto scrollbar-hide flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center py-16 px-4 animate-fade-in my-auto">
            <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 text-stone-400 dark:text-stone-500 flex items-center justify-center rounded-full mb-5">
              <UserPlus size={28} />
            </div>
            <h2 className="text-xl font-bold font-display text-stone-900 dark:text-stone-50 tracking-tight mb-2">
              {search ? "No students found" : "Your roster is empty"}
            </h2>
            <p className="text-sm font-medium text-stone-500 dark:text-stone-400 font-sans max-w-[260px] leading-relaxed mb-8">
              {search 
                ? `There is no student matching "${search}". Try adjusting your search query.` 
                : "It looks like you haven't added any students yet. Add your first student to get started."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 w-full max-w-[280px]">
              <button 
                onClick={() => setAddSheet(true)} 
                className="w-full px-5 py-3.5 font-bold text-sm bg-[var(--color-brand-600)] text-white rounded-xl hover:bg-[var(--color-brand-700)] active:scale-[0.98] transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <Plus size={18} />
                Enroll Student
              </button>
              {search && (
                <button 
                  onClick={() => setSearch("")} 
                  className="w-full px-5 py-3.5 font-bold text-sm text-stone-600 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-700 active:scale-[0.98] transition-colors"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        ) : (
          filtered.map((s, i) => (
            <div 
              key={s.id} 
              className="bg-white dark:bg-stone-900 rounded-[20px] p-5 border border-stone-200 dark:border-stone-800 shadow-sm cursor-pointer hover:border-stone-300 hover:shadow-md transition-all animate-slide-up flex gap-4 items-center shrink-0"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="w-12 h-12 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-lg shrink-0">
                {s.name[0]}
              </div>
              <div className="flex-1 min-w-0 pr-2">
                <h3 className="text-[15px] font-bold text-stone-900 dark:text-stone-50 font-sans truncate mb-0.5">{s.name}</h3>
                <p className="text-xs font-medium text-stone-500 dark:text-stone-400 font-sans truncate mb-3">{s.batch}</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${s.progress >= 80 ? 'bg-emerald-500' : s.progress >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                      style={{ width: `${s.progress}%` }} 
                    />
                  </div>
                  <span className="text-[10px] font-bold font-mono text-stone-500 dark:text-stone-400">{s.progress}%</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 shrink-0">
                <Chip 
                  label={s.fee === 'due' ? 'Fee Due' : s.fee === 'paid' ? 'Paid' : 'Pending'} 
                  variant={s.fee as any} 
                  small 
                />
                <span className="text-[10px] font-bold tracking-wider uppercase text-stone-500 dark:text-stone-400">
                  {s.subs} done
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <Sheet open={addSheet} onClose={() => { setAddSheet(false); setStep("form"); setErrors({}); setForm({ name: "", parentName: "", phone: "", batch: "" }); }} title={step === "done" ? undefined : "Enroll Student"}>
        {step === "form" && (
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="student-name" className="block text-[10px] font-bold tracking-widest uppercase text-stone-500 dark:text-stone-400 font-sans mb-1">Student Name</label>
                <input 
                  id="student-name"
                  value={form.name} 
                  onChange={(e) => { setForm({ ...form, name: e.target.value }); if (errors.name) setErrors({...errors, name: ""}); }} 
                  placeholder="e.g. Rahul Verma" 
                  className={`w-full px-4 py-3 rounded-xl border font-sans text-sm outline-none transition-all shadow-sm focus:shadow-md ${errors.name ? 'border-rose-300 bg-rose-50 text-rose-900 focus:border-rose-500' : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-50 focus:border-sky-500 focus:bg-white'}`}
                />
                {errors.name && <div className="text-rose-500 text-[11px] mt-1.5 font-medium">{errors.name}</div>}
              </div>
              
              <div>
                <label htmlFor="parent-phone" className="block text-[10px] font-bold tracking-widest uppercase text-stone-500 dark:text-stone-400 font-sans mb-1">Parent Phone</label>
                <input 
                  id="parent-phone"
                  value={form.phone} 
                  onChange={(e) => { setForm({ ...form, phone: e.target.value.replace(/\D/g, '') }); if (errors.phone) setErrors({...errors, phone: ""}); }} 
                  placeholder="e.g. 9876543210" 
                  maxLength={10}
                  className={`w-full px-4 py-3 rounded-xl border font-sans text-sm outline-none transition-all shadow-sm focus:shadow-md ${errors.phone ? 'border-rose-300 bg-rose-50 text-rose-900 focus:border-rose-500' : 'border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-50 focus:border-sky-500 focus:bg-white'}`}
                />
                {errors.phone && <div className="text-rose-500 text-[11px] mt-1.5 font-medium">{errors.phone}</div>}
              </div>

              <div>
                <label id="assign-batch-label" className="block text-[10px] font-bold tracking-widest uppercase text-stone-500 dark:text-stone-400 font-sans mb-1">Assign Batch</label>
                <div role="radiogroup" aria-labelledby="assign-batch-label" className="flex flex-col gap-2">
                  {batches.map((b) => {
                    const sel = form.batch === b;
                    return (
                      <button 
                        key={b} 
                        role="radio"
                        aria-checked={sel}
                        onClick={() => { setForm({ ...form, batch: b }); if (errors.batch) setErrors({...errors, batch: ""}); }} 
                        className={`px-4 py-3 text-left rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer font-sans border ${
                          sel ? "bg-stone-900 border-stone-900 text-white shadow-sm" : errors.batch ? "border-rose-200 bg-rose-50" : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50"
                        }`}
                      >
                        {b}
                      </button>
                    );
                  })}
                </div>
                {errors.batch && <div className="text-rose-500 text-[11px] mt-1.5 font-medium">{errors.batch}</div>}
              </div>
            </div>

            <Btn 
              label="Review Enrollment" 
              variant="primary"
              full 
              onClick={handleEnroll} 
            />
          </div>
        )}
        
        {step === "confirm" && (
          <div className="space-y-6">
            <div className="bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 text-center">
              <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserPlus size={24} />
              </div>
              <div className="text-xl font-bold text-stone-900 dark:text-stone-50 font-sans mb-1">{form.name}</div>
              <div className="text-sm font-medium text-stone-500 dark:text-stone-400 font-sans mb-4">+91 {form.phone}</div>
              
              <div className="inline-flex items-center gap-2 bg-white dark:bg-stone-900 px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-800 text-xs font-semibold text-stone-700 dark:text-stone-200">
                📚 {form.batch}
              </div>
            </div>
            <div className="flex gap-3">
              <Btn label="Edit" variant="outline" full onClick={() => setStep("form")} />
              <Btn label="Confirm & Enroll" variant="primary" full onClick={handleConfirm} />
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="text-center py-8">
            <div className="text-emerald-500 mb-4 flex justify-center animate-slide-up">
              <CheckCircle2 size={64} strokeWidth={2.5} />
            </div>
            <div className="text-2xl font-bold text-stone-900 dark:text-stone-50 font-sans tracking-tight mb-2">Student Enrolled!</div>
            <div className="text-sm font-medium text-stone-500 dark:text-stone-400 font-sans leading-relaxed">
              {form.name} has been added to {form.batch}.<br />An SMS has been sent to the parent.
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
