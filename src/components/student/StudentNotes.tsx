import React, { useState } from "react";
import { SUBJECTS } from "../../constants";
import { ChevronRight, ChevronLeft, Search, FileText, Bookmark, Play } from "lucide-react";
import { Note as NoteType } from "../../types";

const INITIAL_NOTES: Record<string, NoteType[]> = {
  Maths: [
    { id: 1, title: "Quadratic Equations — Full Derivation", uploaded: "Today, 3:15 PM", pages: 4, isNew: true, recording: true },
    { id: 2, title: "Number Systems — NCERT Summary", uploaded: "Yesterday", pages: 3, isNew: false, recording: true },
    { id: 3, title: "Polynomials — Important Questions", uploaded: "4 Apr", pages: 6, isNew: false },
    { id: 4, title: "Coordinate Geometry — Formula Sheet", uploaded: "2 Apr", pages: 2, isNew: false }
  ],
  Physics: [
    { id: 5, title: "Newton's Laws — Complete Notes", uploaded: "Today, 4:00 PM", pages: 6, isNew: true, recording: true },
    { id: 6, title: "Motion — Distance, Displacement, Velocity", uploaded: "Last Week", pages: 5, isNew: false },
    { id: 7, title: "Work, Power, Energy — Important Questions", uploaded: "22 Mar", pages: 4, isNew: false }
  ],
  Science: [
    { id: 8, title: "Cell Structure — Labelled Diagrams", uploaded: "Yesterday", pages: 4, isNew: true, recording: true },
    { id: 9, title: "Microorganisms — Friend and Foe", uploaded: "Last Week", pages: 7, isNew: false }
  ]
};

export default function StudentNotes() {
  const [subject, setSubject] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [openNote, setOpenNote] = useState<NoteType | null>(null);
  const [saved, setSaved] = useState<number[]>([]);

  const subjects = Object.keys(INITIAL_NOTES);
  const notes = subject ? INITIAL_NOTES[subject] || [] : [];
  
  const filteredNotes = notes.filter(n => n.title.toLowerCase().includes(search.toLowerCase()));

  const toggleSave = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSaved(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  if (openNote && subject) {
    const sc = SUBJECTS[subject] || SUBJECTS.Physics;
    const isSaved = saved.includes(openNote.id);
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
            <button 
              onClick={(e) => toggleSave(openNote.id, e)}
              className="bg-transparent border-none cursor-pointer text-stone-500 dark:text-stone-400 hover:text-emerald-500 transition-colors"
            >
              <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} className={isSaved ? "text-emerald-500" : ""} />
            </button>
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
            <div className="bg-stone-900 rounded-2xl p-4 mb-6 shadow-sm overflow-hidden relative cursor-pointer group">
              <div className="absolute inset-0 bg-stone-800 opacity-0 group-hover:opacity-50 transition-opacity" />
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center">
                  <Play size={20} className="fill-white text-white ml-1" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white font-sans mb-1">Class Recording available</div>
                  <div className="text-xs text-stone-500 dark:text-stone-400 font-sans">Watch the explanation for this note</div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="text-xs font-semibold tracking-wider uppercase text-stone-500 dark:text-stone-400 font-sans">Pages</div>
            {Array.from({ length: openNote.pages }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 aspect-[1/1.4] flex items-center justify-center relative overflow-hidden shadow-sm group">
                <div className="text-8xl opacity-10">📄</div>
                <div className="absolute bottom-4 right-4 bg-stone-900/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold font-mono">
                  {i + 1}
                </div>
                <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/5 transition-colors cursor-pointer" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (subject) {
    const sc = SUBJECTS[subject] || SUBJECTS.Physics;
    return (
      <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950 animate-slideInRight">
        <div className="px-6 py-4 bg-white dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 shrink-0 sticky top-0 z-10">
          <button 
            onClick={() => { setSubject(null); setSearch(""); }} 
            className="flex items-center gap-1 bg-transparent border-none cursor-pointer font-sans text-sm font-semibold text-stone-500 dark:text-stone-400 hover:text-stone-900 transition-colors mb-4"
          >
            <ChevronLeft size={18} /> Library
          </button>
          
          <div className="flex items-center gap-4 mb-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl ${sc.bg}`}>
              {sc.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans mb-1">
                {subject}
              </h2>
              <div className="text-sm text-stone-500 dark:text-stone-400 font-sans">
                {INITIAL_NOTES[subject]?.length || 0} notes available
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
              className="w-full pl-9 pr-4 py-2.5 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl text-sm font-sans text-stone-900 dark:text-stone-50 focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-100 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
          <div className="grid gap-3">
            {filteredNotes.length === 0 ? (
              <div className="text-center py-10 text-sm font-sans text-stone-500 dark:text-stone-400">No notes found.</div>
            ) : (
              filteredNotes.map((note, i) => {
                const isSaved = saved.includes(note.id);
                return (
                  <div 
                    key={note.id} 
                    onClick={() => setOpenNote(note)}
                    className="bg-white dark:bg-stone-900 rounded-2xl p-4 border border-stone-200 dark:border-stone-800 shadow-sm flex gap-4 cursor-pointer hover:border-stone-300 hover:shadow-md transition-all animate-slide-up"
                    style={{ animationDelay: `${i * 0.05}s` }}
                  >
                    <div className={`w-12 h-14 rounded-xl shrink-0 flex flex-col items-center justify-center gap-1 ${sc.bg}`}>
                      <FileText size={20} className={sc.fg} />
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1">
                        {note.isNew && (
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
                      onClick={(e) => toggleSave(note.id, e)}
                      className="shrink-0 p-2 text-stone-300 hover:text-emerald-500 transition-colors"
                    >
                      <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} className={isSaved ? "text-emerald-500" : ""} />
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
          {Object.values(INITIAL_NOTES).flat().length} notes across {subjects.length} subjects
        </p>
      </div>
      
      <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-hide grid gap-4">
        {subjects.map((subj, i) => {
          const sc = SUBJECTS[subj] || SUBJECTS.Physics;
          const subjectNotes = INITIAL_NOTES[subj] || [];
          const newCount = subjectNotes.filter(n => n.isNew).length;
          
          return (
            <div 
              key={subj} 
              onClick={() => setSubject(subj)} 
              className="bg-white dark:bg-stone-900 rounded-2xl p-5 border border-stone-200 dark:border-stone-800 shadow-sm cursor-pointer hover:border-stone-300 hover:shadow-md transition-all animate-slide-up flex gap-5 items-center"
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
                <ChevronRight size={20} className="text-stone-300" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
