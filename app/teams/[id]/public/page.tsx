'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { formations } from '../../../../lib/store/teamBuilderStore'

interface Player {
  id: string
  name: string
  position: string
  club: string
  rating: number
}

interface TeamPlayer {
  playerId: string
  position: string
  player: Player
}

interface Team {
  id: string
  name: string
  formation: string
  user: {
    name: string
  }
  teamPlayers: TeamPlayer[]
}

export default function PublicTeamPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const [team, setTeam] = useState<Team | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load team data on component mount
  useEffect(() => {
    loadTeam()
  }, [id])

  const loadTeam = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/teams/${id}/public`)
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Team not found')
        }
        throw new Error('Failed to load team')
      }
      const data = await response.json()
      setTeam(data.team)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load team')
    } finally {
      setLoading(false)
    }
  }

  const getFormationSlots = (formationName: string) => {
    const formation = formations[formationName] || formations['4-3-3']
    return formation.positions
  }

  const getPlayerForPosition = (position: string) => {
    return team?.teamPlayers.find(tp => tp.position === position)?.player
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading team...
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col">
        <div className="text-red-600 text-xl mb-4">{error}</div>
        <Link href="/" className="text-blue-600 hover:underline">
          Go to Home
        </Link>
      </div>
    )
  }

  if (!team) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Team not found
      </div>
    )
  }

  const slots = getFormationSlots(team.formation)

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">{team.name}</h1>
        <p className="text-lg text-gray-600 mb-1">
          Formation: {team.formation}
        </p>
        <p className="text-sm text-gray-500">Created by {team.user.name}</p>
      </div>

      {/* Formation Display */}
      <div
        style={{
          background: 'linear-gradient(to bottom, #213d21ff, #7dbb7dff)',
          borderRadius: '8px',
          padding: '32px',
          marginBottom: '32px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            height: '600px',
            width: '400px',
            position: 'relative',
            background: `
                linear-gradient(180deg,
                  #2d8f2d 0%, #2d8f2d 12.5%,
                  #1a791aff 12.5%, #1a791aff 25%,
                  #2d8f2d 25%, #2d8f2d 37.5%,
                  #1a791aff 37.5%, #1a791aff 50%,
                  #2d8f2d 50%, #2d8f2d 62.5%,
                  #1a791aff 62.5%, #1a791aff 75%,
                  #2d8f2d 75%, #2d8f2d 87.5%,
                  #1a791aff 87.5%, #1a791aff 100%
                ),
                radial-gradient(circle at 20% 30%, rgba(0,0,0,0.05) 1px, transparent 1px),
                radial-gradient(circle at 70% 60%, rgba(255,255,255,0.03) 1px, transparent 1px),
                radial-gradient(circle at 40% 80%, rgba(0,0,0,0.03) 1px, transparent 1px),
                radial-gradient(circle at 90% 20%, rgba(255,255,255,0.02) 1px, transparent 1px),
                radial-gradient(circle at 10% 90%, rgba(0,0,0,0.04) 1px, transparent 1px)
              `,
            backgroundSize:
              '50px 100%, 3px 3px, 5px 5px, 4px 4px, 6px 6px, 7px 7px',
            border: '3px solid white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)',
          }}
        >
          {/* Field markings - same as builder */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            {/* Penalty areas */}
            <div
              style={{
                position: 'absolute',
                top: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '140px',
                height: '80px',
                border: '2px solid white',
                borderTop: 'none',
              }}
            ></div>
            <div
              style={{
                position: 'absolute',
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '140px',
                height: '80px',
                border: '2px solid white',
                borderBottom: 'none',
              }}
            ></div>

            {/* Goal areas */}
            <div
              style={{
                position: 'absolute',
                top: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '40px',
                border: '2px solid white',
                borderTop: 'none',
              }}
            ></div>
            <div
              style={{
                position: 'absolute',
                bottom: '0',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '80px',
                height: '40px',
                border: '2px solid white',
                borderBottom: 'none',
              }}
            ></div>

            {/* Goals */}
            <div
              style={{
                position: 'absolute',
                top: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '40px',
                height: '8px',
                backgroundColor: 'white',
              }}
            ></div>
            <div
              style={{
                position: 'absolute',
                bottom: '-8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '40px',
                height: '8px',
                backgroundColor: 'white',
              }}
            ></div>

            {/* Center circle */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120px',
                height: '120px',
                border: '2px solid white',
                borderRadius: '50%',
              }}
            ></div>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '6px',
                height: '6px',
                background: 'white',
                borderRadius: '50%',
              }}
            ></div>

            {/* Halfway line */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '0',
                right: '0',
                height: '2px',
                background: 'white',
                zIndex: 1,
              }}
            ></div>

            {/* Penalty spots */}
            <div
              style={{
                position: 'absolute',
                top: '60px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '6px',
                height: '6px',
                background: 'white',
                borderRadius: '50%',
              }}
            ></div>
            <div
              style={{
                position: 'absolute',
                bottom: '60px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '6px',
                height: '6px',
                background: 'white',
                borderRadius: '50%',
              }}
            ></div>

            {/* Corner arcs */}
            <div
              style={{
                position: 'absolute',
                top: '-2px',
                left: '-2px',
                width: '20px',
                height: '20px',
                borderRight: '2px solid white',
                borderBottom: '2px solid white',
                borderRadius: '0 0 20px 0',
              }}
            ></div>
            <div
              style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                width: '20px',
                height: '20px',
                borderLeft: '2px solid white',
                borderBottom: '2px solid white',
                borderRadius: '0 0 0 20px',
              }}
            ></div>
            <div
              style={{
                position: 'absolute',
                bottom: '-2px',
                left: '-2px',
                width: '20px',
                height: '20px',
                borderRight: '2px solid white',
                borderTop: '2px solid white',
                borderRadius: '0 20px 0 0',
              }}
            ></div>
            <div
              style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                width: '20px',
                height: '20px',
                borderLeft: '2px solid white',
                borderTop: '2px solid white',
                borderRadius: '20px 0 0 0',
              }}
            ></div>
          </div>

          {/* Player Slots - Read Only */}
          {slots.map(slot => {
            const player = getPlayerForPosition(slot.position)
            return (
              <div
                key={slot.id}
                style={{
                  position: 'absolute',
                  left: `${slot.x}%`,
                  top: `${slot.y}%`,
                  transform: 'translate(-50%, -50%)',
                  zIndex: 10,
                }}
              >
                {player ? (
                  <div style={{ position: 'relative' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        background: '#2563eb',
                        border: '2px solid white',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                      }}
                    >
                      {player.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')
                        .slice(0, 2)}
                    </div>

                    {/* Tooltip */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '100%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        marginBottom: '8px',
                        padding: '4px 8px',
                        background: 'rgba(0,0,0,0.8)',
                        color: 'white',
                        fontSize: '12px',
                        borderRadius: '4px',
                        whiteSpace: 'nowrap',
                        opacity: 0,
                        pointerEvents: 'none',
                      }}
                      className="tooltip-text"
                    >
                      {player.name} ({player.rating})
                    </div>
                  </div>
                ) : (
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      background: '#d1d5db',
                      border: '2px dashed #9ca3af',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#6b7280',
                      fontWeight: 'bold',
                      fontSize: '10px',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
                    }}
                  >
                    {slot.position}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Team Statistics */}
      <div className="bg-white border rounded-lg p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Team Statistics</h2>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">
              {team.teamPlayers.length}/11
            </div>
            <div className="text-gray-600">Players Selected</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-600">
              {team.teamPlayers.reduce((sum, tp) => sum + tp.player.rating, 0)}
            </div>
            <div className="text-gray-600">Total Rating</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-600">
              {team.teamPlayers.length > 0
                ? Math.round(
                    team.teamPlayers.reduce(
                      (sum, tp) => sum + tp.player.rating,
                      0
                    ) / team.teamPlayers.length
                  )
                : 0}
            </div>
            <div className="text-gray-600">Average Rating</div>
          </div>
        </div>
      </div>

      {/* Player List */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Squad</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {team.teamPlayers.map(tp => (
            <div key={tp.player.id} className="border rounded-lg p-4">
              <div className="font-bold text-lg">{tp.player.name}</div>
              <div className="text-gray-600">{tp.player.club}</div>
              <div className="flex justify-between items-center mt-2">
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  {tp.position}
                </span>
                <span className="font-bold text-lg text-blue-600">
                  {tp.player.rating}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS for hover effects */}
      <style jsx>{`
        .player-slot:hover .tooltip-text {
          opacity: 1;
        }
      `}</style>
    </div>
  )
}
