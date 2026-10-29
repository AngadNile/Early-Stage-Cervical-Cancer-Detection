// Service functions communicating with Express + MongoDB REST API
const API_BASE = "http://localhost:5000/api"

export interface Patient {
  id?: string
  _id?: string
  patientId: string
  name: string
  age: number
  gender: string
  phone: string
  address: string
  medicalHistory: string
  ashaWorkerId: string
  email?: string
  preferredHospitalId?: string
  createdAt?: string
}

export interface Doctor {
  id?: string
  _id?: string
  name: string
  specialization: string
  phone: string
  email: string
  hospitalId?: string
  experience: string
}

export interface AshaWorker {
  id?: string
  _id?: string
  name: string
  phone: string
  address: string
  experience: string
  username: string
  email?: string
}

export interface Hospital {
  id?: string
  _id?: string
  name: string
  type: "Government" | "Private"
  city: string
  address: string
  phone: string
  doctorIds: string[]
  createdBy?: string
}

export interface CervixAnalysis {
  id?: string
  _id?: string
  patientId: string
  imageUrl?: string
  analysis?: string
  riskLevel?: "low" | "medium" | "high"
  result?: string          // "normal" | "mild" | "abnormal" – saved by screening dashboard
  confidence?: number      // 0–100
  recommendations?: string[]
  doctorId?: string
  ashaWorkerId?: string
  doctorFeedback?: string
  nextSteps?: string
  doctorReviewAt?: any
  createdAt?: any
}

export interface Appointment {
  id?: string
  _id?: string
  patientId: string
  doctorId: string
  hospitalId: string
  date: string
  time: string
  reason?: string
  symptoms?: string
  status: "scheduled" | "completed" | "cancelled"
}

export const patientService = {
  async create(patient: Omit<Patient, "id" | "_id">) {
    const res = await fetch(`${API_BASE}/patients`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patient),
    })
    const data = await res.json()
    return data._id || data.id
  },

  async getAll() {
    const res = await fetch(`${API_BASE}/patients`)
    const data = await res.json()
    return data.map((d: any) => ({ ...d, id: d._id })) as Patient[]
  },

  async getByAshaWorker(ashaWorkerId: string) {
    const res = await fetch(`${API_BASE}/patients?ashaWorkerId=${ashaWorkerId}`)
    const data = await res.json()
    return data.map((d: any) => ({ ...d, id: d._id })) as Patient[]
  },

  async getById(id: string) {
    try {
      const res = await fetch(`${API_BASE}/patients/${id}`)
      if (res.ok) {
        const data = await res.json()
        if (data) return { ...data, id: data._id } as Patient
      }
    } catch {}
    const all = await this.getAll()
    return all.find((p) => p.id === id || p.patientId === id || (p as any).userId === id) || null
  },

  async getByPatientId(patientId: string) {
    const all = await this.getAll()
    return all.find((p) => p.patientId === patientId) || null
  },

  async update(id: string, updates: Partial<Patient>) {
    const res = await fetch(`${API_BASE}/patients/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!res.ok) return
    const data = await res.json()
    return { ...data, id: data._id } as Patient
  },

  async delete(id: string) {
    await fetch(`${API_BASE}/patients/${id}`, { method: "DELETE" })
  },
}

export const doctorService = {
  async getAll() {
    const res = await fetch(`${API_BASE}/doctors`)
    const data = await res.json()
    return data.map((d: any) => ({ ...d, id: d._id })) as Doctor[]
  },

  async getById(id: string) {
    const doctors = await this.getAll()
    return doctors.find((d) => d.id === id) || null
  },

  async update(id: string, updates: Partial<Doctor>) {
    const res = await fetch(`${API_BASE}/doctors/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!res.ok) {
      throw new Error("Failed to update doctor profile")
    }
    const data = await res.json()
    return { ...data, id: data._id } as Doctor
  },

  async delete(id: string) {
    await fetch(`${API_BASE}/doctors/${id}`, { method: "DELETE" })
  },
}

export interface PatientDoctorAssignment {
  id?: string
  _id?: string
  patientId: string
  doctorId: string
  ashaWorkerId: string
  createdAt?: any
}

