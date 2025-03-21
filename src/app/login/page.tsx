'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/context/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardFooter } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Box, Text, Heading } from '@sparrowengg/twigs-react'
import { motion } from 'framer-motion'

export default function Login() {
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { signInWithGoogle, user } = useAuth()
  const router = useRouter()

  // Handle redirect if user is already logged in
  useEffect(() => {
    setMounted(true)
    if (user) {
      router.push('/create')
    }
  }, [user, router])

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true)
      await signInWithGoogle()
    } catch (err) {
      console.error('Sign-in error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) {
    return null // Prevent flash of login page if already authenticated
  }

  return (
    <Box 
      as={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/30 px-4 py-10"
    >
      <Box className="absolute inset-0 bg-grid-pattern opacity-5 bg-center pointer-events-none" />
      
      <Box className="w-full max-w-md z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Card className="backdrop-blur-sm border-border/60 overflow-hidden shadow-xl">
            <CardHeader className="px-6 pt-8 pb-5 text-center">
              <Box className="mx-auto mb-5 p-3 rounded-xl bg-primary/10 w-fit">
                <Image 
                  src="/images/logo.svg" 
                  alt="Sparrow Writer Logo"
                  width={48} 
                  height={48}
                  className="h-12 w-12"
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    const target = e.currentTarget;
                    target.src = '/images/logo.svg';
                    if (target.src.includes('/images/logo.svg')) {
                      target.onerror = null;
                    }
                  }}
                />
              </Box>
              <Heading as="h1" className="text-2xl md:text-3xl font-bold mb-2.5">
                Welcome to Sparrow Writer
              </Heading>
              <Text className="text-muted-foreground">
                Sign in to start creating amazing content
              </Text>
            </CardHeader>

            <CardContent className="p-6 space-y-5">
              <Button
                type="button"
                size="lg"
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full h-14 text-base font-medium transition-all duration-200 hover:border-primary hover:bg-primary/5 flex items-center justify-center gap-2.5"
                aria-label="Sign in with Google"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <svg
                    className="h-5 w-5 text-primary"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="google"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 488 512"
                  >
                    <path
                      fill="currentColor"
                      d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                    ></path>
                  </svg>
                )}
                <span>{loading ? "Signing in..." : "Sign in with Google"}</span>
              </Button>

              {/* <Flex className="items-center justify-center gap-3">
                <div className="h-px flex-1 bg-border"></div>
                <Text className="text-xs text-muted-foreground font-medium">OR</Text>
                <div className="h-px flex-1 bg-border"></div>
              </Flex>

              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="w-full h-14 text-base font-medium transition-all duration-200 flex items-center justify-center"
                onClick={() => router.push('/demo')}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Continue as Guest
              </Button> */}
            </CardContent>

            <CardFooter className="px-6 py-4 bg-muted/30 border-t border-border text-center">
              <Text className="text-sm text-muted-foreground w-full">
                New to Sparrow Writer?{' '}
                <Link href="/about" className="text-primary font-medium hover:underline">
                  Learn more about our platform
                </Link>
              </Text>
            </CardFooter>
          </Card>
        </motion.div>

        <Box 
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 text-center text-sm text-muted-foreground"
        >
          <Text className="flex flex-wrap items-center justify-center gap-1">
            By signing in, you agree to our
            <Link href="/terms" className="text-primary hover:underline">Terms of Service</Link>
            and
            <Link href="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
          </Text>
        </Box>
      </Box>
    </Box>
  )
}
