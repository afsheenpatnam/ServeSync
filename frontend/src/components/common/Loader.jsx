export default function Loader({ fullPage = true }) {
  if (fullPage) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm z-50">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-orange-100 rounded-full" />
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-t-orange-500 rounded-full animate-spin" />
          </div>
          <p className="text-gray-500 text-sm font-medium">Loading…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center py-12">
      <div className="relative">
        <div className="w-8 h-8 border-3 border-orange-100 rounded-full" />
        <div className="absolute inset-0 w-8 h-8 border-[3px] border-transparent border-t-orange-500 rounded-full animate-spin" />
      </div>
    </div>
  )
}
