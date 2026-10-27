import { profile } from '../data/profile'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer className="border-t border-white/5 bg-ink/60">
      <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
        <p className="font-mono text-xs text-mute">
          © {year} {profile.name} · built with React + Vite + Tailwind
        </p>
        <div className="flex items-center gap-4 font-mono text-xs text-mute">
          <a href="#top" className="transition-colors hover:text-teal">back_to_top ↑</a>
          <span className="text-white/10">|</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-teal" /> deployed on Cloudflare Pages
          </span>
        </div>
      </div>
    </footer>
  )
}
