import type { CSSProperties } from 'react'
import { skillGroups } from '../data/skills'
import { useReveal } from '../hooks/useReveal'

export default function Skills() {
  const ref = useReveal<HTMLDivElement>()

  return (
    <section id="skills" className="mx-auto max-w-[1180px] scroll-mt-24 px-5 py-24">
      <div ref={ref} className="reveal">
        <p className="font-mono text-xs text-teal">// 02</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-mist sm:text-4xl">
          skills<span className="text-teal">()</span>
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-mute">
          以「能用它做出东西」为准绳的自我评估。熟练度条代表实践深度，不代表知识边界。
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group, gi) => (
            <div key={group.category} className="neon-card p-6">
              <div className="flex items-center gap-2">
                <span className="text-xl">{group.icon}</span>
                <h3 className="font-mono text-sm font-semibold text-mist">{group.category}</h3>
              </div>
              <ul className="mt-5 space-y-4">
                {group.skills.map((s, si) => (
                  <li key={s.name}>
                    <div className="flex items-baseline justify-between gap-3">
                      <span className="text-[13px] text-mist/90">{s.name}</span>
                      <span className="font-mono text-[11px] text-mute">{s.level}%</span>
                    </div>
                    <div className="skill-track mt-1.5 h-1.5 overflow-hidden rounded-full">
                      <div
                        className="skill-fill h-full rounded-full bg-gradient-to-r from-teal to-violet"
                        style={{ '--w': `${s.level}%`, transitionDelay: `${gi * 80 + si * 60}ms` } as CSSProperties}
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
