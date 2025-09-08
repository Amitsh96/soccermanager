import { PrismaClient } from '@prisma/client'
import { execSync } from 'child_process'
import fs from 'fs'

// Create a separate Prisma client for tests
export const testDb = new PrismaClient({
  datasources: {
    db: {
      url: 'file:./test.db',
    },
  },
})

export async function setupTestDatabase() {
  // Remove existing test database if it exists
  if (fs.existsSync('./test.db')) {
    fs.unlinkSync('./test.db')
  }

  // Run migrations to create schema
  execSync('npx prisma db push', {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: 'file:./test.db',
    },
  })

  // Don't seed here - let individual tests handle their own data
}

export async function cleanupTestDatabase() {
  // Clean up all data
  await testDb.teamPlayer.deleteMany()
  await testDb.team.deleteMany()
  await testDb.user.deleteMany()
  await testDb.player.deleteMany()
}

export async function seedTestData() {
  // Create test user
  const testUser = await testDb.user.create({
    data: {
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedpassword123',
    },
  })

  // Create test players
  const testPlayers = await Promise.all([
    testDb.player.create({
      data: {
        name: 'Lionel Messi',
        position: 'RW',
        club: 'Inter Miami',
        nationality: 'Argentina',
        age: 36,
        rating: 93,
      },
    }),
    testDb.player.create({
      data: {
        name: 'Virgil van Dijk',
        position: 'CB',
        club: 'Liverpool',
        nationality: 'Netherlands',
        age: 32,
        rating: 90,
      },
    }),
  ])

  // Create test team
  const testTeam = await testDb.team.create({
    data: {
      name: 'Test Team',
      formation: '4-3-3',
      userId: testUser.id,
    },
  })

  return { testUser, testPlayers, testTeam }
}

// Cleanup function to run after all tests
export async function teardownTestDatabase() {
  await testDb.$disconnect()
  if (fs.existsSync('./test.db')) {
    fs.unlinkSync('./test.db')
  }
}
