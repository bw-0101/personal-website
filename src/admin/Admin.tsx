import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { api, ApiError } from '../lib/api'

interface Message {
  id: number
  name: string
  email: string
  message: string
  isRead: boolean
  createdAt: string
}

interface PostRow {
  id: string
  title: string
  summary: string
  date: string
  tags: string[]
  content: string
}

interface ProjectRow {
  id: string
  title: string
  summary: string
  desc: string
  tags: string[]
  tech: string[]
  date: string
  cover: string
  link?: string
}

// ---------------- 登录 ----------------

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    if (!password || busy) return
    setBusy(true)
    setError('')
    try {
      await api('/api/admin/login', { method: 'POST', body: JSON.stringify({ password }) })
      onSuccess()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : '登录失败')
      setPassword('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-xs">
        <p className="section-no">Circuit Aurora</p>
        <h1 className="display mt-3 flex items-baseline gap-2 text-3xl">
          后台
          <span className="seal" aria-hidden />
        </h1>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="管理员密码"
          className="mt-8 w-full border-0 border-b border-line bg-transparent px-0 py-2.5 text-[15px] outline-none transition-colors focus:border-ink"
        />
        {error && <p className="mt-3 border-l-2 border-vermil pl-3 text-xs text-vermil">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="mt-8 w-full bg-ink px-6 py-3.5 text-sm text-paper transition-colors hover:bg-vermil disabled:opacity-50"
        >
          {busy ? '验证中…' : '进入后台'}
        </button>
      </form>
    </div>
  )
}

// ---------------- 通用表单控件 ----------------

const inputCls =
  'mt-1.5 w-full border border-line bg-paper px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-ink'
