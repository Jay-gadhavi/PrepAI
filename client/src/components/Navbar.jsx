import { useState } from 'react'
import { BrainCircuit, Menu, X, ArrowRight, User as UserIcon, LogOut } from 'lucide-react'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'Features', href: '#features' },
  { label: 'Dashboard', href: '#dashboard' },
  { label: 'Practice', href: '#practice' },
]

export function Navbar({ user, onOpenAuth, onLogout }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 pt-4">
      <nav className="flex w-full max-w-6xl items-center justify-between gap-4 rounded-full border border-[#27272a] bg-[#121215]/70 px-3 py-2.5 backdrop-blur-xl">
        {/* Left: Logo */}
        <a href="#home" className="flex items-center gap-2.5 pl-1">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#27272a] bg-white text-black">
            <BrainCircuit className="h-5 w-5" strokeWidth={2} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-white">
            PrepAI
          </span>
        </a>

        {/* Center: Pill nav */}
        <div className="hidden items-center gap-1 rounded-full border border-[#27272a] bg-[#09090b]/50 p-1 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="rounded-full px-4 py-1.5 text-sm font-medium text-[#a1a1aa] transition-colors hover:bg-[#27272a] hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: Auth User Badge or Sign In CTA */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <span className="hidden items-center gap-1.5 rounded-full border border-[#27272a] bg-[#18181b] px-3.5 py-1.5 text-xs font-semibold text-white sm:flex">
                <UserIcon className="h-3.5 w-3.5 text-[#a1a1aa]" />
                {user.name}
              </span>
              <button
                type="button"
                onClick={onLogout}
                title="Log Out"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#27272a] bg-[#18181b] text-[#a1a1aa] transition-colors hover:bg-red-500/10 hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="flex items-center gap-2 rounded-full border border-[#27272a] bg-[#18181b] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#27272a]"
            >
              Sign In
            </button>
          )}

          <a
            href="#practice"
            className="hidden items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition-all hover:opacity-90 sm:flex"
          >
            Start Practice
            <ArrowRight className="h-4 w-4" />
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#27272a] text-white md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {open && (
        <div className="absolute top-20 left-4 right-4 flex flex-col gap-1 rounded-2xl border border-[#27272a] bg-[#121215] p-3 backdrop-blur-xl md:hidden">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-[#a1a1aa] transition-colors hover:bg-[#27272a] hover:text-white"
            >
              {link.label}
            </a>
          ))}
          {!user && (
            <button
              type="button"
              onClick={() => {
                setOpen(false)
                onOpenAuth()
              }}
              className="mt-2 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-black"
            >
              Sign In / Register
            </button>
          )}
        </div>
      )}
    </header>
  )
}
