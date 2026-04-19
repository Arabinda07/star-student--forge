import { useState, useRef, useEffect, ChangeEvent } from "react";
import { SUBJECTS } from "../../constants";
import { SectionLabel, Btn, Chip, EmptySlate, Sheet } from "../shared/UI";
import { ChevronLeft, ChevronRight, Search, FileText, Upload, CheckCircle2, Plus, Trash2, Download } from "lucide-react";
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

  // Use the fetched notes state from parent OR implement fetch inside this component since it's Teacher
  // Actually, this component currently doesn't query the DB, it queries INITIAL_NOTES.
  // We need to make TeacherLibrary also query 'notes' table and show the files.
  const [notes, setNotes] = useState<any[]>([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);

  useEffect(() => {
    fetchNotes();
  }, [subject]); // Refetch if subject changes, but actually fetch all notes first

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
        pages: 1, // dynamically inferring PDF pages requires extra libraries, defaulting to 1
        is_new: true,
        // Save the file path in DB
        file_path: filePath
      };

      const { data: noteData, error: dbError } = await supabase.from('notes').insert([newNote]).select();
      if (dbError) throw dbError;

      // Update local state
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
      setStep("form"); // go back to show error
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
    const currentSubjectNotes = notes.filter(n => n.subject === subject);
    const sc = SUBJECTS[subject] || SUBJECTS.Physics;
    return (
      <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950 animate-slideInRight">
        <div className="px-6 py-4 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shrink-0 sticky top-0 z-10">
          <button onClick={() => setSubject(null)} className="flex items-center gap-1 bg-transparent border-none cursor-pointer font-sans text-sm font-semibold text-stone-500 dark:text-stone-400 hover:text-stone-900 transition-colors mb-4">
            <ChevronLeft size={18} /> Library
          </button>
          <div className="flex items-center gap-4 mb-2">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${sc.bg}`}>
              {sc.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans leading-tight">{subject}</h2>
              <div className="text-sm font-medium text-stone-500 dark:text-stone-400 font-sans">{currentSubjectNotes.length} notes uploaded</div>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide grid gap-3">
          {isLoadingNotes ? (
             <div className="flex items-center justify-center py-10">
               <div className="w-6 h-6 animate-spin rounded-full border-2 border-stone-300 border-t-emerald-500" />
             </div>
          ) : currentSubjectNotes.length === 0 ? (
            <EmptySlate icon="📚" title="No notes yet" sub="Upload your first note for this subject." />
          ) : (
            currentSubjectNotes.map((note, i) => (
              <div 
                key={note.id} 
                className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm flex gap-4 p-4 animate-slide-up hover:border-stone-300 transition-all hover:shadow-md relative group"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className={`w-12 h-14 rounded-xl shrink-0 flex flex-col items-center justify-center gap-1 ${sc.bg}`}>
                  <FileText size={20} className={sc.fg} />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center pr-8">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    {note.is_new && (
                      <span className="text-[9px] font-bold tracking-wider uppercase bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                        New
                      </span>
                    )}
                    <span className="text-[11px] font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">{note.uploaded}</span>
                  </div>
                  <div className="text-sm font-bold text-stone-900 dark:text-stone-50 font-sans leading-tight mb-1 truncate">
                    {note.file_path ? (
                      <a 
                         className="hover:underline"
                         onClick={async (e) => {
                           e.preventDefault();
                           const { data } = await supabase.storage.from('app-files').createSignedUrl(note.file_path, 3600);
                           if (data?.signedUrl) window.open(data.signedUrl, '_blank');
                         }}
                      >
                         {note.title}
                      </a>
                    ) : (
                      note.title
                    )}
                  </div>
                  <div className="text-xs font-medium text-stone-500 dark:text-stone-400 font-sans">{note.pages} pages</div>
                </div>
                <div className="flex items-center gap-2">
                  {note.file_path && (
                    <button
                      onClick={() => handleDownload(note.file_path, note.title)}
                      className="p-2 text-stone-400 hover:text-stone-600 dark:hover:text-stone-300 transition-colors cursor-pointer"
                      title="Download"
                    >
                      <Download size={18} />
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(note.id, note.file_path)}
                    className="p-2 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
          <div className="mt-4">
            <Btn label="Upload Note" variant="primary" full icon={<Upload size={16} />} onClick={() => { setForm({ ...form, subject: subject }); setUploadSheet(true); }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950">
      <div className="px-6 py-6 pb-4 shrink-0 animate-slide-up sticky top-0 bg-stone-50 dark:bg-stone-950 z-10">
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans">Library</h1>
          <button 
            onClick={() => setUploadSheet(true)}
            className="w-11 h-11 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-sm hover:scale-105 active:scale-95 transition-all"
          >
            <Plus size={20} />
          </button>
        </div>
        <p className="text-sm font-medium text-stone-500 dark:text-stone-400 font-sans">{notes.length} notes · {subjects.length} subjects</p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide grid gap-4">
        {subjects.map((subj, i) => {
          const sc = SUBJECTS[subj] || SUBJECTS.Physics;
          const subjNotes = notes.filter(n => n.subject === subj);
          const newCount = subjNotes.filter(n => n.is_new).length;
          return (
            <div 
              key={subj} 
              onClick={() => setSubject(subj)} 
              className="bg-white dark:bg-stone-900 rounded-[20px] p-5 border border-stone-200 dark:border-stone-800 shadow-sm cursor-pointer hover:border-stone-300 transition-all animate-slide-up flex gap-4 items-center"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 ${sc.bg}`}>
                {sc.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-lg font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans mb-1">{subj}</div>
                <div className="text-sm font-medium text-stone-500 dark:text-stone-400 font-sans">{subjNotes.length} notes uploaded</div>
              </div>
              <ChevronRight size={20} className="text-stone-300" />
            </div>
          );
        })}
      </div>

      <Sheet open={uploadSheet} onClose={() => { setUploadSheet(false); setStep("form"); }} title={step === "done" ? undefined : "Upload Note"}>
        {step === "form" && (
          <div className="flex flex-col gap-5">
            <div 
              className="border-2 border-dashed border-stone-300 dark:border-stone-700 rounded-[20px] p-8 text-center bg-stone-50 dark:bg-stone-950 hover:bg-stone-100 dark:hover:bg-stone-900 cursor-pointer transition-colors hover:border-amber-400 group relative"
              onClick={() => fileInputRef.current?.click()}
            >
              <input 
                 type="file"
                 ref={fileInputRef}
                 className="hidden"
                 onChange={handleFileChange}
              />
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📄</div>
              {form.file ? (
                <>
                  <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-sans mb-1">{form.file.name}</div>
                  <div className="text-xs font-medium text-stone-500 dark:text-stone-400 font-sans">Ready to upload</div>
                </>
              ) : (
                <>
                  <div className="text-sm font-bold text-stone-900 dark:text-stone-50 font-sans mb-1">Click to browse or drag PDF here</div>
                  <div className="text-xs font-medium text-stone-500 dark:text-stone-400 font-sans">Max file size 10MB</div>
                </>
              )}
            </div>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="note-title" className="block text-[10px] font-bold tracking-widest uppercase text-stone-500 dark:text-stone-400 font-sans mb-2">Note Title</label>
                <input 
                  id="note-title"
                  value={form.title} 
                  onChange={(e) => setForm({ ...form, title: e.target.value })} 
                  placeholder="e.g. Newton's Laws — Chapter 5" 
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 dark:border-stone-800 font-sans text-sm bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-50 outline-none focus:border-amber-500 focus:bg-white transition-all shadow-sm focus:shadow-md"
                />
              </div>
              
              <div>
                <label id="subject-label" className="block text-[10px] font-bold tracking-widest uppercase text-stone-500 dark:text-stone-400 font-sans mb-2">Subject</label>
                <div role="radiogroup" aria-labelledby="subject-label" className="flex gap-2 flex-wrap">
                  {subjects.map((s) => {
                    const sel = form.subject === s;
                    return (
                      <button 
                        key={s} 
                        role="radio"
                        aria-checked={sel}
                        onClick={() => setForm({ ...form, subject: s })} 
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all duration-200 cursor-pointer font-sans border ${
                          sel ? "bg-stone-900 border-stone-900 text-white shadow-sm" : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {errorMsg && <div className="text-rose-500 text-xs font-bold text-center mt-2">{errorMsg}</div>}
            </div>

            <Btn 
              label="Preview & Upload" 
              variant="primary"
              full 
              onClick={handleUpload} 
            />
          </div>
        )}
        
        {step === "preview" && (
          <div className="space-y-6">
            <div className="bg-stone-50 dark:bg-stone-950 rounded-2xl border border-stone-200 dark:border-stone-800 p-6 text-center">
              <div className="text-4xl mb-3">📄</div>
              <div className="text-lg font-bold text-stone-900 dark:text-stone-50 font-sans mb-2">{form.title}</div>
              <div className="flex gap-2 justify-center">
                <span className="text-xs font-semibold text-stone-600 dark:text-stone-300 bg-stone-200 dark:bg-stone-700 rounded-md px-2.5 py-1 font-sans">{form.subject}</span>
                <span className="text-xs font-semibold text-stone-600 dark:text-stone-300 bg-stone-200 dark:bg-stone-700 rounded-md px-2.5 py-1 font-sans">{form.file?.name}</span>
              </div>
            </div>
            
            {errorMsg && <div className="text-rose-500 text-xs font-bold text-center mb-[-10px]">{errorMsg}</div>}

            <div className="flex gap-3">
              <Btn label="Edit" variant="outline" full onClick={() => setStep("form")} />
              <Btn label={isUploading ? "Uploading..." : "Confirm Upload"} variant="primary" full onClick={handleConfirm} disabled={isUploading} />
            </div>
          </div>
        )}
        
        {step === "done" && (
          <div className="text-center py-8">
            <div className="text-emerald-500 mb-4 flex justify-center animate-slide-up">
              <CheckCircle2 size={64} strokeWidth={2.5} />
            </div>
            <div className="text-2xl font-bold text-stone-900 dark:text-stone-50 font-sans tracking-tight mb-2">Uploaded!</div>
            <div className="text-sm font-medium text-stone-500 dark:text-stone-400 font-sans leading-relaxed">
              Note added to {form.subject} library.<br />Students have been notified.
            </div>
          </div>
        )}
      </Sheet>
    </div>
  );
}
