import type { Metadata } from 'next'
import './globals.css'
import { Inter } from "next/font/google"
import { AuthProvider } from "@/src/context/AuthContext"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Final year project',
  description: '180805003 Olayanju Joseph Computer Science Final Year Project',
  generator: 'Joseph Olayanju',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
