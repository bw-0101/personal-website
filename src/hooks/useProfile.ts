import { createContext, useContext } from 'react'
import { profile as defaultProfile, type Profile } from '../data/profile'

/**
 * 个人资料上下文。
 * 页面加载时从 /api/profile 拉取（可在后台在线修改），
 * 接口失败则使用 src/data/profile.ts 里的默认值。
 */
export const ProfileContext = createContext<Profile>(defaultProfile)

export function useProfile(): Profile {
  return useContext(ProfileContext)
}

export type { Profile }