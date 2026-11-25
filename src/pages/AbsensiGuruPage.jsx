import React, { useState, useEffect } from "react"
import {
  GraduationCap, Search, Clock, CheckCircle2, Plus,
  Edit2, Trash2, Printer, ArrowRight,
  Check, X, ShieldAlert, Briefcase, FileSpreadsheet
} from "lucide-react"
import { exportToCSV } from "../utils/exportCsv"

const INITIAL_TEACHERS = [
  { id: 1, nama: "Agus Salim, S.Kom.", nip: "19880512 201402 1 002", mapel: "Pemrograman Web & PBO", kategori: "Produktif", jamMasuk: "06:53", jamKeluar: "-", status: "Hadir", tugasHariIni: "Piket & Mengajar X RPL" },
  { id: 2, nama: "Dra. Hj. Nurjanah, M.Pd.", nip: "19720315 199803 2 004", mapel: "Bahasa Indonesia", kategori: "Normatif/Adaptif", jamMasuk: "06:45", jamKeluar: "-", status: "Hadir", tugasHariIni: "Mengajar XI OTKP" },
  { id: 3, nama: "Hendra Wijaya, S.Pd.", nip: "19831120 200901 1 008", mapel: "Matematika", kategori: "Normatif/Adaptif", jamMasuk: "06:40", jamKeluar: "-", status: "Hadir", tugasHariIni: "Koordinator Piket" },
  { id: 4, nama: "Ratna Sari, M.Kom.", nip: "19920408 201801 2 005", mapel: "Basis Data & Cloud", kategori: "Produktif", jamMasuk: "07:15", jamKeluar: "-", status: "Terlambat", tugasHariIni: "Mengajar XI RPL 1" },
  { id: 5, nama: "Bambang Sudirman, S.T.", nip: "19800725 200604 1 003", mapel: "Teknik Jaringan WAN (TKJ)", kategori: "Produktif", jamMasuk: "-", jamKeluar: "-", status: "Tugas Luar", tugasHariIni: "Monitoring Siswa PKL Industri" },
  { id: 6, nama: "Dewi Lestari, S.Pd.", nip: "19910909 201703 2 007", mapel: "Bahasa Inggris", kategori: "Normatif/Adaptif", jamMasuk: "-", jamKeluar: "-", status: "Izin / Sakit", tugasHariIni: "Izin Sakit (Surat Dokter)" },
  { id: 7, nama: "Rizky Pratama, S.T.", nip: "19940217 202012 1 004", mapel: "Administrasi Sistem Jaringan", kategori: "Produktif", jamMasuk: "06:50", jamKeluar: "-", status: "Hadir", tugasHariIni: "Piket Lab Jaringan" },
  { id: 8, nama: "Farida Hanim, S.E.", nip: "19850110 201001 2 011", mapel: "Akuntansi Dasar & Keuangan", kategori: "Produktif", jamMasuk: "06:48", jamKeluar: "-", status: "Hadir", tugasHariIni: "Mengajar XII AKL" },
]

const AVATAR_COLORS = [
  "from-red-500 to-rose-600",
  "from-blue-500 to-indigo-600",
  "from-emerald-500 to-teal-600",
  "from-purple-500 to-indigo-600",
  "from-amber-500 to-orange-600",
  "from-cyan-500 to-blue-600"
]

