import React, { useState } from 'react'
import { Plus, Edit3, Trash2, X, Search, FileText, BarChart2, Layers, Cpu } from 'lucide-react'
import { usePortfolioData } from '../../context/PortfolioDataContext'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'
import { WhatIDoItem } from '../../types/database'

export function AdminWhatIDo() {
  const { whatIDo, refetch } = usePortfolioData()
  const [editing, setEditing] = useState<WhatIDoItem | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [saving, setSaving] = useState(false)

  const emptyItem: WhatIDoItem = {
    id: '',
    title: '',
    description: '',
    icon: 'Search',
    sort_order: whatIDo.length + 1,
    is_published: true,
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editing) return
    setSaving(true)

    try {
      if (isSupabaseConfigured) {
        await supabase.from('what_i_do').upsert({
          ...editing,
          updated_at: new Date().toISOString(),
        })
        await refetch()
      }
      setEditing(null)
      setIsNew(false)
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this card?')) return
    try {
      if (isSupabaseConfigured) {
        await supabase.from('what_i_do').delete().eq('id', id)
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
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">What I Do / Services</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            The 3 core value propositions displayed in the &quot;How I Work&quot; section.
          </p>
        </div>

        <button
          onClick={() => { setEditing({ ...emptyItem, id: crypto.randomUUID() }); setIsNew(true) }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 text-xs font-semibold text-white shadow-sm hover:bg-violet-700 transition-colors"
        >
          <Plus size={16} /> Add Card
        </button>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {isNew ? 'New Card' : 'Edit Card'}
              </h2>
              <button onClick={() => setEditing(null)} className="p-1.5 text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editing.title}
                  onChange={e => setEditing({ ...editing, title: e.target.value })}
                  placeholder="Discovery &amp; Research"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Icon</label>
                <select
                  value={editing.icon}
                  onChange={e => setEditing({ ...editing, icon: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none"
                >
                  <option value="Search">Search (Discovery)</option>
                  <option value="FileText">FileText (PRDs &amp; Specs)</option>
                  <option value="BarChart2">BarChart2 (Metrics &amp; Rollout)</option>
                  <option value="Layers">Layers (Frameworks)</option>
                  <option value="Cpu">Cpu (AI Products)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Description</label>
                <textarea
                  rows={4}
                  required
                  value={editing.description}
                  onChange={e => setEditing({ ...editing, description: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-xl bg-violet-600 text-xs font-semibold text-white shadow-sm hover:bg-violet-700 disabled:opacity-60"
                >
                  Save Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid of cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {whatIDo.map(item => (
          <div key={item.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400">
                  <Search size={20} />
                </span>
                <div className="flex items-center gap-1">
                  <button onClick={() => { setEditing(item); setIsNew(false) }} className="p-1.5 text-slate-400 hover:text-violet-600">
                    <Edit3 size={15} />
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-500">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">{item.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
