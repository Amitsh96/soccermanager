import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const playersQuerySchema = z.object({
  page: z.string().optional().default('1'),
  limit: z.string().optional().default('12'),
  search: z.string().optional(),
  position: z.string().optional(),
  club: z.string().optional(),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = playersQuerySchema.parse({
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '12',
      search: searchParams.get('search') || undefined,
      position: searchParams.get('position') || undefined,
      club: searchParams.get('club') || undefined,
    })

    const page = parseInt(query.page)
    const limit = parseInt(query.limit)
    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {}

    if (query.search) {
      where.name = {
        contains: query.search,
        mode: 'insensitive',
      }
    }

    if (query.club) {
      where.club = {
        contains: query.club,
        mode: 'insensitive',
      }
    }

    if (query.position) {
      where.position = query.position
    }

    // Get players with pagination
    const [players, totalCount] = await Promise.all([
      prisma.player.findMany({
        where,
        skip,
        take: limit,
        orderBy: { rating: 'desc' },
      }),
      prisma.player.count({ where }),
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      players,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNext: page < totalPages,
        hasPrevious: page > 1,
      },
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
