import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { SectionLabel, Btn, Chip, Sheet } from "../shared/UI";
import { Copy, MessageSquare, ReceiptText, CreditCard, Clock, History, Check, ChevronRight, CheckCircle2, AlertCircle, Download, Sparkles, Pin } from "lucide-react";

const PARENT_FEES: any[] = [];

export default function ParentFees() {
  const [notifySheet, setNotifySheet] = useState(false);
  const [upiCopied, setUpiCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  
  const fees = PARENT_FEES;
  const due = fees.find((f) => f.status === "due");

  const copyUpi = () => {
    setUpiCopied(true);
    setTimeout(() => setUpiCopied(false), 2000);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-stone-950 scrollbar-hide overflow-y-auto">
      {/* Premium Header */}
      <div className="px-6 py-8 pb-4 shrink-0 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 sticky top-0 z-20 animate-slide-up">
        <div className="max-w-7xl mx-auto w-full relative z-10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6 mb-2">
            <div className="flex items-center gap-6">
              <div className="w-14 h-18 rounded-2xl bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 flex items-center justify-center text-3xl shadow-sm hidden md:flex">
                💳
              </div>
              <div>
                <h1 className="text-3xl font-bold text-heading tracking-tight mb-1 uppercase">Fees & Billing</h1>
                <p className="text-[10px] font-medium text-muted uppercase tracking-[0.2em] leading-none">Rohan Das · Class 8 · 2025-26 Session</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-10 pb-24 space-y-10 mt-8">
        {due && !confirmed && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-10 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800/50 shadow-sm relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-amber-400" />
            
            <div className="flex items-center gap-2.5 mb-8 bg-amber-50 dark:bg-amber-950/30 w-max px-3 py-1.5 rounded-lg border border-amber-100 dark:border-amber-900/30">
               <Clock size={14} weight="bold" className="text-amber-600" />
               <span className="text-[9px] font-bold uppercase tracking-widest text-amber-700">
                  Payment Due
               </span>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10 pb-8 border-b border-stone-50 dark:border-stone-800/50">
              <div>
                <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-3">{due.month} Installment</div>
                <div className="text-5xl font-bold font-display text-heading tracking-tight leading-none"> ₹{due.amount.toLocaleString("en-IN")} </div>
                <div className="flex items-center gap-2 mt-6 text-[9px] font-bold uppercase tracking-widest text-rose-600 px-3 py-1.5 rounded-lg bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-900/30 w-max"> 
                   <AlertCircle size={12} weight="bold" />
                   <span>Deadline: {due.dueDate}</span>
                </div>
              </div>
              <div className="bg-stone-50 dark:bg-stone-800 text-muted px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-widest border border-stone-100 dark:border-stone-700/50">
                PENDING
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setNotifySheet(true)}
                className="p-5 rounded-[20px] font-sans text-sm tracking-wide font-bold cursor-pointer border-none bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-md flex items-center justify-center gap-3 transition-all hover:bg-stone-800 dark:hover:bg-white"
              >
                <MessageSquare size={18} strokeWidth={2.5} /> Notify Sir of Payment
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: "rgba(0,0,0,0.02)" }}
                whileTap={{ scale: 0.98 }}
                onClick={copyUpi}
                className="p-5 rounded-[20px] font-sans text-sm tracking-wide font-bold cursor-pointer bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-200 border border-stone-200/60 dark:border-stone-800/60 flex items-center justify-center gap-3 shadow-sm transition-all hover:border-stone-300 dark:hover:border-stone-700 hover:shadow-md"
              >
                {upiCopied ? <Check size={18} strokeWidth={3} className="text-emerald-500 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]" /> : <Copy size={18} strokeWidth={2.5} className="text-stone-400" />}
                {upiCopied ? "UPI Copied!" : "Copy Parent UPI ID"}
              </motion.button>
            </div>
          </motion.div>
        )}

        {confirmed && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[32px] p-8 md:p-10 bg-sky-50/50 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-900/40 flex flex-col md:flex-row gap-8 items-center md:items-start shadow-sm"
          >
            <div className="w-20 h-20 rounded-[24px] bg-white dark:bg-stone-900 flex items-center justify-center text-4xl shadow-sm border border-sky-100 dark:border-sky-800/50 italic font-black text-sky-500 shrink-0">⏳</div>
            <div className="text-center md:text-left">
              <div className="text-xl font-black text-sky-900 dark:text-sky-100 font-sans tracking-tight mb-2">Awaiting Confirmation</div>
              <p className="text-sm font-bold text-sky-700 dark:text-sky-300/80 max-w-sm font-sans leading-relaxed">Sir has been notified about the payment for {due?.month}. The receipt will be available here once approved.</p>
            </div>
          </motion.div>
        )}

        <div className="space-y-6">
          <SectionLabel>Payment History</SectionLabel>
          <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800/50 rounded-3xl shadow-sm flex flex-col p-16 text-center items-center justify-center min-h-[300px] relative overflow-hidden group">
             <div className="absolute inset-0 bg-stone-50/50 dark:bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="w-20 h-20 bg-stone-50 dark:bg-stone-800/50 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner relative z-10 transition-transform duration-700 group-hover:scale-105 border border-stone-100 dark:border-stone-700/50">
                <History size={32} className="text-stone-300 dark:text-stone-600" weight="duotone" />
             </div>
             <div className="relative z-10">
                <p className="text-xl font-bold text-heading font-display tracking-tight mb-3 uppercase">History Clean</p>
                <p className="text-[11px] font-medium text-muted font-sans max-w-[240px] mx-auto leading-relaxed uppercase tracking-wider">Verified receipts will be archived here.</p>
             </div>
          </div>
        </div>

        <motion.div 
          whileHover={{ y: -4 }}
          className="shrink-0 pt-4"
        >
          <Btn label="Request Statement (PDF)" variant="outline" full icon={<ReceiptText size={20} strokeWidth={2.5} />} className="py-6 rounded-[24px] shadow-sm" />
        </motion.div>
      </div>

      <Sheet open={notifySheet} onClose={() => setNotifySheet(false)} title="Verify Notification">
        <div className="space-y-10 p-2 max-w-2xl mx-auto w-full">
          <div className="bg-amber-50 dark:bg-amber-500/5 rounded-[32px] p-8 md:p-10 border border-amber-200/60 dark:border-amber-900/40 relative overflow-hidden shadow-sm">
            <div className="text-[10px] font-black tracking-widest uppercase text-amber-600 dark:text-amber-500 mb-6 font-sans flex items-center gap-2">
              <Sparkles size={14} className="animate-pulse" /> Outgoing Signal
            </div>
            <div className="text-xl md:text-2xl text-amber-950 dark:text-amber-100 leading-relaxed font-sans italic font-bold relative z-10">
              "Sir, I have successfully transferred ₹2,500 for May 2025 session fees via UPI. Kindly acknowledge. — Rohan's Parent"
            </div>
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <MessageSquare size={120} strokeWidth={1} />
            </div>
          </div>
          <div className="text-sm text-stone-500 dark:text-stone-400 font-sans font-bold text-center px-4 md:px-8 leading-relaxed italic border-l-2 border-stone-200 dark:border-stone-800 ml-4">
            "By proceeding, you verify that the transfer has been initiated on your bank application."
          </div>
          <Btn label="Broadcast Notification" full onClick={() => { setNotifySheet(false); setConfirmed(true); }} className="shadow-md py-6 text-base" />
        </div>
      </Sheet>
    </div>
  );
}
