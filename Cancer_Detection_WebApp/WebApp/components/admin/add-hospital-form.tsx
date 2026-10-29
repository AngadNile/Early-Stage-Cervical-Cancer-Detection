"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Building2 } from "lucide-react"
import { hospitalService } from "@/lib/api-services"
import { getCurrentUser } from "@/lib/auth" // include getCurrentUser to tag createdBy on hospital creation

export default function AddHospitalForm() {
  const [hospitalData, setHospitalData] = useState({
    name: "",
    type: "",
    city: "",
    village: "",
    state: "",
    contact: "",
    email: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const current = getCurrentUser() // current admin/ASHA id for createdBy

  const handleInputChange = (field: string, value: string) => {
    setHospitalData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const normalizedType = hospitalData.type.toLowerCase() === "government" ? "Government" : "Private"
      const address = [hospitalData.village, hospitalData.city, hospitalData.state].filter(Boolean).join(", ")

      await hospitalService.create({
        name: hospitalData.name,
        type: normalizedType as "Government" | "Private",
        city: hospitalData.city,
        address,
        phone: hospitalData.contact,
        doctorIds: [],
        createdBy: current?.id, // scope hospital to creator
      })

      toast({
        title: "Hospital added successfully",
        description: `${hospitalData.name} has been added to the network.`,
      })

      setHospitalData({
        name: "",
        type: "",
        city: "",
        village: "",
        state: "",
        contact: "",
        email: "",
      })
    } catch (err: any) {
      console.error("[v0] Add hospital error:", err)
      toast({
        title: "Error adding hospital",
        description: err?.message || "Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Add New Hospital
        </CardTitle>
        <CardDescription>Register a new hospital in your region</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="hospital-name">Hospital Name</Label>
              <Input
                id="hospital-name"
                value={hospitalData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="City General Hospital"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Hospital Type</Label>
              <Select value={hospitalData.type} onValueChange={(value) => handleInputChange("type", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="government">Government</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="trust">Trust</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={hospitalData.city}
                onChange={(e) => handleInputChange("city", e.target.value)}
                placeholder="Nagpur"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="village">Village (if applicable)</Label>
              <Input
                id="village"
                value={hospitalData.village}
                onChange={(e) => handleInputChange("village", e.target.value)}
                placeholder="Village name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={hospitalData.state}
                onChange={(e) => handleInputChange("state", e.target.value)}
                placeholder="Maharashtra"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="hospital-contact">Contact Number</Label>
              <Input
                id="hospital-contact"
                value={hospitalData.contact}
                onChange={(e) => handleInputChange("contact", e.target.value)}
                placeholder="+91 712-1234567"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="hospital-email">Email</Label>
              <Input
                id="hospital-email"
                type="email"
                value={hospitalData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="info@hospital.com"
                required
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Hospital Network Benefits</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Patients can book appointments directly</li>
              <li>• Access to cancer screening reports</li>
              <li>• Direct communication with Aasha Workers</li>
              <li>• Streamlined referral system</li>
            </ul>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Adding Hospital..." : "Add Hospital"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
