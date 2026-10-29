"use client"
import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { getCurrentUser } from "@/lib/auth"
import { patientService, cervixAnalysisService } from "@/lib/api-services"
import type { CervixAnalysisType } from "@/lib/types"
import {
  Upload, ImageIcon, Loader2, CheckCircle2, AlertTriangle,
  XCircle, History, Search, FlaskConical, RefreshCw, Printer
} from "lucide-react"

// ── Config ──────────────────────────────────────────────────────────────────
// Replace with your real Python model API URL when ready
const PYTHON_MODEL_API = import.meta.env.VITE_PYTHON_MODEL_URL ?? "http://localhost:8000/predict"

const ROLE_LABELS: Record<string, string> = {
  doctor: "Doctor",
  lab: "Laboratory",
  pathology: "Pathology",
  screening_van: "Screening Van",
}

// ── Types ────────────────────────────────────────────────────────────────────
type RiskLevel = "normal" | "mild" | "abnormal"

interface AnalysisResult {
  label: RiskLevel
  confidence: number
  recommendations: string[]
}

interface PrintData {
  patientId: string
  label: RiskLevel
  confidence: number
  recommendations: string[]
  screenerName: string
  screenerRole: string
  dateTime: string
  imageUrl?: string
}

const RISK_CONFIG: Record<RiskLevel, { color: string; icon: JSX.Element; bg: string; border: string }> = {
  normal: {
    color: "text-emerald-600 dark:text-emerald-400",
    icon: <CheckCircle2 className="h-8 w-8 text-emerald-500" />,
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    border: "border-emerald-200 dark:border-emerald-800",
  },
  mild: {
    color: "text-amber-600 dark:text-amber-400",
    icon: <AlertTriangle className="h-8 w-8 text-amber-500" />,
    bg: "bg-amber-50 dark:bg-amber-950/30",
    border: "border-amber-200 dark:border-amber-800",
  },
  abnormal: {
    color: "text-red-600 dark:text-red-400",
    icon: <XCircle className="h-8 w-8 text-red-500" />,
    bg: "bg-red-50 dark:bg-red-950/30",
    border: "border-red-200 dark:border-red-800",
  },
}

const RESULT_LABEL: Record<RiskLevel, string> = {
  normal: "Normal",
  mild: "Mild Abnormality",
  abnormal: "Abnormal",
}

const DEFAULT_RECOMMENDATIONS: Record<RiskLevel, string[]> = {
  normal: ["Routine follow-up in 3 years", "Continue regular screenings as scheduled"],
  mild: ["Follow-up colposcopy recommended", "Repeat screening in 6–12 months", "Refer to gynecologist for evaluation"],
  abnormal: ["Immediate colposcopy required", "Urgent referral to specialist", "Biopsy may be needed", "Inform patient and ASHA worker"],
}

// ── Result color helpers (plain CSS values for the print template) ────────────
const PRINT_COLORS: Record<RiskLevel, { text: string; bg: string; border: string }> = {
  normal:   { text: "#059669", bg: "#ecfdf5", border: "#6ee7b7" },
  mild:     { text: "#d97706", bg: "#fffbeb", border: "#fcd34d" },
  abnormal: { text: "#dc2626", bg: "#fef2f2", border: "#fca5a5" },
}

