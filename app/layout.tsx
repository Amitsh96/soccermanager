import './globals.css'
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth'
import SessionProvider from './components/SessionProvider'
import Navigation from './components/Navigation'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Soccer Manager - Build Your Dream Team',
  description: 'Professional soccer team management webapp. Build formations, manage players, and share your teams with the world.',
  keywords: 'soccer, football, team manager, formation, players, sports',
  authors: [{ name: 'Soccer Manager' }],
  creator: 'Soccer Manager',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Soccer Manager - Build Your Dream Team',
    description: 'Professional soccer team management webapp. Build formations, manage players, and share your teams.',
    siteName: 'Soccer Manager',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Soccer Manager - Build Your Dream Team',
    description: 'Professional soccer team management webapp. Build formations, manage players, and share your teams.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession()

  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>
        <SessionProvider session={session}>
          <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50">
            <Navigation />
            <main className="pt-16">
              {children}
            </main>
          </div>
        </SessionProvider>
      </body>
    </html>
  )
}
