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
      if (isRegister) {
        await register(name, email, password);
      } else {
        await login(email, password);
      }
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(isRegister ? "Registrasi gagal." : "Login gagal. Cek email dan password.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#1C1C1C]">
      {/* Background texture */}
      <div className="pointer-events-none absolute inset-0 opacity-5">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, #C5A572 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Floating decorative circles */}
      <div className="pointer-events-none absolute top-20 right-20 h-64 w-64 rounded-full border border-[#C5A572]/5" />
      <div className="pointer-events-none absolute bottom-20 left-16 h-40 w-40 rounded-full border border-[#C5A572]/5" />

      {/* Back to home link */}
      <Link
        to="/"
        className="absolute top-8 left-8 z-20 flex items-center gap-2 text-sm text-white/50 transition-colors hover:text-white"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path d="M19 12H5M5 12l7-7M5 12l7 7" />
        </svg>
        Kembali
      </Link>

      {/* Card */}
      <div className="auth-card relative z-10 w-full max-w-md px-6">
        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-10 shadow-2xl backdrop-blur-xl">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="auth-logo flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border border-[#C5A572]/20 bg-[#C5A572]/5">
              <img
                src="/images/alma.png"
                alt="Alma Interior"
                className="h-14 w-14 rounded-full object-contain"
              />
            </div>
          </div>

          {/* Heading */}
          <div className="mb-8 text-center">
            <h1 className="auth-heading mb-2 font-serif text-3xl font-bold text-white">
              {isRegister ? "Buat Akun" : "Masuk"}
            </h1>
            <p className="text-sm text-white/40">
              {isRegister
                ? "Daftar untuk mengelola proyek"
                : "Admin panel Alma Interior"}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-center text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="space-y-5">
            {isRegister && (
              <div>
                <label className="mb-2 block text-xs font-medium tracking-wider text-[#C5A572]">
                  NAMA
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama lengkap"
                  required
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/25 outline-none transition-all duration-300 focus:border-[#C5A572]/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-[#C5A572]/20"
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-xs font-medium tracking-wider text-[#C5A572]">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/25 outline-none transition-all duration-300 focus:border-[#C5A572]/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-[#C5A572]/20"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium tracking-wider text-[#C5A572]">
                PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder-white/25 outline-none transition-all duration-300 focus:border-[#C5A572]/50 focus:bg-white/[0.07] focus:ring-1 focus:ring-[#C5A572]/20"
              />
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="auth-submit group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#C5A572] py-4 text-lg font-medium text-white shadow-lg transition-all duration-300 hover:scale-[1.02] hover:from-[#C5A572] hover:to-[#D4AF37] hover:shadow-xl disabled:opacity-50"
            >
              <span className="relative z-10">
                {isSubmitting
                  ? "Loading..."
                  : isRegister
                  ? "Daftar"
                  : "Masuk"}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
          </div>

          {/* Toggle login/register */}
          <div className="mt-8 border-t border-white/5 pt-6 text-center">
            <p className="text-sm text-white/40">
              {isRegister ? "Sudah punya akun?" : "Belum punya akun?"}{" "}
              <button
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError("");
                }}
                className="font-medium text-[#C5A572] transition-colors hover:text-[#D4AF37]"
              >
                {isRegister ? "Masuk" : "Daftar"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
