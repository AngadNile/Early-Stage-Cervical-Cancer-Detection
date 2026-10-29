"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Heart, Shield, AlertTriangle, CheckCircle } from "lucide-react"

export default function PatientGuidelines() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Health Guidelines & Information
          </CardTitle>
          <CardDescription>Important health information and guidelines for your care</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="prevention" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="prevention" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Prevention
              </TabsTrigger>
              <TabsTrigger value="normal" className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Normal Results
              </TabsTrigger>
              <TabsTrigger value="abnormal" className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Abnormal Results
              </TabsTrigger>
            </TabsList>

            <TabsContent value="prevention" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-purple-700">
                    <Shield className="h-5 w-5" />
                    Prevention & Healthy Living
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <h4 className="font-semibold text-gray-900">Lifestyle Recommendations:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Maintain a healthy diet rich in fruits and vegetables</li>
                      <li>• Exercise regularly (at least 30 minutes daily)</li>
                      <li>• Avoid smoking and limit alcohol consumption</li>
                      <li>• Maintain a healthy weight</li>
                      <li>• Get adequate sleep (7-9 hours per night)</li>
                      <li>• Manage stress through relaxation techniques</li>
                    </ul>

                    <h4 className="font-semibold text-gray-900 mt-4">Regular Screening:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Follow recommended screening schedules</li>
                      <li>• Attend all scheduled appointments</li>
                      <li>• Perform self-examinations as taught</li>
                      <li>• Report any unusual symptoms immediately</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="normal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-green-700">
                    <CheckCircle className="h-5 w-5" />
                    Understanding Normal Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <h4 className="font-semibold text-gray-900">What Normal Results Mean:</h4>
                    <p className="text-gray-700">
                      Normal screening results indicate that no abnormal cells or concerning changes were detected
                      during your examination. This is excellent news and means your current health status is good.
                    </p>

                    <h4 className="font-semibold text-gray-900 mt-4">Next Steps:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Continue with regular screening schedule (typically every 6 months)</li>
                      <li>• Maintain healthy lifestyle habits</li>
                      <li>• Stay alert for any warning signs</li>
                      <li>• Schedule your next appointment as recommended</li>
                    </ul>

                    <h4 className="font-semibold text-gray-900 mt-4">Warning Signs to Watch:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Unusual bleeding or discharge</li>
                      <li>• Persistent pelvic pain</li>
                      <li>• Changes in menstrual cycle</li>
                      <li>• Pain during intercourse</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="abnormal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-5 w-5" />
                    Understanding Abnormal Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="prose prose-sm max-w-none">
                    <h4 className="font-semibold text-gray-900">What Abnormal Results Mean:</h4>
                    <p className="text-gray-700">
                      Abnormal results don't necessarily mean you have cancer. They indicate that some cells appear
                      different from normal and require further investigation. Many abnormal results are due to
                      infections or other non-cancerous conditions.
                    </p>

                    <h4 className="font-semibold text-gray-900 mt-4">Immediate Actions:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Don't panic - abnormal doesn't always mean cancer</li>
                      <li>• Follow up with your doctor within 48 hours</li>
                      <li>• Attend all recommended additional tests</li>
                      <li>• Ask questions and seek clarification</li>
                      <li>• Bring a support person to appointments</li>
                    </ul>

                    <h4 className="font-semibold text-gray-900 mt-4">Additional Tests May Include:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Colposcopy examination</li>
                      <li>• Biopsy if indicated</li>
                      <li>• HPV testing</li>
                      <li>• Additional imaging studies</li>
                    </ul>

                    <h4 className="font-semibold text-gray-900 mt-4">Support Resources:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Contact your Aasha Worker for emotional support</li>
                      <li>• Join support groups if available</li>
                      <li>• Seek counseling if feeling overwhelmed</li>
                      <li>• Stay connected with family and friends</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Quick Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-purple-700">
              <Heart className="h-5 w-5" />
              Healthy Habits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Exercise:</span>
                <span>30 min daily</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Diet:</span>
                <span>Fruits & vegetables</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Sleep:</span>
                <span>7-9 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Smoking:</span>
                <span>Avoid completely</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-green-700">
              <CheckCircle className="h-5 w-5" />
              Normal Results
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
                <span className="font-medium">Lifestyle:</span>
                <span>Continue healthy habits</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Monitoring:</span>
                <span>Self-examination</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-red-700">
              <AlertTriangle className="h-5 w-5" />
              Abnormal Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Follow-up:</span>
                <span className="text-red-600">Within 48 hours</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Additional Tests:</span>
                <span className="text-red-600">May be needed</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Support:</span>
                <span className="text-red-600">Contact Aasha</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Mindset:</span>
                <span>Stay positive</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
