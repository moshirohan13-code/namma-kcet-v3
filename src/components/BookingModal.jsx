import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ShieldCheck, QrCode, MessageCircle, Copy, CheckCircle2, AlertCircle } from "lucide-react";

export default function BookingModal({ mentor, user, onClose, onSuccess }) {
  const [txnId, setTxnId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const upiId = "rohankmoshi2@oksbi";

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTxnChange = (e) => {
    setTxnId(e.target.value);
    if (error) setError("");
  };

  const buildWhatsAppMessage = () => {
    const msg = `🎓 *Namma KCET — Session Booking Confirmation*

👤 *Student Details*
• Name/Email: ${user.email}
• WhatsApp: +91${user.whatsapp}

🏛️ *Mentor Requested*
• Mentor: ${mentor.name}
• College: ${mentor.college}
• Branch: ${mentor.branch}

💰 *Payment Details*
• Amount Paid: ₹200 (Strategy Counseling Fee)
• UPI ID: ${upiId}
• Transaction ID: ${txnId}

📋 *Session Preferences*
• Exam Focus: ${mentor.badges.join(", ")}
• Competency Areas: ${mentor.competency.slice(0, 2).join(", ")}

Please confirm my session booking. Thank you! 🙏`;
    return encodeURIComponent(msg);
  };

  const handleConfirm = async () => {
    if (!txnId.trim()) {
      setError("Transaction ID is required to confirm your booking.");
      return;
    }
    if (txnId.trim().length < 8) {
      setError("Please enter a valid 12-digit UPI UTR / Transaction ID.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    const phone = "918147157714";
    const message = buildWhatsAppMessage();
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
    onSuccess({ txnId, mentor });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-charcoal/50 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 24 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <ShieldCheck className="w-4 h-4 text-teal-200" />
                <span className="text-teal-100 text-xs font-semibold tracking-wide uppercase">Secure Booking</span>
              </div>
              <h3 className="font-outfit font-bold text-white text-xl">Session Payment</h3>
            </div>
            <button onClick={onClose} className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="p-6">
            <div className="bg-slate-panel border border-slate-100 rounded-2xl p-4 mb-5 flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                mentor.avatar_color === "teal"
                  ? "bg-gradient-to-br from-teal-500 to-teal-700"
                  : "bg-gradient-to-br from-lavender-500 to-lavender-600"
              }`}>
                <span className="font-outfit font-bold text-white text-sm">{mentor.avatar_initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-charcoal text-sm truncate">{mentor.name}</div>
                <div className="text-xs text-slate-500 truncate">{mentor.branch}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-outfit font-bold text-teal-600 text-xl">₹200</div>
                <div className="text-xs text-slate-400">flat fee</div>
              </div>
            </div>

            <div className="border-2 border-dashed border-teal-200 rounded-2xl p-5 mb-5 text-center bg-teal-50/40">
              <div className="flex items-center justify-center gap-2 mb-3">
                <QrCode className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-semibold text-teal-700">Scan to Pay via UPI</span>
              </div>
              <div className="w-44 h-44 mx-auto mb-4 bg-white rounded-2xl border-2 border-teal-200 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
                <div className="absolute top-2 left-2 w-6 h-6" style={{ borderTop: '3px solid #0D9488', borderLeft: '3px solid #0D9488', borderRadius: '4px 0 0 0' }} />
                <div className="absolute top-2 right-2 w-6 h-6" style={{ borderTop: '3px solid #0D9488', borderRight: '3px solid #0D9488', borderRadius: '0 4px 0 0' }} />
                <div className="absolute bottom-2 left-2 w-6 h-6" style={{ borderBottom: '3px solid #0D9488', borderLeft: '3px solid #0D9488', borderRadius: '0 0 0 4px' }} />
                <div className="absolute bottom-2 right-2 w-6 h-6" style={{ borderBottom: '3px solid #0D9488', borderRight: '3px solid #0D9488', borderRadius: '0 0 4px 0' }} />
                <QrCode className="w-20 h-20 text-teal-600/60" strokeWidth={1} />
                <p className="text-xs text-teal-700 font-medium mt-1 px-2 text-center leading-tight">UPI QR Code</p>
              </div>
              <div className="flex items-center justify-center gap-2 bg-white rounded-xl border border-teal-200 px-4 py-2.5">
                <span className="text-sm font-semibold text-charcoal">{upiId}</span>
                <button onClick={handleCopyUPI} className="text-teal-600 hover:text-teal-700 transition-colors">
                  {copied ? <CheckCircle2 className="w-4 h-4 text-teal-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              {copied && <p className="text-xs text-teal-600 mt-1.5 font-medium">UPI ID copied!</p>}
            </div>

            <div className="mb-5">
              <label className="block text-xs font-semibold text-charcoal tracking-widest mb-2 uppercase">
                Transaction ID Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={txnId}
                onChange={handleTxnChange}
                placeholder="Enter the 12-Digit UPI UTR / Transaction ID"
                className={`w-full px-4 py-3.5 rounded-xl border text-sm text-charcoal bg-white placeholder:text-slate-400 outline-none transition-all focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 ${
                  error ? "border-red-400 bg-red-50" : "border-slate-200"
                }`}
              />
              {error && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                  <p className="text-red-500 text-xs">{error}</p>
                </div>
              )}
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs text-amber-700 leading-relaxed">
                <strong>After payment:</strong> Enter your UPI Transaction ID above, then click confirm. A pre-filled WhatsApp message will open automatically to notify the team.
              </p>
            </div>

            <button
              onClick={handleConfirm}
              disabled={loading}
              className="w-full bg-teal-600 hover:bg-teal-dark text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-teal-600/25 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Confirming...
                </span>
              ) : (
                <>
                  <MessageCircle className="w-4 h-4" />
                  Confirm Transaction & Send to WhatsApp
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}