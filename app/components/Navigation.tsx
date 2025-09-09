'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'

const Navigation = () => {
  const { data: session } = useSession()
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true
    if (href !== '/' && pathname.startsWith(href)) return true
    return false
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '64px',
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            textDecoration: 'none',
            fontSize: '1.25rem',
            fontWeight: 'bold',
            color: '#1b5e20',
          }}
        >
          <div
            style={{
              width: '40px',
              height: '40px',
              background:
                'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #4caf50 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.25rem',
            }}
          >
            ⚽
          </div>
          Soccer Manager
        </Link>

        {/* Navigation Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link
            href="/players"
            className={isActive('/players') ? 'nav-active' : 'nav-link'}
          >
            Players
          </Link>

          {session && (
            <Link
              href="/teams"
              className={isActive('/teams') ? 'nav-active' : 'nav-link'}
            >
              My Teams
            </Link>
          )}

          {/* Auth Section */}
          {session ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginLeft: '1rem',
                paddingLeft: '1rem',
                borderLeft: '1px solid #e5e7eb',
              }}
            >
              <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                {session.user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="btn-secondary"
                style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginLeft: '1rem',
                paddingLeft: '1rem',
                borderLeft: '1px solid #e5e7eb',
              }}
            >
              <Link
                href="/auth/login"
                className="btn-secondary"
                style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
              >
                Sign In
              </Link>
              <Link
                href="/auth/signup"
                className="btn-primary"
                style={{ fontSize: '0.875rem', padding: '0.5rem 1rem' }}
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
