"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Stethoscope } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { hospitalService, type Hospital } from "@/lib/api-services"
import { registerNewUser, getCurrentUser } from "@/lib/auth"

export default function AddDoctorForm() {
  const [doctorData, setDoctorData] = useState({
    name: "",
    specialization: "",
    hospitalId: "",
    contact: "",
    email: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const [hospitals, setHospitals] = useState<Hospital[]>([])
  const current = getCurrentUser() 

  useEffect(() => {
    const load = async () => {
      try {
        const hs = await hospitalService.getAll()
        setHospitals(hs)
      } catch (e) {
        console.error("[v0] Failed to load hospitals:", e)
      }
    }
    load()
  }, [])

  const handleInputChange = (field: string, value: string) => {
    setDoctorData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!doctorData.email || !doctorData.password) {
        throw new Error("Email and password are required")
      }
      if (!doctorData.hospitalId) {
        throw new Error("Please select a hospital")
      }

      const userData = {
        name: doctorData.name,
        specialization: doctorData.specialization,
        hospitalId: doctorData.hospitalId,
        phone: doctorData.contact,
        address: "",
        createdBy: current?.id, // scope doctor to creator
      }

      const result = await registerNewUser(doctorData.email, doctorData.password, "doctor", userData)
      if (!result.success) {
        throw new Error(result.error || "Failed to create doctor")
      }

      toast({
        title: "Doctor added successfully",
        description: `Dr. ${doctorData.name} has been added to the system.`,
      })

      setDoctorData({
        name: "",
        specialization: "",
        hospitalId: "",
        contact: "",
        email: "",
        password: "",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add doctor",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Stethoscope className="h-5 w-5" />
            Add New Doctor
          </CardTitle>
          <CardDescription>Register a new doctor with email/password authentication</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="doctor-name">Doctor Name</Label>
                <Input
                  id="doctor-name"
                  value={doctorData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Dr. John Smith"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={doctorData.specialization}
                  onChange={(e) => handleInputChange("specialization", e.target.value)}
                  placeholder="Oncology, Gynecology, etc."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hospital">Hospital</Label>
                <Select value={doctorData.hospitalId} onValueChange={(v) => handleInputChange("hospitalId", v)}>
                  <SelectTrigger id="hospital">
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

              <div className="space-y-2">
                <Label htmlFor="contact">Contact Number</Label>
                <Input
                  id="contact"
                  value={doctorData.contact}
                  onChange={(e) => handleInputChange("contact", e.target.value)}
                  placeholder="+91 9876543210"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={doctorData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="doctor@hospital.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={doctorData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  placeholder="Set a secure password"
                  required
                />
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Adding Doctor..." : "Add Doctor"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
