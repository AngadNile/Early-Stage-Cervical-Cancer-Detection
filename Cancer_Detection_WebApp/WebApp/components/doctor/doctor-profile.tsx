"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { getCurrentUser } from "@/lib/auth"
import { doctorService, cervixAnalysisService } from "@/lib/api-services"
import { User, Stethoscope, Phone, Mail, Edit, Save, Loader2 } from "lucide-react"

export default function DoctorProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState({
    name: "",
    specialization: "",
    phone: "",
    email: "",
    experience: "",
  })
  const [stats, setStats] = useState({
    totalPatients: 0,
    normalCases: 0,
    abnormalCases: 0,
  })
  const { toast } = useToast()
  const user = getCurrentUser()

  useEffect(() => {
    const loadDoctorData = async () => {
      if (!user?.id) return

      try {
        setLoading(true)
        const doctorData = await doctorService.getById(user.id)
        if (doctorData) {
          setProfileData({
            name: doctorData.name || "",
            specialization: doctorData.specialization || "",
            phone: doctorData.phone || "",
            email: doctorData.email || "",
            experience: doctorData.experience || "",
          })
        }

        const doctorAnalyses = await cervixAnalysisService.getByAshaWorker(user.id)
        const normalCases = doctorAnalyses.filter((a) => a.riskLevel === "low").length
        const abnormalCases = doctorAnalyses.filter(
          (a) => a.riskLevel === "medium" || a.riskLevel === "high",
        ).length

        setStats({
          totalPatients: doctorAnalyses.length,
          normalCases,
          abnormalCases,
        })
      } catch (error) {
        console.error("[v0] Error loading doctor data:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadDoctorData()
  }, [user?.id, toast])

  const handleSave = async () => {
    if (!user?.id) return

    try {
      await doctorService.update(user.id, {
        name: profileData.name,
        specialization: profileData.specialization,
        phone: profileData.phone,
        email: profileData.email,
        experience: profileData.experience,
      })

      setIsEditing(false)
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully.",
      })
    } catch (error) {
      console.error("[v0] Error saving profile:", error)
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading profile...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Doctor Profile
              </CardTitle>
              <CardDescription>Manage your professional information</CardDescription>
            </div>
            <Button
              onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
              variant={isEditing ? "default" : "outline"}
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              {isEditing ? (
                <Input id="name" value={profileData.name} onChange={(e) => handleInputChange("name", e.target.value)} />
              ) : (
                <p className="text-sm font-medium">{profileData.name || "Not provided"}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialization">Specialization</Label>
              {isEditing ? (
                <Input
                  id="specialization"
                  value={profileData.specialization}
                  onChange={(e) => handleInputChange("specialization", e.target.value)}
                />
              ) : (
                <p className="text-sm font-medium flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  {profileData.specialization || "Not provided"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Contact Number</Label>
              {isEditing ? (
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              ) : (
                <p className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {profileData.phone || "Not provided"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
              ) : (
                <p className="text-sm font-medium flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {profileData.email || "Not provided"}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="experience">Experience</Label>
              {isEditing ? (
                <Input
                  id="experience"
                  value={profileData.experience}
                  onChange={(e) => handleInputChange("experience", e.target.value)}
                />
              ) : (
                <p className="text-sm font-medium">{profileData.experience || "Not provided"}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Patients Reviewed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.totalPatients}</div>
            <p className="text-xs text-muted-foreground">Total cases reviewed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Normal Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.normalCases}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalPatients > 0
                ? `${Math.round((stats.normalCases / stats.totalPatients) * 100)}% of total cases`
                : "No cases yet"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Abnormal Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.abnormalCases}</div>
            <p className="text-xs text-muted-foreground">Require attention</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
