import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Smartphone, ArrowRight, GraduationCap, Sparkles } from "lucide-react";

export default function AuthGate({ onLogin }) {
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleWhatsappChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setWhatsapp(val);
    if (errors.whatsapp) setErrors((prev) => ({ ...prev, whatsapp: "" }));
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) setErrors((prev) => ({ ...prev, email: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!whatsapp || whatsapp.length !== 10) {
      newErrors.whatsapp = "WhatsApp number must be exactly 10 digits.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    onLogin({ email, whatsapp });
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 to-lavender-500 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white blur-3xl" />
          <div className="absolute bottom-20 right-10 w-48 h-48 rounded-full bg-white blur-2xl" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-outfit font-bold text-2xl text-white tracking-tight">Namma KCET</span>
          </div>

          <h2 className="font-outfit font-bold text-4xl text-white leading-tight mb-6">
            Your Dream Seat<br />Starts Here.
          </h2>
          <p className="text-white/80 text-lg leading-relaxed max-w-sm">
            Connect with seniors from NITK Surathkal who cracked KCET & COMEDK. Get real strategy, not generic advice.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-3 gap-4">
          {[
            { number: "200+", label: "Sessions Done" },
            { number: "50+", label: "Mentors" },
            { number: "98%", label: "Satisfaction" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white/15 rounded-2xl p-4 text-center">
              <div className="font-outfit font-bold text-2xl text-white">{stat.number}</div>
              <div className="text-white/70 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-slate-panel lg:bg-white">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-outfit font-bold text-xl text-charcoal">Namma KCET</span>
          </div>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-teal-light text-teal-600 rounded-full px-3 py-1 text-xs font-semibold mb-4">
              <Sparkles className="w-3 h-3" />
              NITK SURATHKAL MENTORS
            </div>
            <h1 className="font-outfit font-bold text-3xl text-charcoal leading-tight mb-3">
              Connect with Verified Senior Mentors
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Gain direct insights from top engineering college seniors who have conquered KCET — ensured by our strict verification process for true guidance.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-charcoal tracking-widest mb-2 uppercase">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  placeholder="your@email.com"
                  className={`w-full pl-11 pr-4 py-3.5 rounded-xl border text-sm text-charcoal bg-white placeholder:text-slate-400 outline-none transition-all focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 ${
                    errors.email ? "border-red-400 bg-red-50" : "border-slate-200"
                  }`}
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal tracking-widest mb-2 uppercase">
                WhatsApp Number
              </label>
              <div className="relative">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  inputMode="numeric"
                  value={whatsapp}
                  onChange={handleWhatsappChange}
                  maxLength={10}
                  placeholder="10-digit mobile number"
                  className={`w-full pl-11 pr-16 py-3.5 rounded-xl border text-sm text-charcoal bg-white placeholder:text-slate-400 outline-none transition-all focus:ring-2 focus:ring-teal-600/20 focus:border-teal-600 ${
                    errors.whatsapp ? "border-red-400 bg-red-50" : "border-slate-200"
                  }`}
                />
                <span className={`absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium tabular-nums ${
                  whatsapp.length === 10 ? "text-teal-600" : "text-slate-400"
                }`}>
                  {whatsapp.length}/10
                </span>
              </div>
              {errors.whatsapp && <p className="text-red-500 text-xs mt-1.5">{errors.whatsapp}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-teal-600 hover:bg-teal-dark text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 shadow-lg shadow-teal-600/20 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing In...
                </span>
              ) : (
                <>
                  Access Mentor Directory
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-6">
            By continuing, you agree to our counseling terms. Your data is never sold or shared.
          </p>
        </motion.div>
      </div>
    </div>
  );
}