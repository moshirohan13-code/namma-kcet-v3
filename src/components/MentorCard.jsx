import { motion } from "framer-motion";
import { BookOpen, Award } from "lucide-react";

const avatarColors = {
  teal: "from-sky-400 to-sky-600",
  lavender: "from-violet-400 to-violet-600",
};

const badgeStyles = {
  KCET: "bg-sky-50 text-sky-600 border border-sky-200",
  COMEDK: "bg-violet-50 text-violet-600 border border-violet-200",
  JEE: "bg-amber-50 text-amber-600 border border-amber-200",
};

export default function MentorCard({ mentor, index, onView }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.4 }}
      className="mentor-card bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-lg hover:border-slate-200 transition-all duration-300"
      onClick={() => onView(mentor)}
    >
      {/* Top accent bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${
        mentor.avatar_color === "teal" ? "from-sky-400 to-sky-600" : "from-violet-400 to-violet-600"
      }`} />

      <div className="p-6">
        {/* Avatar + Name */}
        <div className="flex items-start gap-4 mb-5">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${avatarColors[mentor.avatar_color]} flex items-center justify-center flex-shrink-0 shadow-sm`}>
            <span className="font-outfit font-bold text-lg text-white">{mentor.avatar_initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-outfit font-bold text-slate-800 text-lg leading-tight mb-0.5 truncate">{mentor.name}</h3>
            <p className="text-slate-400 text-xs truncate">{mentor.college}</p>
            <p className="text-slate-400 text-xs">{mentor.year}</p>
          </div>
        </div>

        {/* Branch */}
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
          <span className="text-xs text-slate-600 font-medium truncate">{mentor.branch}</span>
        </div>

        {/* Exam Badges */}
        <div className="flex flex-wrap gap-2 mb-4">
          {mentor.badges.map((badge) => (
            <span key={badge} className={`text-xs font-bold px-2.5 py-1 rounded-full ${badgeStyles[badge]}`}>
              {badge}
            </span>
          ))}
        </div>

        {/* Ranks */}
        <div className="flex gap-3 mb-5">
          {mentor.kcet_rank && (
            <div className="bg-sky-50 rounded-xl px-3 py-2.5 flex-1 text-center">
              <div className="font-outfit font-bold text-sky-600 text-sm">#{mentor.kcet_rank}</div>
              <div className="text-sky-500/70 text-xs mt-0.5">KCET Rank</div>
            </div>
          )}
          {mentor.comedk_rank && (
            <div className="bg-violet-50 rounded-xl px-3 py-2.5 flex-1 text-center">
              <div className="font-outfit font-bold text-violet-600 text-sm">#{mentor.comedk_rank}</div>
              <div className="text-violet-500/70 text-xs mt-0.5">COMEDK</div>
            </div>
          )}
        </div>

        {/* Sessions count only */}
        <div className="flex items-center gap-1.5 mb-5">
          <Award className="w-3.5 h-3.5 text-slate-300" />
          <span className="text-xs text-slate-500 font-medium">{mentor.experience_sessions} sessions completed</span>
        </div>

        {/* CTA */}
        <button
          onClick={(e) => { e.stopPropagation(); onView(mentor); }}
          className={`w-full text-white font-bold text-sm py-3 rounded-xl transition-all duration-200 shadow-sm bg-gradient-to-r ${
            mentor.avatar_color === "teal" ? "from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-700 shadow-sky-500/20" : "from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 shadow-violet-500/20"
          }`}
        >
          View Profile & Book Session
        </button>
      </div>
    </motion.div>
  );
}