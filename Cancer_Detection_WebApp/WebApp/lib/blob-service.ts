// Vercel Blob service for image storage
import { put, del } from "@vercel/blob"

export const blobService = {
  async uploadCervixImage(file: Blob | File, patientId: string): Promise<string> {
    try {
      const timestamp = Date.now()
      const fileName = `cervix-images/${patientId}/${timestamp}-${(file as any).name || "cervix.jpg"}`

      const blob = await put(fileName, file, {
        access: "public",
        addRandomSuffix: false,
      })

      console.log("[v0] Image uploaded to Blob:", blob.url)
      return blob.url
    } catch (error) {
      console.error("[v0] Blob upload error:", error)
      throw new Error(`Failed to upload image to Blob: ${error}`)
    }
  },

  async deleteImage(blobUrl: string): Promise<void> {
    try {
      await del(blobUrl)
      console.log("[v0] Image deleted from Blob:", blobUrl)
    } catch (error) {
      console.error("[v0] Blob delete error:", error)
      throw new Error(`Failed to delete image from Blob: ${error}`)
    }
  },
}
