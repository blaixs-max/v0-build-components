import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { sql } from "@/lib/db"
import { createSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const { phone, password } = await request.json()

    if (!phone || !password) {
      return NextResponse.json(
        { error: "Telefon ve şifre zorunludur." },
        { status: 400 }
      )
    }

    const result = await sql`
      SELECT id, first_name, last_name, phone, password_hash, location
      FROM users WHERE phone = ${phone}
    `

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Telefon numarası veya şifre hatalı." },
        { status: 401 }
      )
    }

    const user = result[0]
    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Telefon numarası veya şifre hatalı." },
        { status: 401 }
      )
    }

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
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Giriş sırasında bir hata oluştu." },
      { status: 500 }
    )
  }
}
