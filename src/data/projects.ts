export interface Project {
  id: string
  title: string
  summary: string
  desc: string
  tags: string[]
  tech: string[]
  date: string
  link?: string
}

export const projects: Project[] = [
  {
    id: 'circuit-aurora',
    title: 'Circuit Aurora 个人网站',
    summary: '本网站：AI 全流程开发，从 PRD 到部署的完整实践。',
    desc: '以「终端极光」为主题的个人展示网站，深度实践文档先行方法论：先写 PRD、技术设计、AGENTS 三份文档，再让 AI 分步实现，最后部署到 Cloudflare Pages。包含终端开机动画、极光 Canvas 背景、响应式布局与本地数据驱动的博客模块。',
    tags: ['React', 'TypeScript', 'Vite', 'Tailwind', 'Cloudflare Pages'],
    tech: ['React 18', 'TypeScript', 'Vite', 'Tailwind v4', 'Canvas API'],
    date: '2026-10',
  },
  {
    id: 'mcs51-alarm',
    title: 'mCS51 温控报警系统',
    summary: '基于 Keil5 的单片机实战：温度采集、阈值报警、数码管显示。',
    desc: '使用 mCS51 单片机在 Keil5 中完成温度传感器数据采集，通过定时器与中断实现实时刷新，超过阈值触发蜂鸣器报警并在数码管上滚动显示。重点练习了 PNP/NPN 三极管驱动、端口复用与断点调试。',
    tags: ['mCS51', 'Keil5', 'C', '嵌入式'],
    tech: ['mCS51', 'Keil5', 'C51', 'Proteus 仿真'],
    date: '2025-11',
  },
  {
    id: 'dachuang-iot',
    title: '大创项目 · 物联网感知终端',
    summary: '团队协作的物联网项目，实践 Git 分支协作与软著申请全流程。',
    desc: '参与大学生创新创业项目，负责感知终端的数据采集与上报链路设计。项目中首次完整走通 Git 分支协作、代码评审与软著申请流程，也踩过并解决了前后端联调中的状态码与日志排查问题。',
    tags: ['物联网', 'Git', '团队协作', '软著'],
    tech: ['ESP32', 'MQTT', 'Git', 'C / Python'],
    date: '2025-06',
  },
  {
    id: 'sd-workflow',
    title: 'AI 绘画工作流搭建',
    summary: '本地部署 Stable Diffusion WebUI，沉淀一套可控出图流程。',
    desc: '在本地部署 Stable Diffusion WebUI，研究不同采样器、ControlNet 与提示词结构对成图的影响，并尝试将 AIGC 用于古风/考古主题的内容创作分镜，沉淀了 16:9 横版、去水印、无文字等规范化出图指令。',
    tags: ['Python', 'Stable Diffusion', 'AIGC'],
    tech: ['Python', 'Stable Diffusion WebUI', 'ControlNet', 'ComfyUI'],
    date: '2025-08',
  },
]
