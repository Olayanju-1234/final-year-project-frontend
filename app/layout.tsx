import type { Metadata } from 'next'
import './globals.css'
import { Inter } from "next/font/google"
import { AuthProvider } from "@/src/context/AuthContext"
import { Toaster } from "@/components/ui/toaster"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { AuthLoader } from "@/components/ui/auth-loader"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'RentMatch - Linear Programming Optimization',
  description: 'Final Year Project: Linear Programming Optimization for Tenant-Property Matching in Nigeria',
  keywords: ['rental', 'property', 'optimization', 'linear programming', 'Nigeria', 'final year project'],
  authors: [{ name: 'Joseph Olayanju' }],
  creator: 'Joseph Olayanju',
  publisher: 'University Final Year Project',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'RentMatch - Linear Programming Optimization',
    description: 'Final Year Project: Linear Programming Optimization for Tenant-Property Matching',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RentMatch - Linear Programming Optimization',
    description: 'Final Year Project: Linear Programming Optimization for Tenant-Property Matching',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <AuthLoader>
              {children}
              <Toaster />
            </AuthLoader>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
