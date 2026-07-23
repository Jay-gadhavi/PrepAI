import { ScanText, ListChecks, Radar, Route } from 'lucide-react'

const features = [
  {
    icon: ScanText,
    title: 'Resume-Based Extraction',
    desc: 'NLP parses your resume to extract skills, experience, and keywords with precision.',
  },
  {
    icon: ListChecks,
    title: 'Profile-Tailored Questions',
    desc: 'Generate technical and HR questions matched to your exact role and seniority.',
  },
  {
    icon: Radar,
    title: 'Real-Time NLP Evaluation',
    desc: 'Every answer is scored live for relevance, clarity, and technical depth.',
  },
  {
    icon: Route,
    title: 'Skill Gap Roadmap',
    desc: 'Receive a structured learning path targeting your weakest competencies.',
  },
]

export function FeaturesGrid() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-14 max-w-2xl">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#a1a1aa]">
          Core Capabilities
        </span>
        <h2 className="mt-3 font-display text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Everything you need to interview ready.
        </h2>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="group flex flex-col rounded-2xl border border-[#27272a] bg-[#18181b] p-6 transition-all hover:border-[#a1a1aa] hover:-translate-y-1"
          >
            <span className="mb-6 flex h-11 w-11 items-center justify-center rounded-xl border border-[#27272a] bg-[#121215] text-white transition-colors group-hover:bg-white group-hover:text-black">
              <f.icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <h3 className="font-display text-lg font-semibold tracking-tight text-white">
              {f.title}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-[#a1a1aa]">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
