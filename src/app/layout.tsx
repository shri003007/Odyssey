import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/context/auth-provider";
import { ContentProvider } from "@/context/content-provider";
import { SocialIntegrationProvider } from "@/context/social-integration-provider";
import { NavSidebar } from "@/components/nav-sidebar";
import { Header } from "@/components/header";
import "./outline-editor.css";
import KeyboardShortcutIndicator from "@/components/keyboard-shortcut-indicator";
import KeyboardShortcutHelp from "@/components/keyboard-shortcut-help";
import { ClientProvider } from "@/redux/ClientProvider";
import DataFetcher from "@/components/DataFetcher";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ContentMaster - Content Management",
  description: "Manage your content and schedule effectively",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
        />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/images/logo.svg" type="image/svg+xml" />
        <style>
          {`
            :root {
              --sidebar-width: 0;
              --sidebar-padding-md: 0;
              --sidebar-padding-lg: 0;
              --header-height: 64px;
            }

            body {
              overflow-x: hidden;
            }

            @media (min-width: 768px) {
              main {
                // padding-left: var(--sidebar-padding-md) !important;
                transition: padding-left 0.3s ease;
              }
            }
            
            @media (min-width: 1024px) {
              main {
                // padding-left: var(--sidebar-padding-lg) !important;
                transition: padding-left 0.3s ease;
              }
            }

            .content-container {
              width: 100%;
              max-width: 100%;
              margin: 0 auto;
              transition: all 0.3s ease;
            }
          `}
        </style>
      </head>
      <body className={inter.className}>
        <ClientProvider>
          <AuthProvider>
            <DataFetcher>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <SocialIntegrationProvider>
                  <ContentProvider>
                    <div className="min-h-screen bg-background flex flex-col">
                      <Header />
                      <div className="flex flex-grow min-h-[calc(100vh-var(--header-height))]">
                        <NavSidebar />
                        <main className="flex-1 transition-all duration-300 overflow-x-hidden pt-16 md:pt-22 pb-16 px-4 md:px-6 lg:px-8">
                          <div className="content-container">{children}</div>
                        </main>
                      </div>
                      {/* Keyboard shortcut indicator */}
                      <KeyboardShortcutIndicator />
                      {/* Keyboard shortcut help dialog */}
                      <KeyboardShortcutHelp />
                    </div>
                    <Toaster />
                  </ContentProvider>
                </SocialIntegrationProvider>
              </ThemeProvider>
            </DataFetcher>
          </AuthProvider>
        </ClientProvider>
      </body>
    </html>
  );
}
