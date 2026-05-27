import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X, MessageCircle } from "lucide-react";

export default function SuccessBanner({ booking, onClose }) {
  if (!booking) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4"
      >
        <div className="bg-white border border-teal-600/20 rounded-2xl p-4 shadow-xl shadow-teal-600/10 flex items-start gap-3">
          <div className="w-10 h-10 bg-teal-light rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-5 h-5 text-teal-600" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-charcoal text-sm">Booking Confirmed!</p>
            <p className="text-slate-500 text-xs mt-0.5">
              WhatsApp message sent for <span className="font-medium text-charcoal">{booking.mentor?.name}</span>. 
              We'll confirm your session shortly.
            </p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <MessageCircle className="w-3 h-3 text-teal-600" />
              <span className="text-xs text-teal-600 font-medium">Check WhatsApp for confirmation</span>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}