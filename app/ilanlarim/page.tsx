"use client"

import { useRouter } from "next/navigation"
import { useUser } from "@/contexts/user-context"
import { useEffect, useState } from "react"
import { ArrowLeft, Plus, Edit2, Trash2, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BottomNavigation } from "@/components/bottom-navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { demoListings } from "@/lib/listings-data"
import Image from "next/image"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function IlanlarimPage() {
  const router = useRouter()
  const { user, isLoggedIn, isMyListing, userCreatedListings } = useUser()
  const [deletedIds, setDeletedIds] = useState<string[]>([])

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/giris")
    }
  }, [isLoggedIn, router])

  if (!isLoggedIn || !user) {
    return null
  }

  // Combine demo listings that belong to user + user created listings
  const myDemoListings = demoListings.filter((l) => isMyListing(l.id))
  const allMyListings = [...userCreatedListings, ...myDemoListings].filter((l) => !deletedIds.includes(l.id))

  const activeListings = allMyListings
  const soldListings: typeof allMyListings = [] // Will be populated when offer completion is tracked

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("tr-TR").format(price)
  }

  const handleDelete = (id: string) => {
    setDeletedIds((prev) => [...prev, id])
  }

  const ListingCard = ({ listing }: { listing: (typeof allMyListings)[0] }) => (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex gap-3 p-3">
          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={listing.imageUrl || "/placeholder.svg"}
              alt={listing.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground line-clamp-1">{listing.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{listing.location}</p>
            <p className="text-lg font-bold text-meradan-green mt-1">₺{formatPrice(listing.price)}</p>
            <Badge variant="secondary" className="mt-1 text-xs bg-green-100 text-green-700">
              Aktif
            </Badge>
          </div>
        </div>
        <div className="flex border-t">
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 rounded-none h-10 text-xs"
            onClick={() => router.push(`/ilan/${listing.id}`)}
          >
            <Eye className="h-3.5 w-3.5 mr-1" />
            Görüntüle
          </Button>
          <div className="w-px bg-border" />
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 rounded-none h-10 text-xs text-muted-foreground"
            disabled
          >
            <Edit2 className="h-3.5 w-3.5 mr-1" />
            Düzenle
          </Button>
          <div className="w-px bg-border" />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 rounded-none h-10 text-xs text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1" />
                Sil
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>İlanı Sil</AlertDialogTitle>
                <AlertDialogDescription>
                  Bu ilanı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>İptal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleDelete(listing.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Sil
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="shrink-0" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-semibold">İlanlarım</h1>
          </div>
          <Button
            size="sm"
            className="bg-meradan-green hover:bg-meradan-green/90"
            onClick={() => router.push("/")}
          >
            <Plus className="h-4 w-4 mr-1" />
            Yeni İlan
          </Button>
        </div>
      </div>

      <div className="px-4 py-4">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active">Aktif ({activeListings.length})</TabsTrigger>
            <TabsTrigger value="sold">Satılanlar ({soldListings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="mt-4">
            {activeListings.length === 0 ? (
              <div className="text-center py-12">
                <Plus className="h-12 w-12 mx-auto text-muted-foreground/50" />
                <p className="text-muted-foreground mt-4">Henüz ilanınız yok</p>
                <Button
                  variant="outline"
                  className="mt-4 bg-transparent"
                  onClick={() => router.push("/")}
                >
                  İlan Ver
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {activeListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="sold" className="mt-4">
            <div className="text-center py-12">
              <p className="text-muted-foreground">Henüz satılan ilanınız yok</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation activeTab="profile" />
    </div>
  )
}
