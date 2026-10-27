export interface SkillItem {
  name: string
  level: number // 0-100，用于熟练度条
}

export interface SkillGroup {
  category: string
  icon: string
  skills: SkillItem[]
}

export const skillGroups: SkillGroup[] = [
  {
    category: '前端 / Web',
    icon: '⚡',
    skills: [
      { name: 'HTML / CSS / JavaScript', level: 80 },
      { name: 'React + TypeScript', level: 68 },
      { name: 'Vue', level: 55 },
      { name: 'Java Web（Servlet / SSM）', level: 60 },
    ],
  },
  {
    category: '嵌入式 / 硬件',
    icon: '🔌',
    skills: [
      { name: 'mCS51 单片机（Keil5）', level: 75 },
      { name: '定时器 / 中断 / 数码管 / 蜂鸣器', level: 72 },
      { name: 'PNP / NPN 三极管驱动', level: 70 },
      { name: '电路识图与焊接', level: 60 },
    ],
  },
  {
    category: 'AI 与工具链',
    icon: '🤖',
    skills: [
      { name: 'Python / PyTorch 基础', level: 55 },
      { name: 'AI 零代码平台（百度秒搭等）', level: 72 },
      { name: 'Git / GitHub 协作', level: 75 },
      { name: 'Stable Diffusion WebUI', level: 62 },
    ],
  },
]
