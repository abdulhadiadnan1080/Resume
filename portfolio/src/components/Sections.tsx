import { useEffect, useRef, useState, type ReactNode } from 'react'
import { AnimatePresence, animate, motion, useInView, useScroll, useTransform } from 'framer-motion'
import { Arrow, Download, GitHub, Magnetic, Plus, Reveal, ease } from './effects'
import Terminal from './Terminal'
import {
  beyond, clientProjects, concurrency, costCut, education, experience, featured, ledger,
  ownProjects, pipeline, profile, roleGroups,
} from '../data'

// Heading block on the left, empty perch for Winston on the right (or below, on mobile).
function SectionHead({ id, label, title, lede }: { id: string; label: string; title: ReactNode; lede?: ReactNode }) {
  return (
    <div className="sec-head">
      <Reveal>
        <div className="label">{label}</div>
        <h2 className="h2">{title}</h2>
        {lede && <p className="lede">{lede}</p>}
      </Reveal>
      <span className="perch" data-perch={id} />
    </div>
  )
}

// Animates a number between two values the first time it scrolls into view.
function Tween({ from, to, format }: { from: number; to: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [val, setVal] = useState(from)
  useEffect(() => {
    if (!inView) return
    const c = animate(from, to, { duration: 1.8, delay: 0.3, ease: [0.16, 1, 0.3, 1], onUpdate: setVal })
    return () => c.stop()
  }, [inView, from, to])
  return <span ref={ref}>{format(val)}</span>
}

const usd = (n: number) => `$${Math.round(n / 1000)}k`

function CostBars() {
  const pct = (costCut.after / costCut.before) * 100
  return (
    <div className="card">
      <div className="card-label">Regional migration · monthly cost</div>
      <div className="card-title">Cut by <em>51%</em>, with zero downtime.</div>
      <div className="bars">
        <div className="bar-row">
          Before
          <div className="bar"><span className="before">{usd(costCut.before)}</span></div>
        </div>
        <div className="bar-row">
          After
          <div className="bar">
            <motion.span
              className="after"
              initial={{ width: '100%' }}
              whileInView={{ width: `${pct}%` }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 1.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <Tween from={costCut.before} to={costCut.after} format={usd} />
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  )
}

function ConcurrencyDots() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [lit, setLit] = useState(concurrency.before)
  useEffect(() => {
    if (!inView) return
    const c = animate(concurrency.before, concurrency.after, { duration: 1.6, delay: 0.3, ease: 'easeOut', onUpdate: (v) => setLit(Math.round(v)) })
    return () => c.stop()
  }, [inView])

  return (
    <div className="card" ref={ref}>
      <div className="card-label">Chatbot re-architecture · concurrent users</div>
      <div className="card-title">From one user at a time to <em>{lit}</em>.</div>
      <div className="dots" aria-hidden="true">
        {Array.from({ length: concurrency.after }, (_, i) => (
          <i key={i} className={i < lit ? 'on' : ''} />
        ))}
      </div>
      <div className="dots-legend"><span>single EC2</span><span>scalable AWS on Bedrock</span></div>
    </div>
  )
}

function Seal() {
  return (
    <motion.svg className="seal" viewBox="0 0 120 120" aria-hidden="true" animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}>
      <defs>
        <path id="seal-ring" d="M60 60 m-44 0 a44 44 0 1 1 88 0 a44 44 0 1 1 -88 0" />
      </defs>
      <circle cx="60" cy="60" r="58" fill="#1e4d3a" />
      <circle cx="60" cy="60" r="53" fill="none" stroke="#c9b68e" strokeWidth="1" />
      <circle cx="60" cy="60" r="33" fill="none" stroke="#c9b68e" strokeWidth="1" />
      <text fontFamily="Inter, sans-serif" fontSize="9.2" fontWeight="600" letterSpacing="2.4" fill="#f3ede0">
        <textPath href="#seal-ring">ZERO DOWNTIME · 2-DAY CUTOVER ·</textPath>
      </text>
      <text x="60" y="71" textAnchor="middle" fontFamily="Cormorant Garamond, serif" fontSize="34" fontWeight="600" fill="#f3ede0">0</text>
    </motion.svg>
  )
}

