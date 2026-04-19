import { ReactNode } from "react";

export function Btn({ 
  label, 
  onClick, 
  full, 
  icon, 
  variant = 'primary', // 'primary' | 'secondary' | 'danger'
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
  const baseClass = "font-sans font-semibold flex items-center justify-center gap-2 transition-all duration-200 rounded-xl px-4 py-3 text-sm active:scale-95";
  const wClass = full ? "w-full" : "w-auto";
  const dClass = disabled ? "opacity-50 cursor-not-allowed pointer-events-none grayscale" : "";
  
  let vClass = "";
  switch (variant) {
    case 'primary':
      vClass = "bg-stone-900 text-white hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white shadow-sm";
      break;
    case 'secondary':
      vClass = "bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-50 hover:bg-stone-200 border border-stone-200 dark:border-stone-800";
      break;
    case 'danger':
      vClass = "bg-rose-600 text-white hover:bg-rose-700 shadow-sm";
      break;
    case 'outline':
      vClass = "bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-200 border border-stone-300 dark:border-stone-700 hover:bg-stone-50";
      break;
    case 'ghost':
      vClass = "bg-transparent text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800";
      break;
  }
  return (
    <button onClick={onClick} disabled={disabled} className={`${baseClass} ${wClass} ${vClass} ${dClass} ${className}`}>
      {icon && <span className="flex items-center justify-center shrink-0">{icon}</span>}
      {label}
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
    paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
    due: "bg-amber-50 text-amber-700 border-amber-200",
    overdue: "bg-rose-50 text-rose-700 border-rose-200",
    pending_confirm: "bg-violet-50 text-violet-700 border-violet-200",
    submitted: "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 border-stone-200 dark:border-stone-800",
    graded: "bg-sky-50 text-sky-700 border-sky-200",
    new: "bg-blue-50 text-blue-700 border-blue-200",
    positive: "bg-emerald-50 text-emerald-700 border-emerald-200",
    mixed: "bg-amber-50 text-amber-700 border-amber-200",
    active: "bg-emerald-500 text-white border-emerald-600",
    default: "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-200 border-stone-200 dark:border-stone-800"
  };
  
  const vClass = active ? variants["active"] : (variants[variant] || variants.default);
  const sizeClass = small ? "text-[10px] px-2 py-0.5" : "text-xs px-3 py-1";
  
  const customStyles = {
    backgroundColor: bg,
    color: color,
    borderColor: border,
    ...style
  };
  
  return (
    <span 
      style={customStyles}
      className={`inline-flex items-center rounded-md font-bold font-sans whitespace-nowrap border ${sizeClass} ${vClass}`}
    >
      {label}
    </span>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-xs font-semibold tracking-widest uppercase text-stone-500 dark:text-stone-400 font-sans mb-4">
      {children}
    </div>
  );
}

export function EmptySlate({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div className="p-8 text-center bg-white dark:bg-stone-900 rounded-2xl border border-dashed border-stone-300 dark:border-stone-700">
      <div className="text-4xl mb-3 opacity-80">{icon}</div>
      <div className="text-base font-semibold mb-1.5 font-sans text-stone-900 dark:text-stone-50">{title}</div>
      <div className="text-sm font-sans text-stone-500 dark:text-stone-400 max-w-[200px] mx-auto leading-relaxed">{sub}</div>
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
      className="absolute inset-0 z-40 bg-stone-900/40 backdrop-blur-sm flex items-end animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-white dark:bg-stone-900 rounded-t-3xl pt-2 shadow-2xl max-h-[88%] overflow-y-auto scrollbar-hide animate-slide-sheet"
      >
        <div className="w-12 h-1.5 rounded-full bg-stone-200 dark:bg-stone-700 mx-auto mb-6" />
        <div className="px-6 pb-8">
          {title && (
            <div className="text-lg font-bold mb-6 font-sans text-stone-900 dark:text-stone-50">
              {title}
            </div>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
