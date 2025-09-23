import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse-safe rounded-md bg-muted/20", className)}
      style={{ minHeight: '1rem' }}
      {...props}
    />
  )
}

export { Skeleton }
