import { NextRequest, NextResponse } from 'next/server'
  import { getServerSession } from 'next-auth'
  import { z } from 'zod'
  import { PrismaClient } from '@prisma/client'

  const prisma = new PrismaClient()

  const updateTeamSchema = z.object({
    name: z.string().min(1, 'Team name is required').max(50, 'Team name too long'),
    formation: z.string().optional(),
  })

  // GET /api/teams/[id] - Get specific team
  export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const session = await getServerSession()

      if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      const team = await prisma.team.findFirst({
        where: {
          id: params.id,
          userId: user.id // Ensure user owns this team
        },
        include: {
          teamPlayers: {
            include: {
              player: true
            }
          }
        }
      })

      if (!team) {
        return NextResponse.json({ error: 'Team not found' }, { status: 404 })
      }

      return NextResponse.json({ team })
    } catch (error) {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }

  // PUT /api/teams/[id] - Update team
  export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const session = await getServerSession()

      if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      // Check if team exists and user owns it
      const existingTeam = await prisma.team.findFirst({
        where: {
          id: params.id,
          userId: user.id
        }
      })

      if (!existingTeam) {
        return NextResponse.json({ error: 'Team not found' }, { status: 404 })
      }

      const body = await request.json()
      const { name, formation } = updateTeamSchema.parse(body)

      const team = await prisma.team.update({
        where: { id: params.id },
        data: { name, formation },
        include: {
          teamPlayers: {
            include: {
              player: true
            }
          }
        }
      })

      return NextResponse.json({ team })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: 'Validation failed', details: error.issues },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }

  // DELETE /api/teams/[id] - Delete team
  export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
  ) {
    try {
      const session = await getServerSession()

      if (!session?.user?.email) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      })

      if (!user) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      // Check if team exists and user owns it
      const existingTeam = await prisma.team.findFirst({
        where: {
          id: params.id,
          userId: user.id
        }
      })

      if (!existingTeam) {
        return NextResponse.json({ error: 'Team not found' }, { status: 404 })
      }

      // Delete team (cascade will delete teamPlayers)
      await prisma.team.delete({
        where: { id: params.id }
      })

      return NextResponse.json({ message: 'Team deleted successfully' })
    } catch (error) {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }