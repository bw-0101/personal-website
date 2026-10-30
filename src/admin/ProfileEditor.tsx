import { useCallback, useEffect, useState } from 'react'
import { api, ApiError } from '../lib/api'
import type { Profile } from '../hooks/useProfile'

const inputCls =
  'mt-1.5 w-full border border-line bg-paper px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-ink'
const labelCls = 'font-mono text-[11px] tracking-widest text-mute'

type Row = Record<string, string>

const EMPTY: Profile = {
  name: '',
  title: '',
  tagline: '',
  email: '',
  location: '',
  socials: { github: '', bilibili: '', qq: '' },
  education: [],
  timeline: [],
  interests: [],
}

export default function ProfileEditor() {
  const [data, setData] = useState<Profile>(EMPTY)
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  const load = useCallback(async () => {
    try {
      const d = await api<Profile>('/api/admin/profile')
      setData({ ...EMPTY, ...d, interests: d.interests ?? [] })
    } catch {
      setMsg('读取失败，请确认服务已启动')
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  const save = async () => {
    setBusy(true)
    try {
      await api('/api/admin/profile', { method: 'PUT', body: JSON.stringify(data) })
      setMsg('已保存，刷新首页即可看到')
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : '保存失败')
    } finally {
      setBusy(false)
    }
  }

  const set = (k: keyof Profile, v: unknown) => setData((d) => ({ ...d, [k]: v } as Profile))

  // 列表字段（教育 / 经历）的小工具
  const listOps = (key: 'education' | 'timeline') => ({
    add: () =>
      set(
        key,
        key === 'education'
          ? [...data.education, { school: '', major: '', period: '' }]
          : [...data.timeline, { period: '', title: '', desc: '' }],
      ),
    remove: (i: number) => set(key, (data[key] as Row[]).filter((_, idx) => idx !== i)),
    update: (i: number, field: string, v: string) =>
      set(key, (data[key] as Row[]).map((row, idx) => (idx === i ? { ...row, [field]: v } : row))),
  })

  const edu = listOps('education')
  const tml = listOps('timeline')

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
        <span className="font-mono text-[11px] tracking-widest text-mute">在这里修改的内容会直接显示在网站上</span>
        <button
          type="button"
          onClick={() => void save()}
          disabled={busy}
          className="bg-ink px-5 py-2 font-mono text-[11px] tracking-widest text-paper hover:bg-vermil disabled:opacity-50"
        >
          {busy ? '保存中…' : '保存'}
        </button>
      </div>

      {msg && <p className="mt-4 font-mono text-[11px] tracking-widest text-vermil">{msg}</p>}

      {/* 基础信息 */}
      <section className="mt-8">
        <h3 className="font-serif text-lg">基本信息</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelCls}>名字（显示在首屏大字）</label>
            <input className={inputCls} value={data.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>身份头衔</label>
            <input className={inputCls} value={data.title} onChange={(e) => set('title', e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className={labelCls}>一句话介绍（首屏正文）</label>
            <textarea
              rows={3}
              className={`${inputCls} resize-y`}
              value={data.tagline}
              onChange={(e) => set('tagline', e.target.value)}
            />
          </div>
          <div>
            <label className={labelCls}>邮箱</label>
            <input className={inputCls} value={data.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div>
            <label className={labelCls}>所在地</label>
            <input className={inputCls} value={data.location} onChange={(e) => set('location', e.target.value)} />
          </div>
        </div>
      </section>

      {/* 社交链接 */}
      <section className="mt-10 border-t border-line pt-6">
        <h3 className="font-serif text-lg">社交链接</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div>
            <label className={labelCls}>GitHub</label>
            <input
              className={inputCls}
              value={data.socials.github}
              placeholder="https://github.com/你的用户名"
              onChange={(e) => set('socials', { ...data.socials, github: e.target.value })}
            />
          </div>
          <div>
            <label className={labelCls}>B 站</label>
            <input
              className={inputCls}
              value={data.socials.bilibili}
              placeholder="https://space.bilibili.com/你的UID"
              onChange={(e) => set('socials', { ...data.socials, bilibili: e.target.value })}
            />
          </div>
          <div>
            <label className={labelCls}>QQ</label>
            <input
              className={inputCls}
              value={data.socials.qq}
              onChange={(e) => set('socials', { ...data.socials, qq: e.target.value })}
            />
          </div>
        </div>
      </section>

      {/* 兴趣标签 */}
      <section className="mt-10 border-t border-line pt-6">
        <h3 className="font-serif text-lg">兴趣标签</h3>
        <p className="mt-1 text-xs text-ink-3">显示在「关于」区块，用逗号分隔</p>
        <input
          className={inputCls}
          value={(data.interests ?? []).join(', ')}
          onChange={(e) => set('interests', e.target.value.split(/[,，]/).map((s) => s.trim()).filter(Boolean))}
        />
      </section>

      {/* 教育背景 */}
      <section className="mt-10 border-t border-line pt-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg">教育背景</h3>
          <button type="button" onClick={edu.add} className="font-mono text-[11px] tracking-widest text-vermil">
            + 添加一条
          </button>
        </div>
        {data.education.length === 0 && <p className="mt-3 text-xs text-mute">暂无</p>}
        {data.education.map((e, i) => (
          <div key={i} className="mt-4 grid gap-3 border-l-2 border-line pl-4 sm:grid-cols-[1fr_1fr_auto]">
            <div>
              <label className={labelCls}>学校</label>
              <input className={inputCls} value={e.school} onChange={(ev) => edu.update(i, 'school', ev.target.value)} />
            </div>
            <div>
              <label className={labelCls}>专业</label>
              <input className={inputCls} value={e.major} onChange={(ev) => edu.update(i, 'major', ev.target.value)} />
            </div>
            <div className="flex items-end gap-2">
              <div>
                <label className={labelCls}>时间</label>
                <input
                  className={inputCls}
                  value={e.period}
                  onChange={(ev) => edu.update(i, 'period', ev.target.value)}
                />
              </div>
              <button
                type="button"
                onClick={() => edu.remove(i)}
                className="mb-2 shrink-0 border border-line px-2 py-1.5 font-mono text-[11px] text-ink-3 hover:border-vermil hover:text-vermil"
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* 经历时间线 */}
      <section className="mt-10 border-t border-line pt-6">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-lg">经历时间线</h3>
          <button type="button" onClick={tml.add} className="font-mono text-[11px] tracking-widest text-vermil">
            + 添加一条
          </button>
        </div>
        {data.timeline.length === 0 && <p className="mt-3 text-xs text-mute">暂无</p>}
        {data.timeline.map((t, i) => (
          <div key={i} className="mt-4 border-l-2 border-line pl-4">
            <div className="grid gap-3 sm:grid-cols-[auto_1fr_auto]">
              <div>
                <label className={labelCls}>时间</label>
                <input
                  className={`${inputCls} w-full`}
                  value={t.period}
                  onChange={(ev) => tml.update(i, 'period', ev.target.value)}
                />
              </div>
              <div>
                <label className={labelCls}>标题</label>
                <input
                  className={`${inputCls} w-full`}
                  value={t.title}
                  onChange={(ev) => tml.update(i, 'title', ev.target.value)}
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => tml.remove(i)}
                  className="mb-2 border border-line px-2 py-1.5 font-mono text-[11px] text-ink-3 hover:border-vermil hover:text-vermil"
                >
                  删除
                </button>
              </div>
            </div>
            <label className={`${labelCls} mt-3 block`}>描述</label>
            <textarea
              rows={2}
              className={`${inputCls} resize-y`}
              value={t.desc}
              onChange={(ev) => tml.update(i, 'desc', ev.target.value)}
            />
          </div>
        ))}
      </section>

      <div className="mt-10 flex justify-end border-t border-line pt-6">
        <button
          type="button"
          onClick={() => void save()}
          disabled={busy}
          className="bg-ink px-7 py-3 font-mono text-[12px] tracking-widest text-paper hover:bg-vermil disabled:opacity-50"
        >
          {busy ? '保存中…' : '保存全部修改'}
        </button>
      </div>
    </div>
  )
}