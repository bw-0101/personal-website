import { useState } from 'react'
import { projects, type Project } from '../data/projects'
import { useReveal } from '../hooks/useReveal'

export default function Projects() {
  const ref = useReveal<HTMLDivElement>()
  const [selected, setSelected] = useState<Project | null>(null)

  return (
    <section id="projects" className="mx-auto max-w-[1180px] scroll-mt-24 px-5 py-24">
      <div ref={ref} className="reveal">
        <p className="font-mono text-xs text-teal">// 03</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-mist sm:text-4xl">
          projects<span className="text-teal">()</span>
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-mute">
          一些把「想法 → 文档 → 代码 → 上线」走通的作品。点击卡片查看详情。
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p)}
              className="neon-card group rounded-xl p-6 text-left"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-mute">{p.date}</span>
                <span className="font-mono text-xs text-teal/0 transition-colors group-hover:text-teal">more →</span>
              </div>
              <h3 className="mt-3 font-display text-xl font-semibold text-mist transition-colors group-hover:text-teal">
                {p.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-mute">{p.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="rounded border border-teal/25 bg-teal/5 px-2 py-0.5 font-mono text-[11px] text-teal/90">
                    {t}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 详情弹层 */}
      {selected && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/70 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
        >
          <div
            className="max-h-[86vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-teal/20 bg-ink-2 p-6 sm:rounded-2xl sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-mute">{selected.date}</p>
                <h3 className="mt-2 font-display text-2xl font-bold text-mist">{selected.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="关闭详情"
                className="rounded-md border border-white/10 p-2 text-mute transition-colors hover:border-teal/50 hover:text-teal"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M4 4l8 8M12 4L4 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <p className="mt-4 text-[15px] leading-7 text-mist/90">{selected.desc}</p>

            <div className="mt-6">
              <h4 className="font-mono text-xs text-amber">tech stack</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {selected.tech.map((t) => (
                  <span key={t} className="rounded border border-violet/30 bg-violet/10 px-2.5 py-1 font-mono text-xs text-violet">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {selected.link && (
              <a
                href={selected.link}
                target="_blank"
                rel="noreferrer"
                className="mt-8 inline-flex items-center gap-2 rounded-lg border border-teal/60 bg-teal/10 px-5 py-2.5 font-mono text-sm text-teal transition-all hover:bg-teal hover:text-ink"
              >
                访问项目 <span aria-hidden>↗</span>
              </a>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
