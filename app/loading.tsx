export default function Loading() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-meradan-green rounded-full flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" className="w-10 h-10">
            <path d="M12 4c-1.5 0-3 .5-4 1.5C7 6.5 6 8 6 10c0 1.5.5 2.5 1 3.5.5 1 1 2 1 3.5v3h8v-3c0-1.5.5-2.5 1-3.5.5-1 1-2 1-3.5 0-2-1-3.5-2-4.5-1-1-2.5-1.5-4-1.5z" />
          </svg>
        </div>
        <p className="text-meradan-green font-medium">Yükleniyor...</p>
      </div>
    </div>
  )
}
