# Circuit Aurora · 个人网站

浅色「纸与墨」杂志风个人主页。**一个命令跑起整个站点**：页面、留言接口、后台都在同一个服务里。

## 端口说明

本站固定使用 **4173** 端口，与另一个项目「AI 聊天系统」（8000 端口）完全独立，两个可以同时开着用。

## 运行

```bash
npm install
npm start          # 构建 + 启动，打开 http://localhost:4173
```

就这两条。没有数据库要装、没有云服务要注册、没有环境变量要配。

- 网站首页：http://localhost:4173
- 后台：http://localhost:4173/admin （密码 `200611bw`）
- 留言数据：`data/site.db`（首次运行自动创建，已 gitignore）

开发模式（改前端热更新）：

```bash
npm run server     # 终端 1：起接口，4173 端口
npm run dev        # 终端 2：起前端，5173 端口，/api 自动转发到 4173
```

## 它为什么不是「纯静态 HTML」

| | 纯静态站 | 这个站 |
|---|---|---|
| 留言 | 假装发送成功，数据丢掉 | **真的存进 SQLite**，后台能看到 |
| 文章 / 项目 | 改代码才能更新 | **后台在线编辑**，保存即生效 |
| 后台 | 没有 | 密码登录，管理留言与内容 |
| 访问统计 | 没有 | 记录每日 PV/UV |
| 鉴权 | 没有 | HttpOnly Cookie + HMAC 签名，12 小时过期 |

## 在线修改内容

进后台 `/admin` 登录后：

- **留言**：标记已读、删除、点邮箱直接回信
- **文章**：写新文章、编辑、删除；正文用 Markdown（`##` 小标题、`**加粗**`、`- ` 列表）
- **项目**：添加、编辑、删除；封面填 `./images/文件名.png`

保存后刷新首页即可看到，**不需要改代码，也不需要重启**。
首次启动时会把 `src/data/*.ts` 里的初始内容导入数据库，之后以数据库为准；
想恢复初始内容，删掉 `data/site.db` 重启即可。

## 技术栈

- 前端：React 18 · TypeScript · Vite 6 · Tailwind CSS v4（多页：`index.html` + `admin.html`）
- 服务端：Node 内置 `http` + `node:sqlite`（Node ≥ 22），**零运行时依赖**
- 全部后端代码就是 `server/app.mjs` 一个文件

## 目录

```
server/app.mjs        服务端：静态托管 + 留言接口 + 后台接口
src/components/       展示站组件
src/admin/            后台
src/data/             个人信息 / 技能 / 项目 / 文章（改内容改这里）
src/lib/              API 客户端、访问统计、Markdown 渲染
data/site.db          留言与访问数据（自动生成，不提交）
```

## 放到公网

需要一台能跑 Node 22 的机器（VPS、一台常开的电脑、Render / Railway 都行）：

```bash
npm ci
npm run build
ADMIN_PASSWORD=你的新密码 PORT=4173 node server/app.mjs
```

用 `pm2` 或 systemd 保活即可。**一定要设置 `ADMIN_PASSWORD`**，否则会用仓库里的默认密码。
备份数据就是复制 `data/site.db` 这一个文件。

## 个性化提示

- 邮箱、GitHub、B 站链接：`src/data/profile.ts`
  （B 站目前仍是占位链接 `space.bilibili.com/your-uid`，记得换成你的 UID）
- 技能：`src/data/skills.ts`；项目：`src/data/projects.ts`；文章：`src/data/posts.ts`