import React, { useState } from "react"
import { BarChart3, Download, Calendar, CheckCircle2, TrendingUp, FileSpreadsheet } from "lucide-react"

const DATA_PERIODE = {
  "Minggu Ini": {
    kpi: {
      kehadiranSiswa: { val: "97.4%", trend: "+0.8% vs minggu lalu", up: true },
      kehadiranGuru: { val: "98.5%", detail: "41 dari 42 dewan guru hadir" },
      jurnalKBM: { val: "96.2%", detail: "125 dari 130 sesi terisi" },
      disiplinPiket: { val: "99.5%", detail: "Semua pos piket terisi tepat waktu" }
    },
    jurusan: [
      { nama: "Teknik Komputer & Jaringan (TKJ)", persentase: 97.8, siswa: 280, sakit: 3, izin: 2, alfa: 1, warna: "bg-blue-500" },
      { nama: "Rekayasa Perangkat Lunak (RPL)", persentase: 98.4, siswa: 240, sakit: 2, izin: 1, alfa: 1, warna: "bg-emerald-500" },
      { nama: "Otomatisasi & Tata Kelola Perkantoran (OTKP)", persentase: 96.1, siswa: 180, sakit: 4, izin: 2, alfa: 1, warna: "bg-amber-500" },
      { nama: "Akuntansi & Keuangan Lembaga (AKL)", persentase: 99.2, siswa: 124, sakit: 1, izin: 0, alfa: 0, warna: "bg-purple-500" },
    ]
  },
  "Bulan Ini": {
    kpi: {
      kehadiranSiswa: { val: "96.6%", trend: "+1.2% dari bulan lalu", up: true },
      kehadiranGuru: { val: "97.8%", detail: "Disiplin tepat waktu" },
      jurnalKBM: { val: "94.2%", detail: "Dari total 520 sesi kelas" },
      disiplinPiket: { val: "99.1%", detail: "Tertib & tepat waktu" }
    },
    jurusan: [
      { nama: "Teknik Komputer & Jaringan (TKJ)", persentase: 96.4, siswa: 280, sakit: 5, izin: 3, alfa: 2, warna: "bg-blue-500" },
      { nama: "Rekayasa Perangkat Lunak (RPL)", persentase: 97.2, siswa: 240, sakit: 4, izin: 2, alfa: 1, warna: "bg-emerald-500" },
      { nama: "Otomatisasi & Tata Kelola Perkantoran (OTKP)", persentase: 94.8, siswa: 180, sakit: 6, izin: 2, alfa: 3, warna: "bg-amber-500" },
      { nama: "Akuntansi & Keuangan Lembaga (AKL)", persentase: 98.1, siswa: 124, sakit: 1, izin: 1, alfa: 0, warna: "bg-purple-500" },
    ]
  },
  "Semester Ganjil 2026/2027": {
    kpi: {
      kehadiranSiswa: { val: "95.2%", trend: "+2.4% vs semester lalu", up: true },
      kehadiranGuru: { val: "96.9%", detail: "Rata-rata 1 semester ganjil" },
      jurnalKBM: { val: "93.1%", detail: "Dari total 3.120 sesi KBM" },
      disiplinPiket: { val: "98.4%", detail: "Evaluasi rekapitulasi semesteran" }
    },
    jurusan: [
      { nama: "Teknik Komputer & Jaringan (TKJ)", persentase: 95.6, siswa: 280, sakit: 24, izin: 18, alfa: 10, warna: "bg-blue-500" },
      { nama: "Rekayasa Perangkat Lunak (RPL)", persentase: 96.3, siswa: 240, sakit: 19, izin: 14, alfa: 8, warna: "bg-emerald-500" },
      { nama: "Otomatisasi & Tata Kelola Perkantoran (OTKP)", persentase: 93.7, siswa: 180, sakit: 28, izin: 16, alfa: 14, warna: "bg-amber-500" },
      { nama: "Akuntansi & Keuangan Lembaga (AKL)", persentase: 97.5, siswa: 124, sakit: 8, izin: 6, alfa: 2, warna: "bg-purple-500" },
    ]
  },
  "Tahunan": {
    kpi: {
      kehadiranSiswa: { val: "94.8%", trend: "+3.1% peningkatan tahunan", up: true },
      kehadiranGuru: { val: "96.5%", detail: "Akumulasi tahun ajaran berjalan" },
      jurnalKBM: { val: "92.4%", detail: "6.240 jam pelajaran tercatat" },
      disiplinPiket: { val: "98.0%", detail: "Konsistensi kehadiran piket tahunan" }
    },
    jurusan: [
      { nama: "Teknik Komputer & Jaringan (TKJ)", persentase: 95.1, siswa: 280, sakit: 52, izin: 38, alfa: 22, warna: "bg-blue-500" },
      { nama: "Rekayasa Perangkat Lunak (RPL)", persentase: 95.9, siswa: 240, sakit: 41, izin: 30, alfa: 18, warna: "bg-emerald-500" },
      { nama: "Otomatisasi & Tata Kelola Perkantoran (OTKP)", persentase: 93.2, siswa: 180, sakit: 60, izin: 34, alfa: 29, warna: "bg-amber-500" },
      { nama: "Akuntansi & Keuangan Lembaga (AKL)", persentase: 97.0, siswa: 124, sakit: 18, izin: 12, alfa: 5, warna: "bg-purple-500" },
    ]
  }
}

