"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { getCurrentUser } from "@/lib/auth"
import { patientService, cervixAnalysisService } from "@/lib/api-services"
import { User, Phone, MapPin, Edit, Save, Calendar, Loader2 } from "lucide-react"

export default function PatientProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
    medicalHistory: "",
  })
  const [lastScreening, setLastScreening] = useState<any>(null)
  const { toast } = useToast()
  const user = getCurrentUser()

  useEffect(() => {
    const loadPatientData = async () => {
      if (!user?.id) return

      try {
        setLoading(true)
        const patientData = await patientService.getById(user.id)
        if (patientData) {
          setProfileData({
            name: patientData.name || "",
            age: patientData.age?.toString() || "",
            gender: patientData.gender || "",
            phone: patientData.phone || "",
            address: patientData.address || "",
            medicalHistory: patientData.medicalHistory || "",
          })
        }

        // Get last screening data (service now sorts newest first)
        const analyses = await cervixAnalysisService.getByPatient(user.id)
        if (analyses.length > 0) {
          setLastScreening(analyses[0])
        }
      } catch (error: any) {
        console.error("[v0] Error loading patient data:", error)
        toast({
          title: "Couldn’t load your data",
          description:
            typeof error?.message === "string"
              ? error.message
              : "We ran into a problem loading your profile and reports. Please try again in a moment.",
        })
      } finally {
        setLoading(false)
      }
    }

    loadPatientData()
  }, [user?.id, toast])

  const handleSave = async () => {
    if (!user?.id) return

    try {
      await patientService.update(user.id, {
        name: profileData.name,
        age: Number.parseInt(profileData.age) || 0,
        gender: profileData.gender,
        phone: profileData.phone,
        address: profileData.address,
        medicalHistory: profileData.medicalHistory,
      })

      setIsEditing(false)
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully.",
      })
    } catch (error: any) {
      console.error("[v0] Error saving profile:", error)
      toast({
        title: "Couldn’t save profile",
        description: typeof error?.message === "string" ? error.message : "Please review your entries and try again.",
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
                Patient Profile
              </CardTitle>
              <CardDescription>Manage your personal information and contact details</CardDescription>
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
              <Label htmlFor="age">Age</Label>
              {isEditing ? (
                <Input
                  id="age"
                  type="number"
                  value={profileData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                />
              ) : (
                <p className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {profileData.age ? `${profileData.age} years` : "Not provided"}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              {isEditing ? (
                <Select value={profileData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-sm font-medium capitalize">{profileData.gender || "Not provided"}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Mobile Number</Label>
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

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              {isEditing ? (
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              ) : (
                <p className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {profileData.address || "Not provided"}
                </p>
              )}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="medicalHistory">Medical History</Label>
              {isEditing ? (
                <Input
                  id="medicalHistory"
                  value={profileData.medicalHistory}
                  onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                />
              ) : (
                <p className="text-sm font-medium">{profileData.medicalHistory || "No medical history recorded"}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Screening</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal-600">
              {lastScreening
                ? new Date(lastScreening.createdAt?.toDate ? lastScreening.createdAt.toDate() : lastScreening.createdAt || Date.now()).toLocaleDateString()
                : "No screening"}
            </div>
            <p className="text-xs text-muted-foreground">
              {lastScreening ? `Risk Level: ${lastScreening.riskLevel}` : "Schedule your first screening"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">Schedule</div>
            <p className="text-xs text-muted-foreground">Contact your ASHA worker</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Health Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {lastScreening?.riskLevel === "low"
                ? "Good"
                : lastScreening?.riskLevel === "medium"
                  ? "Monitor"
                  : lastScreening?.riskLevel === "high"
                    ? "Attention"
                    : "Unknown"}
            </div>
            <p className="text-xs text-muted-foreground">
              {lastScreening ? "Based on last screening" : "No screening data available"}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
