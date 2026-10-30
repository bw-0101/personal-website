/**
 * Circuit Aurora · 极简服务端
 *
 * 一个文件跑起整个站点：静态页面 + 内容接口 + 留言接口 + 后台接口。
 * 数据库用 Node 22 自带的 node:sqlite，不需要安装数据库、不需要云服务。
 *
 * 启动：npm run server       （默认 http://localhost:4173）
 * 生产：NODE_ENV=production PORT=4173 node server/app.mjs
 *
 * 环境变量（都可不填，只有密码必须有）：
 *   ADMIN_PASSWORD  后台登录密码（不填用默认值，并在启动时警告）
 *   DATA_DIR        数据文件目录，默认 ./data
 *   PORT            端口，默认 4173
 */
import http from 'node:http'
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'
import { DatabaseSync } from 'node:sqlite'
import { seedPosts, seedProjects } from './seed-data.mjs'
import { seedProfile } from './seed-profile.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST = path.join(ROOT, 'dist')
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(ROOT, 'data'))
const PORT = Number(process.env.PORT || 4173)
const IS_PROD = process.env.NODE_ENV === 'production'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '200611bw'
const SESSION_SECRET = process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex')

// 生产环境（公网部署）必须自己设密码，否则任何人都能用默认密码进后台
if (IS_PROD) {
  if (!process.env.ADMIN_PASSWORD) {
    console.error('[fatal] 生产环境必须设置 ADMIN_PASSWORD 环境变量，拒绝以默认密码启动')
    process.exit(1)
  }
  if (!process.env.SESSION_SECRET) {
    console.error('[fatal] 生产环境必须设置 SESSION_SECRET 环境变量')
    process.exit(1)
  }
}

// ---------------- 数据库 ----------------

fs.mkdirSync(DATA_DIR, { recursive: true })
const db = new DatabaseSync(path.join(DATA_DIR, 'site.db'))

db.exec(`
  CREATE TABLE IF NOT EXISTS messages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    message    TEXT NOT NULL,
    is_read    INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
  CREATE TABLE IF NOT EXISTS visits (
    day TEXT NOT NULL,
    views INTEGER NOT NULL DEFAULT 0,
    visitors TEXT NOT NULL DEFAULT '[]',
    PRIMARY KEY (day)
  );
  -- 个人资料：整份 JSON 存一行，后台可在线编辑
  CREATE TABLE IF NOT EXISTS profile (
    id   INTEGER PRIMARY KEY CHECK (id = 1),
    data TEXT NOT NULL
  );
  -- 文章与项目：首次启动时从 src/data 灌入，之后在后台在线编辑
  CREATE TABLE IF NOT EXISTS posts (
    id         TEXT PRIMARY KEY,
    title      TEXT NOT NULL,
    summary    TEXT NOT NULL DEFAULT '',
    date       TEXT NOT NULL DEFAULT '',
    tags       TEXT NOT NULL DEFAULT '[]',
    content    TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS projects (
    id         TEXT PRIMARY KEY,
    title      TEXT NOT NULL,
    summary    TEXT NOT NULL DEFAULT '',
    descr      TEXT NOT NULL DEFAULT '',
    tags       TEXT NOT NULL DEFAULT '[]',
    tech       TEXT NOT NULL DEFAULT '[]',
    date       TEXT NOT NULL DEFAULT '',
    cover      TEXT NOT NULL DEFAULT '',
    link       TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0
  );
`)