export default function LaporanPage() {
  const [periode, setPeriode] = useState("Bulan Ini")
  const [toast, setToast] = useState("")

  const triggerToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(""), 3000)
  }

  const currentData = DATA_PERIODE[periode] || DATA_PERIODE["Bulan Ini"]

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
            <BarChart3 className="w-7 h-7 text-red-600" /> Laporan & Rekapitulasi Analitik
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Statistik dan analitik kehadiran siswa, guru, serta rekapitulasi operasional sekolah
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => triggerToast(`Mengunduh Rekap ${periode} dalam format PDF...`)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-semibold transition shadow-sm cursor-pointer active:scale-95"
          >
            <Download className="w-4 h-4" /> Cetak PDF
          </button>
          <button
            onClick={() => triggerToast(`Mengunduh Rekap ${periode} dalam format Excel (.xlsx)...`)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition cursor-pointer active:scale-95"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Export Excel
          </button>
        </div>
      </div>

      {/* Filter Periode Picker */}
      <div className="flex items-center justify-between bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-red-500" />
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">Periode Laporan:</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {["Minggu Ini", "Bulan Ini", "Semester Ganjil 2026/2027", "Tahunan"].map(p => (
            <button
              key={p}
              onClick={() => {
                setPeriode(p)
                triggerToast(`Menampilkan data analitik: ${p}`)
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                periode === p
                  ? "bg-red-600 text-white shadow-sm font-bold scale-[1.02]"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Summary KPI Cards (Dynamic Values Based on Period) */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300 hover:shadow-md">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Rata-rata Kehadiran Siswa</p>
          <p className="text-2xl font-black text-emerald-600 mt-1 transition-all duration-300">
            {currentData.kpi.kehadiranSiswa.val}
          </p>
          <span className="text-[11px] text-emerald-500 font-semibold flex items-center gap-1 mt-0.5">
            <TrendingUp className="w-3 h-3" /> {currentData.kpi.kehadiranSiswa.trend}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300 hover:shadow-md">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Kehadiran Dewan Guru</p>
          <p className="text-2xl font-black text-blue-600 mt-1 transition-all duration-300">
            {currentData.kpi.kehadiranGuru.val}
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block truncate">
            {currentData.kpi.kehadiranGuru.detail}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300 hover:shadow-md">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Keterisian Jurnal KBM</p>
          <p className="text-2xl font-black text-purple-600 mt-1 transition-all duration-300">
            {currentData.kpi.jurnalKBM.val}
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block truncate">
            {currentData.kpi.jurnalKBM.detail}
          </span>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm transition-all duration-300 hover:shadow-md">
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Indeks Kedisiplinan Piket</p>
          <p className="text-2xl font-black text-red-600 mt-1 transition-all duration-300">
            {currentData.kpi.disiplinPiket.val}
          </p>
          <span className="text-[11px] text-slate-400 mt-0.5 block truncate">
            {currentData.kpi.disiplinPiket.detail}
          </span>
        </div>
      </div>

      {/* Progress Bars per Jurusan (Dynamic Based on Period) */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
              Tingkat Kehadiran Siswa per Program Keahlian
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Data absensi terintegrasi untuk periode: <span className="font-semibold text-red-600 dark:text-red-400">{periode}</span>
            </p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 self-start sm:self-auto">
            {periode}
          </span>
        </div>

        <div className="space-y-4">
          {currentData.jurusan.map(j => (
            <div key={j.nama} className="space-y-1.5 group">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-800 dark:text-slate-200">{j.nama}</span>
                <span className="text-slate-900 dark:text-slate-100 font-bold transition-all duration-300">
                  {j.persentase}%
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden">
                <div
                  className={`h-full ${j.warna} rounded-full transition-all duration-700 ease-out`}
                  style={{ width: `${j.persentase}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span>Total Siswa: {j.siswa}</span>
                <span className="transition-all duration-300">
                  Sakit: <strong className="text-slate-600 dark:text-slate-300">{j.sakit}</strong> · 
                  Izin: <strong className="text-slate-600 dark:text-slate-300">{j.izin}</strong> · 
                  Alfa: <strong className="text-slate-600 dark:text-slate-300">{j.alfa}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
