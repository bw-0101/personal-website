import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Blog from './components/Blog'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { ProfileContext } from './hooks/useProfile'
import { api } from './lib/api'
import { profile as defaultProfile, type Profile } from './data/profile'

export default function App() {
  const [profile, setProfile] = useState<Profile>(defaultProfile)

  useEffect(() => {
    let alive = true
    api<Profile>('/api/profile', {}, 8000)
      .then((d) => {
        if (alive && d && d.name) setProfile({ ...defaultProfile, ...d })
      })
      .catch(() => {
        /* 服务不可用时用默认资料 */
      })
    return () => {
      alive = false
    }
  }, [])

  return (
    <ProfileContext.Provider value={profile}>
      <div className="paper-grain relative min-h-screen">
        <div className="relative z-10">
          <Navbar />
          <main>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Blog />
            <Contact />
          </main>
          <Footer />
        </div>
      </div>
    </ProfileContext.Provider>
  )
}