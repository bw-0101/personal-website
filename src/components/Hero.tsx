import { useEffect, useRef, useState } from 'react'
import { profile } from '../data/profile'

const LINES: { cmd: string; out: string }[] = [
  { cmd: 'whoami', out: `${profile.name} · ${profile.title}` },
  { cmd: 'cat ./tagline.txt', out: profile.tagline },
  { cmd: './build --target 92-uni --major electronics', out: '构建中… 电子信息考研 · 冲刺阶段' },
]

export default function Hero() {
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [done, setDone] = useState(false)
  const reduceMotion = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  useEffect(() => {
    if (reduceMotion.current) {
      setLineIdx(LINES.length)
      setDone(true)
      return
    }
    if (lineIdx >= LINES.length) return
    const line = LINES[lineIdx]
    if (charIdx < line.cmd.length) {
      const t = window.setTimeout(() => setCharIdx((c) => c + 1), 46)
      return () => window.clearTimeout(t)
    }
    const t = window.setTimeout(() => {
      setLineIdx((i) => i + 1)
      setCharIdx(0)
    }, 620)
    return () => window.clearTimeout(t)
  }, [lineIdx, charIdx])

  useEffect(() => {
    if (lineIdx >= LINES.length) {
      const t = window.setTimeout(() => setDone(true), 500)
      return () => window.clearTimeout(t)
    }
  }, [lineIdx])

  return (
    <section id="top" className="relative mx-auto flex min-h-screen max-w-[1180px] flex-col items-center justify-center gap-12 px-5 pb-20 pt-28 lg:flex-row lg:justify-between lg:gap-10">
      {/* 终端打字机 */}
      <div className="w-full max-w-[640px]">
        <p className="mb-4 font-mono text-[13px] text-mute">
          <span className="text-teal">➜</span> ~ <span className="text-amber">个人系统 v1.0</span>
          <span className="ml-2 text-mute/60">// 2026 运行中</span>
        </p>

        <div className="neon-card rounded-xl p-6 font-mono text-[15px] leading-relaxed sm:p-8 sm:text-base">
          {LINES.slice(0, lineIdx + 1).map((l, i) => {
            const isLast = i === lineIdx
            const typing = isLast && charIdx < l.cmd.length
            return (
              <div key={i} className="mb-3">
                <div className="flex flex-wrap items-baseline gap-x-2">
                  <span className="shrink-0 text-teal">$</span>
                  <span className="whitespace-pre-wrap break-all text-mist">
                    {isLast ? l.cmd.slice(0, charIdx) : l.cmd}
                  </span>
                  {isLast && <span className="caret" />}
                </div>
                {!typing && (
                  <p className="mt-1.5 text-[13px] text-mute sm:text-sm">
                    <span className="text-teal/60">→</span> {l.out}
                  </p>
                )}
              </div>
            )
          })}
        </div>

        <div className={`mt-8 flex flex-wrap gap-3 ${done ? 'fade-up' : 'opacity-0'}`}>
          <a
            href="#projects"
            className="rounded-lg border border-teal/60 bg-teal/10 px-5 py-2.5 font-mono text-sm text-teal transition-all hover:bg-teal hover:text-ink hover:shadow-[0_0_24px_rgba(45,229,176,0.4)]"
          >
            ./view_projects
          </a>
          <a
            href="#contact"
            className="rounded-lg border border-white/15 px-5 py-2.5 font-mono text-sm text-mist transition-colors hover:border-amber/60 hover:text-amber"
          >
            ./contact_me
          </a>
          <span className="hidden items-center font-mono text-xs text-mute/70 sm:flex">
            <span className="mr-2 h-1.5 w-1.5 animate-pulse rounded-full bg-teal" />
            status: open to collaborate
          </span>
        </div>
      </div>

      {/* 头像卡片 */}
      <div className="shrink-0">
        <div className="relative">
          <div className="aurora-blob left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 bg-teal/30" />
          <div className="neon-card relative overflow-hidden rounded-2xl p-3">
            <img
              src="/avatar.svg"
              alt={`${profile.name} 的头像（电路风格徽标）`}
              width={260}
              height={260}
              className="block rounded-xl"
            />
            <div className="mt-3 flex items-center justify-between px-1">
              <span className="font-mono text-xs text-mute">uid: bw-2024</span>
              <span className="font-mono text-xs text-teal">● online</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
