import React, { useState } from 'react'
import { Plus, Trash2, X } from 'lucide-react'
import { usePortfolioData } from '../../context/PortfolioDataContext'
import { supabase, isSupabaseConfigured } from '../../lib/supabase'

export function AdminSkills() {
  const { skillGroups, refetch } = usePortfolioData()
  const [newGroupName, setNewGroupName] = useState('')
  const [newGroupLevel, setNewGroupLevel] = useState('Strong')
  const [newSkillName, setNewSkillName] = useState('')
  const [selectedGroup, setSelectedGroup] = useState<string>('')
  const [saving, setSaving] = useState(false)

  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGroupName.trim()) return
    setSaving(true)

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('skill_groups').insert([
          {
            group_name: newGroupName.trim(),
            level_label: newGroupLevel,
            sort_order: skillGroups.length + 1,
            is_published: true,
          },
        ])
        if (error) throw error
        await refetch()
      }
      setNewGroupName('')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteGroup = async (id: string, name: string) => {
    if (!confirm(`Delete group "${name}" and all its skills?`)) return
    try {
      if (isSupabaseConfigured) {
        await supabase.from('skill_groups').delete().eq('id', id)
        await refetch()
      }
    } catch (err: any) {
      alert(err.message)
    }
  }

  const handleAddSkill = async (groupId: string) => {
    if (!newSkillName.trim()) return
    setSaving(true)

    try {
      if (isSupabaseConfigured) {
        const { error } = await supabase.from('skills').insert([
          {
            group_id: groupId,
            name: newSkillName.trim(),
            level_label: 'Proficient',
            sort_order: 10,
            is_published: true,
          },
        ])
        if (error) throw error
        await refetch()
      }
      setNewSkillName('')
      setSelectedGroup('')
    } catch (err: any) {
      alert(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteSkill = async (skillId: string) => {
    try {
      if (isSupabaseConfigured) {
        await supabase.from('skills').delete().eq('id', skillId)
        await refetch()
      }
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Skills &amp; Toolkits</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Group your skills into categories with proficiency labels (Strong, Proficient, Familiar).
        </p>
      </div>

      {/* Add New Group Card */}
      <form onSubmit={handleAddGroup} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center gap-3 shadow-sm">
        <input
          type="text"
          value={newGroupName}
          onChange={e => setNewGroupName(e.target.value)}
          placeholder="New group name (e.g. AI &amp; LLM Tools)..."
          className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
        />
        <select
          value={newGroupLevel}
          onChange={e => setNewGroupLevel(e.target.value)}
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none"
        >
          <option value="Strong">Strong (100% bar)</option>
          <option value="Proficient">Proficient (75% bar)</option>
          <option value="Familiar">Familiar (50% bar)</option>
        </select>
        <button
          type="submit"
          disabled={saving || !newGroupName.trim()}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-violet-600 text-xs font-semibold text-white shadow-sm hover:bg-violet-700 disabled:opacity-50"
        >
          <Plus size={16} /> Add Group
        </button>
      </form>

      {/* Groups List */}
      <div className="space-y-6">
        {skillGroups.map(group => (
          <div key={group.id} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-base text-slate-900 dark:text-white">{group.group_name}</h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300">
                  {group.level_label}
                </span>
              </div>
              <button
                onClick={() => handleDeleteGroup(group.id, group.group_name)}
                className="text-xs text-red-500 hover:text-red-700 flex items-center gap-1"
              >
                <Trash2 size={13} /> Delete group
              </button>
            </div>

            {/* Skills chips */}
            <div className="flex flex-wrap gap-2 py-4">
              {(group.skills || []).map(skill => (
                <span
                  key={skill.id}
                  className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300"
                >
                  {skill.name}
                  <button
                    onClick={() => handleDeleteSkill(skill.id)}
                    className="text-slate-400 hover:text-red-500 rounded-full"
                    title="Remove skill"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>

            {/* Quick add skill input */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
              <input
                type="text"
                placeholder={`Add skill to ${group.group_name}...`}
                value={selectedGroup === group.id ? newSkillName : ''}
                onFocus={() => setSelectedGroup(group.id)}
                onChange={e => {
                  setSelectedGroup(group.id)
                  setNewSkillName(e.target.value)
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddSkill(group.id)
                  }
                }}
                className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
              <button
                type="button"
                onClick={() => handleAddSkill(group.id)}
                className="px-3 py-1.5 rounded-lg bg-slate-200 dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-violet-600 hover:text-white transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
