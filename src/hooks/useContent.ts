import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import { posts as localPosts, type Post } from '../data/posts'
import { projects as localProjects, type Project } from '../data/projects'

/**
 * 内容数据源：优先读服务端（可在后台在线编辑），
 * 服务没起 / 读不到时回退到 src/data 里的内置内容，页面不会空白。
 */
function useRemoteList<T>(path: string, fallback: T[]) {
  const [items, setItems] = useState<T[]>(fallback)

  useEffect(() => {
    let alive = true
    api<{ items: T[] }>(path, {}, 8000)
      .then((d) => {
        if (alive && Array.isArray(d.items) && d.items.length) setItems(d.items)
      })
      .catch(() => {
        /* 保持内置内容 */
      })
    return () => {
      alive = false
    }
  }, [path])

  return { items }
}

export function usePosts() {
  return useRemoteList<Post>('/api/posts', localPosts)
}

export function useProjects() {
  return useRemoteList<Project>('/api/projects', localProjects)
}

export type { Post, Project }