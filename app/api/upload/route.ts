import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { type NextRequest, NextResponse } from "next/server"

const MAX_PHOTO_SIZE = 50 * 1024 * 1024   // 50MB
const MAX_VIDEO_SIZE = 500 * 1024 * 1024  // 500MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"]

export async function POST(request: NextRequest) {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Determine type from folder prefix
        const isVideo = pathname.startsWith("videos/")

        return {
          allowedContentTypes: isVideo ? ALLOWED_VIDEO_TYPES : ALLOWED_IMAGE_TYPES,
          maximumSizeInBytes: isVideo ? MAX_VIDEO_SIZE : MAX_PHOTO_SIZE,
        }
      },
      onUploadCompleted: async () => {
        // Could do post-processing here (e.g. save to DB)
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: (error as Error).message || "Dosya yüklenirken bir hata oluştu." },
      { status: 400 },
    )
  }
}
