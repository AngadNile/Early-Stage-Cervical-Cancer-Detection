"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Mic, MicOff, Volume2, RotateCcw } from "lucide-react"

interface VoiceRecorderProps {
  onTranscriptChange: (transcript: string) => void
  currentTranscript: string
  className?: string
  language?: string
}

export default function VoiceRecorder({
  onTranscriptChange,
  currentTranscript,
  className = "",
  language = "en-US",
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const recognitionRef = useRef<any | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    // Check if speech recognition is supported
    if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
      setIsSupported(true)
    }
  }, [])

  const startRecording = () => {
    if (!isSupported) {
      toast({
        title: "Speech recognition not supported",
        description: "Your browser doesn't support speech recognition. Please type manually.",
        variant: "destructive",
      })
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = language

    recognition.onstart = () => {
      setIsRecording(true)
      setIsListening(true)
      toast({
        title: "Recording started",
        description: "Speak clearly...",
      })
    }

    recognition.onresult = (event) => {
      let finalTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalTranscript += transcript
        }
      }

      if (finalTranscript) {
        const newTranscript = currentTranscript + (currentTranscript ? " " : "") + finalTranscript
        onTranscriptChange(newTranscript)
      }
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
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsRecording(false)
    setIsListening(false)
    toast({
      title: "Recording stopped",
      description: "Your speech has been recorded.",
    })
  }

  const clearTranscript = () => {
    onTranscriptChange("")
    toast({
      title: "Transcript cleared",
      description: "The text has been cleared.",
    })
  }

  const speakText = () => {
    if ("speechSynthesis" in window && currentTranscript.trim()) {
      const utterance = new SpeechSynthesisUtterance(currentTranscript)
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

  if (!isSupported) {
    return (
      <div className={`text-center p-4 bg-yellow-50 rounded-lg ${className}`}>
        <p className="text-sm text-yellow-800">
          Voice recording is not supported in your browser. Please type your text manually.
        </p>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Recording Controls */}
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

        {currentTranscript && (
          <>
            <Button onClick={speakText} variant="outline" size="lg" className="flex items-center gap-2 bg-transparent">
              <Volume2 className="h-5 w-5" />
              Play Back
            </Button>
            <Button
              onClick={clearTranscript}
              variant="outline"
              size="lg"
              className="flex items-center gap-2 bg-transparent"
            >
              <RotateCcw className="h-5 w-5" />
              Clear
            </Button>
          </>
        )}
      </div>

      {/* Recording Status */}
      {isListening && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            Listening... Speak clearly
          </div>
        </div>
      )}
    </div>
  )
}
