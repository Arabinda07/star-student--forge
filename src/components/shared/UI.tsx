import { ReactNode } from "react";

export function Btn({ 
  label, 
  onClick, 
  full, 
  icon, 
  variant = 'primary',
  disabled,
  className = "",
}: { 
  label: string; 
  onClick?: () => void; 
  full?: boolean; 
  icon?: ReactNode; 
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  disabled?: boolean;
  className?: string;
}) {
  const baseClass = "font-sans font-bold flex items-center justify-center gap-2 transition-all duration-300 rounded-[14px] px-6 py-3 text-xs uppercase tracking-widest active:scale-[0.97] active:brightness-90";
  const wClass = full ? "w-full" : "w-auto";
  const dClass = disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : "";
  
  let vClass = "";
  switch (variant) {
    case 'primary':
      vClass = "bg-stone-900 text-white hover:bg-black dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white shadow-[0_4px_12px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_20px_rgba(0,0,0,0.15)]";
      break;
    case 'secondary':
      vClass = "bg-brand-500/10 text-brand-700 dark:text-brand-400 hover:bg-brand-500/20 border border-brand-500/10";
      break;
    case 'danger':
      vClass = "bg-rose-500 text-white hover:bg-rose-600 shadow-md";
      break;
    case 'outline':
      vClass = "bg-transparent text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:border-brand-500/30 hover:bg-stone-50/50";
      break;
    case 'ghost':
      vClass = "bg-transparent text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 hover:bg-stone-100/50 dark:hover:bg-stone-800/50";
      break;
  }
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseClass} ${wClass} ${vClass} ${dClass} ${className}`}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
    </button>
  );
}

export function Chip({ 
  label, 
  variant = "default", 
  small, 
  style = {},
  bg,
  color,
  border,
  active,
}: { 
  label: any; 
  variant?: string; 
  small?: boolean; 
  style?: any;
  bg?: string;
  color?: string;
  border?: string;
  active?: boolean;
}) {
  const variants: Record<string, string> = {
    paid: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    due: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    overdue: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    pending_confirm: "bg-brand-500/10 text-brand-600 border-brand-500/20",
    submitted: "bg-stone-500/10 text-stone-600 dark:text-stone-400 border-stone-500/20",
    graded: "bg-sky-500/10 text-sky-600 border-sky-500/20",
    new: "bg-brand-500 text-white border-brand-600",
    positive: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    mixed: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    active: "bg-brand-900 dark:bg-stone-100 text-white dark:text-stone-900 border-transparent shadow-lg shadow-brand-900/10",
    default: "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-800"
  };
  
  const vClass = active ? variants["active"] : (variants[variant] || variants.default);
  const sizeClass = small ? "text-[9px] px-2 py-0.5" : "text-[10px] px-3 py-1";
  
  const customStyles = {
    backgroundColor: bg,
    color: color,
    borderColor: border,
    ...style
  };
  
  return (
    <span 
      style={customStyles}
      className={`inline-flex items-center rounded-lg font-black font-sans whitespace-nowrap uppercase tracking-wider border transition-all ${sizeClass} ${vClass}`}
    >
      {label}
    </span>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-[10px] font-black tracking-[0.25em] uppercase text-stone-400 dark:text-stone-500 font-sans mb-5">
      {children}
    </div>
  );
}

export function EmptySlate({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div className="p-12 text-center bg-white dark:bg-stone-900 rounded-[32px] border border-stone-100 dark:border-stone-800 shadow-sm relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-b from-stone-50/50 to-transparent dark:from-stone-800/10 pointer-events-none" />
      <div className="relative z-10">
        <div className="text-5xl mb-6 grayscale group-hover:grayscale-0 transition-all duration-700 bg-stone-50 dark:bg-stone-800 w-20 h-20 flex items-center justify-center rounded-[24px] mx-auto shadow-inner border border-stone-100 dark:border-stone-700">{icon}</div>
        <div className="text-lg font-black mb-2 font-display text-stone-900 dark:text-stone-50 tracking-tight uppercase">{title}</div>
        <div className="text-sm font-medium font-sans text-stone-400 dark:text-stone-500 max-w-[240px] mx-auto leading-relaxed">{sub}</div>
      </div>
    </div>
  );
}

export function Sheet({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}) {
  if (!open) return null;
  return (
    <div
      className="absolute inset-0 z-[60] bg-stone-950/20 backdrop-blur-md flex items-end animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-white/90 dark:bg-stone-900/95 backdrop-blur-xl rounded-t-[40px] pt-2 shadow-[0_-12px_40px_rgba(0,0,0,0.15)] max-h-[92%] overflow-y-auto scrollbar-hide animate-slide-sheet border-t border-white/20 dark:border-stone-800/50"
      >
        <div className="w-10 h-1 rounded-full bg-stone-200 dark:bg-stone-700 mx-auto mt-2 mb-8 opacity-50 hover:opacity-100 transition-opacity cursor-pointer" onClick={onClose} />
        <div className="px-8 pb-12">
          {title && (
            <div className="text-3xl font-black mb-10 font-display text-stone-900 dark:text-stone-50 tracking-tight uppercase">
              {title}
            </div>
          )}
          <div className="relative">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
