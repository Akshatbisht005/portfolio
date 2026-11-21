import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { useScrollSpy } from '../hooks/useScrollSpy'

const NAV = [
  { label: 'Welcome', id: 'welcome' },
  { label: 'Curriculum', id: 'curriculum' },
  { label: 'Portfolio', id: 'portfolio' },
  { label: 'Contact', id: 'contact' },
]

interface Props {
  dark: boolean
  toggleTheme: () => void
}

export function Navbar({ dark, toggleTheme }: Props) {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const active = useScrollSpy(NAV.map(n => n.id))

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const nav = (id: string) => {
    setOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ease-in-out ${
        scrolled
          ? 'bg-white/95 dark:bg-slate-950/95 backdrop-blur-md shadow-sm border-b border-slate-200/60 dark:border-slate-800/60 py-0'
          : 'bg-transparent py-2'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4" aria-label="Main navigation">
        <a
          href="#welcome"
          onClick={e => {
            e.preventDefault()
            nav('welcome')
          }}
          className="font-display text-xl font-bold transition-colors duration-500"
        >
          <span className={scrolled ? 'text-slate-900 dark:text-white' : 'text-white'}>RR</span>
        </a>

        <ul className="hidden md:flex items-center gap-1">
          {NAV.map(item => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={e => {
                  e.preventDefault()
                  nav(item.id)
                }}
                aria-current={active === item.id ? 'page' : undefined}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  active === item.id
                    ? 'bg-violet-600 text-white'
                    : scrolled
                    ? 'text-slate-600 dark:text-slate-300 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/20'
                    : 'text-white/90 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle dark={dark} toggle={toggleTheme} />
          <button
            className="md:hidden rounded-full p-2 transition-colors"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen(o => !o)}
          >
            <span className={scrolled ? 'text-slate-600 dark:text-slate-300' : 'text-white'}>
              {open ? <X size={20} /> : <Menu size={20} />}
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800"
          >
            <ul className="px-6 py-4 flex flex-col gap-1">
              {NAV.map(item => (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={e => {
                      e.preventDefault()
                      nav(item.id)
                    }}
                    className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      active === item.id
                        ? 'bg-violet-600 text-white'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-violet-50 dark:hover:bg-violet-900/20'
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
