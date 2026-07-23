import { TrendingUp, AlertTriangle, Check, Circle, Layers } from 'lucide-react'

const defaultSkills = [
  { name: 'Frontend Architecture', score: 88, subSkills: ['React', 'JavaScript', 'HTML/CSS'] },
  { name: 'Backend & API Engineering', score: 82, subSkills: ['Node.js', 'Express', 'REST APIs'] },
  { name: 'Core Algorithms & Design', score: 75, subSkills: ['Data Structures', 'System Design'] },
  { name: 'Database & Data Storage', score: 68, subSkills: ['MongoDB', 'SQL'] },
  { name: 'DevOps & Cloud Systems', score: 60, subSkills: ['Git', 'Docker'] },
]

const defaultStrengths = ['JavaScript', 'React', 'Problem Solving', 'REST APIs', 'Git']
const defaultWeaknesses = ['System Design', 'SQL Optimization', 'Docker & CI/CD', 'Cloud Architecture']

const defaultRoadmap = [
  { step: '01', title: 'Reinforce System Design', detail: 'Load balancing, caching, and DB sharding fundamentals.', done: true },
  { step: '02', title: 'SQL Deep Dive', detail: 'Query optimization, indexing strategies, and complex joins.', done: false },
  { step: '03', title: 'Cloud & Containerization', detail: 'Docker containerization and deployment pipelines.', done: false },
  { step: '04', title: 'Mock Interview Rounds', detail: 'Timed sessions with live AI scoring.', done: false },
]

function categorizeSkills(rawSkills) {
  if (!rawSkills || rawSkills.length === 0) return defaultSkills

  const domains = [
    {
      name: 'Frontend Architecture',
      keywords: ['react', 'html', 'css', 'javascript', 'typescript', 'tailwind', 'redux', 'next', 'vue', 'frontend', 'ui', 'ux'],
      skills: [],
      scores: []
    },
    {
      name: 'Backend & API Engineering',
      keywords: ['node', 'express', 'python', 'java', 'c++', 'rest', 'api', 'graphql', 'backend', 'server', 'jwt', 'auth'],
      skills: [],
      scores: []
    },
    {
      name: 'Database & Data Storage',
      keywords: ['mongo', 'mongodb', 'sql', 'postgresql', 'mysql', 'database', 'redis', 'mongoose', 'data'],
      skills: [],
      scores: []
    },
    {
      name: 'DevOps & Cloud Systems',
      keywords: ['docker', 'git', 'github', 'aws', 'ci/cd', 'cloud', 'devops', 'kubernetes', 'jira', 'azure'],
      skills: [],
      scores: []
    },
    {
      name: 'Core Problem Solving & Architecture',
      keywords: ['algorithm', 'structure', 'system design', 'agile', 'project management', 'problem solving', 'scrum', 'documentation'],
      skills: [],
      scores: []
    }
  ]

  rawSkills.forEach((item, idx) => {
    const name = typeof item === 'object' && item !== null ? (item.name || item.skill) : String(item)
    const score = typeof item === 'object' && typeof item?.score === 'number' ? item.score : Math.min(95, Math.max(55, 88 - idx * 6))
    const lower = name.toLowerCase()

    let matched = domains.find(d => d.keywords.some(kw => lower.includes(kw)))
    if (!matched) {
      matched = domains[4]
    }
    if (!matched.skills.includes(name)) {
      matched.skills.push(name)
      matched.scores.push(score)
    }
  })

  const activeDomains = domains
    .filter(d => d.skills.length > 0)
    .map(d => {
      const avg = Math.round(d.scores.reduce((a, b) => a + b, 0) / d.scores.length)
      return {
        name: d.name,
        score: avg,
        subSkills: d.skills
      }
    })

  return activeDomains.length > 0 ? activeDomains : defaultSkills
}

export function SkillDashboard({ analysis }) {
  const strengths = analysis?.strengths && analysis.strengths.length > 0 ? analysis.strengths : defaultStrengths

  const rawWeaknesses = [
    ...(analysis?.weaknesses || []),
    ...(analysis?.missingSkills || []),
  ]
  const weaknesses = rawWeaknesses.length > 0 ? Array.from(new Set(rawWeaknesses)) : defaultWeaknesses

  const structuredSkills = categorizeSkills(analysis?.skills)

  const recommendations = analysis?.recommendations && analysis.recommendations.length > 0
    ? analysis.recommendations.map((rec, idx) => ({
        step: String(idx + 1).padStart(2, '0'),
        title: typeof rec === 'string' ? rec : (rec.title || rec.recommendation || 'Recommendation'),
        detail: 'AI-generated recommendation based on your resume analysis.',
        done: idx === 0,
      }))
    : defaultRoadmap

  // Calculate overall readiness score
  const totalScoreSum = structuredSkills.reduce((acc, curr) => acc + curr.score, 0)
  const readinessScore = Math.round(totalScoreSum / structuredSkills.length)
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
            Structured AI competency breakdown generated from your uploaded resume.
          </p>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Structured Domain Competency Breakdown */}
        <div className="rounded-2xl border border-[#27272a] bg-[#18181b] p-6 lg:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-white" />
              <h3 className="font-display text-base font-semibold text-white">
                Core Competency Domains
              </h3>
            </div>
            <span className="flex items-center gap-1 text-xs text-[#a1a1aa]">
              <Layers className="h-3.5 w-3.5" />
              {structuredSkills.length} Domains Grouped
            </span>
          </div>

          <div className="flex flex-col gap-6">
            {structuredSkills.map((domain) => (
              <div key={domain.name} className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-white">{domain.name}</span>
                  <span className="tabular-nums text-xs font-bold text-white bg-[#27272a] px-2 py-0.5 rounded-full">
                    {domain.score}%
                  </span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-[#121215]">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      domain.score >= 75
                        ? 'bg-emerald-400'
                        : domain.score >= 60
                        ? 'bg-white'
                        : 'bg-amber-400'
                    }`}
                    style={{ width: `${domain.score}%` }}
                  />
                </div>

                {domain.subSkills && domain.subSkills.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {domain.subSkills.map((sub) => (
                      <span
                        key={sub}
                        className="rounded-md border border-[#27272a]/60 bg-[#09090b]/60 px-2 py-0.5 text-[11px] text-[#a1a1aa]"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                )}
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
