import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, CheckCircle2, AlertCircle, MessageCircle, ShieldCheck, Heart, Server, GraduationCap } from "lucide-react";

const QR_IMAGE = "https://media.base44.com/images/public/69a4409d5a408eb7cb6a670c/b7b66afbf_image.png";

export default function BookingSlider({ mentor, user, onClose, onSuccess }) {
  const [txnId, setTxnId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const upiId = "rohankmoshi2@oksbi";

  const handleCopy = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirm = async () => {
    if (!txnId.trim() || txnId.trim().length < 8) {
      setError("Please enter a valid 12-digit UPI UTR / Transaction ID.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    const msg = encodeURIComponent(
      `🥛 *NAMMA KCET | BOOKING SUCCESSFUL*\n\n• *Mentor Booked:* ${mentor.name}\n• *UPI UTR / Transaction ID:* ${txnId}`
    );
    window.open(`https://wa.me/918147157714?text=${msg}`, "_blank");
    setShowSuccess(true);
  };

  const handleSuccessOk = () => {
    setShowSuccess(false);
    onSuccess({ txnId, mentor });
    setTimeout(() => {
      if (window.__nammaKCETOpenBookings) window.__nammaKCETOpenBookings();
    }, 300);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
        style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(12px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 60 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-500 to-violet-600 px-6 py-5 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-100" />
                <span className="text-sky-100 text-xs font-bold tracking-widest uppercase">Secure Checkout</span>
              </div>
              <h3 className="font-outfit font-bold text-white text-lg">Confirm Your Session</h3>
            </div>
            <button onClick={onClose} className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          <div className="p-6 max-h-[80vh] overflow-y-auto">
            {/* Mentor summary */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-5 flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br ${
                mentor.avatar_color === "teal" ? "from-sky-400 to-sky-600" : "from-violet-400 to-violet-600"
              }`}>
                <span className="font-outfit font-bold text-white text-sm">{mentor.avatar_initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-slate-800 text-sm truncate">{mentor.name}</div>
                <div className="text-xs text-slate-500 truncate">{mentor.branch}</div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="font-outfit font-bold text-sky-500 text-xl">₹159</div>
                <div className="text-xs text-slate-400">session fee</div>
              </div>
            </div>

            {/* QR Code — actual uploaded image */}
            <div className="border-2 border-dashed border-sky-200 rounded-2xl p-4 mb-5 bg-sky-50/30 text-center">
              <p className="text-xs font-bold text-sky-600 tracking-widest uppercase mb-3">Scan to Pay via UPI</p>
              <img
                src={QR_IMAGE}
                alt="UPI QR Code — rohankmoshi2@oksbi"
                className="w-52 h-auto mx-auto rounded-2xl border border-slate-200 shadow-sm mb-3"
              />
              <div className="flex items-center justify-center gap-2 bg-white rounded-xl border border-sky-200 px-4 py-2.5 mt-1">
                <span className="text-sm font-bold text-slate-800">{upiId}</span>
                <button onClick={handleCopy} className="text-sky-500 hover:text-sky-600 transition-colors">
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              {copied && <p className="text-xs text-emerald-500 font-semibold mt-1.5">Copied!</p>}
            </div>

            {/* Transaction ID */}
            <div className="mb-5">
              <label className="block text-xs font-bold text-slate-600 tracking-widest uppercase mb-2">
                Transaction ID Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={txnId}
                onChange={(e) => { setTxnId(e.target.value); setError(""); }}
                placeholder="Enter 12-Digit UPI UTR / Transaction ID from your app to verify"
                className={`w-full px-4 py-3.5 rounded-xl border text-sm text-slate-800 bg-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 ${error ? "border-red-400 bg-red-50" : "border-slate-200"}`}
              />
              {error && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                  <p className="text-red-500 text-xs">{error}</p>
                </div>
              )}
            </div>

            {/* Price breakdown */}
            <div className="bg-gradient-to-br from-slate-50 to-sky-50 border border-slate-100 rounded-2xl p-4 mb-5">
              <p className="text-xs font-bold text-slate-600 tracking-widest uppercase mb-3">Where does your ₹159 go?</p>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-sky-100 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-3.5 h-3.5 text-sky-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-slate-600">Directly to your assigned Senior Mentor</span>
                  </div>
                  <span className="text-xs font-bold text-sky-600">₹123</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-violet-100 flex items-center justify-center flex-shrink-0">
                    <Server className="w-3.5 h-3.5 text-violet-600" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-slate-600">Platform maintenance, server costs & operations</span>
                  </div>
                  <span className="text-xs font-bold text-violet-600">₹30</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center flex-shrink-0">
                    <Heart className="w-3.5 h-3.5 text-rose-500" />
                  </div>
                  <div className="flex-1">
                    <span className="text-xs text-slate-600">Donated to educational charity funds</span>
                  </div>
                  <span className="text-xs font-bold text-rose-500">₹6</span>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 mb-5">
              <p className="text-xs text-amber-700 leading-relaxed">
                <strong>After paying:</strong> Enter your Transaction ID above. A WhatsApp confirmation will be sent automatically to the team.
              </p>
            </div>

            <button
              onClick={handleConfirm}
              disabled={loading}
              className="w-full bg-gradient-to-r from-sky-500 to-violet-600 text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 text-sm"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Confirming...</>
              ) : (
                <><MessageCircle className="w-4 h-4" />Confirm Transaction & Send to WhatsApp</>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Success Confirmation Popup */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            style={{ background: "rgba(15,23,42,0.7)", backdropFilter: "blur(16px)" }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 32 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 32 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
            >
              {/* Top accent bar */}
              <div className="bg-gradient-to-r from-emerald-400 to-sky-500 h-2 w-full" />
              <div className="p-8 flex flex-col items-center text-center">
                {/* Checkmark icon */}
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-5 shadow-inner">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="font-outfit font-bold text-2xl text-slate-800 mb-3">
                  🎉 Booking Confirmed Successfully!
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                  Your transaction code has been submitted to our audit queue. Your assigned senior mentor will share the direct Google Meet link shortly.
                </p>
                <button
                  onClick={handleSuccessOk}
                  className="w-full bg-gradient-to-r from-emerald-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white font-bold py-4 rounded-2xl shadow-lg transition-all text-sm"
                >
                  OK — View My Bookings
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
}