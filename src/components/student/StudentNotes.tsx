import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { flushSync } from "react-dom";
import { SUBJECTS } from "../../constants";
import { ChevronRight, ChevronLeft, Search, FileText, Bookmark, Play, Plus, Trash2, Download, Sparkles, Pin } from "lucide-react";
import { supabase } from "../../supabaseClient";
import { Sheet, Btn, Chip, SectionLabel, EmptySlate } from "../shared/UI";

export default function StudentNotes() {
  const [subject, setSubject] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [openNote, setOpenNote] = useState<any | null>(null);
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, []);

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [activeUploadSubject, setActiveUploadSubject] = useState<string | null>(null);

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
      setSearch("");
    });
  };

  const openNoteDetail = (note: any | null) => {
    startTransition(() => {
      setOpenNote(note);
    });
  };

  const fetchNotes = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('notes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setNotes(data);
    }
    setLoading(false);
  };

  const handleUploadTrigger = (s: string) => {
    setActiveUploadSubject(s);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadSubject) return;

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/student-notes/${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('app-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const newNote = {
        user_id: user.id,
        subject: activeUploadSubject,
        title: file.name,
        uploaded: "Just now",
        pages: 1,
        is_new: true,
        recording: false,
        is_saved: false,
        file_path: filePath
      };

      const { data, error: dbError } = await supabase.from('notes').insert([newNote]).select();
      if (dbError) throw dbError;

      if (data) {
        setNotes([data[0], ...notes]);
      }
    } catch(err) {
      console.error(err);
      alert("Failed to upload file");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const deleteNote = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    const noteToDelete = notes.find(n => n.id === id);

    const { error } = await supabase.from('notes').delete().eq('id', id);
    if (!error) {
      if (noteToDelete?.file_path) {
        await supabase.storage.from('app-files').remove([noteToDelete.file_path]);
      }
      setNotes(notes.filter(n => n.id !== id));
      if (openNote?.id === id) setOpenNote(null);
    }
  };

  const toggleSave = async (id: string, currentSaved: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    const { error } = await supabase.from('notes').update({ is_saved: !currentSaved }).eq('id', id);
    if (!error) {
      setNotes(notes.map(n => n.id === id ? { ...n, is_saved: !currentSaved } : n));
      if (openNote?.id === id) setOpenNote({ ...openNote, is_saved: !currentSaved });
    }
  };

  const activeSubjects = Array.from(new Set(notes.map(n => n.subject)));
  const subjectsToDisplay = activeSubjects.length > 0 ? activeSubjects : ["Maths", "Physics", "Science"];

  const currentSubjectNotes = notes.filter(n => n.subject === subject);
  const filteredNotes = currentSubjectNotes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()));

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

  if (openNote && subject) {
    const sc = SUBJECTS[subject] || SUBJECTS.Physics;
    const isSaved = openNote.is_saved;
    return (
      <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950 scrollbar-hide overflow-y-auto" style={{ viewTransitionName: 'library-detail' }}>
        {/* Detail Header */}
        <div className="px-6 py-8 pb-4 shrink-0 animate-slide-up sticky top-0 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md z-30 border-b border-stone-100 dark:border-stone-800">
          <div className="max-w-4xl mx-auto w-full">
            <div className="flex justify-between items-start mb-6">
              <button 
                onClick={() => openNoteDetail(null)} 
                className="flex items-center gap-2 bg-transparent border-none cursor-pointer font-sans text-sm font-bold text-stone-500 dark:text-stone-400 hover:text-stone-900 transition-colors group"
              >
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to {subject}
              </button>
              <div className="flex gap-4">
                <button 
                  onClick={(e) => deleteNote(openNote.id, e)}
                  className="w-10 h-10 rounded-full bg-white dark:bg-stone-800 flex items-center justify-center text-stone-400 hover:text-rose-500 transition-all shadow-sm border border-stone-100 dark:border-stone-700 hover:scale-110 active:scale-90"
                >
                  <Trash2 size={18} />
                </button>
                <button 
                  onClick={(e) => toggleSave(openNote.id, isSaved, e)}
                  className={`w-10 h-10 rounded-full bg-white dark:bg-stone-800 flex items-center justify-center transition-all shadow-sm border border-stone-100 dark:border-stone-700 hover:scale-110 active:scale-90 ${isSaved ? "text-emerald-500" : "text-stone-400 hover:text-emerald-500"}`}
                >
                  <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-3">
                 <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border" style={{ backgroundColor: `${sc.fg}11`, color: sc.fg, borderColor: `${sc.fg}44` }}>{subject}</span>
                 <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-2 border-l border-stone-200 dark:border-stone-800 ml-1">{openNote.uploaded}</span>
              </div>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                 <div>
                    <h2 className="text-3xl font-black text-stone-900 dark:text-stone-50 leading-tight font-sans tracking-tight mb-2">
                      {openNote.title}
                    </h2>
                    <div className="text-xs font-bold text-stone-400 uppercase tracking-[0.2em]">{openNote.pages} TOTAL PAGES</div>
                 </div>
                 {openNote.file_path && (
                   <Btn
                     label="Download Source"
                     icon={<Download size={16} />}
                     className="px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-stone-900/10 active:scale-95 transition-all"
                     onClick={() => handleDownload(openNote.file_path, openNote.title)}
                   />
                 )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 pb-24 space-y-12">
          {openNote.recording && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-stone-900 dark:bg-stone-800 rounded-[32px] p-8 shadow-2xl overflow-hidden relative cursor-pointer group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-6 relative z-10">
                <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play size={24} className="fill-white text-white ml-1" />
                </div>
                <div>
                  <div className="text-lg font-black text-white font-sans mb-1">Session Recording is Live</div>
                  <div className="text-sm font-medium text-stone-400 font-sans italic">"Listen to the synchronized explanation for these concepts"</div>
                </div>
                <div className="ml-auto flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-amber-500">
                  <Pin size={12} className="rotate-45" /> Watch Now
                </div>
              </div>
            </motion.div>
          )}

          {openNote.file_path ? (
            <div className="space-y-6">
              <SectionLabel>Digital Artifact</SectionLabel>
              <motion.button
                whileHover={{ y: -4 }}
                onClick={async () => {
                  try {
                     const { data } = await supabase.storage.from('app-files').createSignedUrl(openNote.file_path, 3600);
                     if (data?.signedUrl) window.open(data.signedUrl, '_blank');
                  } catch (e) { console.error(e); }
                }}
                className="w-full bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 p-10 rounded-[40px] shadow-sm hover:shadow-2xl hover:border-amber-200 dark:hover:border-amber-900/40 transition-all group cursor-pointer text-left relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity">
                  <FileText size={160} />
                </div>
                <div className="flex items-center gap-8 relative z-10">
                  <div className={`w-20 h-20 rounded-3xl shrink-0 flex items-center justify-center text-4xl ${sc.bg} group-hover:scale-110 transition-transform shadow-inner`}>
                    <FileText size={40} className={sc.fg} />
                  </div>
                  <div>
                    <div className="font-black text-stone-900 dark:text-stone-50 text-2xl mb-2 group-hover:text-amber-600 transition-colors">
                      Access Primary Document
                    </div>
                    <div className="text-base font-medium text-stone-400 dark:text-stone-500 max-w-sm leading-relaxed">
                      Securely launch the document viewer for high-fidelity examination.
                    </div>
                  </div>
                  <div className="ml-auto hidden md:block">
                    <div className="w-12 h-12 rounded-full border-2 border-stone-50 dark:border-stone-800 flex items-center justify-center text-stone-300 group-hover:text-amber-500 group-hover:border-amber-500 transition-all">
                       <ChevronRight size={24} />
                    </div>
                  </div>
                </div>
              </motion.button>
            </div>
          ) : (
            <div className="space-y-6">
              <SectionLabel>Canvas Gallery</SectionLabel>
              <div className="grid gap-8 grid-cols-1">
                {Array.from({ length: openNote.pages || 1 }).map((_, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    key={i} 
                    className="bg-white dark:bg-stone-900 rounded-[40px] border border-stone-100 dark:border-stone-800 aspect-[1/1.41] flex flex-col items-center justify-center relative overflow-hidden shadow-sm group hover:shadow-2xl transition-all"
                  >
                    <div className="text-[140px] opacity-10 grayscale group-hover:scale-105 transition-transform duration-1000">📄</div>
                    <div className="absolute top-8 left-8">
                       <div className="w-12 h-12 rounded-2xl bg-stone-50 dark:bg-stone-800 flex items-center justify-center text-xs font-black font-mono shadow-inner">
                         {String(i + 1).padStart(2, '0')}
                       </div>
                    </div>
                    <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/[0.02] transition-colors cursor-pointer" />
                    <div className="absolute bottom-8 text-[10px] font-black uppercase tracking-[0.3em] text-stone-300 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                      SECURE PREVIEW PAGE
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (subject) {
    const sc = SUBJECTS[subject] || SUBJECTS.Physics;
    return (
      <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950 scrollbar-hide overflow-y-auto" style={{ viewTransitionName: 'library-detail' }}>
        {/* Subject Header */}
        <div className="px-6 py-8 pb-4 shrink-0 animate-slide-up sticky top-0 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md z-30 border-b border-stone-100 dark:border-stone-800">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => selectSubject(null)} 
                className="flex items-center gap-2 bg-transparent border-none cursor-pointer font-sans text-sm font-bold text-stone-500 dark:text-stone-400 hover:text-stone-900 transition-colors group"
              >
                <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Library
              </button>
              <div className="flex items-center gap-3">
                 <button 
                  onClick={() => handleUploadTrigger(subject)}
                  disabled={isUploading}
                  className={`px-5 py-2.5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 shadow-sm border ${
                    isUploading 
                      ? "bg-emerald-50 border-emerald-100 text-emerald-400 cursor-not-allowed" 
                      : "bg-white dark:bg-stone-800 border-stone-100 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:border-amber-400 hover:text-amber-600"
                  }`}
                >
                  {isUploading ? <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /> : <Plus size={14} />}
                  Upload Personal
                </button>
              </div>
            </div>
            
            <input 
               type="file" 
               className="hidden" 
               ref={fileInputRef} 
               onChange={handleFileChange} 
            />
            
            <div className="flex items-center gap-6 mb-8">
              <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-5xl shadow-inner ${sc.bg}`}>
                {sc.icon}
              </div>
              <div>
                <h2 className="text-4xl font-black text-stone-900 dark:text-stone-50 tracking-tighter font-sans mb-1">
                  {subject}
                </h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase tracking-widest text-amber-600 dark:text-amber-500 px-3 py-1 bg-amber-50 dark:bg-amber-950/30 rounded-lg">{currentSubjectNotes.length} RESOURCES</span>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest border-l pl-2 border-stone-200 dark:border-stone-800">Academic Archive</span>
                </div>
              </div>
            </div>
            
            <div className="relative group max-w-xl">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-amber-500 transition-colors" />
              <input 
                type="text" 
                placeholder={`Search through ${subject} knowledge...`} 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl text-sm font-sans text-stone-900 dark:text-stone-50 focus:outline-none focus:ring-4 focus:ring-amber-500/5 focus:border-amber-400 transition-all shadow-sm"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 pb-24">
          <AnimatePresence mode="popLayout">
            {filteredNotes.length === 0 ? (
              <EmptySlate icon="🔍" title="Knowledge mismatch" sub={`No personal or shared notes matching "${search}" in ${subject}.`} />
            ) : (
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {filteredNotes.map((note, i) => {
                  const isSaved = note.is_saved;
                  return (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      key={note.id} 
                      onClick={() => openNoteDetail(note)}
                      className="bg-white dark:bg-stone-900 rounded-[32px] p-8 border border-stone-100 dark:border-stone-800 shadow-sm flex flex-col cursor-pointer hover:shadow-2xl hover:border-amber-200 dark:hover:border-amber-900/40 transition-all group relative overflow-hidden h-full"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className={`w-14 h-16 rounded-2xl shrink-0 flex items-center justify-center text-2xl ${sc.bg} group-hover:scale-110 shadow-inner transition-transform duration-500`}>
                          <FileText size={24} className={sc.fg} />
                        </div>
                        <div className="flex gap-2">
                           <button 
                            onClick={(e) => deleteNote(note.id, e)}
                            className="bg-white dark:bg-stone-800 w-10 h-10 rounded-full flex items-center justify-center text-stone-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-stone-50 dark:border-stone-700"
                          >
                            <Trash2 size={18} />
                          </button>
                          <button 
                            onClick={(e) => toggleSave(note.id, isSaved, e)}
                            className={`bg-white dark:bg-stone-800 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-sm border border-stone-50 dark:border-stone-700 ${isSaved ? "text-emerald-500 shadow-emerald-500/20" : "text-stone-300 hover:text-emerald-500"}`}
                          >
                            <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mb-2">
                        {note.is_new && <Chip label="New Arrival" color="#3b82f6" border="#dbeafe" bg="#eff6ff" />}
                        <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">{note.uploaded}</span>
                      </div>

                      <h3 className="text-xl font-black text-stone-900 dark:text-stone-50 font-sans leading-tight mb-4 group-hover:text-amber-600 transition-colors line-clamp-2">
                        {note.title}
                      </h3>

                      <div className="mt-auto pt-6 border-t border-stone-50 dark:border-stone-800/50 flex justify-between items-center">
                        <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-1.5">
                           <div className="w-1.5 h-1.5 rounded-full bg-stone-300" />
                           {note.pages} Page{note.pages !== 1 && 's'}
                           {note.recording && <span className="ml-2 text-rose-500 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" /> Audio</span>}
                        </div>
                        <ChevronRight size={16} className="text-stone-200 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </motion.div>
                  );
                })}
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
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-4xl font-black text-stone-900 dark:text-stone-50 tracking-tighter font-sans mb-1">Knowledge Hub</h1>
              <p className="text-sm font-bold text-stone-500 dark:text-stone-400 uppercase tracking-widest">
                <span className="text-amber-600 dark:text-amber-500">{notes.length}</span> Objects curated in <span className="text-amber-600 dark:text-amber-500">{subjectsToDisplay.length}</span> Departments
              </p>
            </div>
            <div className="hidden md:block">
              <Btn label="Global Search" variant="outline" className="rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest px-6" icon={<Search size={14} />} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 pb-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-12 h-12 animate-spin rounded-full border-4 border-stone-200 border-t-amber-500" />
            <p className="mt-4 text-[10px] font-black uppercase tracking-widest text-stone-400">Archiving libraries...</p>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {subjectsToDisplay.map((subj, i) => {
              const sc = SUBJECTS[subj as string] || SUBJECTS.Physics;
              const subjectNotes = notes.filter(n => n.subject === subj);
              const newCount = subjectNotes.filter(n => n.is_new).length;
              
              return (
                <motion.div 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={subj} 
                  onClick={() => selectSubject(subj as string)} 
                  className="bg-white dark:bg-stone-900 rounded-[32px] p-8 border border-stone-100 dark:border-stone-800 shadow-sm cursor-pointer hover:shadow-2xl hover:border-amber-200 dark:hover:border-amber-900/40 transition-all flex flex-col group relative overflow-hidden"
                  style={{ viewTransitionName: subject === subj ? 'library-detail' : 'none' }}
                >
                  <div className="absolute top-0 right-0 p-8 opacity-5 grayscale group-hover:scale-110 group-hover:opacity-10 transition-all pointer-events-none duration-700">
                    <span className="text-9xl">{sc.icon}</span>
                  </div>
                  
                  <div className={`w-16 h-16 rounded-3xl shrink-0 flex items-center justify-center text-4xl ${sc.bg} mb-8 shadow-inner group-hover:rotate-6 transition-transform duration-500`}>
                    {sc.icon}
                  </div>
                  
                  <div className="mt-auto">
                    <div className="flex items-center gap-2 mb-2">
                       {newCount > 0 && <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-1 rounded-lg">Update</span>}
                       <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">{subjectNotes.length} Items</span>
                    </div>
                    <div className="text-2xl font-black text-stone-900 dark:text-stone-50 tracking-tight font-sans mb-1 group-hover:text-amber-600 transition-colors">
                      {subj}
                    </div>
                  </div>
                  
                  <div className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-stone-50 dark:bg-stone-800 flex items-center justify-center text-stone-300 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
                     <ChevronRight size={20} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
