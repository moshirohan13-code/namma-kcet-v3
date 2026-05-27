import { motion } from "framer-motion";
import { LayoutDashboard, User, Phone, Mail, GraduationCap, Info } from "lucide-react";
import { mentors } from "../data/mentors";

export default function Dashboard({ user }) {
  return (
    <div className="min-h-screen bg-slate-panel">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
              <LayoutDashboard className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <h1 className="font-outfit font-bold text-2xl text-charcoal">Your Dashboard</h1>
              <p className="text-slate-400 text-sm">Session & account overview</p>
            </div>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-6">
            <h2 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-teal-600" />
              Your Profile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-panel rounded-xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-teal-50 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-teal-600" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-0.5">Email</div>
                  <div className="text-sm font-semibold text-charcoal truncate">{user?.email || "—"}</div>
                </div>
              </div>
              <div className="bg-slate-panel rounded-xl p-4 flex items-center gap-3">
                <div className="w-8 h-8 bg-lavender-50 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-lavender-500" />
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-0.5">WhatsApp</div>
                  <div className="text-sm font-semibold text-charcoal">+91 {user?.whatsapp || "—"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Available Mentors Summary */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="font-semibold text-charcoal mb-4 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-teal-600" />
              Available Mentors
            </h2>
            <div className="space-y-3">
              {mentors.map((mentor) => (
                <div key={mentor.id} className="flex items-center gap-3 p-3 bg-slate-panel rounded-xl">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold ${
                    mentor.avatar_color === "teal"
                      ? "bg-gradient-to-br from-teal-500 to-teal-700"
                      : "bg-gradient-to-br from-lavender-500 to-lavender-600"
                  }`}>
                    {mentor.avatar_initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-charcoal truncate">{mentor.name}</div>
                    <div className="text-xs text-slate-400 truncate">{mentor.branch}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-bold text-teal-600">₹200</div>
                    <div className="text-xs text-slate-400">/session</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Info note */}
          <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex gap-2">
            <Info className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-600 leading-relaxed">
              To book a session, go to <strong>Home</strong> and select a mentor. After payment, the team will reach you on WhatsApp within 2–4 hours.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}