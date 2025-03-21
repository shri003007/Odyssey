import { useEffect } from "react"

/**
 * A hook that locks the body scroll when active to prevent scrolling behind modals or drawers
 */
export function useLockBody(isActive: boolean = true) {
  useEffect(() => {
    if (!isActive) return
    
    // Save original body style
    const originalStyle = window.getComputedStyle(document.body).overflow
    const originalPaddingRight = window.getComputedStyle(document.body).paddingRight
    
    // Measure scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    
    // Apply lock
    document.body.style.overflow = "hidden"
    
    // Add padding right equal to scrollbar width to prevent layout shift
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }
    
    return () => {
      // Restore original style
      document.body.style.overflow = originalStyle
      document.body.style.paddingRight = originalPaddingRight
    }
  }, [isActive])
} 