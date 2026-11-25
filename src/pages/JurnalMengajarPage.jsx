import React, { useState } from "react"
import {
  BookOpen, CheckCircle2, Clock, Search, Edit3, X,
  Plus, Trash2, FileSpreadsheet
} from "lucide-react"
import { exportToCSV } from "../utils/exportCsv"

const INITIAL_JURNALS = [
  { id: 1, jamKe: "1 - 2 (07:00 - 08:30)", kelas: "X RPL 1", mapel: "Dasar Pemrograman Web", guru: "Agus Salim, S.Kom.", materi: "Pengenalan HTML Semantik, Tag Form, dan Struktur Dokumen", hadir: "34 / 36 Siswa", status: "Sudah Terisi", catatan: "2 siswa sakit (Budi & Cahaya)" },
  { id: 2, jamKe: "1 - 3 (07:00 - 09:15)", kelas: "XI TKJ 1", mapel: "Administrasi Server Jaringan", guru: "Rizky Pratama, S.T.", materi: "Instalasi dan Konfigurasi DHCP Server di Debian 12", hadir: "32 / 32 Siswa", status: "Sudah Terisi", catatan: "Praktikum lab berjalan tertib, semua berhasil konfigurasi" },
  { id: 3, jamKe: "3 - 4 (08:45 - 10:15)", kelas: "XII AKL", mapel: "Praktikum Akuntansi Perusahaan", guru: "Farida Hanim, S.E.", materi: "Jurnal Penyesuaian, Kertas Kerja, dan Neraca Lajur", hadir: "30 / 30 Siswa", status: "Sudah Terisi", catatan: "Tugas lembar kerja siklus akuntansi bab 3" },
  { id: 4, jamKe: "5 - 6 (10:30 - 12:00)", kelas: "X TKJ 2", mapel: "Komputer dan Jaringan Dasar", guru: "Agus Salim, S.Kom.", materi: "Crimping Kabel UTP Straight & Cross (Praktik Lab)", hadir: "35 / 36 Siswa", status: "Belum Terisi", catatan: "" },
  { id: 5, jamKe: "5 - 7 (10:30 - 12:45)", kelas: "XI RPL 2", mapel: "Basis Data Relasional", guru: "Ratna Sari, M.Kom.", materi: "Normalisasi Tabel Relasional 1NF sampai 3NF", hadir: "33 / 34 Siswa", status: "Belum Terisi", catatan: "" },
  { id: 6, jamKe: "7 - 8 (13:15 - 14:45)", kelas: "XII TKJ 2", mapel: "Keamanan Jaringan Komputer", guru: "Hendra Wijaya, S.Pd.", materi: "Firewall IPTables, Packet Filtering, dan NAT", hadir: "31 / 32 Siswa", status: "Belum Terisi", catatan: "" },
]

