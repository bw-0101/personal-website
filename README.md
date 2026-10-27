# Circuit Aurora · 个人展示网站

深色终端美学个人主页：墨黑底 + 电路网格 + 荧光青绿主色 + 极光 Canvas。

## 技术栈

React 18 · TypeScript · Vite · Tailwind CSS v4（无路由、纯静态产物）

## 快速开始

```bash
npm install
npm run dev      # 本地开发 http://localhost:5173
npm run build    # 产出 dist/
npm run preview  # 预览构建产物
```

## 目录

```
PRD.md / TECH_DESIGN.md / AGENTS.md   # 文档先行三件套
src/data/                             # 个人信息 / 技能 / 项目 / 博客数据
src/components/                       # 页面组件
src/lib/markdown.tsx                  # 极简安全 Markdown 渲染
```

## 部署

已部署到 **GitHub Pages**：https://bw-0101.github.io/personal-website/

流程：构建产物推送到 `gh-pages` 分支（含 `.nojekyll`，站点文件在分支根目录），仓库 Pages 设置指向该分支即可。后续更新：重新构建后再次推送 gh-pages 分支。

## 个性化提示

- 邮箱、GitHub、B 站链接在 `src/data/profile.ts` 中替换；
- 技能 / 项目 / 文章分别在 `src/data/skills.ts`、`projects.ts`、`posts.ts` 中维护；
- 头像占位图为 `public/avatar.svg`，可替换为自己的照片（保持 1:1）。
