"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Search, Users, Stethoscope, Building2, Eye, Edit, Trash2, Loader2, X, Save, AlertTriangle } from "lucide-react"
import { patientService, doctorService, ashaWorkerService } from "@/lib/api-services"
import type { Patient, Doctor, AshaWorker } from "@/lib/api-services"
import { useToast } from "@/hooks/use-toast"

type ViewItem = { type: "patient" | "doctor" | "asha"; data: Patient | Doctor | AshaWorker } | null
type EditItem = { type: "patient" | "doctor" | "asha"; data: any } | null
type DeleteItem = { type: "patient" | "doctor" | "asha"; id: string; name: string } | null

export default function ManageConnections() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("patients")
  const [patients, setPatients] = useState<Patient[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [ashaWorkers, setAshaWorkers] = useState<AshaWorker[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Dialog states
  const [viewItem, setViewItem] = useState<ViewItem>(null)
  const [editItem, setEditItem] = useState<EditItem>(null)
  const [deleteItem, setDeleteItem] = useState<DeleteItem>(null)

  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadData = async () => {
    try {
      setLoading(true)
      const [patientsData, doctorsData, ashaWorkersData] = await Promise.all([
        patientService.getAll(),
        doctorService.getAll(),
        ashaWorkerService.getAll(),
      ])
      setPatients(patientsData)
      setDoctors(doctorsData)
      setAshaWorkers(ashaWorkersData)
    } catch (error) {
      console.error("[v0] Error loading data:", error)
      toast({ title: "Error", description: "Failed to load data from database", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.address || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.patientId || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredDoctors = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.specialization || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.email || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredAshaWorkers = ashaWorkers.filter(
    (w) =>
      w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (w.address || "").toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // ──── EDIT ────
  const handleSaveEdit = async () => {
    if (!editItem) return
    setSaving(true)
    try {
      if (editItem.type === "patient") {
        await patientService.update(editItem.data.id, editItem.data)
        setPatients((prev) => prev.map((p) => (p.id === editItem.data.id ? { ...p, ...editItem.data } : p)))
      } else if (editItem.type === "doctor") {
        await doctorService.update(editItem.data.id, editItem.data)
        setDoctors((prev) => prev.map((d) => (d.id === editItem.data.id ? { ...d, ...editItem.data } : d)))
      } else if (editItem.type === "asha") {
        await ashaWorkerService.update(editItem.data.id, editItem.data)
        setAshaWorkers((prev) => prev.map((w) => (w.id === editItem.data.id ? { ...w, ...editItem.data } : w)))
      }
      toast({ title: "Saved", description: "Record updated successfully." })
      setEditItem(null)
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Could not save changes.", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  // ──── DELETE ────
  const handleConfirmDelete = async () => {
    if (!deleteItem) return
    setSaving(true)
    try {
      if (deleteItem.type === "patient") {
        await patientService.delete(deleteItem.id)
        setPatients((prev) => prev.filter((p) => p.id !== deleteItem.id))
      } else if (deleteItem.type === "doctor") {
        await doctorService.delete(deleteItem.id)
        setDoctors((prev) => prev.filter((d) => d.id !== deleteItem.id))
      } else if (deleteItem.type === "asha") {
        await ashaWorkerService.delete(deleteItem.id)
        setAshaWorkers((prev) => prev.filter((w) => w.id !== deleteItem.id))
      }
      toast({ title: "Deleted", description: `${deleteItem.name} has been removed.` })
      setDeleteItem(null)
    } catch (e: any) {
      toast({ title: "Error", description: e?.message || "Could not delete record.", variant: "destructive" })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Manage Connections
          </CardTitle>
          <CardDescription>View, edit and manage patients, doctors, and ASHA workers in your network</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <Search className="h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name, address, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            {searchTerm && (
              <Button variant="ghost" size="sm" onClick={() => setSearchTerm("")}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="patients" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Patients ({filteredPatients.length})
              </TabsTrigger>
              <TabsTrigger value="doctors" className="flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Doctors ({filteredDoctors.length})
              </TabsTrigger>
              <TabsTrigger value="ashaWorkers" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                ASHA Workers ({filteredAshaWorkers.length})
              </TabsTrigger>
            </TabsList>

            {/* ── PATIENTS ── */}
            <TabsContent value="patients" className="space-y-4">
              {filteredPatients.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No patients found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPatients.map((patient) => (
                      <TableRow key={patient.id}>
                        <TableCell className="font-medium">{patient.patientId}</TableCell>
                        <TableCell>{patient.name}</TableCell>
                        <TableCell>{patient.age}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{patient.gender}</Badge>
                        </TableCell>
                        <TableCell>{patient.phone}</TableCell>
                        <TableCell className="max-w-[150px] truncate">{patient.address}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="outline" title="View" onClick={() => setViewItem({ type: "patient", data: patient })}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" title="Edit" onClick={() => setEditItem({ type: "patient", data: { ...patient } })}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" title="Delete" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setDeleteItem({ type: "patient", id: patient.id!, name: patient.name })}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            {/* ── DOCTORS ── */}
            <TabsContent value="doctors" className="space-y-4">
              {filteredDoctors.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Stethoscope className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No doctors found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Specialization</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDoctors.map((doctor) => (
                      <TableRow key={doctor.id}>
                        <TableCell className="font-medium">{doctor.name}</TableCell>
                        <TableCell>{doctor.specialization}</TableCell>
                        <TableCell>{doctor.phone}</TableCell>
                        <TableCell>{doctor.email}</TableCell>
                        <TableCell>{doctor.experience}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="outline" title="View" onClick={() => setViewItem({ type: "doctor", data: doctor })}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" title="Edit" onClick={() => setEditItem({ type: "doctor", data: { ...doctor } })}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" title="Delete" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setDeleteItem({ type: "doctor", id: doctor.id!, name: doctor.name })}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>

            {/* ── ASHA WORKERS ── */}
            <TabsContent value="ashaWorkers" className="space-y-4">
              {filteredAshaWorkers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Building2 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No ASHA workers found</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAshaWorkers.map((worker) => (
                      <TableRow key={worker.id}>
                        <TableCell className="font-medium">{worker.name}</TableCell>
                        <TableCell>{worker.phone}</TableCell>
                        <TableCell>{worker.email || "—"}</TableCell>
                        <TableCell className="max-w-[150px] truncate">{worker.address}</TableCell>
                        <TableCell>{worker.experience}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button size="sm" variant="outline" title="View" onClick={() => setViewItem({ type: "asha", data: worker })}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" title="Edit" onClick={() => setEditItem({ type: "asha", data: { ...worker } })}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" title="Delete" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => setDeleteItem({ type: "asha", id: worker.id!, name: worker.name })}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* ── VIEW DIALOG ── */}
      <Dialog open={!!viewItem} onOpenChange={() => setViewItem(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {viewItem?.type === "patient" ? "Patient Details" : viewItem?.type === "doctor" ? "Doctor Details" : "ASHA Worker Details"}
            </DialogTitle>
            <DialogDescription>Full information for this record</DialogDescription>
          </DialogHeader>
          {viewItem && (
            <div className="space-y-3 text-sm">
              {Object.entries(viewItem.data)
                .filter(([k]) => !["_id", "id", "__v"].includes(k))
                .map(([key, value]) => (
                  <div key={key} className="flex justify-between border-b pb-1">
                    <span className="font-medium text-gray-600 capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
                    <span className="text-right max-w-[200px] truncate">{String(value ?? "—")}</span>
                  </div>
                ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewItem(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── EDIT DIALOG ── */}
      <Dialog open={!!editItem} onOpenChange={() => setEditItem(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit {editItem?.type === "patient" ? "Patient" : editItem?.type === "doctor" ? "Doctor" : "ASHA Worker"}</DialogTitle>
            <DialogDescription>Make changes and click Save</DialogDescription>
          </DialogHeader>
          {editItem && (
            <div className="space-y-3">
              {Object.entries(editItem.data)
                .filter(([k]) => !["_id", "id", "__v", "password", "role", "userId", "createdAt", "updatedAt"].includes(k))
                .map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <Label className="capitalize">{key.replace(/([A-Z])/g, " $1")}</Label>
                    <Input
                      value={String(value ?? "")}
                      onChange={(e) => setEditItem({ ...editItem, data: { ...editItem.data, [key]: e.target.value } })}
                      placeholder={key}
                    />
                  </div>
                ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>Cancel</Button>
            <Button onClick={handleSaveEdit} disabled={saving}>
              {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</> : <><Save className="h-4 w-4 mr-2" />Save</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── DELETE CONFIRM DIALOG ── */}
      <Dialog open={!!deleteItem} onOpenChange={() => setDeleteItem(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" />
              Confirm Delete
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteItem?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteItem(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleConfirmDelete} disabled={saving}>
              {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Deleting…</> : <><Trash2 className="h-4 w-4 mr-2" />Delete</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
