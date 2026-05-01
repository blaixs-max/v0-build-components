import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ favorites: [] })
  }

  try {
    const result = await sql`
      SELECT l.*, u.first_name || ' ' || u.last_name as seller_name, u.phone as seller_phone
      FROM favorites f
      JOIN listings l ON f.listing_id = l.id
      JOIN users u ON l.user_id = u.id
      WHERE f.user_id = ${session.id}
      ORDER BY f.created_at DESC
    `

    const favorites = result.map((row) => ({
      id: row.id,
      title: row.title,
      animalType: row.animal_type,
      breed: row.breed,
      age: row.age,
      weight: row.weight,
      gender: row.gender,
      price: Number(row.price),
      priceType: row.price_type,
      location: row.location,
      city: row.city,
      description: row.description,
      imageUrl: row.image_url,
      images: row.images,
      earTag: row.ear_tag,
      enterpriseNo: row.enterprise_no,
      createdAt: row.created_at,
      sellerName: row.seller_name,
      sellerPhone: row.seller_phone,
      isFavorite: true,
    }))

    return NextResponse.json({ favorites })
  } catch (error) {
    console.error("Favorites fetch error:", error)
    return NextResponse.json(
      { error: "Favoriler yüklenirken hata oluştu." },
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
    const { listingId } = await request.json()

    // Toggle favorite
    const existing = await sql`
      SELECT id FROM favorites WHERE user_id = ${session.id} AND listing_id = ${listingId}
    `

    if (existing.length > 0) {
      await sql`DELETE FROM favorites WHERE user_id = ${session.id} AND listing_id = ${listingId}`
      return NextResponse.json({ isFavorite: false })
    } else {
      await sql`INSERT INTO favorites (user_id, listing_id) VALUES (${session.id}, ${listingId})`
      return NextResponse.json({ isFavorite: true })
    }
  } catch (error) {
    console.error("Favorite toggle error:", error)
    return NextResponse.json(
      { error: "Favori işlemi sırasında hata oluştu." },
      { status: 500 }
    )
  }
}
