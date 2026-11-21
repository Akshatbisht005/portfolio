import { useEffect, useState } from 'react'

export function useScrollSpy(ids: string[], offset = 80) {
  const [active, setActive] = useState('')

  useEffect(() => {
    const handler = () => {
      const y = window.scrollY + offset
      let cur = ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= y) cur = id
      }
      setActive(cur)
    }

    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [ids, offset])

  return active
}
