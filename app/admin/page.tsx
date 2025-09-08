'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface SyncStats {
  totalPlayers: number
  syncedPlayers: number
  recentSyncs: number
}

interface SyncResult {
  success: boolean
  result: {
    type: 'single' | 'bulk'
    success?: number
    failed?: number
    total?: number
    message: string
  }
  timestamp: string
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [stats, setStats] = useState<SyncStats | null>(null)
  const [loading, setLoading] = useState(false)
  const [syncResult, setSyncResult] = useState<SyncResult | null>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  // Load sync statistics
  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await fetch('/api/admin/sync-players')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
      }
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const handleSyncAll = async () => {
    if (
      !confirm(
        'This will sync all players with API-Football. This may take several minutes and consume API requests. Continue?'
      )
    ) {
      return
    }

    setLoading(true)
    setSyncResult(null)

    try {
      const response = await fetch('/api/admin/sync-players', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })

      if (response.ok) {
        const result = await response.json()
        setSyncResult(result)
        await loadStats() // Refresh stats
      } else {
        const error = await response.json()
        setSyncResult({
          success: false,
          result: {
            type: 'bulk',
            message: error.message || 'Sync failed',
          },
          timestamp: new Date().toISOString(),
        })
      }
    } catch (error) {
      setSyncResult({
        success: false,
        result: {
          type: 'bulk',
          message: 'Network error occurred',
        },
        timestamp: new Date().toISOString(),
      })
    } finally {
      setLoading(false)
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
    return null // Will redirect
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
        <p className="text-gray-600">
          Manage player data synchronization with API-Football
        </p>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Total Players
          </h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats?.totalPlayers || 0}
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Synced Players
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {stats?.syncedPlayers || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {stats && stats.totalPlayers > 0
              ? Math.round((stats.syncedPlayers / stats.totalPlayers) * 100)
              : 0}
            % coverage
          </p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Recent Syncs
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {stats?.recentSyncs || 0}
          </p>
          <p className="text-sm text-gray-500 mt-1">Last 24 hours</p>
        </div>
      </div>

      {/* Sync Controls */}
      <div className="bg-white rounded-lg p-6 shadow-sm border mb-8">
        <h2 className="text-xl font-bold mb-4">Player Data Sync</h2>

        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleSyncAll}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex
  items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Syncing...
              </>
            ) : (
              'Sync All Players'
            )}
          </button>

          <button
            onClick={loadStats}
            className="bg-gray-500 text-white px-4 py-3 rounded-lg hover:bg-gray-600"
          >
            Refresh Stats
          </button>
        </div>

        <div className="text-sm text-gray-600">
          <p>• This will fetch photos and metadata from API-Football</p>
          <p>• Only players without recent sync data will be updated</p>
          <p>• Rate limited to 1 request per second (free tier)</p>
        </div>
      </div>

      {/* Sync Results */}
      {syncResult && (
        <div
          className={`rounded-lg p-6 shadow-sm border ${
            syncResult.success
              ? 'bg-green-50 border-green-200'
              : 'bg-red-50 border-red-200'
          }`}
        >
          <h3
            className={`font-bold mb-2 ${
              syncResult.success ? 'text-green-800' : 'text-red-800'
            }`}
          >
            Sync {syncResult.success ? 'Completed' : 'Failed'}
          </h3>

          <p
            className={`mb-2 ${
              syncResult.success ? 'text-green-700' : 'text-red-700'
            }`}
          >
            {syncResult.result.message}
          </p>

          {syncResult.result.type === 'bulk' && syncResult.success && (
            <div className="text-sm text-green-600">
              <p>✅ Success: {syncResult.result.success}</p>
              <p>❌ Failed: {syncResult.result.failed}</p>
              <p>📊 Total: {syncResult.result.total}</p>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-2">
            {new Date(syncResult.timestamp).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  )
}
