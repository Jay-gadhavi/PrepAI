import { useState } from 'react'
import { X, Lock, Mail, User as UserIcon, Loader2, AlertCircle } from 'lucide-react'

export function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  if (!isOpen) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const endpoint = isSignUp ? '/api/auth/register' : '/api/auth/login'
    const body = isSignUp ? { name, email, password } : { email, password }

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Authentication failed.')
      }

      localStorage.setItem('prepai_token', data.token)
      localStorage.setItem('prepai_user', JSON.stringify(data.user))

      if (onAuthSuccess) {
        onAuthSuccess(data.user, data.token)
      }

      onClose()
    } catch (err) {
      console.error(err)
      setError(err.message || 'Authentication failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#27272a] bg-[#121215] p-8 shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full border border-[#27272a] text-[#a1a1aa] transition-colors hover:bg-[#27272a] hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-6 text-center">
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#a1a1aa]">
            Candidate Portal
          </span>
          <h2 className="mt-2 font-display text-2xl font-bold text-white">
            {isSignUp ? 'Create Candidate Account' : 'Welcome Back'}
          </h2>
          <p className="mt-1 text-xs text-[#a1a1aa]">
            {isSignUp
              ? 'Save your resumes & track mock interview progress.'
              : 'Sign in to access your interview roadmap and scores.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs text-red-400">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignUp && (
            <div>
              <label className="mb-1.5 block text-xs font-medium text-[#a1a1aa]">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute top-3 left-3.5 h-4 w-4 text-[#a1a1aa]" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-xl border border-[#27272a] bg-[#09090b] py-2.5 pr-4 pl-10 text-sm text-white placeholder:text-[#a1a1aa] focus:border-white focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#a1a1aa]">Email Address</label>
            <div className="relative">
              <Mail className="absolute top-3 left-3.5 h-4 w-4 text-[#a1a1aa]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-[#27272a] bg-[#09090b] py-2.5 pr-4 pl-10 text-sm text-white placeholder:text-[#a1a1aa] focus:border-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-[#a1a1aa]">Password</label>
            <div className="relative">
              <Lock className="absolute top-3 left-3.5 h-4 w-4 text-[#a1a1aa]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#27272a] bg-[#09090b] py-2.5 pr-4 pl-10 text-sm text-white placeholder:text-[#a1a1aa] focus:border-white focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-white py-3 text-sm font-semibold text-black transition-all hover:opacity-90 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : isSignUp ? (
              'Create Account'
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-[#a1a1aa]">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp)
              setError(null)
            }}
            className="font-medium text-white underline underline-offset-4"
          >
            {isSignUp ? 'Sign In' : 'Create One'}
          </button>
        </div>
      </div>
    </div>
  )
}
