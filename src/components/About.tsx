import { MapPin, Briefcase, Zap, Award } from 'lucide-react'
import { ScrollReveal } from './ScrollReveal'
import { usePortfolioData } from '../context/PortfolioDataContext'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>> = {
  MapPin,
  Briefcase,
  Zap,
  Award,
}

export function About() {
  const { settings, facts } = usePortfolioData()

  return (
    <section id="about" className="py-24 px-6 bg-white dark:bg-slate-900">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24 items-center">
          <div>
            <ScrollReveal>
              <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                Welcome
              </p>
              <h2 className="font-display mb-6 text-4xl font-bold text-slate-900 dark:text-white">
                About me
              </h2>
            </ScrollReveal>
            {settings.about_text.map((p, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <p className="mb-4 text-slate-600 dark:text-slate-400 leading-relaxed">{p}</p>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal direction="left">
            <div className="rounded-2xl bg-gradient-to-br from-violet-50 to-slate-50 dark:from-violet-950/40 dark:to-slate-900 border border-violet-100 dark:border-violet-900/30 p-8 shadow-sm">
              <h3 className="font-display mb-6 text-xl font-bold text-slate-900 dark:text-white">
                Quick facts
              </h3>
              <ul className="space-y-5">
                {facts.map((fact) => {
                  const Icon = ICON_MAP[fact.icon_key] || MapPin
                  return (
                    <li key={fact.id} className="flex items-start gap-4">
                      <span className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400">
                        <Icon size={16} aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                          {fact.label}
                        </p>
                        <p className="font-medium text-slate-800 dark:text-slate-200">{fact.value}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
