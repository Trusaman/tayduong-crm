import * as React from "react"
import { ChevronDown, Check } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@workspace/ui/lib/utils"

const selectTriggerVariants = cva(
  "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
  {
    variants: {
      size: {
        default: "h-10",
        sm: "h-9",
        lg: "h-11",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

interface SelectProps extends VariantProps<typeof selectTriggerVariants> {
  placeholder?: string
  value?: string
  onValueChange?: (value: string) => void
  children: React.ReactNode
  disabled?: boolean
  className?: string
}

interface SelectItemProps {
  value: string
  children: React.ReactNode
  className?: string
}

interface SelectContentProps {
  children: React.ReactNode
  className?: string
}

const SelectContext = React.createContext<{
  value?: string
  onValueChange?: (value: string) => void
  open: boolean
  setOpen: (open: boolean) => void
}>({
  open: false,
  setOpen: () => {},
})

const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  ({ className, size, placeholder, value, onValueChange, children, disabled, ...props }, ref) => {
    const [open, setOpen] = React.useState(false)
    
    return (
      <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
        <div className="relative">
          <button
            ref={ref}
            type="button"
            className={cn(selectTriggerVariants({ size, className }))}
            onClick={() => !disabled && setOpen(!open)}
            disabled={disabled}
            {...props}
          >
            <span>{value || placeholder}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </button>
          {open && (
            <div className="absolute top-full z-50 w-full mt-1 rounded-md border bg-popover text-popover-foreground shadow-md">
              {children}
            </div>
          )}
        </div>
      </SelectContext.Provider>
    )
  }
)
Select.displayName = "Select"

const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-1 max-h-60 overflow-auto", className)}
      {...props}
    >
      {children}
    </div>
  )
)
SelectContent.displayName = "SelectContent"

const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ className, children, value, ...props }, ref) => {
    const { value: selectedValue, onValueChange, setOpen } = React.useContext(SelectContext)
    
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
          className
        )}
        onClick={() => {
          onValueChange?.(value)
          setOpen(false)
        }}
        {...props}
      >
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          {selectedValue === value && <Check className="h-4 w-4" />}
        </span>
        {children}
      </div>
    )
  }
)
SelectItem.displayName = "SelectItem"

export { Select, SelectContent, SelectItem }
