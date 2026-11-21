import { Search, FileText, BarChart2, Layers, Cpu, Compass, Layout } from 'lucide-react'
import { motion, useReducedMotion } from 'framer-motion'
import { ScrollReveal } from './ScrollReveal'
import { usePortfolioData } from '../context/PortfolioDataContext'

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>> = {
  Search,
  FileText,
  BarChart2,
  Layers,
  Cpu,
  Compass,
  Layout,
}

export function WhatIDo() {
  const { whatIDo } = usePortfolioData()
  const reduced = useReducedMotion()

  return (
    <section className="py-24 px-6 bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-6xl">
        <ScrollReveal className="mb-14 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-violet-600 dark:text-violet-400">
            What I do
          </p>
          <h2 className="font-display text-4xl font-bold text-slate-900 dark:text-white">
            How I work
          </h2>
        </ScrollReveal>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {whatIDo.map((item, i) => {
            const Icon = ICON_MAP[item.icon] || Search
            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, x: reduced ? 0 : -32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                whileHover={reduced ? {} : { y: -8 }}
                className="group relative h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 cursor-default"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 group-hover:bg-violet-600 group-hover:text-white dark:group-hover:bg-violet-600 transition-colors duration-300">
                  <Icon size={22} aria-hidden="true" />
                </div>
                <h3 className="mb-3 font-semibold text-lg text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.description}</p>
              </motion.article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
