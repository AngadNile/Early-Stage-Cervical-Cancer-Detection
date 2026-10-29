export interface CervixAnalysisType {
  id?: string
  patientId: string
  imageUrl?: string
  analysis?: string
  riskLevel?: "low" | "medium" | "high"
  result?: string
  confidence?: number
  recommendations?: string[] | any
  doctorId?: string
  ashaWorkerId?: string
  createdAt?: any
  doctorFeedback?: string
  nextSteps?: string
  doctorReviewAt?: any
}
