import Link from "next/link"
import { Search, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-meradan-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="h-10 w-10 text-meradan-green" />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
        <h2 className="text-xl font-semibold text-foreground mb-2">Sayfa Bulunamadı</h2>
        <p className="text-muted-foreground mb-6">
          Aradığınız sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <div className="flex gap-3 justify-center">
          <Button asChild className="bg-meradan-green hover:bg-meradan-green/90">
            <Link href="/">
              <Home className="h-4 w-4 mr-2" />
              Ana Sayfa
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
