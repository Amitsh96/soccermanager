'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useTeamsStore, Team } from '../../lib/store/teamStore'

export default function MyTeamsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { teams, loading, error, setTeams, setLoading, setError } =
    useTeamsStore()

  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newTeamName, setNewTeamName] = useState('')
  const [createLoading, setCreateLoading] = useState(false)
  const [copiedTeamId, setCopiedTeamId] = useState<string | null>(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  // Fetch teams when component mounts
  useEffect(() => {
    if (session?.user) {
      fetchTeams()
    }
  }, [session])

  const fetchTeams = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/teams')
      if (!response.ok) {
        throw new Error('Failed to fetch teams')
      }

      const data = await response.json()
      setTeams(data.teams)
    } catch (err) {
      setError('Failed to load teams')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTeamName.trim()) return

    setCreateLoading(true)
    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newTeamName.trim(),
          formation: '4-3-3',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create team')
      }

      const data = await response.json()
      setTeams([data.team, ...teams]) // Add to front of list
      setNewTeamName('')
      setShowCreateForm(false)
    } catch (err) {
      setError('Failed to create team')
    } finally {
      setCreateLoading(false)
    }
  }

  const handleDeleteTeam = async (teamId: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${teams.find(t => t.id === teamId)?.name}"? This action cannot be undone.`
      )
    )
      return

    try {
      const response = await fetch(`/api/teams/${teamId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete team')
      }

      setTeams(teams.filter(team => team.id !== teamId))
    } catch (err) {
      setError('Failed to delete team')
    }
  }

  const handleShareTeam = async (teamId: string) => {
    try {
      const publicUrl = `${window.location.origin}/teams/${teamId}/public`
      await navigator.clipboard.writeText(publicUrl)
      setCopiedTeamId(teamId)

      // Clear the copied state after 2 seconds
      setTimeout(() => setCopiedTeamId(null), 2000)
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea')
      textArea.value = `${window.location.origin}/teams/${teamId}/public`
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)

      setCopiedTeamId(teamId)
      setTimeout(() => setCopiedTeamId(null), 2000)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to login
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex items-center">
            <div className="w-12 h-12 football-gradient rounded-2xl flex items-center justify-center mr-4">
              <span className="text-2xl">🏆</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">My Teams</h1>
              <p className="text-gray-600 mt-1">
                Manage and build your soccer teams
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary"
          >
            <span className="mr-2">⚽</span>
            Create New Team
          </button>
        </div>
      </div>

      {/* Create Team Form */}
      {showCreateForm && (
        <div className="mb-12 football-card p-8 fade-in">
          <div className="flex items-center mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mr-3">
              <span className="text-xl">✨</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Create New Team
            </h2>
          </div>

          <form onSubmit={handleCreateTeam} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Team Name
              </label>
              <input
                type="text"
                placeholder="Enter your team name..."
                value={newTeamName}
                onChange={e => setNewTeamName(e.target.value)}
                className="stadium-input"
                required
                maxLength={50}
              />
              <p className="mt-2 text-sm text-gray-500">
                Choose a unique name that represents your team&apos;s identity
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={createLoading || !newTeamName.trim()}
                className="btn-success disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createLoading ? (
                  <>
                    <span className="mr-2">⏳</span>
                    Creating Team...
                  </>
                ) : (
                  <>
                    <span className="mr-2">🚀</span>
                    Create Team
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false)
                  setNewTeamName('')
                }}
                className="btn-secondary"
              >
                <span className="mr-2">❌</span>
                Cancel
              </button>
            </div>
          </form>
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
              Error Loading Teams
            </h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={fetchTeams} className="btn-secondary">
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="teams-grid">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="football-card p-8">
              <div className="animate-pulse">
                <div className="flex items-center justify-between mb-6">
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                  <div className="h-4 bg-gray-200 rounded w-28"></div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                  <div className="h-8 bg-gray-200 rounded w-24"></div>
                  <div className="h-8 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Teams List */}
      {!loading && !error && (
        <>
          {teams.length === 0 ? (
            <div className="text-center py-16">
              <div className="football-card p-12 max-w-lg mx-auto">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <span className="text-4xl">⚽</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-700 mb-4">
                  No Teams Yet
                </h2>
                <p className="text-gray-500 mb-8 leading-relaxed">
                  Ready to create your first team? Start building your dream
                  squad and show off your tactical genius!
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn-primary"
                >
                  <span className="mr-2">🚀</span>
                  Create Your First Team
                </button>
              </div>
            </div>
          ) : (
            <div className="teams-grid fade-in">
              {teams.map(team => {
                const playersCount = team.teamPlayers?.length || 0
                const isComplete = playersCount === 11

                return (
                  <div
                    key={team.id}
                    className="football-card card-hover p-8 relative overflow-hidden"
                  >
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteTeam(team.id)}
                      className="absolute top-4 right-4 w-8 h-8 bg-red-50 hover:bg-red-100 rounded-full flex items-center justify-center text-red-600 hover:text-red-700 transition-all duration-300 opacity-70 hover:opacity-100"
                      title="Delete team"
                    >
                      <span className="text-sm">🗑️</span>
                    </button>

                    {/* Team Header */}
                    <div className="mb-6">
                      <div className="flex items-center mb-3">
                        <div className="w-12 h-12 football-gradient rounded-xl flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-lg">
                            {team.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 leading-tight">
                            {team.name}
                          </h3>
                          <div
                            className={`inline-flex px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                              isComplete ? 'status-success' : 'status-warning'
                            }`}
                          >
                            {isComplete ? '✅ Complete' : '⚠️ Incomplete'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Team Stats */}
                    <div className="space-y-4 mb-8">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-gray-50 rounded-xl p-3">
                          <div className="text-lg font-bold text-gray-900">
                            {team.formation}
                          </div>
                          <div className="text-sm text-gray-500">Formation</div>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-3">
                          <div className="text-lg font-bold text-gray-900">
                            {playersCount}/11
                          </div>
                          <div className="text-sm text-gray-500">Players</div>
                        </div>
                      </div>

                      <div className="text-center">
                        <p className="text-sm text-gray-500">
                          Created{' '}
                          {new Date(team.createdAt).toLocaleDateString(
                            'en-US',
                            {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            }
                          )}
                        </p>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="football-gradient h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(playersCount / 11) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <Link
                          href={`/teams/${team.id}/public`}
                          className="btn-secondary !py-2 text-sm text-center"
                        >
                          <span className="mr-1">👁️</span>
                          View
                        </Link>
                        <Link
                          href={`/teams/${team.id}/edit`}
                          className="btn-secondary !py-2 text-sm text-center"
                        >
                          <span className="mr-1">✏️</span>
                          Edit
                        </Link>
                      </div>

                      <Link
                        href={`/teams/${team.id}/build`}
                        className="w-full btn-primary !py-3 text-center block"
                      >
                        <span className="mr-2">⚽</span>
                        Build Formation
                      </Link>

                      <button
                        onClick={() => handleShareTeam(team.id)}
                        className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:from-purple-600 hover:to-blue-600 transition-all duration-300 font-medium text-sm"
                      >
                        {copiedTeamId === team.id ? (
                          <>
                            <span className="mr-2">✅</span>
                            Link Copied!
                          </>
                        ) : (
                          <>
                            <span className="mr-2">🔗</span>
                            Share Team
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}
