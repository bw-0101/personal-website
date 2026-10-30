import { useEffect, useState } from 'react'
import type { Project } from '../data/projects'
import { useProjects } from '../hooks/useContent'
import { useReveal } from '../hooks/useReveal'
import SectionHead from './SectionHead'

export default function Projects() {
  const ref = useReveal<HTMLDivElement>()
  const { items } = useProjects()
  const [selected, setSelected] = useState<Project | null>(null)
  const shown = items.length ? items : []

  return (
    <section id="projects" className="scroll-mt-24">
      <div ref={ref} className="reveal mx-auto max-w-[1200px] px-6 py-20 sm:px-8 sm:py-28">
        <SectionHead no="03" title="项目" en="SELECTED WORK" lead="一些把「想法 → 文档 → 代码 → 上线」走通的作品。点击展开细节。" />

        <div className="mt-12">
          {shown.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setSelected(p)}
              className="group block w-full border-t border-line py-8 text-left transition-colors last:border-b hover:bg-paper-2/60 sm:py-10"
            >
              <div className="grid items-start gap-6 px-0 sm:px-2 lg:grid-cols-[1fr_240px] lg:gap-12">
                <div className="flex items-baseline gap-5">
                  <span className="font-mono text-[11px] tracking-widest text-mute">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="display text-2xl transition-colors group-hover:text-vermil sm:text-3xl">
                      {p.title}
                    </h3>
                    <p className="mt-3 max-w-xl font-serif text-[15px] leading-[1.85] text-ink-3">{p.summary}</p>
                    <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
                      {p.tags.map((t) => (
                        <span key={t} className="font-mono text-[11px] tracking-wider text-mute">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                  <span className="hidden shrink-0 font-mono text-[11px] tracking-widest text-mute lg:block">
                    {p.date}
                  </span>
                  <div className="aspect-[16/10] w-full max-w-[280px] overflow-hidden bg-paper-2 lg:w-[200px] lg:max-w-none">
                    <img
                      src={p.cover}
                      alt={`${p.title} 封面`}
                      loading="lazy"
                      className="h-full w-full object-cover grayscale-[35%] transition-all duration-700 group-hover:scale-[1.03] group-hover:grayscale-0"
                    />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {selected && <ProjectDialog project={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}

function ProjectDialog({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto bg-ink/45 p-0 backdrop-blur-[2px] sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
    >
      <article
        className="mx-auto min-h-full w-full max-w-3xl bg-paper p-6 sm:min-h-0 sm:p-12"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="section-no">{project.date}</p>
            <h2 className="display mt-3 text-3xl sm:text-4xl">{project.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭详情"
            className="flex h-9 w-9 shrink-0 items-center justify-center border border-line text-ink-3 transition-colors hover:border-ink hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M4 4l8 8M12 4L4 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {project.cover && (
          <img src={project.cover} alt="" className="mt-8 aspect-[16/9] w-full object-cover" />
        )}

        <p className="mt-8 font-serif text-[16.5px] leading-[1.95] text-ink-2">{project.desc}</p>

        <div className="mt-10 border-t border-line pt-6">
          <p className="section-no">技术栈</p>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {project.tech.map((t) => (
              <span key={t} className="border border-line px-3 py-1 font-mono text-[11px] tracking-wide text-ink-2">
                {t}
              </span>
            ))}
          </div>
        </div>

        {project.link && (
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="mt-10 inline-flex items-center gap-3 bg-ink px-6 py-3.5 text-sm text-paper transition-colors hover:bg-vermil"
          >
            访问项目 <span aria-hidden>↗</span>
          </a>
        )}
      </article>
    </div>
  )
}