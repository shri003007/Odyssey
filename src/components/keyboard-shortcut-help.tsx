'use client'

import { useState, useEffect } from 'react'
import { 
  Dialog, 
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@sparrowengg/twigs-react'

interface ShortcutGroup {
  name: string
  shortcuts: {
    key: string
    description: string
  }[]
}

export default function KeyboardShortcutHelp() {
  const [isOpen, setIsOpen] = useState(false)
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle help dialog when pressing Cmd/Ctrl + /
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault()
        setIsOpen(prev => !prev)
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])
  
  const shortcutGroups: ShortcutGroup[] = [
    {
      name: 'Navigation',
      shortcuts: [
        { key: '⌘ + H', description: 'Go to Dashboard' },
        { key: '⌘ + N', description: 'Create new content' },
        { key: '⌘ + T', description: 'Browse templates' },
        { key: '⌘ + A', description: 'View analytics' },
        { key: '⌘ + L', description: 'Access library' },
        { key: '⌘ + P', description: 'Manage projects' },
        { key: '⌘ + ,', description: 'Open settings' },
      ]
    },
    {
      name: 'General',
      shortcuts: [
        { key: '⌘ + /', description: 'Show this help dialog' },
        { key: 'Esc', description: 'Close dialogs or sidebar' },
        { key: '⌘ + S', description: 'Save current work' },
        { key: '⌘ + Z', description: 'Undo' },
        { key: '⌘ + Shift + Z', description: 'Redo' },
      ]
    }
  ]
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl overflow-hidden bg-background border-border">
        <DialogHeader className="mb-6 border-b pb-4 border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <div className="p-1.5 rounded-md bg-primary/10">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="18" 
                  height="18" 
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
              Keyboard Shortcuts
            </DialogTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsOpen(false)}
              className="h-8 w-8 p-0 rounded-full"
            >
              <X size={16} />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </DialogHeader>
        
        <div className="space-y-6 pr-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {shortcutGroups.map((group, index) => (
            <motion.div 
              key={group.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className="space-y-3"
            >
              <h3 className="text-sm font-semibold text-muted-foreground">{group.name}</h3>
              <div className="space-y-1.5">
                {group.shortcuts.map((shortcut, idx) => (
                  <motion.div 
                    key={shortcut.key}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index * 0.1) + (idx * 0.05) + 0.2, duration: 0.2 }}
                    className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-muted/40 transition-colors"
                  >
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {shortcut.key.split(' + ').map((key, keyIdx) => (
                        <kbd 
                          key={keyIdx}
                          className="px-2 py-1.5 rounded bg-primary/10 border border-primary/20 text-xs font-semibold text-primary"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="flex items-center justify-between border-t border-border pt-4 mt-4">
          <span className="text-xs text-muted-foreground">
            Press <kbd className="px-1 py-0.5 rounded bg-muted text-[10px]">⌘</kbd> + <kbd className="px-1 py-0.5 rounded bg-muted text-[10px]">/</kbd> anytime to show this dialog
          </span>
          <Button 
            size="sm" 
            variant="solid" 
            className="text-xs bg-primary text-primary-foreground"
            onClick={() => setIsOpen(false)}
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 