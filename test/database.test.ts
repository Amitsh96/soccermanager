import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import {
  setupTestDatabase,
  cleanupTestDatabase,
  testDb,
  teardownTestDatabase,
} from './db-utils'

describe('Database Operations', () => {
  beforeAll(async () => {
    await setupTestDatabase()
  })

  afterAll(async () => {
    await teardownTestDatabase()
  })

  beforeEach(async () => {
    await cleanupTestDatabase()
    // Re-seed fresh data for each test
    await testDb.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedpassword123',
      },
    })
  })

  it('should create and retrieve a user', async () => {
    const user = await testDb.user.findFirst({
      where: { email: 'test@example.com' },
    })

    expect(user).toBeDefined()
    expect(user?.name).toBe('Test User')
    expect(user?.email).toBe('test@example.com')
  })

  it('should create players with all required fields', async () => {
    const player = await testDb.player.create({
      data: {
        name: 'Cristiano Ronaldo',
        position: 'ST',
        club: 'Al Nassr',
        nationality: 'Portugal',
        age: 39,
        rating: 91,
      },
    })

    expect(player.name).toBe('Cristiano Ronaldo')
    expect(player.position).toBe('ST')
    expect(player.age).toBe(39)
    expect(player.rating).toBe(91)
  })

  it('should create team with user relationship', async () => {
    const user = await testDb.user.findFirst()
    expect(user).toBeDefined()

    const team = await testDb.team.create({
      data: {
        name: 'Barcelona',
        formation: '4-3-3',
        userId: user!.id,
      },
      include: {
        user: true,
      },
    })

    expect(team.name).toBe('Barcelona')
    expect(team.formation).toBe('4-3-3')
    expect(team.user.email).toBe('test@example.com')
  })

  it('should handle team-player relationships', async () => {
    // Create user, team, and player
    const user = await testDb.user.findFirst()
    const team = await testDb.team.create({
      data: {
        name: 'Real Madrid',
        formation: '4-4-2',
        userId: user!.id,
      },
    })

    const player = await testDb.player.create({
      data: {
        name: 'Karim Benzema',
        position: 'ST',
        club: 'Al-Ittihad',
        nationality: 'France',
        age: 36,
        rating: 89,
      },
    })

    // Create team-player relationship
    const teamPlayer = await testDb.teamPlayer.create({
      data: {
        teamId: team.id,
        playerId: player.id,
        position: 'ST',
      },
      include: {
        player: true,
        team: true,
      },
    })

    expect(teamPlayer.position).toBe('ST')
    expect(teamPlayer.player.name).toBe('Karim Benzema')
    expect(teamPlayer.team.name).toBe('Real Madrid')
  })
})
