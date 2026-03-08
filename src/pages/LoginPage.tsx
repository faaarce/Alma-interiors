import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      if (isRegister) { await register(name, email, password); } else { await login(email, password); }
      navigate("/blog");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : isRegister ? "Registrasi gagal." : "Login gagal. Cek email dan password.");
    } finally { setIsSubmitting(false); }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#1C1C1C]">
      <div className="pointer-events-none absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #C5A572 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      </div>
      <div className="pointer-events-none absolute top-20 right-20 h-64 w-64 rounded-full border border-[#C5A572]/5" />
      <div className="pointer-events-none absolute bottom-20 left-16 h-40 w-40 rounded-full border border-[#C5A572]/5" />
      <Link to="/" className="absolute top-8 left-8 z-20 flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M19 12H5M5 12l7-7M5 12l7 7" /></svg>Kembali
      </Link>
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 shadow-2xl backdrop-blur-xl">
          <div className="mb-8 flex justify-center">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-[#C5A572]/20 bg-[#C5A572]/5">
              <img src="/images/alma.png" alt="Alma Interior" className="h-14 w-14 rounded-full object-contain" />
            </div>
          </div>
          <div className="mb-8 text-center">
            <h1 className="mb-2 font-serif text-3xl font-bold text-white">{isRegister ? "Buat Akun" : "Masuk"}</h1>
            <p className="text-sm text-white/40">{isRegister ? "Daftar untuk menulis blog" : "Login untuk membuat blog post"}</p>
          </div>
          {error && <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegister && (
              <div>
                <label className="mb-2 block text-xs font-medium tracking-wider text-[#C5A572]">NAMA</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nama lengkap" required className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/25 outline-none transition-all duration-300 focus:border-[#C5A572]/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-[#C5A572]/20" />
              </div>
            )}
            <div>
              <label className="mb-2 block text-xs font-medium tracking-wider text-[#C5A572]">EMAIL</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" required className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/25 outline-none transition-all duration-300 focus:border-[#C5A572]/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-[#C5A572]/20" />
            </div>
            <div>
              <label className="mb-2 block text-xs font-medium tracking-wider text-[#C5A572]">PASSWORD</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/25 outline-none transition-all duration-300 focus:border-[#C5A572]/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-[#C5A572]/20" />
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A572] py-4 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-[#C5A572] hover:to-[#D4AF37] disabled:opacity-50">
              {isSubmitting ? "Loading..." : isRegister ? "Daftar" : "Masuk"}
            </button>
          </form>
          <div className="mt-8 border-t border-white/5 pt-6 text-center">
            <p className="text-sm text-white/40">
              {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
              <button onClick={() => { setIsRegister(!isRegister); setError(""); }} className="font-medium text-[#C5A572] transition-colors hover:text-[#D4AF37]">{isRegister ? "Masuk" : "Daftar"}</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
