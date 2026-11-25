import React, { useState } from "react"
import {
  Calendar, ShieldCheck, Clock, UserCheck,
  Plus, Edit2, Trash2, CheckCircle2, UserX,
  Search, FileSpreadsheet, ChevronDown, X
} from "lucide-react"
import { exportToCSV } from "../utils/exportCsv"

// Daftar Pilihan Guru untuk Dropdown Piket
const ALL_TEACHERS = [
  "Agus Salim, S.Kom.",
  "Dra. Hj. Nurjanah, M.Pd.",
  "Hendra Wijaya, S.Pd.",
  "Ratna Sari, M.Kom.",
  "Bambang Sudirman, S.T.",
  "Dewi Lestari, S.Pd.",
  "Rizky Pratama, S.T.",
  "Farida Hanim, S.E.",
  "Fikri Ramadhan, S.Pd.",
  "Siti Nurhaliza, M.Pd."
]

// Data awal Guru yang Terjadwal Hadir Hari Ini
const INITIAL_TEACHERS = [
  { id: 1, nama: "Agus Salim, S.Kom.", nip: "19880512 201402 1 002", mapel: "Pemrograman Web & PBO", jamMasuk: "06:45", status: "Hadir", keterangan: "Mengajar X RPL 1 & Piket Pagi" },
  { id: 2, nama: "Dra. Hj. Nurjanah, M.Pd.", nip: "19720315 199803 2 004", mapel: "Bahasa Indonesia", jamMasuk: "06:40", status: "Hadir", keterangan: "Mengajar XI OTKP 1" },
  { id: 3, nama: "Hendra Wijaya, S.Pd.", nip: "19831120 200901 1 008", mapel: "Matematika", jamMasuk: "06:35", status: "Hadir", keterangan: "Koordinator Piket & Mengajar XII TKJ" },
  { id: 4, nama: "Rizky Pratama, S.T.", nip: "19940217 202012 1 004", mapel: "Administrasi Sistem Jaringan", jamMasuk: "06:50", status: "Hadir", keterangan: "Mengajar XII TKJ 1" },
  { id: 5, nama: "Farida Hanim, S.E.", nip: "19850110 201001 2 011", mapel: "Akuntansi Dasar & Keuangan", jamMasuk: "06:48", status: "Hadir", keterangan: "Mengajar X AKL" },
  { id: 6, nama: "Ratna Sari, M.Kom.", nip: "19920408 201801 2 005", mapel: "Basis Data & Cloud", jamMasuk: "07:15", status: "Terlambat", keterangan: "Mengajar XI RPL 1 (Terlambat karena kendala jalan)" },
  // Guru yang tidak hadir (akan otomatis ditaruh di paling bawah)
  { id: 7, nama: "Bambang Sudirman, S.T.", nip: "19800725 200604 1 003", mapel: "Teknik Jaringan WAN (TKJ)", jamMasuk: "-", status: "Tugas Luar", keterangan: "Monitoring Siswa PKL Industri (PT Telekomunikasi)" },
  { id: 8, nama: "Dewi Lestari, S.Pd.", nip: "19910909 201703 2 007", mapel: "Bahasa Inggris", jamMasuk: "-", status: "Sakit", keterangan: "Demam tinggi & flu (Surat Dokter terlampir)" },
  { id: 9, nama: "Fikri Ramadhan, S.Pd.", nip: "19901115 201903 1 006", mapel: "Pendidikan Jasmani & Olahraga", jamMasuk: "-", status: "Izin", keterangan: "Izin menghadiri resepsi pernikahan adik kandung" },
]

