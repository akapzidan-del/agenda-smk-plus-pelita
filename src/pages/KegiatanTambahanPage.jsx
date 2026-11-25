import React, { useState } from "react"
import {
  Users, Clock, MapPin, Plus, CheckCircle2, Award, X,
  Edit2, Trash2, FileSpreadsheet
} from "lucide-react"
import { exportToCSV } from "../utils/exportCsv"

const INITIAL_ACTIVITIES = [
  { id: 1, judul: "Latihan Rutin Pasukan Khusus Paskibra", kategori: "Ekstrakurikuler", waktu: "15:30 - 17:00 WIB", tempat: "Lapangan Utama", pembina: "Sertu Bambang (Pelatih Luar)", peserta: "38 Siswa", status: "Terjadwal" },
  { id: 2, judul: "Bimbingan Intensif LKS Bidang Web Technologies", kategori: "Pembinaan Lomba", waktu: "13:30 - 16:00 WIB", tempat: "Lab Komputer 3 (RPL)", pembina: "Agus Salim, S.Kom.", peserta: "4 Siswa Pilihan", status: "Sedang Berjalan" },
  { id: 3, judul: "Kajian Keputrian & Rohis Jumat Berkah", kategori: "Keagamaan", waktu: "11:45 - 12:45 WIB", tempat: "Masjid Al-Ikhlas Sekolah", pembina: "Dra. Hj. Nurjanah", peserta: "85 Siswi", status: "Selesai" },
  { id: 4, judul: "Remedial & Pengayaan Matematika Kejuruan", kategori: "Akademik", waktu: "14:00 - 15:30 WIB", tempat: "Ruang Kelas XI TKJ 1", pembina: "Hendra Wijaya, S.Pd.", peserta: "16 Siswa", status: "Terjadwal" },
  { id: 5, judul: "Latihan Futsal Persiapan Turnamen Pelajar", kategori: "Olahraga", waktu: "16:00 - 17:30 WIB", tempat: "Lapangan Olahraga Sekolah", pembina: "Fikri Ramadhan, S.Pd.", peserta: "22 Siswa", status: "Terjadwal" },
]

