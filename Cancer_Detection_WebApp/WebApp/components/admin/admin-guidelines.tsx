"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useI18n } from "@/lib/i18n-context"
import {
  AlertTriangle,
  CheckCircle,
  Users,
  Stethoscope,
  FileText,
  Shield,
  Clock,
  Phone,
  Download,
  UserCheck,
} from "lucide-react"

export default function AdminGuidelines() {
  const { t } = useI18n()

  const aashaWorkerGuidelines = [
    {
      title: "Aasha Worker Registration Process",
      description: "Step-by-step guide for registering new Aasha workers",
      priority: "high",
      steps: [
        "Verify Aasha worker credentials and government ID",
        "Collect complete personal and work area information",
        "Generate secure login credentials (username/password)",
        "Assign to appropriate district, block, and village area",
        "Provide system training and access to guidelines",
        "Set up patient registration permissions",
      ],
    },
    {
      title: "Aasha Worker Monitoring",
      description: "Guidelines for monitoring Aasha worker activities",
      priority: "medium",
      steps: [
        "Track patient registration activities",
        "Monitor AI model usage and accuracy",
        "Review cervix photo analysis submissions",
        "Ensure compliance with data security protocols",
        "Provide ongoing training and support",
        "Document performance and feedback",
      ],
    },
  ]

  const patientDataGuidelines = [
    {
      title: "Patient Data Access Rules",
      description: "Admin permissions for viewing patient information",
      priority: "critical",
      steps: [
        "Admin can VIEW patient data for monitoring purposes only",
        "Admin CANNOT add new patients - this is Aasha worker responsibility",
        "Admin can generate reports and analytics on patient data",
        "Admin must maintain patient confidentiality at all times",
        "Admin can assign patients to doctors when needed",
        "All patient data access must be logged and auditable",
      ],
    },
    {
      title: "Data Security and Privacy",
      description: "Protecting patient information and system integrity",
      priority: "critical",
      steps: [
        "Ensure all patient data is encrypted and secure",
        "Monitor system access logs regularly",
        "Implement role-based access controls strictly",
        "Report any data breaches immediately",
        "Conduct regular security audits",
        "Train all users on privacy protocols",
      ],
    },
  ]

  const doctorGuidelines = [
    {
      title: "Doctor Onboarding",
      description: "Process for adding new doctors to the system",
      priority: "high",
      steps: [
        "Verify medical credentials and licenses",
        "Set up doctor profile with specialization",
        "Generate secure login credentials",
        "Assign to appropriate hospital/clinic",
        "Provide system training and documentation",
        "Set up patient assignment protocols",
      ],
    },
    {
      title: "Doctor-Patient Assignment",
      description: "Guidelines for assigning patients to doctors",
      priority: "medium",
      steps: [
        "Match patient condition with doctor specialization",
        "Consider doctor availability and workload",
        "Prioritize urgent cases and abnormal results",
        "Maintain doctor-patient ratio balance",
        "Document assignment reasoning",
      ],
    },
  ]

  const emergencyProtocols = [
    {
      title: "Critical Result Handling",
      description: "Immediate actions for abnormal AI analysis",
      priority: "critical",
      actions: [
        "Immediately notify assigned doctor",
        "Flag patient record as urgent",
        "Schedule emergency consultation",
        "Contact patient within 2 hours",
        "Document all communications",
        "Follow up within 24 hours",
      ],
    },
    {
      title: "System Emergency Procedures",
      description: "Actions during system failures or emergencies",
      priority: "critical",
      actions: [
        "Switch to manual backup procedures",
        "Notify all active users of system status",
        "Maintain paper records as backup",
        "Contact technical support immediately",
        "Ensure patient data security",
        "Resume normal operations safely",
      ],
    },
  ]

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "critical":
        return "destructive"
      case "high":
        return "default"
      case "medium":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{t.admin.guidelines}</h2>
          <p className="text-gray-600">Comprehensive guidelines for 4-role system management</p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <Tabs defaultValue="aasha" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="aasha" className="gap-2">
            <UserCheck className="h-4 w-4" />
            Aasha Workers
          </TabsTrigger>
          <TabsTrigger value="patient" className="gap-2">
            <Users className="h-4 w-4" />
            Patient Data
          </TabsTrigger>
          <TabsTrigger value="doctor" className="gap-2">
            <Stethoscope className="h-4 w-4" />
            Doctor Management
          </TabsTrigger>
          <TabsTrigger value="emergency" className="gap-2">
            <AlertTriangle className="h-4 w-4" />
            Emergency Protocols
          </TabsTrigger>
          <TabsTrigger value="resources" className="gap-2">
            <FileText className="h-4 w-4" />
            Resources
          </TabsTrigger>
        </TabsList>

        <TabsContent value="aasha" className="space-y-4">
          {aashaWorkerGuidelines.map((guideline, index) => (
            <Card key={index} className="border-l-4 border-l-purple-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="h-5 w-5" />
                    {guideline.title}
                  </CardTitle>
                  <Badge variant={getPriorityVariant(guideline.priority)}>{guideline.priority.toUpperCase()}</Badge>
                </div>
                <CardDescription>{guideline.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {guideline.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-purple-600">{stepIndex + 1}</span>
                      </div>
                      <p className="text-sm text-gray-700">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="patient" className="space-y-4">
          {patientDataGuidelines.map((guideline, index) => (
            <Card key={index} className="border-l-4 border-l-blue-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    {guideline.title}
                  </CardTitle>
                  <Badge variant={getPriorityVariant(guideline.priority)}>{guideline.priority.toUpperCase()}</Badge>
                </div>
                <CardDescription>{guideline.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {guideline.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-blue-600">{stepIndex + 1}</span>
                      </div>
                      <p className="text-sm text-gray-700">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="doctor" className="space-y-4">
          {doctorGuidelines.map((guideline, index) => (
            <Card key={index} className="border-l-4 border-l-green-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    {guideline.title}
                  </CardTitle>
                  <Badge variant={getPriorityVariant(guideline.priority)}>{guideline.priority.toUpperCase()}</Badge>
                </div>
                <CardDescription>{guideline.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {guideline.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-green-600">{stepIndex + 1}</span>
                      </div>
                      <p className="text-sm text-gray-700">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="emergency" className="space-y-4">
          {emergencyProtocols.map((protocol, index) => (
            <Card key={index} className="border-l-4 border-l-red-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                    {protocol.title}
                  </CardTitle>
                  <Badge variant="destructive">{protocol.priority.toUpperCase()}</Badge>
                </div>
                <CardDescription>{protocol.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {protocol.actions.map((action, actionIndex) => (
                    <div key={actionIndex} className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertTriangle className="h-3 w-3 text-red-600" />
                      </div>
                      <p className="text-sm text-gray-700 font-medium">{action}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Emergency Contacts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Medical Emergency:</span>
                  <span className="text-red-600 font-bold">108</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Technical Support:</span>
                  <span className="text-blue-600">+91-1800-XXX-XXXX</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Admin Helpline:</span>
                  <span className="text-green-600">+91-1800-XXX-YYYY</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Role-Based Security Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Admin: View-only access to patient data</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Aasha Workers: Patient registration & AI access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Doctors: Patient treatment & diagnosis</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Patients: Personal health records only</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Response Time Standards
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="font-medium">Critical Results:</span>
                  <span className="text-red-600 font-bold">2 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Abnormal Results:</span>
                  <span className="text-orange-600">24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Normal Results:</span>
                  <span className="text-green-600">48 hours</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documentation Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Complete patient registration forms</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Document all AI analysis results</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Record patient communications</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Maintain audit trail for all actions</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
