import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { flushSync } from "react-dom";
import { SUBJECTS } from "../../constants";
import { 
  CaretRight, 
  CaretLeft, 
  MagnifyingGlass, 
  FileText, 
  BookmarkSimple, 
  Play, 
  Plus, 
  Trash, 
  DownloadSimple, 
  Sparkle, 
  PushPin,
  Clock
} from "@phosphor-icons/react";
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
        <div className="px-6 py-8 pb-6 shrink-0 animate-slide-up sticky top-0 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md z-30 border-b border-stone-200 dark:border-stone-800">
          <div className="max-w-4xl mx-auto w-full">
            <div className="flex justify-between items-start mb-8">
              <button 
                onClick={() => openNoteDetail(null)} 
                className="flex items-center gap-3 bg-transparent border-none cursor-pointer font-sans text-[10px] uppercase tracking-[0.3em] font-black text-stone-400 dark:text-stone-500 hover:text-stone-900 transition-all group italic"
              >
                <div className="w-10 h-10 rounded-full border border-stone-100 dark:border-stone-800 flex items-center justify-center bg-white dark:bg-stone-900 shadow-sm group-hover:scale-105 transition-all">
                   <CaretLeft size={18} weight="bold" className="group-hover:-translate-x-0.5 transition-transform" />
                </div>
                Return to {subject}
              </button>
              <div className="flex gap-4">
                <button 
                  onClick={(e) => deleteNote(openNote.id, e)}
                  className="w-14 h-14 rounded-full bg-white dark:bg-stone-900 flex items-center justify-center text-stone-300 hover:text-rose-500 transition-all shadow-sm border border-stone-100 dark:border-stone-800 hover:scale-105 active:scale-95 hover:shadow-xl cursor-pointer"
                >
                  <Trash size={24} weight="duotone" />
                </button>
                <button 
                  onClick={(e) => toggleSave(openNote.id, isSaved, e)}
                  className={`w-14 h-14 rounded-full bg-white dark:bg-stone-900 flex items-center justify-center transition-all shadow-sm border border-stone-100 dark:border-stone-800 hover:scale-105 active:scale-95 hover:shadow-xl cursor-pointer ${isSaved ? "text-brand-500 shadow-brand-500/20" : "text-stone-300 hover:text-brand-500"}`}
                >
                  <BookmarkSimple size={24} weight={isSaved ? "fill" : "duotone"} />
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-6">
                 <span className="text-[10px] font-bold uppercase tracking-wide px-4 py-2 rounded-xl border shadow-sm" style={{ backgroundColor: `${sc.fg}11`, color: sc.fg, borderColor: `${sc.fg}44` }}>{subject}</span>
                 <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide px-4 border-l-2 border-stone-100 dark:border-stone-800 ml-1">Added {openNote.uploaded}</span>
              </div>
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                 <div>
                    <h2 className="text-5xl lg:text-7xl font-black text-stone-900 dark:text-stone-50 leading-[0.85] font-display tracking-tighter mb-4 uppercase italic">
                      {openNote.title}
                    </h2>
                    <div className="text-[11px] font-semibold text-stone-400 dark:text-stone-600 uppercase tracking-wide">{openNote.pages} page{openNote.pages !== 1 ? 's' : ''}</div>
                 </div>
                 {openNote.file_path && (
                   <Btn
                     label="Retrieve Source"
                     icon={<DownloadSimple size={20} weight="bold" />}
                     variant="primary"
                     className="px-10 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl italic shadow-stone-900/10 active:scale-95 transition-all"
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
              className="bg-stone-900 dark:bg-stone-800 rounded-[40px] p-10 shadow-2xl overflow-hidden relative cursor-pointer group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-brand-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-8 relative z-10">
                <div className="w-20 h-20 rounded-[28px] bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover:scale-110 transition-transform shadow-xl">
                  <Play size={32} weight="fill" className="text-white ml-1" />
                </div>
                <div>
                  <div className="text-2xl font-black text-white font-display mb-1 uppercase italic tracking-tight">Audio recording</div>
                  <div className="text-sm font-medium text-stone-400 font-sans opacity-80">Play the recording attached to this note.</div>
                </div>
                <div className="ml-auto flex items-center gap-3 text-[11px] font-bold uppercase tracking-wide text-brand-400">
                  Play
                </div>
              </div>
            </motion.div>
          )}

          {openNote.file_path ? (
            <div className="space-y-6">
              <SectionLabel>File</SectionLabel>
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
              <SectionLabel>Pages</SectionLabel>
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
        <div className="px-6 py-8 pb-6 shrink-0 animate-slide-up sticky top-0 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md z-30 border-b border-stone-200 dark:border-stone-800">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => selectSubject(null)} 
                className="flex items-center gap-3 bg-transparent border-none cursor-pointer font-sans text-[10px] font-black uppercase tracking-[0.3em] text-stone-400 dark:text-stone-500 hover:text-stone-900 transition-all group italic"
              >
                <div className="w-10 h-10 rounded-full border border-stone-100 dark:border-stone-800 flex items-center justify-center bg-white dark:bg-stone-900 shadow-sm group-hover:scale-105 transition-all">
                  <CaretLeft size={18} weight="bold" className="group-hover:-translate-x-0.5 transition-transform" />
                </div>
                All notes
              </button>
              <div className="flex items-center gap-4">
                 <button 
                  onClick={() => handleUploadTrigger(subject)}
                  disabled={isUploading}
                  className={`px-8 py-4 rounded-[24px] font-black text-[10px] uppercase tracking-[0.3em] transition-all flex items-center gap-3 shadow-sm border italic cursor-pointer ${
                    isUploading 
                      ? "bg-brand-50 border-brand-100 text-brand-400 cursor-not-allowed" 
                      : "bg-white dark:bg-stone-900 border-stone-100 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:border-brand-500/30 hover:text-brand-600 hover:shadow-xl"
                  }`}
                >
                  {isUploading ? <div className="w-4 h-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" /> : <Plus size={16} weight="bold" />}
                  Inject Personal
                </button>
              </div>
            </div>
            
            <input 
               type="file" 
               className="hidden" 
               ref={fileInputRef} 
               onChange={handleFileChange} 
            />
            
            <div className="flex items-center gap-8 mb-12 mt-4 relative z-10">
              <div className={`w-28 h-32 rounded-[36px] flex items-center justify-center text-[56px] shadow-inner ${sc.bg} border border-white/20 dark:border-black/10`}>
                {sc.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-5xl lg:text-7xl font-black text-stone-900 dark:text-stone-50 tracking-tighter font-display mb-4 uppercase italic leading-none">
                  {subject}
                </h2>
                <div className="flex items-center gap-4">
                  <span className="text-[11px] font-black uppercase tracking-[0.3em] text-brand-600 dark:text-brand-400 px-4 py-2 bg-brand-50 dark:bg-brand-950/30 rounded-xl border border-brand-100 dark:border-brand-900/50 italic">{currentSubjectNotes.length} Artifacts Indexed</span>
                  <span className="text-[11px] font-black text-stone-300 dark:text-stone-600 uppercase tracking-[0.3em] border-l-2 pl-4 py-0.5 border-stone-100 dark:border-stone-800 italic">Department Records</span>
                </div>
              </div>
            </div>
            
            <div className="relative group max-w-2xl relative z-10">
              <MagnifyingGlass size={22} weight="bold" className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-brand-500 transition-colors" />
              <input 
                type="text" 
                placeholder={`Query through ${subject} knowledge index...`} 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-16 pr-8 h-18 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-[30px] text-base font-sans font-black text-stone-900 dark:text-stone-50 focus:outline-none focus:ring-8 focus:ring-brand-500/5 focus:border-brand-400/40 transition-all shadow-sm placeholder:font-bold placeholder:text-stone-300 placeholder:italic placeholder:uppercase placeholder:tracking-widest placeholder:text-xs"
              />
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 pb-24">
          <AnimatePresence mode="popLayout">
            {filteredNotes.length === 0 ? (
              <EmptySlate icon="🔍" title="No results" sub={`Nothing matches "${search}" in ${subject}.`} />
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
                      className="bg-white dark:bg-stone-900 rounded-[40px] p-10 border border-stone-100 dark:border-stone-800 shadow-sm flex flex-col cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all group relative overflow-hidden h-full"
                    >
                      <div className="absolute top-0 right-0 p-10 opacity-0 group-hover:opacity-[0.03] transition-opacity pointer-events-none duration-700">
                        <FileText size={200} weight="duotone" />
                      </div>
                      <div className="flex justify-between items-start mb-8 relative z-10">
                        <div className={`w-18 h-20 rounded-[24px] shrink-0 flex items-center justify-center text-4xl ${sc.bg} group-hover:scale-110 shadow-inner border border-white/20 dark:border-stone-800 transition-transform duration-500`}>
                          <FileText size={32} weight="duotone" className={sc.fg} />
                        </div>
                        <div className="flex gap-2">
                           <button 
                            onClick={(e) => deleteNote(note.id, e)}
                            className="bg-white dark:bg-stone-900 w-12 h-12 rounded-full flex items-center justify-center text-stone-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all shadow-sm border border-stone-100 dark:border-stone-800 hover:scale-110 cursor-pointer"
                          >
                            <Trash size={20} weight="duotone" />
                          </button>
                          <button 
                            onClick={(e) => toggleSave(note.id, isSaved, e)}
                            className={`bg-white dark:bg-stone-900 w-12 h-12 rounded-full flex items-center justify-center transition-all shadow-sm border border-stone-100 dark:border-stone-800 hover:scale-110 cursor-pointer ${isSaved ? "text-brand-500 shadow-brand-500/20" : "text-stone-300 hover:text-brand-500"}`}
                          >
                            <BookmarkSimple size={20} weight={isSaved ? "fill" : "duotone"} />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mb-4 relative z-10">
                        {note.is_new && <Chip label="New" color="#3b82f6" border="#dbeafe" bg="#eff6ff" />}
                        <span className="text-[10px] font-semibold text-stone-400 dark:text-stone-600 uppercase tracking-wide">{note.uploaded}</span>
                      </div>

                      <h3 className="text-3xl font-black text-stone-900 dark:text-stone-50 font-display leading-[0.95] mb-6 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors line-clamp-3 relative z-10 uppercase italic tracking-tighter">
                        {note.title}
                      </h3>

                      <div className="mt-auto pt-8 border-t border-stone-50 dark:border-stone-800 flex justify-between items-center relative z-10 italic">
                        <div className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em] flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-stone-100 dark:bg-stone-800" />
                           {note.pages} Page Protocol
                           {note.recording && <span className="ml-3 text-brand-600 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" /> Audio</span>}
                        </div>
                        <CaretRight size={20} weight="bold" className="text-stone-200 dark:text-stone-700 group-hover:text-brand-500 group-hover:translate-x-1 transition-all" />
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
      <div className="px-6 py-12 pb-4 shrink-0 animate-slide-up sticky top-0 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md z-20 border-b border-stone-200 dark:border-stone-800">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h1 className="text-5xl font-black text-stone-900 dark:text-stone-50 tracking-tighter font-display mb-2 uppercase italic leading-none">Notes</h1>
              <p className="text-[11px] font-semibold text-stone-400 dark:text-stone-500 tracking-wide">
                <span className="text-brand-600 dark:text-brand-400 font-black mr-1">{notes.length}</span> notes across <span className="text-brand-600 dark:text-brand-400 font-black mx-1">{subjectsToDisplay.length}</span> subjects
              </p>
            </div>
            <div className="hidden md:block">
              <Btn label="Trans-Library Search" variant="outline" className="rounded-[24px] h-16 border italic font-black text-[11px] uppercase tracking-[0.3em] px-10 shadow-sm hover:shadow-xl transition-all" icon={<MagnifyingGlass size={20} weight="bold" />} />
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-10 pb-24">
        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-[44px] p-10 border border-stone-100 dark:border-stone-800 bg-white dark:bg-stone-900 space-y-6 animate-pulse">
                <div className="w-20 h-24 rounded-[28px] bg-stone-100 dark:bg-stone-800" />
                <div className="space-y-3 mt-auto">
                  <div className="h-3 bg-stone-100 dark:bg-stone-800 rounded-lg w-1/3" />
                  <div className="h-6 bg-stone-100 dark:bg-stone-800 rounded-lg w-3/4" />
                </div>
              </div>
            ))}
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
                  className="bg-white dark:bg-stone-900 rounded-[44px] p-10 border border-stone-100 dark:border-stone-800 shadow-sm cursor-pointer hover:shadow-2xl hover:border-brand-500/20 transition-all flex flex-col group relative overflow-hidden"
                  style={{ viewTransitionName: subject === subj ? 'library-detail' : 'none' }}
                >
                  <div className="absolute top-0 right-0 p-10 opacity-5 grayscale group-hover:scale-125 group-hover:opacity-10 transition-all pointer-events-none duration-1000 blur-[1px]">
                    <span className="text-9xl">{sc.icon}</span>
                  </div>
                  
                  <div className={`w-20 h-24 rounded-[28px] shrink-0 flex items-center justify-center text-5xl ${sc.bg} mb-12 shadow-inner group-hover:rotate-6 transition-transform duration-700 border border-white/20 dark:border-black/10`}>
                    {sc.icon}
                  </div>
                  
                  <div className="mt-auto relative z-10 italic">
                    <div className="flex items-center gap-3 mb-3">
                       {newCount > 0 && <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-600 bg-brand-50 dark:bg-brand-950/30 px-3 py-1.5 rounded-xl border border-brand-100 dark:border-brand-900">Protocol Release</span>}
                       <span className="text-[10px] font-black uppercase tracking-[0.3em] text-stone-400">{subjectNotes.length} In-Index</span>
                    </div>
                    <div className="text-3xl font-black text-stone-900 dark:text-stone-50 tracking-tighter font-display mb-1 group-hover:text-brand-600 transition-colors uppercase leading-none italic">
                      {subj}
                    </div>
                  </div>
                  
                  <div className="absolute bottom-10 right-10 w-12 h-12 rounded-full bg-stone-50 dark:bg-stone-800 flex items-center justify-center text-stone-200 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all shadow-inner">
                     <CaretRight size={24} weight="bold" />
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