export const ashaWorkerService = {
  async getAll() {
    const res = await fetch(`${API_BASE}/asha-workers`)
    const data = await res.json()
    return data.map((d: any) => ({ ...d, id: d._id })) as AshaWorker[]
  },

  async getById(id: string) {
    const workers = await this.getAll()
    return workers.find((w) => w.id === id) || null
  },

  async update(id: string, updates: Partial<AshaWorker>) {
    const res = await fetch(`${API_BASE}/asha-workers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!res.ok) return
    const data = await res.json()
    return { ...data, id: data._id } as AshaWorker
  },

  async delete(id: string) {
    await fetch(`${API_BASE}/asha-workers/${id}`, { method: "DELETE" })
  },
}

export const hospitalService = {
  async create(hospital: Omit<Hospital, "id" | "_id">) {
    const res = await fetch(`${API_BASE}/hospitals`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(hospital),
    })
    const data = await res.json()
    return data._id || data.id
  },

  async getAll() {
    const res = await fetch(`${API_BASE}/hospitals`)
    const data = await res.json()
    return data.map((d: any) => ({ ...d, id: d._id })) as Hospital[]
  },
}

export const cervixAnalysisService = {
  async create(analysis: Omit<CervixAnalysis, "id" | "_id">) {
    const res = await fetch(`${API_BASE}/analyses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(analysis),
    })
    const data = await res.json()
    return data._id || data.id
  },

  async getAll() {
    const res = await fetch(`${API_BASE}/analyses`)
    const data = await res.json()
    return data.map((d: any) => ({ ...d, id: d._id })) as CervixAnalysis[]
  },

  async getByAshaWorker(ashaWorkerId: string) {
    const res = await fetch(`${API_BASE}/analyses?ashaWorkerId=${ashaWorkerId}`)
    const data = await res.json()
    return data.map((d: any) => ({ ...d, id: d._id })) as CervixAnalysis[]
  },

  async getByDoctor(doctorId: string) {
    const res = await fetch(`${API_BASE}/analyses?doctorId=${doctorId}`)
    const data = await res.json()
    return data.map((d: any) => ({ ...d, id: d._id })) as CervixAnalysis[]
  },

  async getByPatient(patientId: string) {
    const all = await this.getAll()
    // Direct match first
    const direct = all.filter((a) => a.patientId === patientId)
    if (direct.length > 0) return direct

    // Check if patientId corresponds to a registered patient with alternate identifier (patientId code vs MongoDB id)
    try {
      const patient = await patientService.getById(patientId)
      if (patient) {
        const ids = new Set([
          patient.id,
          patient._id,
          patient.patientId,
          (patient as any).userId,
        ].filter(Boolean))
        return all.filter((a) => ids.has(a.patientId))
      }
    } catch {}

    return []
  },

  async update(id: string, updates: Partial<CervixAnalysis>) {
    const res = await fetch(`${API_BASE}/analyses/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!res.ok) return
    const data = await res.json()
    return { ...data, id: data._id } as CervixAnalysis
  },
}

export const imageService = {
  async uploadCervixImage(file: Blob | File, patientId: string): Promise<string> {
    return URL.createObjectURL(file)
  },
}

export interface ChatMessage {
  id?: string
  _id?: string
  patientId?: string
  doctorId?: string
  ashaWorkerId?: string
  senderId?: string
  senderType: "patient" | "doctor" | "ashaWorker"
  message: string
  timestamp?: any
  createdAt?: any
}

export const chatService = {
  async sendMessage(msg: {
    patientId: string
    doctorId?: string
    ashaWorkerId?: string
    senderId: string
    senderType: "patient" | "doctor" | "ashaWorker"
    message: string
  }) {
    const res = await fetch(`${API_BASE}/chats`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg),
    })
    const data = await res.json()
    return data._id || data.id
  },

  async getMessages(patientId?: string, doctorId?: string, ashaWorkerId?: string): Promise<ChatMessage[]> {
    const params = new URLSearchParams()
    if (patientId) params.append("patientId", patientId)
    if (doctorId) params.append("doctorId", doctorId)
    if (ashaWorkerId) params.append("ashaWorkerId", ashaWorkerId)

    const res = await fetch(`${API_BASE}/chats?${params.toString()}`)
    if (!res.ok) return []
    const data = await res.json()
    return (data || []).map((d: any) => ({ ...d, id: d._id, timestamp: d.createdAt })) as ChatMessage[]
  },
}

export const appointmentService = {
  async create(appt: Omit<Appointment, "id" | "_id">) {
    const res = await fetch(`${API_BASE}/appointments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(appt),
    })
    const data = await res.json()
    return data._id || data.id
  },

  async getByPatient(patientId: string): Promise<Appointment[]> {
    const res = await fetch(`${API_BASE}/appointments?patientId=${patientId}`)
    if (!res.ok) return []
    const data = await res.json()
    return (data || []).map((d: any) => ({ ...d, id: d._id })) as Appointment[]
  },

  async getByDoctor(doctorId: string): Promise<Appointment[]> {
    const res = await fetch(`${API_BASE}/appointments?doctorId=${doctorId}`)
    if (!res.ok) return []
    const data = await res.json()
    return (data || []).map((d: any) => ({ ...d, id: d._id })) as Appointment[]
  },
}

export const callService = {
  async getCallHistory(patientId?: string, doctorId?: string) {
    return []
  },
}

export const ashaDoctorLinkService = {
  async getDoctorsForAsha(ashaId: string) {
    return doctorService.getAll()
  },
  async linkDoctor(ashaWorkerId: string, doctorId: string) {
    return "link_" + Date.now()
  },
  async unlinkDoctor(linkId: string) {
    return
  },
}

export const assignmentService = {
  async getByAshaWorker(ashaWorkerId: string): Promise<PatientDoctorAssignment[]> {
    try {
      const res = await fetch(`${API_BASE}/assignments?ashaWorkerId=${ashaWorkerId}`)
      if (!res.ok) return []
      const data = await res.json()
      return (data || []).map((d: any) => ({ ...d, id: d._id })) as PatientDoctorAssignment[]
    } catch {
      return []
    }
  },

  async getByDoctor(doctorId: string): Promise<PatientDoctorAssignment[]> {
    try {
      const res = await fetch(`${API_BASE}/assignments?doctorId=${doctorId}`)
      if (!res.ok) return []
      const data = await res.json()
      return (data || []).map((d: any) => ({ ...d, id: d._id })) as PatientDoctorAssignment[]
    } catch {
      return []
    }
  },

  async create(assignment: { patientId: string; doctorId: string; ashaWorkerId: string; notes?: string }) {
    const res = await fetch(`${API_BASE}/assignments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(assignment),
    })
    const data = await res.json()
    return data._id || data.id
  },
}

export const screeningUnitService = {
  async getAll() {
    try {
      const res = await fetch(`${API_BASE}/screening-units`)
      if (!res.ok) return []
      const data = await res.json()
      return (data || []).map((d: any) => ({ ...d, id: d._id }))
    } catch {
      return []
    }
  },
}

