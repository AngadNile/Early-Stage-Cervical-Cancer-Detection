"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Upload, X, FileImage } from "lucide-react"

interface FileUploadProps {
  onFileSelect: (file: File, preview: string) => void
  onFileRemove: () => void
  accept?: string
  maxSize?: number // in MB
  currentFile?: string | null
  className?: string
}

export default function FileUpload({
  onFileSelect,
  onFileRemove,
  accept = "image/*",
  maxSize = 10,
  currentFile,
  className = "",
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (file: File) => {
    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSize}MB`,
        variant: "destructive",
      })
      return
    }

    // Validate file type
    if (accept && !file.type.match(accept.replace("*", ".*"))) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid file type",
        variant: "destructive",
      })
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const preview = e.target?.result as string
      onFileSelect(file, preview)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {!currentFile ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-900">Click to upload or drag and drop</p>
            <p className="text-sm text-gray-500">
              {accept.includes("image") ? "PNG, JPG, GIF" : "Files"} up to {maxSize}MB
            </p>
          </div>
          <input ref={fileInputRef} type="file" className="hidden" accept={accept} onChange={handleInputChange} />
        </div>
      ) : (
        <div className="relative">
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileImage className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">File uploaded</p>
                  <p className="text-xs text-gray-500">Ready for analysis</p>
                </div>
              </div>
              <Button onClick={onFileRemove} variant="outline" size="sm">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {currentFile && (
            <div className="mt-4">
              <img
                src={currentFile || "/placeholder.svg"}
                alt="Uploaded file"
                className="max-w-xs rounded-lg shadow-md"
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
