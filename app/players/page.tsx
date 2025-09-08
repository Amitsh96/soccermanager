'use client'

import { useEffect, useState } from 'react'
import { usePlayersStore } from '../../lib/store/playersStore'

export default function PlayersPage() {
  const {
    players,
    loading,
    error,
    currentPage,
    totalPages,
    filters,
    setPlayers,
    setLoading,
    setError,
    setPagination,
    setFilters,
  } = usePlayersStore()

  const [searchInput, setSearchInput] = useState('')

  const fetchPlayers = async () => {
    setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...(filters.search && { search: filters.search }),
        ...(filters.position && { position: filters.position }),
        ...(filters.club && { club: filters.club }),
      })

      const response = await fetch(`/api/players?${params}`)
      if (!response.ok) throw new Error('Failed to fetch players')

      const data = await response.json()
      setPlayers(data.players)
      setPagination(
        data.pagination.currentPage,
        data.pagination.totalPages,
        data.pagination.totalCount
      )
    } catch (err) {
      setError('Failed to load players')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlayers()
  }, [currentPage, filters])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setFilters({ search: searchInput })
    setPagination(1, totalPages, 0) // Reset to page 1
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ [key]: value })
    setPagination(1, totalPages, 0) // Reset to page 1
  }

  const positions = [
    'GK',
    'CB',
    'LB',
    'RB',
    'CDM',
    'CM',
    'CAM',
    'LW',
    'RW',
    'ST',
  ]

  const getPositionColor = (position: string) => {
    const colorMap: { [key: string]: string } = {
      'GK': 'bg-yellow-100 text-yellow-800',
      'CB': 'bg-blue-100 text-blue-800',
      'LB': 'bg-blue-100 text-blue-800',
      'RB': 'bg-blue-100 text-blue-800',
      'CDM': 'bg-purple-100 text-purple-800',
      'CM': 'bg-green-100 text-green-800',
      'CAM': 'bg-green-100 text-green-800',
      'LW': 'bg-red-100 text-red-800',
      'RW': 'bg-red-100 text-red-800',
      'ST': 'bg-orange-100 text-orange-800',
    }
    return colorMap[position] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 football-gradient rounded-2xl flex items-center justify-center mr-4">
            <span className="text-2xl">⚽</span>
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Players Catalog</h1>
            <p className="text-gray-600 mt-1">Discover and scout players for your dream team</p>
          </div>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="football-card p-6 mb-8">
        <div className="space-y-6">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 text-xl">🔍</span>
              </div>
              <input
                type="text"
                placeholder="Search players by name..."
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                className="stadium-input pl-12"
              />
            </div>
            <button
              type="submit"
              className="btn-primary whitespace-nowrap"
            >
              <span className="mr-2">🎯</span>
              Search
            </button>
          </form>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-4">
            {/* Position Filter */}
            <div className="relative">
              <select
                value={filters.position || ''}
                onChange={e => handleFilterChange('position', e.target.value)}
                className="stadium-input pr-10 min-w-[140px] appearance-none cursor-pointer"
              >
                <option value="">All Positions</option>
                {positions.map(pos => (
                  <option key={pos} value={pos}>{pos}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span className="text-gray-500">⚽</span>
              </div>
            </div>

            {/* Club Filter */}
            <div className="relative">
              <input
                type="text"
                placeholder="Filter by club..."
                value={filters.club || ''}
                onChange={e => handleFilterChange('club', e.target.value)}
                className="stadium-input min-w-[160px]"
              />
            </div>

            {/* Clear Filters */}
            {(filters.search || filters.position || filters.club) && (
              <button
                onClick={() => {
                  setFilters({})
                  setSearchInput('')
                  setPagination(1, totalPages, 0)
                }}
                className="px-4 py-2 text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors duration-300 font-medium"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Summary */}
      {!loading && (
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{players.length}</span> players
            {(filters.search || filters.position || filters.club) && (
              <span className="ml-1">
                matching your search criteria
              </span>
            )}
          </p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="football-card p-8 mb-8 bg-red-50 border-red-200">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-red-800 mb-2">
              Unable to Load Players
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={fetchPlayers}
              className="btn-secondary"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="players-grid">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="football-card p-6">
              <div className="animate-pulse">
                <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Players Grid */}
      {!loading && !error && (
        <>
          {players.length === 0 ? (
            <div className="text-center py-16">
              <div className="football-card p-12 max-w-md mx-auto">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🔍</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-3">
                  No Players Found
                </h3>
                <p className="text-gray-500 mb-6">
                  Try adjusting your search criteria or filters to find more players.
                </p>
                <button
                  onClick={() => {
                    setFilters({})
                    setSearchInput('')
                    setPagination(1, totalPages, 0)
                  }}
                  className="btn-secondary"
                >
                  Clear All Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="players-grid fade-in">
              {players.map(player => (
                <div key={player.id} className="football-card card-hover p-6">
                  {/* Player Avatar */}
                  <div className="text-center mb-6">
                    <div className="w-20 h-20 mx-auto mb-4 football-gradient rounded-full flex items-center justify-center text-2xl text-white font-bold shadow-lg">
                      {player.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getPositionColor(player.position)}`}>
                      {player.position}
                    </div>
                  </div>

                  {/* Player Info */}
                  <div className="text-center space-y-3">
                    <h3 className="font-bold text-lg text-gray-900 leading-tight">
                      {player.name}
                    </h3>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-center text-gray-600">
                        <span className="mr-2">🏟️</span>
                        <span>{player.club}</span>
                      </div>
                      
                      <div className="flex items-center justify-center text-gray-600">
                        <span className="mr-2">🌍</span>
                        <span>{player.nationality}</span>
                      </div>
                    </div>

                    {/* Stats Preview */}
                    <div className="pt-4 border-t border-gray-100">
                      <div className="grid grid-cols-3 gap-4 text-center text-sm">
                        <div>
                          <div className="font-semibold text-green-600">{player.rating}</div>
                          <div className="text-gray-500">Rating</div>
                        </div>
                        <div>
                          <div className="font-semibold text-blue-600">{player.age}</div>
                          <div className="text-gray-500">Age</div>
                        </div>
                        <div>
                          <div className="font-semibold text-purple-600">
                            {player.position === 'GK' ? player.diving : player.pace}
                          </div>
                          <div className="text-gray-500">
                            {player.position === 'GK' ? 'Diving' : 'Pace'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4">
                      <button className="w-full btn-secondary !py-2 text-sm">
                        <span className="mr-2">👁️</span>
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Pagination */}
      {!loading && !error && totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <div className="football-card p-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setPagination(currentPage - 1, totalPages, 0)}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Previous
              </button>
              
              <div className="flex space-x-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const page = i + 1
                  return (
                    <button
                      key={page}
                      onClick={() => setPagination(page, totalPages, 0)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                        currentPage === page
                          ? 'football-gradient text-white'
                          : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
              </div>

              <button
                onClick={() => setPagination(currentPage + 1, totalPages, 0)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg font-medium transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
