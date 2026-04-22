import { ReactNode } from "react";

export function Btn({ 
  label, 
  onClick, 
  full, 
  icon, 
  variant = 'primary',
  disabled,
  className = "",
  id,
}: { 
  label: string; 
  onClick?: () => void; 
  full?: boolean; 
  icon?: ReactNode; 
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  disabled?: boolean;
  className?: string;
  id?: string;
}) {
  const baseClass = "font-sans font-bold flex items-center justify-center gap-2 transition-all duration-300 rounded-xl px-5 py-3 text-[11px] uppercase tracking-widest active:scale-[0.98]";
  const wClass = full ? "w-full" : "w-auto";
  const dClass = disabled ? "opacity-40 cursor-not-allowed pointer-events-none" : "";
  
  let vClass = "";
  switch (variant) {
    case 'primary':
      vClass = "bg-stone-900 text-white hover:bg-black dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white border border-transparent";
      break;
    case 'secondary':
      vClass = "bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-100 hover:bg-stone-200 dark:hover:bg-stone-700 border border-transparent";
      break;
    case 'danger':
      vClass = "bg-rose-600 text-white hover:bg-rose-700 border border-transparent";
      break;
    case 'outline':
      vClass = "bg-transparent text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-800 hover:bg-stone-50 dark:hover:bg-stone-900";
      break;
    case 'ghost':
      vClass = "bg-transparent text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800";
      break;
  }
  return (
    <button id={id} onClick={onClick} disabled={disabled} className={`${baseClass} ${wClass} ${vClass} ${dClass} ${className}`}>
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
    paid: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/50",
    due: "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border-amber-100 dark:border-amber-900/50",
    overdue: "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border-rose-100 dark:border-rose-900/50",
    pending_confirm: "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 border-stone-200 dark:border-stone-700",
    submitted: "bg-stone-50 text-stone-500 dark:bg-stone-900 dark:text-stone-500 border-stone-200 dark:border-stone-800",
    graded: "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-transparent",
    new: "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-transparent",
    active: "bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 border-transparent",
    default: "bg-white text-muted dark:bg-stone-900 border-stone-100/50 dark:border-stone-800/50"
  };
  
  const vClass = active ? variants["active"] : (variants[variant] || variants.default);
  const sizeClass = small ? "text-[11px] px-2.5 py-0.5" : "text-[12px] px-3.5 py-1";
  
  const customStyles = {
    backgroundColor: bg,
    color: color,
    borderColor: border,
    ...style
  };
  
  return (
    <span 
      style={customStyles}
      className={`inline-flex items-center rounded-lg font-medium font-sans whitespace-nowrap border transition-all ${sizeClass} ${vClass}`}
    >
      {label}
    </span>
  );
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted font-sans mb-6 leading-none">
      {children}
    </div>
  );
}

export function EmptySlate({ icon, title, sub }: { icon: string; title: string; sub: string }) {
  return (
    <div className="p-16 text-center border border-stone-100/50 dark:border-stone-900/50 rounded-3xl bg-white dark:bg-stone-950">
      <div className="text-4xl mb-8 opacity-40">{icon}</div>
      <div className="text-xl font-bold mb-3 font-display text-heading tracking-tight uppercase">{title}</div>
      <div className="text-[12px] font-medium font-sans text-muted max-w-[240px] mx-auto leading-relaxed uppercase tracking-wide">{sub}</div>
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
      className="absolute inset-0 z-[60] bg-stone-900/5 dark:bg-stone-950/20 backdrop-blur-sm flex items-end animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full bg-white dark:bg-stone-950 rounded-t-[40px] pt-2 border-t border-stone-100 dark:border-stone-900/50 max-h-[92%] overflow-y-auto scrollbar-hide shadow-2xl"
      >
        <div className="w-10 h-1 bg-stone-100 dark:bg-stone-800 rounded-full mx-auto mt-4 mb-10" />
        <div className="px-8 pb-16 max-w-4xl mx-auto">
          {title && (
            <div className="text-xl font-bold mb-10 font-display text-heading tracking-tight uppercase">
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


// ─── Skeleton loader ──────────────────────────────────────────────────────────
// Use these instead of spinners to show loading states that match layout shape.
export function Skeleton({
  variant = "line",
  width,
  height,
  className = "",
}: {
  variant?: "line" | "card" | "avatar" | "text";
  width?: string;
  height?: string;
  className?: string;
  key?: any;
}) {
  const base = "animate-pulse bg-stone-100 dark:bg-stone-800 rounded-xl";

  if (variant === "avatar") {
    return (
      <div
        className={`${base} rounded-[20px] shrink-0 ${className}`}
        style={{ width: width || "4rem", height: height || "4rem" }}
        aria-hidden="true"
      />
    );
  }

  if (variant === "card") {
    return (
      <div
        className={`${base} rounded-[32px] ${className}`}
        style={{ width: width || "100%", height: height || "12rem" }}
        aria-hidden="true"
      />
    );
  }

  if (variant === "text") {
    return (
      <div className={`space-y-2 ${className}`} aria-hidden="true">
        <div className={`${base} h-4`} style={{ width: "75%" }} />
        <div className={`${base} h-4`} style={{ width: "90%" }} />
        <div className={`${base} h-4`} style={{ width: "55%" }} />
      </div>
    );
  }

  // default: single line
  return (
    <div
      className={`${base} h-4 ${className}`}
      style={{ width: width || "100%" }}
      aria-hidden="true"
    />
  );
}

export function SkeletonList({ count = 3, variant = "card" }: { count?: number; variant?: "card" | "line" | "text" }) {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading content">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} variant={variant} />
      ))}
    </div>
  );
}

