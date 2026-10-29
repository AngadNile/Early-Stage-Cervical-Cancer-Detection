"use client"

import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { useI18n } from "@/lib/i18n-context"
import {
  Heart, Shield, Clock, ArrowRight, CheckCircle2,
  Microscope, Users, Stethoscope, Phone, MapPin,
  Activity, Star
} from "lucide-react"

import { BrandLogo } from "@/components/brand-logo"

export default function HomePage() {
  const { t } = useI18n()
  const navigate = useNavigate()

  const stats = [
    { value: "< 60s", label: "AI Screening Time", icon: Clock, color: "text-teal-600", bg: "bg-teal-50 dark:bg-teal-900/30" },
    { value: "95%+", label: "Early Detection Accuracy", icon: Shield, color: "text-teal-700", bg: "bg-teal-50 dark:bg-teal-900/30" },
    { value: "₹0", label: "Cost to Patient", icon: Heart, color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-900/30" },
  ]

  const steps = [
    {
      num: "01",
      icon: Users,
      title: "ASHA Worker Connects",
      desc: "ASHA workers identify and educate women in rural communities, then connect them to a nearby screening point or mobile clinic.",
      color: "bg-teal-600",
    },
    {
      num: "02",
      icon: Microscope,
      title: "Trained Provider Screens",
      desc: "A trained healthcare provider performs the examination and captures a standardized cervical image using a portable imaging device.",
      color: "bg-teal-700",
    },
    {
      num: "03",
      icon: Stethoscope,
      title: "AI + Doctor Recommends Care",
      desc: "AI analyzes the image for risk, while a qualified clinician reviews the result and recommends follow-up or referral.",
      color: "bg-plum-700 dark:bg-purple-700",
    },
  ]

  const roles = [
    {
      icon: Users,
      title: "ASHA Worker",
      desc: "Identify, educate, and connect women in rural communities to nearby screening points and mobile clinics.",
      cta: "Worker Login",
      path: "/login",
      gradient: "from-teal-500 to-teal-700",
      border: "border-teal-200 dark:border-teal-800",
      bg: "bg-teal-50/60 dark:bg-teal-900/20",
    },
    {
      icon: Stethoscope,
      title: "Doctor",
      desc: "Review referred cases, examine AI-flagged images, and send treatment recommendations directly to patients.",
      cta: "Doctor Login",
      path: "/login",
      gradient: "from-purple-500 to-purple-700",
      border: "border-purple-200 dark:border-purple-800",
      bg: "bg-purple-50/60 dark:bg-purple-900/20",
    },
    {
      icon: Heart,
      title: "Patient",
      desc: "Check your screening result in simple language. Understand what to do next. Your health journey, clearly explained.",
      cta: "Patient Portal",
      path: "/login",
      gradient: "from-rose-400 to-rose-600",
      border: "border-rose-200 dark:border-rose-800",
      bg: "bg-rose-50/60 dark:bg-rose-900/20",
    },
  ]

  const facts = [
    "Cervical cancer is the 2nd most common cancer in Indian women",
    "Early detection makes it 90%+ curable",
    "Most women in rural India have never had a screening",
    "VIA screening takes under 5 minutes and requires no lab",
  ]

  return (
    <div className="min-h-screen bg-[#fdfaf7] dark:bg-slate-950 text-gray-900 dark:text-gray-100 overflow-x-hidden">

      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-teal-100 dark:border-slate-800">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <BrandLogo href="/" />
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={() => navigate("/login")}
              className="hidden sm:flex border-teal-300 text-teal-700 hover:bg-teal-50 dark:border-teal-700 dark:text-teal-300">
              Login
            </Button>
            <Button size="sm" onClick={() => navigate("/signup")}
              className="bg-teal-600 hover:bg-teal-700 text-white border-0 shadow-md shadow-teal-500/25">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="relative container mx-auto px-4 pt-20 pb-16 text-center overflow-hidden">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="animate-blob absolute -top-32 -left-32 w-96 h-96 rounded-full bg-teal-200/40 dark:bg-teal-900/20 blur-3xl" />
          <div className="animate-blob2 animation-delay-2000 absolute -top-16 -right-32 w-80 h-80 rounded-full bg-teal-300/30 dark:bg-teal-800/20 blur-3xl" />
          <div className="animate-blob animation-delay-4000 absolute bottom-0 left-1/3 w-72 h-72 rounded-full bg-rose-200/20 dark:bg-rose-900/10 blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto animate-fade-in-up">
          {/* Mission badge */}
          <div className="inline-flex items-center gap-2 bg-teal-50 dark:bg-teal-900/40 border border-teal-200 dark:border-teal-700 text-teal-700 dark:text-teal-300 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
            Supported under National Health Mission · Maharashtra
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold mb-5 leading-tight tracking-tight">
            <span className="gradient-text-mission">Detect Cervical Cancer</span>
            <br />
            <span className="text-gray-800 dark:text-white">Early. Protect Mothers.</span>
            <br />
            <span className="text-gray-800 dark:text-white">Save Lives.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-3 max-w-2xl mx-auto leading-relaxed">
            A simple AI screening system connecting <strong className="text-teal-700 dark:text-teal-400">ASHA workers</strong>, 
            &nbsp;<strong className="text-purple-700 dark:text-purple-400">specialist doctors</strong>, and 
            &nbsp;<strong className="text-rose-600 dark:text-rose-400">patients</strong> in rural communities.
          </p>
          <p className="text-base text-teal-700 dark:text-teal-300 font-semibold mb-10">
            हर गाँव में, हर माँ के लिए — For every village, for every mother.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" onClick={() => navigate("/login")}
              className="bg-teal-600 hover:bg-teal-700 text-white border-0 px-8 py-3 text-base font-semibold shadow-xl shadow-teal-500/30 hover:scale-105 transition-all">
              Begin Screening <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/signup")}
              className="px-8 py-3 text-base border-2 border-teal-300 text-teal-700 hover:bg-teal-50 dark:border-teal-700 dark:text-teal-300 hover:scale-105 transition-all">
              Create Account
            </Button>
          </div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-3xl mx-auto">
          {stats.map((s, i) => (
            <div key={i} className={`card-hover rounded-2xl border border-teal-100 dark:border-slate-800 ${s.bg} p-6 text-center`}>
              <div className={`w-12 h-12 rounded-xl ${s.bg} flex items-center justify-center mx-auto mb-3`}>
                <s.icon className={`w-6 h-6 ${s.color}`} />
              </div>
              <div className={`text-3xl font-extrabold ${s.color} mb-1`}>{s.value}</div>
              <div className="text-sm font-medium text-gray-600 dark:text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── AWARENESS FACTS ─── */}
      <section className="bg-teal-600 dark:bg-teal-800 py-10">
        <div className="container mx-auto px-4">
          <p className="text-center text-teal-100 text-xs font-semibold uppercase tracking-widest mb-5">Why This Matters</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {facts.map((f, i) => (
              <div key={i} className="flex items-start gap-3 bg-white/10 rounded-xl p-4">
                <CheckCircle2 className="w-5 h-5 text-teal-200 shrink-0 mt-0.5" />
                <p className="text-white text-sm font-medium leading-snug">{f}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <span className="inline-block bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">How It Works</span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
            From Village to Diagnosis in <span className="gradient-text-teal">3 Simple Steps</span>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-0.5 bg-teal-200 dark:bg-teal-800 z-0" />
          {steps.map((s, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
              <div className={`w-20 h-20 ${s.color} rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-teal-500/20`}>
                <s.icon className="w-10 h-10 text-white" />
              </div>
              <span className="text-xs font-black text-teal-400 dark:text-teal-500 tracking-widest mb-2">STEP {s.num}</span>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{s.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── ROLES ─── */}
      <section className="bg-gray-50 dark:bg-slate-900 py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-block bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">Who Uses CerviCare</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">
              Built for Every Role in the <span className="gradient-text-teal">Care Chain</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {roles.map((r, i) => (
              <div key={i} className={`card-hover rounded-2xl border ${r.border} ${r.bg} p-7 flex flex-col`}>
                <div className={`w-14 h-14 bg-gradient-to-br ${r.gradient} rounded-2xl flex items-center justify-center mb-5 shadow-lg`}>
                  <r.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{r.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed flex-1 mb-5">{r.desc}</p>
                <Button variant="outline" size="sm" onClick={() => navigate(r.path)}
                  className={`self-start border-2 font-semibold`}>
                  {r.cta} <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST STRIP ─── */}
      <section className="border-y border-teal-100 dark:border-slate-800 bg-white dark:bg-slate-950 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-4 font-semibold">Trusted & Aligned With</p>
          <div className="flex flex-wrap justify-center gap-6 items-center">
            {["National Health Mission (NHM)", "Maharashtra Government", "WHO Screening Guidelines", "ASHA Program"].map(org => (
              <span key={org} className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 dark:text-gray-400">
                <Star className="w-3.5 h-3.5 text-teal-500" fill="currentColor" /> {org}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="container mx-auto px-4 py-20">
        <div className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-teal-700 to-purple-800" />
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white,transparent_60%)]" />
          <div className="relative py-16 px-8">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
              Every Screening Can Save a Life.
            </h2>
            <p className="text-teal-100 text-lg mb-8 max-w-xl mx-auto">
              Join ASHA workers and doctors already protecting women across rural Maharashtra.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => navigate("/login")}
                className="bg-white text-teal-700 hover:bg-teal-50 font-bold px-8 border-0 shadow-2xl hover:scale-105 transition-all">
                Begin Screening <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/signup")}
                className="border-2 border-white/50 text-white hover:bg-white/10 px-8 font-semibold hover:scale-105 transition-all">
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-teal-100 dark:border-slate-800 bg-teal-900 dark:bg-slate-900">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-bold text-white block">CerviCare</span>
                <span className="text-xs text-teal-300">Detect Early · Protect Lives</span>
              </div>
            </div>
            <p className="text-sm text-teal-300 text-center max-w-sm">
              Built to detect cervical cancer early and save lives in underserved communities of India.
            </p>
            <div className="flex items-center gap-2 text-teal-300 text-sm">
              <Phone className="w-4 h-4" />
              <span>Helpline: 1800-XXX-XXXX</span>
              <MapPin className="w-4 h-4 ml-3" />
              <span>Maharashtra, India</span>
            </div>
          </div>
          <div className="border-t border-teal-800 mt-8 pt-6 text-center text-xs text-teal-500">
            © 2024 CerviCare · National Health Mission Initiative · All data is private and secure.
          </div>
        </div>
      </footer>
    </div>
  )
}
