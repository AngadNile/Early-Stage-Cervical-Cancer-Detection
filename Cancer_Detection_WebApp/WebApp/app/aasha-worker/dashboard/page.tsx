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
import AashaWorkerProfile from "@/components/aasha-worker/aasha-worker-profile"
import AddPatientForm from "@/components/aasha-worker/add-patient-form"
import ContactDoctor from "@/components/aasha-worker/contact-doctor"
import ContactPatients from "@/components/aasha-worker/contact-patients"
import AashaWorkerGuidelines from "@/components/aasha-worker/aasha-worker-guidelines"
import AssignPatient from "@/components/aasha-worker/assign-patient"
import { BrandLogo } from "@/components/brand-logo"
import { LogOut, User, UserPlus, BookOpen, MessageCircle, ClipboardList } from "lucide-react"

export default function AashaWorkerDashboard() {
  const [activeTab, setActiveTab] = useState("add-patient")
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(new Set(["add-patient"]))

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
    <AuthGuard allowedRoles={["aasha_worker"]}>
      <div className="min-h-screen bg-gradient-to-br from-[#fdfaf7] via-teal-50/60 to-teal-100/30 dark:from-slate-950 dark:via-teal-950/30 dark:to-slate-950">

        {/* ====== Header ====== */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Brand + Title */}
              <div className="flex items-center gap-4">
                <BrandLogo subtitle="ASHA Worker Portal" href="/aasha-worker/dashboard" />
                <span className="hidden md:inline-block text-xs text-gray-400 border-l border-gray-200 dark:border-slate-700 pl-3">
                  {t.common.welcome}, <span className="text-teal-600 dark:text-teal-400 font-medium">{user?.name}</span>
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
                className="flex items-center gap-1.5 rounded-lg text-xs sm:text-sm py-2.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <User className="h-4 w-4" />
                <span className="hidden lg:inline">{t.common.profile}</span>
              </TabsTrigger>
              <TabsTrigger
                value="add-patient"
                className="flex items-center gap-1.5 rounded-lg text-xs sm:text-sm py-2.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden lg:inline">Register Patient</span>
              </TabsTrigger>
              <TabsTrigger
                value="contact-doctor"
                className="flex items-center gap-1.5 rounded-lg text-xs sm:text-sm py-2.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden lg:inline">{t.ashaWorker.contactDoctor}</span>
              </TabsTrigger>
              <TabsTrigger
                value="contact-patients"
                className="flex items-center gap-1.5 rounded-lg text-xs sm:text-sm py-2.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden lg:inline">Patients Chat</span>
              </TabsTrigger>
              <TabsTrigger
                value="guidelines"
                className="flex items-center gap-1.5 rounded-lg text-xs sm:text-sm py-2.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <BookOpen className="h-4 w-4" />
                <span className="hidden lg:inline">{t.ashaWorker.guidelines}</span>
              </TabsTrigger>
              <TabsTrigger
                value="assign"
                className="flex items-center gap-1.5 rounded-lg text-xs sm:text-sm py-2.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <ClipboardList className="h-4 w-4" />
                <span className="hidden lg:inline">Patient Referrals</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              {visitedTabs.has("profile") && <AashaWorkerProfile />}
            </TabsContent>

            <TabsContent value="add-patient">
              {visitedTabs.has("add-patient") && <AddPatientForm />}
            </TabsContent>

            <TabsContent value="contact-doctor">
              {visitedTabs.has("contact-doctor") && <ContactDoctor />}
            </TabsContent>

            <TabsContent value="contact-patients">
              {visitedTabs.has("contact-patients") && <ContactPatients />}
            </TabsContent>

            <TabsContent value="guidelines">
              {visitedTabs.has("guidelines") && <AashaWorkerGuidelines />}
            </TabsContent>

            <TabsContent value="assign">
              {visitedTabs.has("assign") && <AssignPatient />}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AuthGuard>
  )
}