// Data awal Penanggulangan Jam Kosong
const INITIAL_JAM_KOSONG = [
  {
    id: 1,
    jamKe: "Jam 3 - 4 (08:45 - 10:15)",
    kelas: "XI TKJ 2",
    mapel: "Teknik Jaringan WAN",
    guruAsli: "Bambang Sudirman, S.T.",
    alasan: "Tugas Luar (Monitoring PKL)",
    guruInval: "Hendra Wijaya, S.Pd. (Piket)",
    tugas: "Mengerjakan modul konfigurasi routing mikrotik bab 4",
    status: "Terdampingi"
  },
  {
    id: 2,
    jamKe: "Jam 5 - 6 (10:30 - 12:00)",
    kelas: "X RPL 2",
    mapel: "Bahasa Inggris",
    guruAsli: "Dewi Lestari, S.Pd.",
    alasan: "Izin Sakit",
    guruInval: "Agus Salim, S.Kom. (Piket)",
    tugas: "Tugas mandiri reading comprehension hal 45 di Google Classroom",
    status: "Terdampingi"
  },
  {
    id: 3,
    jamKe: "Jam 7 - 8 (13:15 - 14:45)",
    kelas: "X TKJ 1",
    mapel: "Pendidikan Jasmani",
    guruAsli: "Fikri Ramadhan, S.Pd.",
    alasan: "Izin Keluarga",
    guruInval: "-",
    tugas: "Materi teori kebugaran jasmani & tugas rangkuman",
    status: "Butuh Pendampingan"
  }
]

