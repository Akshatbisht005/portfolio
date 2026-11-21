import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function Preloader() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setVisible(false), 1400)
    return () => clearTimeout(t)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950"
          aria-label="Loading"
          aria-live="polite"
        >
          {/* Animated pulse rings */}
          <div className="relative flex items-center justify-center">
            <span className="absolute h-20 w-20 rounded-full bg-violet-600/30 animate-pulse_ring" aria-hidden="true" />
            <span
              className="absolute h-20 w-20 rounded-full bg-violet-600/20 animate-pulse_ring"
              style={{ animationDelay: '0.5s' }}
              aria-hidden="true"
            />
            <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-violet-700 shadow-2xl shadow-violet-900/60">
              <span className="font-display text-2xl font-bold text-white">RR</span>
            </div>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-6 text-xs font-semibold uppercase tracking-widest text-slate-400"
          >
            Rohit Rawat
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