const labelCls = 'font-mono text-[11px] tracking-widest text-mute'

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
  rows = 4,
  mono,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  textarea?: boolean
  rows?: number
  mono?: boolean
}) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {textarea ? (
        <textarea
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputCls} resize-y leading-6 ${mono ? 'font-mono text-[12.5px]' : ''}`}
        />
      ) : (
        <input
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
      )}
    </div>
  )
}

// ---------------- 留言 ----------------

function Messages() {
  const [items, setItems] = useState<Message[]>([])
  const [unread, setUnread] = useState(0)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      const d = await api<{ items: Message[]; unread: number }>('/api/admin/messages')
      setItems(d.items)
      setUnread(d.unread)
      setError('')
    } catch {
      setError('读取失败，请确认服务已启动')
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const toggleRead = async (m: Message) => {
    await api('/api/admin/messages', { method: 'PATCH', body: JSON.stringify({ id: m.id, isRead: !m.isRead }) })
    void load()
  }

  const remove = async (m: Message) => {
    if (!window.confirm(`删除 ${m.name} 的留言？`)) return
    await api(`/api/admin/messages?id=${m.id}`, { method: 'DELETE' })
    void load()
  }

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-line pb-4">
        <span className="font-mono text-[11px] tracking-widest text-mute">
          共 {items.length} 条 · 未读 {unread}
        </span>
        <button
          type="button"
          onClick={() => void load()}
          className="border border-line px-3 py-1.5 font-mono text-[11px] tracking-widest text-ink-3 hover:border-ink hover:text-ink"
        >
          刷新
        </button>
      </div>

      {error && <p className="mt-6 border-l-2 border-vermil py-2 pl-4 text-sm text-vermil">{error}</p>}
      {!error && items.length === 0 && <p className="mt-10 font-serif text-[15px] text-ink-3">还没有留言。</p>}

      <ul>
        {items.map((m) => (
          <li key={m.id} className={`border-b border-line py-6 ${m.isRead ? 'opacity-55' : ''}`}>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <div className="flex flex-wrap items-baseline gap-3">
                {!m.isRead && <span className="h-1.5 w-1.5 rounded-full bg-vermil" aria-label="未读" />}
                <span className="font-serif text-lg">{m.name}</span>
                <a href={`mailto:${m.email}`} className="font-mono text-[11px] text-vermil hover:underline">
                  {m.email}
                </a>
              </div>
              <div className="flex items-center gap-4 font-mono text-[11px] tracking-widest text-mute">
                <span>{new Date(m.createdAt.replace(' ', 'T') + 'Z').toLocaleString('zh-CN')}</span>
                <button type="button" onClick={() => void toggleRead(m)} className="hover:text-ink">
                  {m.isRead ? '设为未读' : '标为已读'}
                </button>
                <button type="button" onClick={() => void remove(m)} className="hover:text-vermil">
                  删除
                </button>
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap font-serif text-[14.5px] leading-[1.9] text-ink-2">{m.message}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ---------------- 文章 ----------------

const emptyPost = (): PostRow => ({
  id: '',
  title: '',
  summary: '',
  date: new Date().toISOString().slice(0, 10),
  tags: [],
  content: '## 小标题\n\n正文…',
})

function Posts() {
  const [items, setItems] = useState<PostRow[]>([])
  const [editing, setEditing] = useState<PostRow | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    try {
      const d = await api<{ items: PostRow[] }>('/api/admin/posts')
      setItems(d.items)
    } catch {
      setMsg('读取失败，请确认服务已启动')
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const save = async () => {
    if (!editing) return
    try {
      const url = isNew ? '/api/admin/posts' : `/api/admin/posts?id=${encodeURIComponent(editing.id)}`
      await api(url, {
        method: isNew ? 'POST' : 'PUT',
        body: JSON.stringify({ ...editing, tags: editing.tags.join(',') }),
      })
      setEditing(null)
      setMsg(isNew ? '已新建' : '已保存')
      void load()
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : '保存失败')
    }
  }

  const remove = async (p: PostRow) => {
    if (!window.confirm(`删除《${p.title}》？`)) return
    await api(`/api/admin/posts?id=${encodeURIComponent(p.id)}`, { method: 'DELETE' })
    void load()
  }

  const set = (k: keyof PostRow, v: string | string[]) => setEditing((e) => (e ? { ...e, [k]: v } : e))

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <span className="font-mono text-[11px] tracking-widest text-mute">共 {items.length} 篇</span>
        <button
          type="button"
          onClick={() => {
            setEditing(emptyPost())
            setIsNew(true)
            setMsg('')
          }}
          className="bg-ink px-4 py-2 font-mono text-[11px] tracking-widest text-paper hover:bg-vermil"
        >
          + 写新文章
        </button>
      </div>

      {msg && <p className="mt-4 font-mono text-[11px] tracking-widest text-vermil">{msg}</p>}

      {editing && (
        <div className="mt-6 border border-line bg-paper-2/50 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="ID（小写字母/数字/连字符）" value={editing.id} onChange={(v) => set('id', v)} placeholder="my-new-post" />
            <Field label="日期" value={editing.date} onChange={(v) => set('date', v)} placeholder="2026-10-29" />
            <Field label="标题" value={editing.title} onChange={(v) => set('title', v)} />
            <Field label="标签（逗号分隔）" value={editing.tags.join(', ')} onChange={(v) => set('tags', v.split(/[,，]/).map((s) => s.trim()).filter(Boolean))} />
          </div>
          <div className="mt-4">
            <Field label="摘要" value={editing.summary} onChange={(v) => set('summary', v)} />
          </div>
          <div className="mt-4">
            <Field
              label="正文（Markdown：## 小标题 / **加粗** / - 列表 / `代码`）"
              value={editing.content}
              onChange={(v) => set('content', v)}
              textarea
              rows={16}
              mono
            />
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="border border-line px-4 py-2 font-mono text-[11px] tracking-widest text-ink-3 hover:border-ink hover:text-ink"
            >
              取消
            </button>
            <button
              type="button"
              onClick={() => void save()}
              className="bg-ink px-5 py-2 font-mono text-[11px] tracking-widest text-paper hover:bg-vermil"
            >
              保存
            </button>
          </div>
        </div>
      )}

      <ul>
        {items.map((p) => (
          <li key={p.id} className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line py-5">
            <div className="min-w-0">
              <span className="font-mono text-[11px] tracking-widest text-mute">{p.date}</span>
              <p className="mt-1 truncate font-serif text-lg">{p.title}</p>
            </div>
            <div className="flex items-center gap-5 font-mono text-[11px] tracking-widest">
              <button
                type="button"
                onClick={() => {
                  setEditing({ ...p, tags: [...p.tags] })
                  setIsNew(false)
                }}
                className="text-ink-3 hover:text-ink"
              >
                编辑
              </button>
              <button type="button" onClick={() => void remove(p)} className="text-ink-3 hover:text-vermil">
                删除
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ---------------- 项目 ----------------

const emptyProject = (): ProjectRow => ({
  id: '',
  title: '',
  summary: '',
  desc: '',
  tags: [],
  tech: [],
  date: new Date().toISOString().slice(0, 7),
  cover: './images/proj-website.png',
  link: '',
})

function Projects() {
  const [items, setItems] = useState<ProjectRow[]>([])
  const [editing, setEditing] = useState<ProjectRow | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [msg, setMsg] = useState('')

  const load = useCallback(async () => {
    try {
      const d = await api<{ items: ProjectRow[] }>('/api/admin/projects')
      setItems(d.items)
    } catch {
      setMsg('读取失败，请确认服务已启动')
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const save = async () => {
    if (!editing) return
    try {
      const url = isNew ? '/api/admin/projects' : `/api/admin/projects?id=${encodeURIComponent(editing.id)}`
      await api(url, {
        method: isNew ? 'POST' : 'PUT',
        body: JSON.stringify({ ...editing, tags: editing.tags.join(','), tech: editing.tech.join(',') }),
      })
      setEditing(null)
      setMsg(isNew ? '已新建' : '已保存')
      void load()
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : '保存失败')
    }
  }

  const remove = async (p: ProjectRow) => {
    if (!window.confirm(`删除「${p.title}」？`)) return
    await api(`/api/admin/projects?id=${encodeURIComponent(p.id)}`, { method: 'DELETE' })
    void load()
  }

  const set = (k: keyof ProjectRow, v: string | string[]) => setEditing((e) => (e ? { ...e, [k]: v } : e))

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <span className="font-mono text-[11px] tracking-widest text-mute">共 {items.length} 个</span>
        <button
          type="button"
          onClick={() => {
            setEditing(emptyProject())
            setIsNew(true)
            setMsg('')
          }}
          className="bg-ink px-4 py-2 font-mono text-[11px] tracking-widest text-paper hover:bg-vermil"
        >
          + 添加项目
        </button>
      </div>

      {msg && <p className="mt-4 font-mono text-[11px] tracking-widest text-vermil">{msg}</p>}

      {editing && (
        <div className="mt-6 border border-line bg-paper-2/50 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="ID（小写字母/数字/连字符）" value={editing.id} onChange={(v) => set('id', v)} placeholder="my-project" />
            <Field label="日期" value={editing.date} onChange={(v) => set('date', v)} placeholder="2026-10" />
            <Field label="标题" value={editing.title} onChange={(v) => set('title', v)} />
            <Field label="封面图路径" value={editing.cover} onChange={(v) => set('cover', v)} placeholder="./images/xxx.png" />
            <Field
              label="标签（逗号分隔）"
              value={editing.tags.join(', ')}
              onChange={(v) => set('tags', v.split(/[,，]/).map((s) => s.trim()).filter(Boolean))}
            />
            <Field
              label="技术栈（逗号分隔）"
              value={editing.tech.join(', ')}
              onChange={(v) => set('tech', v.split(/[,，]/).map((s) => s.trim()).filter(Boolean))}
            />
            <Field label="项目链接（可选）" value={editing.link ?? ''} onChange={(v) => set('link', v)} />
            <Field label="一句话简介" value={editing.summary} onChange={(v) => set('summary', v)} />
          </div>
          <div className="mt-4">
            <Field label="详情" value={editing.desc} onChange={(v) => set('desc', v)} textarea rows={6} />
          </div>
          <div className="mt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="border border-line px-4 py-2 font-mono text-[11px] tracking-widest text-ink-3 hover:border-ink hover:text-ink"
            >
              取消
            </button>
            <button
              type="button"
              onClick={() => void save()}
              className="bg-ink px-5 py-2 font-mono text-[11px] tracking-widest text-paper hover:bg-vermil"
            >
              保存
            </button>
          </div>
        </div>
      )}

      <ul>
        {items.map((p) => (
          <li key={p.id} className="flex flex-wrap items-baseline justify-between gap-3 border-b border-line py-5">
            <div className="min-w-0">
              <span className="font-mono text-[11px] tracking-widest text-mute">{p.date}</span>
              <p className="mt-1 truncate font-serif text-lg">{p.title}</p>
            </div>
            <div className="flex items-center gap-5 font-mono text-[11px] tracking-widest">
              <button
                type="button"
                onClick={() => {
                  setEditing({ ...p, tags: [...p.tags], tech: [...p.tech] })
                  setIsNew(false)
                }}
                className="text-ink-3 hover:text-ink"
              >
                编辑
              </button>
              <button type="button" onClick={() => void remove(p)} className="text-ink-3 hover:text-vermil">
                删除
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ---------------- 后台外壳 ----------------

type Tab = 'messages' | 'posts' | 'projects'

const TABS: { id: Tab; label: string }[] = [
  { id: 'messages', label: '留言' },
  { id: 'posts', label: '文章' },
  { id: 'projects', label: '项目' },
]

export default function Admin() {
  const [auth, setAuth] = useState<'loading' | 'out' | 'in'>('loading')
  const [tab, setTab] = useState<Tab>('messages')

  useEffect(() => {
    api<{ authed: boolean }>('/api/admin/login')
      .then((d) => setAuth(d.authed ? 'in' : 'out'))
      .catch(() => setAuth('out'))
  }, [])

  const logout = async () => {
    await api('/api/admin/login', { method: 'DELETE' }).catch(() => {})
    setAuth('out')
  }

  if (auth === 'loading') {
    return <div className="flex min-h-screen items-center justify-center font-mono text-xs tracking-widest text-mute">加载中…</div>
  }
  if (auth === 'out') return <Login onSuccess={() => setAuth('in')} />

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-ink/80 bg-paper/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[900px] items-center justify-between px-6">
          <div className="flex items-baseline gap-3">
            <span className="display text-lg">边伟</span>
            <span className="seal" aria-hidden />
            <span className="font-mono text-[10px] tracking-[0.2em] text-mute">ADMIN</span>
          </div>
          <div className="flex items-center gap-5 font-mono text-[11px] tracking-widest">
            <a href="./index.html" className="text-ink-3 hover:text-ink">
              查看站点 ↗
            </a>
            <button type="button" onClick={logout} className="text-ink-3 hover:text-vermil">
              退出
            </button>
          </div>
        </div>
        <nav className="mx-auto max-w-[900px] px-6">
          <ul className="flex gap-7">
            {TABS.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`relative pb-3 font-mono text-[12px] tracking-widest transition-colors ${
                    tab === t.id ? 'text-vermil' : 'text-ink-3 hover:text-ink'
                  }`}
                >
                  {t.label}
                  {tab === t.id && <span className="absolute inset-x-0 -bottom-px h-px bg-vermil" />}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-[900px] px-6 py-10">
        {tab === 'messages' && <Messages />}
        {tab === 'posts' && <Posts />}
        {tab === 'projects' && <Projects />}
      </main>
    </div>
  )
}