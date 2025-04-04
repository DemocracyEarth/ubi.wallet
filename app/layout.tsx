import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import NavBar from "@/components/nav-bar"
import DemoWarningBanner from "@/components/demo-warning-banner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ubi.eth",
  description: "Decentralized Universal Basic Income platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-black text-white antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <div className="flex min-h-screen flex-col">
            <DemoWarningBanner />
            <div className="flex-1 pb-20">{children}</div>
            <NavBar />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'