export default function AbsensiGuruPage() {
  const [teachers, setTeachers] = useState(INITIAL_TEACHERS)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("Semua")
  const [kategoriFilter, setKategoriFilter] = useState("Semua")
  const [toast, setToast] = useState("")

  // Live real-time clock
  const [currentTime, setCurrentTime] = useState(() => new Date())
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Modal State
  const [showModal, setShowModal] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState(null)
  const [formData, setFormData] = useState({
    nama: "",
    nip: "",
    mapel: "",
    kategori: "Produktif",
    status: "Hadir",
    jamMasuk: "",
    jamKeluar: "-",
    tugasHariIni: ""
  })

  const triggerToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(""), 3500)
  }

  const getInitials = (name) => {
    return name
      .replace(/^(Dra\.|Dr\.|Hj\.|H\.|Bpk\.|Ibu\s)/gi, "")
      .trim()
      .split(" ")
      .slice(0, 2)
      .map(n => n[0])
      .join("")
      .toUpperCase() || "GR"
  }

  // Quick Check-in Current Time
  const handleQuickCheckIn = (id) => {
    const nowStr = currentTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(".", ":")
    setTeachers(prev => prev.map(t => {
      if (t.id === id) {
        const isLate = parseInt(nowStr.split(":")[0], 10) > 7 || (parseInt(nowStr.split(":")[0], 10) === 7 && parseInt(nowStr.split(":")[1], 10) > 0)
        return {
          ...t,
          jamMasuk: nowStr,
          status: isLate ? "Terlambat" : "Hadir"
        }
      }
      return t
    }))
    triggerToast("Presensi masuk guru berhasil dicatat!")
  }

  // Quick Check-out
  const handleQuickCheckOut = (id) => {
    const nowStr = currentTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(".", ":")
    setTeachers(prev => prev.map(t => {
      if (t.id === id) {
        return { ...t, jamKeluar: nowStr }
      }
      return t
    }))
    triggerToast("Presensi kepulangan guru berhasil dicatat!")
  }

  // Change status directly
  const handleStatusChange = (id, newStatus) => {
    const nowStr = currentTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(".", ":")
    setTeachers(prev => prev.map(t => {
      if (t.id === id) {
        let jamMasuk = t.jamMasuk
        if (newStatus === "Hadir" && jamMasuk === "-") jamMasuk = nowStr
        if (newStatus === "Tugas Luar" || newStatus === "Izin / Sakit") jamMasuk = "-"
        return { ...t, status: newStatus, jamMasuk }
      }
      return t
    }))
    triggerToast(`Status guru berhasil diubah menjadi "${newStatus}"`)
  }

  // Delete teacher
  const handleDeleteTeacher = (id, nama) => {
    if (window.confirm(`Hapus data presensi guru ${nama}?`)) {
      setTeachers(prev => prev.filter(t => t.id !== id))
      triggerToast(`Data ${nama} berhasil dihapus`)
    }
  }

  // Open Form Modal (Add or Edit)
  const openFormModal = (teacher = null) => {
    if (teacher) {
      setEditingTeacher(teacher)
      setFormData({
        nama: teacher.nama,
        nip: teacher.nip,
        mapel: teacher.mapel,
        kategori: teacher.kategori || "Produktif",
        status: teacher.status,
        jamMasuk: teacher.jamMasuk,
        jamKeluar: teacher.jamKeluar,
        tugasHariIni: teacher.tugasHariIni
      })
    } else {
      const nowStr = currentTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(".", ":")
      setEditingTeacher(null)
      setFormData({
        nama: "",
        nip: "",
        mapel: "",
        kategori: "Produktif",
        status: "Hadir",
        jamMasuk: nowStr,
        jamKeluar: "-",
        tugasHariIni: "Mengajar & Piket"
      })
    }
    setShowModal(true)
  }

  // Submit Form
  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (!formData.nama.trim() || !formData.mapel.trim()) {
      alert("Nama guru dan mata pelajaran wajib diisi!")
      return
    }

    if (editingTeacher) {
      setTeachers(prev => prev.map(t => t.id === editingTeacher.id ? { ...t, ...formData } : t))
      triggerToast(`Data presensi ${formData.nama} berhasil diperbarui`)
    } else {
      const newEntry = {
        id: Date.now(),
        ...formData
      }
      setTeachers(prev => [newEntry, ...prev])
      triggerToast(`Presensi guru ${formData.nama} berhasil ditambahkan`)
    }
    setShowModal(false)
  }

  // Real CSV Export
  const handleExportCSV = () => {
    const headers = ["No", "Nama Guru", "NIP", "Mata Pelajaran", "Kategori", "Jam Masuk", "Jam Keluar", "Status", "Agenda / Keterangan"]
    const rows = filteredTeachers.map((t, idx) => [
      idx + 1,
      t.nama,
      t.nip,
      t.mapel,
      t.kategori || "-",
      t.jamMasuk,
      t.jamKeluar,
      t.status,
      t.tugasHariIni
    ])
    const dateStr = currentTime.toISOString().split("T")[0]
    exportToCSV(`presensi_guru_smk_plus_pelita_${dateStr}.csv`, headers, rows)
    triggerToast("File CSV Presensi Guru berhasil diunduh!")
  }

  // Print function
  const handlePrint = () => {
    window.print()
  }

  // Filtering
  const filteredTeachers = teachers.filter(t => {
    const matchFilter = filter === "Semua" || t.status === filter
    const matchKategori = kategoriFilter === "Semua" || t.kategori === kategoriFilter
    const matchSearch =
      t.nama.toLowerCase().includes(search.toLowerCase()) ||
      t.mapel.toLowerCase().includes(search.toLowerCase()) ||
      t.nip.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchKategori && matchSearch
  })

  // Summary counts
  const totalGuru = teachers.length
  const hadirTepatWaktu = teachers.filter(t => t.status === "Hadir").length
  const terlambat = teachers.filter(t => t.status === "Terlambat").length
  const tugasLuar = teachers.filter(t => t.status === "Tugas Luar").length
  const izinSakit = teachers.filter(t => t.status === "Izin / Sakit").length
  const persentaseHadir = totalGuru > 0 ? Math.round(((hadirTepatWaktu + terlambat) / totalGuru) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 dark:bg-slate-100/95 backdrop-blur-md text-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-sm font-semibold border border-slate-700 dark:border-slate-300 animate-in fade-in slide-in-from-bottom-5 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-44 h-44 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-20 -bottom-10 w-36 h-36 bg-black/10 rounded-full blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Sistem Presensi Guru Real-Time
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight flex items-center gap-3">
              <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              Presensi & Kehadiran Guru
            </h1>
            <p className="text-red-100 text-sm sm:text-base max-w-2xl leading-relaxed">
              Monitoring disiplin kehadiran, jam masuk/pulang, dan agenda tugas dewan guru SMK Plus Pelita Nusantara.
            </p>
          </div>

          {/* Live Clock & Action Buttons */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-2xl flex items-center gap-3 shadow-inner">
              <Clock className="w-5 h-5 text-red-200 animate-pulse" />
              <div>
                <p className="text-[11px] text-red-200 uppercase font-medium tracking-wider">
                  {currentTime.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "short", year: "numeric" })}
                </p>
                <p className="text-lg font-black tracking-tight font-mono">
                  {currentTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" })} WIB
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => openFormModal()}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-red-700 hover:bg-red-50 rounded-xl text-sm font-bold shadow-md transition transform active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Catat Guru
              </button>
              <button
                onClick={handleExportCSV}
                title="Export ke format CSV Excel"
                className="flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-white/15 hover:bg-white/25 text-white border border-white/20 rounded-xl text-sm font-semibold transition active:scale-95 cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4" /> Export CSV
              </button>
              <button
                onClick={handlePrint}
                title="Cetak Rekap Presensi"
                className="flex items-center justify-center p-2.5 bg-white/15 hover:bg-white/25 text-white border border-white/20 rounded-xl text-sm font-semibold transition active:scale-95 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards / Interactive Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Total Card */}
        <button
          onClick={() => setFilter("Semua")}
          className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${filter === "Semua"
            ? "bg-red-50/80 dark:bg-red-950/30 border-red-500 dark:border-red-600 ring-2 ring-red-500/20 shadow-md"
            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm"
            }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Dewan Guru</p>
            <GraduationCap className="w-4 h-4 text-slate-400 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 mt-2">{totalGuru}</p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Tingkat Kehadiran:</span>
            <span className="text-xs font-black text-red-600 dark:text-red-400">{persentaseHadir}%</span>
          </div>
        </button>

        {/* Hadir Card */}
        <button
          onClick={() => setFilter("Hadir")}
          className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${filter === "Hadir"
            ? "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-500 dark:border-emerald-600 ring-2 ring-emerald-500/20 shadow-md"
            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm"
            }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Hadir Tepat Waktu</p>
            <CheckCircle2 className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-2">{hadirTepatWaktu}</p>
          <span className="text-[11px] text-emerald-500/90 mt-2 block font-medium">Sebelum 07:00 WIB</span>
        </button>

        {/* Terlambat Card */}
        <button
          onClick={() => setFilter("Terlambat")}
          className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${filter === "Terlambat"
            ? "bg-amber-50/80 dark:bg-amber-950/30 border-amber-500 dark:border-amber-600 ring-2 ring-amber-500/20 shadow-md"
            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm"
            }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Terlambat</p>
            <Clock className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 dark:text-amber-400 mt-2">{terlambat}</p>
          <span className="text-[11px] text-amber-500/90 mt-2 block font-medium">Setelah bel 07:00</span>
        </button>

        {/* Tugas Luar Card */}
        <button
          onClick={() => setFilter("Tugas Luar")}
          className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer ${filter === "Tugas Luar"
            ? "bg-blue-50/80 dark:bg-blue-950/30 border-blue-500 dark:border-blue-600 ring-2 ring-blue-500/20 shadow-md"
            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm"
            }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Tugas Luar</p>
            <Briefcase className="w-4 h-4 text-blue-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 mt-2">{tugasLuar}</p>
          <span className="text-[11px] text-blue-500/90 mt-2 block font-medium">Dinas / PKL / Diklat</span>
        </button>

        {/* Izin / Sakit Card */}
        <button
          onClick={() => setFilter("Izin / Sakit")}
          className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group cursor-pointer col-span-2 sm:col-span-1 ${filter === "Izin / Sakit"
            ? "bg-purple-50/80 dark:bg-purple-950/30 border-purple-500 dark:border-purple-600 ring-2 ring-purple-500/20 shadow-md"
            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 shadow-sm"
            }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400">Izin / Sakit</p>
            <ShieldAlert className="w-4 h-4 text-purple-500 group-hover:scale-110 transition-transform" />
          </div>
          <p className="text-2xl sm:text-3xl font-black text-purple-600 dark:text-purple-400 mt-2">{izinSakit}</p>
          <span className="text-[11px] text-purple-500/90 mt-2 block font-medium">Surat keterangan</span>
        </button>
      </div>

      {/* Disiplin Progress Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Indikator Disiplin Guru Hari Ini</span>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300">
              {persentaseHadir}% Kehadiran Aktif
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {hadirTepatWaktu} guru tepat waktu, {terlambat} terlambat, {tugasLuar + izinSakit} dinas luar / izin dari total {totalGuru} pendidik.
          </p>
        </div>
        <div className="w-full sm:w-64 bg-slate-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden flex">
          <div style={{ width: `${(hadirTepatWaktu / (totalGuru || 1)) * 100}%` }} className="bg-emerald-500 transition-all duration-500" title={`Hadir: ${hadirTepatWaktu}`} />
          <div style={{ width: `${(terlambat / (totalGuru || 1)) * 100}%` }} className="bg-amber-500 transition-all duration-500" title={`Terlambat: ${terlambat}`} />
          <div style={{ width: `${(tugasLuar / (totalGuru || 1)) * 100}%` }} className="bg-blue-500 transition-all duration-500" title={`Tugas Luar: ${tugasLuar}`} />
          <div style={{ width: `${(izinSakit / (totalGuru || 1)) * 100}%` }} className="bg-purple-500 transition-all duration-500" title={`Izin: ${izinSakit}`} />
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama guru, NIP, atau mata pelajaran..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Kategori Mapel Filter */}
          <select
            value={kategoriFilter}
            onChange={e => setKategoriFilter(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Produktif">Produktif (Kejuruan)</option>
            <option value="Normatif/Adaptif">Normatif / Adaptif</option>
          </select>

          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {["Semua", "Hadir", "Terlambat", "Tugas Luar", "Izin / Sakit"].map(st => (
              <button
                key={st}
                onClick={() => setFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${filter === st
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Teacher Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 text-xs uppercase font-bold tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-5 py-4">Nama Guru & NIP</th>
                <th className="px-5 py-4">Mata Pelajaran</th>
                <th className="px-5 py-4">Jam Masuk / Pulang</th>
                <th className="px-5 py-4">Status Kehadiran</th>
                <th className="px-5 py-4">Agenda / Tugas Piket</th>
                <th className="px-5 py-4 text-center">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                      <p className="font-semibold text-slate-600 dark:text-slate-400">Tidak ada data guru yang cocok</p>
                      <p className="text-xs text-slate-400">Coba ganti kata kunci pencarian atau reset filter status.</p>
                      <button
                        onClick={() => { setSearch(""); setFilter("Semua"); setKategoriFilter("Semua") }}
                        className="mt-2 px-3 py-1.5 bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 rounded-xl text-xs font-semibold hover:bg-red-100 transition"
                      >
                        Reset Semua Filter
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher, index) => {
                  const avatarGradient = AVATAR_COLORS[index % AVATAR_COLORS.length]
                  return (
                    <tr key={teacher.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition">
                      {/* Name & Avatar */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${avatarGradient} text-white font-bold flex items-center justify-center text-xs shadow-sm flex-shrink-0`}>
                            {getInitials(teacher.nama)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                              {teacher.nama}
                            </div>
                            <div className="text-xs text-slate-400 font-mono mt-0.5">
                              NIP: {teacher.nip}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Mapel & Kategori */}
                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                          {teacher.mapel}
                        </div>
                        <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded-md mt-1 ${teacher.kategori === "Produktif"
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                          : "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300"
                          }`}>
                          {teacher.kategori || "Umum"}
                        </span>
                      </td>

                      {/* Time */}
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-slate-300">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>Masuk: <strong className={teacher.jamMasuk !== "-" ? "text-slate-900 dark:text-white" : "text-slate-400 font-normal"}>{teacher.jamMasuk}</strong></span>
                          </div>
                          <div className="text-[11px] text-slate-400">
                            Pulang: <strong className={teacher.jamKeluar !== "-" ? "text-slate-700 dark:text-slate-300" : "text-slate-400 font-normal"}>{teacher.jamKeluar || "-"}</strong>
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide ${teacher.status === "Hadir"
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50"
                          : teacher.status === "Terlambat"
                            ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50"
                            : teacher.status === "Tugas Luar"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50"
                              : "bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800/50"
                          }`}>
                          <span className={`w-2 h-2 rounded-full ${teacher.status === "Hadir" ? "bg-emerald-500 animate-pulse" :
                            teacher.status === "Terlambat" ? "bg-amber-500" :
                              teacher.status === "Tugas Luar" ? "bg-blue-500" : "bg-purple-500"
                            }`} />
                          {teacher.status}
                        </span>
                      </td>

                      {/* Agenda */}
                      <td className="px-5 py-4 max-w-xs">
                        <div className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2">
                          {teacher.tugasHariIni || "-"}
                        </div>
                      </td>

                      {/* Quick Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          {teacher.jamMasuk === "-" ? (
                            <button
                              onClick={() => handleQuickCheckIn(teacher.id)}
                              title="Catat Jam Masuk Sekarang"
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition active:scale-95 flex items-center gap-1"
                            >
                              <Check className="w-3.5 h-3.5" /> Masuk
                            </button>
                          ) : teacher.jamKeluar === "-" ? (
                            <button
                              onClick={() => handleQuickCheckOut(teacher.id)}
                              title="Catat Jam Pulang Sekarang"
                              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-sm transition active:scale-95 flex items-center gap-1"
                            >
                              <ArrowRight className="w-3.5 h-3.5" /> Pulang
                            </button>
                          ) : null}

                          {/* Status toggle selector */}
                          <select
                            value={teacher.status}
                            onChange={(e) => handleStatusChange(teacher.id, e.target.value)}
                            className="text-xs py-1.5 px-2 bg-slate-100 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
                            title="Ubah Status Kehadiran Cepat"
                          >
                            <option value="Hadir">Hadir</option>
                            <option value="Terlambat">Terlambat</option>
                            <option value="Tugas Luar">Tugas Luar</option>
                            <option value="Izin / Sakit">Izin / Sakit</option>
                          </select>

                          {/* Edit Details */}
                          <button
                            onClick={() => openFormModal(teacher)}
                            title="Edit Data Guru"
                            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDeleteTeacher(teacher.id, teacher.nama)}
                            title="Hapus Dari Daftar Presensi"
                            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit Teacher Attendance */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transform animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-700/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-sm">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-lg">
                    {editingTeacher ? "Edit Presensi Guru" : "Catat Presensi Guru Baru"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    SMK Plus Pelita Nusantara • Dewan Tenaga Pendidik
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Nama Lengkap & Gelar *
                </label>
                <input
                  type="text"
                  required
                  value={formData.nama}
                  onChange={e => setFormData({ ...formData, nama: e.target.value })}
                  placeholder="Contoh: Muhammad Arif, S.Kom."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    NIP / NUPTK
                  </label>
                  <input
                    type="text"
                    value={formData.nip}
                    onChange={e => setFormData({ ...formData, nip: e.target.value })}
                    placeholder="19880101 201501 1 001"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Kategori Mapel
                  </label>
                  <select
                    value={formData.kategori}
                    onChange={e => setFormData({ ...formData, kategori: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    <option value="Produktif">Produktif (Kejuruan)</option>
                    <option value="Normatif/Adaptif">Normatif / Adaptif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Mata Pelajaran yang Diampu *
                </label>
                <input
                  type="text"
                  required
                  value={formData.mapel}
                  onChange={e => setFormData({ ...formData, mapel: e.target.value })}
                  placeholder="Contoh: Pemrograman Web & Bergerak"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Status Kehadiran
                  </label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-semibold focus:ring-2 focus:ring-red-500 focus:outline-none"
                  >
                    <option value="Hadir">Hadir</option>
                    <option value="Terlambat">Terlambat</option>
                    <option value="Tugas Luar">Tugas Luar</option>
                    <option value="Izin / Sakit">Izin / Sakit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Jam Masuk
                  </label>
                  <input
                    type="text"
                    value={formData.jamMasuk}
                    onChange={e => setFormData({ ...formData, jamMasuk: e.target.value })}
                    placeholder="06:50 atau -"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Jam Pulang
                  </label>
                  <input
                    type="text"
                    value={formData.jamKeluar}
                    onChange={e => setFormData({ ...formData, jamKeluar: e.target.value })}
                    placeholder="15:30 atau -"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs font-mono focus:ring-2 focus:ring-red-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Agenda / Tugas Hari Ini / Keterangan
                </label>
                <textarea
                  rows={2}
                  value={formData.tugasHariIni}
                  onChange={e => setFormData({ ...formData, tugasHariIni: e.target.value })}
                  placeholder="Contoh: Mengajar X RPL & Petugas Piket Koridor"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:ring-2 focus:ring-red-500 focus:outline-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-md transition active:scale-95"
                >
                  {editingTeacher ? "Simpan Perubahan" : "Simpan Presensi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
