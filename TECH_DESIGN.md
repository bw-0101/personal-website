# 技术设计文档 TECH_DESIGN

> 版本：v1.0 · 关联文档：PRD.md、AGENTS.md

## 一、技术栈选择

| 层 | 选型 | 理由 |
|---|---|---|
| 框架 | React 18 + TypeScript | 组件化、类型安全，生态成熟 |
| 构建 | Vite 6 | 启动快、构建快，产物为纯静态 |
| 样式 | Tailwind CSS v4（@tailwindcss/vite） | 零配置、原子类、暗色主题友好 |
| 路由 | 不引入 react-router | 单页 + 锚点滚动 + 博客详情用状态切换，部署无需 SPA fallback |
| 动画 | 原生 Canvas + IntersectionObserver | 轻量，无第三方动画库依赖 |
| 数据 | TypeScript 数据模块（src/data/*.ts） | 与组件解耦，新增内容不动代码 |
| 部署 | Cloudflare Pages（静态托管，免费 CDN） | 全球加速、自动识别 Vite、Git 推送自动部署 |

## 二、项目结构

```
personal-website/
├── PRD.md / TECH_DESIGN.md / AGENTS.md / README.md
├── package.json / vite.config.ts / tsconfig.json / index.html
├── public/
│   ├── favicon.svg
│   └── avatar.svg
└── src/
    ├── main.tsx               # 入口
    ├── App.tsx                # 页面装配
    ├── index.css              # Tailwind 入口 + 主题变量 + 全局样式
    ├── data/
    │   ├── profile.ts         # 个人信息
    │   ├── skills.ts          # 技能分类
    │   ├── projects.ts        # 项目数据
    │   └── posts.ts           # 博客文章（本地 Markdown 字符串）
    ├── hooks/
    │   └── useReveal.ts       # 滚动渐入 Hook
    └── components/
        ├── Navbar.tsx         # 吸顶导航
        ├── Hero.tsx           # 首屏 + 终端打字动画
        ├── AuroraBackground.tsx  # 电路网格 + 极光 Canvas
        ├── About.tsx          # 个人介绍 + 时间线
        ├── Skills.tsx         # 技能雷达 + 熟练度
        ├── Projects.tsx       # 项目卡片 + 详情弹层
        ├── Blog.tsx           # 博客列表 + 详情视图
        ├── Contact.tsx        # 联系表单
        └── Footer.tsx
```

## 三、数据模型

```ts
interface Profile {
  name: string; title: string; tagline: string;
  email: string; socials: { github: string; bilibili: string; qq: string };
  education: { school: string; major: string; period: string }[];
  timeline: { period: string; title: string; desc: string }[];
}

interface SkillGroup { category: string; icon: string; skills: { name: string; level: number }[] }

interface Project {
  id: string; title: string; summary: string; desc: string;
  tags: string[]; tech: string[]; link?: string; date: string;
}

interface Post {
  id: string; title: string; summary: string; date: string;
  tags: string[]; content: string;   // 本地 Markdown 文本
}
```

## 四、关键技术点

| 难点 | 对策 |
|---|---|
| 终端打字机动画 | 用 `setInterval` 按字符步进渲染，结束触发 CTA 淡入 |
| 极光/网格背景性能 | Canvas 只绘制低频流动光斑（≤ 6 个），`requestAnimationFrame` 节流；`prefers-reduced-motion` 时静态渲染 |
| 滚动渐入 | 自写 `useReveal`（IntersectionObserver + CSS class 切换），组件级复用 |
| 博客 Markdown 渲染 | 自写极简解析器（标题/代码块/列表/加粗/行内代码），不引入重依赖；代码块用 pre 包裹并做转义防 XSS |
| 表单校验 | 原生校验 + 正则（邮箱/必填），提交后模拟延迟给出成功反馈 |
| 移动端体验 | Tailwind 响应式断点 + 汉堡菜单 + 内容宽度约束 |

## 五、构建与部署

- 构建：`npm run build` → 输出 `dist/`（纯静态，无服务端逻辑）；
- 部署：Cloudflare Pages 连接 GitHub 仓库，框架预设选择 **Vite**，构建命令 `npm run build`，输出目录 `dist`；
- 每次推送 main 分支自动重新部署。
