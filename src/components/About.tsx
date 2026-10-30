import { useProfile } from '../hooks/useProfile'
import { useReveal } from '../hooks/useReveal'
import SectionHead from './SectionHead'

export default function About() {
  const profile = useProfile()
  const ref = useReveal<HTMLDivElement>()

  return (
    <section id="about" className="scroll-mt-24">
      <div ref={ref} className="reveal mx-auto max-w-[1200px] px-6 py-20 sm:px-8 sm:py-28">
        <SectionHead no="01" title="关于" en="ABOUT" />

        <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-10">
          {/* 正文：首字下沉，杂志式排版 */}
          <div className="lg:col-span-7">
            <p className="font-serif text-[17px] leading-[1.95] text-ink-2 sm:text-[18px]">
              <span className="float-left mr-3 mt-1 font-display text-[64px] leading-[0.85] text-vermil sm:text-[72px]">
                你
              </span>
              好，我是 <span className="font-semibold text-ink">{profile.name}</span>，{profile.title}。
              我的日常在两套思维之间切换：一端是单片机里的寄存器与中断，另一端是前端界面与云端部署。
              我相信「先把整条链路跑通，再回来打磨细节」——这个网站本身就是这句话的产物。
            </p>
            <p className="mt-6 font-serif text-[17px] leading-[1.95] text-ink-2 sm:text-[18px]">
              当前主要精力投入在 <span className="text-vermil">电子信息方向考研</span> 与项目积累上，
              业余时间研究 AI 辅助开发与内容创作工作流。
            </p>

            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
              {(profile.interests ?? []).map((tag) => (
                <span key={tag} className="flex items-center gap-2 text-sm text-ink-3">
                  <span className="h-1 w-1 bg-vermil" aria-hidden />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* 教育 + 时间轴 */}
          <div className="lg:col-span-5">
            <div className="border-t border-line pt-6">
              <p className="section-no">教育</p>
              {profile.education.map((e) => (
                <div key={e.school} className="mt-4">
                  <p className="font-serif text-xl text-ink">{e.school}</p>
                  <p className="mt-1 text-sm text-ink-3">{e.major}</p>
                  <p className="mt-1 font-mono text-[11px] tracking-widest text-mute">{e.period}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 border-t border-line pt-6">
              <p className="section-no">经历</p>
              <ol className="mt-5">
                {profile.timeline.map((item) => (
                  <li key={item.title} className="relative border-l border-line pb-7 pl-5 last:pb-0">
                    <span className="absolute -left-[3.5px] top-1.5 h-1.5 w-1.5 rounded-full bg-vermil" aria-hidden />
                    <span className="font-mono text-[11px] tracking-widest text-mute">{item.period}</span>
                    <h3 className="mt-1 font-serif text-[17px] text-ink">{item.title}</h3>
                    <p className="mt-1.5 text-[13.5px] leading-6 text-ink-3">{item.desc}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}