import { usePortfolioData } from '../context/PortfolioDataContext'
import { Mail } from 'lucide-react'
import { LinkedinIcon } from './icons/LinkedinIcon'

export function Footer() {
  const { settings } = usePortfolioData()

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-8">
      <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">{settings.footer_text}</p>
        <div className="flex items-center gap-4">
          <a
            href={`mailto:${settings.email}`}
            aria-label="Send email"
            className="text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            <Mail size={18} aria-hidden="true" />
          </a>
          <a
            href={settings.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
          >
            <LinkedinIcon size={18} aria-hidden={true} />
          </a>
        </div>
      </div>
    </footer>
  )
}
