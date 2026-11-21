import { ScrollReveal } from './ScrollReveal'
import { usePortfolioData } from '../context/PortfolioDataContext'

export function ToolsStrip() {
  const { toolsStrip } = usePortfolioData()
  const doubled = [...toolsStrip, ...toolsStrip]

  return (
    <section
      className="py-16 px-6 bg-slate-50 dark:bg-slate-950 overflow-hidden border-y border-slate-200 dark:border-slate-800"
      aria-label="Tools and platforms"
    >
      <div className="mx-auto max-w-6xl mb-8">
        <ScrollReveal className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            Tools &amp; platforms
          </p>
        </ScrollReveal>
      </div>

      <div className="relative">
        <div className="marquee-track gap-3 px-3" aria-hidden="true">
          {doubled.map((tool, i) => (
            <span
              key={`${tool.id}-${i}`}
              className="inline-flex flex-shrink-0 items-center rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-5 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 shadow-sm hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400 hover:scale-105 transition-all duration-200 cursor-default mx-1.5"
            >
              {tool.name}
            </span>
          ))}
        </div>
      </div>

      <ul className="sr-only">
        {toolsStrip.map(t => (
          <li key={t.id}>{t.name}</li>
        ))}
      </ul>
    </section>
  )
}
