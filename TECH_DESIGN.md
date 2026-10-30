# 技术设计文档 TECH_DESIGN

> 版本：v3.0 · 关联文档：PRD.md、AGENTS.md、README.md

## 一、选型

| 层 | 选型 | 理由 |
|---|---|---|
| 框架 | React 18 + TypeScript | 组件化、类型安全 |
| 构建 | Vite 6，多页（`index.html` + `admin.html`） | 后台不进展示站主包 |
| 样式 | Tailwind CSS v4 | 主题集中在 `@theme` |
| 服务端 | Node 内置 `http` 模块 | 零依赖，一个文件 |
| 数据库 | Node 内置 `node:sqlite` | 无需安装、无需云服务、单文件备份 |
| 鉴权 | HMAC-SHA256 签名 Cookie | 无需会话表 |

**为什么不用 Vercel + Postgres**：需要两个平台、跨域配置、环境变量、外部数据库，
部署失败点太多。本站流量极小，单进程 + SQLite 完全够用且更可靠。

## 二、架构

```
浏览器
  │
  ├─ GET  /              → dist/index.html（展示站）
  ├─ GET  /admin         → dist/admin.html（后台）
  ├─ GET  /api/guestbook → 留言列表（昵称/正文/时间，不含邮箱）
  ├─ POST /api/guestbook → 提交留言
  ├─ POST /api/visits    → 访问上报
  └─ /api/admin/*        → 需登录：留言管理、统计
        │
        └─ data/site.db（SQLite，单文件）
```

前后端同源，不存在跨域问题，不需要任何 API 地址配置。

## 三、数据模型

```sql
messages(id INTEGER PK AUTOINCREMENT, name, email, message, is_read, created_at)
visits  (day TEXT PK, views INTEGER, visitors TEXT)  -- visitors 存 JSON 数组做 UV 去重
```

启动时 `CREATE TABLE IF NOT EXISTS`，无需迁移脚本。删除 `data/site.db` 即重置全部数据。

## 四、接口

| 方法 | 路径 | 鉴权 | 说明 |
|---|---|---|---|
| GET | `/api/guestbook` | 否 | 留言板，最多 20 条 |
| POST | `/api/guestbook` | 否 | 提交，校验 + 同 IP 10 分钟最多 5 条 |
| POST | `/api/visits` | 否 | 访问计数 |
| GET/POST/DELETE | `/api/admin/login` | — | 查询会话 / 登录 / 登出 |
| GET | `/api/admin/messages` | 是 | 全部留言 + 未读数 |
| PATCH | `/api/admin/messages` | 是 | 标记已读/未读 |
| DELETE | `/api/admin/messages?id=` | 是 | 删除 |
| GET | `/api/admin/stats` | 是 | 最近 30 天 PV/UV |

## 五、关键实现

| 点 | 做法 |
|---|---|
| 密码比对 | `crypto.timingSafeEqual` 定长比较 |
| 会话 | Cookie 存 `过期时间戳.HMAC签名`，HttpOnly + SameSite=Lax，12 小时 |
| 限流 | 内存 Map 按 IP 计数（10 分钟 5 条），进程重启清零 |
| 路径穿越 | 静态文件路径 `path.join` 后校验必须位于 `dist/` 内 |
| 缓存 | 带哈希的资源 `immutable` 长缓存，HTML `no-cache` |
| UTF-8 | 请求体按 UTF-8 解析，响应统一 `charset=utf-8` |

## 六、本地开发

```bash
npm install
npm start            # 构建 + 启动 4173
# 或
npm run server       # 只起服务端
npm run dev          # 前端热更新，/api 代理到 4173
```