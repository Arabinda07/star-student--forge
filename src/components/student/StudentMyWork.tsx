import { useState, useEffect, useRef, ChangeEvent, MouseEvent, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SUBJECTS } from "../../constants";
import { 
  CaretRight, 
  Plus, 
  Trash, 
  UploadSimple, 
  FileText, 
  CheckCircle, 
  MagnifyingGlass, 
  Faders, 
  Sparkle, 
  Clock, 
  WarningCircle, 
  PushPin 
} from "@phosphor-icons/react";
import { supabase } from "../../supabaseClient";
import { Sheet, Btn, SectionLabel, Chip, EmptySlate } from "../shared/UI";

export default function StudentMyWork() {
  const [tab, setTab] = useState("upcoming");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selTask, setSelTask] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const tabConfig: Record<string, { label: string; icon: ReactNode; color: string }> = {
    upcoming: { label: "Active", icon: <Clock size={16} weight="duotone" />, color: "#3b82f6" },
    overdue: { label: "Overdue", icon: <WarningCircle size={16} weight="duotone" />, color: "#ef4444" },
    submitted: { label: "Pending", icon: <CheckCircle size={16} weight="duotone" />, color: "#10b981" },
    graded: { label: "Archived", icon: <Sparkle size={16} weight="duotone" />, color: "#8b5cf6" }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setItems(data);
    }
    setLoading(false);
  };

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selTask) return;

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/submissions/${selTask.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('app-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: updateError } = await supabase
        .from('tasks')
        .update({ 
          status: 'submitted',
          submission_url: filePath,
          submitted_at: new Date().toISOString()
        })
        .eq('id', selTask.id);

      if (updateError) throw updateError;

      setItems(items.map(t => t.id === selTask.id ? { ...t, status: 'submitted', submission_url: filePath, submitted_at: new Date().toISOString() } : t));
      setSelTask(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong with your submission.");
    } finally {
      setIsUploading(false);
    }
  };

  const createTask = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const newTask = {
      user_id: user.id,
      subject: "Maths",
      title: "Self Assigned Prep",
      due: "In 2 days",
      type: "Practice",
      status: "upcoming"
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert([newTask])
      .select();

    if (!error && data) {
      setItems([data[0], ...items]);
    }
  };

  const deleteTask = async (id: string, e: MouseEvent) => {
    e.stopPropagation();
    const taskToDelete = items.find(t => t.id === id);
    
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (!error) {
      setItems(items.filter(t => t.id !== id));
      if (taskToDelete?.submission_url) {
        await supabase.storage.from('app-files').remove([taskToDelete.submission_url]);
      }
    }
  };

  const updateTaskStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setItems(items.map(t => t.id === id ? { ...t, status: newStatus } : t));
      setSelTask(null);
    }
  };

  const displayItems = items.filter(item => item.status === tab);
  const isDone = tab === "submitted" || tab === "graded";

  return (
    <div className="h-full flex flex-col bg-stone-50 md:bg-white dark:bg-stone-950 md:dark:bg-stone-900 scrollbar-hide overflow-y-auto premium-texture relative">
      {/* Dynamic Header Section */}
      <div className="px-6 py-8 md:py-12 pb-6 shrink-0 animate-slide-up sticky top-0 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md z-20 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-end mb-10 relative z-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-stone-50 tracking-tighter font-display mb-2 uppercase italic leading-none">My Work</h1>
              <p className="text-[10px] font-black text-stone-400 dark:text-stone-500 uppercase tracking-[0.3em] leading-none italic">
                 <span className="text-brand-600 dark:text-brand-400 drop-shadow-sm font-black">{items.length}</span> tasks total
              </p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              onClick={createTask}
              className="w-16 h-16 rounded-full bg-stone-900 dark:bg-stone-100 flex items-center justify-center shadow-2xl shadow-stone-900/20 dark:shadow-none border-none cursor-pointer"
            >
              <Plus size={28} weight="bold" className="text-white dark:text-stone-900" />
            </motion.button>
          </div>
          
          <div className="flex gap-2 p-2 bg-white dark:bg-stone-900 rounded-[32px] border border-stone-100 dark:border-stone-800 shadow-sm overflow-x-auto scrollbar-hide relative z-10">
            {Object.entries(tabConfig).map(([key, config]) => {
              const isActive = tab === key;
              const count = items.filter(item => item.status === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex-1 min-w-[110px] py-4 rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 relative overflow-hidden group border-none cursor-pointer ${
                    isActive 
                      ? "text-stone-900 dark:text-stone-50" 
                      : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="active-task-tab"
                      className="absolute inset-0 bg-stone-50 dark:bg-stone-800/80 shadow-inner z-0"
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <span className={`transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110 shadow-none'}`} style={{ color: isActive ? config.color : undefined }}>
                      {config.icon}
                    </span>
                    <span className="font-black italic">{config.label}</span>
                    <span className={`ml-1 px-2 py-0.5 rounded-lg text-[9px] font-black ${isActive ? 'bg-white dark:bg-stone-700 shadow-sm text-brand-600' : 'bg-stone-50 dark:bg-stone-800'}`}>
                      {count}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 animate-spin rounded-full border-4 border-stone-100 border-t-brand-500" />
            <p className="mt-6 text-[10px] font-black uppercase tracking-widest text-stone-400 font-sans">Loading your tasks...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {displayItems.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="col-span-full border border-stone-100 dark:border-stone-800 rounded-[56px] p-24 text-center bg-white/50 dark:bg-stone-900/30 backdrop-blur-sm"
                >
                   <EmptySlate 
                      icon="🌟" 
                      title={tabConfig[tab].label === 'Active' ? "You're all caught up" : `${tabConfig[tab].label} is empty`} 
                      sub={
                        tab === 'upcoming' ? "You've finished all your current tasks. Time for a break." :
                        tab === 'overdue' ? "No late assignments found. Great job staying on track." :
                        tab === 'submitted' ? "All your submitted work is currently being reviewed." :
                        "Your completed work history will appear here once graded."
                      }
                   />
                </motion.div>
              ) : (
                displayItems.map((item, i) => {
                  const sc = SUBJECTS[item.subject] || SUBJECTS.Physics;
                  return (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      key={item.id}
                      onClick={() => setSelTask(item)}
                      className="group bg-white dark:bg-stone-900 p-10 rounded-[40px] border border-stone-100 dark:border-stone-800 shadow-sm hover:shadow-2xl hover:border-brand-500/20 transition-all cursor-pointer flex flex-col relative overflow-hidden h-full hover:-translate-y-1"
                      transition={{ delay: i * 0.03 }}
                    >
                       <div className="flex justify-between items-start mb-10 relative z-10">
                        <div className={`w-14 h-18 rounded-[24px] shrink-0 flex items-center justify-center text-3xl shadow-inner border border-white/20 dark:border-black/20 ${
                          isDone ? "bg-stone-50 dark:bg-stone-800 text-stone-300 grayscale" : sc.bg
                        }`}>
                          {isDone ? <CheckCircle size={32} weight="duotone" /> : sc.icon}
                        </div>
                        <div className="flex gap-2">
                           <button 
                            onClick={(e) => deleteTask(item.id, e)}
                            className="bg-white dark:bg-stone-800 w-12 h-12 rounded-[18px] flex items-center justify-center text-stone-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-stone-100 dark:border-stone-800 active:scale-95 cursor-pointer"
                          >
                            <Trash size={20} weight="duotone" />
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 relative z-10">
                        <div className="flex flex-wrap items-center gap-3 mb-4">
                          <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 bg-stone-50 dark:bg-stone-800 px-3 py-1.5 rounded-xl border border-stone-100 dark:border-stone-700">{item.type}</span>
                          {tab === 'overdue' && (
                           <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-3 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900/50 italic">Overdue</span>
                          )}
                           <span className="text-[10px] font-black text-stone-300 dark:text-stone-600 uppercase tracking-widest pl-3 border-l border-stone-100 dark:border-stone-800 italic underline decoration-brand-500/30 underline-offset-4">{item.due || "No deadline"}</span>
                        </div>
                        <h3 className={`text-3xl font-black font-display leading-[0.9] tracking-tighter mb-6 group-hover:text-brand-600 transition-colors uppercase italic ${isDone ? "text-stone-200 dark:text-stone-700 line-through decoration-stone-200 dark:decoration-stone-700" : "text-stone-900 dark:text-stone-50"}`}>
                          {item.title}
                        </h3>
                      </div>

                      <div className="mt-10 pt-8 border-t border-stone-50 dark:border-stone-800/50 flex justify-between items-center shrink-0 relative z-10 italic">
                         <div className="text-[10px] font-black uppercase tracking-[0.25em]" style={{ color: isDone ? '#d6d3d1' : sc.fg }}>
                           {item.subject}
                         </div>
                         {tab === "graded" && item.fb && (
                            <div className="flex items-center gap-1.5 text-brand-600 bg-brand-50 dark:bg-brand-500/10 px-3 py-1.5 rounded-xl border border-brand-200 dark:border-brand-900/50 shadow-sm">
                               <Sparkle size={14} weight="fill" />
                               <span className="text-[10px] font-black uppercase tracking-widest font-display">Archived A+</span>
                            </div>
                         )}
                         {!isDone && <CaretRight size={22} weight="bold" className="text-stone-200 dark:text-stone-700 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />}
                      </div>

                      {/* Accent highlight */}
                      {!isDone && (

                      )}
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Sheet open={!!selTask} onClose={() => { setSelTask(null); setError(null); }} title="Task details">
         {selTask && (
           <div className="space-y-16 py-8 px-1 max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-start gap-10">
                <div className={`w-40 h-48 rounded-[48px] shrink-0 flex items-center justify-center text-7xl shadow-inner border border-white/20 dark:border-black/20 ${SUBJECTS[selTask.subject]?.bg || 'bg-stone-50'}`}>
                   {isDone ? <div className="text-emerald-500 scale-125"><CheckCircle size={64} weight="duotone" /></div> : (SUBJECTS[selTask.subject]?.icon || '📚')}
                </div>
                <div className="flex-1 pt-6">
                  <div className="flex flex-wrap items-center gap-4 mb-8">
                    <span className="text-[10px] font-black tracking-[0.2em] uppercase px-5 py-2.5 rounded-2xl border border-stone-100 dark:border-stone-800 text-stone-500 dark:text-stone-400 bg-white dark:bg-stone-900 shadow-sm italic font-sans">
                      {selTask.type}
                    </span>
                    <span className="text-[10px] bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-5 py-2.5 rounded-2xl font-black uppercase tracking-[0.25em] shadow-xl italic">
                       {selTask.subject}
                    </span>
                  </div>
                  <h2 className="text-5xl md:text-6xl font-black text-stone-900 dark:text-stone-50 tracking-tighter leading-[0.85] mb-8 uppercase italic font-display">{selTask.title}</h2>
                  <div className="flex items-center gap-3 text-[11px] font-black text-stone-400 uppercase tracking-[0.2em] bg-stone-50 dark:bg-stone-950 border border-stone-100 dark:border-stone-800 p-5 rounded-[24px] w-max shadow-inner italic">
                     <Clock size={16} weight="duotone" className="text-brand-600" /> Due: <span className="text-stone-900 dark:text-stone-100 ml-1">{selTask.due || "No deadline"}</span>
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-stone-100 dark:via-stone-800 to-transparent my-16" />

              <div className="space-y-10">
                <div className="text-[11px] font-black tracking-[0.4em] uppercase text-stone-400 dark:text-stone-600 font-sans ml-4 border-l-4 border-stone-200 dark:border-stone-800 pl-4">Submit your work</div>
                
                {error && (
                  <div className="mx-4 p-5 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-900/30 rounded-2xl flex items-center gap-4 animate-slide-up">
                    <WarningCircle size={20} className="text-rose-500 shrink-0" weight="fill" />
                    <p className="text-xs font-bold text-rose-800 dark:text-rose-200">{error}</p>
                  </div>
                )}

                {selTask.status === 'upcoming' || selTask.status === 'overdue' ? (
                  <div className="grid gap-8">
                    <motion.div 
                      whileHover={{ scale: 1.01, borderColor: '#3b82f6' }}
                      whileTap={{ scale: 0.98 }}
                      className="p-20 border-2 border-dashed border-stone-100 dark:border-stone-800 rounded-[64px] flex flex-col items-center justify-center text-center bg-white dark:bg-stone-900/30 cursor-pointer transition-all shadow-sm hover:shadow-2xl group relative overflow-hidden"
                      onClick={() => fileRef.current?.click()}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-stone-50/50 to-transparent dark:from-white/5 opacity-50 pointer-events-none" />
                      <div className="w-28 h-28 bg-white dark:bg-stone-800 rounded-[40px] flex items-center justify-center mb-10 shadow-2xl border border-stone-50 dark:border-stone-700 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 relative z-10">
                        {isUploading ? (
                          <div className="w-12 h-12 border-4 border-stone-100 border-t-brand-500 animate-spin rounded-full" />
                        ) : (
                          <UploadSimple size={48} weight="bold" className="text-stone-300 dark:text-stone-500 group-hover:text-brand-600 transition-colors" />
                        )}
                      </div>
                       <div className="text-3xl font-black text-stone-900 dark:text-stone-50 mb-4 tracking-tighter uppercase italic leading-none relative z-10 font-display">Upload your file</div>
                       <p className="text-xs font-black text-stone-400 dark:text-stone-500 max-w-[300px] leading-relaxed relative z-10 uppercase tracking-widest italic opacity-60">Drag and drop, or click to choose a file from your device.</p>
                      <input type="file" className="hidden" ref={fileRef} onChange={handleUpload} />
                    </motion.div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-4">
                      <Btn label="Ask for help" variant="outline" full className="h-16 rounded-[24px] uppercase tracking-[0.2em] italic font-black" />
                       <Btn label="Mark as done" variant="primary" full className="h-16 rounded-[24px] uppercase tracking-[0.2em] italic font-black shadow-2xl" icon={<CheckCircle size={20} weight="bold" />} onClick={() => updateTaskStatus(selTask.id, 'submitted')} />
                    </div>
                  </div>
                ) : (
                  <div className="p-16 bg-emerald-50/40 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-[64px] flex flex-col items-center gap-10 text-center shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                      <CheckCircle size={240} weight="duotone" className="text-emerald-500" />
                    </div>
                    <div className="w-32 h-32 bg-emerald-500 text-white rounded-[40px] flex items-center justify-center shadow-2xl shadow-emerald-500/40 -rotate-3 border-4 border-white dark:border-stone-900 relative z-10">
                      <CheckCircle size={72} weight="bold" />
                    </div>
                    <div className="relative z-10 mt-2">
                      <h4 className="text-4xl font-black text-emerald-900 dark:text-emerald-100 tracking-tighter mb-4 uppercase italic font-display leading-none">Submitted</h4>
                       <p className="inline-block bg-white dark:bg-black/20 text-emerald-700 dark:text-emerald-400 px-6 py-3 rounded-[20px] text-[10px] font-black uppercase tracking-[0.3em] shadow-sm border border-emerald-100 dark:border-emerald-900/50 italic">
                         {selTask.submitted_at ? `Submitted on ${new Date(selTask.submitted_at).toLocaleDateString()}` : 'Submitted'}
                       </p>
                    </div>
                    <div className="mt-10 flex gap-6 w-full max-w-sm relative z-10">
                        <button className="flex-1 py-6 px-8 bg-white dark:bg-stone-900 border border-emerald-100 dark:border-emerald-900/40 rounded-[28px] text-[10px] font-black uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950 hover:-translate-y-1 transition-all shadow-sm cursor-pointer italic font-sans">
                           View submission
                        </button>
                    </div>
                  </div>
                )}
              </div>

              {selTask.fb && (
                <div className="space-y-10 mt-16 pt-16 border-t border-stone-100 dark:border-stone-800/50">
                  <div className="text-[11px] font-black tracking-[0.4em] uppercase text-stone-400 dark:text-stone-600 font-sans ml-4 italic px-4 border-l-4 border-brand-500">Teacher feedback</div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-14 md:p-16 bg-brand-50 dark:bg-brand-900/10 border border-brand-100 dark:border-brand-900/30 rounded-[56px] relative overflow-hidden shadow-inner group"
                  >
                    <div className="absolute top-0 right-0 p-12 opacity-10 pointer-events-none transition-transform duration-1000 group-hover:rotate-12 group-hover:scale-125 blur-[1px]">
                       <Sparkle size={200} weight="fill" className="text-brand-500" />
                    </div>
                    <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-b from-brand-300 to-brand-600" />
                     <div className="text-[11px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-[0.3em] mb-10 flex items-center gap-3 bg-white dark:bg-stone-950 w-max px-5 py-2.5 rounded-2xl border border-brand-100 dark:border-brand-900 shadow-sm italic">
                        <PushPin size={16} weight="duotone" className="text-brand-500 rotate-45" /> Feedback
                     </div>
                    <p className="text-3xl md:text-4xl text-stone-900 dark:text-stone-50 font-black leading-[1.1] tracking-tighter relative z-10 pl-2 uppercase italic font-display">"{selTask.fb}"</p>
                  </motion.div>
                </div>
              )}
           </div>
         )}
      </Sheet>
    </div>
  );
}