export default function AgendaPiketPage() {
  // State Tanggal & Guru Piket
  const [selectedDate, setSelectedDate] = useState(() => {
    return new Date().toISOString().split("T")[0]
  })
  const [piketKoordinator, setPiketKoordinator] = useState("Hendra Wijaya, S.Pd.")
  const [piketPetugas1, setPiketPetugas1] = useState("Agus Salim, S.Kom.")
  const [piketPetugas2, setPiketPetugas2] = useState("Dra. Hj. Nurjanah, M.Pd.")

  // State List Guru (Tabel 1)
  const [teachers, setTeachers] = useState(INITIAL_TEACHERS)
  const [searchTeacher, setSearchTeacher] = useState("")
  const [showTeacherModal, setShowTeacherModal] = useState(false)
  const [editingTeacher, setEditingTeacher] = useState(null)
  const [teacherForm, setTeacherForm] = useState({
    nama: "",
    nip: "",
    mapel: "",
    jamMasuk: "06:45",
    status: "Hadir",
    keterangan: ""
  })

  // State Jam Kosong (Tabel 2)
  const [jamKosongList, setJamKosongList] = useState(INITIAL_JAM_KOSONG)
  const [showJamKosongModal, setShowJamKosongModal] = useState(false)
  const [editingJamKosong, setEditingJamKosong] = useState(null)
  const [jamKosongForm, setJamKosongForm] = useState({
    jamKe: "Jam 3 - 4 (08:45 - 10:15)",
    kelas: "X TKJ 1",
    mapel: "",
    guruAsli: "",
    alasan: "",
    guruInval: piketPetugas1,
    tugas: "",
    status: "Terdampingi"
  })

  const [toast, setToast] = useState("")

  const triggerToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(""), 3500)
  }

  // ─── SORTING RULE: Guru Tidak Hadir SELALU DI PALING BAWAH ────────────────
  const isAbsent = (st) => ["Tidak Hadir", "Sakit", "Izin", "Alfa", "Tugas Luar"].includes(st)

  const sortedTeachers = [...teachers]
    .filter(t =>
      t.nama.toLowerCase().includes(searchTeacher.toLowerCase()) ||
      t.mapel.toLowerCase().includes(searchTeacher.toLowerCase()) ||
      t.status.toLowerCase().includes(searchTeacher.toLowerCase())
    )
    .sort((a, b) => {
      const aAbsent = isAbsent(a.status)
      const bAbsent = isAbsent(b.status)
      if (aAbsent && !bAbsent) return 1  // a (absen) ditaruh di bawah
      if (!aAbsent && bAbsent) return -1 // b (absen) ditaruh di bawah
      return 0
    })

  // ─── TEACHER CRUD HANDLERS ────────────────────────────────────────────────
  const handleOpenTeacherModal = (teacher = null) => {
    if (teacher) {
      setEditingTeacher(teacher)
      setTeacherForm({ ...teacher })
    } else {
      setEditingTeacher(null)
      setTeacherForm({
        nama: "",
        nip: "",
        mapel: "",
        jamMasuk: "06:45",
        status: "Hadir",
        keterangan: ""
      })
    }
    setShowTeacherModal(true)
  }

  const handleTeacherSubmit = (e) => {
    e.preventDefault()
    if (!teacherForm.nama || !teacherForm.mapel) {
      alert("Nama guru dan mata pelajaran wajib diisi!")
      return
    }

    if (editingTeacher) {
      setTeachers(prev => prev.map(t => t.id === editingTeacher.id ? { ...teacherForm, id: t.id } : t))
      triggerToast(`Data ${teacherForm.nama} berhasil diperbarui`)
    } else {
      const newEntry = {
        id: Date.now(),
        ...teacherForm
      }
      setTeachers(prev => [newEntry, ...prev])
      triggerToast(`Guru ${teacherForm.nama} berhasil ditambahkan`)
    }
    setShowTeacherModal(false)
  }

  const handleTeacherStatusChange = (id, newStatus) => {
    setTeachers(prev => prev.map(t => {
      if (t.id === id) {
        const jam = ["Hadir", "Terlambat"].includes(newStatus) ? (t.jamMasuk === "-" ? "06:50" : t.jamMasuk) : "-"
        return { ...t, status: newStatus, jamMasuk: jam }
      }
      return t
    }))
    triggerToast("Status kehadiran guru diperbarui")
  }

  const handleDeleteTeacher = (id, nama) => {
    if (window.confirm(`Hapus data kehadiran ${nama}?`)) {
      setTeachers(prev => prev.filter(t => t.id !== id))
      triggerToast(`Data ${nama} telah dihapus`)
    }
  }

  // ─── JAM KOSONG CRUD HANDLERS ─────────────────────────────────────────────
  const handleOpenJamKosongModal = (item = null) => {
    if (item) {
      setEditingJamKosong(item)
      setJamKosongForm({ ...item })
    } else {
      setEditingJamKosong(null)
      setJamKosongForm({
        jamKe: "Jam 3 - 4 (08:45 - 10:15)",
        kelas: "X TKJ 1",
        mapel: "",
        guruAsli: "",
        alasan: "",
        guruInval: piketPetugas1,
        tugas: "",
        status: "Terdampingi"
      })
    }
    setShowJamKosongModal(true)
  }

  const handleJamKosongSubmit = (e) => {
    e.preventDefault()
    if (!jamKosongForm.kelas || !jamKosongForm.mapel) {
      alert("Kelas dan mapel wajib diisi!")
      return
    }

    if (editingJamKosong) {
      setJamKosongList(prev => prev.map(j => j.id === editingJamKosong.id ? { ...jamKosongForm, id: j.id } : j))
      triggerToast("Penanganan jam kosong berhasil diperbarui")
    } else {
      const newEntry = {
        id: Date.now(),
        ...jamKosongForm
      }
      setJamKosongList(prev => [newEntry, ...prev])
      triggerToast("Data penanggulangan jam kosong berhasil dicatat!")
    }
    setShowJamKosongModal(false)
  }

  const handleAssignSelfInval = (id) => {
    setJamKosongList(prev => prev.map(j => {
      if (j.id === id) {
        return {
          ...j,
          guruInval: piketPetugas1,
          status: "Terdampingi"
        }
      }
      return j
    }))
    triggerToast(`Anda (${piketPetugas1}) menugaskan diri mendampingi kelas ini!`)
  }

  const handleDeleteJamKosong = (id) => {
    if (window.confirm("Hapus catatan jam kosong ini?")) {
      setJamKosongList(prev => prev.filter(j => j.id !== id))
      triggerToast("Catatan jam kosong dihapus")
    }
  }

  // Export Agenda Hari Ini
  const handleExportAgenda = () => {
    const headers = ["Kategori", "Nama Guru / Info", "Mapel / Kelas", "Jam / Waktu", "Status", "Keterangan / Tugas", "Inval / Catatan"]
    const rows = [
      ...sortedTeachers.map(t => [
        "Kehadiran Guru",
        t.nama,
        t.mapel,
        t.jamMasuk,
        t.status,
        t.keterangan,
        t.nip
      ]),
      ...jamKosongList.map(j => [
        "Penanggulangan Jam Kosong",
        `Guru Asli: ${j.guruAsli}`,
        `${j.kelas} - ${j.mapel}`,
        j.jamKe,
        j.status,
        `Tugas: ${j.tugas}`,
        `Guru Inval: ${j.guruInval}`
      ])
    ]
    exportToCSV(`agenda_piket_kegiatan_sekolah_${selectedDate}.csv`, headers, rows)
    triggerToast("Agenda harian piket berhasil diexport ke CSV!")
  }

  // Counters
  const countHadir = teachers.filter(t => !isAbsent(t.status)).length
  const countTidakHadir = teachers.filter(t => isAbsent(t.status)).length
  const countJamKosong = jamKosongList.length
  const countTerdampingi = jamKosongList.filter(j => j.status === "Terdampingi").length

  return (
    <div className="space-y-7">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 dark:bg-slate-100/95 text-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-sm font-semibold border border-slate-700 dark:border-slate-300 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
          <span>{toast}</span>
        </div>
      )}

      {/* ─── HEADER: Tanggal & Aksi Export ──────────────────────────────── */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 rounded-3xl p-6 sm:p-7 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs font-semibold tracking-wide uppercase mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              Buku Operasional & Agenda Piket Harian
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Agenda Kegiatan Sekolah
            </h1>
            <p className="text-red-100 text-sm mt-1 max-w-xl">
              Pencatatan guru terjadwal hari ini, pemisahan guru berhalangan hadir, dan penanggulangan jam kosong kelas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Input Hari & Tanggal */}
            <div className="bg-white/15 backdrop-blur-md border border-white/20 px-3.5 py-2 rounded-2xl flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-white" />
              <input
                type="date"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
                className="bg-transparent text-white text-xs sm:text-sm font-bold focus:outline-none cursor-pointer"
              />
            </div>

            <button
              onClick={handleExportAgenda}
              className="flex items-center gap-2 px-4 py-2.5 bg-white text-red-700 hover:bg-red-50 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition active:scale-95 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" /> Export Agenda
            </button>
          </div>
        </div>
      </div>

      {/* ─── DROPDOWN NAMA GURU YANG PIKET HARI INI ─────────────────────── */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                Petugas Guru Piket Hari Ini
              </h2>
              <p className="text-xs text-slate-400">Pilih dewan guru yang bertugas piket hari ini melalui dropdown</p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40">
            Shift Aktif (06:30 - 15:30)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Koordinator Piket */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Koordinator Piket
            </label>
            <div className="relative">
              <select
                value={piketKoordinator}
                onChange={e => {
                  setPiketKoordinator(e.target.value)
                  triggerToast(`Koordinator Piket diubah: ${e.target.value}`)
                }}
                className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none cursor-pointer"
              >
                {ALL_TEACHERS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Petugas Piket 1 */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Petugas Piket 1 (Gerbang & Lobi)
            </label>
            <div className="relative">
              <select
                value={piketPetugas1}
                onChange={e => {
                  setPiketPetugas1(e.target.value)
                  triggerToast(`Petugas Piket 1 diubah: ${e.target.value}`)
                }}
                className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none cursor-pointer"
              >
                {ALL_TEACHERS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Petugas Piket 2 */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Petugas Piket 2 (UKS & Koridor)
            </label>
            <div className="relative">
              <select
                value={piketPetugas2}
                onChange={e => {
                  setPiketPetugas2(e.target.value)
                  triggerToast(`Petugas Piket 2 diubah: ${e.target.value}`)
                }}
                className="w-full pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 appearance-none cursor-pointer"
              >
                {ALL_TEACHERS.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── STATS RINGKASAN PIKET ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Guru Terjadwal Hari Ini</p>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{teachers.length}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Jadwal KBM Aktif</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Guru Hadir / Terlambat</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{countHadir}</p>
          <span className="text-[11px] text-emerald-500 mt-0.5 block">Di lingkungan sekolah</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-red-600 dark:text-red-400">Guru Tidak Hadir (Absen)</p>
          <p className="text-2xl font-black text-red-600 dark:text-red-400 mt-1">{countTidakHadir}</p>
          <span className="text-[11px] text-red-500 mt-0.5 block">Sakit / Izin / Tugas Luar</span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Jam Kosong Terdampingi</p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{countTerdampingi} / {countJamKosong}</p>
          <span className="text-[11px] text-amber-500 mt-0.5 block">Ditangani guru piket</span>
        </div>
      </div>

      {/* ─── TABEL 1: DAFTAR GURU YANG HARUS HADIR HARI INI ──────────────── */}
      <div className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-red-600" />
              1. Daftar Guru yang Harus Hadir Hari Ini
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Guru yang <strong>tidak hadir / izin / sakit / tugas luar</strong> otomatis ditaruh di <strong>bagian paling bawah tabel</strong> lengkap dengan keterangan.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-48 sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTeacher}
                onChange={e => setSearchTeacher(e.target.value)}
                placeholder="Cari guru atau mapel..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-red-500"
              />
            </div>
            <button
              onClick={() => handleOpenTeacherModal()}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition active:scale-95 shadow-xs cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5" /> Tambah Guru
            </button>
          </div>
        </div>

        {/* Tabel Guru */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-xs uppercase font-bold tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-5 py-3.5">Nama Guru & NIP</th>
                  <th className="px-5 py-3.5">Mata Pelajaran</th>
                  <th className="px-5 py-3.5">Jam Masuk</th>
                  <th className="px-5 py-3.5">Status Kehadiran</th>
                  <th className="px-5 py-3.5">Agenda / Keterangan</th>
                  <th className="px-5 py-3.5 text-center">Aksi (CRUD)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {sortedTeachers.map((teacher) => {
                  const absent = isAbsent(teacher.status)
                  return (
                    <tr
                      key={teacher.id}
                      className={`transition ${
                        absent
                          ? "bg-red-50/40 dark:bg-red-950/20 hover:bg-red-50/70 dark:hover:bg-red-950/30"
                          : "hover:bg-slate-50/80 dark:hover:bg-slate-700/40"
                      }`}
                    >
                      {/* Nama & NIP */}
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center flex-shrink-0 ${
                            absent
                              ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200"
                          }`}>
                            {absent ? <UserX className="w-4 h-4" /> : teacher.nama.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                              {teacher.nama}
                            </div>
                            <div className="text-xs text-slate-400 font-mono">NIP: {teacher.nip}</div>
                          </div>
                        </div>
                      </td>

                      {/* Mapel */}
                      <td className="px-5 py-3.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        {teacher.mapel}
                      </td>

                      {/* Jam Masuk */}
                      <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span className={teacher.jamMasuk !== "-" ? "font-bold text-slate-800 dark:text-slate-200" : "text-slate-400 font-normal"}>
                            {teacher.jamMasuk}
                          </span>
                        </div>
                      </td>

                      {/* Status Kehadiran (Interactive dropdown) */}
                      <td className="px-5 py-3.5">
                        <select
                          value={teacher.status}
                          onChange={e => handleTeacherStatusChange(teacher.id, e.target.value)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none transition ${
                            teacher.status === "Hadir"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300"
                              : teacher.status === "Terlambat"
                              ? "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300"
                              : teacher.status === "Tugas Luar"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300"
                              : teacher.status === "Sakit"
                              ? "bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300"
                              : "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300 border-red-300"
                          }`}
                        >
                          <option value="Hadir">Hadir</option>
                          <option value="Terlambat">Terlambat</option>
                          <option value="Tugas Luar">Tugas Luar</option>
                          <option value="Sakit">Sakit</option>
                          <option value="Izin">Izin</option>
                          <option value="Alfa">Alfa</option>
                        </select>
                      </td>

                      {/* Keterangan */}
                      <td className="px-5 py-3.5 max-w-xs">
                        <div className={`text-xs ${absent ? "font-semibold text-red-700 dark:text-red-300" : "text-slate-600 dark:text-slate-300"}`}>
                          {teacher.keterangan || "-"}
                        </div>
                      </td>

                      {/* Aksi CRUD */}
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenTeacherModal(teacher)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                            title="Edit Data Guru"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTeacher(teacher.id, teacher.nama)}
                            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
                            title="Hapus Data Guru"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ─── TABEL 2: PENANGGULANGAN JAM KOSONG ─────────────────────────── */}
      <div className="space-y-3.5 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              2. Penanggulangan Jam Kosong
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Daftar kelas yang gurunya berhalangan hadir beserta penugasan dan guru pendamping (inval piket).
            </p>
          </div>

          <button
            onClick={() => handleOpenJamKosongModal()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold transition active:scale-95 shadow-xs cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" /> Catat Jam Kosong Baru
          </button>
        </div>

        {/* Tabel Jam Kosong */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-xs uppercase font-bold tracking-wider border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="px-5 py-3.5">Jam Ke- / Waktu</th>
                  <th className="px-5 py-3.5">Kelas & Mapel</th>
                  <th className="px-5 py-3.5">Guru Asli & Alasan</th>
                  <th className="px-5 py-3.5">Guru Pengganti (Inval)</th>
                  <th className="px-5 py-3.5">Tugas / Penanganan</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {jamKosongList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-slate-400 text-xs">
                      Tidak ada jam kosong tercatat hari ini. Semua KBM berjalan normal.
                    </td>
                  </tr>
                ) : (
                  jamKosongList.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition">
                      {/* Jam */}
                      <td className="px-5 py-3.5 text-xs font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-500" />
                          <span>{item.jamKe}</span>
                        </div>
                      </td>

                      {/* Kelas & Mapel */}
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40">
                          {item.kelas}
                        </span>
                        <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mt-1">
                          {item.mapel}
                        </div>
                      </td>

                      {/* Guru Asli & Alasan */}
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                          {item.guruAsli}
                        </div>
                        <div className="text-[11px] text-red-600 dark:text-red-400 mt-0.5">
                          {item.alasan}
                        </div>
                      </td>

                      {/* Guru Inval */}
                      <td className="px-5 py-3.5 text-xs">
                        {item.guruInval !== "-" ? (
                          <span className="font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
                            {item.guruInval}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleAssignSelfInval(item.id)}
                            className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[11px] font-bold shadow-xs transition active:scale-95 cursor-pointer"
                          >
                            + Dampingi Kelas
                          </button>
                        )}
                      </td>

                      {/* Tugas */}
                      <td className="px-5 py-3.5 text-xs text-slate-600 dark:text-slate-300 max-w-xs">
                        {item.tugas || "Tugas dari guru asli"}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          item.status === "Terdampingi"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                            : "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${item.status === "Terdampingi" ? "bg-emerald-500" : "bg-red-500 animate-pulse"}`} />
                          {item.status}
                        </span>
                      </td>

                      {/* Aksi */}
                      <td className="px-5 py-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenJamKosongModal(item)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                            title="Edit Catatan Jam Kosong"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteJamKosong(item.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
                            title="Hapus Catatan"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ─── MODAL CRUD GURU HARUS HADIR ────────────────────────────────── */}
      {showTeacherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-700/30">
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                {editingTeacher ? "Edit Data Kehadiran Guru" : "Tambah Guru ke Jadwal Hari Ini"}
              </h3>
              <button
                onClick={() => setShowTeacherModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleTeacherSubmit} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Guru Lengkap *
                </label>
                <input
                  type="text"
                  required
                  value={teacherForm.nama}
                  onChange={e => setTeacherForm({ ...teacherForm, nama: e.target.value })}
                  placeholder="Contoh: Hendra Wijaya, S.Pd."
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    NIP / NUPTK
                  </label>
                  <input
                    type="text"
                    value={teacherForm.nip}
                    onChange={e => setTeacherForm({ ...teacherForm, nip: e.target.value })}
                    placeholder="1988... atau -"
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Mata Pelajaran *
                  </label>
                  <input
                    type="text"
                    required
                    value={teacherForm.mapel}
                    onChange={e => setTeacherForm({ ...teacherForm, mapel: e.target.value })}
                    placeholder="Matematika / TKJ"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Status Kehadiran
                  </label>
                  <select
                    value={teacherForm.status}
                    onChange={e => {
                      const st = e.target.value
                      setTeacherForm({
                        ...teacherForm,
                        status: st,
                        jamMasuk: isAbsent(st) ? "-" : (teacherForm.jamMasuk === "-" ? "06:45" : teacherForm.jamMasuk)
                      })
                    }}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="Hadir">Hadir</option>
                    <option value="Terlambat">Terlambat</option>
                    <option value="Tugas Luar">Tugas Luar</option>
                    <option value="Sakit">Sakit</option>
                    <option value="Izin">Izin</option>
                    <option value="Alfa">Alfa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jam Masuk
                  </label>
                  <input
                    type="text"
                    value={teacherForm.jamMasuk}
                    onChange={e => setTeacherForm({ ...teacherForm, jamMasuk: e.target.value })}
                    placeholder="06:45 atau -"
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Keterangan / Alasan (Wajib jika Tidak Hadir)
                </label>
                <textarea
                  rows={2}
                  value={teacherForm.keterangan}
                  onChange={e => setTeacherForm({ ...teacherForm, keterangan: e.target.value })}
                  placeholder="Misal: Izin Sakit (Surat dokter), Tugas Luar Diklat, Mengajar X RPL"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowTeacherModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition"
                >
                  Simpan Data Guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL CRUD JAM KOSONG ──────────────────────────────────────── */}
      {showJamKosongModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-amber-50/50 dark:bg-amber-950/20">
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                {editingJamKosong ? "Edit Penanggulangan Jam Kosong" : "Catat Penanggulangan Jam Kosong"}
              </h3>
              <button
                onClick={() => setShowJamKosongModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleJamKosongSubmit} className="p-5 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Jam Ke-
                  </label>
                  <select
                    value={jamKosongForm.jamKe}
                    onChange={e => setJamKosongForm({ ...jamKosongForm, jamKe: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none font-medium"
                  >
                    <option>Jam 1 - 2 (07:00 - 08:30)</option>
                    <option>Jam 3 - 4 (08:45 - 10:15)</option>
                    <option>Jam 5 - 6 (10:30 - 12:00)</option>
                    <option>Jam 7 - 8 (13:15 - 14:45)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kelas
                  </label>
                  <input
                    type="text"
                    required
                    value={jamKosongForm.kelas}
                    onChange={e => setJamKosongForm({ ...jamKosongForm, kelas: e.target.value })}
                    placeholder="Contoh: XI TKJ 2"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Mata Pelajaran
                </label>
                <input
                  type="text"
                  required
                  value={jamKosongForm.mapel}
                  onChange={e => setJamKosongForm({ ...jamKosongForm, mapel: e.target.value })}
                  placeholder="Contoh: Teknik Komputer Jaringan"
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Guru Asli (Berhalangan)
                  </label>
                  <input
                    type="text"
                    value={jamKosongForm.guruAsli}
                    onChange={e => setJamKosongForm({ ...jamKosongForm, guruAsli: e.target.value })}
                    placeholder="Nama guru pengampu..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Alasan Tidak Masuk
                  </label>
                  <input
                    type="text"
                    value={jamKosongForm.alasan}
                    onChange={e => setJamKosongForm({ ...jamKosongForm, alasan: e.target.value })}
                    placeholder="Sakit / Tugas Luar"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Guru Inval / Pendamping
                  </label>
                  <select
                    value={jamKosongForm.guruInval}
                    onChange={e => setJamKosongForm({ ...jamKosongForm, guruInval: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none font-medium"
                  >
                    <option value="-">- Belum Ada -</option>
                    {ALL_TEACHERS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Status Jam Kosong
                  </label>
                  <select
                    value={jamKosongForm.status}
                    onChange={e => setJamKosongForm({ ...jamKosongForm, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none font-medium"
                  >
                    <option value="Terdampingi">Terdampingi</option>
                    <option value="Butuh Pendampingan">Butuh Pendampingan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Tugas yang Diberikan untuk Siswa
                </label>
                <textarea
                  rows={2}
                  value={jamKosongForm.tugas}
                  onChange={e => setJamKosongForm({ ...jamKosongForm, tugas: e.target.value })}
                  placeholder="Misal: Mengerjakan modul latihan Bab 3 di lab komputer..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowJamKosongModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition"
                >
                  Simpan Jam Kosong
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
