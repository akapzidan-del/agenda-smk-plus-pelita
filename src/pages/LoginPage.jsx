import React, { useState } from "react"
import {
  Lock, Eye, EyeOff, ShieldCheck, GraduationCap,
  ArrowRight, AlertCircle, User, Sparkles
} from "lucide-react"
import logoImg from "../assets/logo.png"
import { isLockedOut, recordFailedAttempt, resetLoginAttempts, sanitizeText, validateIdentifier, validatePassword } from "../security"

export default function LoginPage({ onLogin, darkMode, setDarkMode }) {
  const [nisn, setNisn] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)
  const [role, setRole] = useState("siswa") // "siswa" | "guru"
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    const lock = isLockedOut()
    if (lock.locked) {
      setError(`Terlalu banyak percobaan gagal. Coba lagi dalam ${Math.ceil(lock.remainingMs / 60000)} menit.`)
      return
    }

    const id = sanitizeText(nisn, 32)
    const pw = password

    if (!id) {
      setError(role === "siswa" ? "Nomor Induk Siswa Nasional (NISN) wajib diisi!" : "NIP / NUPTK Guru wajib diisi!")
      return
    }

    if (!validateIdentifier(role, id)) {
      setError(role === "siswa" ? "Format NISN tidak valid (8-16 digit angka)." : "Format NIP/NUPTK tidak valid.")
      return
    }

    if (!pw.trim()) {
      setError("Kata sandi wajib diisi!")
      return
    }

    if (!validatePassword(pw)) {
      setError("Kata sandi minimal 4 karakter.")
      return
    }

    setIsLoading(true)

    // Simulate authenticating against database
    setTimeout(async () => {
      setIsLoading(false)

      // Support NISN 26271007272 with password "Password", as well as other credentials
      const isSiswaMatch =
        role === "siswa" &&
        (id === "26271007272" || id === "0061234501") &&
        (pw === "Password" || pw === "password" || pw === "Siswa2026")

      const isGuruMatch =
        role === "guru" &&
        (id === "198805122014021002" || id === "19880512 201402 1 002") &&
        (pw === "Password" || pw === "password" || pw === "Piket2026")

      // Also allow any valid-formatted NISN or NIP with password "Password"
      const isGeneralMatch = pw === "Password" || pw === "password"

      const ok = isSiswaMatch || isGuruMatch || isGeneralMatch

      if (!ok) {
        const r = recordFailedAttempt()
        if (r.locked) {
          setError("Akun dikunci sementara karena terlalu banyak percobaan gagal.")
        } else {
          setError(`Kredensial tidak valid. Sisa percobaan: ${5 - r.count}. (Gunakan sandi: Password)`)
        }
        return
      }

      resetLoginAttempts()

      const studentName =
        id === "26271007272"
          ? "Siswa Pelita (26271007272)"
          : id === "0061234501"
          ? "Aditya Pratama (X TKJ 1)"
          : `Siswa (${id})`

      const userObj = {
        nisn: id,
        role,
        name: role === "siswa" ? studentName : "Agus Salim, S.Kom. (Piket)"
      }
      await onLogin(userObj, rememberMe)
    }, 500)
  }

  // Quick Demo Account Autofill
  const handleAutofillDemo = (selectedRole) => {
    setRole(selectedRole)
    setError("")
    if (selectedRole === "siswa") {
      setNisn("26271007272")
      setPassword("Password")
    } else {
      setNisn("198805122014021002")
      setPassword("Password")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-red-50/40 to-slate-200 dark:from-slate-950 dark:via-slate-900 dark:to-red-950/20 text-slate-800 dark:text-slate-100 flex items-center justify-center p-4 sm:p-6 transition-colors duration-200 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-red-500/10 dark:bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-rose-500/10 dark:bg-rose-700/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 dark:bg-red-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Logo & School Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/50 shadow-md p-2 mx-auto">
            <img
              src={logoImg}
              alt="Logo SMK Plus Pelita Nusantara"
              className="w-full h-full object-contain drop-shadow-sm"
              onError={(e) => {
                // Fallback icon if logo image fails
                e.target.style.display = "none"
              }}
            />
          </div>

          <div>
            <span className="text-[11px] font-black tracking-widest text-red-600 uppercase">
              SMK Plus Pelita Nusantara
            </span>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
              Portal Agenda Piket
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto">
              Silakan masukkan NISN atau NIP beserta kata sandi akun sekolah Anda
            </p>
          </div>
        </div>

        {/* Role Switcher (Siswa vs Guru / Staf) */}
        <div className="mt-6 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center">
          <button
            type="button"
            onClick={() => {
              setRole("siswa")
              setError("")
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              role === "siswa"
                ? "bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Siswa (NISN)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setRole("guru")
              setError("")
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              role === "guru"
                ? "bg-white dark:bg-slate-700 text-red-600 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Guru & Staf Piket</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-600 dark:text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* NISN / ID Input */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
              {role === "siswa" ? "NISN (Nomor Induk Siswa Nasional)" : "NIP / NUPTK Guru"}
            </label>
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={nisn}
                onChange={(e) => setNisn(e.target.value)}
                placeholder={role === "siswa" ? "Contoh: 26271007272" : "Contoh: 19880512 201402 1 002"}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 font-mono transition"
              />
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                {role === "siswa" ? (
                  <GraduationCap className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Kata Sandi
              </label>
              <span className="text-[11px] text-slate-400 hover:text-red-600 dark:hover:text-red-400 cursor-pointer transition">
                Lupa sandi?
              </span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi..."
                  autoComplete="current-password"

                className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 transition"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
                title={showPassword ? "Sembunyikan sandi" : "Lihat sandi"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-red-600 focus:ring-red-500 h-4 w-4 border-slate-300 dark:border-slate-600 cursor-pointer"
              />
              <span>Ingat sesi saya di perangkat ini</span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-extrabold rounded-2xl shadow-lg shadow-red-600/25 flex items-center justify-center gap-2 text-sm transition active:scale-98 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Masuk ke Sistem</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Autofill Box */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2.5 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Akses Cepat Akun Demo (1-Klik):</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleAutofillDemo("siswa")}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 rounded-xl text-left transition cursor-pointer group"
            >
              <div className="text-[11px] font-bold text-slate-900 dark:text-slate-100 group-hover:text-red-600 transition">
                Akun Siswa
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                NISN: 26271007272
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleAutofillDemo("guru")}
              className="px-3 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200/80 dark:border-slate-700 rounded-xl text-left transition cursor-pointer group"
            >
              <div className="text-[11px] font-bold text-slate-900 dark:text-slate-100 group-hover:text-red-600 transition">
                Akun Guru Piket
              </div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                NIP: 19880512...
              </div>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-[11px] text-slate-400 dark:text-slate-500">
          © 2026 SMK Plus Pelita Nusantara · Sistem Kehadiran & Piket Terpadu
        </div>
      </div>
    </div>
  )
}
