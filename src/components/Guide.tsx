import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion'
import { guide, sections, winstonFacts } from '../data'

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

type Spot = { x: number; y: number; w: number; h: number }

// Finds the empty perch slot a section reserved for Winston, in document coordinates.
function perchFor(id: string): Spot | null {
  const el = document.querySelector<HTMLElement>(`[data-perch="${id}"]`)
  if (!el) return null
  const r = el.getBoundingClientRect()
  if (!r.width || !r.height) return null
  return { x: r.left + window.scrollX, y: r.top + window.scrollY, w: r.width, h: r.height }
}

function Dog({ pupil, blink, facing }: { pupil: { x: number; y: number }; blink: boolean; facing: 'left' | 'right' }) {
  const body = '#9a5a34'
  const dark = '#6b3a20'
  return (
    <svg viewBox="0 0 140 84" aria-hidden="true">
      <g className={`facing ${facing}`}>
        <path className="tail-wag" d="M21 44 Q7 39 5 25" stroke={body} strokeWidth="5.5" strokeLinecap="round" fill="none" />
        <rect x="30" y="52" width="8" height="24" rx="4" fill={dark} />
        <rect x="92" y="52" width="8" height="24" rx="4" fill={dark} />
        <g className="breathe">
          <rect x="16" y="34" width="98" height="29" rx="14.5" fill={body} />
          <path d="M32 57 Q66 67 102 57 L102 61 Q66 71 32 61 Z" fill="#c28a5c" />
        </g>
        <rect x="39" y="54" width="9" height="24" rx="4.5" fill={body} />
        <rect x="101" y="54" width="9" height="24" rx="4.5" fill={body} />
        <ellipse cx="43.5" cy="78" rx="6" ry="3" fill={dark} />
        <ellipse cx="105.5" cy="78" rx="6" ry="3" fill={dark} />
        {/* head */}
        <ellipse cx="112" cy="29" rx="15" ry="14" fill={body} />
        <path d="M114 21 Q132 21 137 30 Q139 38 130 40 L116 40 Z" fill={body} />
        <ellipse cx="136.2" cy="30.5" rx="3.4" ry="3" fill="#1c1a17" />
        <path d="M124 37.5 Q128 39.5 132 37.5" stroke="#4a2814" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        {/* eye */}
        <ellipse cx="118" cy="25" rx="4.3" ry="4.5" fill="#fffaf0" />
        <circle cx={118 + pupil.x} cy={25 + pupil.y} r="2.5" fill="#1c1a17" />
        <circle cx={119 + pupil.x} cy={24 + pupil.y} r="0.8" fill="#fff" />
        {blink && <ellipse cx="118" cy="25" rx="4.6" ry="4.8" fill={body} />}
        <path d="M113.5 19.5 Q118 17.5 122.5 19.5" stroke="#4a2814" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        {/* ear */}
        <path className="ear-flop" d="M104 17 Q94 19 94 33 Q95 46 102 46 Q108 44 107 31 Q107 23 104 17 Z" fill={dark} />
        {/* racing-green scarf */}
        <path d="M95 31 Q104 41 117 40 L117 47 Q103 49 94 39 Z" fill="#1e4d3a" />
        <path d="M100 41 L93 60 L100.5 59 L106 44 Z" fill="#1e4d3a" />
        <path d="M104.5 43 L105 62 L111 59 L109 44 Z" fill="#2a6a50" />
        <path d="M96.5 52 L102.5 53 M104.8 53 L110.2 52" stroke="#c9b68e" strokeWidth="1.2" />
      </g>
    </svg>
  )
}

