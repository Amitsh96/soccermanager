import { NextRequest, NextResponse } from 'next/server'
  import { getServerSession } from 'next-auth'
  import { z } from 'zod'
  import { PrismaClient } from '@prisma/client'

  const prisma = new PrismaClient()

  const createTeamSchema = z.object({
    name: z.string().min(1, 'Team name is required').max(50, 'Team name too long'),
    formation: z.string().optional().default('4-3-3'),
  })

  // GET /api/teams - List user's teams
  export async function GET(request: NextRequest) {
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

      const teams = await prisma.team.findMany({
        where: { userId: user.id },
        include: {
          teamPlayers: {
            include: {
              player: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({ teams })
    } catch (error) {
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      )
    }
  }

  // POST /api/teams - Create new team
  export async function POST(request: NextRequest) {
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

      const body = await request.json()
      const { name, formation } = createTeamSchema.parse(body)

      const team = await prisma.team.create({
        data: {
          name,
          formation,
          userId: user.id,
        },
        include: {
          teamPlayers: {
            include: {
              player: true
            }
          }
        }
      })

      return NextResponse.json({ team }, { status: 201 })
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