/**
 * 接口客户端。
 *
 * 前后端现在是同一个服务（`npm run server`），所以直接用同源的 /api，
 * 不需要配置任何后端地址，也不存在跨域问题。
 */
export function apiUrl(path: string): string {
  return path.startsWith('/') ? path : `/${path}`
}

/** 统一 fetch：带 cookie、超时、错误归一化 */
export async function api<T>(path: string, init: RequestInit = {}, timeoutMs = 12_000): Promise<T> {
  const ctrl = new AbortController()
  const timer = window.setTimeout(() => ctrl.abort(), timeoutMs)
  try {
    const res = await fetch(apiUrl(path), {
      credentials: 'same-origin',
      ...init,
      signal: ctrl.signal,
      headers: {
        ...(init.body ? { 'Content-Type': 'application/json' } : {}),
        ...(init.headers ?? {}),
      },
    })
    const raw = await res.text()
    let data: unknown = {}
    try {
      data = raw ? JSON.parse(raw) : {}
    } catch {
      data = {}
    }
    if (!res.ok) {
      const message = (data as { message?: string }).message
      throw new ApiError(message || `请求失败（${res.status}）`, res.status, data)
    }
    return data as T
  } finally {
    window.clearTimeout(timer)
  }
}

export class ApiError extends Error {
  status: number
  body: unknown
  constructor(message: string, status: number, body: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.body = body
  }
}

/** 服务没起 / 挂了：fetch 直接失败或超时 */
export function isBackendDown(err: unknown): boolean {
  if (err instanceof ApiError) return err.status >= 500
  return true
}