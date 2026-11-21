import { motion, useReducedMotion } from 'framer-motion'
import { ReactNode } from 'react'

interface Props {
  children: ReactNode
  delay?: number
  className?: string
  direction?: 'up' | 'left' | 'right' | 'none'
}

export function ScrollReveal({ children, delay = 0, className = '', direction = 'up' }: Props) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        y: (!reduced && direction === 'up') ? 32 : 0,
        x: (!reduced && direction === 'left') ? -32 : (!reduced && direction === 'right') ? 32 : 0,
      }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
