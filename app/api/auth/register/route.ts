import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { sql } from "@/lib/db"
import { createSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { firstName, lastName, phone, password, location } =
      await request.json()

    if (!firstName || !lastName || !phone || !password) {
      return NextResponse.json(
        { error: "Tüm alanlar zorunludur." },
        { status: 400 }
      )
    }

    // Check if phone already exists
    const existing = await sql`SELECT id FROM users WHERE phone = ${phone}`
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Bu telefon numarası zaten kayıtlı." },
        { status: 409 }
      )
    }

    const passwordHash = await bcrypt.hash(password, 10)

    const result = await sql`
      INSERT INTO users (first_name, last_name, phone, password_hash, location)
      VALUES (${firstName}, ${lastName}, ${phone}, ${passwordHash}, ${location || null})
      RETURNING id, first_name, last_name, phone, location
    `

    const user = result[0]

    await createSession({
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      location: user.location,
    })

    return NextResponse.json({
      user: {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        phone: user.phone,
        location: user.location,
      },
    })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json(
      { error: "Kayıt sırasında bir hata oluştu." },
      { status: 500 }
    )
  }
}
