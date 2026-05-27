import { motion } from "framer-motion";
import { CheckCircle2, MessageCircle, Clock } from "lucide-react";

export default function SuccessScreen({ mentor, txnId, onBack }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center"
      >
        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-teal-600" />
        </div>

        <h2 className="font-outfit font-bold text-2xl text-charcoal mb-2">Booking Confirmed!</h2>
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Your session request with <strong className="text-charcoal">{mentor?.name}</strong> has been submitted. The WhatsApp message has been sent to our team.
        </p>

        <div className="bg-slate-panel rounded-2xl p-4 mb-6 text-left space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Mentor</span>
            <span className="font-semibold text-charcoal">{mentor?.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Branch</span>
            <span className="font-medium text-charcoal text-right max-w-[55%]">{mentor?.branch}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Amount Paid</span>
            <span className="font-bold text-teal-600">₹200</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Transaction ID</span>
            <span className="font-mono text-xs text-charcoal truncate max-w-[55%]">{txnId}</span>
          </div>
        </div>

        <div className="flex items-start gap-3 bg-teal-50 border border-teal-100 rounded-xl p-4 mb-6 text-left">
          <Clock className="w-4 h-4 text-teal-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-teal-700 leading-relaxed">
            The team will confirm your session within <strong>2–4 hours</strong> and share the mentor's contact details via WhatsApp.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 border border-slate-200 text-charcoal font-semibold text-sm py-3 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Browse More Mentors
          </button>
          <a
            href="https://wa.me/918147157714"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-teal-600 text-white font-semibold text-sm py-3 rounded-xl flex items-center justify-center gap-1.5 hover:bg-teal-dark transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        </div>
      </motion.div>
    </motion.div>
  );
}