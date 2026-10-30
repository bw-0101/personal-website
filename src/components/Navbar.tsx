import { useEffect, useState } from 'react'
import { useProfile } from '../hooks/useProfile'

const LINKS = [
  { id: 'about', label: '关于' },
  { id: 'skills', label: '技能' },
  { id: 'projects', label: '项目' },
  { id: 'blog', label: '文章' },
  { id: 'contact', label: '联系' },
]

export default function Navbar() {
  const profile = useProfile()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
      let current = ''
      for (const { id } of LINKS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 140) current = id
      }
      setActive(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 移动端菜单打开时锁滚动
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? 'border-b border-line bg-paper/92 backdrop-blur-md' : 'border-b border-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-6 sm:h-[72px] sm:px-8">
        <a href="#top" className="flex items-baseline gap-2" aria-label="回到顶部">
          <span className="display text-lg tracking-tight">{profile.name}</span>
          <span className="seal" aria-hidden />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className={`font-mono text-[12px] tracking-widest transition-colors ${
                  active === l.id ? 'text-vermil' : 'text-ink-3 hover:text-ink'
                }`}
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="./admin.html"
              aria-label="进入管理后台"
              title="管理后台"
              className="flex h-9 w-9 items-center justify-center border border-ink/15 text-ink-3 transition-colors hover:border-ink hover:bg-ink hover:text-paper"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <rect x="3" y="7" width="10" height="7" rx="1" />
                <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
              </svg>
            </a>
          </li>
          <li>
            <a
              href={`mailto:${profile.email}`}
              className="border border-ink/15 px-3.5 py-2 font-mono text-[12px] tracking-widest text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
            >
              写封信
            </a>
          </li>
        </ul>

        <button
          type="button"
          aria-label={open ? '关闭导航菜单' : '打开导航菜单'}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 items-center justify-center border border-ink/15 text-ink md:hidden"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4">
            {open ? (
              <path d="M4 4l10 10M14 4L4 14" strokeLinecap="round" />
            ) : (
              <path d="M2.5 5.5h13M2.5 12.5h13" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {/* 移动端菜单 */}
      {open && (
        <div className="border-t border-line bg-paper md:hidden">
          <ul className="px-6 py-2">
            {LINKS.map((l, i) => (
              <li key={l.id} className="border-b border-line/70 last:border-0">
                <a href={`#${l.id}`} onClick={() => setOpen(false)} className="flex items-baseline justify-between py-4">
                  <span className="flex items-baseline gap-3">
                    <span className="section-no">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-serif text-lg text-ink">{l.label}</span>
                  </span>
                  <span className="text-mute" aria-hidden>
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <a
            href={`mailto:${profile.email}`}
            onClick={() => setOpen(false)}
            className="mx-6 block bg-ink px-5 py-3.5 text-center text-sm text-paper"
          >
            写封信给我
          </a>
          <a
            href="./admin.html"
            onClick={() => setOpen(false)}
            className="mx-6 mb-6 mt-3 block border border-line px-5 py-3 text-center font-mono text-[12px] tracking-widest text-ink-3"
          >
            管理后台 →
          </a>
        </div>
      )}
    </header>
  )
}