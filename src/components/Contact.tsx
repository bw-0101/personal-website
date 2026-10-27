import { useState, type FormEvent } from 'react'
import { profile } from '../data/profile'
import { useReveal } from '../hooks/useReveal'

export default function Contact() {
  const ref = useReveal<HTMLDivElement>()
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [copied, setCopied] = useState(false)

  const validate = () => {
    const e: typeof errors = {}
    if (form.name.trim().length < 2) e.name = '姓名至少 2 个字符'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = '邮箱格式不正确'
    if (form.message.trim().length < 10) e.message = '留言至少 10 个字符'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault()
    if (status === 'sending') return
    if (!validate()) return
    setStatus('sending')
    window.setTimeout(() => setStatus('sent'), 900)
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

  const inputCls =
    'w-full rounded-lg border border-white/12 bg-ink/70 px-4 py-3 text-sm text-mist placeholder:text-mute/50 outline-none transition-colors focus:border-teal/60'

  return (
    <section id="contact" className="mx-auto max-w-[1180px] scroll-mt-24 px-5 py-24">
      <div ref={ref} className="reveal">
        <p className="font-mono text-xs text-teal">// 05</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-mist sm:text-4xl">
          contact<span className="text-teal">()</span>
        </h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-5">
          {/* 联系方式 */}
          <div className="neon-card rounded-xl p-6 lg:col-span-2">
            <h3 className="font-mono text-sm font-semibold text-amber">直接找我</h3>
            <div className="mt-5 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-ink/60 px-4 py-3">
                <span className="font-mono text-xs text-mute">email</span>
                <span className="truncate text-mist">{profile.email}</span>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="shrink-0 rounded border border-teal/40 px-2.5 py-1 font-mono text-[11px] text-teal transition-colors hover:bg-teal hover:text-ink"
                >
                  {copied ? '✓ 已复制' : '复制'}
                </button>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-ink/60 px-4 py-3">
                <span className="font-mono text-xs text-mute">github</span>
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal underline decoration-teal/30 underline-offset-4 hover:text-violet"
                >
                  github.com/your-github
                </a>
              </div>
              <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-ink/60 px-4 py-3">
                <span className="font-mono text-xs text-mute">bilibili</span>
                <a
                  href={profile.socials.bilibili}
                  target="_blank"
                  rel="noreferrer"
                  className="text-teal underline decoration-teal/30 underline-offset-4 hover:text-violet"
                >
                  space.bilibili.com/your-uid
                </a>
              </div>
            </div>
            <p className="mt-6 text-xs leading-5 text-mute/70">
              注：当前为静态演示站，表单提交仅做前端校验与模拟反馈；接入后端后即变为真实留言。
            </p>
          </div>

          {/* 表单 */}
          <div className="neon-card rounded-xl p-6 lg:col-span-3">
            <h3 className="font-mono text-sm font-semibold text-amber">留言板</h3>
            {status === 'sent' ? (
              <div className="mt-8 rounded-lg border border-teal/30 bg-teal/10 p-6 text-center">
                <p className="font-display text-lg font-semibold text-teal">消息已提交 ✓</p>
                <p className="mt-2 text-sm text-mute">感谢留言（演示模式，未真正发送）。</p>
                <button
                  type="button"
                  onClick={() => {
                    setStatus('idle')
                    setForm({ name: '', email: '', message: '' })
                  }}
                  className="mt-5 rounded-lg border border-white/15 px-4 py-2 font-mono text-sm text-mist transition-colors hover:border-teal/50 hover:text-teal"
                >
                  再写一条
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="mb-1.5 block font-mono text-xs text-mute">name</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="怎么称呼你"
                      className={inputCls}
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    {errors.name && <p className="mt-1.5 text-xs text-amber">{errors.name}</p>}
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-1.5 block font-mono text-xs text-mute">email</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      className={inputCls}
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    {errors.email && <p className="mt-1.5 text-xs text-amber">{errors.email}</p>}
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="mb-1.5 block font-mono text-xs text-mute">message</label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="想聊点什么？项目合作 / 技术交流 / 考研互助都欢迎"
                    className={`${inputCls} resize-none`}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                  {errors.message && <p className="mt-1.5 text-xs text-amber">{errors.message}</p>}
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full rounded-lg border border-teal/60 bg-teal/10 px-5 py-3 font-mono text-sm text-teal transition-all hover:bg-teal hover:text-ink disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {status === 'sending' ? '发送中…' : '$ send_message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
