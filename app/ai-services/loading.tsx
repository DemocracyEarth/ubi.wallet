import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-4 p-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-full" />

      <div className="h-10 flex gap-2 mt-6">
        <Skeleton className="h-full flex-1" />
        <Skeleton className="h-full flex-1" />
        <Skeleton className="h-full flex-1" />
      </div>

      <Skeleton className="h-[600px] w-full mt-4" />
    </div>
  )
}

