'use client'

  import { useEffect, useState } from 'react'
  import { useSession } from 'next-auth/react'
  import { useRouter } from 'next/navigation'
  import { useTeamsStore, Team } from '../../../../lib/store/teamStore'

  export default function EditTeamPage({ params }: { params: { id: string } }) {
    const { data: session, status } = useSession()
    const router = useRouter()
    const { updateTeam } = useTeamsStore()

    const [team, setTeam] = useState<Team | null>(null)
    const [name, setName] = useState('')
    const [formation, setFormation] = useState('4-3-3')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const formations = ['4-3-3', '4-4-2', '3-5-2', '4-2-3-1', '5-3-2']

    // Redirect if not authenticated
    useEffect(() => {
      if (status === 'unauthenticated') {
        router.push('/auth/login')
      }
    }, [status, router])

    // Fetch team data
    useEffect(() => {
      if (session?.user && params.id) {
        fetchTeam()
      }
    }, [session, params.id])

    const fetchTeam = async () => {
      try {
        const response = await fetch(`/api/teams/${params.id}`)

        if (response.status === 404) {
          router.push('/teams')
          return
        }

        if (!response.ok) {
          throw new Error('Failed to fetch team')
        }

        const data = await response.json()
        setTeam(data.team)
        setName(data.team.name)
        setFormation(data.team.formation)
      } catch (err) {
        setError('Failed to load team')
      } finally {
        setLoading(false)
      }
    }

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
      if (!name.trim()) return

      setSaving(true)
      setError(null)

      try {
        const response = await fetch(`/api/teams/${params.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            formation,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to update team')
        }

        const data = await response.json()
        updateTeam(params.id, data.team)

        // Redirect back to teams list
        router.push('/teams')
      } catch (err) {
        setError('Failed to update team')
      } finally {
        setSaving(false)
      }
    }

    if (status === 'loading' || loading) {
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }

    if (!session) {
      return null // Will redirect to login
    }

    if (!team) {
      return <div className="min-h-screen flex items-center justify-center">Team not found</div>
    }

    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Edit Team</h1>
          <p className="text-gray-600 mt-2">Update your team details</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Team Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              required
              maxLength={50}
              placeholder="Enter team name"
            />
          </div>

          <div>
            <label htmlFor="formation" className="block text-sm font-medium text-gray-700 mb-2">
              Formation
            </label>
            <select
              id="formation"
              value={formation}
              onChange={(e) => setFormation(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              {formations.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving || !name.trim()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Updating...' : 'Update Team'}
            </button>

            <button
              type="button"
              onClick={() => router.push('/teams')}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    )
  }