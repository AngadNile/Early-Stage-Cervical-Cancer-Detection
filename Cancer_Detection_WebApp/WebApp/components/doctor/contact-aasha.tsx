"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { MessageCircle, Send, Phone, User } from "lucide-react"
import { chatService, ashaWorkerService } from "@/lib/api-services"
import { getCurrentUser } from "@/lib/auth"

interface Message {
  id: string
  sender: "aasha" | "doctor"
  name: string
  message: string
  time: string
  date: string
}

export default function ContactAasha() {
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [ashaWorker, setAshaWorker] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()
  const currentUser = getCurrentUser()

  useEffect(() => {
    const loadChatData = async () => {
      try {
        if (!currentUser) return

        // Load ASHA workers (for demo, get first one)
        const ashaWorkers = await ashaWorkerService.getAll()
        if (ashaWorkers.length > 0) {
          setAshaWorker(ashaWorkers[0])

          // Load chat messages between doctor and ASHA worker
          const chatMessages = await chatService.getMessages(
            "general", // Using general as patient ID for doctor-ASHA communication
            currentUser.id,
            ashaWorkers[0].id,
          )

          // Format messages for component
          const formattedMessages: Message[] = chatMessages.map((msg) => {
            const msgDate = msg.timestamp?.toDate ? msg.timestamp.toDate() : new Date(msg.timestamp || Date.now())
            return {
              id: msg.id!,
              sender: (msg.senderType === "doctor" ? "doctor" : "aasha") as "doctor" | "aasha",
              name: msg.senderType === "doctor" ? currentUser.name : ashaWorkers[0].name,
              message: msg.message,
              time: msgDate.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              date: msgDate.toDateString() === new Date().toDateString() ? "Today" : msgDate.toLocaleDateString(),
            }
          })

          setMessages(formattedMessages)
        }
      } catch (error) {
        console.error("[v0] Error loading chat data:", error)
        toast({
          title: "Error",
          description: "Failed to load chat messages",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadChatData()
  }, [currentUser, toast])

  const handleSendMessage = async () => {
    if (newMessage.trim() && currentUser && ashaWorker) {
      try {
        const messageId = await chatService.sendMessage({
          patientId: "general", // Using general for doctor-ASHA communication
          doctorId: currentUser.id,
          ashaWorkerId: ashaWorker.id,
          senderId: currentUser.id,
          senderType: "doctor",
          message: newMessage,
          isRead: false,
        })

        // Add message to local state for immediate UI update
        const message: Message = {
          id: messageId,
          sender: "doctor",
          name: currentUser.name,
          message: newMessage,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          date: "Today",
        }
        setMessages([...messages, message])
        setNewMessage("")
        toast({
          title: "Message sent",
          description: "Your message has been sent to the ASHA Worker.",
        })
      } catch (error) {
        console.error("[v0] Error sending message:", error)
        toast({
          title: "Error",
          description: "Failed to send message",
          variant: "destructive",
        })
      }
    }
  }

  const handleEmergencyCall = () => {
    toast({
      title: "Emergency call initiated",
      description: "Connecting you with the ASHA Worker...",
    })
  }

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading chat...</div>
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              ASHA Worker
            </CardTitle>
            <CardDescription>Your assigned community health worker</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{ashaWorker?.name || "Loading..."}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{ashaWorker?.phone || "Loading..."}</span>
              </div>
              <div className="text-sm text-muted-foreground">{ashaWorker?.address || "Loading..."}</div>
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
              Chat with ASHA Worker
            </CardTitle>
            <CardDescription>Communicate about patient cases and coordination</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Messages */}
            <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">No messages yet. Start a conversation!</div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === "doctor" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === "doctor" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
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
                placeholder="Type your message..."
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
          <CardDescription>Common communication templates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => setNewMessage("I need to discuss an urgent abnormal case. Please call me when available.")}
            >
              Urgent Case Discussion
            </Button>
            <Button
              variant="outline"
              onClick={() => setNewMessage("Please schedule a follow-up appointment for the patient we discussed.")}
            >
              Schedule Follow-up
            </Button>
            <Button
              variant="outline"
              onClick={() => setNewMessage("The patient needs additional counseling and support. Can you assist?")}
            >
              Request Patient Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
