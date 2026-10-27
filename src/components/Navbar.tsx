import { useEffect, useState } from 'react'

const LINKS = [
  { id: 'about', label: '关于' },
  { id: 'skills', label: '技能' },
  { id: 'projects', label: '项目' },
  { id: 'blog', label: '博客' },
  { id: 'contact', label: '联系' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const ids = LINKS.map((l) => l.id)
    const onScroll = () => {
      let current = ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 120) current = id
      }
      setActive(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-ink/70 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5">
        <a href="#top" className="font-mono text-sm font-bold tracking-tight text-teal">
          <span className="text-mute">~</span> bw<span className="ml-0.5 inline-block h-3.5 w-2 bg-teal/80" />
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`#${l.id}`}
                className={`rounded-md px-3 py-2 font-mono text-[13px] transition-colors ${
                  active === l.id
                    ? 'bg-teal/10 text-teal'
                    : 'text-mute hover:bg-white/5 hover:text-mist'
                }`}
              >
                <span className="mr-1 text-teal/50">/</span>
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label="打开导航菜单"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-mist md:hidden"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
            {open ? (
              <path d="M4 4l10 10M14 4L4 14" strokeLinecap="round" />
            ) : (
              <path d="M2.5 5h13M2.5 9h13M2.5 13h13" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/5 bg-ink/95 px-5 py-3 md:hidden">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={`#${l.id}`}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2.5 font-mono text-sm text-mist hover:bg-white/5 hover:text-teal"
            >
              <span className="text-teal/50">/</span> {l.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
