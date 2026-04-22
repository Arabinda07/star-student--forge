import { useState, useEffect, useRef, ChangeEvent, MouseEvent, ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SUBJECTS } from "../../constants";
import { ChevronRight, Plus, Trash2, Upload, FileText, CheckCircle2, Search, Filter, Sparkles, Clock, AlertCircle, CheckCircle, Pin } from "lucide-react";
import { supabase } from "../../supabaseClient";
import { Sheet, Btn, SectionLabel, Chip, EmptySlate } from "../shared/UI";

export default function StudentMyWork() {
  const [tab, setTab] = useState("upcoming");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selTask, setSelTask] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const tabConfig: Record<string, { label: string; icon: ReactNode; color: string }> = {
    upcoming: { label: "Active", icon: <Clock size={14} />, color: "#3b82f6" },
    overdue: { label: "Overdue", icon: <AlertCircle size={14} />, color: "#ef4444" },
    submitted: { label: "Pending", icon: <CheckCircle size={14} />, color: "#10b981" },
    graded: { label: "Archived", icon: <Sparkles size={14} />, color: "#8b5cf6" }
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
    } catch (err) {
      console.error(err);
      alert("Submission failed. Please try again.");
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
      <div className="absolute left-10 top-0 bottom-0 w-px bg-stone-200 dark:bg-stone-800" />
      {/* Dynamic Header Section */}
      <div className="px-6 py-8 pb-6 shrink-0 animate-slide-up sticky top-0 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md z-20 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-end mb-8 relative z-10">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-stone-50 tracking-tighter font-sans mb-2">Canvas Index</h1>
              <p className="text-xs font-black text-stone-400 dark:text-stone-500 uppercase tracking-widest leading-none">
                 Curating <span className="text-stone-900 dark:text-stone-50 drop-shadow-sm">{items.length}</span> Assignments & Personal Goals
              </p>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              onClick={createTask}
              className="w-14 h-14 rounded-full bg-stone-900 dark:bg-stone-100 flex items-center justify-center shadow-xl shadow-stone-900/10 dark:shadow-none"
            >
              <Plus size={28} className="text-white dark:text-stone-900" />
            </motion.button>
          </div>
          
          <div className="flex gap-2 p-1.5 bg-white dark:bg-stone-900 rounded-[28px] border border-stone-200/60 dark:border-stone-800/60 shadow-sm overflow-x-auto scrollbar-hide relative z-10">
            {Object.entries(tabConfig).map(([key, config]) => {
              const isActive = tab === key;
              const count = items.filter(item => item.status === key).length;
              return (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex-1 min-w-[100px] py-3.5 rounded-[22px] font-black text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2.5 relative overflow-hidden group ${
                    isActive 
                      ? "text-stone-900 dark:text-stone-50" 
                      : "text-stone-400 hover:text-stone-600 dark:hover:text-stone-300"
                  }`}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="active-task-tab"
                      className="absolute inset-0 bg-stone-50 dark:bg-stone-800/50 shadow-inner z-0"
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <span className={`transition-transform duration-500 ${isActive ? 'scale-110' : 'group-hover:scale-110 shadow-none'}`} style={{ color: isActive ? config.color : undefined }}>
                      {config.icon}
                    </span>
                    {config.label}
                    <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[9px] ${isActive ? 'bg-white dark:bg-stone-700 shadow-sm' : 'bg-stone-50 dark:bg-stone-800'}`}>
                      {count}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 animate-spin rounded-full border-4 border-stone-200 border-t-amber-500" />
            <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-stone-400">Syncing database state...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {displayItems.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="col-span-full border-2 border-dashed border-stone-100 dark:border-stone-800 rounded-[48px] p-24 text-center bg-white/50 dark:bg-stone-900/30 backdrop-blur-sm"
                >
                   <EmptySlate 
                      icon="🌟" 
                      title={`${tabConfig[tab].label} Queue Empty`} 
                      sub={
                        tab === 'upcoming' ? "Total focus achieved. You've completely cleared your active mission log." :
                        tab === 'overdue' ? "System in harmony. No delinquent submissions detected on any frequency." :
                        tab === 'submitted' ? "Nothing in the pending buffer. All submitted artifacts have been processed." :
                        "The archive vault is ready to store your next high-grade result."
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
                      className="group bg-white dark:bg-stone-900 p-8 rounded-[32px] border border-stone-200/60 dark:border-stone-800/60 shadow-sm hover:shadow-xl hover:border-amber-200 dark:hover:border-amber-900/40 transition-all cursor-pointer flex flex-col relative overflow-hidden h-full hover:-translate-y-1"
                      transition={{ delay: i * 0.03 }}
                    >
                       <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className={`w-14 h-16 rounded-[20px] shrink-0 flex items-center justify-center text-2xl shadow-inner border border-white/20 dark:border-black/20 ${
                          isDone ? "bg-stone-100 dark:bg-stone-800 text-stone-400 grayscale" : sc.bg
                        }`}>
                          {isDone ? <CheckCircle2 size={24} /> : sc.icon}
                        </div>
                        <div className="flex gap-2">
                           <button 
                            onClick={(e) => deleteTask(item.id, e)}
                            className="bg-white dark:bg-stone-800 w-10 h-10 rounded-[14px] flex items-center justify-center text-stone-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-stone-100 dark:border-stone-700 active:scale-95"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="flex-1 relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[10px] font-black uppercase tracking-widest text-stone-400 dark:text-stone-500 bg-stone-100 dark:bg-stone-800 px-2 py-1 rounded-md">{item.type}</span>
                          {tab === 'overdue' && (
                             <span className="text-[10px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-1 rounded-md border border-rose-200 dark:border-rose-900/50">CRITICAL TIME</span>
                          )}
                           <span className="text-[10px] font-black text-stone-300 dark:text-stone-600 uppercase tracking-widest pl-2 border-l border-stone-200 dark:border-stone-800">{item.due || "No deadline"}</span>
                        </div>
                        <h3 className={`text-2xl font-black font-sans leading-tight tracking-tight mb-4 group-hover:text-amber-600 transition-colors ${isDone ? "text-stone-300 dark:text-stone-600 line-through decoration-stone-200 dark:decoration-stone-700" : "text-stone-900 dark:text-stone-50"}`}>
                          {item.title}
                        </h3>
                      </div>

                      <div className="mt-8 pt-6 border-t border-stone-100 dark:border-stone-800/50 flex justify-between items-center shrink-0 relative z-10">
                         <div className="text-[10px] font-black uppercase tracking-[0.2em]" style={{ color: isDone ? '#d6d3d1' : sc.fg }}>
                           {item.subject}
                         </div>
                         {tab === "graded" && item.fb && (
                            <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-200 dark:border-emerald-900/50">
                               <Sparkles size={12} />
                               <span className="text-[10px] font-black uppercase tracking-widest">A+</span>
                            </div>
                         )}
                         {!isDone && <ChevronRight size={18} className="text-stone-300 dark:text-stone-600 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />}
                      </div>

                      {/* Accent highlight */}
                      {!isDone && (
                        <div className="absolute top-0 bottom-0 left-0 w-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: sc.fg }} />
                      )}
                    </motion.div>
                  );
                })
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      <Sheet open={!!selTask} onClose={() => setSelTask(null)} title="Assignment Analysis">
         {selTask && (
           <div className="space-y-12 py-6 px-1 max-w-4xl mx-auto">
              <div className="flex flex-col sm:flex-row items-start gap-8">
                <div className={`w-32 h-40 rounded-[32px] shrink-0 flex items-center justify-center text-6xl shadow-inner border border-white/20 dark:border-black/20 ${SUBJECTS[selTask.subject]?.bg || 'bg-stone-50'}`}>
                   {isDone ? <div className="text-emerald-500 scale-125"><CheckCircle2 size={48} /></div> : (SUBJECTS[selTask.subject]?.icon || '📚')}
                </div>
                <div className="flex-1 pt-4">
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="text-[10px] font-black tracking-widest uppercase px-4 py-2 rounded-xl border border-stone-200/60 dark:border-stone-700/60 text-stone-600 dark:text-stone-300 bg-stone-100/50 dark:bg-stone-800/50 shadow-sm">
                      {selTask.type}
                    </span>
                    <span className="text-[10px] bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 px-4 py-2 rounded-xl font-black uppercase tracking-widest shadow-sm">
                       {selTask.subject}
                    </span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-stone-50 tracking-tighter leading-tight mb-6">{selTask.title}</h2>
                  <div className="flex items-center gap-2 text-xs font-black text-stone-400 uppercase tracking-widest bg-stone-50 md:bg-white dark:bg-stone-900/50 border border-stone-200/60 dark:border-stone-800/60 p-4 rounded-2xl w-max shadow-sm">
                     <Clock size={14} className="text-stone-500" /> Deadline: <span className="text-stone-700 dark:text-stone-300 ml-1">{selTask.due || "Infinite Context"}</span>
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-stone-200 dark:via-stone-800 to-transparent my-12" />

              <div className="space-y-8">
                <div className="text-[10px] font-black tracking-[0.25em] uppercase text-stone-400 dark:text-stone-500 font-sans ml-2">Submission Protocol</div>
                {selTask.status === 'upcoming' || selTask.status === 'overdue' ? (
                  <div className="grid gap-6">
                    <motion.div 
                      whileHover={{ scale: 1.01, borderColor: '#fbbf24' }}
                      whileTap={{ scale: 0.98 }}
                      className="p-16 border-2 border-dashed border-stone-200/80 dark:border-stone-800/80 rounded-[48px] flex flex-col items-center justify-center text-center bg-stone-50/50 dark:bg-stone-900/30 cursor-pointer transition-all shadow-sm hover:shadow-2xl group relative overflow-hidden"
                      onClick={() => fileRef.current?.click()}
                    >
                      <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent dark:from-white/5 opacity-50 pointer-events-none" />
                      <div className="w-24 h-24 bg-white dark:bg-stone-800 rounded-[32px] flex items-center justify-center mb-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-stone-100 dark:border-stone-700 group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500 relative z-10">
                        {isUploading ? (
                          <div className="w-12 h-12 border-4 border-stone-100 border-t-amber-500 animate-spin rounded-full" />
                        ) : (
                          <Upload size={40} strokeWidth={2.5} className="text-stone-300 dark:text-stone-500 group-hover:text-amber-500 transition-colors" />
                        )}
                      </div>
                      <div className="text-2xl font-black text-stone-900 dark:text-stone-50 mb-3 tracking-tight relative z-10">Upload Submission File</div>
                      <p className="text-sm font-bold text-stone-500 dark:text-stone-400 max-w-[260px] leading-relaxed relative z-10">Drag or tap to select academic artifacts for transmission.</p>
                      <input type="file" className="hidden" ref={fileRef} onChange={handleUpload} />
                    </motion.div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                      <Btn label="Request Insight" variant="outline" full />
                      <Btn label="Transcribe Ready" variant="primary" full icon={<CheckCircle2 size={16} />} onClick={() => updateTaskStatus(selTask.id, 'submitted')} />
                    </div>
                  </div>
                ) : (
                  <div className="p-12 bg-emerald-50/80 dark:bg-emerald-900/20 border-2 border-emerald-200/60 dark:border-emerald-500/20 rounded-[48px] flex flex-col items-center gap-6 text-center shadow-inner relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                      <CheckCircle2 size={160} className="text-emerald-500" />
                    </div>
                    <div className="w-28 h-28 bg-emerald-500 text-white rounded-[32px] flex items-center justify-center shadow-2xl shadow-emerald-500/30 -rotate-3 border-4 border-white dark:border-stone-900 relative z-10">
                      <CheckCircle2 size={56} strokeWidth={3} />
                    </div>
                    <div className="relative z-10 mt-2">
                      <h4 className="text-3xl font-black text-emerald-900 dark:text-emerald-100 tracking-tight mb-3">Assignment Finalized</h4>
                      <p className="inline-block bg-white/60 dark:bg-black/20 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-[16px] text-[10px] font-black uppercase tracking-[0.2em] shadow-sm border border-emerald-200/40 dark:border-emerald-800/40">
                        {selTask.submitted_at ? `LOGGED: ${new Date(selTask.submitted_at).toLocaleDateString()}` : 'LOGGED IN REAL-TIME'}
                      </p>
                    </div>
                    <div className="mt-8 flex gap-4 w-full max-w-sm relative z-10">
                       <button className="flex-1 py-5 px-6 bg-white dark:bg-stone-900 border-2 border-emerald-100 dark:border-emerald-900/60 rounded-[24px] text-[10px] font-black uppercase tracking-widest text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/40 hover:-translate-y-1 transition-all shadow-sm">
                          Preview Artifact
                       </button>
                    </div>
                  </div>
                )}
              </div>

              {selTask.fb && (
                <div className="space-y-8 mt-12 pt-12 border-t border-stone-200/50 dark:border-stone-800/50">
                  <div className="text-[10px] font-black tracking-[0.25em] uppercase text-stone-400 dark:text-stone-500 font-sans ml-2">Academic Feedback</div>
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-10 md:p-12 bg-amber-50 dark:bg-amber-900/10 border-2 border-amber-200/60 dark:border-amber-900/30 rounded-[40px] relative overflow-hidden shadow-inner group"
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110 blur-[1px]">
                       <Sparkles size={160} className="text-amber-500" />
                    </div>
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-amber-300 to-amber-500" />
                    <div className="text-[10px] font-black text-amber-600 dark:text-amber-500 uppercase tracking-[0.2em] mb-6 flex items-center gap-2 bg-amber-100/50 dark:bg-amber-900/20 w-max px-3 py-1.5 rounded-lg border border-amber-200/50 dark:border-amber-800/50">
                       <Pin size={12} className="rotate-45" /> Curated Observations
                    </div>
                    <p className="text-2xl text-stone-900 dark:text-stone-100 font-black leading-relaxed tracking-tight relative z-10 pl-2">"{selTask.fb}"</p>
                  </motion.div>
                </div>
              )}
           </div>
         )}
      </Sheet>
    </div>
  );
}

