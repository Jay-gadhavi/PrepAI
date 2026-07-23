import { Upload, Play, Sparkles } from 'lucide-react'

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-28 pb-16"
    >
      {/* Background detail */}
      <div className="pointer-events-none absolute inset-0 bg-dot-matrix mask-fade-b" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-grid-lines opacity-60 mask-fade-b"
        aria-hidden
      />

      <div className="relative z-10 flex max-w-4xl flex-col items-center text-center">
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#27272a] bg-[#121215]/70 px-4 py-1.5 text-xs font-medium tracking-wide text-[#a1a1aa] backdrop-blur">
          <Sparkles className="h-3.5 w-3.5 text-white" />
          Powered by real-time Gemini AI
        </span>

        <h1 className="font-display text-balance text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
          Master Every Technical & HR Interview with AI.
        </h1>

        <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-[#a1a1aa]">
          Upload your resume, detect your skill gaps, and practice with real-time Gemini AI feedback.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="#upload-section"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }}
            className="group flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-black transition-all hover:opacity-90"
          >
            <Upload className="h-4 w-4" />
            Upload Resume
          </a>
          <a
            href="#practice"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('practice')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
            }}
            className="flex items-center gap-2 rounded-full border border-[#27272a] bg-transparent px-7 py-3.5 text-sm font-semibold text-white transition-all hover:bg-[#27272a]"
          >
            <Play className="h-4 w-4" />
            Try Demo
          </a>
        </div>
      </div>
    </section>
  )
}
