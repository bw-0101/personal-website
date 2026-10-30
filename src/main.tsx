import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { trackVisit } from './lib/track'
import './index.css'

function Root() {
  useEffect(() => {
    // 首屏之后统计，避免和渲染抢带宽
    const t = window.setTimeout(trackVisit, 1200)
    return () => window.clearTimeout(t)
  }, [])
  return <App />
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)