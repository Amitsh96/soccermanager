import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'
import { authOptions } from '../../../lib/auth'

const prisma = new PrismaClient()

const createTeamSchema = z.object({
  name: z
    .string()
    .min(1, 'Team name is required')
    .max(50, 'Team name too long'),
  formation: z.string().optional().default('4-3-3'),
})

// GET /api/teams - List user's teams
export async function GET(request: NextRequest) {
  try {
    console.log('Teams API GET called')
    const session = await getServerSession(authOptions)

    console.log('Session:', session)

    if (!session?.user?.email) {
      console.log('No session found, returning unauthorized')
      return NextResponse.json({ error: 'Please sign in to view your teams' }, { status: 401 })
    }

    console.log('Looking for user with email:', session.user.email)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      console.log('User not found in database:', session.user.email)
      // Let's also check what users exist
      const allUsers = await prisma.user.findMany({ select: { id: true, email: true } })
      console.log('All users in database:', allUsers)
      return NextResponse.json({ error: 'User account not found. Please try signing out and back in.' }, { status: 404 })
    }

    console.log('Found user:', user.id, user.email)
    console.log('Fetching teams for user:', user.id)
    
    const teams = await prisma.team.findMany({
      where: { userId: user.id },
      include: {
        teamPlayers: {
          include: {
            player: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    console.log('Found teams:', teams.length)
    return NextResponse.json({ teams })
  } catch (error) {
    console.error('Teams API GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/teams - Create new team
export async function POST(request: NextRequest) {
  try {
    console.log('Teams API POST called')
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      console.log('No session found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    })

    if (!user) {
      console.log('User not found')
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    console.log('Team creation request:', body)
    
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
            player: true,
          },
        },
      },
    })

    console.log('Team created:', team.id)
    return NextResponse.json({ team }, { status: 201 })
  } catch (error) {
    console.error('Teams API POST error:', error)
    
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