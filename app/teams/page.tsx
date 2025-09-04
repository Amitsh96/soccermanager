'use client'

  import { useEffect, useState } from 'react'
  import { useSession } from 'next-auth/react'
  import { useRouter } from 'next/navigation'
  import Link from 'next/link'
  import { useTeamsStore, Team } from '../../lib/store/teamStore'

  export default function MyTeamsPage() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const {
      teams,
      loading,
      error,
      setTeams,
      setLoading,
      setError,
    } = useTeamsStore()

    const [showCreateForm, setShowCreateForm] = useState(false)
    const [newTeamName, setNewTeamName] = useState('')
    const [createLoading, setCreateLoading] = useState(false)

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
      if (!window.confirm(`Are you sure you want to delete "${teams.find(t => t.id === teamId)?.name}"? This action cannot be undone.`)) return

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

    if (status === 'loading') {
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    if (!session) {
      return null // Will redirect to login
    }

    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Teams</h1>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Create Team
          </button>
        </div>

        {/* Create Team Form */}
        {showCreateForm && (
          <div className="mb-8 bg-white border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Create New Team</h2>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Team name"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                  maxLength={50}
                />
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={createLoading || !newTeamName.trim()}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {createLoading ? 'Creating...' : 'Create Team'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false)
                    setNewTeamName('')
                  }}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="text-lg">Loading teams...</div>
          </div>
        )}

        {/* Teams List */}
        {!loading && (
          <>
            {teams.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <h2 className="text-xl text-gray-600 mb-4">No teams yet</h2>
                <p className="text-gray-500 mb-6">Create your first team to get started!</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Create Your First Team
                </button>
              </div>
            ) : (
              <div className="teams-grid w-full gap-6" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                {teams.map((team) => (
                  <div key={team.id} className="bg-white border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold">{team.name}</h3>
                      <button
                        onClick={() => handleDeleteTeam(team.id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-600">Formation: {team.formation}</p>
                      <p className="text-sm text-gray-600">
                        Players: {team.teamPlayers?.length || 0}/11
                      </p>
                      <p className="text-sm text-gray-500">
                        Created: {new Date(team.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        href={`/teams/${team.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                      >
                        View Team
                      </Link>
                      <Link
                        href={`/teams/${team.id}/edit`}
                        className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-700"
                      >
                        Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    )
  }