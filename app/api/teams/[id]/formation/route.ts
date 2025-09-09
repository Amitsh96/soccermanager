import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '../../../../../lib/prisma'

interface TeamPlayer {
  id: string
  position: string
  player: {
    id: string
    name: string
    position: string
    club: string
    rating: number
  }
}

interface SaveFormationData {
  formation: string
  players: Array<{
    playerId: string
    position: string
  }>
}

// GET /api/teams/[id]/formation - Get team formation
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    // Get team with players
    const team = await prisma.team.findFirst({
      where: {
        id: id,
        user: {
          email: session.user.email,
        },
      },
      include: {
        teamPlayers: {
          include: {
            player: true,
          },
        },
      },
    })

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    // Format the response to match your frontend structure
    const formation = {
      teamId: team.id,
      formation: team.formation,
      players: team.teamPlayers.map((tp: TeamPlayer) => ({
        slotId: tp.position, // Position is now the unique slot ID
        position: tp.position,
        playerId: tp.player.id,
        player: {
          id: tp.player.id,
          name: tp.player.name,
          position: tp.player.position,
          club: tp.player.club,
          rating: tp.player.rating,
        },
      })),
    }

    return NextResponse.json({ formation })
  } catch (error) {
    console.error('Formation GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/teams/[id]/formation - Save team formation
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authentication check
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body: SaveFormationData = await request.json()
    const { formation, players } = body

    // Debug logging
    console.log('Formation save attempt:', {
      teamId: id,
      formation,
      playersCount: players.length,
      players: players.map(p => ({ playerId: p.playerId, position: p.position }))
    })

    // Validate required fields
    if (!formation || !players || !Array.isArray(players)) {
      return NextResponse.json(
        {
          error: 'Formation and players array are required',
        },
        { status: 400 }
      )
    }

    // Validate player count (must be exactly 11)
    if (players.length !== 11) {
      return NextResponse.json(
        {
          error: 'Team must have exactly 11 players',
        },
        { status: 400 }
      )
    }

    // Validate each player has required fields
    for (const player of players) {
      if (!player.playerId || !player.position) {
        return NextResponse.json(
          {
            error: 'Each player must have playerId and position',
          },
          { status: 400 }
        )
      }
    }

    // Check for duplicate players
    const playerIds = players.map(p => p.playerId)
    const uniquePlayerIds = new Set(playerIds)
    if (playerIds.length !== uniquePlayerIds.size) {
      console.log('Duplicate player IDs found:', playerIds)
      return NextResponse.json(
        {
          error: 'Duplicate players detected - each player can only be assigned once',
        },
        { status: 400 }
      )
    }

    // Check for duplicate positions
    const positions = players.map(p => p.position)
    const uniquePositions = new Set(positions)
    if (positions.length !== uniquePositions.size) {
      console.log('Duplicate positions found:', positions)
      return NextResponse.json(
        {
          error: 'Duplicate positions detected - each position can only have one player',
        },
        { status: 400 }
      )
    }

    // Verify team belongs to user
    const team = await prisma.team.findFirst({
      where: {
        id: id,
        user: {
          email: session.user.email,
        },
      },
    })

    if (!team) {
      return NextResponse.json({ error: 'Team not found' }, { status: 404 })
    }

    // Use transaction to ensure data consistency
    await prisma.$transaction(async tx => {
      // Update team formation
      await tx.team.update({
        where: { id: id },
        data: { formation },
      })

      // Clear existing team players
      await tx.teamPlayer.deleteMany({
        where: { teamId: id },
      })

      // Add new team players
      await tx.teamPlayer.createMany({
        data: players.map(player => ({
          teamId: id,
          playerId: player.playerId,
          position: player.position,
        })),
      })
    })

    return NextResponse.json({
      success: true,
      message: 'Team formation saved successfully',
    })
  } catch (error) {
    console.error('Formation PUT error:', error)

    // Handle unique constraint violations
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      error.code === 'P2002'
    ) {
      return NextResponse.json(
        {
          error: 'Invalid formation: duplicate player or position',
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
