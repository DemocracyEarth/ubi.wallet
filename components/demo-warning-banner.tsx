import { AlertTriangle } from "lucide-react"

export default function DemoWarningBanner() {
  return (
    <div className="hidden">
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-center">
        <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
        <p className="text-sm font-medium text-center">
          <span className="font-bold">DEMO ONLY:</span> This is a demonstration platform. No real data is being used.
        </p>
      </div>
    </div>
  )
}
