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
              className="neon-card group overflow-hidden p-0 text-left"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={p.cover}
                  alt={`${p.title} 项目封面`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute right-3 top-3 rounded-full bg-black/55 px-2.5 py-1 font-mono text-[11px] text-white backdrop-blur-sm">
                  {p.date}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-display text-xl font-semibold text-mist transition-colors group-hover:text-teal">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-mute">{p.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded border border-teal/25 bg-teal/5 px-2 py-0.5 font-mono text-[11px] text-teal">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 详情弹层 */}
      {selected && (
        <div
          className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-label={selected.title}
        >
          <div
            className="max-h-[86vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-teal/20 bg-card p-0 sm:rounded-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-48 overflow-hidden">
              <img src={selected.cover} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="关闭详情"
                className="absolute right-4 top-4 rounded-md bg-black/45 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M4 4l8 8M12 4L4 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="p-6 sm:p-8">
              <p className="font-mono text-xs text-mute">{selected.date}</p>
              <h3 className="mt-2 font-display text-2xl font-bold text-mist">{selected.title}</h3>
              <p className="mt-4 text-[15px] leading-7 text-mist/90">{selected.desc}</p>

              <div className="mt-6">
                <h4 className="font-mono text-xs text-amber">tech stack</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {selected.tech.map((t) => (
                    <span key={t} className="rounded border border-violet/25 bg-violet/5 px-2.5 py-1 font-mono text-xs text-violet">
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
                  className="mt-8 inline-flex items-center gap-2 rounded-lg bg-teal px-5 py-2.5 font-mono text-sm text-white transition-all hover:brightness-110"
                >
                  访问项目 <span aria-hidden>↗</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
