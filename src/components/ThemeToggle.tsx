import { Moon, Sun } from 'lucide-react'

interface Props {
  dark: boolean
  toggle: () => void
}

export function ThemeToggle({ dark, toggle }: Props) {
  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
