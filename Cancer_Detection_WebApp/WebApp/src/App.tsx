import React from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import HomePage from "@/app/page"
import LoginPage from "@/app/login/page"
import SignupPage from "@/app/signup/page"
import ForgotPasswordPage from "@/app/forgot-password/page"
import AdminDashboard from "@/app/admin/dashboard/page"
import DoctorDashboard from "@/app/doctor/dashboard/page"
import AashaWorkerDashboard from "@/app/aasha-worker/dashboard/page"
import PatientDashboard from "@/app/patient/dashboard/page"
import ScreeningDashboardPage from "@/app/screening/dashboard/page"
import { Toaster } from "@/components/ui/toaster"

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/aasha-worker/dashboard" element={<AashaWorkerDashboard />} />
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/screening/dashboard" element={<ScreeningDashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </>
  )
}
