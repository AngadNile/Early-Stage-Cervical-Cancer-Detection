"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { MessageCircle, Send, Phone, User, AlertTriangle, Clock } from "lucide-react"
import { chatService, doctorService } from "@/lib/api-services"
import { getCurrentUser } from "@/lib/auth"

interface Message {
  id: string
  sender: "doctor" | "aasha"
  name: string
  message: string
  time: string
  date: string
}

export default function ContactDoctor() {
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [doctor, setDoctor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const currentUser = getCurrentUser()

  useEffect(() => {
    const loadChatData = async () => {
      try {
        if (!currentUser) return

        // Load doctors (for demo, get first one)
        const doctors = await doctorService.getAll()
        if (doctors.length > 0) {
          setDoctor(doctors[0])

          // Load chat messages between ASHA worker and doctor
          const chatMessages = await chatService.getMessages(
            "general", // Using general as patient ID for ASHA-doctor communication
            doctors[0].id,
            currentUser.id,
          )

          // Format messages for component
          const formattedMessages: Message[] = chatMessages.map((msg) => ({
            id: msg.id!,
            sender: (msg.senderType === "ashaWorker" ? "aasha" : "doctor") as "doctor" | "aasha",
            name: msg.senderType === "ashaWorker" ? "You" : doctors[0].name,
            message: msg.message,
            time: new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            date:
              new Date(msg.timestamp).toDateString() === new Date().toDateString()
                ? "Today"
                : new Date(msg.timestamp).toLocaleDateString(),
          }))

          setMessages(formattedMessages)
        }
      } catch (error) {
        console.error("[v0] Error loading chat data:", error)
        toast({
          title: "Unable to load messages",
          description: "Failed to load chat messages. Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }

    loadChatData()
  }, [currentUser, toast])

  const handleSendMessage = async () => {
    if (newMessage.trim() && currentUser && doctor) {
      try {
        const messageId = await chatService.sendMessage({
          patientId: "general", // Using general for ASHA-doctor communication
          doctorId: doctor.id,
          ashaWorkerId: currentUser.id,
          senderId: currentUser.id,
          senderType: "ashaWorker",
          message: newMessage,
          isRead: false,
        })

        // Add message to local state for immediate UI update
        const message: Message = {
          id: messageId,
          sender: "aasha",
          name: "You",
          message: newMessage,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          date: "Today",
        }
        setMessages([...messages, message])
        setNewMessage("")
        toast({
          title: "Message sent",
          description: "Your message has been sent to the doctor.",
        })
      } catch (error) {
        console.error("[v0] Error sending message:", error)
        toast({
          title: "Message not sent",
          description: (error as any)?.message || "We couldn’t send your message. Please try again.",
        })
      }
    }
  }

  const handleEmergencyCall = () => {
    toast({
      title: "Emergency call initiated",
      description: "Connecting you with the doctor for urgent consultation...",
    })
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading chat...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doctor Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Assigned Doctor
            </CardTitle>
            <CardDescription>Your medical supervisor for patient cases</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{doctor?.name || "Loading..."}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{doctor?.phone || "Loading..."}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Specialization: {doctor?.specialization || "Loading..."}
              </div>
              <div className="text-sm text-muted-foreground">Experience: {doctor?.experience || "Loading..."}</div>
              <Badge variant="default" className="w-fit">
                Available
              </Badge>
            </div>
            <Button onClick={handleEmergencyCall} variant="destructive" className="w-full">
              <Phone className="h-4 w-4 mr-2" />
              Emergency Call
            </Button>
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Chat with Doctor
            </CardTitle>
            <CardDescription>Discuss patient cases and get medical guidance</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Messages */}
            <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No messages yet. Start a conversation with the doctor!
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "aasha" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === "aasha" ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="text-sm font-medium mb-1">{message.name}</div>
                      <div className="text-sm">{message.message}</div>
                      <div className="text-xs opacity-75 mt-1">
                        {message.time} • {message.date}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message to the doctor..."
                rows={2}
                className="flex-1"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
              />
              <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common messages for different situations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() =>
                setNewMessage("I have an abnormal case that needs urgent review. Patient details attached.")
              }
              className="text-left justify-start h-auto p-4"
            >
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-500 mt-1" />
                <div>
                  <div className="font-medium">Report Abnormal Case</div>
                  <div className="text-sm text-muted-foreground">Alert doctor about concerning results</div>
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setNewMessage("Patient is requesting appointment scheduling. Please advise on availability.")
              }
              className="text-left justify-start h-auto p-4"
            >
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-500 mt-1" />
                <div>
                  <div className="font-medium">Schedule Appointment</div>
                  <div className="text-sm text-muted-foreground">Request appointment coordination</div>
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setNewMessage("Patient needs emotional support and counseling. Seeking guidance on approach.")
              }
              className="text-left justify-start h-auto p-4"
            >
              <div className="flex items-start gap-3">
                <MessageCircle className="h-5 w-5 text-green-500 mt-1" />
                <div>
                  <div className="font-medium">Request Counseling Guidance</div>
                  <div className="text-sm text-muted-foreground">Get advice on patient support</div>
                </div>
              </div>
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                setNewMessage("Following up on previous case. Patient has questions about treatment plan.")
              }
              className="text-left justify-start h-auto p-4"
            >
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-purple-500 mt-1" />
                <div>
                  <div className="font-medium">Follow-up Discussion</div>
                  <div className="text-sm text-muted-foreground">Continue previous case discussion</div>
                </div>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Communication Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <p className="flex items-start gap-2">
              <span className="text-purple-600">•</span>
              <span>Always report abnormal cases immediately to ensure timely medical intervention</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-purple-600">•</span>
              <span>Use emergency call feature for urgent cases requiring immediate doctor consultation</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-purple-600">•</span>
              <span>Provide clear patient information and context when discussing cases</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-purple-600">•</span>
              <span>Coordinate with doctors for patient appointment scheduling and follow-ups</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