export default function Guide({ away, onDismiss }: { away: boolean; onDismiss: () => void }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const opacity = useMotionValue(0)
  const sx = useMotionValue(1)
  const sy = useMotionValue(1)
  const [size, setSize] = useState({ w: 300, h: 196 })
  const [active, setActive] = useState('top')
  const [facing, setFacing] = useState<'left' | 'right'>('right')
  const [jumping, setJumping] = useState(false)
  const [fact, setFact] = useState<string | null>(null)
  const [pupil, setPupil] = useState({ x: 0, y: 0 })
  const [blink, setBlink] = useState(false)
  const placed = useRef(false)
  const jumpingRef = useRef(false)
  const eye = useRef<HTMLDivElement>(null)
  const facingRef = useRef(facing)
  facingRef.current = facing

  // Which section is in the middle band of the viewport.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive((e.target as HTMLElement).dataset.section!)),
      { rootMargin: '-38% 0px -52% 0px' },
    )
    document.querySelectorAll('[data-section]').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const restFacing = (s: Spot) => (s.x + s.w / 2 > window.innerWidth / 2 && window.innerWidth > 860 ? 'left' : 'right')

  // Move to the active perch: an arc jump when the section changes, a snap on layout changes.
  const goTo = useCallback((id: string, jump: boolean) => {
    const s = perchFor(id)
    if (!s) return
    setSize({ w: s.w, h: s.h })
    if (!placed.current || !jump) {
      if (jumpingRef.current) return
      x.set(s.x); y.set(s.y)
      if (!placed.current) { placed.current = true; animate(opacity, 1, { duration: 0.5 }) }
      setFacing(restFacing(s))
      return
    }
    const x0 = x.get(), y0 = y.get()
    if (Math.abs(x0 - s.x) < 1 && Math.abs(y0 - s.y) < 1) return

    jumpingRef.current = true
    setJumping(true)
    setFact(null)
    const done = () => { jumpingRef.current = false; setJumping(false); setFacing(restFacing(s)) }

    if (reduced()) {
      animate(opacity, 0, { duration: 0.2 }).then(() => {
        x.set(s.x); y.set(s.y)
        animate(opacity, 1, { duration: 0.3 }).then(done)
      })
      return
    }

    setFacing(s.x < x0 - 4 ? 'left' : 'right')
    const dist = Math.hypot(s.x - x0, s.y - y0)
    const duration = Math.min(1.3, 0.65 + dist / 3000)
    const peak = Math.min(y0, s.y) - Math.min(180, 70 + dist / 8)
    animate(sy, [1, 0.8, 1.12, 1, 0.84, 1], { duration: duration + 0.25, times: [0, 0.12, 0.3, 0.82, 0.92, 1] })
    animate(sx, [1, 1.12, 0.92, 1, 1.12, 1], { duration: duration + 0.25, times: [0, 0.12, 0.3, 0.82, 0.92, 1] })
    animate(x, [x0, x0, s.x], { duration: duration + 0.1, times: [0, 0.1, 1], ease: 'easeInOut' })
    animate(y, [y0, y0, peak, s.y], { duration: duration + 0.1, times: [0, 0.1, 0.5, 1], ease: ['linear', 'easeOut', 'easeIn'] }).then(done)
  }, [opacity, sx, sy, x, y])

  useEffect(() => { if (!away) goTo(active, true) }, [active, away, goTo])

  // Keep him on his perch when fonts load, sections expand or the window resizes.
  useEffect(() => {
    const snap = () => goTo(active, false)
    const ro = new ResizeObserver(snap)
    ro.observe(document.body)
    window.addEventListener('resize', snap)
    document.fonts?.ready.then(snap)
    return () => { ro.disconnect(); window.removeEventListener('resize', snap) }
  }, [active, goTo])

  // Eyes follow the cursor; on touch screens they glance in the scroll direction.
  useEffect(() => {
    let raf = 0
    const look = (cx: number, cy: number) => {
      const el = eye.current
      if (!el) return
      const r = el.getBoundingClientRect()
      let dx = cx - (r.left + r.width / 2)
      const dy = cy - (r.top + r.height / 2)
      if (facingRef.current === 'left') dx = -dx
      const a = Math.atan2(dy, dx)
      const m = Math.min(1.7, Math.hypot(dx, dy) / 60)
      setPupil({ x: Math.cos(a) * m, y: Math.sin(a) * m })
    }
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => look(e.clientX, e.clientY))
    }
    let lastY = window.scrollY
    let t: ReturnType<typeof setTimeout>
    const onScroll = () => {
      if (window.matchMedia('(hover: hover)').matches) return
      setPupil({ x: 0.6, y: window.scrollY > lastY ? 1.6 : -1.6 })
      lastY = window.scrollY
      clearTimeout(t)
      t = setTimeout(() => setPupil({ x: 0, y: 0 }), 500)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('pointermove', onMove); window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  // Blink every few seconds.
  useEffect(() => {
    if (reduced()) return
    let t: ReturnType<typeof setTimeout>
    const loop = () => {
      t = setTimeout(() => { setBlink(true); setTimeout(() => setBlink(false), 140); loop() }, 3000 + Math.random() * 3000)
    }
    loop()
    return () => clearTimeout(t)
  }, [])

  const order = sections.map((s) => s.id)
  const idx = order.indexOf(active)
  const nextId = order[idx + 1]
  const next = () => {
    const target = nextId ?? 'top'
    document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' })
  }
  const pet = () => {
    setFact(winstonFacts[Math.floor(Math.random() * winstonFacts.length)])
    if (!reduced()) animate(y, [y.get(), y.get() - 22, y.get()], { duration: 0.4, ease: 'easeOut' })
  }

  if (away) return null

  return (
    <div className="guide-layer" aria-live="polite">
      <motion.div className="winston" style={{ x, y, opacity, width: size.w, height: size.h }}>
        <AnimatePresence>
          {!jumping && (
            <motion.div
              key={fact ?? active}
              className="bubble"
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.12 } }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              <div className="bubble-name">Winston</div>
              <div>{fact ?? guide[active]}</div>
              <div className="bubble-actions">
                <button onClick={next}>{nextId ? 'Next →' : 'Tour again ↺'}</button>
                <button className="x" onClick={onDismiss} aria-label="Dismiss Winston">hide ✕</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          ref={eye}
          className="winston-dog"
          style={{ scaleX: sx, scaleY: sy }}
          onClick={pet}
          role="button"
          aria-label="Pet Winston"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && pet()}
        >
          <Dog pupil={pupil} blink={blink} facing={facing} />
        </motion.div>
      </motion.div>
    </div>
  )
}
