'use client'

import Link from 'next/link'
import Image from 'next/image'
import { User, Settings, LogOut } from 'lucide-react'
import { useAuth } from '@/context/auth-provider'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Box, 
  Flex,
  Button,
  Text
} from '@sparrowengg/twigs-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  const { logout, user } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  
  const isHomePage = pathname === '/'
  const isCreatePage = pathname === '/create'
  const isTemplatesPage = pathname === '/templates'
  const isLibraryPage = pathname === '/library'
  const isAnalyticsPage = pathname === '/analytics'
  const isProjectsPage = pathname === '/projects'
  const isSettingsPage = pathname === '/settings'
  const isLoginPage = pathname === '/login'
  
  const getPageTitle = () => {
    if (isHomePage) return 'Sparrow Writer'
    if (isCreatePage) return 'Create Content'
    if (isTemplatesPage) return 'Templates'
    if (isLibraryPage) return 'Library'
    if (isAnalyticsPage) return 'Analytics'
    if (isProjectsPage) return 'Projects'
    if (isSettingsPage) return 'Settings'
    if (isLoginPage) return 'Login'
    return 'Sparrow Writer'
  }
  
  // Avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true)
    // Update document title
    document.title = getPageTitle()
  }, [pathname])
  
  const handleLogout = () => {
    logout()
  }

  const handleLogin = () => {
    router.push('/login')
  }
  
  // Only show complete header after hydration
  if (!isMounted) {
    return (
      <Box
        as="header"
        className="fixed top-0 left-0 right-0 h-16 z-40 border-b border-border/50 bg-background/95 backdrop-blur-md"
      >
        <Flex 
          className="max-w-[1400px] mx-auto h-full items-center justify-between px-4 md:px-6"
        >
          <Flex className="items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <Box className="relative h-8 w-8 rounded-md animate-pulse overflow-hidden">
                <Image
                  src="/images/logo.svg" 
                  alt="Sparrow Writer" 
                  width={32} 
                  height={32} 
                  className="object-contain opacity-70" 
                />
              </Box>
              <span className="font-semibold text-lg">Sparrow Writer</span>
            </Link>
          </Flex>
          <Flex className="items-center gap-2">
            <Box 
              className="w-8 h-8 rounded-full bg-muted animate-pulse" 
            />
          </Flex>
        </Flex>
      </Box>
    )
  }

  return (
    <Box
      as="header"
      className={`fixed top-0 left-0 right-0 h-16 z-40 transition-all duration-200 border-b border-border/70 bg-background/95 backdrop-blur-md shadow-sm`}
    >
      <Flex 
        className="mx-auto h-full items-center justify-between px-5 md:px-8 ms-0 me-0"
      >
        {/* Logo and Brand */}
        <Link 
          href="/" 
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
          aria-label="Sparrow Writer Home"
        >
          <Box className="relative w-8 overflow-hidden rounded-md">
            <Image 
              src="/images/logo.svg" 
              alt="Sparrow Writer" 
              width={32} 
              height={32}
              className="object-contain" 
              aria-hidden="true"
            />
          </Box>
          <Box 
            as="span" 
            className="font-semibold text-lg tracking-tight"
          >
            Sparrow Writer
          </Box>
        </Link>

        {/* Right side actions */}
        <Flex className="items-center gap-3 md:gap-4">
          {user ? (
            // Authenticated UI
            <>
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Box 
                    as="button"
                    className="flex items-center justify-center rounded-full overflow-hidden hover:ring-2 hover:ring-primary/10 transition-all focus:outline-none focus:ring-2 focus:ring-primary/20"
                    aria-label="User menu"
                  >
                    <Image 
                      src={user?.photoURL || 'https://ui-avatars.com/api/?name=User&background=random'}
                      alt=""
                      width={32}
                      height={32}
                      className="rounded-full w-8 h-8 border border-border"
                    />
                  </Box>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <div className="p-3 border-b">
                    <p className="text-sm font-medium">{user?.displayName || "User"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email || "user@example.com"}</p>
                  </div>
                  
                  <DropdownMenuItem 
                    className="cursor-pointer focus:bg-muted focus:text-foreground"
                    onClick={() => router.push('/settings/profile')}
                  >
                    <User className="mr-2 h-4 w-4" />
                    <Text>Profile</Text>
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="cursor-pointer focus:bg-muted focus:text-foreground"
                    onClick={() => router.push('/settings')}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <Text>Settings</Text>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem 
                    className="cursor-pointer focus:bg-destructive/10 focus:text-destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <Text>Logout</Text>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            // Non-authenticated UI
            <Button 
              variant="primary"
              size="sm"
              className="rounded-md px-4 py-1.5 h-8 bg-teal-600 hover:bg-teal-700 active:bg-teal-800 text-white border-0 transition-colors duration-200 shadow-sm"
              onClick={handleLogin}
            >
              <Flex className="items-center justify-center">
                <Text className="font-medium text-sm">Login</Text>
              </Flex>
            </Button>
          )}

          {/* Theme Toggle - always visible */}
          {/* <ThemeToggle /> */}
        </Flex>
      </Flex>
    </Box>
  )
}

