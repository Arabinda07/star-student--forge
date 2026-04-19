import { useState, useEffect } from "react";
import { SUBJECTS } from "../../constants";
import { ChevronRight, Plus, Trash2 } from "lucide-react";
import { supabase } from "../../supabaseClient";

export default function StudentMyWork() {
  const [tab, setTab] = useState("upcoming");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const createTask = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const newTask = {
      user_id: user.id,
      subject: "Maths",
      title: "New Custom Homework",
      due: "In 2 days",
      type: "Homework",
      status: "upcoming",
      fb: ""
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert([newTask])
      .select();

    if (!error && data) {
      setItems([data[0], ...items]);
    }
  };

  const updateTaskStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setItems(items.map(t => t.id === id ? { ...t, status: newStatus } : t));
    }
  };

  const deleteTask = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id);

    if (!error) {
      setItems(items.filter(t => t.id !== id));
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
                  onClick={() => !isDone && updateTaskStatus(item.id, "submitted")}
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
                      {tab === "overdue" && "⚠ "}{item.due}
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
    </div>
  );
}
