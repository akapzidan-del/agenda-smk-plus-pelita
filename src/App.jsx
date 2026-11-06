import { useState } from "react"
import { Search, Calendar, Filter, MapPin, Clock, GraduationCap } from "lucide-react"
import logoImg from "./assets/logo.png" // 
export default function App() {
  const [search, setSearch] = useState("")
  const [kategori, setKategori] = useState("Semua")

  const agendas = [
    { id: 1, judul: "Upacara Bendera Senin", kategori: "Kesiswaan", tanggal: "11 Nov 2026", jam: "07:00 WIB", tempat: "Lapangan Utama", status: "Aktif", warna: "bg-blue-500" },
    { id: 2, judul: "Rapat Guru Kurikulum Merdeka", kategori: "Guru", tanggal: "12 Nov 2026", jam: "13:00 WIB", tempat: "Ruang Guru", status: "Aktif", warna: "bg-emerald-500" },
    { id: 3, judul: "LDKS OSIS 2026", kategori: "OSIS", tanggal: "13 Nov 2026", jam: "08:00 WIB", tempat: "Aula Sekolah", status: "Akan Datang", warna: "bg-orange-500" },
    { id: 4, judul: "Ujian Praktik Kejuruan TKJ", kategori: "Akademik", tanggal: "14 Nov 2026", jam: "08:30 WIB", tempat: "Lab Komputer", status: "Aktif", warna: "bg-purple-500" },
    { id: 5, judul: "Persiapan Lomba LKS Tingkat Kota", kategori: "Kesiswaan", tanggal: "15 Nov 2026", jam: "15:00 WIB", tempat: "Bengkel TKJ", status: "Akan Datang", warna: "bg-blue-500" },
    { id: 6, judul: "Sosialisasi Magang Industri", kategori: "Humas", tanggal: "16 Nov 2026", jam: "09:00 WIB", tempat: "Aula", status: "Aktif", warna: "bg-pink-500" },
  ]

  const kategoriList = ["Semua", "Kesiswaan", "Guru", "OSIS", "Akademik", "Humas"]

  const filtered = agendas.filter(a => {
    const matchSearch = a.judul.toLowerCase().includes(search.toLowerCase())
    const matchKat = kategori === "Semua" || a.kategori === kategori
    return matchSearch && matchKat
  })

  return (
    <div className="min-h-screen bg-[#F8F8F9] text-slate-900 font-sans">
      {/* HEADER */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Logo" className="w-11 h-11 object-contain rounded-full bg-white shadow-sm" />
            <div className="leading-tight">
              <p className="font-black text-[13px] tracking-wide">SMK PLUS PELITA NUSANTARA</p>
              <p className="text-[11px] text-slate-500 font-medium">E-Piket Nusantara • Sistem Agenda Digital</p>
            </div>
          </div>
          <button className="px-5 py-2 bg-slate-900 text-white rounded-full text-xs font-semibold hover:bg-black transition">Login Admin</button>
        </div>
      </header>

      {/* HERO + FILTER */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight">Agenda Sekolah</h1>
            <p className="text-sm text-slate-500 mt-2">Pantau semua kegiatan resmi SMK Plus Pelita Nusantara secara real-time.</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari agenda..." className="pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-full text-sm w-[200px] focus:outline-none focus:ring-2 focus:ring-slate-900" />
            </div>
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
          {kategoriList.map(k => (
            <button key={k} onClick={() => setKategori(k)} className={`px-4 py-2 rounded-full text-xs font-semibold border whitespace-nowrap transition ${kategori === k ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
              {k}
            </button>
          ))}
        </div>

        {/* GRID */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(a => (
            <div key={a.id} className="group bg-white rounded-[20px] border border-slate-200 p-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex justify-between items-start mb-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold text-white ${a.warna}`}>{a.kategori}</span>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${a.status === "Aktif" ? "bg-green-50 text-green-700 border-green-200" : "bg-orange-50 text-orange-700 border-orange-200"}`}>{a.status}</span>
              </div>
              <h3 className="font-bold text-[15px] leading-snug group-hover:text-slate-700">{a.judul}</h3>
              <div className="mt-4 space-y-2 text-[12px] text-slate-500">
                <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {a.tanggal} • <Clock className="w-4 h-4" /> {a.jam}</div>
                <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {a.tempat}</div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-[20px] border border-dashed mt-4">
            <p className="text-sm text-slate-500">Tidak ada agenda untuk "{search}" di kategori {kategori}</p>
          </div>
        )}
      </main>

      <footer className="text-center py-8 text-[11px] text-slate-400">© 2026 SMK Plus Pelita Nusantara • Dibuat untuk E-Piket</footer>
    </div>
  )
}