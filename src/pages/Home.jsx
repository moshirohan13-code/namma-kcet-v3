import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Sparkles, Mail, Smartphone, ArrowRight, GraduationCap, ChevronRight, ChevronDown } from "lucide-react";
import { mentors as staticMentors } from "../data/mentors";
import MentorCard from "../components/MentorCard";
import ProfileModal from "../components/ProfileModal";
import BookingSlider from "../components/BookingSlider";
import SuccessBanner from "../components/SuccessBanner";
import Navbar from "../components/Navbar";
import SeniorRegistrationModal from "../components/SeniorRegistrationModal";
import AdminPortal from "../components/AdminPortal";

const ADMIN_EMAIL = "rohankmoshi2@gmail.com";
const BRANCHES = ["All Branches", "Computer Science & Engineering", "Electronics & Communication Engineering", "Information Technology", "Mechanical Engineering", "Civil Engineering", "Chemical Engineering"];
const BADGES = ["All", "KCET", "COMEDK"];
const PAGE_SIZE = 6;

function safeLoad(key) {
  try { return JSON.parse(localStorage.getItem(key)) || []; } catch { return []; }
}

// ── Login Overlay ────────────────────────────────────────────────
function LoginOverlay({ onLogin }) {
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminPw, setAdminPw] = useState("");
  const [adminPwError, setAdminPwError] = useState("");

  const handleWhatsappChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setWhatsapp(val);
    if (errors.whatsapp) setErrors((p) => ({ ...p, whatsapp: "" }));
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();

    if (email === ADMIN_EMAIL) {
      if (!showAdminPassword) { setShowAdminPassword(true); return; }
      if (adminPw !== "Rohan@8147") { setAdminPwError("Incorrect password. Access denied."); return; }
      onLogin({ email, whatsapp: "0000000000", isAdmin: true });
      return;
    }

    const e = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address.";
    if (!whatsapp || whatsapp.length !== 10) e.whatsapp = "WhatsApp number must be exactly 10 digits.";
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    onLogin({ email, whatsapp, registeredAt: new Date().toLocaleString() });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.7)", backdropFilter: "blur(18px)" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.93, y: 32 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.93, y: 32 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="bg-gradient-to-r from-sky-500 to-violet-600 px-8 py-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-outfit font-bold text-white text-lg">Namma KCET</span>
          </div>
          <h2 className="font-outfit font-bold text-2xl text-white leading-tight">
            Join 500+ students who<br />found their dream seat.
          </h2>
          <p className="text-white/75 text-sm mt-1.5">Quick sign-in to unlock our full mentor network.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 tracking-widest mb-2 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="email" value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); setShowAdminPassword(false); setAdminPwError(""); }}
                placeholder="your@email.com" required
                className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm font-medium text-slate-800 bg-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 ${errors.email ? "border-red-400 bg-red-50" : "border-slate-200"}`}
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
          </div>

          <AnimatePresence>
            {showAdminPassword && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <label className="block text-xs font-bold text-amber-600 tracking-widest mb-2 uppercase">🔒 Admin Password Required</label>
                <input type="password" value={adminPw} onChange={(e) => { setAdminPw(e.target.value); setAdminPwError(""); }}
                  placeholder="Enter admin password"
                  className={`w-full px-4 py-3.5 rounded-xl border text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400 ${adminPwError ? "border-red-400 bg-red-50" : "border-amber-200"}`}
                />
                {adminPwError && <p className="text-red-500 text-xs mt-1.5">{adminPwError}</p>}
              </motion.div>
            )}
          </AnimatePresence>

          {!showAdminPassword && (
            <div>
              <label className="block text-xs font-bold text-slate-500 tracking-widest mb-2 uppercase">WhatsApp Number</label>
              <div className="relative">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" inputMode="numeric" value={whatsapp} onChange={handleWhatsappChange}
                  maxLength={10} placeholder="10-digit mobile number"
                  className={`w-full pl-11 pr-16 py-3.5 rounded-xl border text-sm font-medium text-slate-800 bg-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 ${errors.whatsapp ? "border-red-400 bg-red-50" : "border-slate-200"}`}
                />
                <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold tabular-nums ${whatsapp.length === 10 ? "text-sky-500" : "text-slate-400"}`}>
                  {whatsapp.length}/10
                </span>
              </div>
              {errors.whatsapp && <p className="text-red-500 text-xs mt-1.5">{errors.whatsapp}</p>}
            </div>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-sky-500 to-violet-600 hover:from-sky-600 hover:to-violet-700 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg disabled:opacity-70 text-sm"
          >
            {loading
              ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing In...</>
              : <>{showAdminPassword ? "Enter Admin Console →" : "Unlock Mentor Directory"} <ArrowRight className="w-4 h-4" /></>
            }
          </button>

          <p className="text-center text-xs text-slate-400">Your data is never sold or shared. Counseling terms apply.</p>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────
