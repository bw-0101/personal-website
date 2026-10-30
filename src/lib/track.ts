/**
 * 极轻的匿名访问统计：首屏加载后发一次事件。
 * - 不使用第三方脚本
 * - visitor id 存 localStorage，仅用于去重，不含任何个人信息
 * - 服务没起时静默失败，绝不影响页面
 */
import { apiUrl } from './api'

const VID_KEY = 'ca_vid'

function visitorId(): string {
  try {
    const today = new Date().toISOString().slice(0, 10)
    const raw = localStorage.getItem(VID_KEY)
    if (raw) {
      const [day, id] = raw.split('|')
      if (day === today && id) return id
    }
    const id = crypto.randomUUID().replace(/-/g, '')
    localStorage.setItem(VID_KEY, `${today}|${id}`)
    return id
  } catch {
    return ''
  }
}

export function trackVisit(): void {
  // 管理页不统计，避免自己刷数据
  if (window.location.pathname.includes('/admin')) return
  try {
    void fetch(apiUrl('/api/visits'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ visitorId: visitorId() }),
      keepalive: true,
    }).catch(() => {})
  } catch {
    /* 忽略 */
  }
}