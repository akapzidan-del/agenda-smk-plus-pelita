import React, { useState } from "react"
import {
  Search, UserX, Phone, CheckCircle2, MessageCircle,
  FileSpreadsheet, Check, X, Plus, Edit2, Trash2
} from "lucide-react"
import { exportToCSV } from "../utils/exportCsv"
import { sanitizeText, sanitizePhone } from "../security"

const INITIAL_ABSENT = [
  { id: 1, nama: "Budi Santoso", nisn: "0061234503", kelas: "X TKJ 1", kategori: "Sakit", keterangan: "Demam dan flu sejak semalam", wali: "Bpk. Santoso (Ayah)", kontak: "081234567890", surat: "Ada (Foto WA)", tanggal: "Hari Ini", ditindaklanjuti: false },
  { id: 2, nama: "Cahaya Putri", nisn: "0061234504", kelas: "X TKJ 1", kategori: "Izin", keterangan: "Menghadiri resepsi pernikahan kakak kandung", wali: "Ibu Nurul (Ibu)", kontak: "081389012345", surat: "Ada (Surat Tertulis)", tanggal: "Hari Ini", ditindaklanjuti: true },
  { id: 3, nama: "Dodi Firmansyah", nisn: "0061234505", kelas: "X TKJ 1", kategori: "Alfa", keterangan: "Belum ada informasi dari orang tua/wali", wali: "Bpk. Rahmat (Ayah)", kontak: "085211223344", surat: "Tidak Ada", tanggal: "Hari Ini", ditindaklanjuti: false },
  { id: 4, nama: "Hendra Wijaya", nisn: "0061234509", kelas: "XI TKJ 2", kategori: "Sakit", keterangan: "Dirawat di klinik karena gejala DBD", wali: "Ibu Sulastri (Ibu)", kontak: "082144556677", surat: "Ada (Surat Dokter)", tanggal: "Hari Ini", ditindaklanjuti: true },
  { id: 5, nama: "Karin Amelia", nisn: "0061234512", kelas: "XII TKJ 1", kategori: "Alfa", keterangan: "Tidak hadir tanpa surat keterangan", wali: "Bpk. Gunawan (Ayah)", kontak: "087799881122", surat: "Tidak Ada", tanggal: "Hari Ini", ditindaklanjuti: false },
  { id: 6, nama: "Muhammad Rizky", nisn: "0061234515", kelas: "X RPL 1", kategori: "Izin", keterangan: "Mengikuti seleksi atlet catur tingkat provinsi", wali: "Bpk. Harun (Ayah)", kontak: "081922334455", surat: "Ada (Dispensasi)", tanggal: "Hari Ini", ditindaklanjuti: true },
]

