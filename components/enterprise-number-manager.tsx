"use client"

import { useState } from "react"
import { useUser, type EnterpriseNumber } from "@/contexts/user-context"
import { validateEnterpriseNo, formatEnterpriseDisplay } from "@/lib/enterprise-validation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Building2, Plus, Trash2, AlertCircle } from "lucide-react"

export function EnterpriseNumberManager() {
  const { enterpriseNumbers, addEnterpriseNumber, deleteEnterpriseNumber } = useUser()
  const [isAdding, setIsAdding] = useState(false)
  const [newNo, setNewNo] = useState("")
  const [newLabel, setNewLabel] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleAdd = async () => {
    setError("")
    const validation = validateEnterpriseNo(newNo)
    if (!validation.valid) {
      setError(validation.error || "Geçersiz format")
      return
    }

    setIsSubmitting(true)
    const result = await addEnterpriseNumber(newNo.trim().toUpperCase(), newLabel.trim() || undefined)

    if (result.success) {
      setNewNo("")
      setNewLabel("")
      setIsAdding(false)
    } else {
      setError(result.error || "Bir hata oluştu.")
    }
    setIsSubmitting(false)
  }

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    await deleteEnterpriseNumber(id)
    setDeletingId(null)
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-meradan-green" />
            <CardTitle className="text-base">İşletme Numaraları</CardTitle>
          </div>
          {!isAdding && (
            <Button
              size="sm"
              variant="outline"
              className="border-meradan-green text-meradan-green hover:bg-meradan-green/10 bg-transparent"
              onClick={() => {
                setIsAdding(true)
                setError("")
              }}
            >
              <Plus className="h-4 w-4 mr-1" />
              Ekle
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Add form */}
        {isAdding && (
          <div className="border border-dashed border-meradan-green/40 rounded-lg p-4 space-y-3 bg-meradan-green/5">
            <div className="space-y-2">
              <Label htmlFor="enterprise-no" className="text-sm font-medium">
                İşletme Numarası <span className="text-destructive">*</span>
              </Label>
              <Input
                id="enterprise-no"
                placeholder="TR0612345"
                value={newNo}
                onChange={(e) => {
                  setNewNo(e.target.value.toUpperCase())
                  setError("")
                }}
                className="font-mono"
                maxLength={14}
              />
              <p className="text-xs text-muted-foreground">
                {"Format: TR + 2 hane il kodu + 1-10 rakam (ör: TR0612345)"}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="enterprise-label" className="text-sm font-medium">
                Etiket (Opsiyonel)
              </Label>
              <Input
                id="enterprise-label"
                placeholder="Ankara Çiftliği"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-2 rounded-md">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-meradan-green hover:bg-meradan-green/90 text-white"
                onClick={handleAdd}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Ekleniyor..." : "Kaydet"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setIsAdding(false)
                  setNewNo("")
                  setNewLabel("")
                  setError("")
                }}
              >
                İptal
              </Button>
            </div>
          </div>
        )}

        {/* List */}
        {enterpriseNumbers.length === 0 && !isAdding && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Henüz kayıtlı işletme numarası yok.
          </p>
        )}

        {enterpriseNumbers.map((en: EnterpriseNumber) => (
          <div
            key={en.id}
            className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-meradan-green/10 flex items-center justify-center shrink-0">
                <Building2 className="h-4 w-4 text-meradan-green" />
              </div>
              <div>
                <p className="font-mono text-sm font-medium">
                  {formatEnterpriseDisplay(en.enterpriseNo, en.label)}
                </p>
                {en.label && (
                  <p className="text-xs text-muted-foreground">{en.enterpriseNo}</p>
                )}
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
              onClick={() => handleDelete(en.id)}
              disabled={deletingId === en.id}
              aria-label={`${en.enterpriseNo} numarasını sil`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
