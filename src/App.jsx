import { useState, useEffect, useCallback } from "react"
import {
  Calendar, Moon, Sun,
  ChevronDown, Bell, Menu,
  BarChart2, Search, MoreVertical, SlidersHorizontal,
  BookOpen, Layers,
  LayoutGrid, PanelLeftClose, PanelLeft, FileText,
  UserX, LogOut, GraduationCap, PenTool, Clock, Award
} from "lucide-react"

// ─── Pages ───────────────────────────────────────────────────────────────────
import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage"
import AbsensiSiswaPage from "./pages/AbsensiSiswaPage"
import TidakHadirPage from "./pages/TidakHadirPage"
import KepulanganPage from "./pages/KepulanganPage"
import AbsensiGuruPage from "./pages/AbsensiGuruPage"
import AgendaPiketPage from "./pages/AgendaPiketPage"
import JurnalMengajarPage from "./pages/JurnalMengajarPage"
import JamKosongPage from "./pages/JamKosongPage"
import KegiatanTambahanPage from "./pages/KegiatanTambahanPage"
import LaporanPage from "./pages/LaporanPage"
import JadwalPage from "./pages/JadwalPage"
import {
  AUTH_STORAGE_KEY, persistSession, loadSession, clearAuthStorage,
  isLockedOut, recordFailedAttempt, resetLoginAttempts,
  canAccess, defaultPageFor, useIdleLogout, sanitizeText
} from "./security"

const PAGE_TITLES = {
  "dashboard": { section: "Ringkasan", label: "Dashboard" },
  "absensi-siswa": { section: "Kehadiran Harian", label: "Absensi Siswa" },
  "tidak-hadir": { section: "Kehadiran Harian", label: "Siswa Tidak Hadir" },
  "kepulangan": { section: "Kehadiran Harian", label: "Kepulangan Siswa" },
  "absensi-guru": { section: "Kehadiran Harian", label: "Absensi Guru" },
  "agenda-piket": { section: "KBM & Operasional", label: "Agenda Piket" },
  "jurnal": { section: "KBM & Operasional", label: "Jurnal Mengajar" },
  "jam-kosong": { section: "KBM & Operasional", label: "Jam Kosong" },
  "kegiatan": { section: "KBM & Operasional", label: "Kegiatan Tambahan" },
  "laporan": { section: "Analitik & Laporan", label: "Laporan" },
  "jadwal": { section: "Analitik & Laporan", label: "Jadwal" },
}

// ─── Sidebar Component ────────────────────────────────────────────────────────

