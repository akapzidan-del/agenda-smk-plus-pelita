import React, { useState } from "react"
import { Plus, UserCheck, CheckCircle2, ShieldAlert, X, FileSpreadsheet } from "lucide-react"
import { exportToCSV } from "../utils/exportCsv"

const INITIAL_EMPTY_HOURS = [
  { id: 1, jam: "Jam 3 - 4 (08:45 - 10:15)", kelas: "XI TKJ 2", mapel: "Teknik Komputer & Jaringan WAN", guruAsli: "Bambang Sudirman, S.T.", alasan: "Monitoring Praktik Kerja Lapangan (PKL) Industri", guruInval: "Agus Salim, S.Kom.", statusTugas: "Modul Praktik Dibagikan", status: "Terdampingi" },
  { id: 2, jam: "Jam 5 - 6 (10:30 - 12:00)", kelas: "X RPL 2", mapel: "Bahasa Inggris", guruAsli: "Dewi Lestari, S.Pd.", alasan: "Izin Sakit", guruInval: "Dra. Hj. Nurjanah", statusTugas: "Tugas Membaca Teks Hal 45", status: "Terdampingi" },
  { id: 3, jam: "Jam 7 - 8 (13:15 - 14:45)", kelas: "XII OTKP 1", mapel: "Otomatisasi Tata Kelola Keuangan", guruAsli: "Farida Hanim, S.E.", alasan: "Rapat Dinas Luar di Kemendikbud", guruInval: "-", statusTugas: "Menunggu Penugasan", status: "Perlu Piket" },
]

export default function JamKosongPage() {
  const [data, setData] = useState(INITIAL_EMPTY_HOURS)
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState("")

  const [form, setForm] = useState({
    jam: "Jam 5 - 6 (10:30 - 12:00)",
    kelas: "XI RPL 1",
    mapel: "",
    guruAsli: "",
    alasan: "",
    guruInval: "Agus Salim, S.Kom.",
    statusTugas: "",
    status: "Terdampingi"
  })

  const triggerToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(""), 3000)
  }

  const handleAssignSelf = (id) => {
    setData(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          guruInval: "Agus Salim, S.Kom. (Piket)",
          statusTugas: "Didampingi Guru Piket",
          status: "Terdampingi"
        }
      }
      return item
    }))
    triggerToast("Anda telah ditugaskan untuk mendampingi jam kosong kelas tersebut")
  }

  const handleAddSubmit = (e) => {
    e.preventDefault()
    if (!form.mapel || !form.guruAsli) return
    const newEntry = {
      id: Date.now(),
      ...form
    }
    setData([newEntry, ...data])
    setShowModal(false)
    triggerToast("Data jam kosong dan penugasan telah dicatat")
  }

  const handleExportCSV = () => {
    const headers = ["No", "Jam", "Kelas", "Mata Pelajaran", "Guru Asli", "Alasan", "Guru Inval", "Status Tugas", "Status"]
    const rows = data.map((item, idx) => [
      idx + 1,
      item.jam,
      item.kelas,
      item.mapel,
      item.guruAsli,
      item.alasan,
      item.guruInval,
      item.statusTugas,
      item.status
    ])
    exportToCSV("rekap_jam_kosong_inval.csv", headers, rows)
    triggerToast("Data jam kosong berhasil diexport ke CSV!")
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-sm font-medium animate-bounce">
          <CheckCircle2 className="w-4 h-4" /> {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <ShieldAlert className="w-7 h-7 text-red-600" /> Monitoring Jam Kosong
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pengawasan kelas dengan guru berhalangan dan koordinasi pendampingan guru pengganti / inval
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
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition self-start sm:self-auto shadow-sm cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Lapor Guru Berhalangan
          </button>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Sesi Kosong</p>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{data.length}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Hari ini</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Telah Terdampingi</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {data.filter(d => d.status === "Terdampingi").length}
          </p>
          <span className="text-[11px] text-emerald-500 mt-0.5 block">Ada guru pengganti / tugas</span>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-xs font-semibold text-red-600 dark:text-red-400">Perlu Penugasan Piket</p>
          <p className="text-2xl font-black text-red-600 dark:text-red-400 mt-1">
            {data.filter(d => d.status === "Perlu Piket").length}
          </p>
          <span className="text-[11px] text-red-500 mt-0.5 block">Harus segera diisi</span>
        </div>
      </div>

      {/* Table Cards */}
      <div className="space-y-3">
        {data.map(item => (
          <div key={item.id} className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 dark:text-slate-100 text-base">{item.kelas}</span>
                <span className="px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium">
                  {item.jam}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                  item.status === "Terdampingi" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" :
                  "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                }`}>
                  {item.status}
                </span>
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {item.mapel} <span className="text-xs text-slate-400 font-normal">({item.guruAsli})</span>
              </p>
              <div className="bg-slate-50 dark:bg-slate-700/50 p-2.5 rounded-xl text-xs space-y-1 text-slate-600 dark:text-slate-300">
                <p><span className="font-semibold text-slate-700 dark:text-slate-200">Alasan Berhalangan:</span> {item.alasan}</p>
                <p><span className="font-semibold text-slate-700 dark:text-slate-200">Tugas yang Diberikan:</span> {item.statusTugas}</p>
                <p><span className="font-semibold text-slate-700 dark:text-slate-200">Guru Pendamping / Piket:</span> {item.guruInval}</p>
              </div>
            </div>

            <div className="flex md:flex-col gap-2 justify-end">
              {item.status === "Perlu Piket" && (
                <button
                  onClick={() => handleAssignSelf(item.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Dampingi Kelas
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="bg-red-600 p-4 text-white flex items-center justify-between">
              <h2 className="font-bold text-base">Laporkan Guru Berhalangan Hadir</h2>
              <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-white/80 hover:text-white" /></button>
            </div>
            <form onSubmit={handleAddSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Kelas</label>
                  <input
                    type="text"
                    required
                    value={form.kelas}
                    onChange={e => setForm({ ...form, kelas: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Jam Pelajaran</label>
                  <select
                    value={form.jam}
                    onChange={e => setForm({ ...form, jam: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                  >
                    <option>Jam 1 - 2 (07:00 - 08:30)</option>
                    <option>Jam 3 - 4 (08:45 - 10:15)</option>
                    <option>Jam 5 - 6 (10:30 - 12:00)</option>
                    <option>Jam 7 - 8 (13:15 - 14:45)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Mata Pelajaran</label>
                <input
                  type="text"
                  required
                  value={form.mapel}
                  onChange={e => setForm({ ...form, mapel: e.target.value })}
                  placeholder="Contoh: Matematika Diskrit"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Guru Yang Berhalangan</label>
                <input
                  type="text"
                  required
                  value={form.guruAsli}
                  onChange={e => setForm({ ...form, guruAsli: e.target.value })}
                  placeholder="Nama guru yang tidak bisa hadir..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Alasan Berhalangan</label>
                <input
                  type="text"
                  required
                  value={form.alasan}
                  onChange={e => setForm({ ...form, alasan: e.target.value })}
                  placeholder="Contoh: Sakit / Izin Dinas"
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-sm font-semibold rounded-xl bg-red-600 text-white hover:bg-red-700"
                >
                  Simpan Laporan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

