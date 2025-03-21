'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function KeyboardShortcutIndicator() {
  const [showIndicator, setShowIndicator] = useState(false)
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only show indicator when Meta (Cmd/Ctrl) key is pressed
      if (e.metaKey || e.ctrlKey) {
        setShowIndicator(true)
      }
    }
    
    const handleKeyUp = (e: KeyboardEvent) => {
      // Hide when Meta key is released
      if (e.key === 'Meta' || e.key === 'Control') {
        setShowIndicator(false)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', () => setShowIndicator(false))
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', () => setShowIndicator(false))
    }
  }, [])
  
  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div 
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          transition={{ duration: 0.15 }}
          className="fixed bottom-4 right-4 z-50 p-3 rounded-lg bg-background/90 backdrop-blur-sm border border-primary/20 shadow-lg"
        >
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-md bg-primary/10">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="text-primary"
              >
                <rect x="3" y="11" width="18" height="10" rx="2" />
                <circle cx="12" cy="5" r="2" />
                <path d="M12 7v4" />
                <line x1="8" y1="16" x2="8" y2="16" />
                <line x1="16" y1="16" x2="16" y2="16" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-medium text-primary">
                Keyboard shortcuts active
              </div>
              <div className="text-[10px] text-muted-foreground">
                Press ⌘ + key to navigate
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
} 