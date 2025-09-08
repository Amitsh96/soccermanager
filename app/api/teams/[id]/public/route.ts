import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const paramsSchema = z.object({
  id: z.string().min(1),
})

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Validate the team ID parameter
    const resolvedParams = await params
    const { id } = paramsSchema.parse(resolvedParams)

    // Fetch team with all related data (no auth check needed for public view)
    const team = await prisma.team.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
          },
        },
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

    // Return team data in a format suitable for public viewing
    return NextResponse.json({
      team: {
        id: team.id,
        name: team.name,
        formation: team.formation,
        createdAt: team.createdAt,
        user: {
          name: team.user.name,
        },
        teamPlayers: team.teamPlayers.map(tp => ({
          playerId: tp.playerId,
          position: tp.position,
          player: {
            id: tp.player.id,
            name: tp.player.name,
            position: tp.player.position,
            club: tp.player.club,
            nationality: tp.player.nationality,
            rating: tp.player.rating,
          },
        })),
      },
    })
  } catch (error) {
    console.error('Error fetching public team:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
