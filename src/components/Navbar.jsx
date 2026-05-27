import { useState, useRef, useEffect } from "react";
import { GraduationCap, ChevronDown, Home, User, BookOpen, LogOut, X, Mail, Smartphone, ExternalLink, Clock, CheckCircle2, Video } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STATUS_CONFIG = {
  "Awaiting Payment Audit": { label: "Awaiting Payment Audit", color: "text-amber-500", bg: "bg-amber-50", dot: "bg-amber-400" },
  "Transaction Verified": { label: "Transaction Verified", color: "text-sky-500", bg: "bg-sky-50", dot: "bg-sky-400" },
  "Google Meet Link Generated": { label: "Meet Link Ready", color: "text-emerald-500", bg: "bg-emerald-50", dot: "bg-emerald-400" },
};

export default function Navbar({ user, onLogout, onHome, bookings }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [bookingsOpen, setBookingsOpen] = useState(false);
  const [liveBookings, setLiveBookings] = useState([]);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Sync bookings from parent prop and poll localStorage for real-time admin updates
  useEffect(() => {
    setLiveBookings(bookings || window.__nammaKCETBookings || []);
  }, [bookings, dropdownOpen, bookingsOpen]);

  // Real-time polling: detect admin status changes written to localStorage
  useEffect(() => {
    if (!bookingsOpen) return;
    const interval = setInterval(() => {
      const stored = (() => { try { return JSON.parse(localStorage.getItem("nk_bookings")) || []; } catch { return []; } })();
      setLiveBookings(stored);
    }, 1500);
    return () => clearInterval(interval);
  }, [bookingsOpen]);

  // Allow external callers to open the bookings panel
  useEffect(() => {
    window.__nammaKCETOpenBookings = () => setBookingsOpen(true);
    return () => { window.__nammaKCETOpenBookings = null; };
  }, []);

  // Subscribe to admin-dispatched meet link/status updates
  useEffect(() => {
    window.__nammaKCETUpdateBookingMeetLink = (txnId, meetLink, status) => {
      setLiveBookings((prev) => prev.map((b) =>
        (b.txnId === txnId || b.txnEdit === txnId) ? { ...b, meetLink, status } : b
      ));
      // also update global
      if (window.__nammaKCETBookings) {
        window.__nammaKCETBookings = window.__nammaKCETBookings.map((b) =>
          (b.txnId === txnId) ? { ...b, meetLink, status } : b
        );
      }
    };
    return () => { window.__nammaKCETUpdateBookingMeetLink = null; };
  }, []);

  const close = () => setDropdownOpen(false);

  return (
    <>
      <nav className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <div className="flex items-center justify-between h-16">
            {/* Brand */}
            <button onClick={onHome} className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center shadow-sm">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="text-left">
                <span className="font-outfit font-bold text-lg text-slate-800 tracking-tight block leading-tight">Namma KCET</span>
                <span className="text-xs text-slate-400 font-medium -mt-0.5 block">Built by NITK Students</span>
              </div>
            </button>

            {/* Home link only */}
            {user && (
              <button onClick={onHome} className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-50">
                <Home className="w-4 h-4" /> Home
              </button>
            )}

            {/* Avatar dropdown */}
            <div className="flex items-center gap-3">
              {user && (
                <div className="relative" ref={dropRef}>
                  <button
                    onClick={() => setDropdownOpen((p) => !p)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-sky-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                      {user.email?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="text-sm font-medium text-slate-700 hidden sm:block max-w-[100px] truncate">{user.email?.split("@")[0]}</span>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-12 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
                      >
                        <div className="px-4 py-3 border-b border-slate-50">
                          <p className="text-xs text-slate-400">Signed in as</p>
                          <p className="text-sm font-bold text-slate-800 truncate">{user.email}</p>
                        </div>
                        <div className="py-1.5">
                          <button onClick={() => { onHome(); close(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                            <Home className="w-4 h-4 text-slate-400" /> Home
                          </button>
                          <button onClick={() => { setProfileOpen(true); close(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                            <User className="w-4 h-4 text-slate-400" /> My Profile
                          </button>
                          <button onClick={() => { setBookingsOpen(true); close(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                            <BookOpen className="w-4 h-4 text-slate-400" /> My Bookings
                            {liveBookings.length > 0 && (
                              <span className="ml-auto text-xs font-bold bg-sky-100 text-sky-600 rounded-full px-1.5 py-0.5">{liveBookings.length}</span>
                            )}
                          </button>
                        </div>
                        <div className="border-t border-slate-50 py-1.5">
                          <button onClick={() => { onLogout(); close(); }} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* My Profile Modal */}
      <AnimatePresence>
        {profileOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(10px)" }}
            onClick={() => setProfileOpen(false)}
          >
            <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-sky-500 to-violet-600 px-6 py-5 flex items-center justify-between">
                <h3 className="font-outfit font-bold text-white text-lg">My Profile</h3>
                <button onClick={() => setProfileOpen(false)} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3.5 border border-slate-100">
                  <Mail className="w-4 h-4 text-sky-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Email Address</p>
                    <p className="text-sm font-bold text-slate-800">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3.5 border border-slate-100">
                  <Smartphone className="w-4 h-4 text-violet-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">WhatsApp Number</p>
                    <p className="text-sm font-bold text-slate-800">+91 {user?.whatsapp}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* My Bookings — Live Timeline Modal */}
      <AnimatePresence>
        {bookingsOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(15,23,42,0.5)", backdropFilter: "blur(10px)" }}
            onClick={() => setBookingsOpen(false)}
          >
            <motion.div initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden max-h-[85vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-gradient-to-r from-sky-500 to-violet-600 px-6 py-5 flex items-center justify-between flex-shrink-0">
                <h3 className="font-outfit font-bold text-white text-lg">My Bookings</h3>
                <button onClick={() => setBookingsOpen(false)} className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center">
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                {liveBookings.length === 0 ? (
                  <div className="py-10 text-center">
                    <BookOpen className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    <p className="text-slate-500 text-sm font-medium">No bookings found in this session.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {liveBookings.map((b, i) => {
                      const statusCfg = STATUS_CONFIG[b.status] || STATUS_CONFIG["Awaiting Payment Audit"];
                      const hasMeetLink = b.meetLink && b.meetLink.length > 0;
                      return (
                        <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                          {/* Mentor row */}
                          <div className="flex items-center gap-3 p-4 border-b border-slate-50">
                            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br flex-shrink-0 flex items-center justify-center ${b.mentor?.avatar_color === "teal" ? "from-sky-400 to-sky-600" : "from-violet-400 to-violet-600"}`}>
                              <span className="text-white font-bold text-xs">{b.mentor?.avatar_initials}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-slate-800 text-sm truncate">{b.mentor?.name}</p>
                              <p className="text-xs text-slate-400 truncate">{b.mentor?.branch}</p>
                            </div>
                            <span className="text-xs font-bold text-sky-600">₹159</span>
                          </div>

                          {/* Step timeline */}
                          <div className="p-4 space-y-2.5">
                            {["Awaiting Payment Audit", "Transaction Verified", "Google Meet Link Generated"].map((step, si) => {
                              // Map all admin status values → stepper index (0/1/2)
                              const rawStatus = b.status || "Awaiting Payment Audit";
                              const currentIdx =
                                rawStatus === "Completed" ? 2 :
                                rawStatus === "Slot Confirmed" || rawStatus === "Transaction Verified" ? 1 : 0;
                              const done = si < currentIdx;
                              const active = si === currentIdx;
                              // Always look up cfg by the visual step label, not the raw DB status
                              const cfg = STATUS_CONFIG[step];
                              return (
                                <div key={step} className="flex items-center gap-3">
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${done ? "bg-emerald-500" : active ? cfg.bg + " border-2 border-current " + cfg.color : "bg-slate-100"}`}>
                                    {done ? <CheckCircle2 className="w-3 h-3 text-white" /> : active ? <div className={`w-2 h-2 rounded-full ${cfg.dot}`} /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                                  </div>
                                  <span className={`text-xs font-semibold ${done ? "text-emerald-600" : active ? cfg.color : "text-slate-300"}`}>{cfg?.label || step}</span>
                                  {active && <Clock className={`w-3 h-3 ml-auto ${cfg.color}`} />}
                                  {done && <CheckCircle2 className="w-3 h-3 ml-auto text-emerald-500" />}
                                </div>
                              );
                            })}

                            {/* Join button when meet link is set */}
                            {hasMeetLink && (
                              <a href={b.meetLink} target="_blank" rel="noreferrer"
                                className="flex items-center justify-center gap-2 w-full mt-3 px-4 py-2.5 bg-gradient-to-r from-sky-500 to-violet-600 text-white text-xs font-bold rounded-xl shadow-sm hover:from-sky-600 hover:to-violet-700 transition-all">
                                <Video className="w-3.5 h-3.5" /> Join Google Meet Session
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}