export default function KegiatanTambahanPage() {
  const [activities, setActivities] = useState(INITIAL_ACTIVITIES)
  const [filter, setFilter] = useState("Semua")
  const [toast, setToast] = useState("")

  // Modal State for CRUD
  const [showModal, setShowModal] = useState(false)
  const [editingActivity, setEditingActivity] = useState(null)
  const [form, setForm] = useState({
    judul: "",
    kategori: "Ekstrakurikuler",
    waktu: "15:30 - 17:00 WIB",
    tempat: "",
    pembina: "",
    peserta: "20 Siswa",
    status: "Terjadwal"
  })

  const triggerToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(""), 3500)
  }

  // Open modal for add or edit
  const openModal = (item = null) => {
    if (item) {
      setEditingActivity(item)
      setForm({ ...item })
    } else {
      setEditingActivity(null)
      setForm({
        judul: "",
        kategori: "Ekstrakurikuler",
        waktu: "15:30 - 17:00 WIB",
        tempat: "",
        pembina: "",
        peserta: "20 Siswa",
        status: "Terjadwal"
      })
    }
    setShowModal(true)
  }

  // Submit Form
  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (!form.judul.trim() || !form.tempat.trim() || !form.pembina.trim()) {
      alert("Nama kegiatan, tempat, dan pembina wajib diisi!")
      return
    }

    if (editingActivity) {
      setActivities(prev => prev.map(a => a.id === editingActivity.id ? { ...form, id: a.id } : a))
      triggerToast(`Kegiatan "${form.judul}" berhasil diperbarui!`)
    } else {
      const newEntry = {
        id: Date.now(),
        ...form
      }
      setActivities(prev => [newEntry, ...prev])
      triggerToast(`Kegiatan "${form.judul}" berhasil ditambahkan!`)
    }
    setShowModal(false)
  }

  // Delete Activity
  const handleDelete = (id, judul) => {
    if (window.confirm(`Hapus kegiatan "${judul}"?`)) {
      setActivities(prev => prev.filter(a => a.id !== id))
      triggerToast(`Kegiatan "${judul}" berhasil dihapus`)
    }
  }

  // Quick cycle status: Terjadwal -> Sedang Berjalan -> Selesai
  const handleCycleStatus = (id) => {
    setActivities(prev => prev.map(a => {
      if (a.id === id) {
        let nextStatus = "Terjadwal"
        if (a.status === "Terjadwal") nextStatus = "Sedang Berjalan"
        else if (a.status === "Sedang Berjalan") nextStatus = "Selesai"
        else nextStatus = "Terjadwal"
        return { ...a, status: nextStatus }
      }
      return a
    }))
    triggerToast("Status progres kegiatan diperbarui")
  }

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["No", "Nama Kegiatan", "Kategori", "Waktu Pelaksanaan", "Tempat / Ruang", "Pembina / Guru", "Estimasi Peserta", "Status"]
    const rows = filtered.map((item, idx) => [
      idx + 1,
      item.judul,
      item.kategori,
      item.waktu,
      item.tempat,
      item.pembina,
      item.peserta,
      item.status
    ])
    exportToCSV("rekap_kegiatan_tambahan_ekskul.csv", headers, rows)
    triggerToast("Rekap kegiatan tambahan berhasil diexport!")
  }

  const filtered = activities.filter(a => filter === "Semua" || a.kategori === filter)

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 dark:bg-slate-100/95 text-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-semibold border border-slate-700 dark:border-slate-300 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <Award className="w-7 h-7 text-red-600" /> Kegiatan Jam Tambahan & Ekskul
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pengawasan agenda kegiatan ekstrakurikuler, pembinaan lomba kejuruan, dan jam pelajaran tambahan sore
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
            onClick={() => openModal()}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-sm transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Tambah Kegiatan
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["Semua", "Ekstrakurikuler", "Pembinaan Lomba", "Akademik", "Olahraga", "Keagamaan"].map(kat => (
          <button
            key={kat}
            onClick={() => setFilter(kat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              filter === kat
                ? "bg-red-600 text-white shadow-sm"
                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
            }`}
          >
            {kat}
          </button>
        ))}
      </div>

      {/* Activity Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-3 bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 text-center text-slate-400">
            Tidak ada kegiatan tambahan pada kategori ini.
          </div>
        ) : (
          filtered.map(act => (
            <div
              key={act.id}
              className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md transition space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-300 border border-red-100 dark:border-red-900/30">
                    {act.kategori}
                  </span>
                  <button
                    onClick={() => handleCycleStatus(act.id)}
                    title="Klik untuk ubah status"
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold cursor-pointer transition ${
                      act.status === "Sedang Berjalan"
                        ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 animate-pulse border border-emerald-300"
                        : act.status === "Selesai"
                        ? "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 border border-slate-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-300"
                    }`}
                  >
                    {act.status}
                  </button>
                </div>

                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base leading-snug">
                  {act.judul}
                </h3>

                <div className="space-y-2 mt-4 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                    <span>{act.waktu}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                    <span>{act.tempat}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                    <span>{act.peserta}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[170px]">
                  Pembina: {act.pembina}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openModal(act)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                    title="Edit Kegiatan"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(act.id, act.judul)}
                    className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
                    title="Hapus Kegiatan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal CRUD Kegiatan Tambahan */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-red-50/50 dark:bg-red-950/20">
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                {editingActivity ? "Edit Kegiatan Tambahan" : "Tambah Kegiatan Jam Tambahan / Ekskul"}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Nama Kegiatan *
                </label>
                <input
                  type="text"
                  required
                  value={form.judul}
                  onChange={e => setForm({ ...form, judul: e.target.value })}
                  placeholder="Contoh: Bimbingan LKS Web Technologies"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Kategori
                  </label>
                  <select
                    value={form.kategori}
                    onChange={e => setForm({ ...form, kategori: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none font-medium"
                  >
                    <option>Ekstrakurikuler</option>
                    <option>Pembinaan Lomba</option>
                    <option>Akademik</option>
                    <option>Olahraga</option>
                    <option>Keagamaan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none font-bold"
                  >
                    <option value="Terjadwal">Terjadwal</option>
                    <option value="Sedang Berjalan">Sedang Berjalan</option>
                    <option value="Selesai">Selesai</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Waktu Pelaksanaan
                  </label>
                  <input
                    type="text"
                    value={form.waktu}
                    onChange={e => setForm({ ...form, waktu: e.target.value })}
                    placeholder="15:30 - 17:00 WIB"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Tempat / Ruang *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.tempat}
                    onChange={e => setForm({ ...form, tempat: e.target.value })}
                    placeholder="Lab RPL / Lapangan"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Pembina / Penanggung Jawab *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.pembina}
                    onChange={e => setForm({ ...form, pembina: e.target.value })}
                    placeholder="Nama guru / pelatih..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Estimasi Peserta
                  </label>
                  <input
                    type="text"
                    value={form.peserta}
                    onChange={e => setForm({ ...form, peserta: e.target.value })}
                    placeholder="25 Siswa"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition"
                >
                  Simpan Kegiatan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
