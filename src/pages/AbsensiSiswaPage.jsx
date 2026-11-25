import React, { useState } from "react"
import { Search, UserCheck, CheckCircle2, Clock, CheckCheck, FileSpreadsheet, X } from "lucide-react"
import { exportToCSV } from "../utils/exportCsv"

const INITIAL_STUDENTS = [
  { id: 1, nisn: "26271007272", nama: "Siswa Pelita Nusantara", kelas: "X TKJ 1", status: "Hadir", jam: "06:40", catatan: "Siswa Terdaftar Aktif" },
  { id: 2, nisn: "0061234501", nama: "Aditya Pratama", kelas: "X TKJ 1", status: "Hadir", jam: "06:45", catatan: "-" },
  { id: 2, nisn: "0061234502", nama: "Anisa Rahmawati", kelas: "X TKJ 1", status: "Hadir", jam: "06:50", catatan: "-" },
  { id: 3, nisn: "0061234503", nama: "Budi Santoso", kelas: "X TKJ 1", status: "Sakit", jam: "-", catatan: "Surat dokter terlampir" },
  { id: 4, nisn: "0061234504", nama: "Cahaya Putri", kelas: "X TKJ 1", status: "Izin", jam: "-", catatan: "Acara keluarga" },
  { id: 5, nisn: "0061234505", nama: "Dodi Firmansyah", kelas: "X TKJ 1", status: "Alfa", jam: "-", catatan: "Tanpa kabar" },
  { id: 6, nisn: "0061234506", nama: "Eka Nur Safitri", kelas: "X RPL 1", status: "Hadir", jam: "06:40", catatan: "-" },
  { id: 7, nisn: "0061234507", nama: "Fajar Maulana", kelas: "X RPL 1", status: "Hadir", jam: "06:55", catatan: "Piket kelas" },
  { id: 8, nisn: "0061234508", nama: "Gita Permata", kelas: "XI TKJ 2", status: "Hadir", jam: "06:42", catatan: "-" },
  { id: 9, nisn: "0061234509", nama: "Hendra Wijaya", kelas: "XI TKJ 2", status: "Sakit", jam: "-", catatan: "Demam tinggi" },
  { id: 10, nisn: "0061234510", nama: "Indah Lestari", kelas: "XII RPL 1", status: "Hadir", jam: "06:38", catatan: "-" },
  { id: 11, nisn: "0061234511", nama: "Joko Setiawan", kelas: "XII TKJ 1", status: "Hadir", jam: "06:52", catatan: "-" },
  { id: 12, nisn: "0061234512", nama: "Karin Amelia", kelas: "XII TKJ 1", status: "Alfa", jam: "-", catatan: "Belum check-in" },
]

const KELAS_OPTIONS = ["Semua Kelas", "X TKJ 1", "X RPL 1", "XI TKJ 2", "XII RPL 1", "XII TKJ 1"]

const getFormattedDate = () => new Date().toLocaleDateString("en-CA")

