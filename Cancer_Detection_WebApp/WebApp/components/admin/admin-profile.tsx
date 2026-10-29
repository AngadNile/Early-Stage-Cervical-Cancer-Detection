"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { getCurrentUser } from "@/lib/auth"
import { User, Phone, MapPin, Edit, Save, Users, Stethoscope, Building2, Heart, Microscope } from "lucide-react"
// Stats loaded from single endpoint below

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const user = getCurrentUser()

  const [profileData, setProfileData] = useState({
    name: user?.name || "System Administrator",
    mobile: (user as any)?.phone || "+91 9876543210",
    region: (user as any)?.region || "Nagpur, Maharashtra",
    email: user?.email || "admin@cancerdetection.gov.in",
  })
  const [counts, setCounts] = useState({
    patients: 0,
    doctors: 0,
    hospitals: 0,
    ashaWorkers: 0,
    screeningUnits: 0,
  })
  const [loadingStats, setLoadingStats] = useState(true)
  const { toast } = useToast()

  // Sync profile from user object whenever component mounts
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "System Administrator",
        mobile: (user as any)?.phone || "+91 9876543210",
        region: (user as any)?.region || "Nagpur, Maharashtra",
        email: user.email || "admin@cancerdetection.gov.in",
      })
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const loadCounts = async () => {
      setLoadingStats(true)
      try {
        const res = await fetch("http://localhost:5000/api/stats")
        if (res.ok) {
          const data = await res.json()
          setCounts({
            patients: data.patients ?? 0,
            doctors: data.doctors ?? 0,
            hospitals: data.hospitals ?? 0,
            ashaWorkers: data.ashaWorkers ?? 0,
            screeningUnits: data.screeningUnits ?? 0,
          })
        }
      } catch (e) {
        toast({
          title: "Could not load stats",
          description: "We couldn't fetch live counts. They will appear once data is available.",
        })
      } finally {
        setLoadingStats(false)
      }
    }
    loadCounts()
  }, [toast])

  const handleSave = () => {
    setIsEditing(false)
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved successfully.",
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const statCards = [
    { label: "Total Patients", value: counts.patients, color: "text-blue-600", icon: Users, bg: "bg-blue-50", sub: "Patients registered" },
    { label: "Total Doctors", value: counts.doctors, color: "text-green-600", icon: Stethoscope, bg: "bg-green-50", sub: "Doctors in system" },
    { label: "Total Hospitals", value: counts.hospitals, color: "text-purple-600", icon: Building2, bg: "bg-purple-50", sub: "Hospitals available" },
    { label: "ASHA Workers", value: counts.ashaWorkers, color: "text-rose-600", icon: Heart, bg: "bg-rose-50", sub: "Community health workers" },
    { label: "Screening Units", value: counts.screeningUnits, color: "text-orange-600", icon: Microscope, bg: "bg-orange-50", sub: "Labs, vans & pathology" },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
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
                <p className="text-sm font-medium">{profileData.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              {isEditing ? (
                <Input
                  id="mobile"
                  value={profileData.mobile}
                  onChange={(e) => handleInputChange("mobile", e.target.value)}
                />
              ) : (
                <p className="text-sm font-medium flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {profileData.mobile}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="region">Region</Label>
              {isEditing ? (
                <Input
                  id="region"
                  value={profileData.region}
                  onChange={(e) => handleInputChange("region", e.target.value)}
                />
              ) : (
                <p className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {profileData.region}
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
                <p className="text-sm font-medium">{profileData.email}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4" aria-live="polite">
        {statCards.map(({ label, value, color, icon: Icon, bg, sub }) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-medium text-gray-600">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`flex items-center gap-2 mb-1`}>
                <div className={`p-1.5 rounded-md ${bg}`}>
                  <Icon className={`h-4 w-4 ${color}`} />
                </div>
                <div className={`text-2xl font-bold ${color}`}>
                  {loadingStats ? "…" : value}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
