"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Mic, MicOff, Volume2, Save, RotateCcw } from "lucide-react"

export default function VoiceSymptoms() {
  const [isRecording, setIsRecording] = useState(false)
  const [symptoms, setSymptoms] = useState("")
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any | null>(null)
  const { toast } = useToast()

  const startRecording = () => {
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      const recognition = new SpeechRecognition()

      recognition.continuous = true
      recognition.interimResults = true
      recognition.lang = "en-US"

      recognition.onstart = () => {
        setIsRecording(true)
        setIsListening(true)
        toast({
          title: "Recording started",
          description: "Speak clearly about your symptoms...",
        })
      }

      recognition.onresult = (event) => {
        let finalTranscript = ""
        let interimTranscript = ""

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }

        setSymptoms((prev) => {
          const newText = prev + finalTranscript
          return newText
        })
      }

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error)
        toast({
          title: "Recording error",
          description: "There was an error with speech recognition. Please try again.",
          variant: "destructive",
        })
        setIsRecording(false)
        setIsListening(false)
      }

      recognition.onend = () => {
        setIsRecording(false)
        setIsListening(false)
      }

      recognitionRef.current = recognition
      recognition.start()
    } else {
      toast({
        title: "Speech recognition not supported",
        description: "Your browser doesn't support speech recognition. Please type your symptoms manually.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsRecording(false)
    setIsListening(false)
    toast({
      title: "Recording stopped",
      description: "Your symptoms have been recorded.",
    })
  }

  const clearSymptoms = () => {
    setSymptoms("")
    toast({
      title: "Symptoms cleared",
      description: "The text area has been cleared.",
    })
  }

  const saveSymptoms = () => {
    if (symptoms.trim()) {
      toast({
        title: "Symptoms saved",
        description: "Your symptoms have been saved and will be shared with your Aasha Worker.",
      })
    } else {
      toast({
        title: "No symptoms to save",
        description: "Please record or type your symptoms first.",
        variant: "destructive",
      })
    }
  }

  const speakText = () => {
    if ("speechSynthesis" in window && symptoms.trim()) {
      const utterance = new SpeechSynthesisUtterance(symptoms)
      utterance.rate = 0.8
      utterance.pitch = 1
      utterance.volume = 1
      speechSynthesis.speak(utterance)
    } else {
      toast({
        title: "Text-to-speech not available",
        description: "Your browser doesn't support text-to-speech or there's no text to read.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5" />
            Voice-to-Text Symptoms
          </CardTitle>
          <CardDescription>
            Use voice recording to describe your symptoms or type them manually. This will help your Aasha Worker
            understand your condition better.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Voice Recording Controls */}
          <div className="flex items-center justify-center space-x-4">
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? "destructive" : "default"}
              size="lg"
              className="flex items-center gap-2"
            >
              {isRecording ? (
                <>
                  <MicOff className="h-5 w-5" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="h-5 w-5" />
                  Start Recording
                </>
              )}
            </Button>

            {symptoms && (
              <Button
                onClick={speakText}
                variant="outline"
                size="lg"
                className="flex items-center gap-2 bg-transparent"
              >
                <Volume2 className="h-5 w-5" />
                Play Back
              </Button>
            )}
          </div>

          {/* Recording Status */}
          {isListening && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                Listening... Speak clearly about your symptoms
              </div>
            </div>
          )}

          {/* Symptoms Text Area */}
          <div className="space-y-2">
            <Label htmlFor="symptoms">Symptoms Description</Label>
            <Textarea
              id="symptoms"
              value={symptoms}
              onChange={(e) => setSymptoms(e.target.value)}
              placeholder="Describe your symptoms here... You can type manually or use voice recording above."
              rows={8}
              className="resize-none"
            />
            <div className="text-sm text-muted-foreground">
              {symptoms.length} characters • Be as detailed as possible for better assistance
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <Button onClick={clearSymptoms} variant="outline" className="flex items-center gap-2 bg-transparent">
              <RotateCcw className="h-4 w-4" />
              Clear
            </Button>
            <Button onClick={saveSymptoms} disabled={!symptoms.trim()} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Symptoms
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tips Card */}
      <Card>
        <CardHeader>
          <CardTitle>Tips for Better Voice Recording</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Speak clearly and at a moderate pace</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Describe when symptoms started and how they feel</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Mention any pain levels or discomfort (mild, moderate, severe)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Include any changes you've noticed recently</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600">•</span>
              <span>Use the "Play Back" button to review what was recorded</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Common Symptoms Quick Add */}
      <Card>
        <CardHeader>
          <CardTitle>Common Symptoms</CardTitle>
          <CardDescription>Click to quickly add common symptoms to your description</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              "Irregular bleeding",
              "Pelvic pain",
              "Unusual discharge",
              "Pain during intercourse",
              "Abdominal pain",
              "Heavy bleeding",
              "Fatigue",
              "Loss of appetite",
              "Weight loss",
              "Bloating",
              "Back pain",
              "Urinary problems",
            ].map((symptom) => (
              <Button
                key={symptom}
                variant="outline"
                size="sm"
                onClick={() => setSymptoms((prev) => (prev ? `${prev}, ${symptom}` : symptom))}
                className="text-left justify-start"
              >
                {symptom}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
