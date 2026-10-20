import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useScroll, useSpring } from 'framer-motion'
import { sections } from '../data'
import Terminal from './Terminal'
import { Crest, ease } from './effects'

const VISITED = 'aha-visited'

export function firstVisit() {
  try {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
    return !localStorage.getItem(VISITED)
  } catch {
    return false
  }
}

// Wax-seal intro, shown once per browser.
export function Loader({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    try { localStorage.setItem(VISITED, '1') } catch { /* storage blocked */ }
    const t = setTimeout(onDone, 900)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <motion.div className="loader" exit={{ opacity: 0, transition: { duration: 0.5, ease } }}>
      <motion.div initial={{ scale: 1.6, opacity: 0, rotate: -20 }} animate={{ scale: 1, opacity: 1, rotate: 0 }} transition={{ duration: 0.6, ease }}>
        <Crest className="seal-mark" />
      </motion.div>
    </motion.div>
  )
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24 })
  return <motion.div className="progress" style={{ scaleX }} />
}

export function Nav({ onTerminal }: { onTerminal: () => void }) {
  const [active, setActive] = useState('')

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' },
    )
    document.querySelectorAll('[data-section]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <motion.nav className="nav" initial={{ y: -70, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, delay: 0.1, ease }}>
      <a href="#top" className="crest" aria-label="Back to top">
        <Crest /> <span>Abdul Hadi Adnan</span>
      </a>
      <div className="nav-links">
        {sections.filter((s) => s.nav).map((s) => (
          <a key={s.id} href={`#${s.id}`} className={active === s.id ? 'active' : ''}>{s.label}</a>
        ))}
      </div>
      <button className="nav-term" onClick={onTerminal} aria-label="Open terminal">
        Terminal <kbd>⌘K</kbd>
      </button>
    </motion.nav>
  )
}

export function TerminalOverlay({ open, onClose, onSummon }: { open: boolean; onClose: () => void; onSummon: () => void }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="term-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.div
            style={{ width: '100%', maxWidth: 720 }}
            role="dialog"
            aria-modal="true"
            aria-label="Terminal"
            initial={{ y: -14, scale: 0.98 }}
            animate={{ y: 0, scale: 1 }}
            exit={{ y: -8, scale: 0.98 }}
            transition={{ duration: 0.22, ease }}
          >
            <Terminal overlay onClose={onClose} onSummon={onSummon} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
