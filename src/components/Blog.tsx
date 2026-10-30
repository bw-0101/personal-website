import { useEffect, useState } from 'react'
import type { Post } from '../data/posts'
import { usePosts } from '../hooks/useContent'
import { useReveal } from '../hooks/useReveal'
import Markdown from '../lib/markdown'
import SectionHead from './SectionHead'

export default function Blog() {
  const ref = useReveal<HTMLDivElement>()
  const { items } = usePosts()
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = items.find((p) => p.id === activeId) ?? null

  // 支持直接分享文章链接：index.html?post=xxx
  useEffect(() => {
    const sync = () => {
      const id = new URL(window.location.href).searchParams.get('post')
      setActiveId(id)
      // 首次带 ?post= 进来时，把下面的列表滚到视口，关掉弹层后不会落在页面顶部
      if (id) {
        window.setTimeout(() => {
          const el = document.getElementById('blog')
          if (el && !document.body.dataset.postScrolled) {
            document.body.dataset.postScrolled = '1'
            el.scrollIntoView({ block: 'start' })
          }
        }, 80)
      }
    }
    sync()
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  // 打开文章时滚动锁由阅读层负责，这里只需确保关闭后回到列表位置
  const openPost = (id: string) => {
    setActiveId(id)
  }

  return (
    <section id="blog" className="scroll-mt-24">
      <div ref={ref} className="reveal mx-auto max-w-[1200px] px-6 py-20 sm:px-8 sm:py-28">
        <SectionHead no="04" title="文章" en="WRITING" lead="开发笔记、踩坑复盘与学习方法。内容由后台维护，随写随发。" />

        <div className="mt-12">
          {items.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => openPost(p.id)}
              className="group grid w-full border-t border-line py-7 text-left transition-colors last:border-b hover:bg-paper-2/60 sm:grid-cols-12 sm:gap-8 sm:py-8"
            >
              <div className="flex gap-5 sm:col-span-3 sm:block">
                <span className="font-mono text-[11px] tracking-widest text-mute">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="font-mono text-[11px] tracking-widest text-mute sm:mt-3">{p.date}</p>
              </div>

              <div className="mt-3 sm:col-span-8 sm:mt-0">
                <h3 className="font-serif text-xl leading-snug text-ink transition-colors group-hover:text-vermil sm:text-[22px]">
                  {p.title}
                </h3>
                <p className="mt-2 max-w-2xl font-serif text-[14.5px] leading-[1.85] text-ink-3">{p.summary}</p>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
                  {p.tags.map((t) => (
                    <span key={t} className="font-mono text-[11px] tracking-wider text-mute">
                      #{t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="hidden items-center justify-end sm:col-span-1 sm:flex">
                <span
                  className="font-mono text-sm text-mute transition-all duration-300 group-hover:translate-x-1 group-hover:text-vermil"
                  aria-hidden
                >
                  →
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {active && <PostReader post={active} onClose={() => setActiveId(null)} />}
    </section>
  )
}

/**
 * 文章阅读层。
 * 打开时把地址栏换成 ?post=xxx，分享出去的链接能直接打开这篇；
 * 关闭时用 history.back() 还原，不污染浏览历史。
 */
function PostReader({ post, onClose }: { post: Post; onClose: () => void }) {
  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('post', post.id)
    window.history.pushState({ post: post.id }, '', url)

    const onPop = () => {
      const id = new URL(window.location.href).searchParams.get('post')
      if (!id) onClose()
    }
    window.addEventListener('popstate', onPop)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('popstate', onPop)
      document.body.style.overflow = ''
    }
  }, [post.id, onClose])

  // 关闭：如果当前地址带 ?post=，用 replaceState 清掉，不留脏参数
  const close = () => {
    const url = new URL(window.location.href)
    if (url.searchParams.has('post')) {
      url.searchParams.delete('post')
      window.history.replaceState(null, '', url)
    }
    onClose()
  }

  // Esc 键也要走同一套清理逻辑
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.id])

  return (
    <div
      className="fixed inset-0 z-[60] overflow-y-auto bg-ink/45 backdrop-blur-[2px]"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-label={post.title}
    >
      <article
        className="mx-auto min-h-full w-full max-w-3xl bg-paper px-6 py-10 sm:px-14 sm:py-16"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <p className="section-no">{post.date}</p>
          <button
            type="button"
            onClick={close}
            aria-label="关闭文章"
            className="flex h-9 w-9 shrink-0 items-center justify-center border border-line text-ink-3 transition-colors hover:border-ink hover:text-ink"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4">
              <path d="M4 4l8 8M12 4L4 12" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <h1 className="display mt-6 text-[clamp(1.8rem,4.5vw,2.8rem)]">{post.title}</h1>
        <p className="mt-4 font-serif text-[15px] leading-[1.9] text-ink-3">{post.summary}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {post.tags.map((t) => (
            <span key={t} className="font-mono text-[11px] tracking-wider text-mute">
              #{t}
            </span>
          ))}
        </div>

        <div className="mt-10 border-t border-line pt-8">
          <Markdown source={post.content} />
        </div>

        <div className="mt-14 border-t border-line pt-6">
          <button type="button" onClick={close} className="font-mono text-[12px] tracking-widest text-ink-3 hover:text-vermil">
            ← 返回文章列表
          </button>
        </div>
      </article>
    </div>
  )
}