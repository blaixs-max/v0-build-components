import Image from "next/image"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-pulse">
          <Image
            src="/images/meradan-logo.png"
            alt="Meradan"
            width={340}
            height={100}
            priority
            className="h-14 w-auto"
          />
        </div>
        <p className="text-meradan-green font-medium text-sm">Yükleniyor...</p>
      </div>
    </div>
  )
}