// ── Open a new window with a standalone HTML print report ───────────────────
function openPrintWindow(data: PrintData) {
  const c = PRINT_COLORS[data.label]
  const recRows = data.recommendations
    .map(
      (r, idx) => `<tr>
        <td style="padding:8px 12px;font-size:13px;color:#334155;border-bottom:1px solid #f1f5f9;vertical-align:top;">
          <span style="color:#0d9488;font-weight:700;margin-right:8px;">${idx + 1}.</span>${r}
        </td>
      </tr>`
    )
    .join("")

  const imgBlock = data.imageUrl
    ? `<div style="margin-bottom:24px;">
        <div style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.8px;margin-bottom:10px;">Cervix Image</div>
        <img src="${data.imageUrl}" alt="Cervix scan"
          style="max-height:220px;max-width:100%;border-radius:10px;border:1px solid #e2e8f0;object-fit:contain;" />
      </div>`
    : ""

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Cervical Screening Report – ${data.patientId}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',Arial,sans-serif;color:#1e293b;background:#fff;padding:40px 48px;max-width:760px;margin:0 auto}
    @media print{body{padding:24px 32px}}
  </style>
</head>
<body>

  <!-- Header -->
  <div style="display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:20px;border-bottom:2px solid #0d9488;margin-bottom:28px;">
    <div>
      <div style="font-size:22px;font-weight:700;color:#0d9488;letter-spacing:-.3px;">🩺 CervixCare AI</div>
      <div style="font-size:13px;color:#64748b;margin-top:4px;">Cervical Cancer Screening Report</div>
      <div style="font-size:11px;color:#94a3b8;margin-top:2px;">Powered by AI-Assisted Detection</div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:11px;color:#64748b;">Report Generated</div>
      <div style="font-size:12px;font-weight:600;color:#1e293b;">${data.dateTime}</div>
      <div style="margin-top:8px;font-size:11px;color:#64748b;background:#f1f5f9;padding:4px 10px;border-radius:20px;">
        CONFIDENTIAL — For Medical Use Only
      </div>
    </div>
  </div>

  <!-- Patient Info -->
  <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:10px;padding:18px 22px;margin-bottom:24px;display:flex;gap:40px;flex-wrap:wrap;">
    <div>
      <div style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.8px;">Patient ID</div>
      <div style="font-size:18px;font-weight:700;color:#1e293b;margin-top:2px;">${data.patientId}</div>
    </div>
    <div>
      <div style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.8px;">Screened By</div>
      <div style="font-size:15px;font-weight:600;color:#1e293b;margin-top:2px;">${data.screenerName}</div>
      <div style="font-size:11px;color:#64748b;">${data.screenerRole}</div>
    </div>
    <div>
      <div style="font-size:10px;color:#94a3b8;text-transform:uppercase;letter-spacing:.8px;">Date &amp; Time</div>
      <div style="font-size:13px;font-weight:500;color:#1e293b;margin-top:2px;">${data.dateTime}</div>
    </div>
  </div>

  <!-- Result Banner -->
  <div style="background:${c.bg};border:2px solid ${c.border};border-radius:12px;padding:22px 26px;margin-bottom:24px;">
    <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:.8px;margin-bottom:8px;">AI Analysis Result</div>
    <div style="display:flex;align-items:center;gap:16px;">
      <div style="font-size:28px;font-weight:800;color:${c.text};letter-spacing:-.5px;">${RESULT_LABEL[data.label]}</div>
      <div style="margin-left:auto;text-align:right;">
        <div style="font-size:11px;color:#64748b;">AI Confidence</div>
        <div style="font-size:24px;font-weight:700;color:${c.text};">${data.confidence.toFixed(1)}%</div>
      </div>
    </div>
    <!-- Confidence bar -->
    <div style="margin-top:14px;height:8px;background:#e2e8f0;border-radius:99px;overflow:hidden;">
      <div style="height:100%;width:${data.confidence}%;background:${c.text};border-radius:99px;"></div>
    </div>
    <div style="display:flex;justify-content:space-between;font-size:10px;color:#94a3b8;margin-top:4px;">
      <span>0%</span><span>50%</span><span>100%</span>
    </div>
  </div>

  ${imgBlock}

  <!-- Recommendations -->
  <div style="margin-bottom:28px;">
    <div style="font-size:13px;font-weight:700;color:#1e293b;margin-bottom:12px;padding-bottom:6px;border-bottom:1px solid #e2e8f0;">
      Clinical Recommendations
    </div>
    <table style="width:100%;border-collapse:collapse;">
      <tbody>${recRows}</tbody>
    </table>
  </div>

  <!-- Disclaimer -->
  <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:12px 16px;font-size:11px;color:#78350f;margin-bottom:28px;line-height:1.6;">
    ⚠️ <strong>Important:</strong> This report is generated by an AI-assisted screening tool and is intended to
    support — not replace — clinical judgment. All results should be reviewed by a qualified healthcare professional
    before initiating any treatment or follow-up.
  </div>

  <!-- Footer -->
  <div style="border-top:1px solid #e2e8f0;padding-top:14px;display:flex;justify-content:space-between;font-size:10px;color:#94a3b8;">
    <span>CervixCare AI · Cervical Cancer Detection System</span>
    <span>Patient ID: ${data.patientId} · ${data.dateTime}</span>
  </div>

  <script>window.onload = function(){ window.print(); }<\/script>
</body>
</html>`

  const win = window.open("", "_blank", "width=820,height=900")
  if (win) {
    win.document.write(html)
    win.document.close()
  }
}

// ── Component ────────────────────────────────────────────────────────────────
export default function ScreeningDashboard() {
  const { toast } = useToast()
  const user = getCurrentUser()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [tab, setTab] = useState<"analyze" | "history">("analyze")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [patientIdInput, setPatientIdInput] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [history, setHistory] = useState<CervixAnalysisType[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  // Stores print data for the most recent analysis result
  const [currentPrintData, setCurrentPrintData] = useState<PrintData | null>(null)

  // Load history when switching to history tab
  useEffect(() => {
    if (tab === "history" && user?.id) {
      setHistoryLoading(true)
      cervixAnalysisService.getByAshaWorker(user.id)
        .then(setHistory)
        .catch(() => toast({ title: "Could not load history", variant: "destructive" }))
        .finally(() => setHistoryLoading(false))
    }
  }, [tab, user?.id])

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file?.type.startsWith("image/")) loadFile(file)
    else toast({ title: "Invalid file", description: "Please drop an image file.", variant: "destructive" })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) loadFile(file)
  }

  const loadFile = (file: File) => {
    setSelectedFile(file)
    setResult(null)
    setCurrentPrintData(null)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }

  const handleAnalyze = async () => {
    if (!selectedFile) {
      toast({ title: "No image selected", description: "Please upload a cervix image.", variant: "destructive" })
      return
    }
    if (!patientIdInput.trim()) {
      toast({ title: "Patient ID required", description: "Enter the patient ID before analyzing.", variant: "destructive" })
      return
    }

    setAnalyzing(true)
    setResult(null)
    setCurrentPrintData(null)

    try {
      // ── Call real Python model API ───────────────────────────────────────
      const formData = new FormData()
      formData.append("file", selectedFile)

      const res = await fetch(PYTHON_MODEL_API, { method: "POST", body: formData })

      const data = await res.json()
      if (data.error) {
        throw new Error(data.error + (data.details ? `: ${data.details}` : ""))
      }

      // Handle both Flask and FastAPI formats:
      // data.class ("Normal"/"Abnormal"), data.prediction ("Normal"/"Abnormal"), data.label
      const rawClass = (data.class || data.prediction || data.label || "normal").toString().toLowerCase()
      const label: RiskLevel = rawClass.includes("abnormal")
        ? "abnormal"
        : rawClass.includes("mild")
        ? "mild"
        : "normal"

      // Handle confidence (either 0.0 - 1.0 or 0 - 100)
      const rawScore = data.confidence !== undefined ? data.confidence : data.score !== undefined ? data.score : 0.85
      const confidence: number = rawScore <= 1 ? rawScore * 100 : rawScore

      const recommendations = data.recommendations || DEFAULT_RECOMMENDATIONS[label]

      const analysisResult: AnalysisResult = { label, confidence, recommendations }
      setResult(analysisResult)

      // Build print data for the current result
      setCurrentPrintData({
        patientId: patientIdInput.trim(),
        label,
        confidence,
        recommendations,
        screenerName: user?.name ?? "Unknown",
        screenerRole: ROLE_LABELS[user?.role ?? ""] ?? user?.role ?? "",
        dateTime: new Date().toLocaleString(),
        imageUrl: preview ?? undefined,
      })

      // Save to DB
      try {
        await cervixAnalysisService.create({
          patientId: patientIdInput.trim(),
          ashaWorkerId: user?.id ?? "",
          imageUrl: preview ?? "",
          result: label,
          confidence,
          recommendations,
        })
      } catch {
        console.warn("Could not save analysis to DB")
      }

    } catch (err: any) {
      toast({
        title: "Analysis failed",
        description: err?.message ?? "Could not reach the Python model API. Please check it is running.",
        variant: "destructive",
      })
    } finally {
      setAnalyzing(false)
    }
  }

  const resetForm = () => {
    setSelectedFile(null)
    setPreview(null)
    setResult(null)
    setCurrentPrintData(null)
    setPatientIdInput("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // Build print data for a history record and open print window
  const handleHistoryPrint = (a: CervixAnalysisType) => {
    const lvl = (a.result ?? "normal") as RiskLevel
    openPrintWindow({
      patientId: a.patientId ?? "Unknown",
      label: lvl,
      confidence: a.confidence ?? 0,
      recommendations: (a.recommendations as string[] | undefined) ?? DEFAULT_RECOMMENDATIONS[lvl],
      screenerName: user?.name ?? "Unknown",
      screenerRole: ROLE_LABELS[user?.role ?? ""] ?? user?.role ?? "",
      dateTime: a.createdAt ? new Date(a.createdAt).toLocaleString() : new Date().toLocaleString(),
      imageUrl: a.imageUrl ?? undefined,
    })
  }

  return (
    <div className="space-y-6">
      {/* ── Tab Switcher ── */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-slate-700">
        {(["analyze", "history"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? "border-teal-600 text-teal-600 dark:text-teal-400"
                : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {t === "analyze" ? (
              <span className="flex items-center gap-1.5"><FlaskConical className="h-4 w-4" /> Analyze Image</span>
            ) : (
              <span className="flex items-center gap-1.5"><History className="h-4 w-4" /> Screening History</span>
            )}
          </button>
        ))}
      </div>

      {/* ══════════════ ANALYZE TAB ══════════════ */}
      {tab === "analyze" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left: Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-teal-600" />
                Upload Cervix Image
              </CardTitle>
              <CardDescription>Drag &amp; drop or click to select a colposcopy/VIA image</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Drop Zone */}
              <div
                onDrop={handleFileDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all duration-200 flex items-center justify-center
                  ${isDragging ? "border-teal-500 bg-teal-50 dark:bg-teal-950/30 scale-[1.01]" : "border-gray-300 dark:border-slate-600 hover:border-teal-400 hover:bg-gray-50 dark:hover:bg-slate-800/50"}
                  ${preview ? "h-56" : "h-40"}`}
              >
                {preview ? (
                  <img src={preview} alt="Preview" className="h-full w-full object-contain rounded-xl" />
                ) : (
                  <div className="text-center p-6">
                    <ImageIcon className="h-10 w-10 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500">Drop image here or <span className="text-teal-600 font-medium">browse</span></p>
                    <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP supported</p>
                  </div>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </div>

              {selectedFile && (
                <p className="text-xs text-muted-foreground truncate">📎 {selectedFile.name}</p>
              )}

              {/* Patient ID */}
              <div className="space-y-1.5">
                <Label htmlFor="patient-id" className="flex items-center gap-1.5">
                  <Search className="h-4 w-4" /> Patient ID
                </Label>
                <Input
                  id="patient-id"
                  placeholder="e.g. PAT00123"
                  value={patientIdInput}
                  onChange={(e) => setPatientIdInput(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleAnalyze}
                  disabled={analyzing || !selectedFile}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                >
                  {analyzing ? (
                    <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Analyzing…</>
                  ) : (
                    <><FlaskConical className="h-4 w-4 mr-2" /> Run AI Analysis</>
                  )}
                </Button>
                {(selectedFile || result) && (
                  <Button variant="outline" onClick={resetForm}>
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Right: Result */}
          <Card className={result ? `${RISK_CONFIG[result.label].bg} ${RISK_CONFIG[result.label].border} border-2` : ""}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-teal-600" />
                Analysis Result
              </CardTitle>
              <CardDescription>AI model output will appear here after analysis</CardDescription>
            </CardHeader>
            <CardContent>
              {!result && !analyzing && (
                <div className="flex flex-col items-center justify-center h-48 text-center text-muted-foreground gap-3">
                  <FlaskConical className="h-12 w-12 opacity-20" />
                  <p className="text-sm">Upload an image and run analysis to see results</p>
                </div>
              )}

              {analyzing && (
                <div className="flex flex-col items-center justify-center h-48 gap-4">
                  <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
                  <p className="text-sm text-muted-foreground">Sending to AI model…</p>
                </div>
              )}

              {result && (
                <div className="space-y-5">
                  {/* Risk Badge */}
                  <div className="flex items-center gap-4">
                    {RISK_CONFIG[result.label].icon}
                    <div>
                      <div className={`text-2xl font-bold capitalize ${RISK_CONFIG[result.label].color}`}>
                        {result.label === "normal" ? "Normal" : result.label === "mild" ? "Mild Abnormality" : "Abnormal"}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Confidence: <span className="font-semibold">{result.confidence.toFixed(1)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Confidence Bar */}
                  <div className="space-y-1">
                    <div className="h-2.5 w-full bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          result.label === "normal" ? "bg-emerald-500" :
                          result.label === "mild" ? "bg-amber-500" : "bg-red-500"
                        }`}
                        style={{ width: `${result.confidence}%` }}
                      />
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <p className="text-sm font-semibold mb-2">Recommendations</p>
                    <ul className="space-y-1.5">
                      {result.recommendations.map((r, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="text-teal-500 mt-0.5">•</span> {r}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <Badge variant="outline" className="text-xs">
                      Screened by: {ROLE_LABELS[user?.role ?? ""] ?? user?.role} · {user?.name}
                    </Badge>

                    {/* ── Print Report Button ── */}
                    {currentPrintData && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-2 border-teal-500 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950/40 dark:border-teal-600 dark:text-teal-400 font-medium"
                        onClick={() => openPrintWindow(currentPrintData)}
                      >
                        <Printer className="h-4 w-4" />
                        Print Report
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* ══════════════ HISTORY TAB ══════════════ */}
      {tab === "history" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5 text-teal-600" /> Screening History
            </CardTitle>
            <CardDescription>All analyses performed by you</CardDescription>
          </CardHeader>
          <CardContent>
            {historyLoading ? (
              <div className="flex items-center gap-2 py-8 justify-center text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading history…
              </div>
            ) : history.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <History className="h-10 w-10 mx-auto mb-2 opacity-20" />
                <p className="text-sm">No screenings recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((a, i) => {
                  const lvl = (a.result ?? "normal") as RiskLevel
                  const cfg = RISK_CONFIG[lvl] ?? RISK_CONFIG.normal
                  return (
                    <div key={a.id ?? i} className={`flex items-center justify-between rounded-lg border p-3 ${cfg.bg} ${cfg.border}`}>
                      <div>
                        <p className="text-sm font-medium">Patient ID: {a.patientId}</p>
                        <p className="text-xs text-muted-foreground">
                          {a.createdAt ? new Date(a.createdAt).toLocaleString() : "—"}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <Badge className={`capitalize ${cfg.color}`} variant="outline">{lvl}</Badge>
                          <p className="text-xs text-muted-foreground mt-1">{(a.confidence ?? 0).toFixed(1)}%</p>
                        </div>
                        {/* 🖨 Print icon for each history record */}
                        <Button
                          size="icon"
                          variant="ghost"
                          title="Print patient report"
                          className="h-8 w-8 text-teal-600 hover:bg-teal-100 dark:hover:bg-teal-900/40"
                          onClick={() => handleHistoryPrint(a)}
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
