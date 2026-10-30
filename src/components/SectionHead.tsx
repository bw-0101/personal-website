import type { ReactNode } from 'react'

/**
 * 统一的章节头：编号 + 中英标题 + 引言 + 发丝分隔线。
 * 整站的「杂志目录」感都从这里来。
 */
export default function SectionHead({
  no,
  title,
  en,
  lead,
  children,
}: {
  no: string
  title: string
  en: string
  lead?: string
  children?: ReactNode
}) {
  return (
    <header className="border-t border-ink/80 pt-6">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <div className="flex items-baseline gap-4 sm:gap-6">
          <span className="section-no">{no}</span>
          <h2 className="display text-4xl sm:text-5xl">{title}</h2>
          <span className="hidden font-mono text-[11px] tracking-[0.22em] text-mute sm:inline">{en}</span>
        </div>
        {children}
      </div>
      {lead && (
        <p className="mt-5 max-w-2xl font-serif text-[15px] leading-[1.9] text-ink-3 sm:text-base">{lead}</p>
      )}
    </header>
  )
}