import React, { useState } from "react"
import { LogOut, Plus, Search, Clock, CheckCircle2, X, Printer, FileSpreadsheet } from "lucide-react"
import { exportToCSV } from "../utils/exportCsv"

const INITIAL_LOGS = [
  { id: 1, noSurat: "IZIN/2026/XI/012", nama: "Bayu Maulana", kelas: "X TKJ 2", tipe: "Keluar Sementara", jamKeluar: "10:15", jamKembali: "-", alasan: "Fotokopi modul praktik dan beli ATK", guruPiket: "Agus Salim, S.Kom.", status: "Sedang di Luar" },
  { id: 2, noSurat: "IZIN/2026/XI/011", nama: "Siti Rahmah", kelas: "XI RPL 1", tipe: "Pulang Cepat (Sakit)", jamKeluar: "09:40", jamKembali: "-", alasan: "Demam dan maag kambuh, dijemput keluarga", guruPiket: "Dra. Hj. Nurjanah", status: "Pulang ke Rumah" },
  { id: 3, noSurat: "IZIN/2026/XI/010", nama: "Rian Hidayat", kelas: "XII TKJ 2", tipe: "Keluar Sementara", jamKeluar: "08:30", jamKembali: "09:15", alasan: "Mengambil seragam praktik yang tertinggal", guruPiket: "Agus Salim, S.Kom.", status: "Sudah Kembali" },
  { id: 4, noSurat: "IZIN/2026/XI/009", nama: "Dewi Safitri", kelas: "XI OTKP 2", tipe: "Dispensasi Lomba", jamKeluar: "08:00", jamKembali: "-", alasan: "Persiapan LKS tingkat kota di Disdik", guruPiket: "Hendra Wijaya, S.Pd.", status: "Dispensasi" },
]

