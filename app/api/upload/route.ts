import { put } from "@vercel/blob"
import { type NextRequest, NextResponse } from "next/server"

const MAX_PHOTO_SIZE = 5 * 1024 * 1024 // 5MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif"]
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime", "video/mov"]

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const type = formData.get("type") as string // "photo" | "video"

    if (!file) {
      return NextResponse.json({ error: "Dosya bulunamadı" }, { status: 400 })
    }

    if (type === "photo") {
      if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: "Desteklenmeyen dosya formatı. JPG, PNG veya WebP kullanın." },
          { status: 400 },
        )
      }
      if (file.size > MAX_PHOTO_SIZE) {
        return NextResponse.json(
          { error: "Fotoğraf boyutu en fazla 5MB olabilir." },
          { status: 400 },
        )
      }
    } else if (type === "video") {
      if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: "Desteklenmeyen video formatı. MP4 veya WebM kullanın." },
          { status: 400 },
        )
      }
      if (file.size > MAX_VIDEO_SIZE) {
        return NextResponse.json(
          { error: "Video boyutu en fazla 50MB olabilir." },
          { status: 400 },
        )
      }
    } else {
      return NextResponse.json({ error: "Geçersiz dosya tipi" }, { status: 400 })
    }

    const folder = type === "photo" ? "photos" : "videos"
    const timestamp = Date.now()
    const ext = file.name.split(".").pop() || (type === "photo" ? "jpg" : "mp4")
    const filename = `${folder}/${timestamp}-${Math.random().toString(36).substring(2, 8)}.${ext}`

    const blob = await put(filename, file, {
      access: "public",
    })

    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Dosya yüklenirken bir hata oluştu." }, { status: 500 })
  }
}
