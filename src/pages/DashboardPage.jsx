import React, { useState } from "react"
import {
  Calendar, Search, ChevronDown, RefreshCw, MoreVertical,
  Bell, FileText, UserX, PenTool, CheckCircle2,
  ArrowUpRight, ArrowDownRight, ChevronRight
} from "lucide-react"

// Premium Sparkline with gradient area fill
function PremiumSparkline({ color = "#22c55e", gradientId = "greenGrad", up = true }) {
  const points = up
    ? "0,20 12,17 24,19 36,12 48,14 60,8 72,10 84,5 96,2"
    : "0,4 12,7 24,5 36,14 48,10 60,18 72,15 84,21 96,23"

  const areaPoints = up
    ? "0,20 12,17 24,19 36,12 48,14 60,8 72,10 84,5 96,2 96,26 0,26"
    : "0,4 12,7 24,5 36,14 48,10 60,18 72,15 84,21 96,23 96,26 0,26"

  return (
    <svg width="104" height="30" viewBox="0 0 96 26" fill="none" className="flex-shrink-0 drop-shadow-xs">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${gradientId})`} />
      <polyline points={points} stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function DashboardPage({ onNavigate }) {
  const [activityTab, setActivityTab] = useState("hari-ini")
  const [activitySearch, setActivitySearch] = useState("")
  const [trendTab, setTrendTab] = useState("kehadiran")
  const [hoveredBar, setHoveredBar] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [toastMsg, setToastMsg] = useState("")

  const triggerToast = (msg) => {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(""), 3000)
  }

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => {
      setIsRefreshing(false)
      triggerToast("Data operasional sekolah berhasil diperbarui")
    }, 500)
  }

  const ACTIVITIES = [
    {
      id: 1,
      title: "Izin keluar sementara - X TKJ 2",
      detail: "Bayu Maulana (Fotokopi berkas).",
      time: "16.22",
      badgeText: "IZIN",
      bgClass: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/60",
      page: "kepulangan",
      pageName: "Kepulangan Siswa"
    },
    {
      id: 2,
      title: "Draft absensi X TKJ 2 diperbarui",
      detail: "12 hadir, 2 S/I/A oleh Agus Salim, S.Kom.",
      time: "12.40",
      badgeText: "PRESENSI",
      bgClass: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60",
      page: "absensi-siswa",
      pageName: "Absensi Siswa"
    },
    {
      id: 3,
      title: "Upacara Bendera selesai",
      detail: "Lapangan Utama · 100% siswa hadir tertib.",
      time: "08.15",
      badgeText: "KBM",
      bgClass: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/60",
      page: "agenda-piket",
      pageName: "Agenda Piket"
    },
    {
      id: 4,
      title: "3 siswa X RPL 1 belum masuk",
      detail: "Budi, Cici, Dodi belum check-in.",
      time: "07.45",
      badgeText: "ALERT",
      bgClass: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800/60",
      page: "tidak-hadir",
      pageName: "Siswa Tidak Hadir"
    },
    {
      id: 5,
      title: "Jurnal Matematika XI IPA dibuat",
      detail: "Oleh Bu Ratna · Materi Aljabar.",
      time: "11.30",
      badgeText: "JURNAL",
      bgClass: "bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-200/60 dark:border-purple-800/60",
      page: "jurnal",
      pageName: "Jurnal Mengajar"
    },
  ]

  const WEEK_DATA = [
    { day: "Sen", value: 98, count: 686, note: "Puncak kehadiran" },
    { day: "Sel", value: 96, count: 672, note: "Tertib seragam" },
    { day: "Rab", value: 95, count: 665, note: "Pramuka" },
    { day: "Kam", value: 97, count: 679, note: "Literasi pagi" },
    { day: "Jum", value: 94, count: 658, note: "Keputrian & Jumatan" },
    { day: "Sab", value: 89, count: 623, note: "Ekstrakurikuler" },
  ]

  const filteredActivities = ACTIVITIES.filter(a => {
    const matchSearch = !activitySearch ||
      a.title.toLowerCase().includes(activitySearch.toLowerCase()) ||
      a.detail.toLowerCase().includes(activitySearch.toLowerCase())
    return matchSearch
  })

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-xs font-bold animate-bounce border border-slate-700 dark:border-slate-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          {toastMsg}
        </div>
      )}

      {/* ── Greeting & Top Filter Bar ── */}
      <section className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 dark:text-white tracking-tight">
            Selamat malam, Agus Salim, S.Kom.
          </h1>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap text-xs text-slate-500 dark:text-slate-400">
            <span>Berikut ringkasan operasional sekolah terkini</span>
            <span className="text-slate-300 dark:text-slate-600">•</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">Minggu, 8 November 2026</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Guru
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Guru Piket
            </span>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigate && onNavigate("jadwal")}
            className="flex items-center gap-2 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-200 font-medium shadow-xs hover:border-slate-300 dark:hover:border-slate-700 transition active:scale-95"
            title="Buka Jadwal Pelajaran"
          >
            <span>08/11/2026</span>
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
          </button>

          <div
            onClick={() => onNavigate && onNavigate("jadwal")}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-200 font-medium shadow-xs cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition active:scale-95"
            title="Pilih Shift / Jadwal"
          >
            <span>Semua shift</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs text-slate-700 dark:text-slate-200 font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs transition active:scale-95"
            title="Muat ulang data"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isRefreshing ? "animate-spin" : ""}`} />
            <span>Muat ulang</span>
          </button>

          <button
            onClick={() => onNavigate && onNavigate("laporan")}
            className="p-2 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 shadow-xs transition hover:bg-slate-50 dark:hover:bg-slate-800"
            title="Buka Menu Laporan"
          >
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* ── "Hari ini" Card ── */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] relative overflow-hidden transition-all duration-200 hover:shadow-md">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-xs font-bold text-slate-900 dark:text-white tracking-wider uppercase">Hari Ini</h2>
            <span className="text-xs text-slate-400">· Shift Pagi</span>
          </div>

          <button
            onClick={() => onNavigate && onNavigate("agenda-piket")}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 shadow-xs hover:bg-emerald-100 transition cursor-pointer"
            title="Buka Halaman Agenda Piket"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Bertugas piket
          </button>
        </div>

        {/* Inner Box with Soft Background */}
        <div className="bg-gradient-to-r from-slate-50/90 to-slate-50/40 dark:from-slate-800/80 dark:to-slate-800/30 border border-slate-200/60 dark:border-slate-700/60 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-5">
          <div className="space-y-1.5">
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Kehadiran pribadi:</p>
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onNavigate && onNavigate("absensi-guru")}
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100/90 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-700/60 hover:opacity-90 transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" /> Hadir
              </button>
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">Masuk 06.53 · belum check-out</span>
            </div>
          </div>

          <div className="space-y-1 sm:text-right">
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-400 uppercase tracking-wider">Jurnal mengajar:</p>
            <div
              onClick={() => onNavigate && onNavigate("jurnal")}
              className="flex sm:justify-end items-baseline gap-2 cursor-pointer group"
            >
              <p className="text-2xl font-black text-slate-900 dark:text-white leading-none group-hover:text-red-600 dark:group-hover:text-red-400 transition">
                0<span className="text-slate-400 font-bold text-base">/3</span>
              </p>
            </div>
            <p
              onClick={() => onNavigate && onNavigate("jurnal")}
              className="text-xs font-medium text-amber-600 dark:text-amber-400 flex sm:justify-end items-center gap-1 cursor-pointer hover:underline"
            >
              <span>⚠️</span> 3 pertemuan belum berjurnal.
            </p>
          </div>
        </div>

        {/* 4 Bottom Action Buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => onNavigate && onNavigate("absensi-guru")}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-[0.98] border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold shadow-xs transition"
          >
            <span className="text-slate-400">→</span> Check-out
          </button>

          <button
            onClick={() => onNavigate && onNavigate("jurnal")}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-red-600 dark:hover:bg-red-700 active:scale-[0.98] text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            <span>✏️</span> Isi jurnal
          </button>

          <button
            onClick={() => onNavigate && onNavigate("absensi-siswa")}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-[0.98] border border-slate-200/90 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold shadow-xs transition"
          >
            <span>📋</span> Absensi kelas
          </button>

          <button
            onClick={() => onNavigate && onNavigate("agenda-piket")}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50/90 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 active:scale-[0.98] border border-emerald-200/90 dark:border-emerald-800/80 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-bold transition shadow-xs"
          >
            <span>🟢</span> Anda bertugas piket — buka agenda piket
          </button>
        </div>
      </section>

      {/* ── Main 2-Column Section (Cards & Chart on Left, Feed on Right) ── */}
      <section className="flex flex-col xl:flex-row gap-5 items-start">

        {/* Left Side: 3 Stat Cards + Tren Mingguan */}
        <div className="flex-1 space-y-5 w-full min-w-0">

          {/* 3 Stat Cards in a Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

            {/* Card 1: Absensi Siswa */}
            <div
              onClick={() => onNavigate && onNavigate("absensi-siswa")}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all duration-200 group"
            >
              <div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    Absensi siswa
                  </span>
                  <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between gap-2 mt-1">
                  <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">2/8</span>
                  <PremiumSparkline color="#22c55e" gradientId="sparkGreen" up={true} />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>+25.6%</span>
                  <span className="text-[11px] font-normal text-slate-400">vs minggu lalu</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span>kelas terkirim · 1 draft · hadir 94%</span>
                <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition" />
              </p>
            </div>

            {/* Card 2: Siswa Tidak Hadir */}
            <div
              onClick={() => onNavigate && onNavigate("tidak-hadir")}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all duration-200 group"
            >
              <div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    Siswa tidak hadir
                  </span>
                  <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition">
                    <UserX className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between gap-2 mt-1">
                  <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">4</span>
                  <PremiumSparkline color="#ef4444" gradientId="sparkRed" up={false} />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500 dark:text-rose-400 mt-1">
                  <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>-29.3%</span>
                  <span className="text-[11px] font-normal text-slate-400">vs minggu lalu</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span>S:2 · I:0 · A:2</span>
                <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition" />
              </p>
            </div>

            {/* Card 3: Jurnal Terisi */}
            <div
              onClick={() => onNavigate && onNavigate("jurnal")}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.03)] flex flex-col justify-between cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md transition-all duration-200 group"
            >
              <div>
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                    Jurnal terisi
                  </span>
                  <div className="p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition">
                    <PenTool className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="flex items-baseline justify-between gap-2 mt-1">
                  <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">0/26</span>
                  <PremiumSparkline color="#8b5cf6" gradientId="sparkPurple" up={false} />
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold text-rose-500 dark:text-rose-400 mt-1">
                  <ArrowDownRight className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>-15.5%</span>
                  <span className="text-[11px] font-normal text-slate-400">vs minggu lalu</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span>0% pertemuan berjurnal</span>
                <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition" />
              </p>
            </div>

          </div>

          {/* Bottom Card: Tren Kehadiran & Aktivitas Mingguan */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 p-5 sm:p-6 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">Tren Kehadiran & Aktivitas Mingguan</h3>
                <p className="text-xs text-slate-400 mt-0.5">Monitoring pergerakan operasional 6 hari sekolah</p>
              </div>

              {/* Segmented Pill Tabs */}
              <div className="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/70 dark:border-slate-700">
                <button
                  onClick={() => setTrendTab("kehadiran")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    trendTab === "kehadiran"
                      ? "bg-slate-900 text-white dark:bg-red-600 shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Kehadiran Siswa
                </button>
                <button
                  onClick={() => setTrendTab("ketidakhadiran")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    trendTab === "ketidakhadiran"
                      ? "bg-slate-900 text-white dark:bg-red-600 shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Ketidakhadiran (S/I/A)
                </button>
                <button
                  onClick={() => setTrendTab("jurnal")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    trendTab === "jurnal"
                      ? "bg-slate-900 text-white dark:bg-red-600 shadow-xs"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Jurnal Mengajar
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pt-1">
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">667</span>
                  <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800 px-2 py-0.5 rounded-full">
                    <span>▲ +25.6%</span>
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1.5">
                  Rata-rata <span className="font-bold text-slate-700 dark:text-slate-200">95.8%</span> kehadiran harian siswa SMK Plus Pelita Nusantara
                </p>
                <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-400">
                  <button
                    onClick={() => onNavigate && onNavigate("absensi-siswa")}
                    className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500" /> Buka Data Siswa →
                  </button>
                  <button
                    onClick={() => onNavigate && onNavigate("laporan")}
                    className="flex items-center gap-1.5 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full bg-slate-900 dark:bg-slate-300" /> Lihat Laporan Lengkap →
                  </button>
                </div>
              </div>

              {/* Bar Chart Visualization with Hover Tooltip */}
              <div className="flex items-end gap-3.5 sm:gap-5 h-32 flex-shrink-0 pt-4">
                {WEEK_DATA.map((item, idx) => {
                  const isHovered = hoveredBar === idx
                  return (
                    <div
                      key={item.day}
                      onClick={() => onNavigate && onNavigate("jadwal")}
                      onMouseEnter={() => setHoveredBar(idx)}
                      onMouseLeave={() => setHoveredBar(null)}
                      className="flex flex-col items-center gap-1.5 relative cursor-pointer group"
                      title={`Klik untuk lihat jadwal hari ${item.day}`}
                    >
                      {/* Tooltip on hover */}
                      {isHovered && (
                        <div className="absolute -top-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-[10px] py-1 px-2 rounded-md font-semibold whitespace-nowrap shadow-md z-10 animate-fade-in">
                          {item.count} Siswa ({item.value}%)
                        </div>
                      )}

                      <span className={`text-[10px] font-bold transition ${isHovered ? "text-slate-900 dark:text-white" : "text-slate-400"}`}>
                        {item.value}%
                      </span>

                      <div className="w-7 sm:w-8 bg-slate-100 dark:bg-slate-800 rounded-t-xl flex flex-col justify-end overflow-hidden h-20 group">
                        <div
                          className={`w-full rounded-t-xl transition-all duration-300 ${
                            idx === 0
                              ? "bg-gradient-to-t from-emerald-600 to-emerald-400"
                              : idx === 3
                              ? "bg-slate-900 dark:bg-slate-300"
                              : idx === 5
                              ? "bg-slate-400 dark:bg-slate-600"
                              : "bg-slate-700 dark:bg-slate-500 hover:bg-slate-800"
                          } ${isHovered ? "brightness-110" : ""}`}
                          style={{ height: `${item.value}%` }}
                        />
                      </div>

                      <span className={`text-xs font-semibold transition ${isHovered ? "text-slate-900 dark:text-white font-bold" : "text-slate-600 dark:text-slate-400"}`}>
                        {item.day}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Aktivitas & Pembaruan Terkini */}
        <div className="w-full xl:w-84 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.04)] flex flex-col flex-shrink-0 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 dark:text-white tracking-wider uppercase">Aktivitas & Pembaruan</h3>
            <button
              onClick={() => onNavigate && onNavigate("agenda-piket")}
              className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
              title="Lihat Semua Catatan Aktivitas"
            >
              <Bell className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 space-y-3.5">
            {/* 3 Tabs */}
            <div className="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700">
              {[
                { id: "hari-ini", label: "Hari ini" },
                { id: "kemarin", label: "Kemarin" },
                { id: "minggu-ini", label: "Minggu ini" },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActivityTab(tab.id)}
                  className={`flex-1 py-1 rounded-lg text-xs font-bold transition text-center ${
                    activityTab === tab.id
                      ? "bg-slate-900 dark:bg-red-600 text-white shadow-xs"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={activitySearch}
                onChange={e => setActivitySearch(e.target.value)}
                placeholder="Cari aktivitas..."
                className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-200/80 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:bg-white dark:focus:bg-slate-700 transition"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
              <span>{filteredActivities.length} aktivitas tercatat</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
              </span>
            </div>

            {/* Activity Items List with Direct Navigation on Click */}
            <div className="space-y-2 pt-0.5 max-h-[380px] overflow-y-auto scrollbar-hide">
              {filteredActivities.map(item => (
                <div
                  key={item.id}
                  onClick={() => onNavigate && onNavigate(item.page)}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50/90 dark:hover:bg-slate-800/80 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700 cursor-pointer group"
                  title={`Buka ${item.pageName}`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-xs font-bold shadow-xs ${item.bgClass}`}>
                    <span className="w-2 h-2 rounded-full mr-0.5" style={{ backgroundColor: "currentColor" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white leading-snug truncate group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight truncate">
                      {item.detail}
                    </p>
                  </div>
                  <div className="flex flex-col items-end flex-shrink-0 mt-0.5">
                    <span className="text-[10px] text-slate-400 font-mono font-medium">{item.time}</span>
                    <ChevronRight className="w-3 h-3 text-slate-300 dark:text-slate-600 group-hover:text-red-500 transition-colors mt-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>
    </div>
  )
}
