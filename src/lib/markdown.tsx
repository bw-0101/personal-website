import type { ReactNode } from 'react'

/**
 * 极简 Markdown 渲染器（仅支持本站文章用到的语法）：
 *   ## / ### 标题 · 代码块(```) · > 引用 · - 无序列表 · 1. 有序列表
 *   行内：**加粗** · `行内代码` · [文本](链接)
 * 安全：先整体转义 HTML，再做行内替换，杜绝 XSS。
 */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const INLINE_RE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g
const LINK_RE = /^\[([^\]]+)\]\(([^)]+)\)$/

function renderInline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let last = 0
  let k = 0
  let m: RegExpExecArray | null
  while ((m = INLINE_RE.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    const tok = m[0]
    if (tok.startsWith('**')) {
      nodes.push(
        <strong key={`${keyBase}-${k++}`} className="font-semibold text-teal">
          {tok.slice(2, -2)}
        </strong>,
      )
    } else if (tok.startsWith('`')) {
      nodes.push(
        <code
          key={`${keyBase}-${k++}`}
          className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[0.88em] text-amber"
        >
          {tok.slice(1, -1)}
        </code>,
      )
    } else {
      const lm = LINK_RE.exec(tok)
      if (lm) {
        nodes.push(
          <a
            key={`${keyBase}-${k++}`}
            href={lm[2]}
            target="_blank"
            rel="noreferrer"
            className="text-teal underline decoration-teal/40 underline-offset-4 transition-colors hover:text-violet"
          >
            {lm[1]}
          </a>,
        )
      }
    }
    last = m.index + tok.length
  }
  if (last < text.length) nodes.push(text.slice(last))
  return nodes
}

export default function Markdown({ source }: { source: string }) {
  const lines = escapeHtml(source).split('\n')
  const blocks: ReactNode[] = []
  let i = 0
  let key = 0

  while (i < lines.length) {
    const line = lines[i]

    // 代码块
    if (line.trimStart().startsWith('```')) {
      const buf: string[] = []
      i++
      while (i < lines.length && !lines[i].trimStart().startsWith('```')) {
        buf.push(lines[i])
        i++
      }
      i++ // 跳过结束 ```
      blocks.push(
        <pre
          key={key++}
          className="my-4 overflow-x-auto rounded-lg border border-violet/25 bg-[#0d1117] p-4 font-mono text-[13px] leading-6 text-violet/90"
        >
          {buf.join('\n')}
        </pre>,
      )
      continue
    }

    // 标题
    if (/^###\s/.test(line)) {
      blocks.push(
        <h3 key={key++} className="mt-8 mb-3 text-lg font-bold text-mist">
          {renderInline(line.replace(/^###\s/, ''), `h3-${key}`)}
        </h3>,
      )
      i++
      continue
    }
    if (/^##\s/.test(line)) {
      blocks.push(
        <h2 key={key++} className="mt-10 mb-4 border-b border-white/10 pb-2 font-display text-2xl font-bold text-mist">
          {renderInline(line.replace(/^##\s/, ''), `h2-${key}`)}
        </h2>,
      )
      i++
      continue
    }

    // 引用
    if (/^>\s?/.test(line)) {
      const buf: string[] = []
      while (i < lines.length && /^>\s?/.test(lines[i])) {
        buf.push(lines[i].replace(/^>\s?/, ''))
        i++
      }
      blocks.push(
        <blockquote
          key={key++}
          className="my-4 border-l-2 border-amber/60 bg-amber/5 px-4 py-3 text-sm leading-6 text-mist/90"
        >
          {buf.map((b, bi) => (
            <p key={bi} className={bi > 0 ? 'mt-2' : ''}>
              {renderInline(b, `bq-${key}-${bi}`)}
            </p>
          ))}
        </blockquote>,
      )
      continue
    }

    // 列表（无序 / 有序）
    if (/^[-*]\s/.test(line) || /^\d+\.\s/.test(line)) {
      const ordered = /^\d+\.\s/.test(line)
      const items: ReactNode[] = []
      while (i < lines.length && (/^[-*]\s/.test(lines[i]) || /^\d+\.\s/.test(lines[i]))) {
        const clean = lines[i].replace(/^[-*]\s/, '').replace(/^\d+\.\s/, '')
        items.push(
          <li key={`li-${i}`} className="leading-7">
            <span className="mr-2 font-mono text-teal/70">{ordered ? `${items.length + 1}.` : '›'}</span>
            {renderInline(clean, `li-${i}`)}
          </li>,
        )
        i++
      }
      blocks.push(
        <ul key={key++} className={`my-4 ${ordered ? 'list-none' : 'list-none'} space-y-1.5 text-[15px] text-mist/90`}>
          {items}
        </ul>,
      )
      continue
    }

    // 空行
    if (line.trim() === '') {
      i++
      continue
    }

    // 普通段落（合并相邻行）
    const buf: string[] = [line]
    i++
    while (i < lines.length && lines[i].trim() !== '' && !/^(##|###)\s/.test(lines[i]) && !/^```/.test(lines[i])) {
      buf.push(lines[i])
      i++
    }
    blocks.push(
      <p key={key++} className="my-3 text-[15px] leading-7 text-mist/90">
        {renderInline(buf.join(' '), `p-${key}`)}
      </p>,
    )
  }

  return <div>{blocks}</div>
}
