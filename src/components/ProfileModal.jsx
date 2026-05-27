import { motion, AnimatePresence } from "framer-motion";
import { X, GraduationCap, Trophy, CheckCircle2, ArrowRight, Languages } from "lucide-react";

const avatarGradients = {
  teal: "from-sky-400 to-sky-600",
  lavender: "from-violet-400 to-violet-600",
};

export default function ProfileModal({ mentor, onClose, onBook }) {
  if (!mentor) return null;

  const languages = mentor.languages
    ? (Array.isArray(mentor.languages) ? mentor.languages : mentor.languages.split(/[,;]/).map((l) => l.trim()).filter(Boolean))
    : [];

  const waText = encodeURIComponent(
    `Hi! I'm interested in booking a session with ${mentor.name} on Namma KCET. Could you help me connect?`
  );
  const waAdminLink = `https://wa.me/918147157714?text=${waText}`;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(10px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`relative bg-gradient-to-br ${avatarGradients[mentor.avatar_color] || "from-violet-400 to-violet-600"} p-8 pb-14`}>
            <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center">
              <X className="w-4 h-4 text-white" />
            </button>
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center flex-shrink-0">
                <span className="font-outfit font-bold text-3xl text-white">{mentor.avatar_initials}</span>
              </div>
              <div>
                <h2 className="font-outfit font-bold text-2xl text-white mb-1">{mentor.name}</h2>
                <p className="text-white/80 text-sm">{mentor.year} • {mentor.college}</p>
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {(mentor.badges || []).filter(b => b !== "JEE").map((badge) => (
                    <span key={badge} className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/25 text-white border border-white/30">{badge}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="px-8 -mt-6 pb-8 space-y-5">
            {/* Branch */}
            <div>
              <label className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-2 block">Engineering Domain</label>
              <div className="flex items-center gap-2 bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                <GraduationCap className="w-4 h-4 text-sky-500" />
                <span className="text-slate-700 font-medium text-sm">{mentor.branch}</span>
              </div>
            </div>

            {/* Ranks */}
            {(mentor.kcet_rank || mentor.comedk_rank) && (
              <div>
                <label className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-2 block">Entrance Ranks Secured</label>
                <div className="grid grid-cols-2 gap-3">
                  {mentor.kcet_rank && (
                    <div className="bg-sky-50 border border-sky-100 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Trophy className="w-4 h-4 text-sky-500" />
                        <span className="text-xs font-bold text-sky-600">KCET</span>
                      </div>
                      <div className="font-outfit font-bold text-2xl text-sky-600">#{mentor.kcet_rank}</div>
                    </div>
                  )}
                  {mentor.comedk_rank && (
                    <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Trophy className="w-4 h-4 text-violet-500" />
                        <span className="text-xs font-bold text-violet-600">COMEDK</span>
                      </div>
                      <div className="font-outfit font-bold text-2xl text-violet-600">#{mentor.comedk_rank}</div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Languages Known */}
            {languages.length > 0 && (
              <div>
                <label className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-2 block">Languages Known</label>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <div key={lang} className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1.5">
                      <Languages className="w-3 h-3 text-emerald-500" />
                      <span className="text-xs text-emerald-700 font-semibold">{lang}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Competency / Help With */}
            {(mentor.competency || []).length > 0 && (
              <div>
                <label className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-2 block">This Mentor Can Help With</label>
                <div className="flex flex-wrap gap-2">
                  {mentor.competency.map((area) => (
                    <div key={area} className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5">
                      <CheckCircle2 className="w-3 h-3 text-sky-500" />
                      <span className="text-xs text-slate-700 font-medium">{area}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Background */}
            <div>
              <label className="text-xs font-bold text-slate-400 tracking-widest uppercase mb-2 block">Background</label>
              <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-100">{mentor.description}</p>
            </div>

            {/* Pricing row */}
            <div className="flex items-center justify-between bg-sky-50 border border-sky-100 rounded-xl px-4 py-3">
              <span className="text-sm font-medium text-slate-600">Session Fee</span>
              <span className="font-outfit font-bold text-sky-600 text-xl">₹159</span>
            </div>

            {/* CTA */}
            <button
              onClick={onBook}
              className="w-full bg-gradient-to-r from-sky-500 to-violet-600 hover:from-sky-600 hover:to-violet-700 text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-violet-500/20 text-sm"
            >
              Book Session <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}