export interface Profile {
  name: string
  title: string
  tagline: string
  email: string
  location: string
  socials: { github: string; bilibili: string; qq: string }
  education: { school: string; major: string; period: string }[]
  timeline: { period: string; title: string; desc: string }[]
}

export const profile: Profile = {
  name: '边伟',
  title: '电子信息 / 物联网工程 · 本科在读',
  tagline: '从硬件到前端，从单片机到云上部署，我享受把电路与代码连成一条完整链路的感觉。',
  email: 'hi@bianwei.dev',
  location: '大连 · 中国',
  socials: {
    github: 'https://github.com/bw-0101',
    bilibili: 'https://space.bilibili.com/your-uid',
    qq: '3344893942@qq.com',
  },
  education: [
    {
      school: '大连民族大学',
      major: '计算机 / 物联网工程（2024 级在读）',
      period: '2024 — 至今',
    },
  ],
  timeline: [
    {
      period: '2024 至今',
      title: '本科 · 电子信息方向',
      desc: '系统学习单片机、数据结构、计算机网络与操作系统，课余钻研 Keil5 调试、定时器中断与外设驱动。',
    },
    {
      period: '2025',
      title: '项目实战期',
      desc: '参与大创项目，实践 Git 协作与软著申请流程；用 AI 辅助完成从 PRD 到部署的全流程开发。',
    },
    {
      period: '2026',
      title: '考研冲刺年',
      desc: '目标冲刺 92 院校电子信息专业；同步搭建个人网站沉淀项目与博客，备战 CET-6。',
    },
  ],
}