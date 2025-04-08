import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import DesktopLayout from "@/components/desktop-layout"
import { cn } from "@/lib/utils"

export default function FeedLoading() {
  // We can't use hooks in server components, but this is just for type checking
  const isDesktop = false

  return (
    <DesktopLayout>
      <div className="max-w-full mx-auto h-full flex flex-col px-4 sm:px-6 md:px-8">
        <div className="flex justify-between items-center mb-4">
          <Skeleton className="h-8 w-40" />
          <div className="hidden md:flex items-center gap-2">
            <Skeleton className="h-10 w-60" />
            <Skeleton className="h-10 w-28" />
          </div>
        </div>

        <div className={cn("grid gap-6 flex-1", isDesktop ? "grid-cols-3" : "grid-cols-1")}>
          {/* Post creation card */}
          <Card className={cn("p-4 bg-gray-900/80", isDesktop ? "col-span-2" : "col-span-1")}>
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between mb-1">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-8 w-24" />
              </div>
              <Skeleton className="h-24 w-full" />
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
                <Skeleton className="h-9 w-20" />
              </div>
            </div>
          </Card>

          {/* Feed content */}
          <div className={cn("space-y-4 flex flex-col", isDesktop ? "col-span-2" : "col-span-1")}>
            <Skeleton className="h-10 w-full" />

            <div className="space-y-4 flex-1 overflow-hidden">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-4 bg-gray-900/80">
                  <div className="flex items-start gap-3 mb-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-5 w-32 mb-1" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded-md" />
                  </div>
                  <Skeleton className="h-16 w-full mb-3" />
                  <Skeleton className="h-40 w-full mb-3 rounded-md" />
                  <div className="flex justify-between pt-3">
                    <div className="flex gap-4">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                    <Skeleton className="h-6 w-8" />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Trending section - only visible on desktop */}
          {isDesktop && (
            <div className="col-span-1 space-y-4">
              <Card className="p-4 bg-gray-900/80">
                <Skeleton className="h-6 w-40 mb-3" />
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              </Card>

              <Card className="p-4 bg-gray-900/80">
                <Skeleton className="h-6 w-40 mb-3" />
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </DesktopLayout>
  )
}
