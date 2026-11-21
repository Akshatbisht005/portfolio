import React, { useState } from 'react'
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'
import { usePortfolioData } from '../../context/PortfolioDataContext'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

export function AdminTools() {
  const { toolsStrip, refetch } = usePortfolioData()
  const [newTool, setNewTool] = useState('')
  const [saving, setSaving] = useState(false)

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTool.trim()) return
    setSaving(true)

    try {
      if (isSupabaseConfigured) {
        await supabase.from('tools_strip').insert([
          {
            name: newTool.trim(),
            sort_order: toolsStrip.length + 1,
            is_published: true,
          },
        ])
        await refetch()
      }
      setNewTool('')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      if (isSupabaseConfigured) {
        await supabase.from('tools_strip').delete().eq('id', id)
        await refetch()
      }
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Tools &amp; Platforms Strip</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          The continuous marquee strip on the public home page (Jira, Figma, Claude, ChatGPT, etc.).
        </p>
      </div>

      <form onSubmit={handleAdd} className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-3 shadow-sm">
        <input
          type="text"
          value={newTool}
          onChange={e => setNewTool(e.target.value)}
          placeholder="Add tool or framework (e.g. Postman, Mixpanel)..."
          className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        />
        <button
          type="submit"
          disabled={saving || !newTool.trim()}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-violet-600 text-xs font-semibold text-white shadow-sm hover:bg-violet-700 disabled:opacity-50"
        >
          <Plus size={16} /> Add Tool
        </button>
      </form>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
        <div className="flex flex-wrap gap-2.5">
          {toolsStrip.map(t => (
            <span
              key={t.id}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-4 py-2 text-xs font-medium text-slate-800 dark:text-slate-200 shadow-sm"
            >
              {t.name}
              <button
                type="button"
                onClick={() => handleDelete(t.id)}
                className="text-slate-400 hover:text-red-500"
                title="Remove"
              >
                <Trash2 size={13} />
              </button>
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
