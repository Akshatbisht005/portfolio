import React, { useState } from 'react'
import { Plus, Edit3, Trash2, ArrowUp, ArrowDown, X, Star } from 'lucide-react'
import { usePortfolioData } from '../../context/PortfolioDataContext'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { ProjectItem } from '../../types/database'
import { BulletListEditor } from '../../components/admin/BulletListEditor'

export function AdminProjects() {
  const { projects, refetch } = usePortfolioData()
  const [editing, setEditing] = useState<ProjectItem | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const emptyProject: ProjectItem = {
    id: '',
    slug: '',
    title: '',
    category: '',
    timeframe: '',
    summary: '',
    outcomes: [],
    tags: [],
    filter_tags: [],
    cover_image_url: '',
    gallery_urls: [],
    prototype_url: '',
    prd_url: '',
    is_featured: false,
    sort_order: projects.length + 1,
    is_published: true,
  }

  const handleStartNew = () => {
    setEditing({ ...emptyProject, id: crypto.randomUUID() })
    setIsNew(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    setSaving(true)

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('projects').upsert({
          ...editing,
          updated_at: new Date().toISOString(),
        })
        if (error) throw error
        await refetch()
      }
      setToast('Project saved successfully!')
      setTimeout(() => setToast(null), 3000)
      setEditing(null)
      setIsNew(false)
    } catch (err: any) {
      alert(`Error saving project: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('projects').delete().eq('id', id)
        if (error) throw error
        await refetch()
      }
      setToast('Project deleted.')
      setTimeout(() => setToast(null), 3000)
    } catch (err: any) {
      alert(`Error deleting project: ${err.message}`)
    }
  }

  const handleTogglePublish = async (p: ProjectItem) => {
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase
          .from('projects')
          .update({ is_published: !p.is_published })
          .eq('id', p.id)
        if (error) throw error
        await refetch()
      }
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleMove = async (idx: number, dir: 'up' | 'down') => {
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= projects.length) return

    const currentP = projects[idx]
    const targetP = projects[targetIdx]

    try {
      if (isSupabaseConfigured) {
        await supabase.from('projects').update({ sort_order: targetP.sort_order }).eq('id', currentP.id)
        await supabase.from('projects').update({ sort_order: currentP.sort_order }).eq('id', targetP.id)
        await refetch()
      }
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Projects &amp; Case Studies</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your portfolio projects, PRDs, outcomes, and prototypes.
          </p>
        </div>

        <button
          onClick={handleStartNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-xs font-semibold text-white shadow-sm hover:bg-violet-700 transition-colors"
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-sm">
          {toast}
        </div>
      )}

      {/* Editing Modal / Drawer */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {isNew ? 'Create New Project' : `Edit: ${editing.title}`}
              </h2>
              <button onClick={() => setEditing(null)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={editing.title}
                    onChange={e => setEditing({ ...editing, title: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Slug (URL friendly)</label>
                  <input
                    type="text"
                    required
                    value={editing.slug}
                    onChange={e => setEditing({ ...editing, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Category &amp; Subtitle</label>
                  <input
                    type="text"
                    required
                    value={editing.category}
                    onChange={e => setEditing({ ...editing, category: e.target.value })}
                    placeholder="e.g. Entertainment Discovery · Airtribe Capstone"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Timeframe</label>
                  <input
                    type="text"
                    value={editing.timeframe}
                    onChange={e => setEditing({ ...editing, timeframe: e.target.value })}
                    placeholder="e.g. Jul 2026 or Jan – Mar 2025"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Summary</label>
                <textarea
                  rows={3}
                  required
                  value={editing.summary}
                  onChange={e => setEditing({ ...editing, summary: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              {/* Outcomes Bullet List */}
              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
                <BulletListEditor
                  label="Key Outcomes & Deliverables"
                  placeholder="Outcome metric, RICE score, or user story..."
                  items={editing.outcomes}
                  onChange={items => setEditing({ ...editing, outcomes: items })}
                />
              </div>

              {/* Tags & Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editing.tags.join(', ')}
                    onChange={e => setEditing({ ...editing, tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    placeholder="Discovery, RICE, PRD, Prototype"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Filter Tabs (comma separated)
                  </label>
                  <input
                    type="text"
                    value={editing.filter_tags.join(', ')}
                    onChange={e => setEditing({ ...editing, filter_tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                    placeholder="Consumer, EdTech, SaaS, PRD"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
              </div>

              {/* Prototype & PRD Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    Clickable Prototype URL
                  </label>
                  <input
                    type="text"
                    value={editing.prototype_url}
                    onChange={e => setEditing({ ...editing, prototype_url: e.target.value })}
                    placeholder="https://preview--portfoliorohitrawat.lovable.app"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    PRD Document URL / Path
                  </label>
                  <input
                    type="text"
                    value={editing.prd_url}
                    onChange={e => setEditing({ ...editing, prd_url: e.target.value })}
                    placeholder="/projects/bookmyshow-prd.pdf"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.is_featured}
                    onChange={e => setEditing({ ...editing, is_featured: e.target.checked })}
                    className="rounded border-slate-300 text-violet-600 focus:ring-violet-500 h-4 w-4"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Feature on top (larger card)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editing.is_published}
                    onChange={e => setEditing({ ...editing, is_published: e.target.checked })}
                    className="rounded border-slate-300 text-violet-600 focus:ring-violet-500 h-4 w-4"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">Published on live site</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-violet-600 text-xs font-semibold text-white shadow-sm hover:bg-violet-700 disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects List Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {projects.map((p, idx) => (
            <div key={p.id} className="p-5 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-950/40 transition-colors">
              <div className="flex items-center gap-4 min-w-0">
                <div className="flex flex-col gap-1 text-slate-400">
                  <button
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'up')}
                    className="p-1 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20"
                    title="Move up"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    disabled={idx === projects.length - 1}
                    onClick={() => handleMove(idx, 'down')}
                    className="p-1 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-20"
                    title="Move down"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">{p.title}</h3>
                    {p.is_featured && (
                      <span className="flex items-center gap-1 text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300">
                        <Star size={10} /> Featured
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{p.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleTogglePublish(p)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    p.is_published
                      ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {p.is_published ? 'Published' : 'Draft'}
                </button>
                <button
                  onClick={() => { setEditing(p); setIsNew(false) }}
                  className="p-2 text-slate-400 hover:text-violet-600 dark:hover:text-violet-400"
                  title="Edit project"
                >
                  <Edit3 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(p.id, p.title)}
                  className="p-2 text-slate-400 hover:text-red-600"
                  title="Delete project"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
