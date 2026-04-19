import { useState } from "react";
import { COLORS } from "../../constants";
import { SectionLabel, Btn, Chip, Sheet } from "../shared/UI";
import { Copy, MessageSquare, ReceiptText } from "lucide-react";

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
    <div className="h-full flex flex-col bg-stone-50 dark:bg-stone-950 overflow-y-auto scrollbar-hide">
      <div className="px-6 py-6 pb-4 shrink-0 bg-stone-50 dark:bg-stone-950 animate-slide-up sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-50 tracking-tight font-sans mb-1">Fees</h1>
        <p className="text-sm font-medium text-stone-500 dark:text-stone-400 font-sans">Rohan Das · Class 8</p>
      </div>

      <div className="flex-1 px-6 pb-6 flex flex-col gap-6 overflow-y-auto scrollbar-hide">
        {due && !confirmed && (
          <div className="shrink-0 rounded-[24px] p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm animate-slide-up [animation-delay:0.05s] relative overflow-hidden">
             <div className="absolute top-0 left-0 right-0 h-1 bg-amber-500" />
            <div className="text-xs font-semibold tracking-wider uppercase text-amber-600 mb-4 font-sans">
              Payment Due
            </div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="text-3xl font-bold font-mono text-stone-900 dark:text-stone-50 tracking-tight leading-tight"> ₹{due.amount.toLocaleString("en-IN")} </div>
                <div className="text-sm font-medium text-stone-500 dark:text-stone-400 font-sans mt-1"> {due.month} · Due {due.dueDate} </div>
              </div>
              <div className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">Due</div>
            </div>
            
            <div className="flex flex-col gap-3">
              <button 
                onClick={() => setNotifySheet(true)}
                className="w-full p-3.5 rounded-xl font-sans text-sm font-bold cursor-pointer border-none bg-stone-900 text-white shadow-sm flex items-center justify-center gap-2 hover:bg-stone-800 transition-colors"
              >
                <MessageSquare size={16} fill="currentColor" /> Notify Sir of Payment
              </button>
              <div className="flex gap-3">
                <button 
                  onClick={copyUpi}
                  className="flex-1 p-3 rounded-xl font-sans text-sm font-semibold cursor-pointer bg-stone-50 dark:bg-stone-950 text-stone-700 dark:text-stone-200 hover:bg-stone-100 transition-colors border border-stone-200 dark:border-stone-800 flex items-center justify-center gap-2"
                >
                  {upiCopied ? "✓ Copied!" : <><Copy size={16} /> Copy UPI ID</>}
                </button>
              </div>
            </div>
          </div>
        )}

        {confirmed && (
          <div className="shrink-0 rounded-[24px] p-5 bg-sky-50 border border-sky-200 animate-slide-up flex gap-4 items-start shadow-sm">
            <span className="text-2xl mt-1">⏳</span>
            <div>
              <div className="text-sm font-bold text-sky-900 font-sans mb-1">Payment notification sent!</div>
              <div className="text-xs font-medium text-sky-700 font-sans leading-relaxed"> Awaiting confirmation from Sir. Status will update once he logs it. </div>
            </div>
          </div>
        )}

        <div>
          <SectionLabel>Payment History</SectionLabel>
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-[24px] shadow-sm flex flex-col p-8 text-center items-center justify-center min-h-[200px]">
             <div className="w-16 h-16 bg-stone-100 dark:bg-stone-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl opacity-60">🧾</span>
             </div>
             <p className="text-sm font-bold text-stone-900 dark:text-stone-50 font-sans mb-1">No payment history</p>
             <p className="text-xs text-stone-500 font-sans">Future payment records will appear here.</p>
          </div>
        </div>

        <div className="shrink-0 mt-2">
          <Btn label="Generate Receipt Statement" variant="outline" full icon={<ReceiptText size={18} />} />
        </div>
      </div>

      <Sheet open={notifySheet} onClose={() => setNotifySheet(false)} title="Notify Sir of Payment">
        <div className="space-y-6">
          <div className="bg-sky-50 rounded-2xl p-5 border border-sky-100">
            <div className="text-[10px] font-bold tracking-widest uppercase text-sky-600 mb-2 font-sans">Message Preview</div>
            <div className="text-sm text-sky-900 leading-relaxed font-sans italic font-medium">
              "Sir, I have paid ₹2,500 for May 2025 fees via UPI. Please confirm. — Rohan's parent"
            </div>
          </div>
          <div className="text-xs text-stone-500 dark:text-stone-400 font-sans font-medium text-center">
            This notifies Sir instantly. Status will show "Pending Confirmation" in your records.
          </div>
          <Btn label="Send Notification" variant="primary" full onClick={() => { setNotifySheet(false); setConfirmed(true); }} />
        </div>
      </Sheet>
    </div>
  );
}
