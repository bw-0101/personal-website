import type { ReactNode } from 'react'

/**
 * 极简 Markdown 渲染器（仅支持本站文章用到的语法）：
 *   ## / ### 标题 · 代码块(```) · > 引用 · - 无序列表 · 1. 有序列表
 *   行内：**加粗** · `行内代码` · [文本](链接)
 *
 * 安全：全程走 React 的文本节点，绝不注入 HTML。
 * 注意不要在渲染前把全文转义成实体，否则普通引号会显示成 &quot;。
 */

const INLINE_RE = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g
const LINK_RE = /^\[([^\]]+)\]\(([^)]+)\)$/

function renderInline(text: string, keyBase: string): ReactNode[] {
  const nodes: ReactNode[] = []
  let last = 0
  let k = 0
  let m: RegExpExecArray | null
  INLINE_RE.lastIndex = 0
  while ((m = INLINE_RE.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index))
    const tok = m[0]
    if (tok.startsWith('**')) {
      nodes.push(
        <strong key={`${keyBase}-${k++}`} className="font-semibold text-ink">
          {tok.slice(2, -2)}
        </strong>,
      )
    } else if (tok.startsWith('`')) {
      nodes.push(
        <code key={`${keyBase}-${k++}`} className="bg-paper-3 px-1.5 py-0.5 font-mono text-[0.86em] text-vermil">
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
            className="text-vermil underline decoration-vermil/30 underline-offset-4 transition-colors hover:decoration-vermil"
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
  const lines = source.split('\n')
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
      i++
      blocks.push(
        <pre
          key={key++}
          className="my-6 overflow-x-auto border-l-2 border-ink bg-paper-2 px-5 py-4 font-mono text-[12.5px] leading-6 text-ink-2"
        >
          {buf.join('\n')}
        </pre>,
      )
      continue
    }

    // 标题
    if (/^###\s/.test(line)) {
      blocks.push(
        <h3 key={key++} className="mt-8 mb-3 font-serif text-lg font-semibold text-ink">
          {renderInline(line.replace(/^###\s/, ''), `h3-${key}`)}
        </h3>,
      )
      i++
      continue
    }
    if (/^##\s/.test(line)) {
      blocks.push(
        <h2
          key={key++}
          className="mt-10 mb-4 flex items-baseline gap-3 border-b border-line pb-2 font-display text-[22px] font-medium text-ink"
        >
          <span className="seal mb-0.5 shrink-0 scale-75" aria-hidden />
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
        <blockquote key={key++} className="my-6 border-l-2 border-vermil pl-5 py-1">
          {buf.map((b, bi) => (
            <p key={bi} className="font-serif text-[16px] italic leading-[1.85] text-ink-3">
              {renderInline(b, `bq-${key}-${bi}`)}
            </p>
          ))}
        </blockquote>,
      )
      continue
    }

    // 列表
    if (/^[-*]\s/.test(line) || /^\d+\.\s/.test(line)) {
      const ordered = /^\d+\.\s/.test(line)
      const items: ReactNode[] = []
      while (i < lines.length && (/^[-*]\s/.test(lines[i]) || /^\d+\.\s/.test(lines[i]))) {
        const clean = lines[i].replace(/^[-*]\s/, '').replace(/^\d+\.\s/, '')
        items.push(
          <li key={`li-${i}`} className="flex gap-3 font-serif text-[16.5px] leading-[1.85] text-ink-2">
            <span className="mt-[2px] shrink-0 font-mono text-[13px] text-vermil">
              {ordered ? `${items.length + 1}.` : '·'}
            </span>
            <span>{renderInline(clean, `li-${i}`)}</span>
          </li>,
        )
        i++
      }
      blocks.push(
        <ul key={key++} className="my-5 space-y-2">
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

    // 段落
    const buf: string[] = [line]
    i++
    while (i < lines.length && lines[i].trim() !== '' && !/^(##|###)\s/.test(lines[i]) && !/^```/.test(lines[i])) {
      buf.push(lines[i])
      i++
    }
    blocks.push(
      <p key={key++} className="prose-ink my-4 font-serif text-[16.5px] leading-[1.9] text-ink-2">
        {renderInline(buf.join(' '), `p-${key}`)}
      </p>,
    )
  }

  return <div>{blocks}</div>
}