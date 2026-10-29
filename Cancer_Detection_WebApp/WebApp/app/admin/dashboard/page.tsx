"use client"

import { useState } from "react"
import AuthGuard from "@/components/auth-guard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { logout, getCurrentUser } from "@/lib/auth"
import { useNavigate } from "react-router-dom"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/lib/i18n-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import AdminProfile from "@/components/admin/admin-profile"
import AddDoctorForm from "@/components/admin/add-doctor-form"
import AddHospitalForm from "@/components/admin/add-hospital-form"
import AddAashaWorkerForm from "@/components/admin/add-aasha-worker-form"
import AddScreeningUnitForm from "@/components/admin/add-screening-unit-form"
import ManageConnections from "@/components/admin/manage-connections"
import AdminGuidelines from "@/components/admin/admin-guidelines"
import { BrandLogo } from "@/components/brand-logo"
import { LogOut, Users, Building2, Stethoscope, Settings, UserPlus, Microscope } from "lucide-react"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("profile")
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(new Set(["profile"]))

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setVisitedTabs((prev) => new Set([...prev, value]))
  }
  const navigate = useNavigate()
  const router = { push: (path: string) => navigate(path) }
  const { toast } = useToast()
  const { t } = useI18n()
  const user = getCurrentUser()

  const handleLogout = () => {
    logout()
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of the system.",
    })
    router.push("/login")
  }

  return (
    <AuthGuard allowedRoles={["admin"]}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/50 to-purple-50/30 dark:from-slate-950 dark:via-indigo-950/30 dark:to-purple-950/20">

        {/* ====== Header ====== */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Brand + Title */}
              <div className="flex items-center gap-4">
                <BrandLogo subtitle="System Administration" href="/admin/dashboard" />
                <span className="hidden md:inline-block text-xs text-gray-400 border-l border-gray-200 dark:border-slate-700 pl-3">
                  {t.common.welcome}, <span className="text-indigo-600 dark:text-indigo-400 font-medium">{user?.name}</span>
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 sm:gap-3">
                <LanguageSwitcher />
                <ThemeToggle />
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="gap-2 border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-800 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">{t.common.logout}</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* ====== Main Content ====== */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList className="grid w-full grid-cols-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-1 shadow-sm h-auto">
              <TabsTrigger
                value="profile"
                className="flex items-center gap-1.5 rounded-lg text-xs sm:text-sm py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">{t.common.profile}</span>
              </TabsTrigger>
              <TabsTrigger
                value="add-hospital"
                className="flex items-center gap-1.5 rounded-lg text-xs sm:text-sm py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <Building2 className="h-4 w-4" />
                <span className="hidden sm:inline">Add Hospitals</span>
              </TabsTrigger>

              <TabsTrigger
                value="add-doctor"
                className="flex items-center gap-1.5 rounded-lg text-xs sm:text-sm py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <Stethoscope className="h-4 w-4" />
                <span className="hidden sm:inline">Add Doctors</span>
              </TabsTrigger>

              <TabsTrigger
                value="add-asha-worker"
                className="flex items-center gap-1.5 rounded-lg text-xs sm:text-sm py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">{t.admin.addAshaWorker || "Add ASHA Workers"}</span>
              </TabsTrigger>
              <TabsTrigger
                value="add-screening-unit"
                className="flex items-center gap-1.5 rounded-lg text-xs sm:text-sm py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <Microscope className="h-4 w-4" />
                <span className="hidden sm:inline">Add Screening Units</span>
              </TabsTrigger>
              <TabsTrigger
                value="manage"
                className="flex items-center gap-1.5 rounded-lg text-xs sm:text-sm py-2.5 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">System</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              {visitedTabs.has("profile") && <AdminProfile />}
            </TabsContent>

            <TabsContent value="add-doctor">
              {visitedTabs.has("add-doctor") && (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100 dark:border-slate-800">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Stethoscope className="h-4 w-4 text-white" />
                    </div>
                    <h2 className="font-bold text-gray-900 dark:text-white text-lg">Add Doctor</h2>
                  </div>
                  <AddDoctorForm />
                </div>
              )}
              {visitedTabs.has("add-doctor") && (
                <div className="mt-6">
                  <ManageConnections />
                </div>
              )}
            </TabsContent>

            <TabsContent value="add-hospital">
              {visitedTabs.has("add-hospital") && (
                <div className="bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 p-6 shadow-sm">
                  <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100 dark:border-slate-800">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <Building2 className="h-4 w-4 text-white" />
                    </div>
                    <h2 className="font-bold text-gray-900 dark:text-white text-lg">Add Hospital</h2>
                  </div>
                  <AddHospitalForm />
                </div>
              )}
              {visitedTabs.has("add-hospital") && (
                <div className="mt-6">
                  <ManageConnections />
                </div>
              )}
            </TabsContent>

            <TabsContent value="add-asha-worker">
              {visitedTabs.has("add-asha-worker") && <AddAashaWorkerForm />}
            </TabsContent>

            <TabsContent value="add-screening-unit">
              {visitedTabs.has("add-screening-unit") && <AddScreeningUnitForm />}
            </TabsContent>

            <TabsContent value="manage">
              {visitedTabs.has("manage") && <ManageConnections />}
            </TabsContent>

            <TabsContent value="guidelines">
              {visitedTabs.has("guidelines") && <AdminGuidelines />}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AuthGuard>
  )
}
