"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { getCurrentUser } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { ashaWorkerService, patientService, cervixAnalysisService } from "@/lib/api-services"
import { User, MapPin, Phone, Award, Edit, Save, X, UserPlus, Camera, BookOpen, Loader2 } from "lucide-react"

export default function AashaWorkerProfile() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    address: "",
    experience: "",
  })
  const [stats, setStats] = useState({
    patientsRegistered: 0,
    analysisCompleted: 0,
  })
  const { toast } = useToast()
  const user = getCurrentUser()

  useEffect(() => {
    const loadAshaWorkerData = async () => {
      if (!user?.id) return

      try {
        setLoading(true)
        const ashaWorkerData = await ashaWorkerService.getById(user.id)
        if (ashaWorkerData) {
          setProfileData({
            name: ashaWorkerData.name || "",
            phone: ashaWorkerData.phone || "",
            address: ashaWorkerData.address || "",
            experience: ashaWorkerData.experience || "",
          })
        }

        // Get statistics
        const patients = await patientService.getByAshaWorker(user.id)
        const analyses = await cervixAnalysisService.getByAshaWorker(user.id)

        setStats({
          patientsRegistered: patients.length,
          analysisCompleted: analyses.length,
        })
      } catch (error) {
        console.error("[v0] Error loading ASHA worker data:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadAshaWorkerData()
  }, [user?.id, toast])

  const handleSave = async () => {
    if (!user?.id) return

    try {
      await ashaWorkerService.update(user.id, {
        name: profileData.name,
        phone: profileData.phone,
        address: profileData.address,
        experience: profileData.experience,
      })

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      })
      setIsEditing(false)
    } catch (error) {
      console.error("[v0] Error saving profile:", error)
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Profile</h2>
          <p className="text-gray-600">Manage your personal information and work details</p>
        </div>
        <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "outline" : "default"} className="gap-2">
          {isEditing ? (
            <>
              <X className="h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Edit className="h-4 w-4" />
              Edit Profile
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData((prev) => ({ ...prev, name: e.target.value }))}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      className="pl-10"
                      value={profileData.phone}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, phone: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="address"
                      className="pl-10"
                      value={profileData.address}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, address: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="experience">Experience</Label>
                  <div className="relative">
                    <Award className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="experience"
                      className="pl-10"
                      value={profileData.experience}
                      onChange={(e) => setProfileData((prev) => ({ ...prev, experience: e.target.value }))}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-2 pt-4">
                  <Button onClick={handleCancel} variant="outline">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Work Statistics</CardTitle>
              <CardDescription>Your performance overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Patients Registered</span>
                <Badge variant="default" className="bg-blue-500">
                  {stats.patientsRegistered}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Screenings Referred</span>
                <Badge variant="default" className="bg-green-500">
                  {stats.patientsRegistered}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Screening Referral Rate</span>
                <Badge variant="default" className="bg-purple-500">
                  100%
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                <UserPlus className="h-4 w-4" />
                Register New Patient
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                <MapPin className="h-4 w-4" />
                Track Screening Referrals
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 bg-transparent">
                <BookOpen className="h-4 w-4" />
                View Outreach Guidelines
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
