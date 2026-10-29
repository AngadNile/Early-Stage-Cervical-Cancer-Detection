"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, CheckCircle, Users, Camera, FileText, Shield, Clock, Phone, Download } from "lucide-react"

export default function AashaWorkerGuidelines() {
  const patientRegistrationGuidelines = [
    {
      title: "Patient Registration Process",
      description: "Step-by-step guide for registering new patients",
      priority: "high",
      steps: [
        "Collect complete patient information including personal details",
        "Record medical history and current symptoms accurately",
        "Obtain patient consent for AI analysis and data storage",
        "Generate unique patient ID and provide to patient",
        "Schedule follow-up appointments as needed",
        "Ensure all mandatory fields are completed",
      ],
    },
    {
      title: "Patient Communication",
      description: "Best practices for communicating with patients",
      priority: "medium",
      steps: [
        "Explain the cervical cancer screening process clearly",
        "Address patient concerns and questions patiently",
        "Maintain patient confidentiality at all times",
        "Use simple, understandable language",
        "Provide educational materials when available",
        "Document all patient interactions",
      ],
    },
  ]

  const aiAnalysisGuidelines = [
    {
      title: "Screening Referral Guidelines",
      description: "Best practices for referring women to clinical screening points",
      priority: "critical",
      steps: [
        "Identify women aged 30-65 in your assigned village/community",
        "Educate women on cervical cancer prevention and early detection",
        "Explain the VIA screening procedure performed at Primary Health Centres / Mobile Camps",
        "Register the patient and generate a unique patient ID",
        "Guide the patient to the designated screening point or mobile unit",
        "Ensure patient privacy, dignity, and cultural sensitivity throughout outreach",
      ],
    },
    {
      title: "Follow-up & Communication Protocol",
      description: "Communicating screening results and doctor recommendations",
      priority: "critical",
      steps: [
        "Check screening results uploaded by the clinical team & doctor",
        "Understand doctor recommendations (Routine Follow-up vs Specialist Referral)",
        "Visit patient to explain doctor advice in simple local language",
        "Assist in arranging transportation or appointments if high-risk referral is recommended",
        "Maintain patient confidentiality at all times",
        "Provide ongoing emotional support and health counseling",
      ],
    },
  ]

  const emergencyProtocols = [
    {
      title: "High Risk Result Follow-up Protocol",
      description: "Immediate actions when doctor flags a high-risk case",
      priority: "critical",
      actions: [
        "Contact patient immediately (within 24 hours)",
        "Explain doctor advice in a calm, supportive manner",
        "Help schedule urgent referral appointment with hospital/gynecologist",
        "Provide emotional support and family counseling",
        "Document all interactions and track attendance at referral center",
        "Follow up post-treatment to ensure complete care continuum",
      ],
    },
    {
      title: "Emergency Situations",
      description: "Handling medical emergencies during outreach or transport",
      priority: "critical",
      actions: [
        "Call emergency services (108) immediately",
        "Provide first aid if trained and necessary",
        "Contact patient's emergency contact",
        "Document the incident thoroughly",
        "Notify supervisor and medical team",
        "Ensure patient receives appropriate medical attention",
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
          <h2 className="text-2xl font-bold text-gray-900">Aasha Worker Guidelines</h2>
          <p className="text-gray-600">Essential protocols for community outreach & screening referrals</p>
        </div>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Download className="h-4 w-4" />
          Download PDF
        </Button>
      </div>

      <Tabs defaultValue="registration" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registration" className="gap-2">
            <Users className="h-4 w-4" />
            Patient Registration
          </TabsTrigger>
          <TabsTrigger value="analysis" className="gap-2">
            <Camera className="h-4 w-4" />
            Screening Referral
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

        <TabsContent value="registration" className="space-y-4">
          {patientRegistrationGuidelines.map((guideline, index) => (
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

        <TabsContent value="analysis" className="space-y-4">
          {aiAnalysisGuidelines.map((guideline, index) => (
            <Card key={index} className="border-l-4 border-l-purple-500">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
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
                  <span className="font-medium">Supervisor:</span>
                  <span className="text-blue-600">+91-1800-XXX-XXXX</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Technical Support:</span>
                  <span className="text-green-600">+91-1800-XXX-YYYY</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Data Privacy Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Always obtain patient consent</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Keep patient information confidential</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Secure storage of medical images</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Report privacy breaches immediately</span>
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
                  <span className="font-medium">Abnormal Results:</span>
                  <span className="text-red-600 font-bold">2 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Normal Results:</span>
                  <span className="text-green-600">24 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Follow-up Calls:</span>
                  <span className="text-blue-600">48 hours</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documentation Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Complete patient registration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Record AI analysis results</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Document patient communications</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Log all follow-up actions</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
