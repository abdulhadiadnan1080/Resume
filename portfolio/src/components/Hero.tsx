import { useCallback, useEffect, useRef } from 'react'
import { animate, motion, useMotionValue } from 'framer-motion'
import { Arrow, Download, Magnetic, ease } from './effects'
import { profile } from '../data'

// Where each role plaque sits around the oval portrait on desktop.
const plaqueSpots = [
  { top: '4%', left: '2%' },
  { top: '30%', right: '-8%' },
  { top: '56%', left: '-10%' },
  { bottom: '12%', right: '-4%' },
  { bottom: '-1%', left: '14%' },
]

// The photo as a two-sided coin: duotone on the front, original colour on the back.
// Each toss spins one and a half turns so it lands on the other face, then rests.
const REST_MS = 4200
const SPIN_S = 1.6

function Coin({ ready }: { ready: boolean }) {
  const rotateY = useMotionValue(0)
  const spinning = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout>>()

  const toss = useCallback(() => {
    if (spinning.current) return
    spinning.current = true
    clearTimeout(timer.current)
    animate(rotateY, rotateY.get() + 540, { duration: SPIN_S, ease: [0.45, 0, 0.2, 1] }).then(() => {
      spinning.current = false
      timer.current = setTimeout(toss, REST_MS)
    })
  }, [rotateY])

  useEffect(() => {
    if (!ready || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    timer.current = setTimeout(toss, 2400)
    return () => clearTimeout(timer.current)
  }, [ready, toss])

  return (
    <div className="portrait-oval" onClick={toss} data-cursor role="img" aria-label={`Portrait of ${profile.name}`}>
      <motion.div className="coin" style={{ rotateY }}>
        <div className="coin-face">
          <img src={profile.photoDuo} alt="" width={512} height={512} />
        </div>
        <div className="coin-face coin-back">
          <img src={profile.photo} alt="" width={512} height={512} />
        </div>
      </motion.div>
    </div>
  )
}

function Portrait({ ready }: { ready: boolean }) {
  return (
    <motion.div
      className="portrait-wrap"
      initial={{ opacity: 0, y: 20 }}
      animate={ready ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 1.1, delay: 0.25, ease }}
    >
      <div className="portrait">
      <Coin ready={ready} />

      {/* ornamental frame: double oval, beaded ring and four compass flourishes */}
      <svg className="portrait-frame" viewBox="0 0 400 432" aria-hidden="true">
        <ellipse cx="200" cy="220" rx="140" ry="178" fill="none" stroke="#a8925f" strokeWidth="2.5" />
        <ellipse cx="200" cy="220" rx="150" ry="188" fill="none" stroke="#c9b68e" strokeWidth="1" />
        <ellipse cx="200" cy="220" rx="158" ry="196" fill="none" stroke="#c9b68e" strokeWidth="3" strokeDasharray="0.1 9" strokeLinecap="round" />
        {[
          [200, 24, 0],
          [358, 220, 90],
          [200, 416, 180],
          [42, 220, 270],
        ].map(([x, y, r]) => (
          <g key={r} transform={`translate(${x} ${y}) rotate(${r})`}>
            <path d="M0 -10 L6 0 L0 10 L-6 0 Z" fill="#1e4d3a" />
            <circle r="2" fill="#f3ede0" />
          </g>
        ))}
      </svg>
      <p className="portrait-caption">Click to toss</p>
      </div>

      <div className="plaques">
        {profile.roles.map((role, i) => (
          <motion.span
            key={role}
            className="plaque"
            style={plaqueSpots[i]}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={ready ? { opacity: 1, scale: 1, y: [0, -5, 0] } : {}}
            transition={{
              opacity: { delay: 0.7 + i * 0.12, duration: 0.6 },
              scale: { delay: 0.7 + i * 0.12, duration: 0.6, ease },
              y: { delay: 1.5 + i * 0.4, duration: 5, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            {role}
          </motion.span>
        ))}
      </div>
    </motion.div>
  )
}

function Word({ text, delay, italic }: { text: string; delay: number; italic?: boolean }) {
  const Tag = italic ? 'em' : 'span'
  return (
    <span className="line">
      <motion.span className="word" initial={{ y: '105%' }} animate={{ y: '0%' }} transition={{ duration: 1, delay, ease }}>
        <Tag>{text}</Tag>
      </motion.span>
    </span>
  )
}

export default function Hero({ ready }: { ready: boolean }) {
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 14 },
    animate: ready ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.9, delay, ease },
  })

  return (
    <header className="hero" id="top" data-section="top">
      <div className="hero-bg" aria-hidden="true">
        <svg viewBox="0 0 900 900">
          {Array.from({ length: 9 }, (_, i) => (
            <circle key={i} cx="450" cy="450" r={120 + i * 40} fill="none" stroke="#c9b68e" strokeWidth="0.8" strokeDasharray={i % 2 ? '2 6' : undefined} />
          ))}
        </svg>
      </div>

      <div className="container hero-inner">
        <div>
          <motion.div className="hero-meta" {...fade(0.05)}>
            <span><i /> {profile.location}</span>
            <span>{profile.timezone}</span>
            <span>Est. 2021</span>
          </motion.div>

          <h1 className="hero-name" aria-label={profile.name}>
            {ready && (
              <>
                <Word text="Abdul Hadi" delay={0.1} />
                <Word text="Adnan" delay={0.25} italic />
              </>
            )}
          </h1>

          <motion.p className="hero-headline" {...fade(0.55)}>{profile.headline}</motion.p>
          <motion.p className="hero-intro" {...fade(0.65)}>{profile.intro}</motion.p>

          <motion.div className="hero-cta" {...fade(0.75)}>
            <Magnetic>
              <a className="btn btn-primary" href="#work">See the work <Arrow /></a>
            </Magnetic>
            <Magnetic>
              <a className="btn btn-ghost" href={profile.cv} download><Download /> Download CV</a>
            </Magnetic>
          </motion.div>

          <span className="perch" data-perch="top" />
        </div>

        <Portrait ready={ready} />
      </div>
    </header>
  )
}
