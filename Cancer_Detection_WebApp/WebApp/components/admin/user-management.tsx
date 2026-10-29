"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Users, UserPlus, Edit, Trash2, Search, Filter, Loader2, Stethoscope, Heart, User } from "lucide-react"
import {
  doctorService,
  ashaWorkerService,
  patientService,
  hospitalService,
  type Doctor,
  type AshaWorker,
  type Patient,
  type Hospital,
} from "@/lib/api-services"
import { registerNewUser, getCurrentUser } from "@/lib/auth"

type UserType = "doctor" | "ashaWorker" | "patient"
type AllUsers = (Doctor | AshaWorker | Patient) & { userType?: string; address?: string }

export default function UserManagement() {
  const [users, setUsers] = useState<AllUsers[]>([])
  const [filteredUsers, setFilteredUsers] = useState<AllUsers[]>([])
  const [selectedUserType, setSelectedUserType] = useState<UserType | "all">("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newUser, setNewUser] = useState({
    userType: "patient" as UserType,
    name: "",
    email: "",
    phone: "",
    address: "",
    username: "",
    password: "",
    // Doctor specific
    specialization: "",
    experience: "",
    hospitalId: "",
    // Patient specific
    patientId: "",
    age: "",
    gender: "",
    medicalHistory: "",
    ashaWorkerId: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const current = getCurrentUser()

  useEffect(() => {
    loadAllUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, selectedUserType, searchTerm])

  const loadAllUsers = async () => {
    try {
      setLoading(true)
      const [doctors, ashaWorkers, patients, hs] = await Promise.all([
        doctorService.getAll(),
        ashaWorkerService.getAll(),
        patientService.getAll(),
        hospitalService.getAll(),
      ])

      let visibleDoctors = doctors
      let visiblePatients = patients

      if (current?.role === "admin") {
        visiblePatients = patients.filter((p) => p.ashaWorkerId === current.id)
        // Optional: if you also want to scope doctors to only those created by this admin:
        visibleDoctors = doctors.filter((d: any) => d.createdBy === current.id)
      }

      const allUsers = [
        ...visibleDoctors.map((d) => ({ ...d, userType: "doctor" as const })),
        ...ashaWorkers.map((a) => ({ ...a, userType: "ashaWorker" as const })),
        ...visiblePatients.map((p) => ({ ...p, userType: "patient" as const })),
      ]
      setUsers(allUsers)
      setHospitals(hs)
    } catch (error) {
      console.error("[v0] Error loading users:", error)
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    if (selectedUserType !== "all") {
      filtered = filtered.filter((user) => user.userType === selectedUserType)
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.phone.includes(searchTerm) ||
          ("email" in user && user.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          ("username" in user && user.username?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          ("patientId" in user && user.patientId?.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    setFilteredUsers(filtered)
  }

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.phone || !newUser.password || !newUser.email) {
      toast({
        title: "Missing Information",
        description: "Please provide name, phone, email, and password",
        variant: "destructive",
      })
      return
    }
    if (newUser.userType === "doctor" && !newUser.hospitalId) {
      toast({
        title: "Missing Information",
        description: "Please select a hospital for the doctor",
        variant: "destructive",
      })
      return
    }
    setIsSubmitting(true)
    try {
      let userData: any = {
        name: newUser.name,
        phone: newUser.phone,
        address: newUser.address,
      }
      switch (newUser.userType) {
        case "doctor":
          userData = {
            ...userData,
            specialization: newUser.specialization,
            experience: newUser.experience,
            hospitalId: newUser.hospitalId,
            createdBy: current?.id,
          }
          break
        case "ashaWorker":
          userData = {
            ...userData,
            experience: newUser.experience,
          }
          break
        case "patient":
          userData = {
            ...userData,
            patientId: newUser.patientId || `PAT${Date.now()}`,
            age: Number.parseInt(newUser.age) || 0,
            gender: newUser.gender,
            medicalHistory: newUser.medicalHistory,
            ashaWorkerId: newUser.ashaWorkerId || current?.id || "",
          }
          break
      }

      const result = await registerNewUser(newUser.email, newUser.password, newUser.userType, userData)
      if (!result.success) {
        throw new Error(result.error)
      }

      toast({
        title: "User Created",
        description: `${newUser.userType} ${newUser.name} has been created successfully`,
      })

      // Reset form and reload users
      setNewUser({
        userType: "patient",
        name: "",
        email: "",
        phone: "",
        address: "",
        username: "",
        password: "",
        specialization: "",
        experience: "",
        hospitalId: "",
        patientId: "",
        age: "",
        gender: "",
        medicalHistory: "",
        ashaWorkerId: "",
      })
      setShowAddForm(false)
      loadAllUsers()
    } catch (error) {
      console.error("[v0] Error creating user:", error)
      toast({
        title: "Creation Failed",
        description: error instanceof Error ? error.message : "Failed to create user",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const getUserTypeIcon = (userType: string) => {
    switch (userType) {
      case "doctor":
        return <Stethoscope className="h-4 w-4" />
      case "ashaWorker":
        return <Heart className="h-4 w-4" />
      case "patient":
        return <User className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case "doctor":
        return "bg-blue-100 text-blue-800"
      case "ashaWorker":
        return "bg-purple-100 text-purple-800"
      case "patient":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin mr-2" />
        Loading users...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage doctors, ASHA workers, and patients</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <UserPlus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedUserType} onValueChange={(value: UserType | "all") => setSelectedUserType(value)}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                <SelectItem value="doctor">Doctors</SelectItem>
                <SelectItem value="ashaWorker">ASHA Workers</SelectItem>
                <SelectItem value="patient">Patients</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Add User Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New User</CardTitle>
            <CardDescription>Create a new user account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>User Type</Label>
                <Select
                  value={newUser.userType}
                  onValueChange={(value: UserType) => setNewUser({ ...newUser, userType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient">Patient</SelectItem>
                    <SelectItem value="ashaWorker">ASHA Worker</SelectItem>
                    <SelectItem value="doctor">Doctor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Full Name *</Label>
                <Input
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>

              <div className="space-y-2">
                <Label>Phone *</Label>
                <Input
                  value={newUser.phone}
                  onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                  placeholder="+91 9876543210"
                />
              </div>

              <div className="space-y-2">
                <Label>Username</Label>
                <Input
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder="Enter username"
                />
              </div>

              <div className="space-y-2">
                <Label>Password *</Label>
                <Input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Enter password"
                />
              </div>

              <div className="space-y-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Enter email"
                />
              </div>

              {newUser.userType === "doctor" && (
                <>
                  <div className="space-y-2">
                    <Label>Specialization</Label>
                    <Input
                      value={newUser.specialization}
                      onChange={(e) => setNewUser({ ...newUser, specialization: e.target.value })}
                      placeholder="Gynecology, Oncology, etc."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Experience</Label>
                    <Input
                      value={newUser.experience}
                      onChange={(e) => setNewUser({ ...newUser, experience: e.target.value })}
                      placeholder="5+ years"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Hospital</Label>
                    <Select value={newUser.hospitalId} onValueChange={(v) => setNewUser({ ...newUser, hospitalId: v })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select hospital" />
                      </SelectTrigger>
                      <SelectContent>
                        {hospitals.map((h) => (
                          <SelectItem key={h.id} value={h.id!}>
                            {h.name} • {h.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}

              {(newUser.userType === "doctor" || newUser.userType === "ashaWorker") && (
                <div className="space-y-2">
                  <Label>Experience</Label>
                  <Input
                    value={newUser.experience}
                    onChange={(e) => setNewUser({ ...newUser, experience: e.target.value })}
                    placeholder="5+ years"
                  />
                </div>
              )}

              {newUser.userType === "patient" && (
                <>
                  <div className="space-y-2">
                    <Label>Patient ID</Label>
                    <Input
                      value={newUser.patientId}
                      onChange={(e) => setNewUser({ ...newUser, patientId: e.target.value })}
                      placeholder="Auto-generated if empty"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Age</Label>
                    <Input
                      type="number"
                      value={newUser.age}
                      onChange={(e) => setNewUser({ ...newUser, age: e.target.value })}
                      placeholder="25"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <Select value={newUser.gender} onValueChange={(value) => setNewUser({ ...newUser, gender: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label>Address</Label>
              <Textarea
                value={newUser.address}
                onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
                placeholder="Enter full address"
                rows={2}
              />
            </div>

            {newUser.userType === "patient" && (
              <div className="space-y-2">
                <Label>Medical History</Label>
                <Textarea
                  value={newUser.medicalHistory}
                  onChange={(e) => setNewUser({ ...newUser, medicalHistory: e.target.value })}
                  placeholder="Enter medical history"
                  rows={3}
                />
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleAddUser} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Create User
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No users found</p>
              <p className="text-sm">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div key={user.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{user.name}</h4>
                        <Badge className={getUserTypeColor(user.userType || "patient")}>
                          {getUserTypeIcon(user.userType || "patient")}
                          <span className="ml-1">{(user.userType || "patient").toUpperCase()}</span>
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                        <div>Phone: {user.phone}</div>
                        {"email" in user && user.email && <div>Email: {user.email}</div>}
                        {"username" in user && <div>Username: {user.username}</div>}
                        {"patientId" in user && <div>Patient ID: {user.patientId}</div>}
                        {"specialization" in user && <div>Specialization: {user.specialization}</div>}
                        {"experience" in user && <div>Experience: {user.experience}</div>}
                      </div>
                      {user.address && <div className="text-sm text-gray-600 mt-1">Address: {user.address}</div>}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
