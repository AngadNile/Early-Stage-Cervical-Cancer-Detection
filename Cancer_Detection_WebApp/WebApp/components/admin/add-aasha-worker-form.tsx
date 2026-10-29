"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/lib/i18n-context"
import { UserPlus, MapPin, Phone, Mail, Calendar, Lock } from "lucide-react"
import { registerNewUser } from "@/lib/auth"

export default function AddAashaWorkerForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    district: "",
    block: "",
    village: "",
    experience: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const { t } = useI18n()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.email || !formData.password) {
        throw new Error("Email and password are required")
      }

      const userData = {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        dateOfBirth: formData.dateOfBirth,
        district: formData.district,
        block: formData.block,
        village: formData.village,
        experience: formData.experience,
      }

      const result = await registerNewUser(formData.email, formData.password, "ashaWorker", userData)
      if (!result.success) {
        throw new Error(result.error || "Failed to add ASHA worker")
      }

      toast({
        title: t.admin.ashaWorkerAdded || "ASHA Worker Added Successfully",
        description: t.admin.credentialsGenerated || "User account has been created.",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        district: "",
        block: "",
        village: "",
        experience: "",
      })
    } catch (error) {
      toast({
        title: t.common.error,
        description: error instanceof Error ? error.message : t.admin.ashaWorkerAddError || "Failed to add ASHA worker",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            {t.admin.addAshaWorker || "Add New ASHA Worker"}
          </CardTitle>
          <CardDescription>
            {t.admin.addAshaWorkerDesc || "Register a new ASHA worker in the system with email/password"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t.admin.personalInfo || "Personal Information"}</h3>

                <div className="space-y-2">
                  <Label htmlFor="name">{t.common.name} *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t.common.email} *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      className="pl-10"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      className="pl-10"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t.common.phone} *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      className="pl-10"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">{t.admin.dateOfBirth || "Date of Birth"}</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="dateOfBirth"
                      type="date"
                      className="pl-10"
                      value={formData.dateOfBirth}
                      onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t.admin.workInfo || "Work Information"}</h3>

                <div className="space-y-2">
                  <Label htmlFor="district">{t.admin.district || "District"} *</Label>
                  <Select value={formData.district} onValueChange={(value) => handleInputChange("district", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder={t.admin.selectDistrict || "Select district"} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mumbai">Mumbai</SelectItem>
                      <SelectItem value="pune">Pune</SelectItem>
                      <SelectItem value="nagpur">Nagpur</SelectItem>
                      <SelectItem value="nashik">Nashik</SelectItem>
                      <SelectItem value="aurangabad">Aurangabad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="block">{t.admin.blockTehsil || "Block/Tehsil"} *</Label>
                  <Input
                    id="block"
                    value={formData.block}
                    onChange={(e) => handleInputChange("block", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="village">{t.admin.villageArea || "Village/Area"} *</Label>
                  <Input
                    id="village"
                    value={formData.village}
                    onChange={(e) => handleInputChange("village", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">{t.common.address}</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      className="pl-10"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting} className="min-w-32">
                {isSubmitting ? t.admin.adding || "Adding..." : t.admin.addAshaWorker || "Add ASHA Worker"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
