"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Microscope, FlaskConical, TestTube, Truck } from "lucide-react"
import { registerNewUser, getCurrentUser } from "@/lib/auth"

export default function AddScreeningUnitForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    region: "",
    unitType: "lab" as "lab" | "pathology" | "screening_van",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const current = getCurrentUser()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.name || !formData.email || !formData.password) {
        throw new Error("Name, email, and password are required")
      }

      const userData = {
        name: formData.name,
        phone: formData.phone,
        region: formData.region,
        createdBy: current?.id,
      }

      const result = await registerNewUser(
        formData.email,
        formData.password,
        formData.unitType,
        userData
      )

      if (!result.success) {
        throw new Error(result.error || "Failed to create screening unit")
      }

      const unitLabels = {
        lab: "Laboratory",
        pathology: "Pathology Unit",
        screening_van: "Remote Screening Van",
      }

      toast({
        title: `${unitLabels[formData.unitType]} Created Successfully`,
        description: `Account for "${formData.name}" has been created with role ${formData.unitType}.`,
      })

      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        region: "",
        unitType: "lab",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add screening unit",
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
          <Microscope className="h-5 w-5 text-purple-600" />
          Add Screening Unit / Specialist
        </CardTitle>
        <CardDescription>
          Register a Laboratory, Pathology Unit, or Remote Screening Van to access the AI Screening Dashboard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unitType">Unit Type / Category</Label>
              <Select
                value={formData.unitType}
                onValueChange={(val) => handleInputChange("unitType", val)}
              >
                <SelectTrigger id="unitType">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lab">
                    <div className="flex items-center gap-2">
                      <FlaskConical className="h-4 w-4 text-blue-500" />
                      <span>Laboratory</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="pathology">
                    <div className="flex items-center gap-2">
                      <TestTube className="h-4 w-4 text-purple-500" />
                      <span>Pathology Unit</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="screening_van">
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-emerald-500" />
                      <span>Remote Screening Van</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Unit / Center Name</Label>
              <Input
                id="name"
                placeholder="e.g. City Lab / Mobile Van #3"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Login Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="e.g. lab@cervicare.org"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Login Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Contact Number</Label>
              <Input
                id="phone"
                placeholder="e.g. +91 9876543210"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Operating Region / Zone</Label>
              <Input
                id="region"
                placeholder="e.g. Sector 4 / North Zone"
                value={formData.region}
                onChange={(e) => handleInputChange("region", e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white">
            {isSubmitting ? "Creating Unit…" : "Create Screening Unit Account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
