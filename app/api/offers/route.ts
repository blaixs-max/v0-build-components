import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: "Giriş yapmalısınız." }, { status: 401 })
  }

  try {
    // Get offers received (as seller) and sent (as buyer)
    const received = await sql`
      SELECT o.*, l.title as listing_title, l.image_url as listing_image,
             u.first_name || ' ' || u.last_name as buyer_name, u.phone as buyer_phone
      FROM offers o
      JOIN listings l ON o.listing_id = l.id
      JOIN users u ON o.buyer_id = u.id
      WHERE o.seller_id = ${session.id}
      ORDER BY o.created_at DESC
    `

    const sent = await sql`
      SELECT o.*, l.title as listing_title, l.image_url as listing_image,
             u.first_name || ' ' || u.last_name as seller_name
      FROM offers o
      JOIN listings l ON o.listing_id = l.id
      JOIN users u ON o.seller_id = u.id
      WHERE o.buyer_id = ${session.id}
      ORDER BY o.created_at DESC
    `

    return NextResponse.json({
      received: received.map((row) => ({
        id: row.id,
        listingId: row.listing_id,
        listingTitle: row.listing_title,
        listingImage: row.listing_image,
        amount: Number(row.amount),
        message: row.message,
        status: row.status,
        buyerName: row.buyer_name,
        buyerPhone: row.buyer_phone,
        createdAt: row.created_at,
      })),
      sent: sent.map((row) => ({
        id: row.id,
        listingId: row.listing_id,
        listingTitle: row.listing_title,
        listingImage: row.listing_image,
        amount: Number(row.amount),
        message: row.message,
        status: row.status,
        sellerName: row.seller_name,
        createdAt: row.created_at,
      })),
    })
  } catch (error) {
    console.error("Offers fetch error:", error)
    return NextResponse.json(
      { error: "Teklifler yüklenirken hata oluştu." },
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
    const { listingId, amount, message } = await request.json()

    // Get listing to find seller
    const listing = await sql`SELECT user_id FROM listings WHERE id = ${listingId}`
    if (listing.length === 0) {
      return NextResponse.json({ error: "İlan bulunamadı." }, { status: 404 })
    }

    const sellerId = listing[0].user_id
    if (sellerId === session.id) {
      return NextResponse.json(
        { error: "Kendi ilanınıza teklif veremezsiniz." },
        { status: 400 }
      )
    }

    const result = await sql`
      INSERT INTO offers (listing_id, buyer_id, seller_id, amount, message)
      VALUES (${listingId}, ${session.id}, ${sellerId}, ${amount}, ${message || null})
      RETURNING id
    `

    return NextResponse.json({ id: result[0].id })
  } catch (error) {
    console.error("Offer create error:", error)
    return NextResponse.json(
      { error: "Teklif gönderilirken hata oluştu." },
      { status: 500 }
    )
  }
}
