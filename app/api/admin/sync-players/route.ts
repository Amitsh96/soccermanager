import { prisma } from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { apiFootball } from '@/lib/api-football'
import { z } from 'zod'

const syncRequestSchema = z.object({
  playerId: z.string().optional(),
  forceSync: z.boolean().default(false),
})

export async function POST(request: NextRequest) {
  try {
    // Check authentication (basic protection)
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse request body
    const body = await request.json().catch(() => ({}))
    const { playerId, forceSync } = syncRequestSchema.parse(body)

    console.log('Starting player sync...', { playerId, forceSync })

    let result

    if (playerId) {
      // Sync specific player
      const success = await apiFootball.syncPlayerData(playerId)
      result = {
        type: 'single',
        playerId,
        success,
        message: success
          ? 'Player synced successfully'
          : 'Failed to sync player - check if player exists or API is available',
      }
    } else {
      // Sync all players
      const syncResult = await apiFootball.syncAllPlayers()
      result = {
        ...syncResult,
        type: 'bulk',
        message: `Sync completed: ${syncResult.success} successful, ${syncResult.failed} failed out of ${syncResult.total} players`,
      }
    }

    console.log('Sync result:', result)

    return NextResponse.json({
      success: true,
      result,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Sync error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request format', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

// Get sync status/history
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')

    // Get players with sync information
    const players = await prisma.player.findMany({
      select: {
        id: true,
        name: true,
        club: true,
        apiFootballId: true,
        lastSyncAt: true,
        photoUrl: true,
      },
      orderBy: {
        lastSyncAt: { sort: 'desc', nulls: 'last' },
      },
      take: Math.min(limit, 100), // Max 100 players
    })

    const stats = {
      totalPlayers: await prisma.player.count(),
      syncedPlayers: await prisma.player.count({
        where: { apiFootballId: { not: null } },
      }),
      recentSyncs: await prisma.player.count({
        where: {
          lastSyncAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      }),
    }

    return NextResponse.json({
      players,
      stats,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching sync status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch sync status' },
      { status: 500 }
    )
  }
}
