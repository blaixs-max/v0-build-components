import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"
import { validateEnterpriseNo } from "@/lib/enterprise-validation"

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 })
  }

  try {
    const result = await sql`
      SELECT id, enterprise_no, label, created_at
      FROM user_enterprise_numbers
      WHERE user_id = ${session.id}
      ORDER BY created_at DESC
    `

    return NextResponse.json({
      enterpriseNumbers: result.map((row) => ({
        id: row.id,
        enterpriseNo: row.enterprise_no,
        label: row.label,
        createdAt: row.created_at,
      })),
    })
  } catch (error) {
    console.error("Enterprise numbers fetch error:", error)
    return NextResponse.json(
      { error: "İşletme numaraları yüklenirken hata oluştu." },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 })
  }

  try {
    const { enterpriseNo, label } = await request.json()

    const validation = validateEnterpriseNo(enterpriseNo)
    if (!validation.valid) {
      return NextResponse.json({ error: validation.error }, { status: 400 })
    }

    const trimmedNo = enterpriseNo.trim().toUpperCase()

    // Check if this user already has this enterprise number
    const existing = await sql`
      SELECT id FROM user_enterprise_numbers
      WHERE user_id = ${session.id} AND enterprise_no = ${trimmedNo}
    `
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Bu işletme numarası zaten kayıtlı." },
        { status: 409 }
      )
    }

    const result = await sql`
      INSERT INTO user_enterprise_numbers (user_id, enterprise_no, label)
      VALUES (${session.id}, ${trimmedNo}, ${label || null})
      RETURNING id, enterprise_no, label, created_at
    `

    const row = result[0]
    return NextResponse.json({
      enterpriseNumber: {
        id: row.id,
        enterpriseNo: row.enterprise_no,
        label: row.label,
        createdAt: row.created_at,
      },
    })
  } catch (error) {
    console.error("Enterprise number create error:", error)
    return NextResponse.json(
      { error: "İşletme numarası eklenirken hata oluştu." },
      { status: 500 }
    )
  }
}
