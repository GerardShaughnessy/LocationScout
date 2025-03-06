import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/layout/Navbar'
import LeafletHead from './components/map/LeafletHead'
import 'leaflet/dist/leaflet.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LocationScout',
  description: 'Find and share the perfect locations for your next project',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <title>LocationScout</title>
        <meta name="description" content="Find and share the perfect locations for your next project" />
        <link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="16x16" />
        <LeafletHead />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
} 