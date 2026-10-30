import type { CSSProperties } from 'react'
import { skillGroups } from '../data/skills'
import { useReveal } from '../hooks/useReveal'
import SectionHead from './SectionHead'

export default function Skills() {
  const ref = useReveal<HTMLDivElement>()

  return (
    <section id="skills" className="scroll-mt-24">
      <div ref={ref} className="reveal mx-auto max-w-[1200px] px-6 py-20 sm:px-8 sm:py-28">
        <SectionHead
          no="02"
          title="技能"
          en="SKILLS"
          lead="以「能用它做出东西」为准绳的自我评估。细线长度代表实践深度，不代表知识边界。"
        />

        <div className="mt-12 grid gap-x-12 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, gi) => (
            <div key={group.category} className="border-t border-line pt-5">
              <div className="flex items-baseline justify-between">
                <h3 className="font-serif text-lg text-ink">{group.category}</h3>
                <span className="font-mono text-[11px] text-mute">{String(gi + 1).padStart(2, '0')}</span>
              </div>
              <ul className="mt-5 space-y-5">
                {group.skills.map((s, si) => (
                  <li key={s.name} className="skill-item" data-accent={si === 0 ? '1' : '0'}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[13.5px] text-ink-2">{s.name}</span>
                      <span className="font-mono text-[11px] tabular-nums text-mute">{s.level}</span>
                    </div>
                    <div className="skill-track mt-2 overflow-hidden">
                      <div
                        className="skill-fill"
                        style={{ '--w': `${s.level}%`, transitionDelay: `${gi * 90 + si * 70}ms` } as CSSProperties}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}