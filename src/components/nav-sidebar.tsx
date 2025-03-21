'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  Home, 
  Lightbulb,
  Settings, 
  Folder, 
  BookOpen,
  Menu,
  X,
  Calendar,
  Share2,
  FileText
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { Box, Flex, IconButton } from '@sparrowengg/twigs-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useAuth } from '@/context/auth-provider'
import { motion } from 'framer-motion'

interface NavItemProps {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
  onClick?: () => void
}

function NavItem({ href, icon, children, onClick }: NavItemProps) {
  const pathname = usePathname()
  const isActive = pathname === href
  
  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={href}
            onClick={onClick}
            className={cn(
              "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200",
              "hover:bg-muted/80 hover:text-foreground",
              isActive ? 
                "bg-primary/10 text-primary font-medium shadow-[inset_0_0_0_1px_rgba(var(--primary),0.2)]" : 
                "text-muted-foreground"
            )}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className={cn(
              "flex-shrink-0 flex items-center justify-center h-5 w-5",
              isActive ? "text-primary" : "text-muted-foreground"
            )}>
              {icon}
            </span>
          </Link>
        </TooltipTrigger>
        <TooltipContent 
          side="right" 
          sideOffset={10}
          className="px-4 py-3 bg-background/95 backdrop-blur-sm border-border shadow-lg rounded-lg flex flex-col gap-1 min-w-[180px]"
        >
          <div className="flex items-center gap-2">
            <span className="text-primary">{icon}</span>
            <span className="font-medium">{children}</span>
          </div>
          {getTooltipDescription(href)}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Function to get tooltip description based on the route
function getTooltipDescription(href: string) {
  const descriptions: Record<string, { description: string, shortcut?: string, keys?: string[] }> = {
    '/': {
      description: 'View your dashboard with metrics and quick actions',
      shortcut: '⌘ + H',
      keys: ['meta', 'h']
    },
    '/create': {
      description: 'Create new marketing content with AI assistance',
      shortcut: '⌘ + N',
      keys: ['meta', 'n']
    },
    // '/templates': {
    //   description: 'Browse and use pre-designed marketing templates',
    //   shortcut: '⌘ + T',
    //   keys: ['meta', 't']
    // },
    // '/analytics': {
    //   description: 'Track performance metrics for your content',
    //   shortcut: '⌘ + A',
    //   keys: ['meta', 'a']
    // },
    '/library': {
      description: 'Access your saved content and resources',
      shortcut: '⌘ + L',
      keys: ['meta', 'l']
    },
    '/projects': {
      description: 'Manage your marketing campaigns and projects',
      shortcut: '⌘ + P',
      keys: ['meta', 'p']
    },
    '/calendar': {
      description: 'Manage your tasks and schedule',
      shortcut: '⌘ + C',
      keys: ['meta', 'c']
    },
    '/integrations': {
      description: 'Connect and manage your social media accounts',
      shortcut: '⌘ + I',
      keys: ['meta', 'i']
    },
    '/settings': {
      description: 'Configure your account and application settings',
      shortcut: '⌘ + ,',
      keys: ['meta', ',']
    }
  }
  
  const info = descriptions[href] || { description: 'Navigate to this page' }
  
  return (
    <>
      <div className="text-xs text-muted-foreground">{info.description}</div>
      {info.shortcut && (
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-muted-foreground/80 font-medium">Shortcut</span>
          <div className="flex items-center gap-1.5">
            {info.shortcut.split(' + ').map((key, index) => (
              <kbd 
                key={index}
                className="px-2 py-1.5 bg-primary/10 border border-primary/20 rounded text-[11px] font-semibold shadow-sm text-primary"
              >
                {key}
              </kbd>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

export function NavSidebar() {
  const { user } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()
  
  // Avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true)
    
    // Handle mobile menu
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileOpen(false)
      }
    }
    
    // Handle escape key to close mobile menu
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false)
      }
    }
    
    handleResize()
    window.addEventListener('resize', handleResize)
    document.addEventListener('keydown', handleEscKey)
    
    return () => {
      window.removeEventListener('resize', handleResize)
      document.removeEventListener('keydown', handleEscKey)
    }
  }, [mobileOpen])
  
  // Add keyboard shortcut handler
  useEffect(() => {
    if (!isMounted || !user) return
    
    const shortcuts: Record<string, { keys: string[], href: string }> = {
      'home': { keys: ['meta', 'h'], href: '/' },
      'create': { keys: ['meta', 'n'], href: '/create' },
      // 'templates': { keys: ['meta', 't'], href: '/templates' },
      // 'analytics': { keys: ['meta', 'a'], href: '/analytics' },
      'library': { keys: ['meta', 'l'], href: '/library' },
      'projects': { keys: ['meta', 'p'], href: '/projects' },
      'calendar': { keys: ['meta', 'c'], href: '/calendar' },
      'integrations': { keys: ['meta', 'i'], href: '/integrations' },
      'settings': { keys: ['meta', ','], href: '/settings' }
    }
    
    const keysPressed: Record<string, boolean> = {}
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      if (
        document.activeElement?.tagName === 'INPUT' || 
        document.activeElement?.tagName === 'TEXTAREA' ||
        (document.activeElement?.getAttribute('contenteditable') === 'true')
      ) {
        return
      }
      
      keysPressed[e.key.toLowerCase()] = true
      
      // Check each shortcut
      for (const [, shortcut] of Object.entries(shortcuts)) {
        const { keys, href } = shortcut
        const match = keys.every(key => {
          if (key === 'meta') {
            return e.metaKey || e.ctrlKey
          }
          return keysPressed[key.toLowerCase()]
        })
        
        if (match) {
          e.preventDefault()
          router.push(href)
          break
        }
      }
    }
    
    const handleKeyUp = (e: KeyboardEvent) => {
      delete keysPressed[e.key.toLowerCase()]
    }
    
    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [isMounted, user, router])
  
  // Update document CSS variables based on auth state
  useEffect(() => {
    if (isMounted) {
      if (user) {
        // Fixed minimized sidebar width
        document.documentElement.style.setProperty('--sidebar-width', '4rem')
        document.documentElement.style.setProperty('--sidebar-padding-md', '4.5rem')
        document.documentElement.style.setProperty('--sidebar-padding-lg', '5rem')
      } else {
        // Reset all spacing when user is not logged in
        document.documentElement.style.setProperty('--sidebar-width', '0')
        document.documentElement.style.setProperty('--sidebar-padding-md', '0')
        document.documentElement.style.setProperty('--sidebar-padding-lg', '0')
      }
    }
  }, [user, isMounted])
  
  // Only render sidebar if user is logged in
  if (!user) {
    return null
  }
  
  if (!isMounted) {
    return (
      <div className="h-full hidden md:block w-16 flex-shrink-0">
        <Box 
          className="fixed left-0 top-16 h-[calc(100vh-64px)] w-16 p-3 border-r border-border bg-background"
          aria-hidden="true"
        >
          <div className="animate-pulse space-y-4">
            <div className="h-10 w-10 mx-auto bg-muted rounded-lg"></div>
            <div className="h-10 w-10 mx-auto bg-muted rounded-lg"></div>
            <div className="h-10 w-10 mx-auto bg-muted rounded-lg"></div>
            <div className="h-10 w-10 mx-auto bg-muted rounded-lg"></div>
          </div>
        </Box>
      </div>
    )
  }
  
  // Mobile menu button (fixed at the bottom left)
  const mobileToggle = (
    <Box 
      className="fixed md:hidden bottom-6 left-6 z-50"
    >
      <IconButton
        aria-label={mobileOpen ? "Close sidebar menu" : "Open sidebar menu"}
        size="lg"
        variant="solid"
        className="shadow-lg bg-primary rounded-full"
        onClick={() => setMobileOpen(!mobileOpen)}
        icon={mobileOpen ? <X size={20} /> : <Menu size={20} />}
      />
    </Box>
  )
  
  const navItems = (
    <Flex 
      className="flex-col h-full gap-3 overflow-y-auto hide-scrollbar items-center"
      aria-label="Main navigation"
    >
      {/* Navigation items for authenticated users */}
      <motion.div 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <NavItem href="/" icon={<Home size={18} />}>
          Home
        </NavItem>
      </motion.div>
      
      {/* <motion.div 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <NavItem href="/create" icon={<PenLine size={18} />}>
          Create
        </NavItem>
      </motion.div> */}

      <motion.div 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <NavItem href="/ideas" icon={<Lightbulb size={18} />}>
          Ideas
        </NavItem>
      </motion.div>
      
      {/* <motion.div 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <NavItem href="/templates" icon={<LayoutGrid size={18} />}>
          Templates
        </NavItem>
      </motion.div> */}
      
      {/* <motion.div 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <NavItem href="/analytics" icon={<BarChart size={18} />}>
          Analytics
        </NavItem>
      </motion.div> */}
      
      {/* Divider */}
      <div className="h-px bg-border/80 w-8 my-1" />
      
      <motion.div 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <NavItem href="/library" icon={<BookOpen size={18} />}>
          Library
        </NavItem>
      </motion.div>
      
      <motion.div 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <NavItem href="/projects" icon={<Folder size={18} />}>
          Projects
        </NavItem>
      </motion.div>
      
      <motion.div 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <NavItem href="/calendar" icon={<Calendar size={18} />}>
          Calendar
        </NavItem>
      </motion.div>
      
      <motion.div 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <NavItem href="/proposals" icon={<FileText size={18} />}>
          Proposals
        </NavItem>
      </motion.div>
      
      {/* Divider */}
      <div className="h-px bg-border/80 w-8 my-1" />
      
      <motion.div 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <NavItem href="/integrations" icon={<Share2 size={18} />}>
          Integrations
        </NavItem>
      </motion.div>
      
      <motion.div 
        whileHover={{ scale: 1.05 }} 
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <NavItem href="/settings" icon={<Settings size={18} />}>
          Settings
        </NavItem>
      </motion.div>
      
      {/* Bottom spacer */}
      <div className="mt-auto h-8"></div>
    </Flex>
  )
  
  // Desktop Sidebar
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="h-full flex-shrink-0 w-16 hidden md:block">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed left-0 top-[64px] h-[calc(100vh-64px)] w-16 bg-background border-r border-border overflow-hidden"
        >
          <Box className="py-4 px-3">
            {navItems}
          </Box>
        </motion.div>
      </div>
      
      {/* Mobile Sidebar (overlay) */}
      <Box 
        className={cn(
          "fixed inset-0 z-40 md:hidden bg-black/50 transition-opacity backdrop-blur-sm",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-hidden="true"
        onClick={() => setMobileOpen(false)}
      />
      
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: mobileOpen ? 0 : "-100%" }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed left-0 top-0 h-full w-[280px] md:hidden bg-background z-50 shadow-xl overflow-y-auto"
      >
        <Box className="p-4 border-b border-border flex items-center justify-between">
          <Link href="/" onClick={() => setMobileOpen(false)} className="flex items-center gap-2">
            <Box className="relative h-7 w-7 rounded-md overflow-hidden">
              <img 
                src="/images/logo.svg" 
                alt="Sparrow Writer"
                width={28} 
                height={28}
                className="object-contain" 
              />
            </Box>
            <Box className="font-semibold text-lg">Sparrow Writer</Box>
          </Link>
          <IconButton
            aria-label="Close sidebar menu"
            size="sm"
            variant="ghost"
            onClick={() => setMobileOpen(false)}
            icon={<X size={18} />}
          />
        </Box>
        <Box className="p-6">
          <Flex className="flex-col gap-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
              <NavItem href="/" icon={<Home size={18} />} onClick={() => setMobileOpen(false)}>
                Home
              </NavItem>
            </motion.div>
            
            {/* <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
              <NavItem href="/create" icon={<PenLine size={18} />} onClick={() => setMobileOpen(false)}>
                Create
              </NavItem>
            </motion.div> */}
            
            {/* <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
              <NavItem href="/templates" icon={<LayoutGrid size={18} />} onClick={() => setMobileOpen(false)}>
                Templates
              </NavItem>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
              <NavItem href="/analytics" icon={<BarChart size={18} />} onClick={() => setMobileOpen(false)}>
                Analytics
              </NavItem>
            </motion.div> */}
            
            {/* Divider */}
            <div className="h-px bg-border/80 my-2" />
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
              <NavItem href="/library" icon={<BookOpen size={18} />} onClick={() => setMobileOpen(false)}>
                Library
              </NavItem>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
              <NavItem href="/projects" icon={<Folder size={18} />} onClick={() => setMobileOpen(false)}>
                Projects
              </NavItem>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
              <NavItem href="/calendar" icon={<Calendar size={18} />} onClick={() => setMobileOpen(false)}>
                Calendar
              </NavItem>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
              <NavItem href="/proposals" icon={<FileText size={18} />} onClick={() => setMobileOpen(false)}>
                Proposals
              </NavItem>
            </motion.div>
            
            {/* Divider */}
            <div className="h-px bg-border/80 my-2" />
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
              <NavItem href="/integrations" icon={<Share2 size={18} />} onClick={() => setMobileOpen(false)}>
                Integrations
              </NavItem>
            </motion.div>
            
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full">
              <NavItem href="/settings" icon={<Settings size={18} />} onClick={() => setMobileOpen(false)}>
                Settings
              </NavItem>
            </motion.div>
          </Flex>
        </Box>
      </motion.div>
      
      {/* Mobile toggle button */}
      {mobileToggle}
    </>
  )
}

