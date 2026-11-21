import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react'

interface Props {
  items: string[]
  onChange: (items: string[]) => void
  placeholder?: string
  label?: string
}

export function BulletListEditor({ items, onChange, placeholder = 'Add bullet item...', label = 'Bullet Points' }: Props) {
  const handleAdd = () => {
    onChange([...items, ''])
  }

  const handleUpdate = (idx: number, val: string) => {
    const updated = [...items]
    updated[idx] = val
    onChange(updated)
  }

  const handleRemove = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx))
  }

  const handleMove = (idx: number, dir: 'up' | 'down') => {
    const targetIdx = dir === 'up' ? idx - 1 : idx + 1
    if (targetIdx < 0 || targetIdx >= items.length) return
    const updated = [...items]
    const temp = updated[idx]
    updated[idx] = updated[targetIdx]
    updated[targetIdx] = temp
    onChange(updated)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</label>
        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center gap-1 text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline"
        >
          <Plus size={14} /> Add bullet
        </button>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-slate-400 italic py-2">No bullets added yet. Click &quot;Add bullet&quot; above.</p>
      ) : (
        <div className="space-y-2">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono w-5 text-right">{idx + 1}.</span>
              <input
                type="text"
                value={item}
                onChange={e => handleUpdate(idx, e.target.value)}
                placeholder={placeholder}
                className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, 'up')}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                  title="Move up"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  disabled={idx === items.length - 1}
                  onClick={() => handleMove(idx, 'down')}
                  className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                  title="Move down"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  className="p-1.5 text-red-400 hover:text-red-600"
                  title="Delete bullet"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