export default function TidakHadirPage() {
  const [data, setData] = useState(INITIAL_ABSENT)
  const [filterKat, setFilterKat] = useState("Semua")
  const [search, setSearch] = useState("")
  const [toast, setToast] = useState("")

  // Modal State for CRUD
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [form, setForm] = useState({
    nama: "",
    nisn: "",
    kelas: "X TKJ 1",
    kategori: "Sakit",
    keterangan: "",
    wali: "",
    kontak: "",
    surat: "Ada (Foto WA)",
    ditindaklanjuti: false
  })

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(""), 3500)
  }

  // Toggle followup status
  const handleToggleTindakLanjut = (id) => {
    setData(prev => prev.map(item => {
      if (item.id === id) {
        const nextState = !item.ditindaklanjuti
        return { ...item, ditindaklanjuti: nextState }
      }
      return item
    }))
    showToast("Status tindak lanjut siswa berhasil diperbarui")
  }

  // Open Form Modal (Add or Edit)
  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item)
      setForm({ ...item })
    } else {
      setEditingItem(null)
      setForm({
        nama: "",
        nisn: "",
        kelas: "X TKJ 1",
        kategori: "Sakit",
        keterangan: "",
        wali: "",
        kontak: "",
        surat: "Ada (Foto WA)",
        ditindaklanjuti: false
      })
    }
    setShowModal(true)
  }

  // Handle Form Submit
  const handleFormSubmit = (e) => {
    e.preventDefault()
    if (!form.nama || !form.kelas) {
      alert("Nama dan kelas wajib diisi!")
      return
    }

    if (editingItem) {
      setData(prev => prev.map(item => item.id === editingItem.id ? { ...form, id: item.id } : item))
      showToast(`Data ${form.nama} berhasil diperbarui`)
    } else {
      const newEntry = {
        id: Date.now(),
        tanggal: "Hari Ini",
        ...form
      }
      setData(prev => [newEntry, ...prev])
      showToast(`Data siswa tidak hadir ${form.nama} berhasil ditambahkan`)
    }
    setShowModal(false)
  }

  // Delete Item
  const handleDelete = (id, nama) => {
    if (window.confirm(`Hapus data ${nama} dari daftar tidak hadir?`)) {
      setData(prev => prev.filter(item => item.id !== id))
      showToast(`Data ${nama} berhasil dihapus`)
    }
  }

  // Open WhatsApp with polite standard template
  const handleOpenWA = (item) => {
    const cleanPhone = sanitizePhone(item.kontak)
    if (cleanPhone.length < 9 || cleanPhone.length > 15) {
      showToast("Nomor kontak tidak valid.")
      return
    }
    const formattedPhone = cleanPhone.startsWith("0") ? "62" + cleanPhone.slice(1) : cleanPhone
    const textMsg = encodeURIComponent(
      `Yth. ${sanitizeText(item.wali, 64)} dari ananda ${sanitizeText(item.nama, 64)} (${sanitizeText(item.kelas, 16)}), kami dari Tim Piket SMK Plus Pelita Nusantara mengonfirmasi kehadiran ananda hari ini yang tercatat ${sanitizeText(item.kategori, 16)}. Keterangan: ${sanitizeText(item.keterangan, 200)}. Mohon konfirmasi dan informasi lebih lanjut. Terima kasih.`
    )
    const url = `https://wa.me/${formattedPhone}?text=${textMsg}`
    const win = window.open(url, "_blank", "noopener,noreferrer")
    if (win) win.opener = null
    showToast(`Membuka WhatsApp untuk wali ${sanitizeText(item.nama, 64)}...`)
  }

  // Real CSV Export
  const handleExportCSV = () => {
    const headers = ["No", "NISN", "Nama Siswa", "Kelas", "Kategori", "Keterangan", "Nama Wali", "Kontak", "Status Surat", "Tindak Lanjut"]
    const rows = filtered.map((item, idx) => [
      idx + 1,
      item.nisn,
      item.nama,
      item.kelas,
      item.kategori,
      item.keterangan,
      item.wali,
      item.kontak,
      item.surat,
      item.ditindaklanjuti ? "Selesai Tindak Lanjut" : "Belum Ditindaklanjuti"
    ])
    exportToCSV("rekap_siswa_tidak_hadir.csv", headers, rows)
    showToast("Rekap siswa tidak hadir berhasil diexport!")
  }

  const filtered = data.filter(item => {
    const matchKat = filterKat === "Semua" || item.kategori === filterKat
    const matchSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.kelas.toLowerCase().includes(search.toLowerCase()) ||
      item.nisn.includes(search)
    return matchKat && matchSearch
  })

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 dark:bg-slate-100/95 backdrop-blur-md text-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-semibold border border-slate-700 dark:border-slate-300 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <UserX className="w-7 h-7 text-red-600" /> Siswa Tidak Hadir
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Daftar penanganan & tindak lanjut siswa yang tidak hadir hari ini (Sakit, Izin, atau Tanpa Keterangan)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => openModal()}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-xs transition active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Catat Siswa Tidak Hadir
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition active:scale-95 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-red-600" /> Export Rekap
          </button>
        </div>
      </div>

      {/* Interactive Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setFilterKat("Semua")}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            filterKat === "Semua"
              ? "bg-slate-100 dark:bg-slate-700 border-slate-400 ring-2 ring-slate-400/20 shadow-md"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:border-slate-300"
          }`}
        >
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Tidak Hadir</p>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{data.length}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">Hari ini</span>
        </button>

        <button
          onClick={() => setFilterKat("Sakit")}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            filterKat === "Sakit"
              ? "bg-amber-50 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20 shadow-md"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:border-slate-300"
          }`}
        >
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Sakit (S)</p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{data.filter(d => d.kategori === "Sakit").length}</p>
          <span className="text-[11px] text-amber-500 mt-0.5 block">Ada bukti surat/kabar</span>
        </button>

        <button
          onClick={() => setFilterKat("Izin")}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            filterKat === "Izin"
              ? "bg-blue-50 dark:bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/20 shadow-md"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:border-slate-300"
          }`}
        >
          <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">Izin (I)</p>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{data.filter(d => d.kategori === "Izin").length}</p>
          <span className="text-[11px] text-blue-500 mt-0.5 block">Izin terverifikasi</span>
        </button>

        <button
          onClick={() => setFilterKat("Alfa")}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            filterKat === "Alfa"
              ? "bg-red-50 dark:bg-red-950/40 border-red-500 ring-2 ring-red-500/20 shadow-md"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:border-slate-300"
          }`}
        >
          <p className="text-xs font-semibold text-red-600 dark:text-red-400">Alfa / Tanpa Keterangan (A)</p>
          <p className="text-2xl font-black text-red-600 dark:text-red-400 mt-1">{data.filter(d => d.kategori === "Alfa").length}</p>
          <span className="text-[11px] text-red-500 mt-0.5 block">Perlu panggilan wali</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama, kelas, atau NISN siswa..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
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
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["Semua", "Sakit", "Izin", "Alfa"].map(kat => (
            <button
              key={kat}
              onClick={() => setFilterKat(kat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                filterKat === kat
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              {kat}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 text-center text-slate-400">
            <p className="font-semibold text-slate-600 dark:text-slate-300">Tidak ada data siswa tidak hadir dengan filter saat ini.</p>
          </div>
        ) : (
          filtered.map(item => (
            <div key={item.id} className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between space-y-4 hover:shadow-md transition">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">{item.nama}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 font-semibold text-slate-700 dark:text-slate-300">
                        {item.kelas}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">NISN: {item.nisn}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      item.kategori === "Sakit" ? "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40" :
                      item.kategori === "Izin" ? "bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40" :
                      "bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300 border border-red-200 dark:border-red-800/40"
                    }`}>
                      {item.kategori}
                    </span>
                    <button
                      onClick={() => openModal(item)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
                      title="Edit Data"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.nama)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded-md"
                      title="Hapus Data"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/40 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  <p><span className="font-semibold text-slate-700 dark:text-slate-200">Keterangan:</span> {item.keterangan}</p>
                  <p><span className="font-semibold text-slate-700 dark:text-slate-200">Nama Wali:</span> {item.wali}</p>
                  <p><span className="font-semibold text-slate-700 dark:text-slate-200">Bukti Surat / Foto:</span> {item.surat}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-400" /> {item.kontak}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleTindakLanjut(item.id)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition active:scale-95 cursor-pointer ${
                      item.ditindaklanjuti
                        ? "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                        : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50 hover:bg-emerald-100"
                    }`}
                  >
                    <Check className="w-3.5 h-3.5" />
                    {item.ditindaklanjuti ? "Selesai Tindak Lanjut" : "Tandai Selesai"}
                  </button>

                  <button
                    onClick={() => handleOpenWA(item)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition active:scale-95 cursor-pointer"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Hubungi WA
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal CRUD Siswa Tidak Hadir */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-md shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-700/30">
              <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                {editingItem ? "Edit Data Siswa Tidak Hadir" : "Catat Siswa Tidak Hadir"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nama Siswa *
                </label>
                <input
                  type="text"
                  required
                  value={form.nama}
                  onChange={e => setForm({ ...form, nama: e.target.value })}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-3.5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kelas *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.kelas}
                    onChange={e => setForm({ ...form, kelas: e.target.value })}
                    placeholder="Contoh: X TKJ 1"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    NISN
                  </label>
                  <input
                    type="text"
                    value={form.nisn}
                    onChange={e => setForm({ ...form, nisn: e.target.value })}
                    placeholder="0061..."
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Kategori Ketidakhadiran
                  </label>
                  <select
                    value={form.kategori}
                    onChange={e => setForm({ ...form, kategori: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="Sakit">Sakit</option>
                    <option value="Izin">Izin</option>
                    <option value="Alfa">Alfa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Bukti Surat / Keterangan
                  </label>
                  <input
                    type="text"
                    value={form.surat}
                    onChange={e => setForm({ ...form, surat: e.target.value })}
                    placeholder="Ada (Surat Dokter) / Tidak Ada"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Alasan / Keterangan Detail
                </label>
                <textarea
                  rows={2}
                  value={form.keterangan}
                  onChange={e => setForm({ ...form, keterangan: e.target.value })}
                  placeholder="Misal: Sakit demam tinggi sejak semalam..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Orang Tua / Wali
                  </label>
                  <input
                    type="text"
                    value={form.wali}
                    onChange={e => setForm({ ...form, wali: e.target.value })}
                    placeholder="Bpk. Santoso"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    No. Kontak WA Wali
                  </label>
                  <input
                    type="text"
                    value={form.kontak}
                    onChange={e => setForm({ ...form, kontak: e.target.value })}
                    placeholder="081234567890"
                    className="w-full px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
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
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
