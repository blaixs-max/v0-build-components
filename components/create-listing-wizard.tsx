"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StepCategory } from "@/components/wizard/step-category"
import { StepDetailsCattle } from "@/components/wizard/step-details-cattle"
import { StepDetailsSheep } from "@/components/wizard/step-details-sheep"
import { StepPriceMedia } from "@/components/wizard/step-price-media"
import { initialFormData } from "@/components/wizard/wizard-types"
import type { ListingFormData, Category } from "@/components/wizard/wizard-types"

// Re-export for backwards compatibility
export type { ListingFormData } from "@/components/wizard/wizard-types"

interface CreateListingWizardProps {
  onClose: () => void
  onSubmit: (data: ListingFormData) => void
}

export function CreateListingWizard({ onClose, onSubmit }: CreateListingWizardProps) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<ListingFormData>(initialFormData)

  const handleCategorySelect = (category: Category) => {
    setFormData({ ...initialFormData, category })
    setStep(2)
  }

  const handleBack = () => {
    if (step === 1) {
      onClose()
    } else {
      setStep(step - 1)
    }
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const handleUpdate = (updates: Partial<ListingFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }

  const toggleStatus = (status: string) => {
    setFormData((prev) => ({
      ...prev,
      status: prev.status.includes(status) ? prev.status.filter((s) => s !== status) : [...prev.status, status],
    }))
  }

  const handlePhotoUpload = () => {
    const demoPhotos = ["/simental-bull-cattle.jpg", "/simental-cow-cattle.jpg"]
    if (formData.photos.length < 5) {
      setFormData((prev) => ({
        ...prev,
        photos: [...prev.photos, demoPhotos[prev.photos.length % 2]],
      }))
    }
  }

  const handleVideoUpload = () => {
    setFormData((prev) => ({
      ...prev,
      video: "https://www.w3schools.com/html/mov_bbb.mp4",
    }))
  }

  const removeVideo = () => {
    setFormData((prev) => ({ ...prev, video: null }))
  }

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index),
    }))
  }

  const isStep2Valid = () => {
    if (formData.category === "buyukbas") {
      return formData.breed && formData.age && formData.weight && formData.city
    } else {
      return formData.breed && (formData.saleType === "tekli" || formData.quantity) && formData.city
    }
  }

  const isStep3Valid = () => {
    return formData.price && formData.photos.length > 0
  }

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card">
        <button onClick={handleBack} className="p-2 -ml-2 hover:bg-muted rounded-full transition-colors">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-semibold">İlan Ver</h1>
          <p className="text-xs text-muted-foreground">Adım {step}/3</p>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="h-1 bg-muted">
        <div
          className="h-full bg-meradan-green transition-all duration-300"
          style={{ width: `${(step / 3) * 100}%` }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {step === 1 && (
          <StepCategory selectedCategory={formData.category} onSelect={handleCategorySelect} />
        )}

        {step === 2 && formData.category === "buyukbas" && (
          <StepDetailsCattle formData={formData} onUpdate={handleUpdate} onToggleStatus={toggleStatus} />
        )}

        {step === 2 && formData.category === "kucukbas" && (
          <StepDetailsSheep formData={formData} onUpdate={handleUpdate} onToggleStatus={toggleStatus} />
        )}

        {step === 3 && (
          <StepPriceMedia
            formData={formData}
            onUpdate={handleUpdate}
            onPhotoUpload={handlePhotoUpload}
            onRemovePhoto={removePhoto}
            onVideoUpload={handleVideoUpload}
            onRemoveVideo={removeVideo}
          />
        )}
      </div>

      {/* Footer */}
      {step > 1 && (
        <div className="p-4 border-t border-border bg-card safe-area-inset-bottom">
          {step === 2 && (
            <Button
              onClick={handleNext}
              disabled={!isStep2Valid()}
              className="w-full h-14 text-lg font-semibold bg-meradan-green hover:bg-meradan-green/90 disabled:opacity-50"
            >
              Devam Et
            </Button>
          )}
          {step === 3 && (
            <Button
              onClick={() => onSubmit(formData)}
              disabled={!isStep3Valid()}
              className="w-full h-14 text-lg font-semibold bg-meradan-orange hover:bg-meradan-orange/90 disabled:opacity-50"
            >
              İlanı Yayınla
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
