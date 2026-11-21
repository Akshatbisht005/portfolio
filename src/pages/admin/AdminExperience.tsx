import React, { useState } from 'react'
import { Plus, Edit3, Trash2, ArrowUp, X } from 'lucide-react'
import { usePortfolioData } from '../../context/PortfolioDataContext'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { WorkExperienceItem } from '../../types/database'
import { BulletListEditor } from '../../components/admin/BulletListEditor'

export function AdminExperience() {
  const { workExperience, refetch } = usePortfolioData()
  const [editing, setEditing] = useState<WorkExperienceItem | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)

  const emptyItem: WorkExperienceItem = {
    id: '',
    role: '',
    organization: '',
    location: '',
    start_date: '',
    end_date: '',
    period: '',
    is_current: false,
    bullets: [],
    sort_order: workExperience.length + 1,
    is_published: true,
  }

  const handleStartNew = () => {
    setEditing({ ...emptyItem, id: crypto.randomUUID() })
    setIsNew(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    setSaving(true)

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('work_experience').upsert({
          ...editing,
          updated_at: new Date().toISOString(),
        })
        if (error) throw error
        await refetch()
      }
      setEditing(null)
      setIsNew(false)
    } catch (err: any) {
      alert(`Error saving experience: ${err.message}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this position?')) return
    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('work_experience').delete().eq('id', id)
        if (error) throw error
        await refetch()
      }
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Work Experience</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your professional roles, organizations, and bullet point achievements.
          </p>
        </div>

        <button
          onClick={handleStartNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-xs font-semibold text-white shadow-sm hover:bg-violet-700 transition-colors"
        >
          <Plus size={16} /> Add Position
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl my-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {isNew ? 'Add Work Experience' : `Edit: ${editing.role}`}
              </h2>
              <button onClick={() => setEditing(null)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Role Title</label>
                  <input
                    type="text"
                    required
                    value={editing.role}
                    onChange={e => setEditing({ ...editing, role: e.target.value })}
                    placeholder="Paralegal Executive"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Organization / Firm</label>
                  <input
                    type="text"
                    value={editing.organization}
                    onChange={e => setEditing({ ...editing, organization: e.target.value })}
                    placeholder="Law Firm"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Time Period Display</label>
                  <input
                    type="text"
                    required
                    value={editing.period}
                    onChange={e => setEditing({ ...editing, period: e.target.value })}
                    placeholder="Jul 2024 – Present"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={editing.location || ''}
                    onChange={e => setEditing({ ...editing, location: e.target.value })}
                    placeholder="Delhi"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40">
                <BulletListEditor
                  label="Responsibilities & Achievements"
                  placeholder="Managed 60+ active case files..."
                  items={editing.bullets}
                  onChange={items => setEditing({ ...editing, bullets: items })}
                />
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
                  {saving ? 'Saving...' : 'Save Position'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* List */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 divide-y divide-slate-100 dark:divide-slate-800 shadow-sm overflow-hidden">
        {workExperience.map(item => (
          <div key={item.id} className="p-5 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                {item.period}
              </p>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mt-0.5">{item.role}</h3>
              {item.organization && (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {item.organization} {item.location ? `· ${item.location}` : ''}
                </p>
              )}
              <ul className="mt-2 space-y-1">
                {item.bullets.map((b, i) => (
                  <li key={i} className="text-xs text-slate-600 dark:text-slate-400 flex gap-2">
                    <span className="text-violet-500">•</span> {b}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => { setEditing(item); setIsNew(false) }}
                className="p-2 text-slate-400 hover:text-violet-600 dark:hover:text-violet-400"
                title="Edit position"
              >
                <Edit3 size={16} />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 text-slate-400 hover:text-red-600"
                title="Delete position"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