export function Impact() {
  return (
    <section className="section" id="impact" data-section="impact">
      <div className="container">
        <SectionHead id="impact" label="The ledger" title={<>Systems that <em>cost less</em> and scale further.</>} />
        <div className="impact-grid">
          <Reveal>
            <div className="about">
              {profile.about.map((p) => <p key={p}>{p}</p>)}
            </div>
            <div className="ledger">
              <div className="ledger-title"><span>Item</span><span>Figure</span></div>
              {ledger.map((r) => (
                <div className="ledger-row" key={r.label}>
                  <span>{r.label}</span>
                  <span className="leader" />
                  <b>{r.value}</b>
                </div>
              ))}
              <div className="ledger-foot" />
            </div>
          </Reveal>
          <div className="viz-stack">
            <Reveal delay={0.05}><CostBars /></Reveal>
            <Reveal delay={0.1}><ConcurrencyDots /></Reveal>
            <Reveal delay={0.15}>
              <div className="card seal-card">
                <Seal />
                <div>
                  <div className="card-label">Production cutover</div>
                  <div className="card-title">Moved a bank backend to a new region in <em>2 days</em>, with no downtime.</div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Pipeline() {
  const [active, setActive] = useState(0)
  const node = pipeline[active]

  return (
    <section className="section" id="pipeline" data-section="pipeline">
      <div className="container">
        <SectionHead
          id="pipeline"
          label="Featured architecture"
          title={<>A bank’s default-prevention pipeline, <em>drawn out.</em></>}
          lede="88,000 users checked against bank and government policy for $1–10 a day. Select a stage to see what it does."
        />
        <Reveal>
          <div className="blueprint">
            <div className="blueprint-head">
              <span>Drawing no. 01 · Serverless GenAI pipeline</span>
              <span>88,000 users · $1–10 / day</span>
            </div>
            <div className="flow" role="tablist" aria-label="Pipeline stages">
              {pipeline.map((p, i) => (
                <div key={p.id} style={{ display: 'contents' }}>
                  <button
                    role="tab"
                    aria-selected={active === i}
                    className={`p-node${active === i ? ' active' : ''}`}
                    onClick={() => setActive(i)}
                    onPointerEnter={(e) => e.pointerType === 'mouse' && setActive(i)}
                  >
                    <div className="idx">0{i + 1}</div>
                    <div className="t">{p.title}</div>
                    <div className="s">{p.service}</div>
                  </button>
                  {i < pipeline.length - 1 && <span className="p-link"><i style={{ ['--d' as string]: `${i * 0.35}s` }} /></span>}
                </div>
              ))}
            </div>
            <div className="p-detail" role="tabpanel">
              <AnimatePresence mode="wait">
                <motion.div key={node.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25, ease }}>
                  <h4>{node.title}<span>{node.service}</span></h4>
                  <p>{node.body}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function IndexRow({ i, title, kicker, impact, summary, stack }: (typeof clientProjects)[number] & { i: number }) {
  const [open, setOpen] = useState(false)
  const hover = useRef(false)
  return (
    <div
      className={`index-row${open ? ' open' : ''}`}
      onPointerEnter={(e) => { if (e.pointerType === 'mouse') { hover.current = true; setOpen(true) } }}
      onPointerLeave={(e) => { if (e.pointerType === 'mouse' && hover.current) { hover.current = false; setOpen(false) } }}
    >
      <button className="index-btn" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span className="n">0{i + 2}</span>
        <span>
          <span className="t">{title}</span>
          <span className="k">{kicker}</span>
        </span>
        <span className="i">{impact}</span>
        <span className="plus"><Plus /></span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div className="index-body" initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.35, ease }}>
            <div>
              <p>{summary}</p>
              <div className="tags">{stack.map((s) => <span key={s} className="tag">{s}</span>)}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Work() {
  return (
    <section className="section" id="work" data-section="work">
      <div className="container">
        <SectionHead
          id="work"
          label="Selected work"
          title={<>Production systems for <em>regulated</em> industries.</>}
          lede="Client work in banking, healthcare, fintech and legal. Most of it is under NDA, so the figures do the talking."
        />

        <Reveal>
          <article className="featured">
            <div>
              <div className="kicker">{featured.kicker}</div>
              <h3>{featured.title}</h3>
              <p>{featured.summary}</p>
              <div className="tags">{featured.stack.map((s) => <span key={s} className="tag">{s}</span>)}</div>
            </div>
            <div className="featured-stat">
              <b>88,000</b>
              <span>users processed for $1–10 a day</span>
              <a href="#pipeline" className="kicker" style={{ marginTop: 14 }}>See the architecture ↑</a>
            </div>
          </article>
        </Reveal>

        <Reveal>
          <div className="index">
            {clientProjects.map((p, i) => <IndexRow key={p.title} i={i} {...p} />)}
          </div>
          <p className="nda">Client projects delivered under NDA. Details shared where permitted.</p>
        </Reveal>

        <div className="own-head">
          <h3>Own projects</h3>
          <a href={profile.github} target="_blank" rel="noreferrer">github.com/{profile.githubHandle} →</a>
        </div>
        <div className="own">
          {ownProjects.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <article className="card own-card" style={{ height: '100%' }}>
                <div className="kicker">{p.kicker}</div>
                <h4>{p.title}</h4>
                <p>{p.summary}</p>
                <div className="tags">{p.stack.map((s) => <span key={s} className="tag">{s}</span>)}</div>
                {p.link && (
                  <a className="go" href={p.link} target="_blank" rel="noreferrer">View on GitHub <Arrow /></a>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Roles() {
  const [active, setActive] = useState(0)
  const r = roleGroups[active]
  return (
    <section className="section" id="roles" data-section="roles">
      <div className="container">
        <SectionHead
          id="roles"
          label="Roles I fit"
          title={<>One engineer, <em>several chairs.</em></>}
          lede="Pick a role to see the evidence and the toolkit behind it."
        />
        <div className="roles">
          <div className="role-tabs" role="tablist" aria-label="Roles">
            {roleGroups.map((g, i) => (
              <button key={g.role} role="tab" aria-selected={active === i} className={`role-tab${active === i ? ' active' : ''}`} onClick={() => setActive(i)}>
                {g.role}
                <span>0{i + 1}</span>
              </button>
            ))}
          </div>
          <div className="role-panel" role="tabpanel">
            <AnimatePresence mode="wait">
              <motion.div key={r.role} className="card" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3, ease }}>
                <div className="card-label">Role 0{active + 1} of 0{roleGroups.length}</div>
                <h3>{r.role}</h3>
                <p className="proof">“{r.proof}”</p>
                <div className="skill-list">{r.skills.map((s) => <span key={s} className="skill">{s}</span>)}</div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Experience() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <section className="section" id="experience" data-section="experience">
      <div className="container">
        <SectionHead id="experience" label="Experience" title={<>From model QC to <em>owning production.</em></>} />
        <div className="timeline" ref={ref}>
          <div className="timeline-rail"><motion.span style={{ scaleY }} /></div>
          {experience.map((job) => (
            <Reveal key={job.role}>
              <div className="job">
                <span className="job-dot" />
                <div className="job-head">
                  <div>
                    <div className="job-role">{job.role}</div>
                    <div className="job-org">{job.org}</div>
                  </div>
                  <span className="job-period">{job.period}</span>
                </div>
                <ul>{job.points.map((pt) => <li key={pt}>{pt}</li>)}</ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Education() {
  return (
    <section className="section" id="education" data-section="education">
      <div className="container">
        <SectionHead id="education" label="Education & campus" title={<>Lahore to <em>Hong Kong.</em></>} />
        <div className="diplomas">
          {education.map((e, i) => (
            <Reveal key={e.school} delay={i * 0.08}>
              <div className="diploma" style={{ height: '100%' }}>
                <div className="place">{e.place}</div>
                <h4>{e.school}</h4>
                <p>{e.detail}</p>
                <div className="yr">{e.period}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal>
          <div className="campus">
            {beyond.map((b) => (
              <div key={b.role + b.year}>
                <b>{b.role}</b>
                <span>{b.org}</span>
                <i>{b.year}</i>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function TerminalSection({ onSummon }: { onSummon: () => void }) {
  return (
    <section className="section" id="terminal" data-section="terminal">
      <div className="container">
        <SectionHead
          id="terminal"
          label="For the curious"
          title={<>Prefer the <em>command line?</em></>}
          lede={<>Type <code>help</code> to see what’s here. It also opens anywhere with ⌘K.</>}
        />
        <Reveal>
          <Terminal onSummon={onSummon} />
        </Reveal>
      </div>
    </section>
  )
}

export function Contact() {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      window.location.href = `mailto:${profile.email}`
    }
  }

  return (
    <section className="section" id="contact" data-section="contact">
      <div className="container">
        <SectionHead id="contact" label="Contact" title={<>Let’s build <em>something real.</em></>} />
        <Reveal>
          <div className="contact-card">
            <h3>Hiring for backend, cloud <br />or <em>AI work?</em></h3>
            <p>Tell me what you’re building. I’m based in Lahore (UTC+5) and used to working across time zones.</p>
            <div className="email-pill">
              <span>{profile.email}</span>
              <button className={`copy-btn${copied ? ' done' : ''}`} onClick={copy}>{copied ? 'Copied ✓' : 'Copy'}</button>
            </div>
            <div className="contact-links">
              <Magnetic><a className="btn btn-light" href={`mailto:${profile.email}`}>Send an email</a></Magnetic>
              <Magnetic><a className="btn btn-outline-light" href={profile.github} target="_blank" rel="noreferrer"><GitHub /> GitHub</a></Magnetic>
              <Magnetic><a className="btn btn-outline-light" href={profile.cv} download><Download /> CV</a></Magnetic>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function Footer({ winstonAway, onSummon }: { winstonAway: boolean; onSummon: () => void }) {
  return (
    <footer className="footer">
      <div className="container">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        {winstonAway ? <button onClick={onSummon}>Bring Winston back</button> : <span>Guided by Winston 🐾</span>}
      </div>
    </footer>
  )
}