export default function JurnalMengajarPage() {
  const [jurnals, setJurnals] = useState(INITIAL_JURNALS)
  const [search, setSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("Semua")
  const [toast, setToast] = useState("")

  // Modal State for CRUD
  const [showModal, setShowModal] = useState(false)
  const [editingJurnal, setEditingJurnal] = useState(null)
  const [form, setForm] = useState({
    jamKe: "1 - 2 (07:00 - 08:30)",
    kelas: "X RPL 1",
    mapel: "",
    guru: "Agus Salim, S.Kom.",
    materi: "",
    hadir: "34 / 36 Siswa",
    status: "Sudah Terisi",
    catatan: ""
  })

  const triggerToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(""), 3500)
  }

  // Open modal for add or edit
  const openModal = (item = null) => {
    if (item) {
      setEditingJurnal(item)
      setForm({ ...item })
    } else {
      setEditingJurnal(null)
      setForm({
        jamKe: "3 - 4 (08:45 - 10:15)",
        kelas: "XI TKJ 1",
        mapel: "",
        guru: "Agus Salim, S.Kom.",
        materi: "",
        hadir: "34 / 36 Siswa",
        status: "Sudah Terisi",
        catatan: ""
      })
    }
    setShowModal(true)
  }

  // Save Jurnal
  const handleSaveJurnal = (e) => {
    e.preventDefault()
    if (!form.mapel.trim() || !form.materi.trim()) {
      alert("Mata pelajaran dan materi KBM wajib diisi!")
      return
    }

    if (editingJurnal) {
      setJurnals(prev => prev.map(j => j.id === editingJurnal.id ? { ...form, id: j.id } : j))
      triggerToast(`Jurnal mengajar kelas ${form.kelas} berhasil diperbarui!`)
    } else {
      const newEntry = {
        id: Date.now(),
        ...form
      }
      setJurnals(prev => [newEntry, ...prev])
      triggerToast(`Sesi KBM kelas ${form.kelas} berhasil ditambahkan!`)
    }
    setShowModal(false)
  }

  // Delete Jurnal
  const handleDelete = (id, kelas) => {
    if (window.confirm(`Hapus data jurnal KBM kelas ${kelas}?`)) {
      setJurnals(prev => prev.filter(j => j.id !== id))
      triggerToast(`Jurnal KBM ${kelas} dihapus`)
    }
  }

  // Quick toggle status
  const handleToggleStatus = (id) => {
    setJurnals(prev => prev.map(j => {
      if (j.id === id) {
        const nextStatus = j.status === "Sudah Terisi" ? "Belum Terisi" : "Sudah Terisi"
        return { ...j, status: nextStatus }
      }
      return j
    }))
    triggerToast("Status keterisian jurnal diperbarui")
  }

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["No", "Jam Pelajaran", "Kelas", "Mata Pelajaran", "Guru Pengampu", "Materi KBM", "Kehadiran Siswa", "Status Jurnal", "Catatan Khusus"]
    const rows = filtered.map((item, idx) => [
      idx + 1,
      item.jamKe,
      item.kelas,
      item.mapel,
      item.guru,
      item.materi,
      item.hadir,
      item.status,
      item.catatan || "-"
    ])
    exportToCSV("rekap_jurnal_mengajar_guru.csv", headers, rows)
    triggerToast("Rekap jurnal mengajar berhasil diexport!")
  }

  const filtered = jurnals.filter(j => {
    const matchStatus = filterStatus === "Semua" || j.status === filterStatus
    const matchSearch =
      j.kelas.toLowerCase().includes(search.toLowerCase()) ||
      j.mapel.toLowerCase().includes(search.toLowerCase()) ||
      j.guru.toLowerCase().includes(search.toLowerCase()) ||
      j.materi.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const terisiCount = jurnals.filter(j => j.status === "Sudah Terisi").length
  const belumCount = jurnals.filter(j => j.status === "Belum Terisi").length
  const completionRate = jurnals.length > 0 ? Math.round((terisiCount / jurnals.length) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 dark:bg-slate-100/95 text-white dark:text-slate-900 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-sm font-semibold border border-slate-700 dark:border-slate-300 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 dark:text-emerald-600" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-red-600" /> Jurnal Mengajar Harian
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Rekap materi KBM, capaian pembelajaran guru, dan monitoring pengisian jurnal harian kelas
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
            <Plus className="w-4 h-4" /> Catat Jurnal KBM
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => setFilterStatus("Semua")}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            filterStatus === "Semua"
              ? "bg-slate-100 dark:bg-slate-700 border-slate-400 ring-2 ring-slate-400/20 shadow-md"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:border-slate-300"
          }`}
        >
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Sesi KBM Hari Ini</p>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 mt-1">{jurnals.length}</p>
          <span className="text-[11px] text-slate-400 mt-0.5 block">{completionRate}% Sesi Terselesaikan</span>
        </button>

        <button
          onClick={() => setFilterStatus("Sudah Terisi")}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            filterStatus === "Sudah Terisi"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 ring-2 ring-emerald-500/20 shadow-md"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:border-slate-300"
          }`}
        >
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Jurnal Sudah Terisi</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{terisiCount}</p>
          <span className="text-[11px] text-emerald-500 mt-0.5 block">KBM berjalan lancar</span>
        </button>

        <button
          onClick={() => setFilterStatus("Belum Terisi")}
          className={`p-4 rounded-2xl border text-left transition cursor-pointer ${
            filterStatus === "Belum Terisi"
              ? "bg-amber-50 dark:bg-amber-950/40 border-amber-500 ring-2 ring-amber-500/20 shadow-md"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-sm hover:border-slate-300"
          }`}
        >
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">Belum Terisi</p>
          <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{belumCount}</p>
          <span className="text-[11px] text-amber-500 mt-0.5 block">Menunggu sesi KBM / input guru</span>
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
            placeholder="Cari kelas, guru, mapel, atau materi..."
            className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["Semua", "Sudah Terisi", "Belum Terisi"].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                filterStatus === st
                  ? "bg-red-600 text-white shadow-sm"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Jurnal Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-xs uppercase font-bold tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-5 py-4">Jam Pelajaran</th>
                <th className="px-5 py-4">Kelas & Mapel</th>
                <th className="px-5 py-4">Guru Pengampu</th>
                <th className="px-5 py-4">Materi KBM & Catatan</th>
                <th className="px-5 py-4">Kehadiran Siswa</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-slate-400">
                    Tidak ditemukan data jurnal mengajar yang sesuai.
                  </td>
                </tr>
              ) : (
                filtered.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition">
                    {/* Jam */}
                    <td className="px-5 py-4 text-xs font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-red-500" />
                        <span>Jam {item.jamKe}</span>
                      </div>
                    </td>

                    {/* Kelas & Mapel */}
                    <td className="px-5 py-4">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                        {item.kelas}
                      </span>
                      <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 mt-1">
                        {item.mapel}
                      </div>
                    </td>

                    {/* Guru */}
                    <td className="px-5 py-4 text-xs font-bold text-slate-900 dark:text-slate-100">
                      {item.guru}
                    </td>

                    {/* Materi & Catatan */}
                    <td className="px-5 py-4 max-w-sm">
                      <div className="text-xs text-slate-800 dark:text-slate-200 font-medium line-clamp-2">
                        {item.materi || <span className="text-slate-400 italic">Materi belum diisi</span>}
                      </div>
                      {item.catatan && (
                        <div className="text-[11px] text-amber-600 dark:text-amber-400 mt-0.5">
                          Ket: {item.catatan}
                        </div>
                      )}
                    </td>

                    {/* Hadir */}
                    <td className="px-5 py-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                      {item.hadir}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => handleToggleStatus(item.id)}
                        title="Klik untuk ubah status keterisian"
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition active:scale-95 cursor-pointer ${
                          item.status === "Sudah Terisi"
                            ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${item.status === "Sudah Terisi" ? "bg-emerald-500" : "bg-amber-500 animate-pulse"}`} />
                        {item.status}
                      </button>
                    </td>

                    {/* Aksi */}
                    <td className="px-5 py-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => openModal(item)}
                          className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                          title="Isi / Edit Jurnal"
                        >
                          <Edit3 className="w-4 h-4 text-red-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.kelas)}
                          className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition"
                          title="Hapus Sesi KBM"
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Modal Form Jurnal KBM */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-800 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-red-50/40 dark:bg-red-950/20">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-red-600 text-white flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-base">
                  {editingJurnal ? `Pengisian Jurnal KBM: ${form.kelas}` : "Tambah Sesi KBM Baru"}
                </h3>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveJurnal} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Jam Ke-
                  </label>
                  <select
                    value={form.jamKe}
                    onChange={e => setForm({ ...form, jamKe: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none font-medium"
                  >
                    <option>1 - 2 (07:00 - 08:30)</option>
                    <option>1 - 3 (07:00 - 09:15)</option>
                    <option>3 - 4 (08:45 - 10:15)</option>
                    <option>5 - 6 (10:30 - 12:00)</option>
                    <option>5 - 7 (10:30 - 12:45)</option>
                    <option>7 - 8 (13:15 - 14:45)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Kelas
                  </label>
                  <input
                    type="text"
                    required
                    value={form.kelas}
                    onChange={e => setForm({ ...form, kelas: e.target.value })}
                    placeholder="Contoh: X RPL 1"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Mata Pelajaran *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.mapel}
                    onChange={e => setForm({ ...form, mapel: e.target.value })}
                    placeholder="Pemrograman Web"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Guru Pengampu
                  </label>
                  <input
                    type="text"
                    required
                    value={form.guru}
                    onChange={e => setForm({ ...form, guru: e.target.value })}
                    placeholder="Nama guru..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Materi KBM yang Disampaikan *
                </label>
                <textarea
                  required
                  rows={2}
                  value={form.materi}
                  onChange={e => setForm({ ...form, materi: e.target.value })}
                  placeholder="Tuliskan pokok bahasan, kompetensi dasar, atau modul yang dipraktikkan..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Kehadiran Siswa
                  </label>
                  <input
                    type="text"
                    value={form.hadir}
                    onChange={e => setForm({ ...form, hadir: e.target.value })}
                    placeholder="34 / 36 Siswa"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    Status Keterisian
                  </label>
                  <select
                    value={form.status}
                    onChange={e => setForm({ ...form, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-bold rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                  >
                    <option value="Sudah Terisi">Sudah Terisi</option>
                    <option value="Belum Terisi">Belum Terisi</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                  Catatan Khusus / Siswa Tidak Hadir di Kelas
                </label>
                <input
                  type="text"
                  value={form.catatan}
                  onChange={e => setForm({ ...form, catatan: e.target.value })}
                  placeholder="Misal: 2 siswa sakit di UKS, proyektor lab berfungsi baik..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none"
                />
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
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition cursor-pointer"
                >
                  Simpan Jurnal KBM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
