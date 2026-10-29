"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Copy, Key } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useI18n } from "@/lib/i18n-context"

interface CredentialDisplayProps {
  credentials: {
    username: string
    password: string
  } | null
  userType: "doctor" | "asha" | "patient"
  onGenerate?: () => void
  showGenerateButton?: boolean
  isGenerating?: boolean
}

export default function CredentialDisplay({
  credentials,
  userType,
  onGenerate,
  showGenerateButton = false,
  isGenerating = false,
}: CredentialDisplayProps) {
  const { toast } = useToast()
  const { t } = useI18n()

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: t.common.success,
      description: `${type} copied to clipboard`,
    })
  }

  const getUserTypeLabel = () => {
    switch (userType) {
      case "doctor":
        return (t.admin as any)?.doctor || "Doctor"
      case "asha":
        return (t.admin as any)?.ashaWorker || "ASHA Worker"
      case "patient":
        return (t.admin as any)?.patient || "Patient"
      default:
        return "User"
    }
  }

  const getThemeColors = () => {
    switch (userType) {
      case "doctor":
        return {
          cardBg: "border-blue-200 bg-blue-50",
          titleColor: "text-blue-800",
          descColor: "text-blue-700",
          inputBorder: "border-blue-300",
          buttonColors: "border-blue-300 text-blue-700 hover:bg-blue-100",
        }
      case "asha":
        return {
          cardBg: "border-green-200 bg-green-50",
          titleColor: "text-green-800",
          descColor: "text-green-700",
          inputBorder: "border-green-300",
          buttonColors: "border-green-300 text-green-700 hover:bg-green-100",
        }
      case "patient":
        return {
          cardBg: "border-purple-200 bg-purple-50",
          titleColor: "text-purple-800",
          descColor: "text-purple-700",
          inputBorder: "border-purple-300",
          buttonColors: "border-purple-300 text-purple-700 hover:bg-purple-100",
        }
      default:
        return {
          cardBg: "border-gray-200 bg-gray-50",
          titleColor: "text-gray-800",
          descColor: "text-gray-700",
          inputBorder: "border-gray-300",
          buttonColors: "border-gray-300 text-gray-700 hover:bg-gray-100",
        }
    }
  }

  const colors = getThemeColors()

  if (!credentials && !showGenerateButton) {
    return null
  }

  return (
    <Card className={`max-w-4xl mx-auto ${colors.cardBg}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${colors.titleColor}`}>
          <Key className="h-5 w-5" />
          {credentials
            ? t.admin.credentialsGenerated || "Login Credentials Generated"
            : `Generate ${getUserTypeLabel()} Credentials`}
        </CardTitle>
        <CardDescription className={colors.descColor}>
          {credentials
            ? t.admin.credentialsDesc ||
              `Please share these credentials with the ${getUserTypeLabel().toLowerCase()} securely. They can use these to login to the system.`
            : `Generate login credentials for the new ${getUserTypeLabel().toLowerCase()}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showGenerateButton && !credentials && (
          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={onGenerate}
              disabled={isGenerating}
              className={`flex items-center gap-2 ${colors.buttonColors}`}
            >
              <Key className="h-4 w-4" />
              {isGenerating ? "Generating..." : `Generate ${getUserTypeLabel()} Credentials`}
            </Button>
          </div>
        )}

        {credentials && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className={colors.titleColor}>{t.auth.username || "Username"}</Label>
                <div className="flex items-center gap-2">
                  <Input value={credentials.username} readOnly className={`bg-white ${colors.inputBorder}`} />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(credentials.username, "Username")}
                    className={colors.buttonColors}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label className={colors.titleColor}>{t.auth.password || "Password"}</Label>
                <div className="flex items-center gap-2">
                  <Input value={credentials.password} readOnly className={`bg-white ${colors.inputBorder}`} />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(credentials.password, "Password")}
                    className={colors.buttonColors}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>{t.admin.important || "Important"}:</strong>{" "}
                {t.admin.credentialsWarning || "Please save these credentials securely. They will not be shown again."}
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
