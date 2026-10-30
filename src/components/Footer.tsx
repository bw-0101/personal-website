import { profile } from '../data/profile'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-ink/80">
      <div className="mx-auto max-w-[1200px] px-6 py-10 sm:px-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="display text-2xl">
              {profile.name}
              <span className="seal ml-2" aria-hidden />
            </p>
            <p className="mt-2 font-mono text-[11px] tracking-widest text-mute">CIRCUIT AURORA · {year}</p>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] tracking-widest text-mute">
            <a href="#top" className="transition-colors hover:text-vermil">
              回到顶部 ↑
            </a>
            <a href={`mailto:${profile.email}`} className="transition-colors hover:text-vermil">
              写封信
            </a>
            <span className="text-line-2">/</span>
            <a
              href="./admin.html"
              className="inline-flex items-center gap-1.5 border border-line px-3 py-1.5 transition-colors hover:border-ink hover:text-ink"
            >
              <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
                <rect x="3" y="7" width="10" height="7" rx="1" />
                <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
              </svg>
              管理后台
            </a>
          </div>
        </div>

        <p className="mt-8 border-t border-line pt-5 font-mono text-[10.5px] tracking-wider text-mute/80">
          Built with React · TypeScript · Vite · Tailwind — 内容与留言由自建后端托管
        </p>
      </div>
    </footer>
  )
}