import { profile } from '../data/profile'
import { useReveal } from '../hooks/useReveal'

export default function About() {
  const ref = useReveal<HTMLDivElement>()

  return (
    <section id="about" className="mx-auto max-w-[1180px] scroll-mt-24 px-5 py-24">
      <div ref={ref} className="reveal">
        <p className="font-mono text-xs text-teal">// 01</p>
        <h2 className="mt-2 font-display text-3xl font-bold text-mist sm:text-4xl">
          about<span className="text-teal">()</span>
        </h2>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="neon-card rounded-xl p-6 lg:col-span-2">
            <h3 className="font-mono text-sm font-semibold text-amber">简介</h3>
            <p className="mt-4 text-[15px] leading-7 text-mist/90">
              你好，我是 <span className="font-semibold text-teal">{profile.name}</span>，
              {profile.title}。我的日常在两套思维之间切换：一端是单片机里的寄存器与中断，另一端是前端界面与云端部署。
              我相信「先把整条链路跑通，再回来打磨细节」——这个网站本身就是这句话的产物。
            </p>
            <p className="mt-4 text-[15px] leading-7 text-mist/90">
              当前主要精力投入在 <span className="text-amber">电子信息方向考研</span> 与毕业项目积累上，
              业余时间研究 AI 辅助开发与内容创作工作流。
            </p>

            <div className="mt-6 rounded-lg border border-white/10 bg-ink/60 p-4 font-mono text-[13px] leading-6 text-mute">
              <p><span className="text-teal">$</span> interest --list</p>
              <p>→ 嵌入式 · Web 全栈 · AI 工具链 · 数字内容创作</p>
            </div>
          </div>

          <div className="neon-card rounded-xl p-6">
            <h3 className="font-mono text-sm font-semibold text-amber">教育背景</h3>
            {profile.education.map((e) => (
              <div key={e.school} className="mt-4">
                <p className="text-[15px] font-semibold text-mist">{e.school}</p>
                <p className="mt-1 text-sm text-mute">{e.major}</p>
                <p className="mt-1 font-mono text-xs text-teal/70">{e.period}</p>
              </div>
            ))}
            <div className="mt-6 border-t border-white/10 pt-5">
              <h3 className="font-mono text-sm font-semibold text-amber">坐标</h3>
              <p className="mt-3 text-sm text-mute">{profile.location}</p>
            </div>
          </div>
        </div>

        {/* 时间线 */}
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          <div className="neon-card rounded-xl p-6 lg:col-span-3">
            <h3 className="font-mono text-sm font-semibold text-amber">经历时间线</h3>
            <ol className="mt-6 space-y-0">
              {profile.timeline.map((item, i) => (
                <li key={item.title} className="relative border-l border-teal/20 pb-8 pl-6 last:pb-0">
                  <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-teal shadow-[0_0_8px_rgba(45,229,176,0.8)]" />
                  <span className="font-mono text-xs text-teal/80">{item.period}</span>
                  <h4 className="mt-1 text-[15px] font-semibold text-mist">{item.title}</h4>
                  <p className="mt-1.5 text-sm leading-6 text-mute">{item.desc}</p>
                  {i < profile.timeline.length - 1 && <span className="sr-only">{item.title}</span>}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
