import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";

const BRANCH_OPTIONS = [
  "Computer Science & Engineering",
  "Electronics & Communication Engineering",
  "Information Technology",
  "Mechanical Engineering",
  "Civil Engineering",
  "Chemical Engineering",
  "Electrical Engineering",
  "Biotechnology",
];

export default function SeniorRegistrationModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({
    fullName: "", college: "", degree: "", year: "", branch: "",
    languages: "", examProfile: "", kcetRank: "", comedk_rank: "",
    idCardFile: null, mentorshipFocus: [], mentorWhatsapp: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const toggleFocus = (focus) => {
    setForm((p) => ({
      ...p,
      mentorshipFocus: p.mentorshipFocus.includes(focus)
        ? p.mentorshipFocus.filter((f) => f !== focus)
        : [...p.mentorshipFocus, focus],
    }));
  };

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (f) { setForm((p) => ({ ...p, idCardFile: f })); setFileName(f.name); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let idCardUrl = "";
    if (form.idCardFile) {
      const res = await base44.integrations.Core.UploadFile({ file: form.idCardFile });
      idCardUrl = res.file_url;
    }

    const rankStr = form.examProfile === "KCET Only" ? `KCET: ${form.kcetRank}`
      : form.examProfile === "COMEDK Only" ? `COMEDK: ${form.comedk_rank}`
      : `KCET: ${form.kcetRank} | COMEDK: ${form.comedk_rank}`;

    const applicationData = {
      fullName: form.fullName, college: form.college, degree: form.degree,
      year: form.year, branch: form.branch, languages: form.languages,
      examProfile: form.examProfile, rank: rankStr,
      kcetRank: form.kcetRank, comedk_rank: form.comedk_rank,
      idCardUrl, mentorshipFocus: form.mentorshipFocus,
      mentorWhatsapp: form.mentorWhatsapp,
      verified: false,
      avatar_initials: form.fullName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
      avatar_color: "lavender",
    };

    const msg = encodeURIComponent(
      `📋 *NAMMA KCET | NEW SENIOR MENTOR APPLICATION*\n\n` +
      `• *Name:* ${form.fullName}\n• *College:* ${form.college}\n• *Degree:* ${form.degree}\n` +
      `• *Year:* ${form.year}\n• *Branch:* ${form.branch}\n• *Languages:* ${form.languages}\n` +
      `• *Exam Profile:* ${form.examProfile}\n• *Rank:* ${rankStr}\n` +
      `• *Mentorship Focus:* ${form.mentorshipFocus.join(", ")}\n• *Mentor WhatsApp:* ${form.mentorWhatsapp}\n• *ID Card:* ${idCardUrl || "Not uploaded"}`
    );
    window.open(`https://wa.me/918147157714?text=${msg}`, "_blank");

    setLoading(false);
    setSubmitted(true);
    if (onSubmit) onSubmit(applicationData);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(15,23,42,0.6)", backdropFilter: "blur(12px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }} animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 24 }}
          transition={{ type: "spring", stiffness: 280, damping: 28 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="bg-gradient-to-r from-sky-500 to-violet-600 px-6 py-5 flex items-center justify-between rounded-t-3xl sticky top-0 z-10">
            <div>
              <p className="text-sky-100 text-xs font-bold tracking-widest uppercase mb-0.5">Senior Onboarding</p>
              <h3 className="font-outfit font-bold text-white text-xl">Senior Onboarding Registry</h3>
            </div>
            <button onClick={onClose} className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {submitted ? (
            <div className="p-10 text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h4 className="font-outfit font-bold text-xl text-slate-800 mb-2">Application Submitted!</h4>
              <p className="text-slate-500 text-sm mb-6">Our team will review your profile and reach out within 24 hours.</p>
              <button onClick={onClose} className="px-6 py-3 bg-gradient-to-r from-sky-500 to-violet-600 text-white font-bold rounded-xl text-sm">Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Basic fields */}
              {[
                { label: "Full Student Name", key: "fullName", placeholder: "Your full name" },
                { label: "Current College Name", key: "college", placeholder: "e.g., NITK Surathkal" },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-slate-500 tracking-widest uppercase mb-1.5">{label}</label>
                  <input type="text" value={form[key]} onChange={(e) => set(key, e.target.value)} placeholder={placeholder} required
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500" />
                </div>
              ))}

              <div>
                <label className="block text-xs font-bold text-slate-500 tracking-widest uppercase mb-1.5">Pursuing Degree Track</label>
                <select value={form.degree} onChange={(e) => set("degree", e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500">
                  <option value="">Select degree</option>
                  {["B.Tech", "B.E.", "B.Sc Agriculture", "B.Sc Nursing", "Dental", "Other Specialized Branches"].map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 tracking-widest uppercase mb-1.5">Current Academic Year</label>
                <select value={form.year} onChange={(e) => set("year", e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500">
                  <option value="">Select year</option>
                  {["1st Year", "2nd Year", "3rd Year", "4th Year"].map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 tracking-widest uppercase mb-1.5">Engineering Branch Stream</label>
                <input type="text" value={form.branch} onChange={(e) => set("branch", e.target.value)} placeholder="e.g., Mechanical Engineering" required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500" />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 tracking-widest uppercase mb-1.5">Exam Qualification Profile</label>
                <select value={form.examProfile} onChange={(e) => set("examProfile", e.target.value)} required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 bg-white outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500">
                  <option value="">Select exam profile</option>
                  {["KCET Only", "COMEDK Only", "Both Exams"].map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              {/* Conditional rank fields */}
              <AnimatePresence>
                {form.examProfile === "KCET Only" && (
                  <motion.div key="kcet" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                    <label className="block text-xs font-bold text-slate-500 tracking-widest uppercase mb-1.5">Enter your verified KCET Rank number</label>
                    <input type="number" value={form.kcetRank} onChange={(e) => set("kcetRank", e.target.value)} placeholder="e.g., 512" required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500" />
                  </motion.div>
                )}
                {form.examProfile === "COMEDK Only" && (
                  <motion.div key="comedk" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                    <label className="block text-xs font-bold text-slate-500 tracking-widest uppercase mb-1.5">Enter your verified COMEDK Rank number</label>
                    <input type="number" value={form.comedk_rank} onChange={(e) => set("comedk_rank", e.target.value)} placeholder="e.g., 430" required
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500" />
                  </motion.div>
                )}
                {form.examProfile === "Both Exams" && (
                  <motion.div key="both" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 tracking-widest uppercase mb-1.5">Enter KCET Rank</label>
                      <input type="number" value={form.kcetRank} onChange={(e) => set("kcetRank", e.target.value)} placeholder="e.g., 512" required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 tracking-widest uppercase mb-1.5">Enter COMEDK Rank</label>
                      <input type="number" value={form.comedk_rank} onChange={(e) => set("comedk_rank", e.target.value)} placeholder="e.g., 430" required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500" />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Languages Spoken */}
              <div>
                <label className="block text-xs font-bold text-slate-500 tracking-widest uppercase mb-1.5">Languages you can comfortably mentor in</label>
                <input type="text" value={form.languages} onChange={(e) => set("languages", e.target.value)} placeholder="e.g., Kannada, English, Hindi" required
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500" />
              </div>

              {/* Mentorship Focus */}
              <div>
                <label className="block text-xs font-bold text-slate-500 tracking-widest uppercase mb-2">How can you help your junior? (Select all that apply)</label>
                <div className="grid grid-cols-1 gap-2">
                  {["KCET Prep Strategy", "Branch Selection (CSE/ECE/etc.)", "College Culture & Placements", "Option Entry Form Choice Filling"].map((focus) => (
                    <label key={focus} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 cursor-pointer hover:border-sky-400 hover:bg-sky-50/50 transition-colors">
                      <input
                        type="checkbox"
                        checked={form.mentorshipFocus.includes(focus)}
                        onChange={() => toggleFocus(focus)}
                        className="w-4 h-4 accent-sky-500 rounded"
                      />
                      <span className="text-sm text-slate-700 font-medium">{focus}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mentor WhatsApp */}
              <div>
                <label className="block text-xs font-bold text-slate-500 tracking-widest uppercase mb-1.5">WhatsApp Number for instant booking notifications</label>
                <input type="text" inputMode="numeric" value={form.mentorWhatsapp}
                  onChange={(e) => set("mentorWhatsapp", e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="10-digit mobile number" required maxLength={10}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500" />
              </div>

              {/* Mentorship scope banner */}
              <div className="bg-gradient-to-br from-sky-50 to-violet-50 border border-sky-200 rounded-2xl px-5 py-4 flex gap-3 items-start">
                <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-sky-700 tracking-wide uppercase mb-1">Global Mentorship Access</p>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    As a <span className="font-bold text-sky-600">Namma KCET Mentor</span>, you are empowered to guide engineering aspirants across all foundational and specialized branches globally.
                  </p>
                </div>
              </div>

              {/* ID Card upload */}
              <div>
                <label className="block text-xs font-bold text-slate-500 tracking-widest uppercase mb-1.5">Upload College ID Card Picture</label>
                <label className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-dashed border-slate-200 hover:border-sky-400 cursor-pointer transition-colors bg-slate-50">
                  <Upload className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-500 truncate">{fileName || "Click to upload ID card"}</span>
                  <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                </label>
              </div>

              <button type="submit" disabled={loading}
                className="w-full bg-gradient-to-r from-sky-500 to-violet-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm shadow-lg disabled:opacity-70 mt-2">
                {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Submitting...</> : "Submit Application →"}
              </button>
            </form>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}