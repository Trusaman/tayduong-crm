"use client"

import * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg"
}

export function LoadingSpinner({ className, size = "md", ...props }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8"
  }

  return (
    <div
      className={cn("animate-spin rounded-full border-2 border-current border-t-transparent", sizeClasses[size], className)}
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

interface LoadingStateProps {
  children?: React.ReactNode
  className?: string
}

export function LoadingState({ children, className }: LoadingStateProps) {
  return (
    <div className={cn("flex items-center justify-center p-8", className)}>
      <div className="flex flex-col items-center gap-2">
        <LoadingSpinner size="lg" />
        {children && <p className="text-sm text-muted-foreground">{children}</p>}
      </div>
    </div>
  )
}

export function TableLoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-2">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-muted-foreground">Loading data...</p>
      </div>
    </div>
  )
}
