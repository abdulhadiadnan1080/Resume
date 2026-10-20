import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Hero from './components/Hero'
import Guide from './components/Guide'
import { Loader, Nav, ScrollProgress, TerminalOverlay, firstVisit } from './components/Chrome'
import { Contact, Education, Experience, Footer, Impact, Pipeline, Roles, TerminalSection, Work } from './components/Sections'

const AWAY = 'winston-away'

function readAway() {
  try { return localStorage.getItem(AWAY) === '1' } catch { return false }
}

export default function App() {
  const [loading, setLoading] = useState(firstVisit)
  const [terminal, setTerminal] = useState(false)
  const [away, setAway] = useState(readAway)
  const done = useCallback(() => setLoading(false), [])

  const setWinston = (isAway: boolean) => {
    setAway(isAway)
    try { localStorage.setItem(AWAY, isAway ? '1' : '0') } catch { /* storage blocked */ }
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement).closest('input, textarea')
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setTerminal((t) => !t)
      } else if (e.key === '`' && !typing) {
        e.preventDefault()
        setTerminal(true)
      } else if (e.key === 'Escape') setTerminal(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <AnimatePresence>{loading && <Loader onDone={done} />}</AnimatePresence>
      <ScrollProgress />
      <Nav onTerminal={() => setTerminal(true)} />
      <TerminalOverlay open={terminal} onClose={() => setTerminal(false)} onSummon={() => setWinston(false)} />
      <main>
        <Hero ready={!loading} />
        <Impact />
        <Pipeline />
        <Work />
        <Roles />
        <Experience />
        <Education />
        <TerminalSection onSummon={() => setWinston(false)} />
        <Contact />
      </main>
      <Footer winstonAway={away} onSummon={() => setWinston(false)} />
      {!loading && <Guide away={away} onDismiss={() => setWinston(true)} />}
    </>
  )
}
