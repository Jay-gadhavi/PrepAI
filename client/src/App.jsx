import { useState, useEffect } from 'react'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { ResumeUpload } from './components/ResumeUpload'
import { FeaturesGrid } from './components/FeaturesGrid'
import { SkillDashboard } from './components/SkillDashboard'
import { MockInterview } from './components/MockInterview'
import { Footer } from './components/Footer'
import { AuthModal } from './components/AuthModal'

export default function App() {
  const [user, setUser] = useState(null)
  const [isAuthOpen, setIsAuthOpen] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const [analysisId, setAnalysisId] = useState(null)
  const [questions, setQuestions] = useState([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  useEffect(() => {
    const savedUser = localStorage.getItem('prepai_user')
    const token = localStorage.getItem('prepai_token')
    if (savedUser && token) {
      try {
        setUser(JSON.parse(savedUser))
        fetch('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => {
            if (data.success && data.user) {
              setUser(data.user)
            } else {
              handleLogout()
            }
          })
          .catch(err => console.error(err))
      } catch (e) {
        handleLogout()
      }
    }
  }, [])

  function handleLogout() {
    localStorage.removeItem('prepai_token')
    localStorage.removeItem('prepai_user')
    setUser(null)
  }

  function handleAnalysisComplete(data) {
    setAnalysis(data.analysis)
    if (data.analysisId) setAnalysisId(data.analysisId)
    if (data.questions && data.questions.length > 0) {
      setQuestions(data.questions)
    }
    setIsAnalyzing(false)

    setTimeout(() => {
      const dashboardElement = document.getElementById('dashboard')
      if (dashboardElement) {
        dashboardElement.scrollIntoView({ behavior: 'smooth' })
      }
    }, 10)
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      <Hero />

      <ResumeUpload
        onAnalysisStart={() => setIsAnalyzing(true)}
        onAnalysisComplete={handleAnalysisComplete}
        onError={() => setIsAnalyzing(false)}
        isAnalyzing={isAnalyzing}
      />

      <FeaturesGrid />
      <SkillDashboard analysis={analysis} />
      <MockInterview questions={questions} analysisId={analysisId} />
      <Footer />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onAuthSuccess={(u) => setUser(u)}
      />
    </div>
  )
}
