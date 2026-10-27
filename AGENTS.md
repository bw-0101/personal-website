# AGENTS.md — AI 开发协作规范

本文件是跨工具通用的项目说明（Codex / Copilot / Cursor / 豆包均会读取）。**任何 AI 在本仓库内修改代码前，必须先读本文件。**

## 一、项目概述

- 个人展示网站「终端极光 / Circuit Aurora」，深色科技风单页应用。
- 技术栈：**React 18 + TypeScript + Vite + Tailwind CSS v4**，禁止引入 react-router 与重型 UI/动画库。
- 部署目标：GitHub Pages（`gh-pages` 分支，静态 `dist/` 产物；构建 base 为相对路径）。

## 二、开发规范

1. **文档先行**：改动需求涉及功能边界时，先同步更新 `PRD.md`，再动代码。
2. **数据与组件分离**：技能 / 项目 / 文章一律改 `src/data/*.ts`，不得写死在组件里。
3. **小而分步**：一次只实现/修改一个小功能；每完成一个可运行的功能提交一次 Git。
4. **即时自测**：每次改动后运行 `npm run build`，有 TypeScript 报错必须修复后才可提交。
5. **控制变量**：修复 Bug 时一次只改一个地方；改无效立即 Git 回退，不要反复盲试。

## 三、代码风格

- TypeScript 严格模式；组件用函数组件 + hooks，不用 class 组件。
- 样式统一走 Tailwind 原子类；自定义主题色定义在 `src/index.css` 的 `@theme` 中，组件内禁止硬编码十六进制颜色。
- 组件命名 PascalCase，数据字段 camelCase；函数/变量用语义化英文命名。
- Canvas 动画统一收口在 `AuroraBackground.tsx`，其他组件不得自行开 canvas。

## 四、测试要求

- 本阶段以「构建通过 + 人工走查」为质量门：`npm run build` 通过、无 TS 错误、375px 无横向滚动、控制台无报错。
- 后续引入 vitest 时，核心工具函数（如 Markdown 解析、表单校验）必须有单测。

## 五、注意事项

- **安全红线**：Markdown 渲染必须先转义 HTML 再输出，禁止 `dangerouslySetInnerHTML` 直接注入用户可控内容；不引入任何第三方追踪脚本。
- **隐私**：网站不含真实手机号、学号等敏感信息；联系方式用占位邮箱，交付时提示用户自行替换。
- **性能**：动画尊重 `prefers-reduced-motion`；移动端光斑数量减半。
- **不要做的事**：不删除他人未要求的文件；不改动 PRD/TECH_DESIGN 中的既定选型除非用户明确要求。