const q = {
  insertMessage: db.prepare('INSERT INTO messages (name, email, message) VALUES (?, ?, ?)'),
  listMessages: db.prepare('SELECT * FROM messages ORDER BY id DESC LIMIT ?'),
  unreadCount: db.prepare('SELECT COUNT(*) AS n FROM messages WHERE is_read = 0'),
  markRead: db.prepare('UPDATE messages SET is_read = ? WHERE id = ?'),
  deleteMessage: db.prepare('DELETE FROM messages WHERE id = ?'),
  getVisit: db.prepare('SELECT * FROM visits WHERE day = ?'),
  upsertVisit: db.prepare(
    `INSERT INTO visits (day, views, visitors) VALUES (?, ?, ?)
     ON CONFLICT(day) DO UPDATE SET views = excluded.views, visitors = excluded.visitors`,
  ),
  allVisits: db.prepare('SELECT * FROM visits ORDER BY day DESC LIMIT 30'),

  getProfile: db.prepare('SELECT data FROM profile WHERE id = 1'),
  saveProfile: db.prepare(
    'INSERT INTO profile (id, data) VALUES (1, ?) ON CONFLICT(id) DO UPDATE SET data = excluded.data',
  ),

  countPosts: db.prepare('SELECT COUNT(*) AS n FROM posts'),
  listPosts: db.prepare('SELECT * FROM posts ORDER BY sort_order ASC'),
  getPost: db.prepare('SELECT * FROM posts WHERE id = ?'),
  insertPost: db.prepare(
    'INSERT INTO posts (id, title, summary, date, tags, content, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)',
  ),
  updatePost: db.prepare(
    'UPDATE posts SET title = ?, summary = ?, date = ?, tags = ?, content = ? WHERE id = ?',
  ),
  deletePost: db.prepare('DELETE FROM posts WHERE id = ?'),

  countProjects: db.prepare('SELECT COUNT(*) AS n FROM projects'),
  listProjects: db.prepare('SELECT * FROM projects ORDER BY sort_order ASC'),
  getProject: db.prepare('SELECT * FROM projects WHERE id = ?'),
  insertProject: db.prepare(
    `INSERT INTO projects (id, title, summary, descr, tags, tech, date, cover, link, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ),
  updateProject: db.prepare(
    'UPDATE projects SET title = ?, summary = ?, descr = ?, tags = ?, tech = ?, date = ?, cover = ?, link = ? WHERE id = ?',
  ),
  deleteProject: db.prepare('DELETE FROM projects WHERE id = ?'),
}

/** 首次启动：把 src/data 里的初始内容灌进数据库（表为空时才做） */
function seed() {
  if (q.countPosts.get().n === 0) {
    seedPosts.forEach((p, i) =>
      q.insertPost.run(p.id, p.title, p.summary || '', p.date || '', JSON.stringify(p.tags || []), p.content || '', i),
    )
    console.log(`[seed] 已导入 ${seedPosts.length} 篇文章`)
  }
  if (q.countProjects.get().n === 0) {
    seedProjects.forEach((p, i) =>
      q.insertProject.run(
        p.id,
        p.title,
        p.summary || '',
        p.desc || '',
        JSON.stringify(p.tags || []),
        JSON.stringify(p.tech || []),
        p.date || '',
        p.cover || '',
        p.link || '',
        i,
      ),
    )
    console.log(`[seed] 已导入 ${seedProjects.length} 个项目`)
  }
  // 个人资料：首次启动写入默认值，之后以数据库为准
  if (!q.getProfile.get()) {
    q.saveProfile.run(JSON.stringify(seedProfile))
    console.log('[seed] 已写入默认个人资料')
  }
}
seed()

// ---------------- 工具 ----------------

const json = (res, status, body) => {
  const payload = JSON.stringify(body)
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Content-Length': Buffer.byteLength(payload),
  })
  res.end(payload)
}

const readBody = (req) =>
  new Promise((resolve) => {
    let raw = ''
    req.on('data', (c) => {
      raw += c
      if (raw.length > 100_000) req.destroy()
    })
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {})
      } catch {
        resolve({})
      }
    })
  })

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)
const text = (v, max) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

function sign(exp) {
  return crypto.createHmac('sha256', SESSION_SECRET).update(String(exp)).digest('hex')
}

function safeEqual(a, b) {
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  return ba.length === bb.length && crypto.timingSafeEqual(ba, bb)
}

function authed(req) {
  const cookie = req.headers.cookie || ''
  const m = cookie.match(/(?:^|;\s*)ca_admin=(\d+)\.([a-f0-9]+)/)
  if (!m) return false
  const [, exp, sig] = m
  if (Number(exp) * 1000 < Date.now()) return false
  return safeEqual(sig, sign(exp))
}

/** 简单限流：同一 IP 10 分钟内最多 5 条留言 */
const hits = new Map()
function tooMany(ip) {
  const now = Date.now()
  const list = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000)
  list.push(now)
  hits.set(ip, list)
  return list.length > 5
}

const clientIp = (req) => (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '').split(',')[0].trim()

// ---------------- 行 → 前端对象 ----------------

const parseArr = (s) => {
  try {
    const v = JSON.parse(s || '[]')
    return Array.isArray(v) ? v : []
  } catch {
    return []
  }
}

const toPost = (r) => ({
  id: r.id,
  title: r.title,
  summary: r.summary,
  date: r.date,
  tags: parseArr(r.tags),
  content: r.content,
})

const toProject = (r) => ({
  id: r.id,
  title: r.title,
  summary: r.summary,
  desc: r.descr,
  tags: parseArr(r.tags),
  tech: parseArr(r.tech),
  date: r.date,
  cover: r.cover,
  ...(r.link ? { link: r.link } : {}),
})

/** "a, b，c" → ['a','b','c']；也接受数组 */
const toArr = (v, max = 12) => {
  const list = Array.isArray(v) ? v : typeof v === 'string' ? v.split(/[,，]/) : []
  return list.map((s) => String(s).trim().slice(0, 40)).filter(Boolean).slice(0, max)
}

const slugOk = (id) => /^[a-z0-9][a-z0-9-]{0,63}$/i.test(id)

// ---------------- 接口 ----------------

async function api(req, res, url) {
  const route = url.pathname
  const method = req.method

  // 公开：个人资料
  if (route === '/api/profile' && method === 'GET') {
    const row = q.getProfile.get()
    let data = seedProfile
    if (row) {
      try {
        data = JSON.parse(row.data)
      } catch {
        /* 数据损坏时回退默认值 */
      }
    }
    return json(res, 200, data)
  }

  // 公开：文章列表 / 单篇
  if (route === '/api/posts' && method === 'GET') {
    const id = url.searchParams.get('id')
    if (id) {
      const row = q.getPost.get(id)
      return row ? json(res, 200, toPost(row)) : json(res, 404, { message: '文章不存在' })
    }
    return json(res, 200, { items: q.listPosts.all().map(toPost) })
  }

  // 公开：项目列表
  if (route === '/api/projects' && method === 'GET') {
    return json(res, 200, { items: q.listProjects.all().map(toProject) })
  }

  // 公开：留言板
  if (route === '/api/guestbook') {
    if (method === 'GET') {
      const rows = q.listMessages.all(20)
      return json(res, 200, {
        count: rows.length,
        items: rows.map((r) => ({ name: r.name, message: r.message, createdAt: r.created_at })),
      })
    }
    if (method === 'POST') {
      const body = await readBody(req)
      const name = text(body.name, 40)
      const email = text(body.email, 120)
      const message = text(body.message, 2000)
      if (name.length < 2) return json(res, 400, { message: '姓名至少 2 个字符' })
      if (!isEmail(email)) return json(res, 400, { message: '邮箱格式不正确' })
      if (message.length < 10) return json(res, 400, { message: '留言至少 10 个字符' })
      if (tooMany(clientIp(req))) return json(res, 429, { message: '留言太频繁了，请稍后再试' })
      const info = q.insertMessage.run(name, email, message)
      console.log(`[留言] #${info.lastInsertRowid} ${name} <${email}>`)
      return json(res, 201, { ok: true, id: Number(info.lastInsertRowid) })
    }
  }

  // 公开：访问统计
  if (route === '/api/visits' && method === 'POST') {
    const body = await readBody(req)
    const vid = text(body.visitorId, 64)
    const today = new Date().toISOString().slice(0, 10)
    const row = q.getVisit.get(today)
    const visitors = row ? JSON.parse(row.visitors) : []
    if (vid && !visitors.includes(vid)) visitors.push(vid)
    q.upsertVisit.run(today, (row?.views || 0) + 1, JSON.stringify(visitors))
    return json(res, 200, { ok: true })
  }

  // 后台：登录 / 登出 / 会话
  if (route === '/api/admin/login') {
    if (method === 'GET') return json(res, 200, { authed: authed(req) })
    if (method === 'POST') {
      const body = await readBody(req)
      const pwd = text(body.password, 200)
      if (!pwd || !safeEqual(pwd, ADMIN_PASSWORD)) {
        return json(res, 401, { message: '密码不正确' })
      }
      const exp = Math.floor(Date.now() / 1000) + 12 * 3600
      const secure = req.headers['x-forwarded-proto'] === 'https' ? '; Secure' : ''
      res.setHeader('Set-Cookie', `ca_admin=${exp}.${sign(exp)}; Path=/; HttpOnly; SameSite=Lax${secure}; Max-Age=43200`)
      return json(res, 200, { ok: true })
    }
    if (method === 'DELETE') {
      res.setHeader('Set-Cookie', 'ca_admin=; Path=/; HttpOnly; Max-Age=0')
      return json(res, 200, { ok: true })
    }
  }

  // 以下接口需要登录
  if (route.startsWith('/api/admin/')) {
    if (!authed(req)) return json(res, 401, { message: '请先登录' })
  }

  if (route === '/api/admin/messages') {
    if (method === 'GET') {
      const rows = q.listMessages.all(200)
      return json(res, 200, {
        unread: q.unreadCount.get().n,
        items: rows.map((r) => ({
          id: r.id,
          name: r.name,
          email: r.email,
          message: r.message,
          isRead: Boolean(r.is_read),
          createdAt: r.created_at,
        })),
      })
    }
    if (method === 'PATCH') {
      const body = await readBody(req)
      q.markRead.run(body.isRead ? 1 : 0, Number(body.id))
      return json(res, 200, { ok: true })
    }
    if (method === 'DELETE') {
      q.deleteMessage.run(Number(url.searchParams.get('id')))
      return json(res, 200, { ok: true })
    }
  }

  // ---------- 文章管理 ----------
  if (route === '/api/admin/posts') {
    if (method === 'GET') {
      return json(res, 200, { items: q.listPosts.all().map(toPost) })
    }
    if (method === 'POST' || method === 'PUT') {
      const b = await readBody(req)
      const id = (method === 'PUT' ? url.searchParams.get('id') : b.id || '').trim()
      if (!slugOk(id)) return json(res, 400, { message: 'id 只能用小写字母、数字和连字符' })
      const title = text(b.title, 120)
      if (title.length < 2) return json(res, 400, { message: '标题至少 2 个字符' })
      const tags = JSON.stringify(toArr(b.tags))
      const date = text(b.date, 20) || new Date().toISOString().slice(0, 10)
      const summary = text(b.summary, 300)
      const content = typeof b.content === 'string' ? b.content.slice(0, 100_000) : ''

      if (method === 'POST') {
        if (q.getPost.get(id)) return json(res, 400, { message: '这个 id 已经存在了' })
        const maxOrder = q.listPosts.all().reduce((m, r) => Math.max(m, r.sort_order), -1)
        q.insertPost.run(id, title, summary, date, tags, content, maxOrder + 1)
      } else {
        if (!q.getPost.get(id)) return json(res, 404, { message: '文章不存在' })
        q.updatePost.run(title, summary, date, tags, content, id)
      }
      return json(res, 200, { ok: true, id })
    }
    if (method === 'DELETE') {
      q.deletePost.run(String(url.searchParams.get('id') || ''))
      return json(res, 200, { ok: true })
    }
  }

  // ---------- 项目管理 ----------
  if (route === '/api/admin/projects') {
    if (method === 'GET') {
      return json(res, 200, { items: q.listProjects.all().map(toProject) })
    }
    if (method === 'POST' || method === 'PUT') {
      const b = await readBody(req)
      const id = (method === 'PUT' ? url.searchParams.get('id') : b.id || '').trim()
      if (!slugOk(id)) return json(res, 400, { message: 'id 只能用小写字母、数字和连字符' })
      const title = text(b.title, 120)
      if (title.length < 2) return json(res, 400, { message: '标题至少 2 个字符' })
      const row = [
        title,
        text(b.summary, 300),
        typeof b.desc === 'string' ? b.desc.slice(0, 5000) : '',
        JSON.stringify(toArr(b.tags)),
        JSON.stringify(toArr(b.tech)),
        text(b.date, 20),
        text(b.cover, 300),
        text(b.link, 300),
      ]

      if (method === 'POST') {
        if (q.getProject.get(id)) return json(res, 400, { message: '这个 id 已经存在了' })
        const maxOrder = q.listProjects.all().reduce((m, r) => Math.max(m, r.sort_order), -1)
        q.insertProject.run(id, ...row, maxOrder + 1)
      } else {
        if (!q.getProject.get(id)) return json(res, 404, { message: '项目不存在' })
        q.updateProject.run(...row, id)
      }
      return json(res, 200, { ok: true, id })
    }
    if (method === 'DELETE') {
      q.deleteProject.run(String(url.searchParams.get('id') || ''))
      return json(res, 200, { ok: true })
    }
  }

  if (route === '/api/admin/stats' && method === 'GET') {
    const rows = q.allVisits.all()
    const total = rows.reduce((s, r) => s + r.views, 0)
    return json(res, 200, {
      total: { views: total },
      today: rows[0] ? { views: rows[0].views, visitors: JSON.parse(rows[0].visitors).length } : { views: 0, visitors: 0 },
      days: [...rows].reverse().map((r) => ({ day: r.day, views: r.views, visitors: JSON.parse(r.visitors).length })),
    })
  }

  // ---------- 个人资料管理 ----------
  if (route === '/api/admin/profile') {
    if (method === 'GET') {
      const row = q.getProfile.get()
      return json(res, 200, row ? JSON.parse(row.data) : seedProfile)
    }
    if (method === 'PUT') {
      const b = await readBody(req)
      if (!b || typeof b !== 'object') return json(res, 400, { message: '资料格式不正确' })
      if (text(b.name, 40).length < 1) return json(res, 400, { message: '名字不能为空' })
      if (b.email && !isEmail(text(b.email, 120))) return json(res, 400, { message: '邮箱格式不正确' })

      // 只保留已知字段，避免写入乱七八糟的内容
      const clean = {
        name: text(b.name, 40),
        title: text(b.title, 100),
        tagline: text(b.tagline, 300),
        email: text(b.email, 120),
        location: text(b.location, 60),
        socials: {
          github: text(b.socials?.github, 300),
          bilibili: text(b.socials?.bilibili, 300),
          qq: text(b.socials?.qq, 120),
        },
        education: Array.isArray(b.education)
          ? b.education.slice(0, 10).map((e) => ({
              school: text(e?.school, 80),
              major: text(e?.major, 120),
              period: text(e?.period, 60),
            }))
          : [],
        timeline: Array.isArray(b.timeline)
          ? b.timeline.slice(0, 20).map((t) => ({
              period: text(t?.period, 60),
              title: text(t?.title, 80),
              desc: text(t?.desc, 300),
            }))
          : [],
        skills: Array.isArray(b.skills)
          ? b.skills
              .slice(0, 30)
              .map((s) => ({ name: text(s?.name, 60), level: Math.max(0, Math.min(100, Number(s?.level) || 0)) }))
              .filter((s) => s.name)
          : [],
        interests: Array.isArray(b.interests)
          ? b.interests.slice(0, 10).map((s) => text(s, 30)).filter(Boolean)
          : [],
      }
      q.saveProfile.run(JSON.stringify(clean))
      return json(res, 200, { ok: true })
    }
  }

  return json(res, 404, { message: '接口不存在' })
}

