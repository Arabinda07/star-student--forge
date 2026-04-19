import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COLORS } from "../../constants";
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
    <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950 scrollbar-hide overflow-y-auto">
      {/* Premium Header */}
      <div className="px-6 py-8 pb-4 shrink-0 animate-slide-up sticky top-0 bg-stone-50/80 dark:bg-stone-950/80 backdrop-blur-md z-20">
        <div className="max-w-4xl mx-auto w-full">
          <h1 className="text-3xl font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans mb-1">Fees</h1>
          <p className="text-sm font-medium text-stone-500 dark:text-stone-400">Rohan Das · Class 8 · 2025-26 Session</p>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-10 pb-24 space-y-10">
        {due && !confirmed && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[40px] p-10 bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-amber-500" />
            
            <div className="flex items-center gap-2 mb-8">
               <div className="w-8 h-8 rounded-full bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center">
                  <Clock size={16} className="text-amber-600 dark:text-amber-500" />
               </div>
               <span className="text-xs font-black uppercase tracking-[0.2em] text-amber-600 dark:text-amber-500 font-sans">
                  Action Required: Payment Due
               </span>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
              <div>
                <div className="text-sm font-bold text-stone-400 uppercase tracking-widest mb-1">{due.month} Installment</div>
                <div className="text-6xl font-black font-mono text-stone-900 dark:text-stone-50 tracking-tighter leading-none"> ₹{due.amount.toLocaleString("en-IN")} </div>
                <div className="flex items-center gap-2 mt-4 text-sm font-bold text-stone-500 dark:text-stone-400"> 
                   <span className="text-rose-500">Deadline: {due.dueDate}</span>
                </div>
              </div>
              <div className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-amber-200 dark:border-amber-800">
                PENDING
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setNotifySheet(true)}
                className="p-5 rounded-3xl font-sans text-base font-black cursor-pointer border-none bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 shadow-xl flex items-center justify-center gap-3 transition-all"
              >
                <MessageSquare size={20} fill="currentColor" /> Notify Sir of Payment
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02, backgroundColor: "rgba(0,0,0,0.05)" }}
                whileTap={{ scale: 0.98 }}
                onClick={copyUpi}
                className="p-5 rounded-3xl font-sans text-base font-black cursor-pointer bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-200 border-2 border-stone-100 dark:border-stone-800 flex items-center justify-center gap-3 shadow-md transition-all"
              >
                {upiCopied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                {upiCopied ? "UPI Copied!" : "Copy Parent UPI ID"}
              </motion.button>
            </div>
          </motion.div>
        )}

        {confirmed && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="rounded-[40px] p-8 bg-sky-50 dark:bg-sky-950/30 border-2 border-sky-100 dark:border-sky-900/40 flex gap-6 items-center shadow-lg"
          >
            <div className="w-16 h-16 rounded-3xl bg-white dark:bg-sky-900 flex items-center justify-center text-3xl shadow-sm italic font-black text-sky-500">⏳</div>
            <div>
              <div className="text-lg font-black text-sky-900 dark:text-sky-400 font-sans tracking-tight mb-1">Awaiting confirmation...</div>
              <div className="text-sm font-medium text-sky-700 dark:text-sky-500/80 font-sans leading-relaxed"> Payment signal has been broadcast. Sir will verify and update your digital receipt shortly. </div>
            </div>
          </motion.div>
        )}

        <div className="space-y-6">
          <SectionLabel>Payment History</SectionLabel>
          <div className="bg-white dark:bg-stone-900 border border-stone-100 dark:border-stone-800 rounded-[40px] shadow-sm flex flex-col p-12 text-center items-center justify-center min-h-[300px] relative overflow-hidden group">
             <div className="absolute inset-0 bg-stone-50 dark:bg-stone-950/50 opacity-0 group-hover:opacity-100 transition-opacity" />
             <div className="w-24 h-24 bg-stone-50 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative z-10 transition-transform duration-700 group-hover:scale-110">
                <History size={40} className="text-stone-300 dark:text-stone-600" />
             </div>
             <div className="relative z-10">
                <p className="text-xl font-black text-stone-900 dark:text-stone-50 font-sans tracking-tight mb-2">Clean Slate</p>
                <p className="text-sm font-medium text-stone-500 dark:text-stone-400 font-sans max-w-[200px] mx-auto leading-relaxed">Once you make a payment, your verified receipts will be archived here.</p>
             </div>
          </div>
        </div>

        <motion.div 
          whileHover={{ y: -4 }}
          className="shrink-0"
        >
          <Btn label="Request Statement (PDF)" variant="outline" full icon={<ReceiptText size={20} />} />
        </motion.div>
      </div>

      <Sheet open={notifySheet} onClose={() => setNotifySheet(false)} title="Verify Notification">
        <div className="space-y-8 p-2">
          <div className="bg-amber-50 dark:bg-amber-950/20 rounded-[32px] p-8 border border-amber-100 dark:border-amber-900/40 relative overflow-hidden">
            <div className="text-[10px] font-black tracking-[0.2em] uppercase text-amber-600 dark:text-amber-500 mb-4 font-sans flex items-center gap-2">
              <Sparkles size={14} /> Outgoing Signal
            </div>
            <div className="text-lg text-amber-950 dark:text-amber-200 leading-relaxed font-sans italic font-medium px-2">
              "Sir, I have successfully transferred ₹2,500 for May 2025 session fees via UPI. Kindly acknowledge. — Rohan's Parent"
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <MessageSquare size={100} />
            </div>
          </div>
          <div className="text-sm text-stone-500 dark:text-stone-400 font-sans font-bold text-center px-4 leading-relaxed italic">
            "By proceeding, you verify that the transfer has been initiated on your bank application."
          </div>
          <Btn label="Broadcast Notification" full onClick={() => { setNotifySheet(false); setConfirmed(true); }} />
        </div>
      </Sheet>
    </div>
  );
}
