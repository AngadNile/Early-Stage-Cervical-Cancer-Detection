"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { chatService, patientService, type Patient } from "@/lib/api-services"
import { getCurrentUser } from "@/lib/auth"
import { MessageCircle, Send, Users, User } from "lucide-react"

interface MessageVM {
  id: string
  sender: "aasha" | "patient"
  name: string
  message: string
  time: string
  date: string
}

export default function ContactPatients() {
  const { toast } = useToast()
  const currentUser = getCurrentUser()
  const [patients, setPatients] = useState<Patient[]>([])
  const [selectedPatientId, setSelectedPatientId] = useState<string>("")
  const [messages, setMessages] = useState<MessageVM[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [messagesLoading, setMessagesLoading] = useState(false) // new

  const userId = currentUser?.id

  useEffect(() => {
    const load = async () => {
      try {
        if (!userId) return
        const items = await patientService.getByAshaWorker(userId)
        setPatients(items)
        // only set default selected patient if not already set or changed
        if (items.length > 0 && selectedPatientId !== items[0].id) {
          setSelectedPatientId(items[0].id!)
        }
      } catch (error) {
        console.error("[v0] Error loading patients for ASHA:", error)
        toast({
          title: "Unable to load patients",
          description: (error as any)?.message || "Please try again.",
        })
      } finally {
        setLoading(false)
      }
    }
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]) // depend on userId only

  const selectedPatient = useMemo(() => patients.find((p) => p.id === selectedPatientId), [patients, selectedPatientId])

  useEffect(() => {
    const loadChat = async () => {
      try {
        if (!userId || !selectedPatientId) return
        setMessagesLoading(true)
        const msgs = await chatService.getMessages(selectedPatientId, undefined, userId)
        const patientName = selectedPatient?.name || "Patient" // safe to read; not a dependency
        const vm: MessageVM[] = msgs.map((m) => ({
          id: m.id!,
          sender: m.senderType === "ashaWorker" ? "aasha" : "patient",
          name: m.senderType === "ashaWorker" ? "You" : patientName,
          message: m.message,
          time: m.timestamp.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          date:
            m.timestamp.toDate().toDateString() === new Date().toDateString()
              ? "Today"
              : m.timestamp.toDate().toLocaleDateString(),
        }))
        setMessages(vm)
      } catch (error) {
        console.error("[v0] Error loading patient chat:", error)
        toast({
          title: "Unable to load chat",
          description: (error as any)?.message || "Please try again.",
        })
      } finally {
        setMessagesLoading(false)
      }
    }
    // clear messages when switching active patient
    setMessages([])
    loadChat()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, selectedPatientId]) // stable deps

  const handleSend = async () => {
    if (!newMessage.trim() || !userId || !selectedPatientId) return
    try {
      const id = await chatService.sendMessage({
        patientId: selectedPatientId,
        ashaWorkerId: userId,
        senderId: userId,
        senderType: "ashaWorker",
        message: newMessage,
        isRead: false,
      })
      setMessages((prev) => [
        ...prev,
        {
          id,
          sender: "aasha",
          name: "You",
          message: newMessage,
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          date: "Today",
        },
      ])
      setNewMessage("")
      toast({ title: "Message sent", description: "Your message has been sent to the patient." })
    } catch (error) {
      console.error("[v0] Error sending patient message:", error)
      toast({
        title: "Message not sent",
        description: (error as any)?.message || "We couldn’t send your message. Please try again.",
      })
    }
  }

  if (loading) return <div className="flex items-center justify-center p-8">Loading patients...</div>

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Patients list */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Your Patients
          </CardTitle>
          <CardDescription>Patients assigned to you</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {patients.length === 0 ? (
            <div className="text-center py-6 px-4 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800/40 rounded-xl border border-dashed border-gray-200 dark:border-slate-700">
              <Users className="w-8 h-8 text-teal-500 mx-auto mb-2 opacity-60" />
              <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">No Patients Found</p>
              <p className="text-xs text-gray-500 mb-3">Register a patient first from the Add Patient tab to start communicating.</p>
            </div>
          ) : (
            patients.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => {
                  setSelectedPatientId(p.id!)
                  setMessages([])
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl border transition-all ${
                  selectedPatientId === p.id
                    ? "bg-teal-50 border-teal-300 text-teal-900 dark:bg-teal-950/40 dark:border-teal-700 dark:text-teal-200 font-semibold"
                    : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800/50"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 flex items-center justify-center font-bold text-xs">
                    {p.name?.charAt(0)?.toUpperCase() || "P"}
                  </div>
                  <div className="overflow-hidden">
                    <div className="font-medium text-sm truncate">{p.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{p.phone || "No phone registered"}</div>
                  </div>
                </div>
              </button>
            ))
          )}
        </CardContent>
      </Card>

      {/* Chat */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-teal-600 dark:text-teal-400" />
            {selectedPatient ? `Chat with ${selectedPatient.name}` : "Select a patient to chat"}
          </CardTitle>
          <CardDescription>Coordinate care and guidance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-4 max-h-96 min-h-[220px] flex flex-col justify-center overflow-y-auto">
            {messagesLoading ? (
              <div className="text-center text-gray-500 py-8">Loading conversation…</div>
            ) : !selectedPatientId ? (
              <div className="text-center text-gray-500 py-10 px-4">
                <MessageCircle className="w-10 h-10 text-teal-500/40 mx-auto mb-2" />
                <p className="font-medium text-gray-700 dark:text-gray-300">No Patient Selected</p>
                <p className="text-xs text-gray-500">Choose a patient from the list on the left to view messages.</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-gray-500 py-10 px-4">
                <p className="font-medium text-gray-700 dark:text-gray-300">No messages yet</p>
                <p className="text-xs text-gray-500 mt-0.5">Send a message below to start coordinating care with {selectedPatient?.name}.</p>
              </div>
            ) : (
              messages.map((m) => (
                <div key={m.id} className={`flex ${m.sender === "aasha" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl ${
                      m.sender === "aasha"
                        ? "bg-teal-600 text-white rounded-br-none"
                        : "bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-gray-100 rounded-bl-none"
                    }`}
                  >
                    <div className="text-xs font-semibold mb-1 opacity-90">{m.name}</div>
                    <div className="text-sm">{m.message}</div>
                    <div className="text-[10px] opacity-75 mt-1 text-right">
                      {m.time} • {m.date}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={selectedPatientId ? `Write a message to ${selectedPatient?.name}...` : "Select a patient to enable chat"}
              rows={2}
              disabled={!selectedPatientId}
              className="flex-1 border-gray-200 dark:border-slate-700 focus:ring-2 focus:ring-teal-500/50"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
            />
            <Button
              onClick={handleSend}
              disabled={!newMessage.trim() || !selectedPatientId}
              className="bg-teal-600 hover:bg-teal-700 text-white self-end h-10 px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
