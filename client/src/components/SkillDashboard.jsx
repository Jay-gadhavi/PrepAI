import { TrendingUp, AlertTriangle, Check, Circle } from 'lucide-react'

const defaultSkills = [
  { name: 'Data Structures & Algorithms', score: 85 },
  { name: 'System Design', score: 54 },
  { name: 'Behavioral & HR', score: 72 },
  { name: 'Database & SQL', score: 41 },
  { name: 'Frontend Architecture', score: 90 },
]

const defaultStrengths = ['JavaScript', 'React', 'Problem Solving', 'REST APIs', 'Git']
const defaultWeaknesses = ['System Design', 'SQL Optimization', 'Docker & CI/CD', 'Cloud Architecture']

const defaultRoadmap = [
  { step: '01', title: 'Reinforce System Design', detail: 'Load balancing, caching, and DB sharding fundamentals.', done: true },
  { step: '02', title: 'SQL Deep Dive', detail: 'Query optimization, indexing strategies, and complex joins.', done: false },
  { step: '03', title: 'Cloud & Containerization', detail: 'Docker containerization and deployment pipelines.', done: false },
  { step: '04', title: 'Mock Interview Rounds', detail: 'Timed sessions with live AI scoring.', done: false },
]

export function SkillDashboard({ analysis }) {
  const strengths = analysis?.strengths && analysis.strengths.length > 0 ? analysis.strengths : defaultStrengths

  const rawWeaknesses = [
    ...(analysis?.weaknesses || []),
    ...(analysis?.missingSkills || []),
  ]
  const weaknesses = rawWeaknesses.length > 0 ? Array.from(new Set(rawWeaknesses)) : defaultWeaknesses

  const skillsList = analysis?.skills && analysis.skills.length > 0
    ? analysis.skills.map((s, idx) => ({
        name: s,
        score: Math.min(96, Math.max(45, 88 - idx * 8)),
      }))
    : defaultSkills

  const recommendations = analysis?.recommendations && analysis.recommendations.length > 0
    ? analysis.recommendations.map((rec, idx) => ({
        step: String(idx + 1).padStart(2, '0'),
        title: rec,
        detail: 'AI recommendation derived from detected gap in resume.',
        done: idx === 0,
      }))
    : defaultRoadmap

  // Calculate overall score
  const totalScoreSum = skillsList.reduce((acc, curr) => acc + curr.score, 0)
  const readinessScore = Math.round(totalScoreSum / skillsList.length)
  const strokeDashoffset = 2 * Math.PI * 42 * (1 - readinessScore / 100)

  return (
    <section id="dashboard" className="mx-auto max-w-6xl px-6 py-20">
      <div className="mb-14 max-w-2xl">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#a1a1aa]">
          Skill Gap Analysis
        </span>
        <h2 className="mt-3 font-display text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Know exactly where you stand.
        </h2>
        {analysis && (
          <p className="mt-3 text-sm text-[#a1a1aa]">
            Live AI breakdown generated from your uploaded resume.
          </p>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Progress bars */}
        <div className="rounded-2xl border border-[#27272a] bg-[#18181b] p-6 lg:col-span-2">
          <div className="mb-6 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-white" />
            <h3 className="font-display text-base font-semibold text-white">
              Competency Breakdown
            </h3>
          </div>
          <div className="flex flex-col gap-5">
            {skillsList.map((s) => (
              <div key={s.name}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-white">{s.name}</span>
                  <span className="tabular-nums text-[#a1a1aa]">{s.score}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-[#121215]">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-500"
                    style={{ width: `${s.score}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Readiness ring */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-[#27272a] bg-[#18181b] p-6">
          <div className="relative flex h-40 w-40 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100" aria-hidden>
              <circle cx="50" cy="50" r="42" fill="none" stroke="#27272a" strokeWidth="8" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="#ffffff"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={`${strokeDashoffset}`}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="font-display text-3xl font-bold text-white">{readinessScore}%</span>
              <span className="text-xs text-[#a1a1aa]">Ready</span>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-[#a1a1aa]">
            Overall interview readiness score
          </p>
        </div>

        {/* Strengths */}
        <div className="rounded-2xl border border-[#27272a] bg-[#18181b] p-6">
          <div className="mb-4 flex items-center gap-2">
            <Check className="h-4 w-4 text-white" />
            <h3 className="font-display text-base font-semibold text-white">Strengths</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {strengths.map((t) => (
              <span
                key={t}
                className="rounded-full bg-white px-3 py-1 text-xs font-medium text-black"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Weaknesses */}
        <div className="rounded-2xl border border-[#27272a] bg-[#18181b] p-6">
          <div className="mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-[#a1a1aa]" />
            <h3 className="font-display text-base font-semibold text-white">Focus Areas</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {weaknesses.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[#27272a] bg-[#121215] px-3 py-1 text-xs font-medium text-[#a1a1aa]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Roadmap timeline */}
        <div className="rounded-2xl border border-[#27272a] bg-[#18181b] p-6">
          <h3 className="mb-5 font-display text-base font-semibold text-white">
            Learning Roadmap
          </h3>
          <ol className="relative flex flex-col gap-5 border-l border-[#27272a] pl-6">
            {recommendations.map((r) => (
              <li key={r.step} className="relative">
                <span
                  className={`absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full border ${
                    r.done
                      ? 'border-white bg-white text-black'
                      : 'border-[#27272a] bg-[#121215] text-[#a1a1aa]'
                  }`}
                >
                  {r.done ? <Check className="h-3 w-3" /> : <Circle className="h-2 w-2" />}
                </span>
                <p className="text-sm font-semibold text-white">{r.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-[#a1a1aa]">{r.detail}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