const NAV_ITEMS = [
  {
    section: "NAVIGASI UTAMA",
    items: [
      { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
      {
        id: "kehadiran",
        label: "Kehadiran Harian",
        icon: Layers,
        defaultTarget: "absensi-siswa",
        children: [
          { id: "absensi-siswa", label: "Absensi Siswa", icon: FileText },
          { id: "tidak-hadir", label: "Siswa Tidak Hadir", icon: UserX },
          { id: "kepulangan", label: "Kepulangan Siswa", icon: LogOut },
          { id: "absensi-guru", label: "Absensi Guru", icon: GraduationCap },
        ],
      },
      {
        id: "kbm",
        label: "KBM & Operasional",
        icon: BookOpen,
        defaultTarget: "agenda-piket",
        children: [
          { id: "agenda-piket", label: "Agenda Piket", icon: FileText },
          { id: "jurnal", label: "Jurnal Mengajar", icon: PenTool },
          { id: "jam-kosong", label: "Jam Kosong", icon: Clock },
          { id: "kegiatan", label: "Kegiatan Tambahan", icon: Award },
        ],
      },
    ],
  },
  {
    section: "ANALITIK & LAPORAN",
    items: [
      { id: "laporan", label: "Laporan", icon: BarChart2 },
      { id: "jadwal", label: "Jadwal", icon: Calendar },
    ],
  },
]

const getUserInitials = (name) => {
  if (!name) return "US"
  return name
    .replace(/^(Dra\.|Dr\.|Hj\.|H\.|Bpk\.|Ibu\s)/gi, "")
    .trim()
    .split(" ")
    .slice(0, 2)
    .map(n => n[0])
    .join("")
    .toUpperCase() || "US"
}

function Sidebar({ activePage, onSelectPage, collapsed, onToggle, mobileOpen, onMobileClose, user, onLogout }) {
  const [openMenus, setOpenMenus] = useState({ kehadiran: true, kbm: true })
  const [sidebarSearch, setSidebarSearch] = useState("")

  const toggleMenu = (id) => setOpenMenus(o => ({ ...o, [id]: !o[id] }))

  const handleParentClick = (item) => {
    // If it has children, make sure it's open AND navigate to its default page!
    if (item.children && item.children.length > 0) {
      setOpenMenus(o => ({ ...o, [item.id]: true }))
      if (item.defaultTarget) {
        onSelectPage(item.defaultTarget)
        if (mobileOpen) onMobileClose()
      }
    } else {
      onSelectPage(item.id)
      if (mobileOpen) onMobileClose()
    }
  }

  const sidebarCls = `
    fixed top-0 left-0 h-full bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 flex flex-col z-30
    border-r border-slate-200/80 dark:border-slate-800 transition-all duration-150 ease-out shadow-[1px_0_10px_rgba(0,0,0,0.02)]
    ${collapsed ? "w-16" : "w-60"}
    ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
    md:translate-x-0
  `

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 md:hidden backdrop-blur-xs" onClick={onMobileClose} />
      )}

      <aside className={sidebarCls}>
        {/* Top Header & Logo */}
        <div className={`flex items-center ${collapsed ? "justify-center px-2" : "justify-between px-4"} py-4 border-b border-slate-100 dark:border-slate-800 flex-shrink-0`}>
          {!collapsed ? (
            <button
              onClick={() => onSelectPage("dashboard")}
              className="flex items-center gap-2.5 overflow-hidden group text-left cursor-pointer"
              title="Kembali ke Dashboard"
            >
              <div className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-black text-xs flex-shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                E
              </div>
              <span className="font-extrabold text-slate-900 dark:text-white text-sm tracking-tight whitespace-nowrap group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                E-Piket
              </span>
            </button>
          ) : (
            <button
              onClick={() => onSelectPage("dashboard")}
              className="w-7 h-7 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 flex items-center justify-center font-black text-xs shadow-xs cursor-pointer hover:scale-105 transition-transform"
              title="Dashboard"
            >
              E
            </button>
          )}

          <button
            onClick={onToggle}
            className={`${collapsed ? "hidden md:flex" : "flex"} items-center justify-center w-7 h-7 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors flex-shrink-0`}
            title={collapsed ? "Buka Sidebar" : "Tutup Sidebar"}
          >
            {collapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Search Bar with ⌘K Badge */}
        {!collapsed && (
          <div className="px-3.5 py-3 flex-shrink-0">
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-xl border border-slate-200/90 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800 text-xs transition-all focus-within:border-slate-400 dark:focus-within:border-slate-500 focus-within:bg-white dark:focus-within:bg-slate-800">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  value={sidebarSearch}
                  onChange={e => setSidebarSearch(e.target.value)}
                  placeholder="Cari menu..."
                  className="w-full bg-transparent text-xs text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                />
              </div>
              <span className="text-[10px] bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-400 px-1.5 py-0.5 rounded font-mono shadow-2xs flex-shrink-0">
                ⌘K
              </span>
            </div>
          </div>
        )}

        {/* Navigation Menus */}
        <nav className="flex-1 overflow-y-auto px-2.5 py-1 scrollbar-hide space-y-3">
          {NAV_ITEMS.map(section => {
            const role = user?.role || "siswa"
            const allowedItems = section.items.filter(item => {
              if (item.children && item.children.length > 0) {
                return item.children.some(c => canAccess(role, c.id))
              }
              return canAccess(role, item.id)
            }).map(item => item.children ? { ...item, children: item.children.filter(c => canAccess(role, c.id)) } : item)

            const filteredItems = allowedItems.filter(item => {
              if (!sidebarSearch) return true
              const matchParent = item.label.toLowerCase().includes(sidebarSearch.toLowerCase())
              const matchChild = item.children && item.children.some(c => c.label.toLowerCase().includes(sidebarSearch.toLowerCase()))
              return matchParent || matchChild
            })

            if (filteredItems.length === 0) return null

            return (
              <div key={section.section}>
                {!collapsed && (
                  <p className="px-2.5 py-1 text-[10px] font-bold tracking-wider text-slate-400 dark:text-slate-500 uppercase">
                    {section.section}
                  </p>
                )}
                {collapsed && <div className="border-t border-slate-100 dark:border-slate-800 mx-2 my-2" />}

                <div className="space-y-0.5">
                  {filteredItems.map(item => {
                    const Icon = item.icon
                    const hasChildren = item.children && item.children.length > 0
                    const isOpen = openMenus[item.id] || Boolean(sidebarSearch)
                    const isActive = activePage === item.id
                    const isChildActive = hasChildren && item.children.some(c => c.id === activePage)

                    return (
                      <div key={item.id}>
                        <div className="flex items-center group">
                          <button
                            onClick={() => handleParentClick(item)}
                            title={collapsed ? item.label : undefined}
                            className={`flex-1 flex items-center ${collapsed ? "justify-center px-2" : "justify-between px-2.5"} py-2 rounded-xl transition-all text-xs cursor-pointer
                              ${isActive
                                ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold border border-slate-200/90 dark:border-slate-700 shadow-xs"
                                : isChildActive
                                  ? "text-slate-900 dark:text-white font-semibold bg-slate-50/80 dark:bg-slate-800/40"
                                  : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white font-medium"
                              }`}
                          >
                            <div className={`flex items-center ${collapsed ? "" : "gap-2.5"}`}>
                              <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-slate-900 dark:text-white" : isChildActive ? "text-red-500 dark:text-red-400" : "text-slate-500 dark:text-slate-400"}`} />
                              {!collapsed && <span>{item.label}</span>}
                            </div>
                          </button>

                          {!collapsed && hasChildren && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleMenu(item.id)
                              }}
                              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                              title={isOpen ? "Tutup Submenu" : "Buka Submenu"}
                            >
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-150 ${isOpen ? "rotate-0" : "-rotate-90"}`} />
                            </button>
                          )}
                        </div>

                        {/* Indented Submenu with exact branch icon ↳ */}
                        {hasChildren && isOpen && !collapsed && (
                          <div className="ml-3 my-0.5 pl-3 border-l border-slate-200/70 dark:border-slate-800 space-y-0.5">
                            {item.children.map(child => {
                              const ChildIcon = child.icon
                              const isChildSelected = activePage === child.id

                              return (
                                <button
                                  key={child.id}
                                  onClick={() => {
                                    onSelectPage(child.id)
                                    if (mobileOpen) onMobileClose()
                                  }}
                                  className={`w-full text-left px-2 py-1.5 text-xs rounded-lg transition-all flex items-center gap-2 cursor-pointer ${isChildSelected
                                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold border border-slate-200/90 dark:border-slate-700 shadow-xs"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 font-normal"
                                    }`}
                                >
                                  <span className="text-slate-300 dark:text-slate-600 font-mono text-[11px]">↳</span>
                                  <ChildIcon className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                                  <span className="truncate">{child.label}</span>
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </nav>

        {/* User Profile Card & Logout at Bottom */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 flex-shrink-0 space-y-2">
          {!collapsed ? (
            <>
              <div
                onClick={() => {
                  onSelectPage(user?.role === "siswa" ? "absensi-siswa" : "absensi-guru")
                  if (mobileOpen) onMobileClose()
                }}
                className="flex items-center justify-between p-2 rounded-2xl border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-850 hover:bg-slate-50/80 dark:hover:bg-slate-800 transition-all cursor-pointer shadow-xs group"
                title="Lihat Profil Akun"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-xs">
                      {getUserInitials(user?.name)}
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 border border-white dark:border-slate-900 absolute bottom-0 right-0" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      {user?.name || "Pengguna"}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate leading-none mt-0.5">
                      {user?.role === "siswa" ? `NISN: ${user?.nisn}` : "@guru-piket · online"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Logout Button in Sidebar */}
              <button
                type="button"
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 border border-transparent hover:border-red-200 dark:hover:border-red-900/50 transition cursor-pointer"
                title="Keluar dari akun dan kunci sesi"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Keluar Akun</span>
              </button>
            </>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={() => {
                  onSelectPage(user?.role === "siswa" ? "absensi-siswa" : "absensi-guru")
                  if (mobileOpen) onMobileClose()
                }}
                className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center text-white text-xs font-bold shadow-xs cursor-pointer hover:scale-105 transition-transform"
                title={`${user?.name || "Profil"} - Buka Halaman`}
              >
                {getUserInitials(user?.name)}
              </button>
              <button
                type="button"
                onClick={onLogout}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition cursor-pointer"
                title="Keluar Akun"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}

// ─── Topbar Component with Sun & Moon Mode Toggle ─────────────────────────────

function Topbar({ activePage, onSelectPage, onMenuClick, darkMode, setDarkMode, user, onLogout }) {
  const meta = PAGE_TITLES[activePage] || { section: "Ringkasan", label: "Dashboard" }

  return (
    <header className="bg-[#f4f6f8]/95 dark:bg-slate-950/95 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between gap-4 flex-shrink-0 sticky top-0 z-20 border-b border-slate-200/50 dark:border-slate-800 transition-colors">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs active:scale-95 transition"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Interactive Breadcrumb */}
        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => onSelectPage("dashboard")}
            className="w-6 h-6 rounded-md bg-slate-200/70 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition cursor-pointer shadow-2xs"
            title="Kembali ke Dashboard"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onSelectPage("dashboard")}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition cursor-pointer hidden sm:inline"
          >
            {meta.section}
          </button>

          <span className="text-slate-300 dark:text-slate-600 hidden sm:inline">/</span>

          <span className="font-extrabold text-slate-900 dark:text-white">
            {meta.label}
          </span>

          <span className="hidden lg:inline-block ml-3 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-300/40 dark:border-slate-700">
            Tahun Ajaran 2026/2027 · Semester Ganjil
          </span>
        </div>
      </div>

      {/* Right Topbar Actions */}
      <div className="flex items-center gap-2">
        {/* 🌙 / ☀️ Sun and Moon Mode Toggle Button */}
        <button
          onClick={() => setDarkMode(d => !d)}
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-600 dark:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs transition-all active:scale-95 flex items-center justify-center cursor-pointer group"
          title={darkMode ? "Ganti ke Mode Terang (Siang / Matahari)" : "Ganti ke Mode Gelap (Malam / Bulan)"}
          aria-label="Toggle Theme"
        >
          {darkMode ? (
            <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
          ) : (
            <Moon className="w-4 h-4 text-slate-600 group-hover:-rotate-12 transition-transform" />
          )}
        </button>

        {/* Bell Notification */}
        <button
          onClick={() => onSelectPage("agenda-piket")}
          className="relative p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs transition active:scale-95 cursor-pointer"
          title="Notifikasi Aktivitas Terkini"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
        </button>

        {/* Sliders / Filter (Quick Laporan) */}
        <button
          onClick={() => onSelectPage("laporan")}
          className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs transition active:scale-95 cursor-pointer"
          title="Filter & Laporan Rekapitulasi"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>

        {/* User Profile Tag & Logout Button */}
        <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-200 dark:border-slate-800 ml-1">
          <button
            onClick={() => onSelectPage(user?.role === "siswa" ? "absensi-siswa" : "absensi-guru")}
            className="flex items-center gap-2 px-2 py-1 rounded-xl hover:bg-slate-200/60 dark:hover:bg-slate-800 transition cursor-pointer text-left"
            title={`Profil Akun: ${user?.name}`}
          >
            <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs shadow-xs flex-shrink-0">
              {getUserInitials(user?.name)}
            </div>
            <div className="hidden lg:block">
              <p className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[130px]">
                {user?.name || "Pengguna"}
              </p>
              <span className="text-[10px] text-slate-400 capitalize block">
                {user?.role === "siswa" ? "Siswa" : "Guru Piket"}
              </span>
            </div>
          </button>

          {/* Quick Logout Button in Topbar */}
          <button
            onClick={onLogout}
            className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 hover:border-red-200 dark:hover:border-red-900/50 shadow-xs transition active:scale-95 cursor-pointer"
            title="Keluar dari Akun (Logout)"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}

// ─── Main App Component ───────────────────────────────────────────────────────

export default function App() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [activePage, setActivePage] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  // Load & verify signed session on mount
  useEffect(() => {
    let cancelled = false
    loadSession().then((u) => {
      if (cancelled) return
      setUser(u)
      if (u) setActivePage(defaultPageFor(u.role))
      setAuthLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  // Toggle Dark Mode class on <html> element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // RBAC: keep activePage within allowed set
  useEffect(() => {
    if (user && !canAccess(user.role, activePage)) {
      setActivePage(defaultPageFor(user.role))
    }
  }, [user, activePage])

  const navigateTo = (page) => {
    if (!user) return
    if (!canAccess(user.role, page)) {
      setActivePage(defaultPageFor(user.role))
      return
    }
    setActivePage(page)
  }

  const handleLogin = async (userObj, remember) => {
    setUser(userObj)
    await persistSession(userObj, remember)
    setActivePage(defaultPageFor(userObj.role))
    resetLoginAttempts()
  }

  const handleLogout = useCallback(() => {
    clearAuthStorage()
    setUser(null)
    setActivePage("dashboard")
  }, [])

  useIdleLogout(handleLogout, !!user)

  // If session is still being verified, show a neutral loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6f8] dark:bg-slate-950">
        <div className="w-8 h-8 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
      </div>
    )
  }

  // If not logged in yet, show the Login Page gateway!
  if (!user) {
    return (
      <LoginPage
        onLogin={handleLogin}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    )
  }

  const mainMargin = sidebarCollapsed ? "md:ml-16" : "md:ml-60"

  return (
    <div className="min-h-screen bg-[#f4f6f8] dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex font-sans antialiased selection:bg-slate-900 selection:text-white transition-colors duration-200">
      {/* ── Sidebar ── */}
      <Sidebar
        activePage={activePage}
        onSelectPage={navigateTo}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(c => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        user={user}
        onLogout={handleLogout}
      />

      {/* ── Main Area ── */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-150 ${mainMargin}`}>
        {/* Topbar with Theme Toggle */}
        <Topbar
          activePage={activePage}
          onSelectPage={navigateTo}
          onMenuClick={() => setMobileOpen(true)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          user={user}
          onLogout={handleLogout}
        />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 pb-10 space-y-6">
          {activePage === "dashboard" && <DashboardPage onNavigate={navigateTo} />}
          {activePage === "absensi-siswa" && <AbsensiSiswaPage />}
          {activePage === "tidak-hadir" && <TidakHadirPage />}
          {activePage === "kepulangan" && <KepulanganPage onLogout={handleLogout} onNavigate={navigateTo} />}
          {activePage === "absensi-guru" && <AbsensiGuruPage />}
          {activePage === "agenda-piket" && <AgendaPiketPage />}
          {activePage === "jurnal" && <JurnalMengajarPage />}
          {activePage === "jam-kosong" && <JamKosongPage />}
          {activePage === "kegiatan" && <KegiatanTambahanPage />}
          {activePage === "laporan" && <LaporanPage />}
          {activePage === "jadwal" && <JadwalPage />}
        </main>
      </div>
    </div>
  )
}
