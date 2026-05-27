import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, X, Send, CheckCircle2, ExternalLink, Users, BookOpen, UserCheck, LogOut, MessageCircle, Trash2, GraduationCap } from "lucide-react";

const STATUS_STYLES = {
  "Awaiting Payment Audit": "bg-amber-50 text-amber-600 border-amber-200",
  "Transaction Verified": "bg-sky-50 text-sky-600 border-sky-200",
  "Slot Confirmed": "bg-violet-50 text-violet-600 border-violet-200",
  "Completed": "bg-emerald-50 text-emerald-600 border-emerald-200",
};

const ALL_STATUSES = ["Awaiting Payment Audit", "Transaction Verified", "Slot Confirmed", "Completed"];

export default function AdminPortal({ onClose, bookings, seniorApplications, onApproveSenior, studentAccounts, publishedMentors, onDeleteMentor }) {
  const [activeTab, setActiveTab] = useState("bookings");
  const [meetLinks, setMeetLinks] = useState({});
  const [sessionTimes, setSessionTimes] = useState({});
  const [sentLinks, setSentLinks] = useState({});
  const [statuses, setStatuses] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null); // mentor id to confirm delete

  const getStatus = (i) => statuses[i] || bookings?.[i]?.status || "Awaiting Payment Audit";

  const handleStatusChange = (i, newStatus) => {
    setStatuses((p) => ({ ...p, [i]: newStatus }));
    // Persist to localStorage so junior's real-time polling picks it up instantly
    try {
      const stored = JSON.parse(localStorage.getItem("nk_bookings")) || [];
      if (stored[i]) {
        stored[i] = { ...stored[i], status: newStatus };
        localStorage.setItem("nk_bookings", JSON.stringify(stored));
        if (window.__nammaKCETBookings) window.__nammaKCETBookings[i] = { ...window.__nammaKCETBookings[i], status: newStatus };
      }
    } catch {}
  };

  const sendMeetLink = (booking, i) => {
    const link = meetLinks[i] || "";
    if (!link) return;
    const mentorName = booking.mentor?.name || booking.mentorName || "your mentor";
    const sessionTime = sessionTimes[i] || "the scheduled time";
    const meetMsg = encodeURIComponent(
      `📅 *NAMMA KCET | Session Confirmed*\n\n• *Mentor:* ${mentorName}\n• *Session Time:* ${sessionTime}\n• *Google Meet Link:* ${link}`
    );
    // Notify student
    const studentPhone = booking.userWhatsapp ? `91${String(booking.userWhatsapp).replace(/[\s\-+]/g, "")}` : "918147157714";
    window.open(`https://wa.me/${studentPhone}?text=${meetMsg}`, "_blank");
    setSentLinks((p) => ({ ...p, [i]: true }));
    setStatuses((p) => ({ ...p, [i]: "Slot Confirmed" }));
    if (window.__nammaKCETUpdateBookingMeetLink) {
      const txn = booking.txnId || booking.utr || booking.transactionUtr || "";
      window.__nammaKCETUpdateBookingMeetLink(txn, link, "Slot Confirmed");
    }
  };

  const TABS = [
    { id: "bookings", label: "Live Bookings & Sessions", icon: BookOpen },
    { id: "seniors", label: "Senior Mentor Directory", icon: GraduationCap },
    { id: "approvals", label: "Pending Approvals", icon: UserCheck },
    { id: "users", label: "Student Directory", icon: Users },
  ];

  const pendingApps = (seniorApplications || []).filter((a) => !a.verified);
  const allBookings = bookings || [];
  const allUsers = studentAccounts || [];
  const allMentors = publishedMentors || [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top nav */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 px-6 py-4 flex items-center justify-between flex-shrink-0 shadow-lg">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-400" />
          <div>
            <p className="text-slate-400 text-xs font-bold tracking-widest uppercase">Secured Admin Room</p>
            <h3 className="font-outfit font-bold text-white text-base">Namma KCET — Operations Console</h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/30 text-rose-300 hover:text-rose-200 text-xs font-bold transition-all"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out Workspace
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-slate-200 bg-white px-6 gap-1 pt-2 flex-shrink-0 shadow-sm">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl border-b-2 transition-all whitespace-nowrap ${
              activeTab === id
                ? "border-sky-500 text-sky-600 bg-sky-50"
                : "border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            }`}>
            <Icon className="w-3.5 h-3.5" /> {label}
            {id === "approvals" && pendingApps.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs font-bold bg-rose-100 text-rose-600 rounded-full">{pendingApps.length}</span>
            )}
            {id === "bookings" && allBookings.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs font-bold bg-sky-100 text-sky-600 rounded-full">{allBookings.length}</span>
            )}
            {id === "seniors" && allMentors.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs font-bold bg-violet-100 text-violet-600 rounded-full">{allMentors.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">

        {/* TAB 1 — Pending Mentor Approvals */}
        {activeTab === "approvals" && (
          <div>
            <p className="text-xs text-slate-400 mb-4">{pendingApps.length} pending application(s)</p>
            {pendingApps.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-2xl border border-slate-100">
                <UserCheck className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No pending mentor applications.</p>
              </div>
            ) : (
              <div className="bg-white overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {["Applicant Name", "College & Year", "Degree & Branch", "Exams & Ranks", "Languages", "Why KCET?", "ID Card", "Action"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 tracking-wider uppercase whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {pendingApps.map((app, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-bold text-slate-800 text-xs whitespace-nowrap">{app.fullName}</td>
                        <td className="px-4 py-3 text-xs"><div className="text-slate-700">{app.college}</div><div className="text-slate-400">{app.year}</div></td>
                        <td className="px-4 py-3 text-xs"><div className="text-slate-700">{app.degree}</div><div className="text-slate-400">{app.branch}</div></td>
                        <td className="px-4 py-3 text-xs"><div className="font-semibold text-slate-700">{app.examProfile}</div><div className="text-slate-500 font-mono">{app.rank}</div></td>
                        <td className="px-4 py-3 text-slate-600 text-xs">{app.languages}</td>
                        <td className="px-4 py-3 text-xs max-w-[140px]"><p className="text-slate-500 truncate" title={app.whyJoin}>{app.whyJoin || "—"}</p></td>
                        <td className="px-4 py-3">
                          {app.idCardUrl
                            ? <a href={app.idCardUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-sky-500 hover:underline">View <ExternalLink className="w-3 h-3" /></a>
                            : <span className="text-slate-300 text-xs">—</span>}
                        </td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => onApproveSenior && onApproveSenior(i)}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve & Publish
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 2 — Live Bookings */}
        {activeTab === "bookings" && (
          <div>
            <p className="text-xs text-slate-400 mb-4">{allBookings.length} booking record(s)</p>
            {allBookings.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-2xl border border-slate-100">
                <BookOpen className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No bookings recorded yet.</p>
              </div>
            ) : (
              <div className="bg-white overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {["Date", "Junior Email", "Junior WA", "Mentor", "Mentor WA", "₹", "UTR", "Status", "Meet Link & Dispatch"].map((h) => (
                        <th key={h} className="px-3 py-3 text-left text-xs font-bold text-slate-500 tracking-wider uppercase whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {allBookings.map((booking, i) => {
                      const currentStatus = getStatus(i);
                      const mentorName = booking.mentor?.name || booking.mentorName || "—";
                      const mentorPhone = booking.mentor?.phone || "";
                      return (
                        <tr key={i} className="hover:bg-slate-50/50 align-top">
                          <td className="px-3 py-3 text-slate-500 text-xs font-mono whitespace-nowrap">{booking.date || booking.timestamp || "—"}</td>
                          <td className="px-3 py-3 text-slate-700 font-medium text-xs">{booking.userEmail || "—"}</td>

                          {/* Junior WhatsApp */}
                          <td className="px-3 py-3">
                            {booking.userWhatsapp ? (
                              <div className="flex items-center gap-1.5">
                                <span className="text-slate-600 text-xs font-mono">{booking.userWhatsapp}</span>
                                <a
                                  href={`https://wa.me/91${String(booking.userWhatsapp).replace(/[\s\-+]/g, "")}?text=${encodeURIComponent("Hello! Connecting regarding your Namma KCET mentorship booking.")}`}
                                  target="_blank" rel="noreferrer"
                                  className="w-6 h-6 flex items-center justify-center rounded-lg bg-emerald-100 hover:bg-emerald-200 transition-colors"
                                  title="WhatsApp Student"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                                </a>
                              </div>
                            ) : <span className="text-slate-300 text-xs">—</span>}
                          </td>

                          <td className="px-3 py-3 text-slate-700 font-medium text-xs whitespace-nowrap">{mentorName}</td>

                          {/* Mentor WhatsApp */}
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-1.5">
                              <a
                                href={`https://wa.me/${mentorPhone ? `91${String(mentorPhone).replace(/[\s\-+]/g, "")}` : (booking.mentor_whatsapp || "918147157714")}?text=${encodeURIComponent("Hello! A student has booked a session with you on Namma KCET.")}`}
                                target="_blank" rel="noreferrer"
                                title="WhatsApp Mentor"
                                className="hover:opacity-70 transition-opacity"
                              >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.549 4.099 1.504 5.827L0 24l6.335-1.482A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.214-3.727.871.907-3.614-.235-.373A9.818 9.818 0 1112 21.818z"/>
                                </svg>
                              </a>
                            </div>
                          </td>

                          <td className="px-3 py-3 font-bold text-sky-600 text-xs">₹159</td>
                          <td className="px-3 py-3 text-slate-600 text-xs font-mono">{booking.txnId || booking.utr || "—"}</td>

                          {/* Status */}
                          <td className="px-3 py-3">
                            <select
                              value={currentStatus}
                              onChange={(e) => handleStatusChange(i, e.target.value)}
                              className={`px-2.5 py-1.5 rounded-full text-xs font-bold border outline-none cursor-pointer ${STATUS_STYLES[currentStatus] || "bg-slate-50 text-slate-600 border-slate-200"}`}
                            >
                              {ALL_STATUSES.map((s) => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>

                          {/* Box 3 — Meet Link + Dispatch */}
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="text"
                                value={meetLinks[i] || ""}
                                onChange={(e) => setMeetLinks((p) => ({ ...p, [i]: e.target.value }))}
                                placeholder="Paste Google Meet link..."
                                className="w-44 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-800 outline-none focus:ring-1 focus:ring-violet-400 focus:border-violet-400"
                              />
                              <button
                                onClick={() => sendMeetLink(booking, i)}
                                disabled={!meetLinks[i]}
                                title="Dispatch to both parties"
                                className={`w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${sentLinks[i] ? "bg-emerald-500" : "bg-violet-500 hover:bg-violet-600"}`}
                              >
                                {sentLinks[i] ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : <Send className="w-3.5 h-3.5 text-white" />}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB: Senior Mentor Directory */}
        {activeTab === "seniors" && (
          <div>
            <p className="text-xs text-slate-400 mb-4">{allMentors.length} published senior mentor(s)</p>
            {allMentors.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-2xl border border-slate-100">
                <GraduationCap className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No published mentors yet.</p>
              </div>
            ) : (
              <div className="bg-white overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {["Avatar", "Name", "College", "Branch", "Year", "Exams", "Ranks", "Sessions", "Delete"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 tracking-wider uppercase whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {allMentors.map((m, i) => (
                      <tr key={m.id || i} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0 ${m.avatar_color === "teal" ? "from-sky-400 to-sky-600" : "from-violet-400 to-violet-600"}`}>
                              <span className="text-white font-bold text-xs">{m.avatar_initials}</span>
                            </div>
                            <a
                              href={`https://wa.me/${m.whatsapp_number || "919999999999"}`}
                              target="_blank"
                              rel="noreferrer"
                              title="WhatsApp Senior"
                              className="hover:opacity-70 transition-opacity flex-shrink-0"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="#25D366" xmlns="http://www.w3.org/2000/svg">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.115.549 4.099 1.504 5.827L0 24l6.335-1.482A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.006-1.371l-.36-.214-3.727.871.907-3.614-.235-.373A9.818 9.818 0 1112 21.818z"/>
                              </svg>
                            </a>
                          </div>
                        </td>
                        <td className="px-4 py-3 font-bold text-slate-800 text-xs whitespace-nowrap">{m.name}</td>
                        <td className="px-4 py-3 text-slate-600 text-xs">{m.college || "—"}</td>
                        <td className="px-4 py-3 text-slate-600 text-xs max-w-[140px] truncate">{m.branch}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs">{m.year || "—"}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1 flex-wrap">
                            {(m.badges || []).map((b) => (
                              <span key={b} className="text-xs font-bold px-2 py-0.5 rounded-full bg-sky-50 text-sky-600 border border-sky-200">{b}</span>
                            ))}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs font-mono text-slate-600">
                          {m.kcet_rank ? <span className="text-sky-600">K#{m.kcet_rank}</span> : null}
                          {m.kcet_rank && m.comedk_rank ? " · " : null}
                          {m.comedk_rank ? <span className="text-violet-600">C#{m.comedk_rank}</span> : null}
                          {!m.kcet_rank && !m.comedk_rank ? "—" : null}
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs">{m.experience_sessions ?? 0}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => setDeleteConfirm(m.id || i)}
                            className="w-7 h-7 flex items-center justify-center rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                            title="Delete mentor"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Delete Confirm Modal */}
            <AnimatePresence>
              {deleteConfirm !== null && (
                <motion.div
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 flex items-center justify-center p-4"
                  style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(10px)" }}
                >
                  <motion.div
                    initial={{ scale: 0.95, y: 16 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 16 }}
                    className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
                  >
                    <div className="w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Trash2 className="w-6 h-6 text-rose-500" />
                    </div>
                    <h4 className="font-outfit font-bold text-slate-800 text-lg text-center mb-1">Remove Mentor?</h4>
                    <p className="text-slate-500 text-sm text-center mb-6">This will permanently remove this senior mentor from the public directory. This action cannot be undone.</p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setDeleteConfirm(null)}
                        className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          if (onDeleteMentor) onDeleteMentor(deleteConfirm);
                          setDeleteConfirm(null);
                        }}
                        className="flex-1 py-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-sm transition-colors"
                      >
                        Yes, Remove
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* TAB 3 — Student Directory */}
        {activeTab === "users" && (
          <div>
            <p className="text-xs text-slate-400 mb-4">{allUsers.length} registered account(s)</p>
            {allUsers.length === 0 ? (
              <div className="py-20 text-center bg-white rounded-2xl border border-slate-100">
                <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">No registered students yet.</p>
              </div>
            ) : (
              <div className="bg-white overflow-x-auto rounded-2xl border border-slate-100 shadow-sm">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      {["Registration Timestamp", "Email Address", "WhatsApp Mobile"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 tracking-wider uppercase whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {allUsers.map((u, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 text-slate-500 text-xs font-mono">{u.registeredAt || "—"}</td>
                        <td className="px-4 py-3 text-slate-800 font-medium text-xs">{u.email}</td>
                        <td className="px-4 py-3">
                          {u.whatsapp ? (
                            <div className="flex items-center gap-1.5">
                              <span className="text-slate-600 text-xs font-mono">+91 {u.whatsapp}</span>
                              <a
                                href={`https://wa.me/91${String(u.whatsapp).replace(/[\s\-+]/g, "")}`}
                                target="_blank" rel="noreferrer"
                                className="w-6 h-6 flex items-center justify-center rounded-lg bg-emerald-100 hover:bg-emerald-200 transition-colors flex-shrink-0"
                                title="WhatsApp"
                              >
                                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                              </a>
                            </div>
                          ) : <span className="text-slate-300 text-xs">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}