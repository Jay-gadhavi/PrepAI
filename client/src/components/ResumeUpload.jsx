import { useState, useRef } from 'react'
import { UploadCloud, FileText, CheckCircle2, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'

export function ResumeUpload({
  onAnalysisStart,
  onAnalysisComplete,
  onError,
  isAnalyzing = false,
}) {
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState(null)
  const [extractedPreview, setExtractedPreview] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const [loadingStep, setLoadingStep] = useState(null)
  const [errorMsg, setErrorMsg] = useState(null)
  const inputRef = useRef(null)

  async function handleFiles(files) {
    if (!files || files.length === 0) return
    const file = files[0]
    setFileName(file.name)
    setErrorMsg(null)
    setExtractedPreview(null)

    if (onAnalysisStart) onAnalysisStart()

    try {
      setLoadingStep('Uploading & Extracting PDF text…')
      const formData = new FormData()
      formData.append('resume', file)

      const uploadRes = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        body: formData,
      })

      const uploadData = await uploadRes.json()

      if (!uploadRes.ok || !uploadData.success || !uploadData.extractedText) {
        throw new Error(uploadData.message || 'Failed to parse resume PDF.')
      }

      const extractedText = uploadData.extractedText
      setExtractedPreview(extractedText)

      setLoadingStep('Running AI Skill & Gap Analysis…')

      const token = localStorage.getItem('prepai_token')
      const headers = { 'Content-Type': 'application/json' }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const [analyzeRes, questionsRes] = await Promise.all([
        fetch('http://localhost:5000/api/analyze', {
          method: 'POST',
          headers,
          body: JSON.stringify({ resumeText: extractedText, fileName: file.name }),
        }),
        fetch('http://localhost:5000/api/questions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeText: extractedText }),
        }),
      ])

      const analyzeData = await analyzeRes.json()
      const questionsData = await questionsRes.json()

      let parsedQuestions = []
      if (Array.isArray(questionsData.questions)) {
        parsedQuestions = questionsData.questions
      } else if (typeof questionsData.questions === 'string') {
        parsedQuestions = questionsData.questions
          .split('\n')
          .map((q) => q.replace(/^\d+[\.\)]\s*/, '').trim())
          .filter((q) => q.length > 5)
      }

      setLoadingStep(null)

      if (onAnalysisComplete) {
        onAnalysisComplete({
          extractedText,
          analysis: analyzeData.analysis,
          analysisId: analyzeData.analysisId,
          questions: parsedQuestions,
        })
      }
    } catch (err) {
      console.error(err)
      setLoadingStep(null)
      const msg = err.message || 'Failed to connect to backend server on port 5000.'
      setErrorMsg(msg)
      if (onError) onError(msg)
    }
  }

  return (
    <section id="upload-section" className="mx-auto max-w-4xl px-6 py-12 scroll-mt-24">
      <div
        role="button"
        tabIndex={0}
        onClick={() => !isAnalyzing && !loadingStep && inputRef.current?.click()}
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && !isAnalyzing && !loadingStep) {
            inputRef.current?.click()
          }
        }}
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          if (!isAnalyzing && !loadingStep) {
            handleFiles(e.dataTransfer.files)
          }
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-3xl border-2 border-dashed px-6 py-16 text-center transition-all ${
          dragging
            ? 'border-white bg-[#27272a] glow-ring'
            : 'border-[#27272a] bg-[#121215]/50 hover:border-[#a1a1aa] hover:bg-[#121215]'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
        />

        {loadingStep || isAnalyzing ? (
          <>
            <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#27272a] bg-[#09090b] text-white animate-spin">
              <Loader2 className="h-7 w-7" />
            </span>
            <p className="font-display text-xl font-semibold text-white">
              Processing Resume…
            </p>
            <p className="mt-2 text-sm text-[#a1a1aa]">{loadingStep || 'AI Analysis in progress…'}</p>
          </>
        ) : fileName && !errorMsg ? (
          <>
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#27272a] bg-white text-black">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <p className="flex items-center gap-2 font-display text-lg font-semibold text-white">
              <FileText className="h-4 w-4" />
              {fileName}
            </p>
            <p className="mt-2 text-sm text-[#a1a1aa]">
              Text extracted successfully — skill gaps & questions generated below.
            </p>

            {extractedPreview && (
              <div className="mt-4 flex flex-col items-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowPreview(!showPreview)
                  }}
                  className="flex items-center gap-2 rounded-full border border-[#27272a] bg-[#18181b] px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#27272a]"
                >
                  {showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  {showPreview ? 'Hide Extracted PDF Text' : 'Preview Extracted PDF Text'}
                </button>

                {showPreview && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-4 max-h-60 w-full overflow-y-auto rounded-xl border border-[#27272a] bg-[#09090b] p-4 text-left font-mono text-xs text-[#a1a1aa]"
                  >
                    <p className="mb-2 font-semibold text-white">Extracted Plaintext from PDF:</p>
                    <pre className="whitespace-pre-wrap font-sans">{extractedPreview}</pre>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#27272a] bg-[#09090b] text-white">
              <UploadCloud className="h-7 w-7" strokeWidth={1.75} />
            </span>
            <p className="font-display text-xl font-semibold text-white">
              Drag & drop your resume
            </p>
            <p className="mt-2 text-sm text-[#a1a1aa]">
              or{' '}
              <span className="font-medium text-white underline underline-offset-4">
                browse files
              </span>{' '}
              to upload
            </p>

            {errorMsg && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-medium text-red-400">
                <AlertCircle className="h-4 w-4" />
                {errorMsg}
              </div>
            )}

            <p className="mt-6 text-xs tracking-wide text-[#a1a1aa]">
              Supports PDF up to 10MB · Instant NLP Extraction
            </p>
          </>
        )}
      </div>
    </section>
  )
}
