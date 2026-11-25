import React, { useState } from "react"
import { Calendar, Clock, MapPin } from "lucide-react"

const SCHEDULE_DATA = {
  Senin: {
    koordinator: "Hendra Wijaya, S.Pd.",
    tim: [
      { nama: "Agus Salim, S.Kom.", pos: "Gerbang Utama & Lobi Masuk" },
      { nama: "Dra. Hj. Nurjanah, M.Pd.", pos: "UKS & Ruang Piket" },
      { nama: "Rizky Pratama, S.T.", pos: "Lab Jaringan & Koridor Lantai 2" },
    ],
    catatanKhusus: "Pengawasan Upacara Bendera mulai pukul 06:45 WIB"
  },
  Selasa: {
    koordinator: "Dra. Hj. Nurjanah, M.Pd.",
    tim: [
      { nama: "Bambang Sudirman, S.T.", pos: "Gerbang Utama & Parkir" },
      { nama: "Farida Hanim, S.E.", pos: "Lobi & Ruang Piket" },
      { nama: "Ratna Sari, M.Kom.", pos: "Lab RPL & Lantai 3" },
    ],
    catatanKhusus: "Pemeriksaan atribut seragam batik kejuruan"
  },
  Rabu: {
    koordinator: "Bambang Sudirman, S.T.",
    tim: [
      { nama: "Hendra Wijaya, S.Pd.", pos: "Gerbang Utama" },
      { nama: "Dewi Lestari, S.Pd.", pos: "Ruang Piket & UKS" },
      { nama: "Agus Salim, S.Kom.", pos: "Bengkel & Lab Komputer" },
    ],
    catatanKhusus: "Monitoring seragam pramuka & kegiatan kepramukaan sore"
  },
  Kamis: {
    koordinator: "Farida Hanim, S.E.",
    tim: [
      { nama: "Rizky Pratama, S.T.", pos: "Gerbang Utama" },
      { nama: "Ratna Sari, M.Kom.", pos: "Ruang Piket" },
      { nama: "Fikri Ramadhan, S.Pd.", pos: "Lapangan Olahraga & Koridor" },
    ],
    catatanKhusus: "Pemeriksaan literasi 15 menit sebelum KBM jam ke-1"
  },
  Jumat: {
    koordinator: "Agus Salim, S.Kom.",
    tim: [
      { nama: "Hendra Wijaya, S.Pd.", pos: "Masjid Sekolah & Gerbang" },
      { nama: "Dra. Hj. Nurjanah, M.Pd.", pos: "Kajian Keputrian" },
      { nama: "Dewi Lestari, S.Pd.", pos: "Ruang Piket" },
    ],
    catatanKhusus: "Pengawasan Sholat Jumat berjamaah & keputrian, jam pulang 11:30 WIB"
  },
  Sabtu: {
    koordinator: "Rizky Pratama, S.T.",
    tim: [
      { nama: "Bambang Sudirman, S.T.", pos: "Gerbang & Lapangan" },
      { nama: "Fikri Ramadhan, S.Pd.", pos: "Area Ekstrakurikuler" },
    ],
    catatanKhusus: "Fokus pembinaan ekstrakurikuler & kegiatan klub minat bakat"
  }
}

const BELL_SCHEDULE = [
  { jam: "06:45 - 07:00", aktivitas: "Bel Masuk, Apel Pagi / Doa Bersama & Literasi", tipe: "rutin" },
  { jam: "07:00 - 08:30", aktivitas: "KBM Jam Pelajaran 1 & 2", tipe: "kbm" },
  { jam: "08:30 - 10:00", aktivitas: "KBM Jam Pelajaran 3 & 4", tipe: "kbm" },
  { jam: "10:00 - 10:20", aktivitas: "Istirahat I (Snack & Refreshing)", tipe: "istirahat" },
  { jam: "10:20 - 11:50", aktivitas: "KBM Jam Pelajaran 5 & 6", tipe: "kbm" },
  { jam: "11:50 - 12:45", aktivitas: "Istirahat II (Sholat Dzuhur Berjamaah & Makan Siang)", tipe: "istirahat" },
  { jam: "12:45 - 14:15", aktivitas: "KBM Jam Pelajaran 7 & 8", tipe: "kbm" },
  { jam: "14:15 - 15:30", aktivitas: "KBM Jam Pelajaran 9 & 10", tipe: "kbm" },
  { jam: "15:30", aktivitas: "Bel Kepulangan & Doa Penutup", tipe: "pulang" },
]

export default function JadwalPage() {
  const [selectedDay, setSelectedDay] = useState("Senin")
  const data = SCHEDULE_DATA[selectedDay]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
          <Calendar className="w-7 h-7 text-red-600" /> Jadwal Petugas Piket & KBM
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Jadwal giliran dewan guru bertugas piket dan jam operasional lonceng sekolah
        </p>
      </div>

      {/* Day Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"].map(day => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition ${selectedDay === day
                ? "bg-red-600 text-white shadow-sm"
                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
              }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Duty Team Card */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Tim Piket Hari {selectedDay}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Koordinator: <span className="font-semibold text-slate-700 dark:text-slate-200">{data.koordinator}</span>
            </p>
          </div>
          <span className="text-xs px-3 py-1 bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300 rounded-full font-semibold self-start sm:self-auto">
            {data.catatanKhusus}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {data.tim.map((t, idx) => (
            <div key={idx} className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                P{idx + 1}
              </div>
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100 text-sm">{t.nama}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3 h-3 text-red-500 flex-shrink-0" /> {t.pos}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bell Schedule Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
          <Clock className="w-5 h-5 text-red-600" />
          <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
            Susunan Jam Pelajaran & Lonceng Operasional Harian
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 text-xs uppercase font-semibold">
              <tr>
                <th className="px-5 py-3">Waktu</th>
                <th className="px-5 py-3">Aktivitas / Kegiatan</th>
                <th className="px-5 py-3">Keterangan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {BELL_SCHEDULE.map((s, idx) => (
                <tr key={idx} className={`hover:bg-slate-50 dark:hover:bg-slate-700/40 transition ${s.tipe === "istirahat" ? "bg-amber-50/50 dark:bg-amber-950/20" : ""
                  }`}>
                  <td className="px-5 py-3 text-xs font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    {s.jam}
                  </td>
                  <td className="px-5 py-3 text-xs font-medium text-slate-700 dark:text-slate-300">
                    {s.aktivitas}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${s.tipe === "kbm" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300" :
                        s.tipe === "istirahat" ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" :
                          "bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300"
                      }`}>
                      {s.tipe}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
