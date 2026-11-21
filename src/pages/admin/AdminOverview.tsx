import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FolderGit2,
  Inbox,
  Clock,
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
  AlertCircle,
  Database,
} from 'lucide-react'
import { usePortfolioData } from '../../context/PortfolioDataContext'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

export function AdminOverview() {
  const { settings, projects, isLive, refetch } = usePortfolioData()
  const [unreadMessages, setUnreadMessages] = useState<number>(0)
  const [totalMessages, setTotalMessages] = useState<number>(0)
  const [recentMessage, setRecentMessage] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (!isSupabaseConfigured) {
        setLoading(false)
        return
      }

      try {
        const { count: unread } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })
          .eq('is_read', false)

        const { count: total } = await supabase
          .from('messages')
          .select('*', { count: 'exact', head: true })

        const { data: latest } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(1)

        setUnreadMessages(unread || 0)
        setTotalMessages(total || 0)
        if (latest && latest.length > 0) setRecentMessage(latest[0])
      } catch (e) {
        console.error('Error fetching admin stats:', e)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage all content, projects, and incoming messages from recruiters and visitors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-900 transition-colors"
          >
            Refresh Data
          </button>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-violet-600 text-xs font-semibold text-white shadow-sm hover:bg-violet-700 transition-colors"
          >
            <Eye size={14} /> View Live Site
          </a>
        </div>
      </div>

      {/* Database Connection Status Banner */}
      <div
        className={`p-4 rounded-2xl border flex items-center justify-between ${
          isLive
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-800 dark:text-emerald-300'
            : 'bg-amber-500/10 border-amber-500/20 text-amber-800 dark:text-amber-300'
        }`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              isLive ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/20 text-amber-600 dark:text-amber-400'
            }`}
          >
            <Database size={20} />
          </div>
          <div>
            <p className="font-semibold text-sm">
              {isLive ? 'Supabase Database Connected' : 'Running on Seed / Fallback Data'}
            </p>
            <p className="text-xs opacity-80 mt-0.5">
              {isLive
                ? 'Changes you make will immediately reflect on the live website.'
                : 'Connect your Supabase project in .env to persist edits across reloads.'}
            </p>
          </div>
        </div>
        <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/50 dark:bg-black/20">
          {isLive ? 'Live Sync' : 'Fallback'}
        </span>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Published Projects</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400">
              <FolderGit2 size={18} />
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{projects.length}</p>
          <Link
            to="/admin/projects"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
          >
            Manage projects <ArrowRight size={12} />
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Unread Messages</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400">
              <Inbox size={18} />
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-900 dark:text-white">{unreadMessages}</p>
          <Link
            to="/admin/messages"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            Open inbox ({totalMessages} total) <ArrowRight size={12} />
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Hire Me Banner</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400">
              <Sparkles size={18} />
            </span>
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-white truncate">
            {settings.hire_banner_visible ? 'Active & Visible' : 'Hidden'}
          </p>
          <Link
            to="/admin/settings"
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            Edit status <ArrowRight size={12} />
          </Link>
        </div>

        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Last Content Update</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400">
              <Clock size={18} />
            </span>
          </div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {settings.updated_at ? new Date(settings.updated_at).toLocaleDateString() : 'Just now'}
          </p>
          <span className="mt-3 block text-xs text-slate-400">
            Real-time synchronization
          </span>
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Latest message */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-white">Latest Message</h3>
            <Link to="/admin/messages" className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline">
              View all
            </Link>
          </div>

          {recentMessage ? (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-100 dark:border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{recentMessage.name}</p>
                <span className="text-xs text-slate-400">
                  {new Date(recentMessage.created_at).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">{recentMessage.email}</p>
              <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2 pt-1">{recentMessage.message}</p>
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic py-6 text-center">No messages received yet.</p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
          <h3 className="font-bold text-base text-slate-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            <Link
              to="/admin/settings"
              className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-violet-500 dark:hover:border-violet-500 bg-slate-50 dark:bg-slate-950/50 hover:bg-violet-50/50 dark:hover:bg-violet-900/10 transition-colors"
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Edit Headline</p>
              <p className="text-xs text-slate-400 mt-1">Change Hero &amp; subtitle</p>
            </Link>

            <Link
              to="/admin/projects"
              className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-violet-500 dark:hover:border-violet-500 bg-slate-50 dark:bg-slate-950/50 hover:bg-violet-50/50 dark:hover:bg-violet-900/10 transition-colors"
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Add Project</p>
              <p className="text-xs text-slate-400 mt-1">Post new case study</p>
            </Link>

            <Link
              to="/admin/experience"
              className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-violet-500 dark:hover:border-violet-500 bg-slate-50 dark:bg-slate-950/50 hover:bg-violet-50/50 dark:hover:bg-violet-900/10 transition-colors"
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Work History</p>
              <p className="text-xs text-slate-400 mt-1">Update roles &amp; bullets</p>
            </Link>

            <Link
              to="/admin/media"
              className="p-3.5 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-violet-500 dark:hover:border-violet-500 bg-slate-50 dark:bg-slate-950/50 hover:bg-violet-50/50 dark:hover:bg-violet-900/10 transition-colors"
            >
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Upload Media</p>
              <p className="text-xs text-slate-400 mt-1">Replace resume or photos</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