export default function AbsensiSiswaPage() {
  const [students, setStudents] = useState(INITIAL_STUDENTS)
  const [selectedKelas, setSelectedKelas] = useState("Semua Kelas")
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("Semua")
  const [toastMessage, setToastMessage] = useState("")

  const triggerToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(""), 3000)
  }

  const handleStatusChange = (id, newStatus) => {
    setStudents(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status: newStatus,
          jam: newStatus === "Hadir" && (s.jam === "-" || !s.jam) ? "07:05" : (newStatus !== "Hadir" ? "-" : s.jam)
        }
      }
      return s
    }))
    triggerToast("Status kehadiran berhasil diperbarui")
  }

  // Bulk mark all as Hadir in current filtered view or selected class
  const handleMarkAllHadir = () => {
    const targetKelas = selectedKelas === "Semua Kelas" ? null : selectedKelas
    setStudents(prev => prev.map(s => {
      if (!targetKelas || s.kelas === targetKelas) {
        return {
          ...s,
          status: "Hadir",
          jam: s.jam === "-" || !s.jam ? "07:00" : s.jam
        }
      }
      return s
    }))
    triggerToast(`Semua siswa ${targetKelas ? `kelas ${targetKelas}` : ""} berhasil ditandai Hadir!`)
  }

  // Real CSV Export
  const handleExportCSV = () => {
    const headers = ["No", "NISN", "Nama Siswa", "Kelas", "Jam Masuk", "Status Kehadiran", "Catatan"]
    const rows = filteredStudents.map((s, idx) => [
      idx + 1,
      s.nisn,
      s.nama,
      s.kelas,
      s.jam,
      s.status,
      s.catatan
    ])
    const today = getFormattedDate()
    exportToCSV(`absensi_siswa_${selectedKelas.replace(/\s+/g, "_")}_${today}.csv`, headers, rows)
    triggerToast("Rekap Absensi Siswa berhasil diexport ke CSV!")
  }

  const filteredStudents = students.filter(s => {
    const matchKelas = selectedKelas === "Semua Kelas" || s.kelas === selectedKelas
    const matchStatus = statusFilter === "Semua" || s.status === statusFilter
    const matchSearch = s.nama.toLowerCase().includes(search.toLowerCase()) || s.nisn.includes(search)
    return matchKelas && matchStatus && matchSearch
  })

  const countTotal = students.length
  const countHadir = students.filter(s => s.status === "Hadir").length
  const countSakit = students.filter(s => s.status === "Sakit").length
  const countIzin = students.filter(s => s.status === "Izin").length
  const countAlfa = students.filter(s => s.status === "Alfa").length
  const attendanceRate = countTotal > 0 ? Math.round((countHadir / countTotal) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 dark:bg-slate-100/95 backdrop-blur-md text-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-semibold border border-slate-700 dark:border-slate-300 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <UserCheck className="w-7 h-7 text-red-600" /> Presensi & Absensi Siswa
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Rekap dan pencatatan presensi kehadiran siswa SMK Plus Pelita Nusantara per kelas hari ini
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleMarkAllHadir}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition active:scale-95 cursor-pointer"
            title="Set semua siswa pada filter menjadi Hadir"
          >
            <CheckCheck className="w-4 h-4" /> Tandai Semua Hadir
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-red-600" /> Export CSV
          </button>
        </div>
      </div>

      {/* Interactive Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <button
          onClick={() => setStatusFilter("Semua")}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === "Semua"
              ? "bg-slate-100/90 dark:bg-slate-700 border-slate-400 dark:border-slate-500 ring-2 ring-slate-400/20 shadow-md"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:border-slate-300"
          }`}
        >
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Siswa Terdata</p>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{countTotal}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">{attendanceRate}% Kehadiran</span>
        </button>

        <button
          onClick={() => setStatusFilter("Hadir")}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === "Hadir"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:border-slate-300"
          }`}
        >
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Hadir</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{countHadir}</p>
          <span className="text-[11px] text-emerald-500 mt-0.5 block">Di kelas & KBM</span>
        </button>

        <button
          onClick={() => setStatusFilter("Sakit")}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === "Sakit"
              ? "bg-amber-50 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20 shadow-md"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:border-slate-300"
          }`}
        >
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Sakit</p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{countSakit}</p>
          <span className="text-[11px] text-amber-500 mt-0.5 block">Surat keterangan</span>
        </button>

        <button
          onClick={() => setStatusFilter("Izin")}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === "Izin"
              ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20 shadow-md"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:border-slate-300"
          }`}
        >
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Izin</p>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{countIzin}</p>
          <span className="text-[11px] text-blue-500 mt-0.5 block">Izin terkonfirmasi</span>
        </button>

        <button
          onClick={() => setStatusFilter("Alfa")}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer col-span-2 sm:col-span-1 ${
            statusFilter === "Alfa"
              ? "bg-red-50 dark:bg-red-950/40 border-red-500 ring-2 ring-red-500/20 shadow-md"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:border-slate-300"
          }`}
        >
          <p className="text-xs font-semibold text-red-600 dark:text-red-400">Alfa</p>
          <p className="text-2xl font-black text-red-600 dark:text-red-400 mt-1">{countAlfa}</p>
          <span className="text-[11px] text-red-500 mt-0.5 block">Tanpa keterangan</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama siswa atau NISN..."
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {["Semua", "Hadir", "Sakit", "Izin", "Alfa"].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                  statusFilter === st
                    ? "bg-red-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Kelas Quick Select */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 border-t border-slate-100 dark:border-slate-700 pb-1">
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">Pilih Kelas:</span>
          {KELAS_OPTIONS.map(k => (
            <button
              key={k}
              onClick={() => setSelectedKelas(k)}
              className={`px-3 py-1 text-xs rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
                selectedKelas === k
                  ? "bg-slate-900 dark:bg-red-600 text-white shadow-sm"
                  : "bg-slate-50 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-xs uppercase font-bold tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-5 py-4">NISN & Siswa</th>
                <th className="px-5 py-4">Kelas</th>
                <th className="px-5 py-4">Jam Masuk</th>
                <th className="px-5 py-4">Status Presensi</th>
                <th className="px-5 py-4">Catatan</th>
                <th className="px-5 py-4 text-right">Ubah Presensi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-10 text-center text-slate-400">
                    <p className="font-semibold text-slate-600 dark:text-slate-400">Tidak ditemukan data siswa yang sesuai.</p>
                    <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau ganti filter kelas.</p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{student.nama}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{student.nisn}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {student.kelas}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span className={student.jam !== "-" ? "font-semibold text-slate-800 dark:text-slate-200" : ""}>{student.jam}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                        student.status === "Hadir" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40" :
                        student.status === "Sakit" ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40" :
                        student.status === "Izin" ? "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40" :
                        "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300 border border-red-200 dark:border-red-800/40"
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          student.status === "Hadir" ? "bg-emerald-500" :
                          student.status === "Sakit" ? "bg-amber-500" :
                          student.status === "Izin" ? "bg-blue-500" : "bg-red-500"
                        }`} />
                        {student.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400 max-w-xs">
                      {student.catatan}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <select
                        value={student.status}
                        onChange={(e) => handleStatusChange(student.id, e.target.value)}
                        className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer shadow-xs"
                      >
                        <option value="Hadir">Hadir</option>
                        <option value="Sakit">Sakit</option>
                        <option value="Izin">Izin</option>
                        <option value="Alfa">Alfa</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
