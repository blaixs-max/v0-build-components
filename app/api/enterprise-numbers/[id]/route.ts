import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 })
  }

  const { id } = await params

  try {
    const result = await sql`
      DELETE FROM user_enterprise_numbers
      WHERE id = ${id} AND user_id = ${session.id}
      RETURNING id
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: "İşletme numarası bulunamadı." },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Enterprise number delete error:", error)
    return NextResponse.json(
      { error: "İşletme numarası silinirken hata oluştu." },
      { status: 500 }
    )
  }
}
