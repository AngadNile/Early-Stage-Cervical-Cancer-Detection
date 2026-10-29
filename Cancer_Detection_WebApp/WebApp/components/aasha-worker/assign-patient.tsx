"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { getCurrentUser } from "@/lib/auth"
import {
  patientService,
  doctorService,
  assignmentService,
  hospitalService,
  type Patient,
  type Doctor,
  type PatientDoctorAssignment,
  type Hospital,
} from "@/lib/api-services"
import { User, Stethoscope, CheckCircle2, Loader2, Building2, ClipboardList } from "lucide-react"

export default function AssignPatient() {
  const { toast } = useToast()
  const currentUser = getCurrentUser()
  const ashaId = currentUser?.id

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [patients, setPatients] = useState<Patient[]>([])
  const [allDoctors, setAllDoctors] = useState<Doctor[]>([])
  const [assignments, setAssignments] = useState<PatientDoctorAssignment[]>([])
  const [hospitals, setHospitals] = useState<Hospital[]>([])

  const [selectedPatient, setSelectedPatient] = useState<string>("")
  const [selectedDoctor, setSelectedDoctor] = useState<string>("")
  const [selectedPatientForHospital, setSelectedPatientForHospital] = useState<string>("")
  const [selectedHospitalId, setSelectedHospitalId] = useState<string>("")

  useEffect(() => {
    const load = async () => {
      if (!ashaId) return
      try {
        setLoading(true)
        const [myPatients, availableDoctors, myAssignments, allHospitals] = await Promise.all([
          patientService.getByAshaWorker(ashaId),
          doctorService.getAll(),
          assignmentService.getByAshaWorker(ashaId),
          hospitalService.getAll(),
        ])
        setPatients(myPatients)
        setAllDoctors(availableDoctors)
        setAssignments(myAssignments)
        setHospitals(allHospitals)
      } catch (err: any) {
        toast({
          title: "Could not load data",
          description: err?.message || "Please check your connection and try again.",
        })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [ashaId, toast])

  const patientNameById = useMemo(() => {
    const m = new Map<string, string>()
    for (const p of patients) { if (p.id) m.set(p.id, p.name) }
    return m
  }, [patients])

  const doctorNameById = useMemo(() => {
    const m = new Map<string, string>()
    for (const d of allDoctors) { if (d.id) m.set(d.id, d.name) }
    return m
  }, [allDoctors])

  const handleAssign = async () => {
    if (!selectedPatient || !selectedDoctor) {
      toast({ title: "Complete selection", description: "Choose both a patient and a doctor." })
      return
    }
    try {
      setSaving(true)
      await assignmentService.create({ patientId: selectedPatient, doctorId: selectedDoctor, ashaWorkerId: ashaId! })
      const myAssignments = await assignmentService.getByAshaWorker(ashaId!)
      setAssignments(myAssignments)
      setSelectedPatient("")
      setSelectedDoctor("")
      toast({ title: "Patient referred to doctor", description: "Referral saved successfully." })
    } catch (err: any) {
      toast({ title: "Could not assign", description: err?.message || "Please try again." })
    } finally {
      setSaving(false)
    }
  }

  const handleAssignHospital = async () => {
    if (!selectedPatientForHospital || !selectedHospitalId) {
      toast({ title: "Complete selection", description: "Choose both a patient and a hospital." })
      return
    }
    try {
      setSaving(true)
      await patientService.update(selectedPatientForHospital, { preferredHospitalId: selectedHospitalId })
      setSelectedPatientForHospital("")
      setSelectedHospitalId("")
      toast({ title: "Hospital assigned", description: "Patient's screening hospital has been set." })
    } catch (err: any) {
      toast({ title: "Could not assign hospital", description: err?.message || "Please try again." })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-10" role="status">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading data…</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">

      {/* ── Refer Patient to Doctor ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-teal-600" />
            Refer Patient to Doctor
          </CardTitle>
          <CardDescription>Select a registered patient and assign them to an available doctor for screening.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {patients.length === 0 ? (
            <p className="text-sm text-muted-foreground">No registered patients found. Add patients from the <strong>Register Patient</strong> tab.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium flex items-center gap-1"><User className="h-4 w-4" /> Patient</div>
                  <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                    <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                    <SelectContent>
                      {patients.map((p) => (
                        <SelectItem key={p.id} value={p.id!}>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.patientId}</div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium flex items-center gap-1"><Stethoscope className="h-4 w-4" /> Doctor</div>
                  <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
                    <SelectTrigger><SelectValue placeholder="Select doctor" /></SelectTrigger>
                    <SelectContent>
                      {allDoctors.map((d) => (
                        <SelectItem key={d.id} value={d.id!}>
                          <div className="font-medium">{d.name}</div>
                          <div className="text-xs text-muted-foreground">{d.specialization}</div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleAssign} disabled={saving || !selectedPatient || !selectedDoctor} className="w-full">
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {saving ? "Saving…" : "Refer to Doctor"}
              </Button>

              {assignments.length > 0 && (
                <div className="pt-2">
                  <div className="text-sm font-medium mb-2 flex items-center gap-1"><ClipboardList className="h-4 w-4" /> Recent Referrals</div>
                  <div className="space-y-2">
                    {assignments.map((a) => (
                      <div key={a.id} className="flex items-center gap-2 text-sm border rounded-md px-3 py-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{patientNameById.get(a.patientId) || a.patientId}</span>
                        <span className="text-muted-foreground">→</span>
                        <Stethoscope className="h-4 w-4 text-muted-foreground" />
                        <span>{doctorNameById.get(a.doctorId) || a.doctorId}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* ── Assign Patient to Hospital ── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-teal-600" />
            Assign Patient to Hospital
          </CardTitle>
          <CardDescription>Set a screening hospital for a patient to help them during appointment booking.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {patients.length === 0 ? (
            <p className="text-sm text-muted-foreground">No registered patients found.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium flex items-center gap-1"><User className="h-4 w-4" /> Patient</div>
                  <Select value={selectedPatientForHospital} onValueChange={setSelectedPatientForHospital}>
                    <SelectTrigger><SelectValue placeholder="Select patient" /></SelectTrigger>
                    <SelectContent>
                      {patients.map((p) => (
                        <SelectItem key={p.id} value={p.id!}>
                          <div className="font-medium">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.patientId}</div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium flex items-center gap-1"><Building2 className="h-4 w-4" /> Hospital</div>
                  <Select value={selectedHospitalId} onValueChange={setSelectedHospitalId}>
                    <SelectTrigger><SelectValue placeholder="Select hospital" /></SelectTrigger>
                    <SelectContent>
                      {hospitals.map((h) => (
                        <SelectItem key={h.id} value={h.id!}>
                          <div className="font-medium">{h.name}</div>
                          <div className="text-xs text-muted-foreground">{h.city}</div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={handleAssignHospital}
                disabled={saving || !selectedPatientForHospital || !selectedHospitalId}
                className="w-full"
              >
                <CheckCircle2 className="h-4 w-4 mr-2" />
                {saving ? "Saving…" : "Assign Hospital"}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
