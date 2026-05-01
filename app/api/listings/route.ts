import { NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const category = searchParams.get("category") || "%"
    const city = searchParams.get("city") || "%"
    const breed = searchParams.get("breed") || "%"
    const search = searchParams.get("search") || ""
    const searchPattern = search ? `%${search}%` : "%"

    const result = await sql`
      SELECT l.*, u.first_name || ' ' || u.last_name as seller_name, u.phone as seller_phone
      FROM listings l
      JOIN users u ON l.user_id = u.id
      WHERE l.status = 'active'
        AND l.animal_type LIKE ${category}
        AND l.city LIKE ${city}
        AND l.breed LIKE ${breed}
        AND (l.title ILIKE ${searchPattern} OR l.description ILIKE ${searchPattern})
      ORDER BY l.created_at DESC
    `

    // Check favorites for logged-in user
    const session = await getSession()
    let favoriteIds: string[] = []
    if (session) {
      const favs = await sql`SELECT listing_id FROM favorites WHERE user_id = ${session.id}`
      favoriteIds = favs.map((f) => f.listing_id)
    }

    const listings = result.map((row) => ({
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
      enterpriseLabel: row.enterprise_label,
      quantity: row.quantity,
      healthStatus: row.health_status,
      vaccination: row.vaccination,
      status: row.status,
      videoUrl: row.video_url,
      views: row.views,
      createdAt: row.created_at,
      sellerName: row.seller_name,
      sellerPhone: row.seller_phone,
      userId: row.user_id,
      isFavorite: favoriteIds.includes(row.id),
    }))

    return NextResponse.json({ listings })
  } catch (error) {
    console.error("Listings fetch error:", error)
    return NextResponse.json(
      { error: "İlanlar yüklenirken hata oluştu." },
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
    const body = await request.json()

    const result = await sql`
      INSERT INTO listings (
        user_id, title, animal_type, breed, age, weight, gender,
        price, price_type, location, city, description,
        image_url, images, ear_tag, enterprise_no, enterprise_label,
        quantity, health_status, vaccination, video_url
      ) VALUES (
        ${session.id}, ${body.title}, ${body.animalType}, ${body.breed || null},
        ${body.age || null}, ${body.weight || null}, ${body.gender || null},
        ${body.price || 0}, ${body.priceType || "sabit"},
        ${body.location || null}, ${body.city || null},
        ${body.description || null}, ${body.imageUrl || null},
        ${body.images || []}, ${body.earTag || null},
        ${body.enterpriseNo || null}, ${body.enterpriseLabel || null},
        ${body.quantity || 1}, ${body.healthStatus || null},
        ${body.vaccination || false}, ${body.videoUrl || null}
      )
      RETURNING id
    `

    return NextResponse.json({ id: result[0].id })
  } catch (error) {
    console.error("Listing create error:", error)
    return NextResponse.json(
      { error: "İlan oluşturulurken hata oluştu." },
      { status: 500 }
    )
  }
}
