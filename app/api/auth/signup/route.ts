import { NextRequest, NextResponse } from 'next/server'
  import bcrypt from 'bcryptjs'
  import { z } from 'zod'
  import { PrismaClient } from '@prisma/client'

  const prisma = new PrismaClient()

  const signupSchema = z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    name: z.string().min(1, 'Name is required'),
  })

  export async function POST(request: NextRequest) {
    try {
      const body = await request.json()
      const { email, password, name } = signupSchema.parse(body)

      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 400 }
        )
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)

      // Create user
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
        }
      })

      return NextResponse.json(
        { message: 'User created successfully', userId: user.id },
        { status: 201 }
      )
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