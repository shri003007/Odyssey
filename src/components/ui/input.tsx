import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, wrapperClassName, icon, iconPosition = "left", ...props }, ref) => {
    const iconContent = icon ? (
      <div className={cn(
        "absolute inset-y-0 flex items-center pointer-events-none text-muted-foreground",
        iconPosition === "left" ? "left-3" : "right-3"
      )}>
        {icon}
      </div>
    ) : null;
    
    return (
      <div className={cn("relative", wrapperClassName)}>
        {icon && iconPosition === "left" && iconContent}
        <input
          type={type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            icon && iconPosition === "left" && "pl-9",
            icon && iconPosition === "right" && "pr-9",
            className
          )}
          ref={ref}
          {...props}
        />
        {icon && iconPosition === "right" && iconContent}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