// ---------------- 静态文件 ----------------

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.json': 'application/json',
  '.ico': 'image/x-icon',
}

function serveStatic(req, res, url) {
  let rel = decodeURIComponent(url.pathname)
  if (rel === '/' || rel === '') rel = '/index.html'
  if (!path.extname(rel)) rel += '.html' // /admin → /admin.html
  const file = path.join(DIST, rel)
  if (!file.startsWith(DIST)) {
    res.writeHead(403).end('Forbidden')
    return
  }
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }).end('Not Found')
    return
  }
  const ext = path.extname(file)
  res.writeHead(200, {
    'Content-Type': MIME[ext] || 'application/octet-stream',
    // 带哈希的资源长缓存，html 不缓存
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
  })
  fs.createReadStream(file).pipe(res)
}

// ---------------- 启动 ----------------

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
  try {
    if (url.pathname.startsWith('/api/')) {
      await api(req, res, url)
      return
    }
    serveStatic(req, res, url)
  } catch (err) {
    console.error('[error]', err)
    if (!res.headersSent) json(res, 500, { message: '服务器错误' })
  }
})

// 显式监听所有网卡：云服务器上必须 0.0.0.0，否则外网访问不到
const HOST = process.env.HOST || '0.0.0.0'

server.listen(PORT, HOST, () => {
  console.log(`\n  Circuit Aurora 已启动  →  http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}`)
  console.log(`  后台                    →  http://${HOST === '0.0.0.0' ? 'localhost' : HOST}:${PORT}/admin`)
  console.log(`  监听地址                →  ${HOST}:${PORT}`)
  console.log(`  数据文件                →  ${path.join(DATA_DIR, 'site.db')}\n`)
})