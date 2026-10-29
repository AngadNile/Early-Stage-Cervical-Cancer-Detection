"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { FileText, Save, AlertTriangle, CheckCircle } from "lucide-react"

export default function Guidelines() {
  const [normalGuidelines, setNormalGuidelines] = useState(
    `ROUTINE CHECKUP GUIDELINES FOR NORMAL CASES:

1. FOLLOW-UP SCHEDULE:
   - Next screening: 6 months
   - Annual comprehensive examination
   - Self-examination education provided

2. LIFESTYLE RECOMMENDATIONS:
   - Maintain healthy diet rich in fruits and vegetables
   - Regular physical exercise (30 minutes daily)
   - Avoid smoking and limit alcohol consumption
   - Maintain healthy weight

3. WARNING SIGNS TO WATCH:
   - Unusual bleeding or discharge
   - Persistent pelvic pain
   - Changes in menstrual cycle
   - Pain during intercourse

4. PATIENT EDUCATION:
   - Importance of regular screening
   - Self-examination techniques
   - When to seek immediate medical attention

5. DOCUMENTATION:
   - Normal screening result recorded
   - Patient counseled and educated
   - Next appointment scheduled`,
  )

  const [abnormalGuidelines, setAbnormalGuidelines] = useState(
    `URGENT INSTRUCTIONS FOR ABNORMAL CASES:

1. IMMEDIATE ACTIONS:
   - Contact Aasha Worker immediately
   - Schedule urgent follow-up within 48 hours
   - Arrange for additional diagnostic tests
   - Refer to specialist if necessary

2. PATIENT COMMUNICATION:
   - Explain results calmly and clearly
   - Provide emotional support and reassurance
   - Discuss next steps and treatment options
   - Address patient concerns and questions

3. DIAGNOSTIC WORKUP:
   - Colposcopy examination
   - Biopsy if indicated
   - HPV testing
   - Additional imaging if required

4. COORDINATION:
   - Liaise with Aasha Worker for patient support
   - Coordinate with oncology team if needed
   - Ensure proper referral documentation
   - Follow up on test results

5. DOCUMENTATION:
   - Detailed findings recorded
   - Treatment plan documented
   - Patient counseling notes
   - Referral letters prepared

6. FOLLOW-UP:
   - Close monitoring schedule
   - Regular communication with patient
   - Coordinate care with multidisciplinary team`,
  )

  const { toast } = useToast()

  const handleSave = (type: "normal" | "abnormal") => {
    toast({
      title: "Guidelines saved",
      description: `${type === "normal" ? "Normal" : "Abnormal"} case guidelines have been updated successfully.`,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Clinical Guidelines
          </CardTitle>
          <CardDescription>Manage your clinical guidelines for normal and abnormal cases</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="normal" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="normal" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Normal Cases
              </TabsTrigger>
              <TabsTrigger value="abnormal" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Abnormal Cases
              </TabsTrigger>
            </TabsList>

            <TabsContent value="normal" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="normal-guidelines">Guidelines for Normal Cases</Label>
                <Textarea
                  id="normal-guidelines"
                  value={normalGuidelines}
                  onChange={(e) => setNormalGuidelines(e.target.value)}
                  rows={20}
                  className="font-mono text-sm"
                />
              </div>
              <Button onClick={() => handleSave("normal")} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                Save Normal Case Guidelines
              </Button>
            </TabsContent>

            <TabsContent value="abnormal" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="abnormal-guidelines">Guidelines for Abnormal Cases</Label>
                <Textarea
                  id="abnormal-guidelines"
                  value={abnormalGuidelines}
                  onChange={(e) => setAbnormalGuidelines(e.target.value)}
                  rows={25}
                  className="font-mono text-sm"
                />
              </div>
              <Button onClick={() => handleSave("abnormal")} className="w-full" variant="destructive">
                <Save className="h-4 w-4 mr-2" />
                Save Abnormal Case Guidelines
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Normal Case Protocol
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Next Screening:</span>
                <span>6 months</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Follow-up:</span>
                <span>Routine</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Patient Education:</span>
                <span>Required</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Aasha Contact:</span>
                <span>Optional</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Abnormal Case Protocol
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Next Screening:</span>
                <span className="text-red-600">48 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Follow-up:</span>
                <span className="text-red-600">Urgent</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Additional Tests:</span>
                <span className="text-red-600">Required</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Aasha Contact:</span>
                <span className="text-red-600">Immediate</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
