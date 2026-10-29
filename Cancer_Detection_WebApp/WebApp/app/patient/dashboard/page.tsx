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
import PatientProfile from "@/components/patient/patient-profile"
import ViewReports from "@/components/patient/view-reports"
import VoiceSymptoms from "@/components/patient/voice-symptoms"
import ContactAashaPatient from "@/components/patient/contact-aasha-patient"
import PatientGuidelines from "@/components/patient/patient-guidelines"
import BookAppointment from "@/components/patient/book-appointment"
import { BrandLogo } from "@/components/brand-logo"
import { LogOut, User, FileText, Mic, MessageCircle, BookOpen, Calendar, Heart } from "lucide-react"

export default function PatientDashboard() {
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
    <AuthGuard allowedRoles={["patient"]}>
      <div className="min-h-screen bg-gradient-to-br from-[#fdfaf7] via-teal-50/60 to-teal-100/30 dark:from-slate-950 dark:via-teal-950/30 dark:to-slate-950">

        {/* ====== Header ====== */}
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-slate-800 shadow-sm" role="banner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Brand + Title */}
              <div className="flex items-center gap-4">
                <BrandLogo subtitle="Patient Portal" href="/patient/dashboard" />
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
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" role="main">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
            <TabsList
              className="grid w-full grid-cols-6 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-xl p-1 shadow-sm h-auto"
              aria-label="Patient dashboard sections"
            >
              <TabsTrigger
                value="profile"
                className="flex items-center gap-1.5 rounded-lg text-xs sm:text-sm py-2.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <User className="h-4 w-4" />
                <span className="hidden lg:inline">{t.common.profile}</span>
              </TabsTrigger>
              <TabsTrigger
                value="reports"
                className="flex items-center gap-1.5 rounded-lg text-xs sm:text-sm py-2.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden lg:inline">{t.patient.viewReports}</span>
              </TabsTrigger>
              <TabsTrigger
                value="guidelines"
                className="flex items-center gap-1.5 rounded-lg text-xs sm:text-sm py-2.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <BookOpen className="h-4 w-4" />
                <span className="hidden lg:inline">{t.patient.guidelines}</span>
              </TabsTrigger>
              <TabsTrigger
                value="voice"
                className="flex items-center gap-1.5 rounded-lg text-xs sm:text-sm py-2.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <Mic className="h-4 w-4" />
                <span className="hidden lg:inline">{t.patient.voiceSymptoms}</span>
              </TabsTrigger>
              <TabsTrigger
                value="contact"
                className="flex items-center gap-1.5 rounded-lg text-xs sm:text-sm py-2.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <MessageCircle className="h-4 w-4" />
                <span className="hidden lg:inline">{t.patient.contactAasha}</span>
              </TabsTrigger>
              <TabsTrigger
                value="appointments"
                className="flex items-center gap-1.5 rounded-lg text-xs sm:text-sm py-2.5 data-[state=active]:bg-teal-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <Calendar className="h-4 w-4" />
                <span className="hidden lg:inline">Appointments</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              {visitedTabs.has("profile") && <PatientProfile />}
            </TabsContent>

            <TabsContent value="reports">
              {visitedTabs.has("reports") && <ViewReports />}
            </TabsContent>

            <TabsContent value="guidelines">
              {visitedTabs.has("guidelines") && <PatientGuidelines />}
            </TabsContent>

            <TabsContent value="voice">
              {visitedTabs.has("voice") && <VoiceSymptoms />}
            </TabsContent>

            <TabsContent value="contact">
              {visitedTabs.has("contact") && <ContactAashaPatient />}
            </TabsContent>

            <TabsContent value="appointments">
              {visitedTabs.has("appointments") && <BookAppointment />}
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </AuthGuard>
  )
}
