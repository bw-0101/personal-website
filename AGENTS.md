# AGENTS.md — AI 开发协作规范

本文件是跨工具通用的项目说明（Codex / Copilot / Cursor / 豆包均会读取）。**任何 AI 在本仓库内修改代码前，必须先读本文件。**

## 一、项目概述

- 个人网站「纸与墨 / Circuit Aurora」，**浅色杂志风**单页应用 + 独立后台。
- 前端：**React 18 + TypeScript + Vite + Tailwind CSS v4**，多页构建（`index.html` + `admin.html`）。
  禁止引入 react-router、重型 UI/动画库、以及任何数据库客户端库。
- 服务端：**`server/app.mjs` 单文件**，只用 Node 内置 `http` + `node:sqlite`，零运行时依赖。
- 运行：`npm start` → 构建并启动 4173 端口；`npm run server` + `npm run dev` 用于开发。

## 二、开发规范

1. **文档先行**：改动需求涉及功能边界时，先同步更新 `PRD.md` 与 `README.md`，再动代码。
2. **数据与组件分离**：技能 / 项目 / 文章在 `src/data/*.ts`；只有留言进数据库。
3. **保持简单**：不引入新依赖、不引入 ORM、不引入云服务。后端能用一个文件写完就不要拆。
4. **即时自测**：每次改动后运行 `npm run build`（含 `tsc -b`），有类型错误必须修复后才可提交。
5. **控制变量**：修复 Bug 时一次只改一个地方；改无效立即 Git 回退，不要反复盲试。

## 三、代码风格

- TypeScript 严格模式；组件用函数组件 + hooks，不用 class 组件。
- 样式统一走 Tailwind 原子类；自定义色与字体定义在 `src/index.css` 的 `@theme` 中，组件内禁止硬编码十六进制颜色。
  - 可用语义色：`paper / paper-2 / paper-3 / ink / ink-2 / ink-3 / mute / line / line-2 / vermil / moss`。
  - **朱红 `vermil` 是唯一重音色**，一屏内最多用两三处。
- 组件命名 PascalCase，数据字段 camelCase；函数/变量用语义化英文命名。

## 四、测试要求

- 质量门：`npm run build` 通过、无 TS 错误、375px 无横向滚动、控制台无报错。
- 页面改动后需用无头浏览器截图自查桌面（1440）与移动（390）两档。
- 服务端改动需覆盖：参数校验、未登录 401、错误密码 401、中文 UTF-8 存取、增删改。

## 五、注意事项

- **安全红线**：Markdown 渲染必须走 React 文本节点，禁止 `dangerouslySetInnerHTML`。
- **密钥**：`ADMIN_PASSWORD` 只从环境变量读，默认值仅供本地开发；生产必须显式设置。
- **隐私**：公开留言接口只返回昵称/正文/时间，绝不返回访客邮箱；访问统计不采集身份信息。
- **数据**：`data/` 目录已 gitignore，任何情况下不要把 `site.db` 提交进仓库。
- **性能**：动画尊重 `prefers-reduced-motion`；移动端关闭纸纹等装饰。