export default function KepulanganPage({ onNavigate, onLogout }) {
  const [logs, setLogs] = useState(INITIAL_LOGS)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("Semua")
  const [showModal, setShowModal] = useState(false)
  const [showExitModal, setShowExitModal] = useState(false)
  const [selectedPass, setSelectedPass] = useState(null)
  const [toast, setToast] = useState("")
  const [form, setForm] = useState({
    nama: "",
    kelas: "X TKJ 1",
    tipe: "Keluar Sementara",
    alasan: "",
    guruPiket: "Agus Salim, S.Kom."
  })

  const triggerToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(""), 3000)
  }

  const handleMarkReturned = (id) => {
    const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(".", ":")
    setLogs(prev => prev.map(log => {
      if (log.id === id) {
        return { ...log, status: "Sudah Kembali", jamKembali: now }
      }
      return log
    }))
    triggerToast("Siswa telah ditandai kembali ke lingkungan sekolah")
  }

  const handleAddIzin = (e) => {
    e.preventDefault()
    if (!form.nama || !form.alasan) return
    const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }).replace(".", ":")
    const newEntry = {
      id: Date.now(),
      noSurat: `IZIN/2026/XI/${String(logs.length + 1).padStart(3, "0")}`,
      nama: form.nama,
      kelas: form.kelas,
      tipe: form.tipe,
      jamKeluar: now,
      jamKembali: "-",
      alasan: form.alasan,
      guruPiket: form.guruPiket,
      status: form.tipe.includes("Pulang") ? "Pulang ke Rumah" : form.tipe.includes("Dispensasi") ? "Dispensasi" : "Sedang di Luar"
    }
    setLogs([newEntry, ...logs])
    setShowModal(false)
    setForm({ nama: "", kelas: "X TKJ 1", tipe: "Keluar Sementara", alasan: "", guruPiket: "Agus Salim, S.Kom." })
    setSelectedPass(newEntry)
    triggerToast("Surat izin keluar berhasil diterbitkan!")
  }

  // Real CSV Export
  const handleExportCSV = () => {
    const headers = ["No", "No Surat", "Nama Siswa", "Kelas", "Jenis Izin", "Jam Keluar", "Jam Kembali", "Alasan", "Guru Piket", "Status"]
    const rows = filteredLogs.map((item, idx) => [
      idx + 1,
      item.noSurat,
      item.nama,
      item.kelas,
      item.tipe,
      item.jamKeluar,
      item.jamKembali,
      item.alasan,
      item.guruPiket,
      item.status
    ])
    exportToCSV("rekap_izin_keluar_siswa.csv", headers, rows)
    triggerToast("Rekap izin keluar siswa berhasil diexport ke CSV!")
  }

  const filteredLogs = logs.filter(l => {
    const matchStatus = statusFilter === "Semua" || l.status === statusFilter
    const matchSearch =
      l.nama.toLowerCase().includes(search.toLowerCase()) ||
      l.kelas.toLowerCase().includes(search.toLowerCase()) ||
      l.noSurat.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 dark:bg-slate-100/95 text-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-semibold border border-slate-700 dark:border-slate-300 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2 sm:gap-2.5">
            <button
              onClick={() => setShowExitModal(true)}
              className="p-1.5 -ml-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 transition cursor-pointer active:scale-95 group flex items-center justify-center border border-transparent hover:border-red-200 dark:hover:border-red-900/50"
              title="Menu Aksi Keluar: Kembali ke Dashboard atau Keluar Sistem"
              aria-label="Menu Aksi Keluar"
            >
              <LogOut className="w-6 h-6 sm:w-7 sm:h-7 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <span>Kepulangan & Izin Keluar Siswa</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pencatatan surat izin siswa keluar sekolah sementara, dispensasi, atau izin pulang cepat
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition active:scale-95 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-red-600" /> Export CSV
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition shadow-sm cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4" /> Terbitkan Izin Keluar
          </button>
        </div>
      </div>

      {/* Modal Aksi Icon Keluar */}
      {showExitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-base">
                <LogOut className="w-5 h-5" />
                <span>Pilihan Aksi Keluar</span>
              </div>
              <button
                onClick={() => setShowExitModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 mb-4 leading-relaxed">
              Silakan pilih tindakan yang ingin Anda lakukan:
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => {
                  setShowExitModal(false)
                  if (onNavigate) onNavigate("dashboard")
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-left cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-slate-200 flex-shrink-0">
                  <span className="text-sm">🏠</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900 dark:text-white">Kembali ke Dashboard</p>
                  <p className="text-[11px] text-slate-400">Kembali ke halaman utama ringkasan piket</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowExitModal(false)
                  if (onLogout) onLogout()
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50/50 dark:bg-red-950/20 hover:bg-red-100/60 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300 transition text-left cursor-pointer group"
              >
                <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-900/50 group-hover:bg-red-200 dark:group-hover:bg-red-800/60 flex items-center justify-center text-red-600 dark:text-red-300 flex-shrink-0">
                  <LogOut className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold">Keluar Akun Piket</p>
                  <p className="text-[11px] text-red-500/80 dark:text-red-400/70">Kunci sesi dan logout dari sistem</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setStatusFilter("Semua")}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === "Semua"
              ? "bg-slate-100 dark:bg-slate-700 border-slate-400 ring-2 ring-slate-400/20 shadow-md"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:border-slate-300"
          }`}
        >
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Surat Izin</p>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{logs.length}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Hari ini diterbitkan</span>
        </button>

        <button
          onClick={() => setStatusFilter("Sedang di Luar")}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === "Sedang di Luar"
              ? "bg-amber-50 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20 shadow-md"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:border-slate-300"
          }`}
        >
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Sedang di Luar</p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">
            {logs.filter(l => l.status === "Sedang di Luar").length}
          </p>
          <span className="text-[11px] text-amber-500 mt-0.5 block">Harus kembali ke kelas</span>
        </button>

        <button
          onClick={() => setStatusFilter("Pulang ke Rumah")}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === "Pulang ke Rumah"
              ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20 shadow-md"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:border-slate-300"
          }`}
        >
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Pulang ke Rumah</p>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {logs.filter(l => l.status === "Pulang ke Rumah").length}
          </p>
          <span className="text-[11px] text-blue-500 mt-0.5 block">Sakit / urusan keluarga</span>
        </button>

        <button
          onClick={() => setStatusFilter("Sudah Kembali")}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            statusFilter === "Sudah Kembali"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:border-slate-300"
          }`}
        >
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Telah Kembali</p>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">
            {logs.filter(l => l.status === "Sudah Kembali").length}
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Kembali tepat waktu</span>
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama, kelas, atau nomor surat..."
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {["Semua", "Sedang di Luar", "Pulang ke Rumah", "Sudah Kembali", "Dispensasi"].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                statusFilter === st
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Table Logs */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-xs uppercase font-bold tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-5 py-4">No. Surat & Siswa</th>
                <th className="px-5 py-4">Kelas</th>
                <th className="px-5 py-4">Jenis Izin</th>
                <th className="px-5 py-4">Waktu Keluar / Kembali</th>
                <th className="px-5 py-4">Alasan</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-center">Aksi & Surat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                    Tidak ditemukan data surat izin keluar.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition">
                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900 dark:text-slate-100">{item.nama}</div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">{item.noSurat}</div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {item.kelas}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-800 dark:text-slate-200 font-semibold">
                      {item.tipe}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-red-500" /> Keluar: <strong className="text-slate-800 dark:text-slate-200">{item.jamKeluar}</strong></div>
                      <div className="flex items-center gap-1.5 mt-0.5 text-slate-400">Kembali: {item.jamKembali}</div>
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {item.alasan}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                        item.status === "Sedang di Luar" ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40" :
                        item.status === "Sudah Kembali" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40" :
                        item.status === "Dispensasi" ? "bg-purple-100 text-purple-800 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800/40" :
                        "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40"
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {item.status === "Sedang di Luar" && (
                          <button
                            onClick={() => handleMarkReturned(item.id)}
                            className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
                          >
                            Tandai Kembali
                          </button>
                        )}
                        <button
                          onClick={() => setSelectedPass(item)}
                          className="p-1.5 text-slate-500 hover:text-red-600 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition"
                          title="Lihat / Cetak Surat Jalan"
                        >
                          <Printer className="w-4 h-4" />
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

      {/* Modal Terbitkan Izin */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-150">
            <div className="bg-red-600 p-5 text-white flex items-center justify-between">
              <div>
                <h2 className="font-extrabold text-base">Terbitkan Surat Izin Siswa</h2>
                <p className="text-xs text-red-100">Pos Keamanan & Piket SMK Plus Pelita Nusantara</p>
              </div>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-white/80 hover:text-white" /></button>
            </div>
            <form onSubmit={handleAddIzin} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Nama Siswa *</label>
                <input
                  type="text"
                  required
                  value={form.nama}
                  onChange={e => setForm({ ...form, nama: e.target.value })}
                  placeholder="Contoh: Muhammad Farhan"
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Kelas</label>
                  <select
                    value={form.kelas}
                    onChange={e => setForm({ ...form, kelas: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none font-medium"
                  >
                    <option>X TKJ 1</option>
                    <option>X TKJ 2</option>
                    <option>X RPL 1</option>
                    <option>XI TKJ 1</option>
                    <option>XI RPL 2</option>
                    <option>XII TKJ 1</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Jenis Izin</label>
                  <select
                    value={form.tipe}
                    onChange={e => setForm({ ...form, tipe: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none font-medium"
                  >
                    <option>Keluar Sementara</option>
                    <option>Pulang Cepat (Sakit)</option>
                    <option>Pulang Cepat (Keperluan Keluarga)</option>
                    <option>Dispensasi Lomba</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">Alasan Izin *</label>
                <textarea
                  required
                  rows={2}
                  value={form.alasan}
                  onChange={e => setForm({ ...form, alasan: e.target.value })}
                  placeholder="Tuliskan keterangan detail keperluan izin..."
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 text-sm font-semibold rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-sm font-bold rounded-xl bg-red-600 text-white hover:bg-red-700 transition active:scale-95 shadow-md cursor-pointer"
                >
                  Terbitkan Surat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Printable Gate Pass Slip */}
      {selectedPass && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Header Sekolah */}
            <div className="p-5 border-b-2 border-dashed border-slate-200 bg-red-50/50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-red-600">SMK Plus Pelita Nusantara</span>
                <h3 className="font-extrabold text-base text-slate-900">SURAT IZIN KELUAR SEKOLAH</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{selectedPass.noSurat}</p>
              </div>
              <button onClick={() => setSelectedPass(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pass Body */}
            <div className="p-6 space-y-3.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Nama Siswa</span>
                <span className="font-bold text-slate-900 text-sm">{selectedPass.nama}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Kelas</span>
                <span className="font-semibold text-slate-800">{selectedPass.kelas}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Jenis Izin</span>
                <span className="font-semibold text-red-600">{selectedPass.tipe}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Waktu Keluar</span>
                <span className="font-bold text-slate-900">{selectedPass.jamKeluar} WIB</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Target Kembali</span>
                <span className="font-semibold text-slate-700">{selectedPass.jamKembali !== "-" ? `${selectedPass.jamKembali} WIB` : "Tidak Kembali Hari Ini"}</span>
              </div>
              <div className="py-1">
                <span className="text-slate-500 block mb-1">Keperluan / Alasan:</span>
                <p className="p-2.5 rounded-xl bg-slate-50 font-medium text-slate-700 border border-slate-100">{selectedPass.alasan}</p>
              </div>

              {/* Tanda Tangan */}
              <div className="pt-4 grid grid-cols-2 text-center text-[11px] text-slate-600">
                <div>
                  <p>Petugas Pos Gerbang</p>
                  <div className="h-12" />
                  <p className="font-bold border-t border-slate-300 pt-1 mx-4">( Security )</p>
                </div>
                <div>
                  <p>Guru Piket / Kesiswaan</p>
                  <div className="h-12" />
                  <p className="font-bold border-t border-slate-300 pt-1 mx-4">{selectedPass.guruPiket}</p>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => setSelectedPass(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition"
              >
                Tutup
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-95"
              >
                <Printer className="w-3.5 h-3.5" /> Cetak Slip Masuk/Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
