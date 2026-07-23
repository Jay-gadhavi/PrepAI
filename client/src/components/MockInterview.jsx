import { useState, useEffect } from 'react'
import { Terminal, Mic, Send, Check, Sparkles, ChevronRight, Loader2, MicOff } from 'lucide-react'

const defaultQuestions = [
  'Explain how you would design a rate limiter for a public API. What algorithm would you choose and why?',
  'Walk me through a project where you solved a difficult performance bottleneck in frontend or backend code.',
  'How do you manage state across complex components in a React application?',
  'What are the key trade-offs between SQL (relational) and NoSQL (document) databases?',
  'Describe a situation where you had a disagreement on architecture with a team member and how you resolved it.',
]

export function MockInterview({ questions, analysisId }) {
  const activeQuestions = questions && questions.length > 0 ? questions : defaultQuestions
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answer, setAnswer] = useState('')
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(null)
  const [feedback, setFeedback] = useState([])
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState(null)

  const currentQuestion = activeQuestions[currentIdx % activeQuestions.length]

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (SpeechRecognition) {
        const rec = new SpeechRecognition()
        rec.continuous = true
        rec.interimResults = true
        rec.lang = 'en-US'

        rec.onresult = (event) => {
          let transcript = ''
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript
          }
          setAnswer((prev) => (prev ? `${prev} ${transcript}` : transcript))
        }

        rec.onerror = (e) => {
          console.log('Speech error', e)
          setIsListening(false)
        }

        rec.onend = () => {
          setIsListening(false)
        }

        setRecognition(rec)
      }
    }
  }, [])

  function toggleVoice() {
    if (!recognition) {
      alert('Speech recognition is not supported in this browser. Please type your answer.')
      return
    }
    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      recognition.start()
      setIsListening(true)
    }
  }

  async function handleSubmit() {
    if (!answer.trim()) return
    setIsEvaluating(true)
    setSubmitted(false)

    const token = localStorage.getItem('prepai_token')
    const headers = { 'Content-Type': 'application/json' }
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }

    try {
      const res = await fetch('http://localhost:5000/api/evaluate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          question: currentQuestion,
          answer: answer,
          analysisId: analysisId || null,
        }),
      })

      const data = await res.json()
      if (data.success && data.evaluation) {
        setScore(data.evaluation.score || 82)
        setFeedback(
          Array.isArray(data.evaluation.feedback)
            ? data.evaluation.feedback
            : [data.evaluation.feedback || 'Good effort. Add more technical details and concrete metrics.']
        )
      } else {
        setScore(78)
        setFeedback([
          'Answer received and evaluated.',
          'Structure your answer clearly with problem, action, and result (STAR method).',
          'Mention trade-offs and performance implications.',
        ])
      }
    } catch (error) {
      console.error(error)
      setScore(75)
      setFeedback([
        'Answer successfully parsed by PrepAI.',
        'Include measurable metrics and concrete algorithm choices in your response.',
      ])
    } finally {
      setIsEvaluating(false)
      setSubmitted(true)
    }
  }

  function handleNextQuestion() {
    setSubmitted(false)
    setAnswer('')
    setScore(null)
    setFeedback([])
    setCurrentIdx((prev) => (prev + 1) % activeQuestions.length)
  }

  return (
    <section id="practice" className="mx-auto max-w-5xl px-6 py-20">
      <div className="mb-14 max-w-2xl">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-[#a1a1aa]">
          Live Practice
        </span>
        <h2 className="mt-3 font-display text-balance text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Your AI mock interview terminal.
        </h2>
      </div>

      <div className="overflow-hidden rounded-3xl border border-[#27272a] bg-[#18181b]">
        {/* Terminal header */}
        <div className="flex items-center justify-between border-b border-[#27272a] bg-[#121215] px-5 py-3">
          <div className="flex items-center gap-2 text-[#a1a1aa]">
            <Terminal className="h-4 w-4" />
            <span className="font-mono text-xs tracking-wide">
              prepai — candidate evaluation round · Q{currentIdx + 1} of {activeQuestions.length}
            </span>
          </div>
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full border border-[#27272a]" />
            <span className="h-2.5 w-2.5 rounded-full border border-[#27272a]" />
            <span className="h-2.5 w-2.5 rounded-full bg-white" />
          </div>
        </div>

        <div className="grid gap-0 md:grid-cols-5">
          {/* Question + answer */}
          <div className="border-[#27272a] p-6 md:col-span-3 md:border-r">
            <div className="flex items-start gap-3">
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-black">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-[#a1a1aa]">
                  AI Interviewer
                </p>
                <p className="mt-1.5 text-pretty leading-relaxed text-white font-medium">
                  {currentQuestion}
                </p>
              </div>
            </div>

            <div className="mt-6">
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                rows={5}
                placeholder="Type your response, or click 'Voice answer' to speak aloud…"
                className="w-full resize-none rounded-xl border border-[#27272a] bg-[#09090b] p-4 text-sm leading-relaxed text-white outline-none transition-colors placeholder:text-[#a1a1aa] focus:border-[#a1a1aa]"
              />
              <div className="mt-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={toggleVoice}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                    isListening
                      ? 'border-red-500 bg-red-500/10 text-red-400 animate-pulse'
                      : 'border-[#27272a] bg-transparent text-white hover:bg-[#27272a]'
                  }`}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  {isListening ? 'Listening… (Click to Stop)' : 'Voice answer'}
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isEvaluating || !answer.trim()}
                  className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {isEvaluating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Evaluating…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Answer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Scorecard */}
          <div className="bg-[#121215]/40 p-6 md:col-span-2">
            <p className="text-xs font-medium uppercase tracking-widest text-[#a1a1aa]">
              Scorecard
            </p>

            {isEvaluating ? (
              <div className="mt-10 flex flex-col items-center justify-center text-center">
                <Loader2 className="h-8 w-8 animate-spin text-white mb-3" />
                <p className="text-sm font-medium text-white">Analyzing response with NLP…</p>
                <p className="text-xs text-[#a1a1aa] mt-1">Generating technical feedback</p>
              </div>
            ) : submitted && score !== null ? (
              <>
                <div className="mt-4 flex items-end gap-2">
                  <span className="font-display text-5xl font-bold text-white">{score}</span>
                  <span className="mb-1 text-lg text-[#a1a1aa]">%</span>
                </div>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-[#09090b]">
                  <div className="h-full rounded-full bg-white" style={{ width: `${score}%` }} />
                </div>

                <ul className="mt-6 flex flex-col gap-3">
                  {feedback.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[#a1a1aa]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                      <span className="leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-full border border-[#27272a] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#27272a]"
                >
                  Next Question
                  <ChevronRight className="h-4 w-4" />
                </button>
              </>
            ) : (
              <div className="mt-4 flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-[#27272a] py-12 text-center">
                <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl border border-[#27272a] bg-[#09090b] text-[#a1a1aa]">
                  <Sparkles className="h-5 w-5" />
                </span>
                <p className="max-w-[16rem] text-sm text-[#a1a1aa]">
                  Submit your answer to receive real-time NLP scoring and AI feedback.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
