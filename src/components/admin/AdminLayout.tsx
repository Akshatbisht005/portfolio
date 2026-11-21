import React, { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Settings,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Sparkles,
  Layers,
  Wrench,
  Image,
  Inbox,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

const NAV_ITEMS = [
  { label: 'Overview', to: '/admin', icon: LayoutDashboard, exact: true },
  { label: 'Site Settings', to: '/admin/settings', icon: Settings },
  { label: 'Projects', to: '/admin/projects', icon: FolderGit2 },
  { label: 'Work Experience', to: '/admin/experience', icon: Briefcase },
  { label: 'Education', to: '/admin/education', icon: GraduationCap },
  { label: 'Skills', to: '/admin/skills', icon: Sparkles },
  { label: 'What I Do', to: '/admin/what-i-do', icon: Layers },
  { label: 'Tools Strip', to: '/admin/tools', icon: Wrench },
  { label: 'Media Library', to: '/admin/media', icon: Image },
  { label: 'Messages', to: '/admin/messages', icon: Inbox },
]

export function AdminLayout() {
  const navigate = useNavigate()
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState<number>(0)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    // Check Supabase Auth
    if (!isSupabaseConfigured) {
      // In dev fallback mode without Supabase keys, allow demo admin session
      setUserEmail('rohanrwt9278@gmail.com (Demo Mode)')
      setCheckingAuth(false)
      return
    }

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        navigate('/admin/login', { replace: true })
        return
      }

      setUserEmail(session.user.email || 'Admin')

      // Fetch unread messages count
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)

      if (count !== null) setUnreadCount(count)
      setCheckingAuth(false)
    }

    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && isSupabaseConfigured) {
        navigate('/admin/login', { replace: true })
      } else if (session) {
        setUserEmail(session.user.email || 'Admin')
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    }
    navigate('/admin/login')
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-violet-500 border-t-transparent" />
          <p className="text-sm text-slate-400">Verifying admin access...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-slate-900 text-white px-4 py-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <ShieldCheck size={20} className="text-violet-400" />
          <span className="font-bold text-sm">Portfolio Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(o => !o)}
          className="p-1.5 text-slate-300 hover:text-white"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-40 h-screen w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600 text-white font-bold text-sm shadow-md">
              RR
            </div>
            <div>
              <p className="font-bold text-sm text-white">Portfolio Admin</p>
              <p className="text-[11px] text-slate-400 truncate max-w-[140px]">{userEmail}</p>
            </div>
          </div>
        </div>

        {!isSupabaseConfigured && (
          <div className="mx-4 mt-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-start gap-2">
            <AlertTriangle size={15} className="flex-shrink-0 mt-0.5 text-amber-400" />
            <div>
              <p className="font-semibold">Demo / Offline Mode</p>
              <p className="text-[11px] text-amber-300/80 mt-0.5">Connect Supabase via .env to sync live data.</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`
              }
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} />
                <span>{item.label}</span>
              </div>
              {item.label === 'Messages' && unreadCount > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500 text-white text-xs font-bold">
                  {unreadCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer controls */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl border border-slate-700 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <ExternalLink size={14} />
            <span>View Public Site</span>
          </a>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl text-xs font-medium text-red-400 hover:bg-red-950/30 transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  )
}
