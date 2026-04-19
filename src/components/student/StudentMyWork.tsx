import { useState, useEffect, useRef, ChangeEvent, MouseEvent } from "react";
import { SUBJECTS } from "../../constants";
import { ChevronRight, Plus, Trash2, Upload, FileText, CheckCircle2 } from "lucide-react";
import { supabase } from "../../supabaseClient";
import { Sheet, Btn } from "../shared/UI";

export default function StudentMyWork() {
  const [tab, setTab] = useState("upcoming");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selTask, setSelTask] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const tabConfig: Record<string, string> = {
    upcoming: "Upcoming",
    overdue: "Overdue",
    submitted: "Submitted",
    graded: "Graded"
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

      const { data: publicUrlData } = await supabase.storage
        .from('app-files')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('tasks')
        .update({ 
          status: 'submitted',
          submission_url: filePath,
          submitted_at: new Date().toISOString()
        })
        .eq('id', selTask.id);

      if (updateError) throw updateError;

      setItems(items.map(t => t.id === selTask.id ? { ...t, status: 'submitted', submission_url: filePath } : t));
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
      // Cleanup storage if needed
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
    <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950">
      <div className="px-6 py-6 pb-0 shrink-0 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans">My Work</h1>
          <button 
            onClick={createTask}
            className="w-10 h-10 rounded-full bg-stone-200 dark:bg-stone-800 flex items-center justify-center hover:bg-stone-300 dark:hover:bg-stone-700 transition-colors"
          >
            <Plus size={20} className="text-stone-700 dark:text-stone-300" />
          </button>
        </div>
        
        <div className="flex overflow-x-auto scrollbar-hide border-b border-stone-200 dark:border-stone-800">
          {Object.entries(tabConfig).map(([key, label]) => {
            const isActive = tab === key;
            const count = items.filter(t => t.status === key).length;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
                className={`flex-none px-4 pb-3 border-b-2 font-sans text-sm transition-colors duration-200 flex items-center gap-2 whitespace-nowrap ${
                  isActive 
                    ? "border-emerald-600 text-emerald-700 font-semibold" 
                    : "border-transparent text-stone-500 dark:text-stone-400 font-medium hover:text-stone-700"
                }`}
              >
                {label}
                <span 
                  className={`text-[10px] font-bold rounded-full px-2 py-0.5 ${
                    isActive ? "bg-emerald-100 text-emerald-700" : "bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-6 h-6 animate-spin rounded-full border-2 border-stone-300 border-t-emerald-500" />
          </div>
        ) : (
          <div className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm overflow-hidden">
            {displayItems.length === 0 && (
               <div className="text-center py-12 px-4 shadow-sm relative overflow-hidden bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl m-4">
                  <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl opacity-60">✨</span>
                  </div>
                  <h3 className="text-sm font-bold text-stone-900 dark:text-stone-50 font-sans mb-1">
                    No {tabConfig[tab].toLowerCase()} tasks
                  </h3>
                  <p className="text-xs text-stone-500 font-sans">
                    {tab === 'upcoming' && "You've completely cleared your schedule. Great job!"}
                    {tab === 'overdue' && "You don't have any late assignments."}
                    {tab === 'submitted' && "Your submitted work will appear here."}
                    {tab === 'graded' && "Grades from your teachers will show up here."}
                  </p>
               </div>
            )}
            {displayItems.map((item, i) => {
              const sc = SUBJECTS[item.subject] || SUBJECTS.Physics;
              return (
                <div
                  key={item.id}
                  onClick={() => setSelTask(item)}
                  className="flex items-start gap-4 p-5 border-b border-stone-100 dark:border-stone-800/50 last:border-0 transition-colors hover:bg-stone-50 dark:hover:bg-stone-800/50 cursor-pointer animate-slide-up relative group"
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  <div 
                    className={`w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-xl ${
                      isDone ? "bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 grayscale" : sc.bg
                    }`}
                  >
                    {isDone ? "✓" : sc.icon}
                  </div>
                  <div className="flex-1 min-w-0 pr-8">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span 
                        className="text-[10px] font-bold tracking-wider uppercase font-sans"
                        style={{ color: isDone ? '#a8a29e' : sc.fg }}
                      >
                        {item.subject}
                      </span>
                      <span className="text-[10px] font-semibold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 rounded-md px-1.5 py-0.5 font-sans">
                        {item.type}
                      </span>
                    </div>
                    <div 
                      className={`text-[15px] font-semibold leading-snug font-sans mb-1 ${
                        isDone ? "text-stone-500 dark:text-stone-400 line-through" : "text-stone-900 dark:text-stone-50"
                      }`}
                    >
                      {item.title}
                    </div>
                    <div 
                      className={`text-xs font-medium font-sans ${
                        tab === "overdue" ? "text-rose-600" : "text-stone-500 dark:text-stone-400"
                      }`}
                    >
                      {tab === "overdue" && "⚠ "}{item.due || "TBD"}
                    </div>
                  </div>
                  {tab === "graded" && item.fb && (
                    <div className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md mt-1">
                      {item.fb}
                    </div>
                  )}
                  {!isDone && <ChevronRight size={20} className="text-stone-300 mt-1 shrink-0 absolute right-4 top-5 opacity-100 group-hover:opacity-0 transition-opacity" />}
                  
                  <button 
                    onClick={(e) => deleteTask(item.id, e)}
                    className="absolute right-4 top-5 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-rose-50 dark:bg-rose-950/50 rounded-md"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Sheet open={!!selTask} onClose={() => setSelTask(null)} title="Task Details">
         {selTask && (
           <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mb-2 inline-block">
                  {selTask.type}
                </span>
                <h3 className="text-xl font-bold text-stone-900 dark:text-stone-50 mb-1">{selTask.title}</h3>
                <p className="text-sm text-stone-500 dark:text-stone-400 font-medium">Due {selTask.due || "Soon"}</p>
              </div>

              {selTask.status === 'upcoming' || selTask.status === 'overdue' ? (
                <div className="space-y-4">
                  <div className="p-8 border-2 border-dashed border-stone-200 dark:border-stone-800 rounded-3xl flex flex-col items-center justify-center text-center bg-stone-50/50 dark:bg-stone-900/50 cursor-pointer hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors group"
                       onClick={() => fileRef.current?.click()}>
                    <div className="w-12 h-12 bg-white dark:bg-stone-800 rounded-2xl flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                      {isUploading ? (
                        <div className="w-6 h-6 border-2 border-stone-200 border-t-emerald-500 animate-spin rounded-full" />
                      ) : (
                        <Upload size={24} className="text-stone-500 dark:text-stone-400" />
                      )}
                    </div>
                    <div className="text-sm font-bold text-stone-900 dark:text-stone-50 mb-1">Upload Work</div>
                    <p className="text-[10px] text-stone-500 dark:text-stone-400 font-medium">Drag and drop or tap to browse</p>
                    <input type="file" className="hidden" ref={fileRef} onChange={handleUpload} />
                  </div>
                  <Btn label="Mark as Done without File" variant="outline" full onClick={() => updateTaskStatus(selTask.id, 'submitted')} />
                </div>
              ) : (
                <div className="p-6 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center text-emerald-600">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-emerald-900 dark:text-emerald-300">Work Submitted</div>
                    <p className="text-xs text-emerald-700 dark:text-emerald-500 font-medium">Waiting for teacher review</p>
                  </div>
                </div>
              )}

              {selTask.fb && (
                <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50 rounded-2xl">
                  <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Teacher Feedback</div>
                  <p className="text-sm text-stone-800 dark:text-stone-200 font-medium italic">"{selTask.fb}"</p>
                </div>
              )}
           </div>
         )}
      </Sheet>
    </div>
  );
}

