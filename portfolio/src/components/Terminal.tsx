import { useEffect, useRef, useState } from 'react'
import { clientProjects, education, experience, featured, ownProjects, profile, roleGroups, sections } from '../data'

type Line = { kind: 'in' | 'out' | 'muted' | 'accent'; text: string }

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

const COMMANDS = ['help', 'whoami', 'roles', 'projects', 'experience', 'education', 'skills', 'contact', 'cv', 'github', 'goto', 'clear', 'winston', 'sudo hire abdul']

const banner: Line[] = [
  { kind: 'accent', text: `${profile.name} — interactive CV` },
  { kind: 'muted', text: 'Type “help” for commands. Tab completes, ↑/↓ recalls history.' },
]

type Ctx = { summon: () => void; close?: () => void }

function run(raw: string, ctx: Ctx): Line[] | 'clear' {
  const input = raw.trim()
  const cmd = input.toLowerCase()
  const out = (text: string, kind: Line['kind'] = 'out'): Line => ({ kind, text })
  const go = (id: string) => { ctx.close?.(); setTimeout(() => scrollTo(id), 80) }

  if (!cmd) return []
  if (cmd === 'clear') return 'clear'
  if (cmd === 'help') {
    return [
      out('whoami        who Abdul is'),
      out('roles         roles he fits, with proof'),
      out('projects      selected work'),
      out('experience    career so far'),
      out('education     schools'),
      out('skills        the toolkit'),
      out('contact       how to reach him'),
      out('cv / github   open the CV or GitHub'),
      out('goto <name>   jump to a section (e.g. goto work)'),
      out('winston       call the dog back'),
      out('clear         clear the screen'),
      out('…and one or two things we won’t mention.', 'muted'),
    ]
  }
  if (cmd === 'whoami') {
    return [out(profile.name, 'accent'), out(profile.headline), out(profile.intro), out(`${profile.location} · ${profile.timezone}`, 'muted')]
  }
  if (cmd === 'roles') {
    return roleGroups.flatMap((r) => [out(`▸ ${r.role}`, 'accent'), out(`  ${r.proof}`)])
  }
  if (cmd === 'projects') {
    return [featured, ...clientProjects, ...ownProjects].map((p, i) => out(`${String(i + 1).padStart(2, '0')}  ${p.title.padEnd(38)} ${p.impact}`))
  }
  if (cmd === 'experience') {
    return experience.flatMap((j) => [out(`▸ ${j.role} @ ${j.org}  (${j.period})`, 'accent'), ...j.points.map((p) => out(`  – ${p}`))])
  }
  if (cmd === 'education') {
    return education.map((e) => out(`▸ ${e.school} — ${e.detail} (${e.place}, ${e.period})`))
  }
  if (cmd === 'skills') {
    return roleGroups.map((r) => out(`${r.role.padEnd(24)} ${r.skills.join(', ')}`))
  }
  if (cmd === 'contact') {
    return [out(`email   ${profile.email}`), out(`github  ${profile.github}`), out('Type “cv” to download the CV.', 'muted')]
  }
  if (cmd === 'cv') { window.open(profile.cv, '_blank'); return [out('Opening CV…', 'muted')] }
  if (cmd === 'github') { window.open(profile.github, '_blank', 'noreferrer'); return [out('Opening GitHub…', 'muted')] }
  if (cmd === 'winston') { ctx.summon(); return [out('🐾 Woof! Winston is on his way.', 'accent')] }
  if (cmd.startsWith('goto')) {
    const name = cmd.slice(4).trim()
    const hit = sections.find((s) => s.id === name || s.label.toLowerCase() === name)
    if (!hit) return [out(`Unknown section “${name}”. Try: ${sections.map((s) => s.id).join(', ')}`, 'muted')]
    go(hit.id)
    return [out(`→ ${hit.label}`, 'muted')]
  }
  if (cmd === 'sudo hire abdul' || cmd === 'sudo hire-abdul') {
    return [
      out('[sudo] password for recruiter: ********', 'muted'),
      out('✓ Permission granted.', 'accent'),
      out('Drafting offer letter… done.'),
      out(`Next step: email ${profile.email}. Winston approves.`),
    ]
  }
  if (cmd.startsWith('sudo')) return [out('Nice try. Only one sudo command works here.', 'muted')]
  if (cmd === 'ls') return [out(sections.map((s) => s.id).join('  '))]
  if (cmd === 'exit') { ctx.close?.(); return [out('Bye!', 'muted')] }
  return [out(`command not found: ${input}. Type “help”.`, 'muted')]
}

export default function Terminal({ onSummon, onClose, overlay }: { onSummon: () => void; onClose?: () => void; overlay?: boolean }) {
  const [lines, setLines] = useState<Line[]>(banner)
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [hIdx, setHIdx] = useState(-1)
  const input = useRef<HTMLInputElement>(null)
  const body = useRef<HTMLDivElement>(null)

  useEffect(() => { if (overlay) input.current?.focus() }, [overlay])
  useEffect(() => { body.current?.scrollTo({ top: body.current.scrollHeight }) }, [lines])

  const submit = () => {
    const res = run(value, { summon: onSummon, close: onClose })
    if (res === 'clear') setLines([])
    else setLines((l) => [...l, { kind: 'in', text: value }, ...res])
    if (value.trim()) setHistory((h) => [value, ...h].slice(0, 30))
    setHIdx(-1)
    setValue('')
  }

  return (
    <div className="term" role="region" aria-label="Interactive terminal" onClick={(e) => e.stopPropagation()}>
      <div className="term-bar">
        <i /><i /><i />
        {overlay ? <button onClick={onClose}>esc to close ✕</button> : <span>zsh — abdul@portfolio</span>}
      </div>
      <div className="term-body" ref={body} onClick={() => input.current?.focus()}>
        {lines.map((l, i) => <div key={i} className={`term-line ${l.kind}`}>{l.text}</div>)}
        <div className="term-input">
          <label htmlFor={overlay ? 'term-o' : 'term-e'}>abdul@portfolio:~$</label>
          <input
            id={overlay ? 'term-o' : 'term-e'}
            ref={input}
            value={value}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="Terminal command"
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit()
              else if (e.key === 'Tab') {
                e.preventDefault()
                const hit = COMMANDS.find((c) => c.startsWith(value.toLowerCase()) && value)
                if (hit) setValue(hit)
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                const n = Math.min(hIdx + 1, history.length - 1)
                if (history[n] !== undefined) { setHIdx(n); setValue(history[n]) }
              } else if (e.key === 'ArrowDown') {
                e.preventDefault()
                const n = hIdx - 1
                setHIdx(Math.max(n, -1))
                setValue(n >= 0 ? history[n] : '')
              } else if (e.key === 'Escape') onClose?.()
            }}
          />
        </div>
      </div>
    </div>
  )
}
