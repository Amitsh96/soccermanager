import './globals.css'
  import { Inter } from 'next/font/google'
  import { getServerSession } from 'next-auth'
  import SessionProvider from './components/SessionProvider'

  const inter = Inter({ subsets: ['latin'] })

  export const metadata = {
    title: 'Soccer Manager',
    description: 'Build and manage your dream soccer team',
  }

  export default async function RootLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    const session = await getServerSession()

    return (
      <html lang="en">
        <body className={inter.className}>
          <SessionProvider session={session}>
            {children}
          </SessionProvider>
        </body>
      </html>
    )
  }