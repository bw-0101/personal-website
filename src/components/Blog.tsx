import { useState } from 'react'
import { posts, type Post } from '../data/posts'
import { useReveal } from '../hooks/useReveal'
import Markdown from '../lib/markdown'

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
          踩坑记录与学习复盘。新增文章：在 <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-amber">src/data/posts.ts</code> 里加一条即可。
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {posts.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => {
                setActive(p)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
              className="neon-card group rounded-xl p-6 text-left"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-mute">{p.date}</span>
                <span className="font-mono text-xs text-teal/0 transition-colors group-hover:text-teal">read →</span>
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-mist transition-colors group-hover:text-teal">
                {p.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-mute">{p.summary}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="rounded border border-amber/25 bg-amber/5 px-2 py-0.5 font-mono text-[11px] text-amber/90">
                    {t}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 文章详情 */}
      {active && (
        <div className="fixed inset-0 z-[60] overflow-y-auto bg-ink/97 backdrop-blur-sm">
          <div className="mx-auto min-h-full max-w-3xl px-5 py-16">
            <div className="fade-up">
              <button
                type="button"
                onClick={() => setActive(null)}
                className="rounded-lg border border-white/15 px-4 py-2 font-mono text-sm text-mute transition-colors hover:border-teal/50 hover:text-teal"
              >
                ← 返回列表
              </button>

              <header className="mt-8">
                <p className="font-mono text-xs text-mute">{active.date}</p>
                <h1 className="mt-3 font-display text-3xl font-bold leading-tight text-mist sm:text-4xl">
                  {active.title}
                </h1>
                <div className="mt-4 flex flex-wrap gap-2">
                  {active.tags.map((t) => (
                    <span key={t} className="rounded border border-amber/25 bg-amber/5 px-2 py-0.5 font-mono text-[11px] text-amber/90">
                      {t}
                    </span>
                  ))}
                </div>
              </header>

              <article className="mt-8 border-t border-white/10 pt-8">
                <Markdown source={active.content} />
              </article>

              <footer className="mt-12 border-t border-white/10 pt-6">
                <button
                  type="button"
                  onClick={() => setActive(null)}
                  className="rounded-lg border border-teal/60 bg-teal/10 px-5 py-2.5 font-mono text-sm text-teal transition-all hover:bg-teal hover:text-ink"
                >
                  ← 回到博客列表
                </button>
              </footer>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