export default function Home() {
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [bookingMentor, setBookingMentor] = useState(null);
  const [booking, setBooking] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [branchFilter, setBranchFilter] = useState("All Branches");
  const [badgeFilter, setBadgeFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [showSeniorModal, setShowSeniorModal] = useState(false);

  // ── Persisted global state ────────────────────────────────────
  const [bookings, setBookings] = useState(() => safeLoad("nk_bookings"));
  const [registeredUsers, setRegisteredUsers] = useState(() => safeLoad("nk_users"));
  const [seniorApplications, setSeniorApplications] = useState(() => safeLoad("nk_seniors"));
  const [publishedMentors, setPublishedMentors] = useState(() => {
    const saved = safeLoad("nk_published_mentors");
    return saved.length > 0 ? saved : staticMentors;
  });

  const timerRef = useRef(null);

  // Persist to localStorage on every change
  useEffect(() => { localStorage.setItem("nk_bookings", JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem("nk_users", JSON.stringify(registeredUsers)); }, [registeredUsers]);
  useEffect(() => { localStorage.setItem("nk_seniors", JSON.stringify(seniorApplications)); }, [seniorApplications]);
  useEffect(() => { localStorage.setItem("nk_published_mentors", JSON.stringify(publishedMentors)); }, [publishedMentors]);

  // Sync bookings globally for navbar
  useEffect(() => { window.__nammaKCETBookings = bookings; }, [bookings]);

  // 7-second guest timer
  useEffect(() => {
    if (!user) {
      timerRef.current = setTimeout(() => setShowLogin(true), 7000);
    }
    return () => clearTimeout(timerRef.current);
  }, [user]);

  const handleLogin = (userData) => {
    setUser(userData);
    setShowLogin(false);
    if (!userData.isAdmin) {
      setRegisteredUsers((prev) => {
        if (prev.find((u) => u.email === userData.email)) return prev;
        return [...prev, { email: userData.email, whatsapp: userData.whatsapp, registeredAt: userData.registeredAt }];
      });
    }
  };

  const handleLogout = () => {
    setUser(null);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setShowLogin(true), 7000);
  };

  const handleSeniorSubmit = (applicationData) => {
    setSeniorApplications((prev) => {
      const next = [...prev, applicationData];
      localStorage.setItem("nk_seniors", JSON.stringify(next));
      return next;
    });
  };

  const handleApproveSenior = (pendingIndex) => {
    const pendingApps = seniorApplications.filter((a) => !a.verified);
    const app = pendingApps[pendingIndex];
    if (!app) return;
    setSeniorApplications((prev) => prev.map((a) => a === app ? { ...a, verified: true } : a));
    const newMentor = {
      id: `senior_${Date.now()}`,
      name: app.fullName,
      college: app.college,
      year: app.year,
      branch: app.branch,
      avatar_initials: app.avatar_initials || app.fullName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
      avatar_color: "lavender",
      badges: app.examProfile === "KCET Only" ? ["KCET"] : app.examProfile === "COMEDK Only" ? ["COMEDK"] : ["KCET", "COMEDK"],
      kcet_rank: app.kcetRank || null,
      comedk_rank: app.comedk_rank || null,
      competency: ["College Counseling", "Branch Selection"],
      languages: app.languages || "",
      experience_sessions: 0,
      description: `${app.fullName} is a ${app.year} student at ${app.college}, specializing in ${app.branch}.`,
    };
    setPublishedMentors((prev) => [...prev, newMentor]);
  };

  const handleDeleteMentor = (mentorIdOrIndex) => {
    setPublishedMentors((prev) =>
      prev.filter((m, idx) => m.id !== mentorIdOrIndex && idx !== mentorIdOrIndex)
    );
  };

  const filteredMentors = publishedMentors.filter((m) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = !q || m.name.toLowerCase().includes(q) || m.branch.toLowerCase().includes(q) || (m.competency || []).some((c) => c.toLowerCase().includes(q));
    const matchBranch = branchFilter === "All Branches" || m.branch === branchFilter;
    const matchBadge = badgeFilter === "All" || (m.badges || []).includes(badgeFilter);
    return matchSearch && matchBranch && matchBadge;
  });

  const handleBook = (mentor) => { setSelectedMentor(null); setBookingMentor(mentor); };
  const handleSuccess = (data) => {
    const enriched = { ...data, userEmail: user?.email, userWhatsapp: user?.whatsapp, status: "Awaiting Payment Audit", meetLink: "", timestamp: new Date().toLocaleString() };
    setBookings((prev) => [enriched, ...prev]);
    setBookingMentor(null);
    setBooking(data);
    setTimeout(() => setBooking(null), 6000);
  };

  // ── Admin intercept ───────────────────────────────────────────
  if (user?.email === ADMIN_EMAIL) {
    return (
      <AdminPortal
        onClose={handleLogout}
        bookings={bookings}
        seniorApplications={seniorApplications}
        onApproveSenior={handleApproveSenior}
        studentAccounts={registeredUsers}
        publishedMentors={publishedMentors}
        onDeleteMentor={handleDeleteMentor}
      />
    );
  }

  // ── Student view ──────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <AnimatePresence>
        {!user && showLogin && <LoginOverlay onLogin={handleLogin} />}
      </AnimatePresence>

      <Navbar user={user} onLogout={handleLogout} onHome={() => {}} bookings={bookings} />
      <SuccessBanner booking={booking} onClose={() => setBooking(null)} />

      <main className="w-full">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-full bg-gradient-to-r from-[#2563eb] via-[#3b82f6] to-[#a855f7] relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/5 blur-3xl" />
              <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/5 blur-2xl" />
            </div>
            <div className="relative z-10 flex flex-col items-center text-center max-w-5xl mx-auto py-16 px-6 sm:px-16 lg:px-28">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 text-xs font-bold mb-6 tracking-wider text-white">
                ✨ Connect with Seniors from Your Dream College
              </div>
              <h1 className="font-outfit font-extrabold tracking-tight text-4xl sm:text-5xl lg:text-6xl leading-tight mb-5 text-white">
                Connect With Seniors Who<br className="hidden sm:block" /> Cracked What You're Targeting.
              </h1>
              <p className="text-white/80 text-base sm:text-lg max-w-2xl leading-relaxed text-white">
                We connect you directly with targeted college seniors to talk and help you get your counseling correct.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Senior Recruitment Banner — full-width, snapped below hero */}
        <div className="max-w-7xl mx-auto mx-4 sm:mx-8 lg:mx-12 rounded-xl mt-16 mb-8 bg-gradient-to-r from-slate-800 to-slate-900 px-6 sm:px-12 lg:px-20 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="text-lg flex-shrink-0">🔥</div>
            <div className="min-w-0">
              <p className="text-white font-outfit font-bold text-sm leading-tight">Join as a Senior Student Mentor on Namma KCET</p>
              <p className="text-slate-400 text-xs mt-0.5">Get ₹100 instantly — first 50 senior registrations from Karnataka colleges!</p>
            </div>
          </div>
          <button
            onClick={() => setShowSeniorModal(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-violet-600 hover:from-sky-600 hover:to-violet-700 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg transition-all text-xs flex-shrink-0"
          >
            Register as Senior Mentor <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="w-full px-6 sm:px-12 lg:px-20 py-6 bg-white">
          {/* Search & Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={searchQuery} onChange={(e) => { setSearchQuery(e.target.value); setVisibleCount(PAGE_SIZE); }}
                placeholder="Search by name, branch, or topic..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-sm"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <select value={branchFilter} onChange={(e) => { setBranchFilter(e.target.value); setVisibleCount(PAGE_SIZE); }}
                className="flex-1 sm:flex-none px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 shadow-sm">
                {BRANCHES.map((b) => <option key={b} value={b}>{b === "All Branches" ? b : b.split(" ").slice(0, 2).join(" ")}</option>)}
              </select>
              <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-sm">
                {BADGES.map((b) => (
                  <button key={b} onClick={() => { setBadgeFilter(b); setVisibleCount(PAGE_SIZE); }}
                    className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${badgeFilter === b ? "bg-gradient-to-r from-sky-500 to-violet-500 text-white shadow-sm" : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"}`}>
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-500 mb-6">
            Showing <span className="font-bold text-slate-800">{Math.min(visibleCount, filteredMentors.length)}</span> of <span className="font-bold text-slate-800">{filteredMentors.length}</span> mentor{filteredMentors.length !== 1 ? "s" : ""}
          </p>

          {filteredMentors.length === 0 ? (
            <div className="text-center py-20">
              <Search className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No mentors found.</p>
              <button onClick={() => { setSearchQuery(""); setBranchFilter("All Branches"); setBadgeFilter("All"); }} className="mt-3 text-sky-500 text-sm font-medium hover:underline">Clear filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pb-6">
                {filteredMentors.slice(0, visibleCount).map((mentor, i) => (
                  <MentorCard key={mentor.id} mentor={mentor} index={i}
                    onView={(m) => { if (!user) { setShowLogin(true); return; } setSelectedMentor(m); }}
                  />
                ))}
              </div>

              {/* View More button */}
              {filteredMentors.length > visibleCount && (
                <div className="flex justify-center pb-12">
                  <button
                    onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                    className="flex items-center gap-2 px-8 py-3.5 rounded-2xl border-2 border-slate-200 bg-white text-slate-700 font-bold text-sm hover:border-sky-400 hover:text-sky-600 hover:bg-sky-50 transition-all shadow-sm"
                  >
                    <ChevronDown className="w-4 h-4" />
                    View More Mentors ({filteredMentors.length - visibleCount} remaining)
                  </button>
                </div>
              )}
              {filteredMentors.length <= visibleCount && filteredMentors.length > PAGE_SIZE && (
                <div className="pb-12" />
              )}
            </>
          )}
        </div>
      </main>

      {selectedMentor && (
        <ProfileModal mentor={selectedMentor} onClose={() => setSelectedMentor(null)} onBook={() => handleBook(selectedMentor)} />
      )}
      {bookingMentor && (
        <BookingSlider mentor={bookingMentor} user={user} onClose={() => setBookingMentor(null)} onSuccess={handleSuccess} />
      )}
      {showSeniorModal && (
        <SeniorRegistrationModal onClose={() => setShowSeniorModal(false)} onSubmit={handleSeniorSubmit} />
      )}
    </div>
  );
}