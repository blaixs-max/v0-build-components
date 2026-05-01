import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth"

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const result = await sql`
      SELECT l.*, u.first_name || ' ' || u.last_name as seller_name, 
             u.phone as seller_phone, u.is_verified as seller_verified,
             u.response_rate as seller_response_rate,
             u.successful_sales as seller_sales,
             u.member_since as seller_member_since
      FROM listings l
      JOIN users u ON l.user_id = u.id
      WHERE l.id = ${id}
    `

    if (result.length === 0) {
      return NextResponse.json({ error: "İlan bulunamadı." }, { status: 404 })
    }

    // Increment views
    await sql`UPDATE listings SET views = views + 1 WHERE id = ${id}`

    const row = result[0]
    const session = await getSession()
    let isFavorite = false
    if (session) {
      const fav = await sql`SELECT id FROM favorites WHERE user_id = ${session.id} AND listing_id = ${id}`
      isFavorite = fav.length > 0
    }

    return NextResponse.json({
      listing: {
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
        views: row.views + 1,
        createdAt: row.created_at,
        userId: row.user_id,
        sellerName: row.seller_name,
        sellerPhone: row.seller_phone,
        sellerVerified: row.seller_verified,
        sellerResponseRate: row.seller_response_rate,
        sellerSales: row.seller_sales,
        sellerMemberSince: row.seller_member_since,
        isFavorite,
      },
    })
  } catch (error) {
    console.error("Listing detail error:", error)
    return NextResponse.json(
      { error: "İlan yüklenirken hata oluştu." },
      { status: 500 }
    )
  }
}
