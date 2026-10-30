import { useEffect, useState, type FormEvent } from 'react'
import { useProfile } from '../hooks/useProfile'
import { api, ApiError, isBackendDown } from '../lib/api'
import { useReveal } from '../hooks/useReveal'
import SectionHead from './SectionHead'

type Status = 'idle' | 'sending' | 'sent' | 'error'
type Errors = { name?: string; email?: string; message?: string }

const EMPTY = { name: '', email: '', message: '', website: '' }

export default function Contact() {
  const profile = useProfile()
  const ref = useReveal<HTMLDivElement>()
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState<Errors>({})
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [copied, setCopied] = useState(false)

  const validate = () => {
    const e: Errors = {}
    if (form.name.trim().length < 2) e.name = '姓名至少 2 个字符'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) e.email = '邮箱格式不正确'
    if (form.message.trim().length < 10) e.message = '留言至少 10 个字符'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault()
    if (status === 'sending' || !validate()) return
    setStatus('sending')
    setErrorMsg('')
    try {
      await api('/api/guestbook', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
          website: form.website,
        }),
      })
      setStatus('sent')
      setForm(EMPTY)
    } catch (err) {
      setStatus('error')
      setErrorMsg(
        isBackendDown(err)
          ? '留言服务暂时不可用，可以直接发邮件给我。'
          : err instanceof ApiError
            ? err.message
            : '发送失败，请稍后重试。',
      )
    }
  }

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      /* 剪贴板不可用时静默 */
    }
  }

  const fieldCls =
    'w-full border-0 border-b border-line bg-transparent px-0 py-2.5 text-[15px] text-ink placeholder:text-mute/70 outline-none transition-colors focus:border-ink'

  return (
    <section id="contact" className="scroll-mt-24">
      <div ref={ref} className="reveal mx-auto max-w-[1200px] px-6 py-20 sm:px-8 sm:py-28">
        <SectionHead no="05" title="联系" en="GET IN TOUCH" lead="留言会直接进入我的收件箱，我会用邮件回复你（你的邮箱不会公开）。" />

        <div className="mt-12 grid gap-14 lg:grid-cols-12 lg:gap-10">
          {/* 左：联系方式 */}
          <div className="lg:col-span-4">
            <p className="section-no">直接找我</p>
            <div className="mt-5 space-y-1">
              <div className="flex items-center justify-between gap-3 border-b border-line py-3">
                <span className="font-mono text-[11px] tracking-widest text-mute">EMAIL</span>
                <span className="truncate text-sm text-ink-2">{profile.email}</span>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="shrink-0 font-mono text-[11px] tracking-widest text-vermil transition-opacity hover:opacity-70"
                >
                  {copied ? '已复制' : '复制'}
                </button>
              </div>
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between gap-3 border-b border-line py-3"
              >
                <span className="font-mono text-[11px] tracking-widest text-mute">GITHUB</span>
                <span className="link-underline text-sm text-ink-2">github.com</span>
                <span className="text-mute transition-transform group-hover:translate-x-0.5" aria-hidden>
                  ↗
                </span>
              </a>
              <a
                href={profile.socials.bilibili}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between gap-3 border-b border-line py-3"
              >
                <span className="font-mono text-[11px] tracking-widest text-mute">BILIBILI</span>
                <span className="link-underline text-sm text-ink-2">space.bilibili.com</span>
                <span className="text-mute transition-transform group-hover:translate-x-0.5" aria-hidden>
                  ↗
                </span>
              </a>
              <div className="flex items-center justify-between gap-3 border-b border-line py-3">
                <span className="font-mono text-[11px] tracking-widest text-mute">QQ</span>
                <span className="text-sm text-ink-2">{profile.socials.qq}</span>
              </div>
            </div>

            <Guestbook />
          </div>

          {/* 右：留言表单 */}
          <div className="lg:col-span-8 lg:pl-6">
            <p className="section-no">写一条留言</p>

            {status === 'sent' ? (
              <div className="mt-6 border-l-2 border-vermil bg-paper-2/70 px-6 py-8">
                <p className="display text-2xl">收到了，谢谢。</p>
                <p className="mt-3 font-serif text-[15px] leading-7 text-ink-3">
                  留言已经进入我的收件箱，我会尽快回复到你的邮箱。
                </p>
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="mt-6 font-mono text-[12px] tracking-widest text-vermil hover:opacity-70"
                >
                  ← 再写一条
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="mt-6 space-y-8">
                <div className="grid gap-8 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="font-mono text-[11px] tracking-widest text-mute">
                      怎么称呼
                    </label>
                    <input
                      id="name"
                      type="text"
                      autoComplete="name"
                      placeholder="你的名字"
                      className={fieldCls}
                      value={form.name}
                      aria-invalid={Boolean(errors.name)}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    {errors.name && <p className="mt-1.5 text-xs text-vermil">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="font-mono text-[11px] tracking-widest text-mute">
                      邮箱
                    </label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={fieldCls}
                      value={form.email}
                      aria-invalid={Boolean(errors.email)}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    {errors.email && <p className="mt-1.5 text-xs text-vermil">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="font-mono text-[11px] tracking-widest text-mute">
                    想说的话
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="项目合作 / 技术交流 / 考研互助，都可以。"
                    className={`${fieldCls} resize-none`}
                    value={form.message}
                    aria-invalid={Boolean(errors.message)}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                  {errors.message && <p className="mt-1.5 text-xs text-vermil">{errors.message}</p>}
                </div>

                {/* 蜜罐：对真人隐藏，机器人会填写 */}
                <input
                  type="text"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden="true"
                  value={form.website}
                  onChange={(e) => setForm({ ...form, website: e.target.value })}
                  className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
                />

                {status === 'error' && (
                  <p className="border-l-2 border-vermil bg-vermil/5 px-4 py-3 text-sm text-vermil">{errorMsg}</p>
                )}

                <div className="flex flex-wrap items-center gap-5">
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="inline-flex items-center gap-4 bg-ink px-7 py-4 text-sm text-paper transition-colors hover:bg-vermil disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {status === 'sending' ? '发送中…' : '发送留言'}
                    <span aria-hidden>→</span>
                  </button>
                  <p className="text-xs leading-5 text-mute">留言公开时只显示昵称与内容，你的邮箱不会被展示。</p>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

/** 公开留言板：读后端；后端不可用时整块隐藏，不留半个空壳 */
function Guestbook() {
  const [items, setItems] = useState<{ name: string; message: string; createdAt: string }[]>([])
  const [count, setCount] = useState(0)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let alive = true
    api<{ items: { name: string; message: string; createdAt: string }[]; count: number }>('/api/guestbook', {}, 8000)
      .then((d) => {
        if (!alive) return
        setItems((d.items ?? []).slice(0, 4))
        setCount(d.count ?? 0)
      })
      .catch(() => {
        if (alive) setFailed(true)
      })
    return () => {
      alive = false
    }
  }, [])

  if (failed || items.length === 0) return null

  return (
    <div className="mt-10">
      <p className="section-no">最近的留言 · 共 {count} 条</p>
      <ul className="mt-5 space-y-5">
        {items.map((m, i) => (
          <li key={`${m.createdAt}-${i}`} className="border-l border-line pl-4">
            <p className="font-serif text-[14px] leading-[1.8] text-ink-2">“{m.message}”</p>
            <p className="mt-1.5 font-mono text-[10.5px] tracking-widest text-mute">
              — {m.name} · {new Date(m.createdAt).toLocaleDateString('zh-CN')}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}