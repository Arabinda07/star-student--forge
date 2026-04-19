import React, { useState, useEffect } from "react";
import { SUBJECTS } from "../../constants";
import { ChevronRight, ChevronLeft, Search, FileText, Bookmark, Play, Plus, Trash2 } from "lucide-react";
import { supabase } from "../../supabaseClient";

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

  // Extract unique subjects that possess notes OR default to standard array
  const activeSubjects = Array.from(new Set(notes.map(n => n.subject)));
  const subjectsToDisplay = activeSubjects.length > 0 ? activeSubjects : ["Maths", "Physics", "Science"];

  const currentSubjectNotes = notes.filter(n => n.subject === subject);
  const filteredNotes = currentSubjectNotes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()));

  if (openNote && subject) {
    const sc = SUBJECTS[subject] || SUBJECTS.Physics;
    const isSaved = openNote.is_saved;
    return (
      <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950 animate-slideInRight">
        <div className="px-6 py-4 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shrink-0 sticky top-0 z-10">
          <div className="flex justify-between items-start mb-4">
            <button 
              onClick={() => setOpenNote(null)} 
              className="flex items-center gap-1 bg-transparent border-none cursor-pointer font-sans text-sm font-semibold text-stone-500 dark:text-stone-400 hover:text-stone-900 transition-colors"
            >
              <ChevronLeft size={18} /> {subject}
            </button>
            <div className="flex gap-4">
              <button 
                onClick={(e) => deleteNote(openNote.id, e)}
                className="bg-transparent border-none cursor-pointer text-stone-400 hover:text-rose-500 transition-colors"
              >
                <Trash2 size={20} />
              </button>
              <button 
                onClick={(e) => toggleSave(openNote.id, isSaved, e)}
                className="bg-transparent border-none cursor-pointer text-stone-500 dark:text-stone-400 hover:text-emerald-500 transition-colors"
              >
                <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} className={isSaved ? "text-emerald-500" : ""} />
              </button>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans leading-tight mb-2">
              {openNote.title}
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: sc.fg }}>{subject}</span>
              <span className="text-stone-300">•</span>
              <span className="text-xs text-stone-500 dark:text-stone-400 font-sans">{openNote.uploaded}</span>
              <span className="text-stone-300">•</span>
              <span className="text-xs text-stone-500 dark:text-stone-400 font-sans">{openNote.pages} pages</span>
            </div>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
          {openNote.recording && (
            <div className="bg-stone-900 dark:bg-stone-800 rounded-2xl p-4 mb-6 shadow-sm overflow-hidden relative cursor-pointer group">
              <div className="absolute inset-0 bg-stone-800 dark:bg-stone-700 opacity-0 group-hover:opacity-50 transition-opacity" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-stone-800 dark:bg-stone-700 border border-stone-700 dark:border-stone-600 flex items-center justify-center">
                  <Play size={20} className="fill-white text-white ml-1" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white font-sans mb-1">Class Recording available</div>
                  <div className="text-xs text-stone-400 font-sans">Watch the explanation for this note</div>
                </div>
              </div>
            </div>
          )}

          {openNote.file_path ? (
            <div className="space-y-4">
              <div className="text-xs font-semibold tracking-wider uppercase text-stone-500 dark:text-stone-400 font-sans mb-2">Document Access</div>
              <button
                onClick={async () => {
                  try {
                     const { data } = await supabase.storage.from('app-files').createSignedUrl(openNote.file_path, 3600);
                     if (data?.signedUrl) window.open(data.signedUrl, '_blank');
                  } catch (e) { console.error(e); }
                }}
                className="w-full bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-stone-300 transition-all group cursor-pointer text-left"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl shrink-0 flex items-center justify-center ${sc.bg} group-hover:scale-110 transition-transform`}>
                    <FileText size={24} className={sc.fg} />
                  </div>
                  <div>
                    <div className="font-bold text-stone-900 dark:text-stone-50 text-lg mb-1 group-hover:text-amber-600 transition-colors">
                      Open Original File
                    </div>
                    <div className="text-sm font-medium text-stone-500 dark:text-stone-400">
                      View or download the full document securely.
                    </div>
                  </div>
                </div>
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-xs font-semibold tracking-wider uppercase text-stone-500 dark:text-stone-400 font-sans">Pages</div>
              {Array.from({ length: openNote.pages || 1 }).map((_, i) => (
                <div key={i} className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 aspect-[1/1.4] flex items-center justify-center relative overflow-hidden shadow-sm group">
                  <div className="text-8xl opacity-10">📄</div>
                  <div className="absolute bottom-4 right-4 bg-stone-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold font-mono">
                    {i + 1}
                  </div>
                  <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/5 transition-colors cursor-pointer" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (subject) {
    const sc = SUBJECTS[subject] || SUBJECTS.Physics;
    return (
      <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950 animate-slideInRight">
        <div className="px-6 py-4 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shrink-0 sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <button 
              onClick={() => { setSubject(null); setSearch(""); }} 
              className="flex items-center gap-1 bg-transparent border-none cursor-pointer font-sans text-sm font-semibold text-stone-500 dark:text-stone-400 hover:text-stone-900 transition-colors"
            >
              <ChevronLeft size={18} /> Library
            </button>
            <button 
              onClick={() => handleUploadTrigger(subject)}
              disabled={isUploading}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                isUploading 
                  ? "bg-emerald-100 text-emerald-500 cursor-not-allowed" 
                  : "bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300"
              }`}
            >
              {isUploading ? <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /> : <Plus size={16} />}
            </button>
          </div>
          
          <input 
             type="file" 
             className="hidden" 
             ref={fileInputRef} 
             onChange={handleFileChange} 
          />
          
          <div className="flex items-center gap-4 mb-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${sc.bg}`}>
              {sc.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans mb-1">
                {subject}
              </h2>
              <div className="text-sm text-stone-500 dark:text-stone-400 font-sans">
                {currentSubjectNotes.length} notes available
              </div>
            </div>
          </div>
          
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500 dark:text-stone-400" />
            <input 
              type="text" 
              placeholder={`Search ${subject} notes...`} 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-sm font-sans text-stone-900 dark:text-stone-50 focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
          <div className="grid gap-3">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-10 text-sm font-sans text-stone-500 dark:text-stone-400">No notes found! Create a new one.</div>
            ) : (
              filteredNotes.map((note, i) => {
                const isSaved = note.is_saved;
                return (
                  <div 
                    key={note.id} 
                    onClick={() => setOpenNote(note)}
                    className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 shadow-sm flex gap-4 cursor-pointer hover:border-stone-300 hover:shadow-md transition-all animate-slide-up relative group"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className={`w-12 h-14 rounded-xl shrink-0 flex flex-col items-center justify-center gap-1 ${sc.bg}`}>
                      <FileText size={20} className={sc.fg} />
                    </div>
                    <div className="flex-1 min-w-0 pr-8 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1">
                        {note.is_new && (
                          <span className="text-[10px] font-bold tracking-wider uppercase text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded flex-none">
                            New
                          </span>
                        )}
                        <span className="text-xs text-stone-500 dark:text-stone-400 font-sans truncate">{note.uploaded}</span>
                      </div>
                      <div className="text-sm font-semibold text-stone-900 dark:text-stone-50 font-sans leading-tight mb-1 truncate">
                        {note.title}
                      </div>
                      <div className="text-xs text-stone-500 dark:text-stone-400 font-sans flex items-center gap-2">
                        {note.pages} pages {note.recording && "• 🔴 Recording"}
                      </div>
                    </div>
                    
                    <button 
                      onClick={(e) => toggleSave(note.id, isSaved, e)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-stone-300 hover:text-emerald-500 transition-colors z-10 block group-hover:hidden"
                    >
                      <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} className={isSaved ? "text-emerald-500" : ""} />
                    </button>
                    
                    <button 
                      onClick={(e) => deleteNote(note.id, e)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950">
      <div className="px-6 py-6 pb-4 shrink-0 animate-slide-up bg-stone-50 dark:bg-stone-950">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans mb-1">Library</h1>
        <p className="text-sm text-stone-500 dark:text-stone-400 font-sans">
          {notes.length} notes across {subjectsToDisplay.length} subjects
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide grid gap-4">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <div className="w-6 h-6 animate-spin rounded-full border-2 border-stone-300 border-t-emerald-500" />
          </div>
        ) : (
          subjectsToDisplay.map((subj, i) => {
            const sc = SUBJECTS[subj] || SUBJECTS.Physics;
            const subjectNotes = notes.filter(n => n.subject === subj);
            const newCount = subjectNotes.filter(n => n.is_new).length;
            
            return (
              <div 
                key={subj} 
                onClick={() => setSubject(subj)} 
                className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm cursor-pointer hover:border-stone-300 hover:shadow-md transition-all animate-slide-up flex gap-5 items-center group"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className={`w-14 h-14 rounded-2xl shrink-0 flex items-center justify-center text-3xl ${sc.bg}`}>
                  {sc.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-lg font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans mb-1">
                    {subj}
                  </div>
                  <div className="text-sm text-stone-500 dark:text-stone-400 font-sans">
                    {subjectNotes.length} notes
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  {newCount > 0 && (
                    <span className="text-[10px] font-bold px-2 py-1 rounded-md tracking-wider uppercase bg-blue-50 text-blue-700">
                      {newCount} New
                    </span>
                  )}
                  <ChevronRight size={20} className="text-stone-300 group-hover:text-stone-500 transition-colors" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
