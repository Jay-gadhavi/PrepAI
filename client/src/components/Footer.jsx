import { BrainCircuit } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-[#27272a] bg-[#121215]/40 py-12">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#27272a] bg-white text-black">
            <BrainCircuit className="h-4 w-4" />
          </span>
          <span className="font-display font-bold text-white">PrepAI</span>
          <span className="text-xs text-[#a1a1aa]">© 2026 Academic Project</span>
        </div>

        <p className="text-xs text-[#a1a1aa]">
          Intelligent, personalized interview prep powered by AI.
        </p>
      </div>
    </footer>
  )
}
