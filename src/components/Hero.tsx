import { profile } from '../data/profile'

const COLOPHON = [
  { k: '身份', v: profile.title },
  { k: '坐标', v: profile.location },
  { k: '状态', v: '备考冲刺 · 开放交流' },
]

export default function Hero() {
  return (
    <section id="top" className="relative">
      <div className="mx-auto max-w-[1200px] px-6 pb-16 pt-32 sm:px-8 sm:pt-40 lg:pb-24 lg:pt-48">
        {/* 刊头信息 */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-ink/80 pb-4">
          <p className="section-no">No.01 — 2026</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href="#contact"
              className="hidden items-center gap-2 font-mono text-[11px] tracking-widest text-ink-3 transition-colors hover:text-vermil sm:flex"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-moss" aria-hidden />
              开放交流中
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="font-mono text-[11px] tracking-widest text-ink-3 transition-colors hover:text-vermil"
            >
              {profile.email}
            </a>
          </div>
        </div>

        {/* 标题区 */}
        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <h1 className="display text-[clamp(3.2rem,10vw,7.5rem)]">
              边&nbsp;伟
              <span className="seal ml-3 align-baseline" aria-hidden />
            </h1>
            <p className="mt-3 font-mono text-[13px] tracking-[0.28em] text-ink-3">
              BIAN&nbsp;WEI&nbsp;·&nbsp;CIRCUIT&nbsp;AURORA
            </p>

            <p className="mt-10 max-w-2xl font-serif text-xl leading-[1.85] text-ink-2 sm:text-[22px]">
              {profile.tagline}
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              <a
                href="#projects"
                className="group inline-flex items-center justify-between gap-6 bg-ink px-6 py-4 text-sm text-paper transition-colors hover:bg-vermil sm:justify-start"
              >
                <span>看作品</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                  →
                </span>
              </a>
              <a
                href="#contact"
                className="group inline-flex items-center justify-between gap-6 border border-ink/20 px-6 py-4 text-sm text-ink transition-colors hover:border-ink sm:justify-start"
              >
                <span>留下句话</span>
                <span className="text-ink-3 transition-transform duration-300 group-hover:translate-x-1" aria-hidden>
                  ↗
                </span>
              </a>
            </div>
          </div>

          {/* 右栏：名片 + 克制的小终端 */}
          <aside className="lg:col-span-4 lg:pl-6">
            <div className="border-t border-line lg:border-l lg:border-t-0 lg:pl-8">
              <p className="section-no pt-6 lg:pt-0">colophon</p>
              <dl className="mt-6 space-y-4">
                {COLOPHON.map((row) => (
                  <div key={row.k} className="grid grid-cols-[3.5rem_1fr] items-baseline gap-3">
                    <dt className="font-mono text-[11px] tracking-widest text-mute">{row.k}</dt>
                    <dd className="text-sm leading-6 text-ink-2">{row.v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8 border border-line bg-paper-2 p-4">
                <div className="flex items-center gap-1.5 pb-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-vermil/70" />
                  <span className="h-1.5 w-1.5 rounded-full bg-line-2" />
                  <span className="h-1.5 w-1.5 rounded-full bg-line-2" />
                  <span className="ml-2 font-mono text-[10px] tracking-widest text-mute">~/bian-wei</span>
                </div>
                <pre className="overflow-x-auto font-mono text-[12px] leading-6 text-ink-2">
                  <span className="text-vermil">$</span> whoami{'\n'}
                  <span className="text-mute">→</span> {profile.name} · 本科在读{'\n'}
                  <span className="text-vermil">$</span> status{'\n'}
                  <span className="text-mute">→</span> 备考中，欢迎技术交流<span className="caret ml-1" />
                </pre>
              </div>

              <a
                href="#about"
                className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] tracking-widest text-mute transition-colors hover:text-vermil"
              >
                ↓ 向下滚动
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}