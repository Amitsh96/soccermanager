'use client'

import Link from 'next/link'
import { useSession } from 'next-auth/react'

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="soccer-field w-full h-full">
            <div className="field-lines">
              {/* Center Circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-white rounded-full opacity-30"></div>
              {/* Center Line */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-white opacity-30"></div>
              {/* Goal Areas */}
              <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-16 h-24 border-2 border-r-0 border-white opacity-30"></div>
              <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-16 h-24 border-2 border-l-0 border-white opacity-30"></div>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          <div className="fade-in">
            {/* Logo/Icon */}
            <div className="inline-flex items-center justify-center w-24 h-24 football-gradient rounded-3xl mb-8 shadow-2xl">
              <span className="text-4xl">⚽</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Build Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-green-400">
                Dream Team
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Professional soccer team management made simple. Create
              formations, manage players, and share your tactical masterpieces
              with the world.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              {session ? (
                <>
                  <Link href="/teams" className="btn-primary">
                    <span className="mr-2">🏆</span>
                    Manage My Teams
                  </Link>
                  <Link href="/players" className="btn-secondary">
                    <span className="mr-2">⚽</span>
                    Browse Players
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/auth/signup" className="btn-primary">
                    <span className="mr-2">🚀</span>
                    Get Started Free
                  </Link>
                  <Link href="/auth/login" className="btn-secondary">
                    <span className="mr-2">👋</span>
                    Welcome Back
                  </Link>
                </>
              )}
            </div>

            {/* Feature Preview Cards */}
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="football-card p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">👥</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Player Management
                </h3>
                <p className="text-gray-600 text-sm">
                  Browse and search through hundreds of players with detailed
                  stats and positions.
                </p>
              </div>

              <div className="football-card p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">⚽</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Formation Builder
                </h3>
                <p className="text-gray-600 text-sm">
                  Create tactical formations with our interactive field
                  visualization and position system.
                </p>
              </div>

              <div className="football-card p-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl">🌐</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Share Teams</h3>
                <p className="text-gray-600 text-sm">
                  Share your team formations with friends and the community with
                  public links.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-4 h-4 bg-green-400 rounded-full animate-pulse opacity-60"></div>
        <div
          className="absolute top-40 right-20 w-6 h-6 bg-yellow-400 rounded-full animate-pulse opacity-60"
          style={{ animationDelay: '1s' }}
        ></div>
        <div
          className="absolute bottom-32 left-20 w-3 h-3 bg-green-500 rounded-full animate-pulse opacity-60"
          style={{ animationDelay: '2s' }}
        ></div>
        <div
          className="absolute bottom-20 right-10 w-5 h-5 bg-blue-400 rounded-full animate-pulse opacity-60"
          style={{ animationDelay: '0.5s' }}
        ></div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Your Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From player scouting to tactical formations, we&apos;ve got all
              the tools you need to create and manage your perfect soccer team.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Feature 1 */}
            <div>
              <div className="w-20 h-20 football-gradient rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">🏟️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Interactive Formation Builder
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Design your tactical setup with our realistic soccer field
                visualization. Choose from popular formations like 4-3-3, 4-4-2,
                or create your own custom setup.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Multiple formation templates
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Drag & drop player positioning
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Position compatibility checking
                </li>
              </ul>
            </div>

            {/* Visual Placeholder */}
            <div className="football-card p-8">
              <div className="soccer-field aspect-video rounded-xl relative">
                <div className="field-lines">
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white rounded-full"></div>
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-white"></div>
                </div>
                <div className="absolute inset-4 flex items-center justify-center">
                  <span className="text-white text-lg font-semibold bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm">
                    Interactive Field Preview
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Placeholder */}
            <div className="md:order-3 football-card p-8">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { name: 'Messi', position: 'RW', club: 'PSG', rating: '93' },
                  {
                    name: 'Haaland',
                    position: 'ST',
                    club: 'City',
                    rating: '88',
                  },
                  { name: 'Mbappé', position: 'LW', club: 'PSG', rating: '91' },
                  {
                    name: 'De Bruyne',
                    position: 'CM',
                    club: 'City',
                    rating: '91',
                  },
                ].map((player, i) => (
                  <div
                    key={i}
                    className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-4 text-center shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full mx-auto mb-2 flex items-center justify-center text-white shadow-lg">
                      <span className="text-xs font-bold">{player.rating}</span>
                    </div>
                    <p className="text-sm font-semibold text-gray-800 truncate">
                      {player.name}
                    </p>
                    <p className="text-xs text-gray-500 mb-1">{player.club}</p>
                    <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      {player.position}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-center text-sm text-gray-500 mt-4">
                Player Catalog Preview
              </p>
            </div>

            {/* Feature 2 */}
            <div className="md:order-2">
              <div className="w-20 h-20 football-gradient rounded-2xl flex items-center justify-center mb-6">
                <span className="text-3xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Comprehensive Player Database
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Access detailed player information with advanced filtering and
                search capabilities. Find the perfect players for each position
                in your formation.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Search by name, position, or club
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Detailed player statistics
                </li>
                <li className="flex items-center">
                  <span className="text-green-600 mr-2">✓</span>
                  Position compatibility system
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 football-gradient">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Build Your Dream Team?
          </h2>
          <p className="text-xl text-green-100 mb-10 max-w-2xl mx-auto">
            Join thousands of soccer enthusiasts who are already creating and
            sharing their tactical masterpieces.
          </p>
          {!session && (
            <Link
              href="/auth/signup"
              className="btn-success !bg-white !text-green-600 hover:!bg-gray-100"
            >
              <span className="mr-2">🚀</span>
              Start Building Now - It&apos;s Free!
            </Link>
          )}
        </div>
      </section>
    </div>
  )
}
