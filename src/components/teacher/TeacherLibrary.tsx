import { useState, useRef, useEffect, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { flushSync } from "react-dom";
import { SUBJECTS } from "../../constants";
import { SectionLabel, Btn, Chip, EmptySlate, Sheet } from "../shared/UI";
import { ChevronLeft, ChevronRight, Search, FileText, Upload, CheckCircle2, Plus, Trash2, Download, Filter } from "lucide-react";
import { Note as NoteType } from "../../types";
import { supabase } from "../../supabaseClient";

const INITIAL_NOTES: Record<string, NoteType[]> = {};

export default function TeacherLibrary() {
  const [subject, setSubject] = useState<string | null>(null);
  const [uploadSheet, setUploadSheet] = useState(false);
  const [step, setStep] = useState<"form" | "preview" | "done">("form");
  const [form, setForm] = useState({ title: "", subject: "Maths", batch: "Class 8 Evening", file: null as File | null });
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [notes, setNotes] = useState<any[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const startTransition = (callback: () => void) => {
    if (!document.startViewTransition) {
      callback();
      return;
    }
    document.startViewTransition(() => {
      flushSync(() => {
        callback();
      });
    });
  };

  const selectSubject = (s: string | null) => {
    startTransition(() => {
      setSubject(s);
    });
  };

  const fetchNotes = async () => {
    setIsLoadingNotes(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    let query = supabase.from('notes').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    
    const { data } = await query;
    if (data) {
      setNotes(data);
    }
    setIsLoadingNotes(false);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
       setForm({ ...form, file: e.target.files[0] });
    }
  };

  const handleUpload = () => {
    if (!form.title || !form.subject || !form.file) {
      setErrorMsg("Please fill all fields and attach a file");
      return;
    }
    setErrorMsg(null);
    setStep("preview");
  };

  const handleConfirm = async () => {
    setIsUploading(true);
    setErrorMsg(null);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const file = form.file!;
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/teacher-notes/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('app-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const newNote = {
        user_id: user.id,
        title: form.title,
        subject: form.subject,
        uploaded: "Just now",
        pages: 1, 
        is_new: true,
        file_path: filePath
      };

      const { data: noteData, error: dbError } = await supabase.from('notes').insert([newNote]).select();
      if (dbError) throw dbError;

      if (noteData) {
        setNotes([noteData[0], ...notes]);
      }

      setStep("done");
      setTimeout(() => {
        setUploadSheet(false);
        setStep("form");
        setForm({ title: "", subject: "Maths", batch: "Class 8 Evening", file: null });
      }, 1400);

    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upload note");
      setStep("form"); 
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (noteId: string, filePath?: string) => {
    try {
      if (filePath) {
        await supabase.storage.from('app-files').remove([filePath]);
      }
      await supabase.from('notes').delete().eq('id', noteId);
      setNotes(notes.filter(n => n.id !== noteId));
    } catch(err) {
      console.error(err);
    }
  };

  const handleDownload = async (path: string, fileName: string) => {
    try {
      const { data, error } = await supabase.storage.from("app-files").createSignedUrl(path, 3600, {
        download: fileName,
      });
      if (error) throw error;
      if (data?.signedUrl) {
        const link = document.createElement("a");
        link.href = data.signedUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to download file");
    }
  };

  const subjects = Object.keys(SUBJECTS);

  if (subject) {
    const currentSubjectNotes = notes.filter(n => n.subject === subject).filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()));
    const sc = SUBJECTS[subject] || SUBJECTS.Physics;
    return (
      <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950 scrollbar-hide overflow-y-auto">
        <div className="px-6 py-8 pb-4 shrink-0 animate-slide-up sticky top-0 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md z-20">
          <div className="max-w-7xl mx-auto w-full">
            <button onClick={() => selectSubject(null)} className="flex items-center gap-2 bg-transparent border-none cursor-pointer font-sans text-sm font-bold text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors mb-6 group">
              <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Library
            </button>
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-5">
                <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center text-4xl shadow-sm border border-stone-100 dark:border-stone-800 ${sc.bg}`}>
                  {sc.icon}
                </div>
                <div>
                  <h2 className="text-3xl font-black text-stone-900 dark:text-stone-50 tracking-tight font-sans">{subject}</h2>
                  <div className="text-sm font-bold text-amber-600 dark:text-amber-500 font-sans uppercase tracking-widest">{currentSubjectNotes.length} resources available</div>
                </div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { setForm({ ...form, subject: subject }); setUploadSheet(true); }}
                className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-600/20 group"
              >
                <Plus size={24} className="group-hover:rotate-90 transition-transform" />
              </motion.button>
            </div>

            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-amber-500 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder={`Search in ${subject}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 pb-24">
          <AnimatePresence mode="popLayout">
            {isLoadingNotes ? (
               <div className="flex flex-col items-center justify-center py-20">
                 <div className="w-10 h-10 animate-spin rounded-full border-4 border-stone-200 border-t-amber-600" />
                 <p className="mt-4 text-sm font-bold text-stone-400 uppercase tracking-widest">Sourcing notes...</p>
               </div>
            ) : currentSubjectNotes.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-20"
              >
                <EmptySlate icon="📚" title="Library is empty" sub={searchQuery ? "No results match your search." : "Upload your first resource for this subject to build your library."} />
                {!searchQuery && (
                  <div className="flex justify-center mt-8">
                    <Btn label="Upload Now" icon={<Upload size={18} />} onClick={() => { setForm({ ...form, subject: subject }); setUploadSheet(true); }} />
                  </div>
                )}
              </motion.div>
            ) : (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
                {currentSubjectNotes.map((note, i) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={note.id} 
                    className="bg-white dark:bg-stone-900 rounded-[32px] p-8 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-2xl hover:border-amber-200 dark:hover:border-amber-900/40 transition-all cursor-pointer group relative flex flex-col h-full"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-14 h-16 rounded-2xl shrink-0 flex flex-col items-center justify-center gap-1 shadow-inner ${sc.bg}`}>
                        <FileText size={24} className={sc.fg} />
                      </div>
                      <div className="flex gap-2">
                        {note.is_new && <Chip label="New" active />}
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(note.id, note.file_path); }}
                          className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/30 text-rose-500 opacity-0 group-hover:opacity-100 hover:scale-110 transition-all flex items-center justify-center border border-rose-100 dark:border-rose-900/50"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-stone-900 dark:text-stone-50 font-sans mb-1 group-hover:text-amber-600 transition-colors tracking-tight line-clamp-2">
                      {note.title}
                    </h3>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-8">{note.uploaded}</p>

                    <div className="mt-auto pt-6 border-t border-stone-100 dark:border-stone-800/50 flex items-center justify-between">
                       <span className="text-xs font-bold text-stone-500">{note.pages} Slides / Pages</span>
                       <div className="flex gap-2">
                          {note.file_path && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => { e.stopPropagation(); handleDownload(note.file_path, note.title); }}
                              className="w-10 h-10 rounded-xl bg-stone-50 dark:bg-stone-800 flex items-center justify-center text-stone-500 hover:text-amber-600 transition-all shadow-sm border border-stone-100 dark:border-stone-700/50"
                            >
                              <Download size={18} />
                            </motion.button>
                          )}
                          <motion.button 
                             whileHover={{ scale: 1.1 }}
                             whileTap={{ scale: 0.9 }}
                             onClick={async (e) => {
                               e.stopPropagation();
                               const { data } = await supabase.storage.from('app-files').createSignedUrl(note.file_path, 3600);
                               if (data?.signedUrl) window.open(data.signedUrl, '_blank');
                             }}
                             className="w-10 h-10 rounded-xl bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 flex items-center justify-center hover:bg-amber-600 dark:hover:bg-amber-500 transition-all shadow-md"
                          >
                             <ChevronRight size={18} />
                          </motion.button>
                       </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950 scrollbar-hide overflow-y-auto">
      {/* Premium Header */}
      <div className="px-6 py-8 pb-4 shrink-0 animate-slide-up sticky top-0 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md z-20">
        <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
          <div>
            <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans">Library</h1>
            <p className="text-sm font-medium text-stone-500 dark:text-stone-400 mt-1">Organized knowledge base for your students</p>
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setUploadSheet(true)}
            aria-label="Upload Resource"
            className="w-14 h-14 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-lg shadow-amber-600/20 group"
          >
            <Plus size={24} className="group-hover:rotate-90 transition-transform" />
          </motion.button>
        </div>
        
        {/* Quick Filter */}
        <div className="max-w-7xl mx-auto w-full mt-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-amber-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search across all subjects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all shadow-sm"
            />
          </div>
          <button className="w-12 h-12 flex items-center justify-center rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-500 hover:text-amber-500 transition-colors shadow-sm shrink-0">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 pb-24">
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {subjects.map((subj, i) => {
            const sc = SUBJECTS[subj] || SUBJECTS.Physics;
            const subjNotes = notes.filter(n => n.subject === subj);
            return (
              <motion.div 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                key={subj} 
                onClick={() => selectSubject(subj)} 
                className="bg-white dark:bg-stone-900 rounded-[32px] p-8 border border-stone-200 dark:border-stone-800 shadow-sm cursor-pointer hover:shadow-2xl hover:border-amber-200 dark:hover:border-amber-900/40 transition-all group flex flex-col h-full relative overflow-hidden"
              >
                <div className={`w-16 h-16 rounded-[22px] flex items-center justify-center text-4xl mb-8 shadow-sm border border-stone-100 dark:border-stone-800 group-hover:scale-110 transition-transform duration-500 ${sc.bg}`}>
                  {sc.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-black text-stone-900 dark:text-stone-50 tracking-tight font-sans mb-1">{subj}</h3>
                  <p className="text-xs font-bold text-stone-400 uppercase tracking-widest">{subjNotes.length} RESOURCES</p>
                </div>
                <div className="mt-8 pt-6 border-t border-stone-100 dark:border-stone-800/50 flex items-center justify-between">
                   <div className="flex -space-x-2">
                      {[1, 2, 3].map(user => (
                        <div key={user} className="w-8 h-8 rounded-full border-2 border-white dark:border-stone-900 bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-[10px] font-black text-stone-400">
                          {user}
                        </div>
                      ))}
                   </div>
                   <motion.div 
                      whileHover={{ x: 5 }}
                      className="w-10 h-10 rounded-xl bg-stone-50 dark:bg-stone-800 flex items-center justify-center text-stone-300 group-hover:text-amber-600 transition-all"
                   >
                     <ChevronRight size={20} />
                   </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <Sheet open={uploadSheet} onClose={() => { setUploadSheet(false); setStep("form"); }} title={step === "done" ? undefined : "Upload Resource"}>
        {step === "form" && (
          <div className="flex flex-col gap-8 p-2">
            <div 
              className="border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-[32px] p-12 text-center bg-stone-50 dark:bg-stone-950 hover:bg-stone-100 dark:hover:bg-stone-900 cursor-pointer transition-all hover:border-amber-400 group relative overflow-hidden"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                 type="file"
                 ref={fileInputRef}
                 className="hidden"
                 onChange={handleFileChange}
              />
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-500">📄</div>
              {form.file ? (
                <>
                  <div className="text-base font-black text-emerald-600 dark:text-emerald-400 font-sans mb-1 truncate px-4">{form.file.name}</div>
                  <div className="text-xs font-bold text-stone-400 uppercase tracking-widest">Target for upload</div>
                </>
              ) : (
                <>
                  <div className="text-base font-black text-stone-900 dark:text-stone-50 font-sans mb-1">Select PDF or Document</div>
                  <div className="text-xs font-bold text-stone-400 uppercase tracking-widest">Max file size 10MB</div>
                </>
              )}
              {/* Decorative inner gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none" />
            </div>
            
            <div className="space-y-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="note-title" className="text-xs font-bold tracking-widest uppercase text-stone-400 px-1">Resource Title</label>
                <input 
                  id="note-title"
                  value={form.title} 
                  onChange={(e) => setForm({ ...form, title: e.target.value })} 
                  placeholder="e.g. Newton's Laws — Chapter 5" 
                  className="w-full px-6 py-4 rounded-2xl border border-stone-200 dark:border-stone-800 font-sans text-sm bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-50 outline-none focus:ring-2 focus:ring-amber-500/10 focus:border-amber-500 focus:bg-white dark:focus:bg-stone-900 transition-all shadow-sm"
                />
              </div>
              
              <div className="flex flex-col gap-3">
                <label id="subject-label" className="text-xs font-bold tracking-widest uppercase text-stone-400 px-1">Assign Subject</label>
                <div role="radiogroup" aria-labelledby="subject-label" className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {subjects.map((s) => {
                    const sel = form.subject === s;
                    return (
                      <button 
                        key={s} 
                        onClick={() => setForm({ ...form, subject: s })} 
                        className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                          sel ? "bg-stone-900 border-stone-900 text-white shadow-md" : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 hover:border-amber-500"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {errorMsg && <div className="text-rose-500 text-xs font-black text-center mt-2 animate-shake">{errorMsg}</div>}
            </div>

            <Btn 
              label="Review & Deploy" 
              full
              onClick={handleUpload} 
            />
          </div>
        )}
        
        {step === "preview" && (
          <div className="space-y-8 p-2">
            <div className="bg-stone-50 dark:bg-stone-950 rounded-[32px] border border-stone-200 dark:border-stone-800 p-10 text-center shadow-inner relative overflow-hidden">
               <div className="text-5xl mb-6">📄</div>
               <h2 className="text-2xl font-black text-stone-900 dark:text-stone-50 font-sans mb-2 tracking-tight">{form.title}</h2>
               <div className="flex gap-2 justify-center">
                 <span className="text-[10px] font-black text-amber-600 dark:text-amber-500 bg-white dark:bg-stone-900 px-4 py-1.5 rounded-full border border-stone-200 dark:border-stone-800 uppercase tracking-widest">{form.subject}</span>
                 <span className="text-[10px] font-black text-stone-400 bg-white dark:bg-stone-900 px-4 py-1.5 rounded-full border border-stone-200 dark:border-stone-800 uppercase tracking-widest truncate max-w-[120px]">{form.file?.name}</span>
               </div>
            </div>
            
            {errorMsg && <div className="text-rose-500 text-xs font-black text-center animate-shake">{errorMsg}</div>}

            <div className="flex gap-4">
              <Btn label="Edit" variant="outline" onClick={() => setStep("form")} />
              <Btn 
                label={isUploading ? "Uploading..." : "Deploy resource"} 
                full
                onClick={handleConfirm} 
                disabled={isUploading} 
              />
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
            <h2 className="text-3xl font-black text-stone-900 dark:text-stone-50 font-sans tracking-tight mb-3">Deployed!</h2>
            <p className="text-base font-medium text-stone-500 font-sans leading-relaxed">
              Resource is now available in {form.subject} library.<br />Sync complete.
            </p>
          </div>
        )}
      </Sheet>
    </div>
  );
}
