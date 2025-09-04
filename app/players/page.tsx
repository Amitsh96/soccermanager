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
        setPagination(data.pagination.currentPage, data.pagination.totalPages, data.pagination.totalCount)
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

    const positions = ['GK', 'CB', 'LB', 'RB', 'CDM', 'CM', 'CAM', 'LW', 'RW', 'ST']

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Players Catalog</h1>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <form onSubmit={handleSearch} className="flex gap-2">
            <input
              type="text"
              placeholder="Search players..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Search
            </button>
          </form>

          <div className="flex gap-4">
            <select
              value={filters.position}
              onChange={(e) => handleFilterChange('position', e.target.value)}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="">All Positions</option>
              {positions.map((pos) => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Filter by club..."
              value={filters.club}
              onChange={(e) => handleFilterChange('club', e.target.value)}
              className="px-4 py-2 border rounded-lg"
            />

            <button
              onClick={() => {
                setFilters({ search: '', position: '', club: '' })
                setSearchInput('')
              }}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="text-lg">Loading players...</div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Players Grid */}
  {!loading && (
    <div className="players-grid w-full" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1.5rem'
    }}>
      {players.map((player) => (
        <div key={player.id} className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow w-full max-w-sm mx-auto">
          <div className="text-center">
            <h3 className="font-bold text-lg">{player.name}</h3>
            <p className="text-gray-600">{player.position}</p>
            <p className="text-sm text-gray-500">{player.club}</p>
            <p className="text-sm text-gray-500">{player.nationality}</p>
            <div className="mt-2 flex justify-between text-sm">
              <span>Age: {player.age}</span>
              <span className="font-bold text-blue-600">Rating: {player.rating}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            <button
              onClick={() => setPagination(currentPage - 1, totalPages, 0)}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setPagination(currentPage + 1, totalPages, 0)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    )
  }