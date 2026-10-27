import { useState } from 'react'
import { posts, type Post } from '../data/posts'
import Markdown from '../lib/markdown'
import { useReveal } from '../hooks/useReveal'

export default function Blog() {
  const ref = useReveal<HTMLDivElement>()
  const [active, setActive] = useState<Post | null>(null)

  return (
    <section id="blog" className="mx-auto max-w-[1180px] scroll-mt-24 px-5 py-24">
      <div ref={ref} className="reveal">
        <p className="font-mono text-xs text-teal">// 04</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-mist sm:text-4xl">
          blog<span className="text-teal">()</span>
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-mute">
          记录开发笔记、踩坑复盘与学习方法。
        </p>

        <div className="mt-10 space-y-4">
          {posts.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setActive(p)}
              className="neon-card group flex w-full flex-col items-start gap-3 p-6 text-left sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <span className="font-mono text-xs text-mute">{p.date}</span>
                <h3 className="mt-1.5 font-display text-lg font-semibold text-mist transition-colors group-hover:text-teal">
                  {p.title}
                </h3>
                <p className="mt-1 text-sm text-mute">{p.summary}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} className="rounded border border-violet/25 bg-violet/5 px-2 py-0.5 font-mono text-[11px] text-violet">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <span className="shrink-0 font-mono text-xs text-teal transition-transform group-hover:translate-x-1">
                阅读 →
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 文章弹窗 */}
      {active && (
        <div
          className="fixed inset-0 z-[60] overflow-y-auto bg-black/50 p-4 backdrop-blur-sm sm:p-10"
          onClick={() => setActive(null)}
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
        >
          <article
            className="mx-auto max-w-3xl rounded-2xl border border-[#E2EBE6] bg-card p-6 sm:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-teal">{active.date}</p>
                <h2 className="mt-2 font-display text-2xl font-bold text-mist sm:text-3xl">{active.title}</h2>
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="关闭文章"
                className="shrink-0 rounded-md border border-[#D8E3DC] p-2 text-mute transition-colors hover:border-teal hover:text-teal"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M4 4l8 8M12 4L4 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="markdown-body mt-8">
              <Markdown source={active.content} />
            </div>
          </article>
        </div>
      )}
    </section>
  )
}
